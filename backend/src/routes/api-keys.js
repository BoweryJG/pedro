import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  authenticate,
  authorize,
  hashPassword,
  ROLES
} from '../middleware/auth.js';
import { body, param, validationResult } from 'express-validator';
import { preventSQLInjection, preventNoSQLInjection } from '../middleware/validation.js';

dotenv.config();

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate a secure API key
const generateAPIKey = () => {
  const prefix = 'sk_live_'; // or 'sk_test_' for test keys
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}${randomBytes}`;
};

// Validation for creating API key
const validateCreateAPIKey = [
  body('name')
    .exists().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters')
    .trim()
    .escape(),
  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array'),
  body('rate_limit')
    .optional()
    .isInt({ min: 1, max: 10000 }).withMessage('Rate limit must be between 1 and 10000'),
  body('expires_at')
    .optional()
    .isISO8601().withMessage('Expiry date must be a valid ISO8601 date')
];

// Create new API key
router.post('/create', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), validateCreateAPIKey, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { name, permissions, rate_limit, expires_at } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'API key name is required',
        code: 'NAME_REQUIRED'
      });
    }
    
    // Generate new API key
    const apiKey = generateAPIKey();
    const keyHash = await hashPassword(apiKey);
    
    // Create API key record
    const { data: apiKeyRecord, error } = await supabase
      .from('api_keys')
      .insert({
        name,
        key_hash: keyHash,
        key_prefix: apiKey.substring(0, 12) + '...', // Store prefix for identification
        permissions: permissions || ['read:public_data', 'webhook:receive'],
        rate_limit: rate_limit || 200,
        expires_at: expires_at || null,
        is_active: true,
        created_by: req.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('API key creation error:', error);
      return res.status(500).json({
        error: 'Failed to create API key',
        code: 'API_KEY_CREATION_FAILED'
      });
    }
    
    res.status(201).json({
      success: true,
      apiKey: apiKey, // Only shown once
      apiKeyInfo: {
        id: apiKeyRecord.id,
        name: apiKeyRecord.name,
        prefix: apiKeyRecord.key_prefix,
        permissions: apiKeyRecord.permissions,
        rate_limit: apiKeyRecord.rate_limit,
        expires_at: apiKeyRecord.expires_at,
        created_at: apiKeyRecord.created_at
      },
      warning: 'Store this API key securely. It will not be shown again.'
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      error: 'Failed to create API key',
      code: 'API_KEY_CREATION_FAILED'
    });
  }
});

// List API keys
router.get('/list', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const { data: apiKeys, error, count } = await supabase
      .from('api_keys')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('List API keys error:', error);
      return res.status(500).json({
        error: 'Failed to list API keys',
        code: 'API_KEY_LIST_FAILED'
      });
    }
    
    // Don't expose the key hash
    const sanitizedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      prefix: key.key_prefix,
      permissions: key.permissions,
      rate_limit: key.rate_limit,
      is_active: key.is_active,
      expires_at: key.expires_at,
      created_by: key.created_by,
      created_at: key.created_at,
      last_used_at: key.last_used_at,
      usage_count: key.usage_count || 0
    }));
    
    res.json({
      success: true,
      apiKeys: sanitizedKeys,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('List API keys error:', error);
    res.status(500).json({
      error: 'Failed to list API keys',
      code: 'API_KEY_LIST_FAILED'
    });
  }
});

// Get API key details
router.get('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get API key
    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !apiKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }
    
    // Get usage statistics
    const { data: usageStats, error: usageError } = await supabase
      .from('api_key_usage')
      .select('endpoint, method, created_at')
      .eq('api_key_id', id)
      .order('created_at', { ascending: false })
      .limit(100);
    
    // Calculate usage by endpoint
    const usageByEndpoint = {};
    if (usageStats) {
      usageStats.forEach(usage => {
        const key = `${usage.method} ${usage.endpoint}`;
        usageByEndpoint[key] = (usageByEndpoint[key] || 0) + 1;
      });
    }
    
    res.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        prefix: apiKey.key_prefix,
        permissions: apiKey.permissions,
        rate_limit: apiKey.rate_limit,
        is_active: apiKey.is_active,
        expires_at: apiKey.expires_at,
        created_by: apiKey.created_by,
        created_at: apiKey.created_at,
        last_used_at: apiKey.last_used_at,
        usage_count: apiKey.usage_count || 0
      },
      usage: {
        recentRequests: usageStats?.slice(0, 10) || [],
        byEndpoint: usageByEndpoint,
        totalRequests: apiKey.usage_count || 0
      }
    });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({
      error: 'Failed to get API key details',
      code: 'API_KEY_FETCH_FAILED'
    });
  }
});

// Update API key
router.put('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, rate_limit, is_active, expires_at } = req.body;
    
    // Build update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (permissions !== undefined) updates.permissions = permissions;
    if (rate_limit !== undefined) updates.rate_limit = rate_limit;
    if (is_active !== undefined) updates.is_active = is_active;
    if (expires_at !== undefined) updates.expires_at = expires_at;
    
    updates.updated_at = new Date().toISOString();
    
    const { data: updatedKey, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update API key error:', error);
      return res.status(500).json({
        error: 'Failed to update API key',
        code: 'API_KEY_UPDATE_FAILED'
      });
    }
    
    if (!updatedKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      apiKey: {
        id: updatedKey.id,
        name: updatedKey.name,
        prefix: updatedKey.key_prefix,
        permissions: updatedKey.permissions,
        rate_limit: updatedKey.rate_limit,
        is_active: updatedKey.is_active,
        expires_at: updatedKey.expires_at,
        updated_at: updatedKey.updated_at
      }
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      error: 'Failed to update API key',
      code: 'API_KEY_UPDATE_FAILED'
    });
  }
});

// Revoke API key
router.delete('/:id', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('api_keys')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: req.user.id
      })
      .eq('id', id);
    
    if (error) {
      console.error('Revoke API key error:', error);
      return res.status(500).json({
        error: 'Failed to revoke API key',
        code: 'API_KEY_REVOKE_FAILED'
      });
    }
    
    res.json({
      success: true,
      message: 'API key has been revoked'
    });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({
      error: 'Failed to revoke API key',
      code: 'API_KEY_REVOKE_FAILED'
    });
  }
});

// Rotate API key (revoke old, create new)
router.post('/:id/rotate', authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get existing API key
    const { data: existingKey, error: fetchError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingKey) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }
    
    // Generate new API key
    const newApiKey = generateAPIKey();
    const keyHash = await hashPassword(newApiKey);
    
    // Start transaction
    // Create new key with same settings
    const { data: newKeyRecord, error: createError } = await supabase
      .from('api_keys')
      .insert({
        name: `${existingKey.name} (Rotated)`,
        key_hash: keyHash,
        key_prefix: newApiKey.substring(0, 12) + '...',
        permissions: existingKey.permissions,
        rate_limit: existingKey.rate_limit,
        expires_at: existingKey.expires_at,
        is_active: true,
        created_by: req.user.id,
        created_at: new Date().toISOString(),
        rotated_from: existingKey.id
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Create rotated key error:', createError);
      return res.status(500).json({
        error: 'Failed to create new API key',
        code: 'API_KEY_ROTATION_FAILED'
      });
    }
    
    // Revoke old key
    await supabase
      .from('api_keys')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: req.user.id,
        revoke_reason: 'Rotated to new key'
      })
      .eq('id', id);
    
    res.json({
      success: true,
      newApiKey: newApiKey,
      apiKeyInfo: {
        id: newKeyRecord.id,
        name: newKeyRecord.name,
        prefix: newKeyRecord.key_prefix,
        permissions: newKeyRecord.permissions,
        rate_limit: newKeyRecord.rate_limit,
        expires_at: newKeyRecord.expires_at,
        created_at: newKeyRecord.created_at,
        rotated_from: newKeyRecord.rotated_from
      },
      oldKeyId: id,
      warning: 'Store this new API key securely. The old key has been revoked.'
    });
  } catch (error) {
    console.error('Rotate API key error:', error);
    res.status(500).json({
      error: 'Failed to rotate API key',
      code: 'API_KEY_ROTATION_FAILED'
    });
  }
});

export default router;