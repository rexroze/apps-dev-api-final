import crypto from 'crypto';

// In-memory store
const tempTokenStore = new Map<string, { data: any; expiresAt: number }>();

const TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function generateTempToken(data: any): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + TOKEN_EXPIRY;
  
  tempTokenStore.set(token, { data, expiresAt });
  
  // Clean up expired tokens
  setTimeout(() => {
    tempTokenStore.delete(token);
  }, TOKEN_EXPIRY);
  
  return token;
}

export function exchangeTempToken(token: string): any | null {
  const stored = tempTokenStore.get(token);
  
  if (!stored) {
    return null; // Token not found
  }
  
  if (Date.now() > stored.expiresAt) {
    tempTokenStore.delete(token);
    return null; // Token expired
  }
  
  // Delete token after use (one-time use)
  tempTokenStore.delete(token);
  
  return stored.data;
}

