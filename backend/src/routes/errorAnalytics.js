import express from 'express';
import { authenticate, authorize, ROLES } from '../middleware/auth.js';
import errorMonitoring from '../services/errorMonitoring.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';
import { ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

/**
 * GET /api/errors/stats
 * Get error statistics for a date range
 */
router.get('/stats', asyncWrapper(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    throw new ValidationError('startDate and endDate are required', {
      startDate: !startDate ? 'Required' : null,
      endDate: !endDate ? 'Required' : null
    });
  }
  
  const stats = await errorMonitoring.getErrorStats(startDate, endDate);
  
  res.json({
    success: true,
    data: stats
  });
}));

/**
 * GET /api/errors/frequent
 * Get most frequent errors
 */
router.get('/frequent', asyncWrapper(async (req, res) => {
  const { limit = 10, days = 7 } = req.query;
  
  const frequentErrors = await errorMonitoring.getFrequentErrors(
    parseInt(limit),
    parseInt(days)
  );
  
  res.json({
    success: true,
    data: frequentErrors
  });
}));

/**
 * GET /api/errors/trends
 * Get error trends over time
 */
router.get('/trends', asyncWrapper(async (req, res) => {
  const { days = 30 } = req.query;
  
  const trends = await errorMonitoring.getErrorTrends(parseInt(days));
  
  res.json({
    success: true,
    data: trends
  });
}));

/**
 * GET /api/errors/user/:userId
 * Get errors for a specific user
 */
router.get('/user/:userId', asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;
  
  const userErrors = await errorMonitoring.getErrorsByUser(userId, parseInt(limit));
  
  res.json({
    success: true,
    data: userErrors
  });
}));

/**
 * GET /api/errors/report
 * Generate comprehensive error report
 */
router.get('/report', asyncWrapper(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    throw new ValidationError('startDate and endDate are required');
  }
  
  const report = await errorMonitoring.generateErrorReport(startDate, endDate);
  
  res.json({
    success: true,
    data: report
  });
}));

/**
 * POST /api/errors/cleanup
 * Clean up old error logs
 */
router.post('/cleanup', asyncWrapper(async (req, res) => {
  const { daysToKeep = 90 } = req.body;
  
  await errorMonitoring.cleanupOldLogs(parseInt(daysToKeep));
  
  res.json({
    success: true,
    message: `Cleaned up error logs older than ${daysToKeep} days`
  });
}));

/**
 * POST /api/errors/check-critical
 * Manually trigger critical error check
 */
router.post('/check-critical', asyncWrapper(async (req, res) => {
  await errorMonitoring.checkCriticalErrors();
  
  res.json({
    success: true,
    message: 'Critical error check completed'
  });
}));

export default router;