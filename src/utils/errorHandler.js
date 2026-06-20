/**
 * ============================================================================
 * ERROR LOGGING SERVICE - SENTRY INTEGRATION
 * ============================================================================
 * 
 * This service provides comprehensive error logging and monitoring capabilities
 * using Sentry. It handles error capture, user context management, breadcrumbs,
 * and provides graceful fallback when Sentry is not configured.
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - REACT_APP_SENTRY_DSN: Your Sentry DSN (Data Source Name)
 * 
 * INSTALLATION:
 * npm install @sentry/react @sentry/browser
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Initialize in your app entry point (index.jsx or App.jsx):
 *    import { initErrorMonitoring } from './utils/errorHandler';
 *    initErrorMonitoring();
 * 
 * 2. Log errors anywhere in your application:
 *    import { logError } from './utils/errorHandler';
 *    try {
 *      // Your code
 *    } catch (error) {
 *      logError(error, { userId: '123', action: 'checkout' });
 *    }
 * 
 * 3. Set user context after authentication:
 *    import { setUserContext } from './utils/errorHandler';
 *    setUserContext({ id: '123', email: 'user@example.com', role: 'customer' });
 * 
 * 4. Add breadcrumbs for better error context:
 *    import { addBreadcrumb } from './utils/errorHandler';
 *    addBreadcrumb({
 *      category: 'user',
 *      message: 'User clicked checkout',
 *      level: 'info',
 *      data: { productId: '456' }
 *    });
 * 
 * 5. Log informational messages:
 *    import { logMessage } from './utils/errorHandler';
 *    logMessage('Payment successful', 'info', { orderId: '789' });
 * 
 * ============================================================================
 */

import * as Sentry from '@sentry/react';

// Track whether Sentry has been initialized
let isSentryInitialized = false;

// Store current user context
let currentUserContext = null;

/**
 * List of sensitive data keys to filter from error reports
 * These patterns will be matched against keys in objects
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /auth/i,
  /cookie/i,
  /session/i,
  /credit/i,
  /card/i,
  /ssn/i,
  /pin/i,
  /otp/i,
  /verification/i
];

/**
 * Recursively filter sensitive data from an object
 * @param {any} data - The data to sanitize
 * @returns {any} - Sanitized data
 */
function sanitizeData(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if key matches any sensitive pattern
      const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
      
      if (isSensitive) {
        sanitized[key] = '[FILTERED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Get the current environment
 * @returns {string} - Environment name (development, staging, production)
 */
function getEnvironment() {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_ENVIRONMENT || 'production';
  }
  return 'development';
}

/**
 * Initialize Sentry error monitoring
 * 
 * This function sets up Sentry with appropriate configuration for the current
 * environment. It includes:
 * - DSN from environment variable
 * - Environment detection
 * - Sensitive data filtering
 * - Sample rate configuration
 * - React and browser integrations
 * 
 * @returns {boolean} - True if initialization was successful, false otherwise
 * 
 * @example
 * initErrorMonitoring();
 */
export function initErrorMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  // If no DSN is provided, log a warning and return
  if (!dsn) {
    console.warn('[ErrorHandler] Sentry DSN not found. Error monitoring disabled.');
    console.warn('[ErrorHandler] Set REACT_APP_SENTRY_DSN environment variable to enable error monitoring.');
    return false;
  }

  try {
    Sentry.init({
      dsn: dsn,
      environment: getEnvironment(),
      
      // Sample rate for errors (1.0 = 100%, 0.1 = 10%)
      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      
      // Sample rate for sessions
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // Filter sensitive data before sending to Sentry
      beforeSend(event, hint) {
        try {
          // Sanitize request data
          if (event.request) {
            event.request = sanitizeData(event.request);
          }
          
          // Sanitize user data
          if (event.user) {
            event.user = sanitizeData(event.user);
          }
          
          // Sanitize extra context
          if (event.extra) {
            event.extra = sanitizeData(event.extra);
          }
          
          // Sanitize contexts
          if (event.contexts) {
            event.contexts = sanitizeData(event.contexts);
          }
          
          // Sanitize breadcrumbs
          if (event.breadcrumbs) {
            event.breadcrumbs = event.breadcrumbs.map(breadcrumb => ({
              ...breadcrumb,
              data: breadcrumb.data ? sanitizeData(breadcrumb.data) : undefined
            }));
          }
          
          // Add current user context if available
          if (currentUserContext) {
            event.user = {
              ...event.user,
              ...sanitizeData(currentUserContext)
            };
          }
          
          return event;
        } catch (error) {
          console.error('[ErrorHandler] Error in beforeSend filter:', error);
          return event; // Return event even if filtering fails
        }
      },
      
      // Integrations
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Performance monitoring
      tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
      
      // Before send transaction (for performance monitoring)
      beforeSendTransaction(event) {
        try {
          event = sanitizeData(event);
          return event;
        } catch (error) {
          console.error('[ErrorHandler] Error in beforeSendTransaction:', error);
          return event;
        }
      },
      
      // Debug mode in development
      debug: import.meta.env.MODE === 'development',
      
      // Environment-specific settings
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      
      // Attach stack traces
      attachStacktrace: true,
      
      // Max breadcrumbs to keep
      maxBreadcrumbs: 100,
      
      // Ignore specific errors
      ignoreErrors: [
        // ResizeObserver loop limit exceeded
        'ResizeObserver loop limit exceeded',
        // Non-Error promise rejection
        'Non-Error promise rejection captured',
        // Network errors that are expected
        'Network request failed',
        // Chunk loading errors
        /Loading chunk \d+ failed/,
      ],
      
      // Deny URLs from specific sources
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /^chrome-extension:\/\//i,
        /^safari-extension:\/\//i,
        /^moz-extension:\/\//i,
        /^ms-browser-extension:\/\//i,
        // Third-party scripts that we don't control
        /analytics\.google\.com/i,
        /googletagmanager\.com/i,
      ],
    });
    
    isSentryInitialized = true;
    console.log('[ErrorHandler] Sentry initialized successfully');
    console.log('[ErrorHandler] Environment:', getEnvironment());
    
    return true;
  } catch (error) {
    console.error('[ErrorHandler] Failed to initialize Sentry:', error);
    isSentryInitialized = false;
    return false;
  }
}

