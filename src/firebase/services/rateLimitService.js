/**
 * Rate Limiting Service for HaathSaga Ecommerce Platform
 * 
 * This service provides configurable rate limiting to protect against:
 * - Brute force attacks on authentication
 * - API abuse and DDoS attempts
 * - Spam and excessive requests
 * 
 * Features:
 * - Per-user and per-IP rate limiting
 * - Configurable limits per endpoint type
 * - Sliding window algorithm for accurate rate limiting
 * - Automatic cleanup of expired entries
 * - Comprehensive logging and error handling
 */

// Rate limit configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - strict limits to prevent brute force
  auth: {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      lockoutMs: 30 * 60 * 1000, // 30 minutes lockout after exceeding
      message: 'Too many login attempts. Please try again later.'
    },
    register: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      lockoutMs: 60 * 60 * 1000, // 1 hour lockout
      message: 'Too many registration attempts. Please try again later.'
    },
    otpRequest: {
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
      lockoutMs: 15 * 60 * 1000, // 15 minutes lockout
      message: 'Too many OTP requests. Please try again later.'
    },
    otpVerify: {
      maxAttempts: 3,
      windowMs: 5 * 60 * 1000, // 5 minutes
      lockoutMs: 5 * 60 * 1000, // 5 minutes lockout
      message: 'Too many verification attempts. Please request a new OTP.'
    }
  },
  
  // General API endpoints - moderate limits
  api: {
    read: {
      maxAttempts: 100,
      windowMs: 60 * 1000, // 1 minute
      lockoutMs: 0, // No lockout, just rate limit
      message: 'Too many requests. Please slow down.'
    },
    write: {
      maxAttempts: 20,
      windowMs: 60 * 1000, // 1 minute
      lockoutMs: 5 * 60 * 1000, // 5 minutes lockout
      message: 'Too many write operations. Please wait before trying again.'
    },
    search: {
      maxAttempts: 30,
      windowMs: 60 * 1000, // 1 minute
      lockoutMs: 0,
      message: 'Too many search requests. Please slow down.'
    }
  },
  
  // Admin endpoints - stricter limits
  admin: {
    general: {
      maxAttempts: 50,
      windowMs: 60 * 1000, // 1 minute
      lockoutMs: 10 * 60 * 1000, // 10 minutes lockout
      message: 'Too many admin operations. Please wait.'
    },
    bulk: {
      maxAttempts: 5,
      windowMs: 60 * 1000, // 1 minute
      lockoutMs: 15 * 60 * 1000, // 15 minutes lockout
      message: 'Too many bulk operations. Please wait.'
    }
  }
};

// In-memory storage for rate limit data
// In production, consider using Redis or a similar solution for distributed systems
class RateLimitStore {
  constructor() {
    this.requests = new Map();
    this.lockouts = new Map();
    this.cleanupInterval = null;
  }

  /**
   * Initialize the store and start cleanup interval
   */
  init() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
    
    console.log('[RateLimitService] Store initialized with cleanup interval');
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;

    // Clean up expired request entries
    for (const [key, data] of this.requests.entries()) {
      if (now > data.windowEnd) {
        this.requests.delete(key);
        cleanedCount++;
      }
    }

