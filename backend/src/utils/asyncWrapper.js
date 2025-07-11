/**
 * Wrapper for async route handlers to automatically catch errors
 * This eliminates the need for try-catch blocks in every route
 */
export const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Wrapper for async middleware
 */
export const asyncMiddleware = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Batch async wrapper for multiple handlers
 */
export const asyncHandlers = (...handlers) => {
  return handlers.map(handler => asyncWrapper(handler));
};

export default asyncWrapper;