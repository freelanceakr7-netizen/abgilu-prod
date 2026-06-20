/**
 * Rate Limiting Service Tests
 * 
 * These tests verify that the rate limiting implementation:
 * 1. Works correctly for different endpoint types
 * 2. Doesn't break existing functionality
 * 3. Handles edge cases properly
 * 4. Properly integrates with existing services
 */

import { RateLimitService, withRateLimit, getEmailFromArgs, store } from '../rateLimitService';

describe('RateLimitService', () => {
  beforeEach(() => {
    // Clear all rate limit data before each test
    store.clear();
  });

  afterEach(() => {
    // Clean up after each test
    store.clear();
  });

  describe('checkRateLimit', () => {
    test('should allow requests within limit', () => {
      const result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.limit).toBe(5);
    });

    test('should block requests exceeding limit', () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      // 6th request should be blocked
      const result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      
      expect(result.allowed).toBe(false);
      expect(result.locked).toBe(true);
      expect(result.remainingTime).toBeGreaterThan(0);
    });

    test('should handle different endpoint types with different limits', () => {
      const authResult = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      const apiResult = RateLimitService.checkRateLimit('user123', 'api.read');
      
      expect(authResult.limit).toBe(5);
      expect(apiResult.limit).toBe(100);
    });

    test('should reset after window expires', () => {
      // Make 5 requests to hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      // Should be blocked
      let result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(false);

      // Manually expire the window (simulate time passing)
      const key = 'auth.login:test@example.com';
      const data = store.getRequests(key);
      if (data) {
        data.windowEnd = Date.now() - 1000; // Set to past
        store.setRequests(key, data);
      }

      // Should now be allowed
      result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(true);
    });
  });

  describe('recordSuccess', () => {
    test('should reset rate limit on successful auth', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      let result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(false);

      // Record success
      RateLimitService.recordSuccess('test@example.com', 'auth.login');

      // Should now be allowed
      result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(true);
    });

    test('should remove lockout on success', () => {
      // Hit the limit to trigger lockout
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      let result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.locked).toBe(true);

      // Record success
      RateLimitService.recordSuccess('test@example.com', 'auth.login');

      // Lockout should be removed
      result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.locked).toBe(false);
    });
  });

  describe('isLockedOut', () => {
    test('should return false when not locked out', () => {
      const isLocked = RateLimitService.isLockedOut('test@example.com', 'auth.login');
      expect(isLocked).toBe(false);
    });

    test('should return true when locked out', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      const isLocked = RateLimitService.isLockedOut('test@example.com', 'auth.login');
      expect(isLocked).toBe(true);
    });
  });

  describe('getRemainingLockoutTime', () => {
    test('should return 0 when not locked out', () => {
      const remaining = RateLimitService.getRemainingLockoutTime('test@example.com', 'auth.login');
      expect(remaining).toBe(0);
    });

    test('should return remaining time when locked out', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      const remaining = RateLimitService.getRemainingLockoutTime('test@example.com', 'auth.login');
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(30 * 60); // 30 minutes max
    });
  });

  describe('unlock', () => {
    test('should manually unlock an identifier', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      }

      let result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(false);

      // Manually unlock
      RateLimitService.unlock('test@example.com', 'auth.login');

      // Should now be allowed
      result = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      expect(result.allowed).toBe(true);
    });
  });

  describe('getStats', () => {
    test('should return current statistics', () => {
      // Make some requests
      RateLimitService.checkRateLimit('test@example.com', 'auth.login');
      RateLimitService.checkRateLimit('user123', 'api.read');

      const stats = RateLimitService.getStats();
      
      expect(stats).toHaveProperty('activeRequests');
      expect(stats).toHaveProperty('activeLockouts');
      expect(stats).toHaveProperty('totalEntries');
      expect(stats.totalEntries).toBeGreaterThan(0);
    });
  });
});

