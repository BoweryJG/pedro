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

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.validatedData || req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (userError || !user) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Your account has been deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      // Log failed login attempt
      await supabase
        .from('login_attempts')
        .insert({
          user_id: user.id,
          ip_address: req.ip,
          user_agent: req.headers['user-agent'],
          success: false,
          created_at: new Date().toISOString()
        });
      
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate tokens
    const { token, refreshToken } = generateToken(user);
    
    // Update last login
    await supabase
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: req.ip
      })
      .eq('id', user.id);
    
    // Log successful login
    await supabase
      .from('login_attempts')
      .insert({
        user_id: user.id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        success: true,
        created_at: new Date().toISOString()
      });
    
    // Store refresh token
    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token_hash: await hashPassword(refreshToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        created_at: new Date().toISOString()
      });
    
    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clinic_id: user.clinic_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_FAILED'
    });
  }
});

// Logout endpoint
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Invalidate all refresh tokens for this user
    await supabase
      .from('refresh_tokens')
      .update({ is_revoked: true })
      .eq('user_id', req.user.id)
      .eq('is_revoked', false);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_FAILED'
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }
    
    // Verify refresh token format
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }
    
    // Find stored refresh token
    const { data: storedTokens, error: tokenError } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('user_id', decoded.id)
      .eq('is_revoked', false)
      .gte('expires_at', new Date().toISOString());
    
    if (tokenError || !storedTokens || storedTokens.length === 0) {
      return res.status(401).json({
        error: 'Refresh token not found or expired',
        code: 'REFRESH_TOKEN_INVALID'
      });
    }
    
    // Verify token hash
    let validToken = null;
    for (const storedToken of storedTokens) {
      if (await comparePassword(refreshToken, storedToken.token_hash)) {
        validToken = storedToken;
        break;
      }
    }
    
    if (!validToken) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'REFRESH_TOKEN_INVALID'
      });
    }
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();
    
    if (userError || !user || !user.is_active) {
      return res.status(401).json({
        error: 'User not found or inactive',
        code: 'USER_INVALID'
      });
    }
    
    // Generate new tokens
    const { token, refreshToken: newRefreshToken } = generateToken(user);
    
    // Revoke old refresh token
    await supabase
      .from('refresh_tokens')
      .update({ is_revoked: true })
      .eq('id', validToken.id);
    
    // Store new refresh token
    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token_hash: await hashPassword(newRefreshToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
        created_at: new Date().toISOString()
      });
    
    res.json({
      success: true,
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      code: 'REFRESH_FAILED'
    });
  }
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