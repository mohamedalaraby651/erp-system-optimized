// ============================================
// JWT Utilities
// ============================================

import { sign, verify } from 'hono/jwt';

const JWT_SECRET = 'your-secret-key-change-in-production-2025';
const JWT_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  roleId: number;
  exp?: number;
  iat?: number;
}

export async function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRATION,
  };
  
  return await sign(tokenPayload, JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}
