"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerListenerNow = exports.applyScrapedLog = exports.getScrapedLogs = exports.updateFinancingRoute = exports.compareFinancing = exports.getFinancingRoutes = void 0;
const db_1 = require("../config/db");
const priceListener_1 = require("../jobs/priceListener");
const getFinancingRoutes = async (req, res) => {
    try {
        const routes = await db_1.prisma.financingRoute.findMany({
            orderBy: { id: 'asc' },
        });
        res.json({ ok: true, data: routes });
    }
    catch (err) {
        console.error('GetFinancingRoutes error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve financing routes.' });
    }
};
exports.getFinancingRoutes = getFinancingRoutes;
const compareFinancing = async (req, res) => {
    try {
        const { propertyValueMillions, downPaymentPercent, termYears } = req.body;
        const pv = Number(propertyValueMillions) || 50;
        const dpPct = Number(downPaymentPercent) || 20;
        const yr = Number(termYears) || 15;
        const routes = await db_1.prisma.financingRoute.findMany();
        const comparisons = routes.map((r) => {
            const ratePct = r.interestRatePct ? Number(r.interestRatePct) : null;
            const effectiveTerm = Math.min(yr, r.maxTermYears || yr);
            const minEq = r.minEquityPct ? Number(r.minEquityPct) : 0;
            const actualDp = Math.max(dpPct, minEq);
            const loanAmount = pv * (1 - actualDp / 100);
            let monthlyRepaymentMillions = null;
            let totalCostMillions = null;
            if (ratePct !== null && ratePct > 0) {
                const monthlyRate = ratePct / 100 / 12;
                const totalMonths = effectiveTerm * 12;
                const factor = Math.pow(1 + monthlyRate, totalMonths);
                monthlyRepaymentMillions = (loanAmount * monthlyRate * factor) / (factor - 1);
                totalCostMillions = monthlyRepaymentMillions * totalMonths + (pv * actualDp) / 100;
            }
            return {
                id: r.id,
                name: r.name,
                institution: r.institution,
                interestRatePct: ratePct,
                minEquityPct: minEq,
                maxTermYears: r.maxTermYears,
                appliedTermYears: effectiveTerm,
                appliedDownPaymentPct: actualDp,
                loanAmountMillions: loanAmount,
                monthlyRepaymentMillions,
                totalCostMillions,
                lastVerified: r.lastVerified,
                verificationNote: r.verificationNote,
            };
        });
        res.json({ ok: true, data: comparisons });
    }
    catch (err) {
        console.error('CompareFinancing error:', err);
        res.status(500).json({ ok: false, error: 'Failed to run mortgage comparison.' });
    }
};
exports.compareFinancing = compareFinancing;
// ─── Admin Rate & Scraper Management ─────────────────────────────────────────
const updateFinancingRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { interestRatePct, minEquityPct, maxTermYears, verificationNote, isAutoSynced } = req.body;
        const updated = await db_1.prisma.financingRoute.update({
            where: { id },
            data: {
                interestRatePct: interestRatePct !== undefined ? Number(interestRatePct) : undefined,
                minEquityPct: minEquityPct !== undefined ? Number(minEquityPct) : undefined,
                maxTermYears: maxTermYears !== undefined ? Number(maxTermYears) : undefined,
                verificationNote,
                isAutoSynced,
                lastVerified: new Date().toISOString().split('T')[0],
            },
        });
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('UpdateFinancingRoute error:', err);
        res.status(500).json({ ok: false, error: 'Failed to update financing route.' });
    }
};
exports.updateFinancingRoute = updateFinancingRoute;
const getScrapedLogs = async (req, res) => {
    try {
        const logs = await db_1.prisma.scrapedPriceLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json({ ok: true, data: logs });
    }
    catch (err) {
        console.error('GetScrapedLogs error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve scraper logs.' });
    }
};
exports.getScrapedLogs = getScrapedLogs;
const applyScrapedLog = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await db_1.prisma.scrapedPriceLog.findUnique({ where: { id } });
        if (!log) {
            res.status(404).json({ ok: false, error: 'Log entry not found.' });
            return;
        }
        if (log.targetType === 'MORTGAGE_RATE') {
            const numericRate = parseFloat(log.newValue.replace('%', ''));
            await db_1.prisma.financingRoute.update({
                where: { id: log.targetReference },
                data: {
                    interestRatePct: numericRate,
                    lastVerified: new Date().toISOString().split('T')[0],
                    verificationNote: `Updated automatically from ${log.sourceName}`,
                },
            });
        }
        else if (log.targetType === 'LISTING') {
            const numericPrice = parseFloat(log.newValue.replace(/[^0-9.]/g, ''));
            await db_1.prisma.listing.update({
                where: { slug: log.targetReference },
                data: {
                    priceMillionsNGN: numericPrice,
                    priceDisplay: `₦${numericPrice}M`,
                },
            });
        }
        const updated = await db_1.prisma.scrapedPriceLog.update({
            where: { id },
            data: { status: 'APPLIED', appliedAt: new Date() },
        });
        res.json({ ok: true, data: updated, message: 'Detected value applied to live database.' });
    }
    catch (err) {
        console.error('ApplyScrapedLog error:', err);
        res.status(500).json({ ok: false, error: 'Failed to apply scraped value.' });
    }
};
exports.applyScrapedLog = applyScrapedLog;
const triggerListenerNow = async (req, res) => {
    try {
        const result = await priceListener_1.priceListenerJob.runAllChecks();
        res.json({ ok: true, data: result, message: 'Price listener scan executed successfully.' });
    }
    catch (err) {
        console.error('TriggerListenerNow error:', err);
        res.status(500).json({ ok: false, error: 'Failed to trigger price listener.' });
    }
};
exports.triggerListenerNow = triggerListenerNow;
