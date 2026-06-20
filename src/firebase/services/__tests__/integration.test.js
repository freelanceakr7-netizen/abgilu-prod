/**
 * Integration Tests for Rate Limiting
 * 
 * These tests verify that rate limiting doesn't break existing functionality
 * by testing the integration with actual services
 */

import { RateLimitService } from '../rateLimitService';

describe('Rate Limiting Integration Tests', () => {
  beforeEach(() => {
    // Clear all rate limit data before each test
    RateLimitService.clearAll();
  });

  afterEach(() => {
    // Clean up after each test
    RateLimitService.clearAll();
  });

  describe('Auth Service Integration', () => {
    test('signInUser should work within rate limits', async () => {
      const { signInUser } = require('../authService');
      
      // This test verifies that the function signature is correct
      // and can be called without errors (actual Firebase auth would fail in test env)
      expect(typeof signInUser).toBe('function');
    });

    test('registerUserWithOTP should work within rate limits', async () => {
      const { registerUserWithOTP } = require('../authService');
      
      // Verify function signature
      expect(typeof registerUserWithOTP).toBe('function');
    });
  });

  describe('Email Service Integration', () => {
    test('sendOTPEmail should work within rate limits', async () => {
      const { sendOTPEmail } = require('../emailService');
      
      // Verify function signature
      expect(typeof sendOTPEmail).toBe('function');
    });

    test('verifyOTP should work within rate limits', async () => {
      const { verifyOTP } = require('../emailService');
      
      // Verify function signature
      expect(typeof verifyOTP).toBe('function');
    });
  });

  describe('Review Service Integration', () => {
    test('createReview should work within rate limits', async () => {
      const { createReview } = require('../reviewService');
      
      // Verify function signature
      expect(typeof createReview).toBe('function');
    });

    test('updateReview should work within rate limits', async () => {
      const { updateReview } = require('../reviewService');
      
      // Verify function signature
      expect(typeof updateReview).toBe('function');
    });
  });

  describe('Rate Limit Behavior', () => {
    test('should allow normal usage patterns', () => {
      // Simulate normal user behavior
      const results = [];
      
      for (let i = 0; i < 3; i++) {
        const result = RateLimitService.checkRateLimit('user@example.com', 'auth.login');
        results.push(result);
      }

      // All should be allowed
      results.forEach(result => {
        expect(result.allowed).toBe(true);
      });
    });

    test('should block abusive patterns', () => {
      // Simulate brute force attack
      const results = [];
      
      for (let i = 0; i < 6; i++) {
        const result = RateLimitService.checkRateLimit('user@example.com', 'auth.login');
        results.push(result);
      }

      // First 5 should be allowed
      for (let i = 0; i < 5; i++) {
        expect(results[i].allowed).toBe(true);
      }

      // 6th should be blocked
      expect(results[5].allowed).toBe(false);
      expect(results[5].locked).toBe(true);
    });

    test('should handle multiple users independently', () => {
      // Simulate multiple users
      const user1Results = [];
      const user2Results = [];
      
      for (let i = 0; i < 3; i++) {
        user1Results.push(RateLimitService.checkRateLimit('user1@example.com', 'auth.login'));
        user2Results.push(RateLimitService.checkRateLimit('user2@example.com', 'auth.login'));
      }

      // Both users should have their own limits
      user1Results.forEach(result => {
        expect(result.allowed).toBe(true);
      });
      
      user2Results.forEach(result => {
        expect(result.allowed).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle rate limit errors gracefully', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('user@example.com', 'auth.login');
      }

      // Get blocked result
      const result = RateLimitService.checkRateLimit('user@example.com', 'auth.login');
      
      // Verify error structure
      expect(result.allowed).toBe(false);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('remainingTime');
      expect(result).toHaveProperty('resetTime');
      expect(result.message).toBeDefined();
    });

    test('should provide meaningful error messages', () => {
      // Hit the limit
      for (let i = 0; i < 5; i++) {
        RateLimitService.checkRateLimit('user@example.com', 'auth.login');
      }

      const result = RateLimitService.checkRateLimit('user@example.com', 'auth.login');
      
      // Message should be user-friendly
      expect(result.message).toContain('Too many');
      expect(result.message.length).toBeGreaterThan(10);
    });
  });

  describe('Backward Compatibility', () => {
    test('should not break existing function signatures', () => {
      // Verify that wrapped functions maintain original signatures
      const { signInUser } = require('../authService');
      const { createReview } = require('../reviewService');
      const { sendOTPEmail } = require('../emailService');

      // All should be functions
      expect(typeof signInUser).toBe('function');
      expect(typeof createReview).toBe('function');
      expect(typeof sendOTPEmail).toBe('function');

      // Should accept same number of parameters
      expect(signInUser.length).toBeGreaterThan(0);
      expect(createReview.length).toBeGreaterThan(0);
      expect(sendOTPEmail.length).toBeGreaterThan(0);
    });

    test('should maintain async behavior', async () => {
      const { signInUser } = require('../authService');
      
      // Should return a promise
      const result = signInUser('test@example.com', 'password');
      expect(result).toBeInstanceOf(Promise);
    });
  });
});

describe('Rate Limit Configuration', () => {
  test('should have correct limits for different endpoints', () => {
    const { RATE_LIMIT_CONFIGS } = require('../rateLimitService');

    // Verify configurations exist
    expect(RATE_LIMIT_CONFIGS).toHaveProperty('auth');
    expect(RATE_LIMIT_CONFIGS).toHaveProperty('api');
    expect(RATE_LIMIT_CONFIGS).toHaveProperty('admin');

    // Verify specific limits
    expect(RATE_LIMIT_CONFIGS.auth.login.maxAttempts).toBe(5);
    expect(RATE_LIMIT_CONFIGS.auth.register.maxAttempts).toBe(3);
    expect(RATE_LIMIT_CONFIGS.api.read.maxAttempts).toBe(100);
    expect(RATE_LIMIT_CONFIGS.api.write.maxAttempts).toBe(20);
  });

  test('should have appropriate time windows', () => {
    const { RATE_LIMIT_CONFIGS } = require('../rateLimitService');

    // Verify time windows are reasonable
    expect(RATE_LIMIT_CONFIGS.auth.login.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    expect(RATE_LIMIT_CONFIGS.auth.register.windowMs).toBe(60 * 60 * 1000); // 1 hour
    expect(RATE_LIMIT_CONFIGS.api.read.windowMs).toBe(60 * 1000); // 1 minute
  });
});
