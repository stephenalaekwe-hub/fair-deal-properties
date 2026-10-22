import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { Role } from '@prisma/client';

export const getAgents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: { in: ['AGENT', 'ADMIN'] } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            assignedListings: true,
            assignedInspections: true,
            assignedSubmissions: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ ok: true, data: agents });
  } catch (err) {
    console.error('GetAgents error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve agents.' });
  }
};

export const createAgent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ ok: false, error: 'Name, email and password are required.' });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      res.status(409).json({ ok: false, error: 'User with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        role: (role as Role) || 'AGENT',
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    res.status(201).json({ ok: true, data: user });
  } catch (err) {
    console.error('CreateAgent error:', err);
    res.status(500).json({ ok: false, error: 'Failed to create agent account.' });
  }
};

export const updateAgentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { active, role, phone, name } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: { active, role, phone, name },
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('UpdateAgentStatus error:', err);
    res.status(500).json({ ok: false, error: 'Failed to update agent.' });
  }
};
