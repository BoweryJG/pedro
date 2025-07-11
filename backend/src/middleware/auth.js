import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// User roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STAFF: 'staff',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  API_CLIENT: 'api_client'
};

// Permission levels for different roles
const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'], // All permissions
  [ROLES.ADMIN]: [
    'read:*',
    'write:*',
    'delete:appointments',
    'delete:patients',
    'manage:staff',
    'manage:settings',
    'view:analytics',
    'manage:billing'
  ],
  [ROLES.DOCTOR]: [
    'read:patients',
    'write:patients',
    'read:appointments',
    'write:appointments',
    'read:medical_records',
    'write:medical_records',
    'manage:voice_calls',
    'view:analytics'
  ],
  [ROLES.STAFF]: [
    'read:patients',
    'write:patients',
    'read:appointments',
    'write:appointments',
    'manage:sms',
    'manage:voice_calls',
    'read:billing'
  ],
  [ROLES.PATIENT]: [
    'read:own_data',
    'write:own_data',
    'read:own_appointments',
    'write:own_appointments',
    'read:own_billing'
  ],
  [ROLES.API_CLIENT]: [
    'read:public_data',
    'webhook:receive'
  ]
};

// Helper function to check if user has permission
const hasPermission = (userRole, requiredPermission) => {
  const rolePermissions = PERMISSIONS[userRole] || [];
  
  // Super admin has all permissions
  if (rolePermissions.includes('*')) return true;
  
  // Check for exact permission match
  if (rolePermissions.includes(requiredPermission)) return true;
  
  // Check for wildcard permissions (e.g., 'read:*' matches 'read:patients')
  const [action, resource] = requiredPermission.split(':');
  if (rolePermissions.includes(`${action}:*`)) return true;
  if (rolePermissions.includes(`*:${resource}`)) return true;
  
  return false;
};

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    clinicId: user.clinic_id,
    permissions: PERMISSIONS[user.role] || []
  };
  
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'pedro-dental-api',
    audience: 'pedro-dental-clients'
  });
  
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
  
  return { token, refreshToken };
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'pedro-dental-api',
      audience: 'pedro-dental-clients'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Basic authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No authorization header provided',
        code: 'AUTH_HEADER_MISSING' 
      });
    }
    
    // Extract token
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ 
        error: 'Invalid authorization format. Use: Bearer <token>',
        code: 'AUTH_FORMAT_INVALID' 
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists and is active
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_active, clinic_id')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      });
    }
    
    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'User account is deactivated',
        code: 'USER_DEACTIVATED' 
      });
    }
    
    // Attach user to request
    req.user = {
      ...user,
      permissions: PERMISSIONS[user.role] || []
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED' 
    });
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }
    
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
        required: permission,
        role: req.user.role
      });
    }
    
    next();
  };
};

// API key authentication for webhooks and external services
export const authenticateAPIKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        code: 'API_KEY_MISSING' 
      });
    }
    
    // Verify API key in database
    const { data: apiClient, error } = await supabase
      .from('api_keys')
      .select('id, name, permissions, is_active, rate_limit')
      .eq('key_hash', hashAPIKey(apiKey))
      .single();
    
    if (error || !apiClient) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        code: 'API_KEY_INVALID' 
      });
    }
    
    if (!apiClient.is_active) {
      return res.status(401).json({ 
        error: 'API key is deactivated',
        code: 'API_KEY_DEACTIVATED' 
      });
    }
    
    // Log API key usage
    await supabase
      .from('api_key_usage')
      .insert({
        api_key_id: apiClient.id,
        endpoint: req.path,
        method: req.method,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        created_at: new Date().toISOString()
      });
    
    // Attach API client to request
    req.apiClient = apiClient;
    req.user = {
      id: apiClient.id,
      role: ROLES.API_CLIENT,
      permissions: apiClient.permissions || PERMISSIONS[ROLES.API_CLIENT]
    };
    
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED' 
    });
  }
};

// Combined authentication middleware (JWT or API key)
export const authenticateFlexible = async (req, res, next) => {
  // Check for API key first
  if (req.headers['x-api-key'] || req.query.api_key) {
    return authenticateAPIKey(req, res, next);
  }
  
  // Fall back to JWT authentication
  return authenticate(req, res, next);
};