    // Clean up expired lockouts
    for (const [key, data] of this.lockouts.entries()) {
      if (now > data.lockoutEnd) {
        this.lockouts.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[RateLimitService] Cleaned up ${cleanedCount} expired entries`);
    }
  }

  /**
   * Get request data for a key
   */
  getRequests(key) {
    return this.requests.get(key) || null;
  }

  /**
   * Set request data for a key
   */
  setRequests(key, data) {
    this.requests.set(key, data);
  }

  /**
   * Get lockout data for a key
   */
  getLockout(key) {
    return this.lockouts.get(key) || null;
  }

  /**
   * Set lockout data for a key
   */
  setLockout(key, data) {
    this.lockouts.set(key, data);
  }

  /**
   * Remove lockout for a key
   */
  removeLockout(key) {
    this.lockouts.delete(key);
  }

  /**
   * Clear all data (useful for testing)
   */
  clear() {
    this.requests.clear();
    this.lockouts.clear();
  }

  /**
   * Get statistics about current rate limits
   */
  getStats() {
    return {
      activeRequests: this.requests.size,
      activeLockouts: this.lockouts.size,
      totalEntries: this.requests.size + this.lockouts.size
    };
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Create singleton instance
const store = new RateLimitStore();
store.init();

/**
 * Rate Limiting Service
 */
export class RateLimitService {
  /**
   * Check if a request is allowed based on rate limits
   * 
   * @param {string} identifier - Unique identifier (email, userId, IP, etc.)
   * @param {string} endpointType - Type of endpoint (e.g., 'auth.login', 'api.read')
   * @returns {Object} - Result object with allowed status and metadata
   */
  static checkRateLimit(identifier, endpointType) {
    const now = Date.now();
    const config = this._getConfig(endpointType);
    
    if (!config) {
      console.warn(`[RateLimitService] No config found for endpoint type: ${endpointType}`);
      return { allowed: true, remaining: Infinity, resetTime: now + (60 * 1000) }; // Default 1 min reset
    }

    const key = `${endpointType}:${identifier}`;

    // Check if identifier is locked out
    const lockout = store.getLockout(key);
    if (lockout && now < lockout.lockoutEnd) {
      const remainingTime = Math.ceil((lockout.lockoutEnd - now) / 1000);
      console.log(`[RateLimitService] Identifier ${identifier} is locked out for ${remainingTime}s`);
      
      return {
        allowed: false,
        locked: true,
        remainingTime,
        resetTime: lockout.lockoutEnd,
        message: config.message
      };
    }

    // Get existing request data
    let requestData = store.getRequests(key);

    // Initialize or update request data
    if (!requestData || now > requestData.windowEnd) {
      requestData = {
        count: 0,
        windowStart: now,
        windowEnd: now + config.windowMs,
        attempts: []
      };
    }

    // Filter out old requests (sliding window)
    requestData.attempts = requestData.attempts.filter(
      timestamp => timestamp > now - config.windowMs
    );

    // Check if limit exceeded
    if (requestData.attempts.length >= config.maxAttempts) {
      // Apply lockout if configured
      if (config.lockoutMs > 0) {
        const lockoutEnd = now + config.lockoutMs;
        store.setLockout(key, {
          lockedAt: now,
          lockoutEnd,
          reason: 'Rate limit exceeded'
        });
        
        const remainingTime = Math.ceil(config.lockoutMs / 1000);
        console.warn(`[RateLimitService] Rate limit exceeded for ${identifier}. Locked out for ${remainingTime}s`);
        
        return {
          allowed: false,
          locked: true,
          remainingTime,
          resetTime: lockoutEnd,
          message: config.message
        };
      }

      // No lockout, just rate limit
      const oldestAttempt = requestData.attempts[0];
      const resetTime = oldestAttempt + config.windowMs;
      const remainingTime = Math.ceil((resetTime - now) / 1000);

      console.warn(`[RateLimitService] Rate limit exceeded for ${identifier}. Reset in ${remainingTime}s`);

      return {
        allowed: false,
        locked: false,
        remainingTime,
        resetTime,
        message: config.message
      };
    }

    // Add current attempt
    requestData.attempts.push(now);
    requestData.count = requestData.attempts.length;
    store.setRequests(key, requestData);

    const remainingAttempts = config.maxAttempts - requestData.attempts.length;
    const resetTime = requestData.windowEnd;

    console.log(`[RateLimitService] Request allowed for ${identifier}. Remaining: ${remainingAttempts}/${config.maxAttempts}`);

    return {
      allowed: true,
      remaining: remainingAttempts,
      resetTime,
      limit: config.maxAttempts
    };
  }

  /**
   * Record a successful attempt (for authentication success)
   * This can be used to reset rate limits on successful operations
   * 
   * @param {string} identifier - Unique identifier
   * @param {string} endpointType - Type of endpoint
   */
  static recordSuccess(identifier, endpointType) {
    const key = `${endpointType}:${identifier}`;
    
    // Remove lockout if exists
    store.removeLockout(key);
    
    // Clear request history for successful auth operations
    if (endpointType.startsWith('auth.')) {
      store.setRequests(key, {
        count: 0,
        windowStart: Date.now(),
        windowEnd: Date.now(),
        attempts: []
      });
      
      console.log(`[RateLimitService] Success recorded for ${identifier}. Rate limit reset.`);
    }
  }

  /**
   * Get configuration for an endpoint type
   */
  static _getConfig(endpointType) {
    const parts = endpointType.split('.');
    let config = RATE_LIMIT_CONFIGS;

    for (const part of parts) {
      if (config[part]) {
        config = config[part];
      } else {
        return null;
      }
    }

    return config === RATE_LIMIT_CONFIGS ? null : config;
  }

  /**
   * Get rate limit statistics
   */
  static getStats() {
    return store.getStats();
  }

  /**
   * Check if an identifier is currently locked out
   */
  static isLockedOut(identifier, endpointType) {
    const key = `${endpointType}:${identifier}`;
    const lockout = store.getLockout(key);
    
    if (!lockout) {
      return false;
    }

    const now = Date.now();
    if (now >= lockout.lockoutEnd) {
      // Lockout expired, remove it
      store.removeLockout(key);
      return false;
    }

    return true;
  }

  /**
   * Get remaining lockout time for an identifier
   */
  static getRemainingLockoutTime(identifier, endpointType) {
    const key = `${endpointType}:${identifier}`;
    const lockout = store.getLockout(key);
    
    if (!lockout) {
      return 0;
    }

    const now = Date.now();
    if (now >= lockout.lockoutEnd) {
      store.removeLockout(key);
      return 0;
    }

    return Math.ceil((lockout.lockoutEnd - now) / 1000);
  }

  /**
   * Manually unlock an identifier (admin function)
   */
  static unlock(identifier, endpointType) {
    const key = `${endpointType}:${identifier}`;
    store.removeLockout(key);
    console.log(`[RateLimitService] Manually unlocked ${identifier} for ${endpointType}`);
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  static clearAll() {
    store.clear();
    console.log('[RateLimitService] All rate limit data cleared');
  }
}

/**
 * Higher-order function to wrap service functions with rate limiting
 * 
 * @param {Function} fn - The function to wrap
 * @param {string} endpointType - The endpoint type for rate limiting
 * @param {Function} getIdentifier - Function to extract identifier from arguments
 * @returns {Function} - Wrapped function with rate limiting
 */
export function withRateLimit(fn, endpointType, getIdentifier) {
  return async function(...args) {
    // Extract identifier from arguments
    const identifier = getIdentifier ? getIdentifier(...args) : 'anonymous';

    // Check rate limit
    const result = RateLimitService.checkRateLimit(identifier, endpointType);

    if (!result.allowed) {
      const error = new Error(result.message);
      error.code = 'RATE_LIMIT_EXCEEDED';
      error.locked = result.locked;
      error.remainingTime = result.remainingTime;
      error.resetTime = result.resetTime;
      throw error;
    }

    // Execute the original function
    try {
      const response = await fn.apply(this, args);
      
      // Record success for certain endpoint types
      if (endpointType.startsWith('auth.') || endpointType.startsWith('otp.')) {
        // Only record success if the function doesn't throw an error
        RateLimitService.recordSuccess(identifier, endpointType);
      }

      return response;
    } catch (error) {
      // Don't record success if function failed
      throw error;
    }
  };
}

/**
 * Helper function to extract email from function arguments
 */
export function getEmailFromArgs(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('@')) {
    return args[0];
  }
  return 'anonymous';
}

/**
 * Helper function to extract user ID from function arguments
 */
export function getUserIdFromArgs(...args) {
  if (args[0] && typeof args[0] === 'string') {
    return args[0];
  }
  return 'anonymous';
}

// Export store for testing purposes
export { store };

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    store.destroy();
  });
}
