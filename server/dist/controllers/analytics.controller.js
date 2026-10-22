"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = require("../config/db");
const getDashboardStats = async (req, res) => {
    try {
        const isAgent = req.user?.role === 'AGENT';
        const agentFilter = isAgent ? { assignedAgentId: req.user?.id } : {};
        const [totalListings, totalInspections, activeInspections, completedInspections, totalSubmissions, pendingSubmissions, totalAgents, priceAlertsCount, recentInspections, recentSubmissions,] = await Promise.all([
            db_1.prisma.listing.count(),
            db_1.prisma.inspection.count({ where: agentFilter }),
            db_1.prisma.inspection.count({ where: { ...agentFilter, stage: { lt: 9 } } }),
            db_1.prisma.inspection.count({ where: { ...agentFilter, stage: 9 } }),
            db_1.prisma.submission.count({ where: agentFilter }),
            db_1.prisma.submission.count({ where: { ...agentFilter, closedAt: null } }),
            db_1.prisma.user.count({ where: { role: 'AGENT', active: true } }),
            db_1.prisma.scrapedPriceLog.count({ where: { status: 'DETECTED' } }),
            db_1.prisma.inspection.findMany({
                where: agentFilter,
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { assignedAgent: { select: { name: true } } },
            }),
            db_1.prisma.submission.findMany({
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
    }
    catch (err) {
        console.error('GetDashboardStats error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve dashboard analytics.' });
    }
};
exports.getDashboardStats = getDashboardStats;