describe('withRateLimit', () => {
  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    store.clear();
  });

  test('should wrap function with rate limiting', async () => {
    let callCount = 0;
    
    const mockFn = async (email) => {
      callCount++;
      return { success: true, email };
    };

    const wrappedFn = withRateLimit(mockFn, 'auth.login', getEmailFromArgs);

    // First call should succeed
    const result1 = await wrappedFn('test@example.com');
    expect(result1.success).toBe(true);
    expect(callCount).toBe(1);

    // Second call should succeed
    const result2 = await wrappedFn('test@example.com');
    expect(result2.success).toBe(true);
    expect(callCount).toBe(2);
  });

  test('should throw rate limit error when limit exceeded', async () => {
    let callCount = 0;
    
    const mockFn = async (email) => {
      callCount++;
      return { success: true };
    };

    const wrappedFn = withRateLimit(mockFn, 'auth.login', getEmailFromArgs);

    // Make 5 calls to hit the limit
    for (let i = 0; i < 5; i++) {
      await wrappedFn('test@example.com');
    }

    // 6th call should throw
    await expect(wrappedFn('test@example.com')).rejects.toThrow('RATE_LIMIT_EXCEEDED');
    
    // Original function should only be called 5 times
    expect(callCount).toBe(5);
  });

  test('should record success on successful auth operations', async () => {
    const mockFn = async (email) => {
      return { success: true };
    };

    const wrappedFn = withRateLimit(mockFn, 'auth.login', getEmailFromArgs);

    // Hit the limit
    for (let i = 0; i < 5; i++) {
      await wrappedFn('test@example.com');
    }

    // Should be blocked
    await expect(wrappedFn('test@example.com')).rejects.toThrow();

    // Record success manually (simulating successful login)
    RateLimitService.recordSuccess('test@example.com', 'auth.login');

    // Should now be allowed again
    const result = await wrappedFn('test@example.com');
    expect(result.success).toBe(true);
  });

  test('should not record success when function throws error', async () => {
    const mockFn = async (email) => {
      throw new Error('Authentication failed');
    };

    const wrappedFn = withRateLimit(mockFn, 'auth.login', getEmailFromArgs);

    // Make a call that fails
    await expect(wrappedFn('test@example.com')).rejects.toThrow('Authentication failed');

    // Should still be able to make another call (not recorded as success)
    const result = await wrappedFn('test@example.com');
    expect(result).toBeDefined();
  });
});

describe('Integration Tests', () => {
  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    store.clear();
  });

  test('should handle multiple different identifiers independently', () => {
    // Make requests for different users
    RateLimitService.checkRateLimit('user1@example.com', 'auth.login');
    RateLimitService.checkRateLimit('user2@example.com', 'auth.login');
    RateLimitService.checkRateLimit('user3@example.com', 'auth.login');

    // Each should have their own count
    const result1 = RateLimitService.checkRateLimit('user1@example.com', 'auth.login');
    const result2 = RateLimitService.checkRateLimit('user2@example.com', 'auth.login');
    const result3 = RateLimitService.checkRateLimit('user3@example.com', 'auth.login');

    expect(result1.remaining).toBe(4);
    expect(result2.remaining).toBe(4);
    expect(result3.remaining).toBe(4);
  });

  test('should handle different endpoint types independently', () => {
    // Hit auth.login limit
    for (let i = 0; i < 5; i++) {
      RateLimitService.checkRateLimit('test@example.com', 'auth.login');
    }

    // auth.login should be blocked
    let authResult = RateLimitService.checkRateLimit('test@example.com', 'auth.login');
    expect(authResult.allowed).toBe(false);

    // But api.read should still work
    const apiResult = RateLimitService.checkRateLimit('test@example.com', 'api.read');
    expect(apiResult.allowed).toBe(true);
  });

  test('should cleanup expired entries', () => {
    // Make some requests
    RateLimitService.checkRateLimit('test@example.com', 'auth.login');
    RateLimitService.checkRateLimit('user123', 'api.read');

    let stats = RateLimitService.getStats();
    expect(stats.totalEntries).toBeGreaterThan(0);

    // Manually trigger cleanup
    store.cleanup();

    // Entries should still exist (not expired yet)
    stats = RateLimitService.getStats();
    expect(stats.totalEntries).toBeGreaterThan(0);
  });
});

describe('Edge Cases', () => {
  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    store.clear();
  });

  test('should handle invalid endpoint type gracefully', () => {
    const result = RateLimitService.checkRateLimit('test@example.com', 'invalid.endpoint');
    
    // Should allow with no limit (default behavior)
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(Infinity);
  });

  test('should handle empty identifier', () => {
    const result = RateLimitService.checkRateLimit('', 'auth.login');
    
    expect(result).toBeDefined();
    expect(result.allowed).toBe(true);
  });

  test('should handle rapid successive requests', async () => {
    const mockFn = async (email) => ({ success: true });
    const wrappedFn = withRateLimit(mockFn, 'auth.login', getEmailFromArgs);

    // Make 5 rapid requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(wrappedFn('test@example.com'));
    }

    const results = await Promise.all(promises);
    
    // All should succeed
    results.forEach(result => {
      expect(result.success).toBe(true);
    });

    // 6th request should fail
    await expect(wrappedFn('test@example.com')).rejects.toThrow();
  });
});
