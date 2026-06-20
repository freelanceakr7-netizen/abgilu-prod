/**
 * Rate Limit Error Handler Utility
 * 
 * This utility provides functions to handle rate limit errors
 * consistently across the application, including:
 * - User-friendly error messages
 * - Logging for debugging
 * - Toast notifications
 * - Retry suggestions
 */

/**
 * Check if an error is a rate limit error
 */
export const isRateLimitError = (error) => {
  return error?.code === 'RATE_LIMIT_EXCEEDED' || error?.rateLimited === true;
};

/**
 * Get user-friendly message for rate limit error
 */
export const getRateLimitMessage = (error) => {
  if (!isRateLimitError(error)) {
    return null;
  }

  const baseMessage = error.message || 'Too many requests. Please try again later.';
  
  if (error.remainingTime && error.remainingTime > 0) {
    const minutes = Math.ceil(error.remainingTime / 60);
    const seconds = error.remainingTime % 60;
    
    if (minutes > 0) {
      return `${baseMessage} Please wait ${minutes} minute${minutes > 1 ? 's' : ''}${seconds > 0 ? ` ${seconds} second${seconds > 1 ? 's' : ''}` : ''} before trying again.`;
    } else {
      return `${baseMessage} Please wait ${seconds} second${seconds > 1 ? 's' : ''} before trying again.`;
    }
  }
  
  return baseMessage;
};

/**
 * Get reset time for rate limit error
 */
export const getRateLimitResetTime = (error) => {
  if (!isRateLimitError(error)) {
    return null;
  }

  return error.resetTime || (Date.now() + (error.remainingTime || 60) * 1000);
};

/**
 * Format remaining time for display
 */
export const formatRemainingTime = (seconds) => {
  if (!seconds || seconds <= 0) {
    return 'now';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m`;
  }

  return `${remainingSeconds}s`;
};

/**
 * Log rate limit error for debugging
 */
export const logRateLimitError = (error, context = {}) => {
  if (!isRateLimitError(error)) {
    return;
  }

  console.group('[RateLimitError]');
  console.error('Rate limit exceeded:', {
    message: error.message,
    code: error.code,
    remainingTime: error.remainingTime,
    resetTime: error.resetTime,
    locked: error.locked,
    ...context
  });
  console.groupEnd();

  // In production, you might want to send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: context });
};

/**
 * Handle rate limit error with toast notification
 * This should be used in conjunction with your toast notification system
 */
export const handleRateLimitError = (error, showToast, context = {}) => {
  if (!isRateLimitError(error)) {
    return false;
  }

  // Log the error
  logRateLimitError(error, context);

  // Show user-friendly message
  const message = getRateLimitMessage(error);
  
  if (showToast && typeof showToast === 'function') {
    showToast({
      type: 'error',
      message,
      duration: 5000
    });
  }

  return true;
};

/**
 * Check if user is locked out
 */
export const isLockedOut = (error) => {
  return isRateLimitError(error) && error.locked === true;
};

/**
 * Get lockout information
 */
export const getLockoutInfo = (error) => {
  if (!isLockedOut(error)) {
    return null;
  }

  return {
    locked: true,
    remainingTime: error.remainingTime,
    resetTime: error.resetTime,
    message: error.message
  };
};

/**
 * Create a countdown timer for rate limit reset
 */
export const createCountdownTimer = (resetTime, onTick, onComplete) => {
  const now = Date.now();
  const totalSeconds = Math.max(0, Math.ceil((resetTime - now) / 1000));

  let remainingSeconds = totalSeconds;

  // Initial tick
  if (onTick) {
    onTick(remainingSeconds);
  }

  const interval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(interval);
      if (onComplete) {
        onComplete();
      }
    } else if (onTick) {
      onTick(remainingSeconds);
    }
  }, 1000);

  return {
    stop: () => clearInterval(interval),
    getRemaining: () => remainingSeconds
  };
};

/**
 * Retry helper for rate-limited operations
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  context = {}
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If not a rate limit error, throw immediately
      if (!isRateLimitError(error)) {
        throw error;
      }

      // If locked out, don't retry
      if (isLockedOut(error)) {
        throw error;
      }

      // Calculate exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      const delayMs = Math.min(delay, error.remainingTime * 1000 || 30000);

      console.log(`[RateLimitRetry] Attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delayMs}ms...`);

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  // All retries exhausted
  logRateLimitError(lastError, { ...context, retries: maxRetries, exhausted: true });
  throw lastError;
};

/**
 * Rate limit statistics for monitoring
 */
export const getRateLimitStats = () => {
  try {
    const { RateLimitService } = require('../firebase/services/rateLimitService');
    return RateLimitService.getStats();
  } catch (error) {
    console.error('Error getting rate limit stats:', error);
    return null;
  }
};

/**
 * Check if a specific identifier is rate limited
 */
export const checkRateLimitStatus = (identifier, endpointType) => {
  try {
    const { RateLimitService } = require('../firebase/services/rateLimitService');
    
    if (RateLimitService.isLockedOut(identifier, endpointType)) {
      const remainingTime = RateLimitService.getRemainingLockoutTime(identifier, endpointType);
      return {
        limited: true,
        locked: true,
        remainingTime,
        message: 'This action is temporarily unavailable due to too many attempts.'
      };
    }

    return {
      limited: false,
      locked: false
    };
  } catch (error) {
    console.error('Error checking rate limit status:', error);
    return {
      limited: false,
      locked: false,
      error: true
    };
  }
};
