import { createHash, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Generates a cryptographically secure opaque token (hex string).
 * The raw token is sent to the user; only the hash is stored in the database.
 */
export function generateOpaqueToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Hashes a token using SHA-256 for safe storage.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
export function safeCompare(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}