// Resource ownership verification middleware
export const verifyResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }
    
    // Super admins and admins can access all resources
    if ([ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)) {
      return next();
    }
    
    const resourceId = req.params.id || req.params[`${resourceType}Id`];
    if (!resourceId) {
      return res.status(400).json({ 
        error: 'Resource ID required',
        code: 'RESOURCE_ID_MISSING' 
      });
    }
    
    try {
      let isOwner = false;
      
      switch (resourceType) {
        case 'patient':
          if (req.user.role === ROLES.PATIENT) {
            // Patients can only access their own data
            isOwner = req.user.id === resourceId;
          } else if ([ROLES.DOCTOR, ROLES.STAFF].includes(req.user.role)) {
            // Doctors and staff can access patients in their clinic
            const { data } = await supabase
              .from('patients')
              .select('clinic_id')
              .eq('id', resourceId)
              .single();
            isOwner = data && data.clinic_id === req.user.clinic_id;
          }
          break;
          
        case 'appointment':
          if (req.user.role === ROLES.PATIENT) {
            // Check if patient owns the appointment
            const { data } = await supabase
              .from('appointments')
              .select('patient_id')
              .eq('id', resourceId)
              .single();
            isOwner = data && data.patient_id === req.user.id;
          } else if ([ROLES.DOCTOR, ROLES.STAFF].includes(req.user.role)) {
            // Check if appointment belongs to their clinic
            const { data } = await supabase
              .from('appointments')
              .select('clinic_id')
              .eq('id', resourceId)
              .single();
            isOwner = data && data.clinic_id === req.user.clinic_id;
          }
          break;
          
        case 'billing':
          if (req.user.role === ROLES.PATIENT) {
            // Check if billing record belongs to patient
            const { data } = await supabase
              .from('billing_records')
              .select('patient_id')
              .eq('id', resourceId)
              .single();
            isOwner = data && data.patient_id === req.user.id;
          } else {
            // Staff and doctors can access billing in their clinic
            const { data } = await supabase
              .from('billing_records')
              .select('clinic_id')
              .eq('id', resourceId)
              .single();
            isOwner = data && data.clinic_id === req.user.clinic_id;
          }
          break;
      }
      
      if (!isOwner) {
        return res.status(403).json({ 
          error: 'Access denied to this resource',
          code: 'RESOURCE_ACCESS_DENIED',
          resource: resourceType,
          id: resourceId
        });
      }
      
      next();
    } catch (error) {
      console.error('Resource ownership verification error:', error);
      return res.status(500).json({ 
        error: 'Failed to verify resource ownership',
        code: 'OWNERSHIP_CHECK_FAILED' 
      });
    }
  };
};

// Rate limiting by user role
export const getRateLimitByRole = (role) => {
  const limits = {
    [ROLES.SUPER_ADMIN]: { windowMs: 15 * 60 * 1000, max: 1000 },
    [ROLES.ADMIN]: { windowMs: 15 * 60 * 1000, max: 500 },
    [ROLES.DOCTOR]: { windowMs: 15 * 60 * 1000, max: 300 },
    [ROLES.STAFF]: { windowMs: 15 * 60 * 1000, max: 300 },
    [ROLES.PATIENT]: { windowMs: 15 * 60 * 1000, max: 100 },
    [ROLES.API_CLIENT]: { windowMs: 15 * 60 * 1000, max: 200 }
  };
  
  return limits[role] || { windowMs: 15 * 60 * 1000, max: 50 };
};

// Hash API key for storage
const hashAPIKey = (apiKey) => {
  return bcrypt.hashSync(apiKey, 10);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long` };
  }
  
  if (!hasUpperCase || !hasLowerCase) {
    return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
  }
  
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!hasSpecialChar) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// Hash password
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Audit log middleware
export const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = async function(data) {
      // Log the action after response is sent
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await supabase
            .from('audit_logs')
            .insert({
              user_id: req.user?.id,
              action,
              resource_type: req.params.resourceType || 'unknown',
              resource_id: req.params.id,
              ip_address: req.ip,
              user_agent: req.headers['user-agent'],
              request_method: req.method,
              request_path: req.path,
              response_status: res.statusCode,
              metadata: {
                body: req.body,
                query: req.query,
                params: req.params
              },
              created_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Audit log error:', error);
        }
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

export default {
  authenticate,
  authorize,
  requirePermission,
  authenticateAPIKey,
  authenticateFlexible,
  verifyResourceOwnership,
  generateToken,
  verifyToken,
  validatePassword,
  hashPassword,
  comparePassword,
  auditLog,
  ROLES
};