/**
 * Log an error with optional context
 * 
 * This function captures errors and sends them to Sentry if initialized.
 * It also logs to the console for development debugging.
 * 
 * @param {Error|string} error - The error object or error message
 * @param {Object} context - Optional context object with additional information
 * @param {string} context.userId - User ID associated with the error
 * @param {string} context.action - Action being performed when error occurred
 * @param {Object} context.extra - Any additional data to include
 * 
 * @returns {void}
 * 
 * @example
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   logError(error, { userId: '123', action: 'checkout' });
 * }
 */
export function logError(error, context = {}) {
  try {
    // Sanitize context
    const sanitizedContext = sanitizeData(context);
    
    // Console fallback for development or if Sentry is not initialized
    if (!isSentryInitialized) {
      console.error('[ErrorHandler] Error logged (Sentry not initialized):', error);
      if (Object.keys(sanitizedContext).length > 0) {
        console.error('[ErrorHandler] Context:', sanitizedContext);
      }
      return;
    }
    
    // Determine error level based on context
    const level = context.level || 'error';
    
    // Prepare extra data
    const extra = {
      ...sanitizedContext,
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
    };
    
    // Capture exception with Sentry
    if (error instanceof Error) {
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        scope.setExtras(extra);
        
        // Set tags if provided
        if (sanitizedContext.tags) {
          Object.entries(sanitizedContext.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        
        Sentry.captureException(error);
      });
    } else {
      // If error is not an Error object, create one
      const errorObj = new Error(String(error));
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        scope.setExtras(extra);
        
        if (sanitizedContext.tags) {
          Object.entries(sanitizedContext.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }
        
        Sentry.captureException(errorObj);
      });
    }
    
    // Console logging in development
    if (import.meta.env.MODE === 'development') {
      console.error(`[ErrorHandler] Error captured (${level}):`, error);
      if (Object.keys(sanitizedContext).length > 0) {
        console.error('[ErrorHandler] Context:', sanitizedContext);
      }
    }
  } catch (err) {
    console.error('[ErrorHandler] Failed to log error:', err);
    console.error('[ErrorHandler] Original error:', error);
  }
}

/**
 * Log a message (non-error) with optional context
 * 
 * This function is useful for logging informational messages, warnings,
 * or custom events that don't represent errors.
 * 
 * @param {string} message - The message to log
 * @param {'info'|'warning'|'error'} level - Log level (default: 'info')
 * @param {Object} context - Optional context object with additional information
 * @param {string} context.userId - User ID associated with the message
 * @param {string} context.action - Action being performed
 * @param {Object} context.extra - Any additional data to include
 * 
 * @returns {void}
 * 
 * @example
 * logMessage('User completed checkout', 'info', { orderId: '123', total: 99.99 });
 * logMessage('Payment failed', 'warning', { userId: '456', reason: 'insufficient_funds' });
 */
