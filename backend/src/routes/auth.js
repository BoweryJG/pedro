import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import {
  generateToken,
  verifyToken,
  validatePassword,
  hashPassword,
  comparePassword,
  authenticate,
  ROLES
} from '../middleware/auth.js';
import {
  validateLogin,
  validateRegister,
  validateChangePassword
} from '../middleware/validation.js';

dotenv.config();

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Login endpoint - DEPRECATED: Now handled by Supabase Auth
router.post('/login', async (req, res) => {
  return res.status(410).json({
    error: 'This endpoint is deprecated. Please use Supabase Auth for authentication.',
    code: 'ENDPOINT_DEPRECATED',
    documentation: 'https://supabase.com/docs/guides/auth'
  });
});

// Logout endpoint - DEPRECATED: Now handled by Supabase Auth
router.post('/logout', async (req, res) => {
  return res.status(410).json({
    error: 'This endpoint is deprecated. Please use Supabase Auth for logout.',
    code: 'ENDPOINT_DEPRECATED',
    documentation: 'https://supabase.com/docs/guides/auth/sign-out'
  });
});

// Refresh token endpoint - DEPRECATED: Now handled by Supabase Auth
router.post('/refresh', async (req, res) => {
  return res.status(410).json({
    error: 'This endpoint is deprecated. Please use Supabase Auth for token refresh.',
    code: 'ENDPOINT_DEPRECATED',
    documentation: 'https://supabase.com/docs/guides/auth/sessions'
  });
});

// Register endpoint (for initial setup or admin use)
router.post('/register', authenticate, validateRegister, async (req, res) => {
  try {
    // Only admins can create new users
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions to create users',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    const { email, password, name, role, clinic_id } = req.validatedData || req.body;
    
    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        error: 'Email, password, name, and role are required',
        code: 'MISSING_FIELDS'
      });
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: passwordValidation.message,
        code: 'INVALID_PASSWORD'
      });
    }
    
    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        code: 'INVALID_ROLE',
        validRoles: Object.values(ROLES)
      });
    }
    
    // Only super admins can create other admins
    if (role === ROLES.SUPER_ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        error: 'Only super admins can create other super admins',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role,
        clinic_id: clinic_id || req.user.clinic_id,
        is_active: true,
        created_by: req.user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (createError) {
      console.error('User creation error:', createError);
      return res.status(500).json({
        error: 'Failed to create user',
        code: 'USER_CREATION_FAILED'
      });
    }
    
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        clinic_id: newUser.clinic_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_FAILED'
    });
  }
});

// Change password endpoint
router.post('/change-password', authenticate, validateChangePassword, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.validatedData || req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required',
        code: 'MISSING_PASSWORDS'
      });
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: passwordValidation.message,
        code: 'INVALID_PASSWORD'
      });
    }
    
    // Get user with password hash
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }
    
    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    
    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        password_changed_at: new Date().toISOString()
      })
      .eq('id', req.user.id);
    
    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({
        error: 'Failed to update password',
        code: 'PASSWORD_UPDATE_FAILED'
      });
    }
    
    // Invalidate all refresh tokens
    await supabase
      .from('refresh_tokens')
      .update({ is_revoked: true })
      .eq('user_id', req.user.id);
    
    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password',
      code: 'PASSWORD_CHANGE_FAILED'
    });
  }
});

// Get current user endpoint
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, clinic_id, is_active, created_at, last_login_at')
      .eq('id', req.user.id)
      .single();
    
    if (error || !user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      user: {
        ...user,
        permissions: req.user.permissions
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      code: 'USER_FETCH_FAILED'
    });
  }
});

export default router;