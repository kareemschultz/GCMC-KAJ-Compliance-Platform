import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

/**
 * Sanitize plain text to remove potentially dangerous characters
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return ''

  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim()
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''

  return email.toLowerCase().trim()
}

/**
 * Sanitize phone numbers (keep only digits, spaces, +, -, (, ))
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''

  return phone.replace(/[^0-9+\-\s()]/g, '').trim()
}

/**
 * Sanitize SQL input (basic protection, should use parameterized queries)
 */
export function sanitizeForDatabase(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .trim()
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return ''

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * Sanitize file names for upload
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return ''

  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Replace invalid characters with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 255) // Limit length
}

/**
 * Escape RegExp special characters
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}