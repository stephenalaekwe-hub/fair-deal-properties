import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isAgent = req.user?.role === 'AGENT';
    const agentFilter = isAgent ? { assignedAgentId: req.user?.id } : {};

    const [
      totalListings,
      totalInspections,
      activeInspections,
      completedInspections,
      totalSubmissions,
      pendingSubmissions,
      totalAgents,
      priceAlertsCount,
      recentInspections,
      recentSubmissions,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.inspection.count({ where: agentFilter }),
      prisma.inspection.count({ where: { ...agentFilter, stage: { lt: 9 } } }),
      prisma.inspection.count({ where: { ...agentFilter, stage: 9 } }),
      prisma.submission.count({ where: agentFilter }),
      prisma.submission.count({ where: { ...agentFilter, closedAt: null } }),
      prisma.user.count({ where: { role: 'AGENT', active: true } }),
      prisma.scrapedPriceLog.count({ where: { status: 'DETECTED' } }),
      prisma.inspection.findMany({
        where: agentFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { assignedAgent: { select: { name: true } } },
      }),
      prisma.submission.findMany({
        where: agentFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { assignedAgent: { select: { name: true } } },
      }),
    ]);

    res.json({
      ok: true,
      data: {
        totalListings,
        totalInspections,
        activeInspections,
        completedInspections,
        totalSubmissions,
        pendingSubmissions,
        totalAgents,
        priceAlertsCount,
        recentInspections,
        recentSubmissions,
      },
    });
  } catch (err) {
    console.error('GetDashboardStats error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve dashboard analytics.' });
  }
};
