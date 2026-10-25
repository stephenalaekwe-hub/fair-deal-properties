import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fdp-jwt-secret-key-change-in-production-2026';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT';
  phone?: string;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function authenticateUser(email: string, passwordPlain: string): Promise<AuthUser | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    // Built-in emergency super admin fallback if DB not yet seeded
    if (email.toLowerCase() === 'admin@fdealproperties.com' && passwordPlain === 'Admin@123456') {
      return {
        id: 'admin-fallback-01',
        name: 'FDP Principal Admin',
        email: 'admin@fdealproperties.com',
        role: 'SUPER_ADMIN',
        phone: '+2349049924198',
      };
    }
    return null;
  }

  const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isValid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}
