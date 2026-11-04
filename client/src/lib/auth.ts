import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/db';
import { getTestAgentByEmail } from './agentsStore';

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
  const normEmail = email.toLowerCase().trim();
  const user = await getUserByEmail(normEmail);

  if (!user) {
    // Check against registered test user agents
    const testAgent = getTestAgentByEmail(normEmail);
    if (testAgent) {
      if (testAgent.role === 'SUPER_ADMIN' && passwordPlain === 'Admin@123456') {
        return {
          id: testAgent.id,
          name: testAgent.name,
          email: testAgent.email,
          role: testAgent.role,
          phone: testAgent.phone,
        };
      }
      if (testAgent.role === 'AGENT' && (passwordPlain === 'Agent@123456' || passwordPlain === 'Admin@123456')) {
        return {
          id: testAgent.id,
          name: testAgent.name,
          email: testAgent.email,
          role: testAgent.role,
          phone: testAgent.phone,
        };
      }
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
