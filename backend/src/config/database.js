import pg from 'pg';
import logger from '../utils/logger.js';

const { Pool } = pg;

// Parse database URL from Supabase
const parseSupabaseUrl = (url) => {
  if (!url) {
    throw new Error('SUPABASE_URL is required for database connection');
  }
  
  // If we have a direct DATABASE_URL, use that instead
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  
  // Extract project ID from Supabase URL
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error('Invalid SUPABASE_URL format');
  }
  
  const projectId = match[1];
  const dbHost = `db.${projectId}.supabase.co`;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!dbPassword) {
    throw new Error('SUPABASE_DB_PASSWORD or SUPABASE_SERVICE_ROLE_KEY is required');
  }
  
  // Force IPv4 to avoid IPv6 issues
  return {
    host: dbHost,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: { rejectUnauthorized: false },
    // Force IPv4
    stream: (socket) => {
      socket.setNoDelay(true);
      socket.setKeepAlive(true, 30000);
      return socket;
    }
  };
};

// Production-ready pool configuration
const poolConfig = {
  // Connection settings from Supabase
  ...(process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : parseSupabaseUrl(process.env.SUPABASE_URL)
  ),
  
  // Pool settings
  max: parseInt(process.env.DB_POOL_MAX) || 20, // Maximum number of clients in pool
  min: parseInt(process.env.DB_POOL_MIN) || 2,  // Minimum number of clients in pool
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000, // 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000, // 10 seconds
  
  // Statement timeout to prevent long-running queries
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000, // 30 seconds
  
  // Query timeout
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000, // 30 seconds
  
  // Application name for debugging
  application_name: process.env.APP_NAME || 'pedro-backend',
  
  // Keep alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
};

// Create the pool
const pool = new Pool(poolConfig);

// Pool event handlers
pool.on('connect', (client) => {
  logger.debug('Database: New client connected to pool');
  
  // Set runtime parameters for each new connection
  client.query('SET statement_timeout = $1', [poolConfig.statement_timeout])
    .catch(err => logger.error('Database: Error setting statement timeout:', err));
});

pool.on('acquire', (client) => {
  logger.debug('Database: Client acquired from pool');
});

pool.on('error', (err, client) => {
  logger.error('Database: Unexpected error on idle client:', err);
});

pool.on('remove', (client) => {
  logger.debug('Database: Client removed from pool');
});

// Connection management functions
export const connectDatabase = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    logger.info('Database: Connection pool established successfully');
    logger.info(`Database: Server time: ${result.rows[0].now}`);
    
    return pool;
  } catch (error) {
    logger.error('Database: Failed to establish connection pool:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await pool.end();
    logger.info('Database: Connection pool closed gracefully');
  } catch (error) {
    logger.error('Database: Error closing connection pool:', error);
    throw error;
  }
};

// Health check function
export const checkDatabaseHealth = async () => {
  try {
    const startTime = Date.now();
    const client = await pool.connect();
    
    try {
      await client.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      const poolStats = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
      };
      
      return {
        healthy: true,
        message: 'Database is healthy',
        responseTime: `${responseTime}ms`,
        pool: poolStats
      };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      healthy: false,
      message: 'Database health check failed',
      error: error.message
    };
  }
};

// Query helper with automatic client management
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Database query executed', {
      text: text.substring(0, 100), // Log first 100 chars of query
      duration: `${duration}ms`,
      rows: result.rowCount
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Database query error', {
      text: text.substring(0, 100),
      duration: `${duration}ms`,
      error: error.message
    });
    throw error;
  }
};

// Transaction helper
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Prepared statement helper
export const prepare = async (name, text, values) => {
  try {
    const result = await pool.query({
      name,
      text,
      values
    });
    return result;
  } catch (error) {
    logger.error('Database prepared statement error:', error);
    throw error;
  }
};

// Batch insert helper
export const batchInsert = async (table, columns, values) => {
  if (!values || values.length === 0) {
    return { rowCount: 0 };
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Build parameterized query
    const placeholders = values.map((_, groupIndex) => 
      `(${columns.map((_, colIndex) => 
        `$${groupIndex * columns.length + colIndex + 1}`
      ).join(', ')})`
    ).join(', ');
    
    const text = `
      INSERT INTO ${table} (${columns.join(', ')}) 
      VALUES ${placeholders}
      RETURNING *
    `;
    
    // Flatten values array
    const flatValues = values.flat();
    
    const result = await client.query(text, flatValues);
    await client.query('COMMIT');
    
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Database batch insert error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Connection pool stats
export const getPoolStats = () => ({
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount,
  maxCount: poolConfig.max,
  minCount: poolConfig.min
});

export default pool;