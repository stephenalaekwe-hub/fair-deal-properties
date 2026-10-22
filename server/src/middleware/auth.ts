import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
      req.cookies?.fdp_token;

    if (!token) {
      res.status(401).json({ ok: false, error: 'Authentication required. No token provided.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fdp-default-secret';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: Role };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, active: true },
    });

    if (!user || !user.active) {
      res.status(401).json({ ok: false, error: 'User account not found or deactivated.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Invalid or expired token.' });
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ ok: false, error: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        ok: false,
        error: `Access denied. Requires one of [${roles.join(', ')}] permissions.`,
      });
      return;
    }

    next();
  };
};