export function logMessage(message, level = 'info', context = {}) {
  try {
    // Sanitize context
    const sanitizedContext = sanitizeData(context);
    
    // Console fallback for development or if Sentry is not initialized
    if (!isSentryInitialized) {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warning' ? console.warn : 
                           console.info;
      consoleMethod(`[ErrorHandler] Message logged (${level}):`, message);
      if (Object.keys(sanitizedContext).length > 0) {
        consoleMethod('[ErrorHandler] Context:', sanitizedContext);
      }
      return;
    }
    
    // Prepare extra data
    const extra = {
      ...sanitizedContext,
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
    };
    
    // Capture message with Sentry
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      scope.setExtras(extra);
      
      // Set tags if provided
      if (sanitizedContext.tags) {
        Object.entries(sanitizedContext.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      Sentry.captureMessage(message, level);
    });
    
    // Console logging in development
    if (import.meta.env.MODE === 'development') {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warning' ? console.warn : 
                           console.info;
      consoleMethod(`[ErrorHandler] Message captured (${level}):`, message);
      if (Object.keys(sanitizedContext).length > 0) {
        consoleMethod('[ErrorHandler] Context:', sanitizedContext);
      }
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to log message:', error);
    console.error('[ErrorHandler] Original message:', message);
  }
}

/**
 * Set user context for error tracking
 * 
 * This function associates user information with all subsequent errors.
 * Call this after user authentication and update it when user information changes.
 * 
 * @param {Object|null} user - User object with user information, or null to clear
 * @param {string} user.id - User ID
 * @param {string} user.email - User email
 * @param {string} user.role - User role (e.g., 'customer', 'admin')
 * @param {string} user.username - Username
 * @param {Object} user.extra - Any additional user information
 * 
 * @returns {void}
 * 
 * @example
 * // Set user context after login
 * setUserContext({
 *   id: '123',
 *   email: 'user@example.com',
 *   role: 'customer',
 *   username: 'john_doe'
 * });
 * 
 * // Clear user context after logout
 * setUserContext(null);
 */
export function setUserContext(user) {
  try {
    currentUserContext = user;
    
    if (!isSentryInitialized) {
      console.log('[ErrorHandler] User context set (Sentry not initialized):', user);
      return;
    }
    
    if (user === null) {
      Sentry.setUser(null);
      console.log('[ErrorHandler] User context cleared');
    } else {
      const sanitizedUser = sanitizeData(user);
      Sentry.setUser(sanitizedUser);
      console.log('[ErrorHandler] User context set:', sanitizedUser);
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to set user context:', error);
  }
}

/**
 * Add a breadcrumb for error context
 * 
 * Breadcrumbs provide context about what happened before an error occurred.
 * They are automatically included in error reports.
 * 
 * @param {Object} breadcrumb - Breadcrumb object
 * @param {string} breadcrumb.category - Category of the breadcrumb (e.g., 'user', 'navigation', 'http')
 * @param {string} breadcrumb.message - Message describing the breadcrumb
 * @param {'debug'|'info'|'warning'|'error'} breadcrumb.level - Log level (default: 'info')
 * @param {Object} breadcrumb.data - Additional data to include
 * 
 * @returns {void}
 * 
 * @example
 * addBreadcrumb({
 *   category: 'user',
 *   message: 'User clicked checkout button',
 *   level: 'info',
 *   data: { productId: '456', cartSize: 3 }
 * });
 * 
 * addBreadcrumb({
 *   category: 'http',
 *   message: 'API request completed',
 *   level: 'info',
 *   data: { url: '/api/products', status: 200, duration: 150 }
 * });
 */
export function addBreadcrumb(breadcrumb) {
  try {
    const sanitizedBreadcrumb = {
      ...breadcrumb,
      data: breadcrumb.data ? sanitizeData(breadcrumb.data) : undefined,
      timestamp: Date.now() / 1000, // Unix timestamp
    };
    
    if (!isSentryInitialized) {
      console.log('[ErrorHandler] Breadcrumb added (Sentry not initialized):', sanitizedBreadcrumb);
      return;
    }
    
    Sentry.addBreadcrumb(sanitizedBreadcrumb);
    
    if (import.meta.env.MODE === 'development') {
      console.log('[ErrorHandler] Breadcrumb added:', sanitizedBreadcrumb);
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to add breadcrumb:', error);
  }
}

/**
 * Capture an exception with Sentry
 * 
 * This is a direct wrapper around Sentry's captureException method.
 * Use this when you need more control over exception capture.
 * 
 * @param {Error} error - The error object to capture
 * @param {Object} context - Optional context object with additional information
 * @param {Object} context.tags - Tags to attach to the error
 * @param {Object} context.extra - Extra data to attach to the error
 * @param {string} context.level - Error level (default: 'error')
 * 
 * @returns {string} - Sentry event ID
 * 
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   const eventId = captureException(error, {
 *     tags: { section: 'checkout' },
 *     extra: { cartId: '123' }
 *   });
 *   console.log('Error captured with ID:', eventId);
 * }
 */
export function captureException(error, context = {}) {
  try {
    const sanitizedContext = sanitizeData(context);
    
    if (!isSentryInitialized) {
      console.error('[ErrorHandler] Exception captured (Sentry not initialized):', error);
      if (Object.keys(sanitizedContext).length > 0) {
        console.error('[ErrorHandler] Context:', sanitizedContext);
      }
      return null;
    }
    
    let eventId;
    
    Sentry.withScope((scope) => {
      // Set level
      if (sanitizedContext.level) {
        scope.setLevel(sanitizedContext.level);
      }
      
      // Set extra data
      if (sanitizedContext.extra) {
        scope.setExtras(sanitizedContext.extra);
      }
      
      // Set tags
      if (sanitizedContext.tags) {
        Object.entries(sanitizedContext.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      // Set fingerprint if provided
      if (sanitizedContext.fingerprint) {
        scope.setFingerprint(sanitizedContext.fingerprint);
      }
      
      eventId = Sentry.captureException(error);
    });
    
    if (import.meta.env.MODE === 'development') {
      console.error('[ErrorHandler] Exception captured with ID:', eventId);
      if (Object.keys(sanitizedContext).length > 0) {
        console.error('[ErrorHandler] Context:', sanitizedContext);
      }
    }
    
    return eventId;
  } catch (err) {
    console.error('[ErrorHandler] Failed to capture exception:', err);
    console.error('[ErrorHandler] Original error:', error);
    return null;
  }
}

/**
 * Capture a message with Sentry
 * 
 * This is a direct wrapper around Sentry's captureMessage method.
 * Use this when you need to capture non-error messages or custom events.
 * 
 * @param {string} message - The message to capture
 * @param {'debug'|'info'|'warning'|'error'|'fatal'} level - Message level (default: 'info')
 * @param {Object} context - Optional context object with additional information
 * @param {Object} context.tags - Tags to attach to the message
 * @param {Object} context.extra - Extra data to attach to the message
 * 
 * @returns {string} - Sentry event ID
 * 
 * @example
 * const eventId = captureMessage('User completed purchase', 'info', {
 *   tags: { section: 'checkout' },
 *   extra: { orderId: '123', total: 99.99 }
 * });
 */
export function captureMessage(message, level = 'info', context = {}) {
  try {
    const sanitizedContext = sanitizeData(context);
    
    if (!isSentryInitialized) {
      const consoleMethod = level === 'error' || level === 'fatal' ? console.error : 
                           level === 'warning' ? console.warn : 
                           console.info;
      consoleMethod(`[ErrorHandler] Message captured (Sentry not initialized):`, message);
      if (Object.keys(sanitizedContext).length > 0) {
        consoleMethod('[ErrorHandler] Context:', sanitizedContext);
      }
      return null;
    }
    
    let eventId;
    
    Sentry.withScope((scope) => {
      // Set level
      scope.setLevel(level);
      
      // Set extra data
      if (sanitizedContext.extra) {
        scope.setExtras(sanitizedContext.extra);
      }
      
      // Set tags
      if (sanitizedContext.tags) {
        Object.entries(sanitizedContext.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      // Set fingerprint if provided
      if (sanitizedContext.fingerprint) {
        scope.setFingerprint(sanitizedContext.fingerprint);
      }
      
      eventId = Sentry.captureMessage(message, level);
    });
    
    if (import.meta.env.MODE === 'development') {
      const consoleMethod = level === 'error' || level === 'fatal' ? console.error : 
                           level === 'warning' ? console.warn : 
                           console.info;
      consoleMethod(`[ErrorHandler] Message captured with ID:`, eventId);
      if (Object.keys(sanitizedContext).length > 0) {
        consoleMethod('[ErrorHandler] Context:', sanitizedContext);
      }
    }
    
    return eventId;
  } catch (error) {
    console.error('[ErrorHandler] Failed to capture message:', error);
    console.error('[ErrorHandler] Original message:', message);
    return null;
  }
}

/**
 * Check if Sentry is initialized
 * 
 * @returns {boolean} - True if Sentry is initialized, false otherwise
 */
export function isInitialized() {
  return isSentryInitialized;
}

/**
 * Get the current user context
 * 
 * @returns {Object|null} - Current user context or null if not set
 */
export function getCurrentUserContext() {
  return currentUserContext;
}

/**
 * Clear all breadcrumbs
 * 
 * This function removes all previously added breadcrumbs.
 * 
 * @returns {void}
 */
export function clearBreadcrumbs() {
  try {
    if (isSentryInitialized) {
      Sentry.getCurrentScope().clearBreadcrumbs();
      console.log('[ErrorHandler] Breadcrumbs cleared');
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to clear breadcrumbs:', error);
  }
}

/**
 * Set a tag for all future events
 * 
 * Tags are key-value pairs that help categorize and filter errors.
 * 
 * @param {string} key - Tag key
 * @param {string} value - Tag value
 * 
 * @returns {void}
 * 
 * @example
 * setTag('page', 'checkout');
 * setTag('user_type', 'premium');
 */
export function setTag(key, value) {
  try {
    if (isSentryInitialized) {
      Sentry.setTag(key, value);
      console.log(`[ErrorHandler] Tag set: ${key} = ${value}`);
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to set tag:', error);
  }
}

/**
 * Set extra data for all future events
 * 
 * Extra data provides additional context for errors.
 * 
 * @param {string} key - Extra data key
 * @param {any} value - Extra data value
 * 
 * @returns {void}
 * 
 * @example
 * setExtra('cart_id', '123');
 * setExtra('product_count', 5);
 */
export function setExtra(key, value) {
  try {
    const sanitizedValue = sanitizeData(value);
    if (isSentryInitialized) {
      Sentry.setExtra(key, sanitizedValue);
      console.log(`[ErrorHandler] Extra set: ${key}`);
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to set extra:', error);
  }
}

/**
 * Set the context for all future events
 * 
 * Context provides structured information about the current state.
 * 
 * @param {string} name - Context name (e.g., 'app', 'device', 'browser')
 * @param {Object} context - Context object
 * 
 * @returns {void}
 * 
 * @example
 * setContext('app', {
 *   name: 'ANGILU',
 *   version: '1.0.0',
 *   build: '12345'
 * });
 */
export function setContext(name, context) {
  try {
    const sanitizedContext = sanitizeData(context);
    if (isSentryInitialized) {
      Sentry.setContext(name, sanitizedContext);
      console.log(`[ErrorHandler] Context set: ${name}`);
    }
  } catch (error) {
    console.error('[ErrorHandler] Failed to set context:', error);
  }
}

/**
 * Flush all pending events
 * 
 * This function ensures all pending events are sent to Sentry before continuing.
 * Useful before page unload or critical operations.
 * 
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 2000)
 * @returns {Promise<boolean>} - True if flush was successful, false otherwise
 */
export async function flush(timeout = 2000) {
  try {
    if (isSentryInitialized) {
      const result = await Sentry.flush(timeout);
      console.log('[ErrorHandler] Events flushed:', result);
      return result;
    }
    return true;
  } catch (error) {
    console.error('[ErrorHandler] Failed to flush events:', error);
    return false;
  }
}

/**
 * Close Sentry and cleanup
 * 
 * This function closes the Sentry client and performs cleanup.
 * Call this when shutting down the application.
 * 
 * @returns {Promise<boolean>} - True if close was successful, false otherwise
 */
export async function close() {
  try {
    if (isSentryInitialized) {
      await Sentry.close();
      isSentryInitialized = false;
      console.log('[ErrorHandler] Sentry closed');
      return true;
    }
    return true;
  } catch (error) {
    console.error('[ErrorHandler] Failed to close Sentry:', error);
    return false;
  }
}

// Export all functions as a default object for convenience
export default {
  initErrorMonitoring,
  logError,
  logMessage,
  setUserContext,
  addBreadcrumb,
  captureException,
  captureMessage,
  isInitialized,
  getCurrentUserContext,
  clearBreadcrumbs,
  setTag,
  setExtra,
  setContext,
  flush,
  close,
};
