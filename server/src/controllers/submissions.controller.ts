import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { emailService } from '../services/email.service';
import { notificationService } from '../services/notification.service';
import { SubmissionCollection } from '@prisma/client';

const hashIp = (ip: string | undefined): string | null => {
  if (!ip) return null;
  const salt = process.env.FDP_IP_SALT || 'fdp-ip-hash-salt';
  return crypto.createHash('sha256').update(ip + salt).digest('hex').substring(0, 16);
};

export const submitForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collection } = req.params;
    const validCollections: SubmissionCollection[] = [
      'contact', 'enquiry', 'alert', 'newsletter', 'inspection', 'dsr', 'snag',
    ];

    if (!validCollections.includes(collection as SubmissionCollection)) {
      res.status(400).json({ ok: false, error: 'Invalid submission collection.' });
      return;
    }

    const payload = req.body;
    const clientName = payload.name || payload.fullName || payload.clientName;
    const clientEmail = payload.email || payload.clientEmail;
    const clientPhone = payload.phone || payload.clientPhone;

    const count = await prisma.submission.count({ where: { collection: collection as SubmissionCollection } });
    const prefix = collection.toUpperCase().substring(0, 3);
    const reference = `FDP-${prefix}-${Date.now().toString(36).toUpperCase()}-${String(count + 1).padStart(3, '0')}`;

    // For DSR (NDPA 2023), response clock is 30 days
    let dueAt: Date | undefined;
    if (collection === 'dsr') {
      dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 30);
    }

    const submission = await prisma.submission.create({
      data: {
        reference,
        collection: collection as SubmissionCollection,
        clientName,
        clientEmail,
        clientPhone,
        payload,
        dueAt,
        ipHash: hashIp(req.ip),
        userAgent: req.headers['user-agent'] || null,
      },
    });

    // Alert admins
    await notificationService.alertAdmins({
      title: `New ${collection.toUpperCase()} Submission: ${reference}`,
      message: `${clientName || 'A user'} submitted a ${collection} form. Reference: ${reference}.`,
      type: 'LEAD',
      link: `/admin/submissions?ref=${reference}`,
    });

    res.status(201).json({
      ok: true,
      data: {
        reference,
        message: 'Submission received and recorded securely.',
        dueAt: dueAt ? dueAt.toISOString() : undefined,
      },
    });
  } catch (err) {
    console.error('SubmitForm error:', err);
    res.status(500).json({ ok: false, error: 'Failed to process submission.' });
  }
};

export const getAdminSubmissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { collection, agentId } = req.query;
    const where: any = {};

    if (collection) where.collection = collection as SubmissionCollection;
    if (agentId) where.assignedAgentId = String(agentId);

    if (req.user?.role === 'AGENT') {
      where.assignedAgentId = req.user.id;
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedAgent: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    res.json({ ok: true, data: submissions });
  } catch (err) {
    console.error('GetAdminSubmissions error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve submissions.' });
  }
};

export const assignAgentToSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) {
      res.status(404).json({ ok: false, error: 'Submission not found.' });
      return;
    }

    const agent = agentId ? await prisma.user.findUnique({ where: { id: agentId } }) : null;

    const updated = await prisma.submission.update({
      where: { id },
      data: { assignedAgentId: agentId || null },
      include: { assignedAgent: true },
    });

    if (agent && agent.email) {
      await emailService.notifyAgentAssigned(
        agent.email,
        agent.name,
        `Client Lead (${submission.collection})`,
        submission.reference,
        submission.clientName || undefined
      );
    }

    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('AssignAgentToSubmission error:', err);
    res.status(500).json({ ok: false, error: 'Failed to assign agent.' });
  }
};

export const closeSubmission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { outcome } = req.body;

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        closedAt: new Date(),
        closedBy: req.user?.email || 'admin',
        outcome,
      },
    });

    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('CloseSubmission error:', err);
    res.status(500).json({ ok: false, error: 'Failed to close submission.' });
  }
};
