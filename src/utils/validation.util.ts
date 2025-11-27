import { z } from 'zod';

export class ValidationUtil {
  /**
   * Validates if a string is a valid UUID
   */
  static isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  /**
   * Validates if a date string is valid
   */
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validates if an amount is a valid number
   */
  static isValidAmount(amount: any): boolean {
    return typeof amount === 'number' && !isNaN(amount) && isFinite(amount);
  }

  /**
   * Sanitizes a string (removes dangerous characters)
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  static isStrongPassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates array of tags
   */
  static validateTags(tags: any): string[] {
    if (!Array.isArray(tags)) {
      return [];
    }
    return tags
      .filter((tag) => typeof tag === 'string')
      .map((tag) => this.sanitizeString(tag))
      .filter((tag) => tag.length > 0);
  }

  /**
   * Parses query parameters for pagination
   */
  static parsePaginationParams(query: any): {
    page: number;
    limit: number;
    skip: number;
  } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Formats error messages from Zod
   */
  static formatZodErrors(errors: z.ZodError): string[] {
    return errors.errors.map((err) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });
  }
}