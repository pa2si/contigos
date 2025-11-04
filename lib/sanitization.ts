/**
 * Input sanitization utilities for enhanced security
 * Designed for Next.js 16 with proxy.ts
 */

/**
 * Sanitize string input by trimming and escaping HTML
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 255); // Limit length to prevent DoS
}

/**
 * Sanitize and validate numeric input
 */
export function sanitizeNumber(
  input: string | number,
  options: {
    min?: number;
    max?: number;
    allowNegative?: boolean;
  } = {}
): number {
  const {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    allowNegative = false,
  } = options;

  let num: number;

  if (typeof input === 'string') {
    // Remove any non-numeric characters except decimal point and minus
    const cleaned = input.replace(/[^0-9.-]/g, '');
    num = parseFloat(cleaned);
  } else {
    num = input;
  }

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number format');
  }

  if (!allowNegative && num < 0) {
    throw new Error('Negative numbers not allowed');
  }

  if (num < min || num > max) {
    throw new Error(`Number must be between ${min} and ${max}`);
  }

  return num;
}

/**
 * Validate and sanitize beschreibung field
 */
export function sanitizeBeschreibung(input: string): string {
  const sanitized = sanitizeString(input);

  if (sanitized.length === 0) {
    throw new Error('Description cannot be empty');
  }

  if (sanitized.length > 100) {
    throw new Error('Description too long (max 100 characters)');
  }

  return sanitized;
}

/**
 * Sanitize monetary amount
 */
export function sanitizeBetrag(input: number): number {
  return sanitizeNumber(input, {
    min: 0.01,
    max: 1000000,
    allowNegative: false,
  });
}

/**
 * Validate enum values against allowed list
 */
export function validateEnum<T extends string>(
  input: T,
  allowedValues: T[],
  fieldName: string
): T {
  if (!allowedValues.includes(input)) {
    throw new Error(
      `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}`
    );
  }
  return input;
}
