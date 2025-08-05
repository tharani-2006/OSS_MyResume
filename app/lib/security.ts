/**
 * Security utilities for input validation, sanitization, and protection
 */

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  identifier: string;
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiting implementation
 */
export function rateLimit(config: RateLimitConfig): boolean {
  const now = Date.now();
  const key = config.identifier;
  const window = rateLimitStore.get(key);

  if (!window || now > window.resetTime) {
    // Reset window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  }

  if (window.count >= config.maxRequests) {
    return false; // Rate limit exceeded
  }

  window.count++;
  return true;
}

/**
 * Input sanitization functions
 */
export const sanitize = {
  /**
   * Sanitize HTML content to prevent XSS
   */
  html: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Sanitize email addresses
   */
  email: (email: string): string => {
    return email.toLowerCase().trim().replace(/[^\w@.-]/g, '');
  },

  /**
   * Sanitize names (allow letters, spaces, hyphens, apostrophes)
   */
  name: (name: string): string => {
    return name.trim().replace(/[^a-zA-Z\s'-]/g, '');
  },

  /**
   * Sanitize phone numbers
   */
  phone: (phone: string): string => {
    return phone.replace(/[^\d+()-\s]/g, '');
  },

  /**
   * Sanitize URLs
   */
  url: (url: string): string => {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }
      return parsed.toString();
    } catch {
      return '';
    }
  },

  /**
   * Remove potentially dangerous characters from general text
   */
  text: (text: string): string => {
    return text
      .trim()
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/[<>]/g, ''); // Remove angle brackets
  },
};

/**
 * Input validation functions
 */
export const validate = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * Validate name (2-50 characters, letters, spaces, hyphens, apostrophes)
   */
  name: (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
  },

  /**
   * Validate phone number
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^[\d+()-\s]{10,20}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate message length and content
   */
  message: (message: string): boolean => {
    return message.trim().length >= 10 && message.trim().length <= 2000;
  },

  /**
   * Validate URL format
   */
  url: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Check for common SQL injection patterns
   */
  noSqlInjection: (input: string): boolean => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|'|"|`)/,
      /(\bOR\b|\bAND\b).*[=<>]/i,
    ];
    return !sqlPatterns.some(pattern => pattern.test(input));
  },

  /**
   * Check for XSS patterns
   */
  noXSS: (input: string): boolean => {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe\b/i,
      /<object\b/i,
      /<embed\b/i,
      /<link\b/i,
      /<meta\b/i,
    ];
    return !xssPatterns.some(pattern => pattern.test(input));
  },
};

/**
 * CSRF token generation and validation
 */
export const csrf = {
  /**
   * Generate a CSRF token
   */
  generateToken: (): string => {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Store CSRF token in session storage
   */
  storeToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', token);
    }
  },

  /**
   * Get CSRF token from session storage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('csrf_token');
    }
    return null;
  },

  /**
   * Validate CSRF token
   */
  validateToken: (token: string): boolean => {
    const storedToken = csrf.getToken();
    return storedToken !== null && storedToken === token;
  },
};

/**
 * Security headers for API responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Content Security Policy nonce generation
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return btoa(String.fromCharCode(...array));
}

/**
 * Secure form data processing
 */
export function processFormData(formData: Record<string, any>): {
  isValid: boolean;
  sanitizedData: Record<string, any>;
  errors: string[];
} {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};

  // Process each field
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value !== 'string') {
      errors.push(`Invalid data type for field: ${key}`);
      continue;
    }

    // Security checks
    if (!validate.noSqlInjection(value)) {
      errors.push(`Potential SQL injection detected in field: ${key}`);
      continue;
    }

    if (!validate.noXSS(value)) {
      errors.push(`Potential XSS detected in field: ${key}`);
      continue;
    }

    // Field-specific validation and sanitization
    switch (key) {
      case 'email':
        const sanitizedEmail = sanitize.email(value);
        if (!validate.email(sanitizedEmail)) {
          errors.push('Invalid email format');
        } else {
          sanitizedData[key] = sanitizedEmail;
        }
        break;

      case 'name':
        const sanitizedName = sanitize.name(value);
        if (!validate.name(sanitizedName)) {
          errors.push('Invalid name format');
        } else {
          sanitizedData[key] = sanitizedName;
        }
        break;

      case 'phone':
        const sanitizedPhone = sanitize.phone(value);
        if (sanitizedPhone && !validate.phone(sanitizedPhone)) {
          errors.push('Invalid phone format');
        } else {
          sanitizedData[key] = sanitizedPhone;
        }
        break;

      case 'message':
        const sanitizedMessage = sanitize.text(value);
        if (!validate.message(sanitizedMessage)) {
          errors.push('Message must be between 10 and 2000 characters');
        } else {
          sanitizedData[key] = sanitizedMessage;
        }
        break;

      default:
        sanitizedData[key] = sanitize.text(value);
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedData,
    errors,
  };
}
