"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeSubmission = exports.assignAgentToSubmission = exports.getAdminSubmissions = exports.submitForm = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const email_service_1 = require("../services/email.service");
const notification_service_1 = require("../services/notification.service");
const hashIp = (ip) => {
    if (!ip)
        return null;
    const salt = process.env.FDP_IP_SALT || 'fdp-ip-hash-salt';
    return crypto_1.default.createHash('sha256').update(ip + salt).digest('hex').substring(0, 16);
};
const submitForm = async (req, res) => {
    try {
        const { collection } = req.params;
        const validCollections = [
            'contact', 'enquiry', 'alert', 'newsletter', 'inspection', 'dsr', 'snag',
        ];
        if (!validCollections.includes(collection)) {
            res.status(400).json({ ok: false, error: 'Invalid submission collection.' });
            return;
        }
        const payload = req.body;
        const clientName = payload.name || payload.fullName || payload.clientName;
        const clientEmail = payload.email || payload.clientEmail;
        const clientPhone = payload.phone || payload.clientPhone;
        const count = await db_1.prisma.submission.count({ where: { collection: collection } });
        const prefix = collection.toUpperCase().substring(0, 3);
        const reference = `FDP-${prefix}-${Date.now().toString(36).toUpperCase()}-${String(count + 1).padStart(3, '0')}`;
        // For DSR (NDPA 2023), response clock is 30 days
        let dueAt;
        if (collection === 'dsr') {
            dueAt = new Date();
            dueAt.setDate(dueAt.getDate() + 30);
        }
        const submission = await db_1.prisma.submission.create({
            data: {
                reference,
                collection: collection,
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
        await notification_service_1.notificationService.alertAdmins({
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
    }
    catch (err) {
        console.error('SubmitForm error:', err);
        res.status(500).json({ ok: false, error: 'Failed to process submission.' });
    }
};
exports.submitForm = submitForm;
const getAdminSubmissions = async (req, res) => {
    try {
        const { collection, agentId } = req.query;
        const where = {};
        if (collection)
            where.collection = collection;
        if (agentId)
            where.assignedAgentId = String(agentId);
        if (req.user?.role === 'AGENT') {
            where.assignedAgentId = req.user.id;
        }
        const submissions = await db_1.prisma.submission.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                assignedAgent: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        res.json({ ok: true, data: submissions });
    }
    catch (err) {
        console.error('GetAdminSubmissions error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve submissions.' });
    }
};
exports.getAdminSubmissions = getAdminSubmissions;
const assignAgentToSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;
        const submission = await db_1.prisma.submission.findUnique({ where: { id } });
        if (!submission) {
            res.status(404).json({ ok: false, error: 'Submission not found.' });
            return;
        }
        const agent = agentId ? await db_1.prisma.user.findUnique({ where: { id: agentId } }) : null;
        const updated = await db_1.prisma.submission.update({
            where: { id },
            data: { assignedAgentId: agentId || null },
            include: { assignedAgent: true },
        });
        if (agent && agent.email) {
            await email_service_1.emailService.notifyAgentAssigned(agent.email, agent.name, `Client Lead (${submission.collection})`, submission.reference, submission.clientName || undefined);
        }
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('AssignAgentToSubmission error:', err);
        res.status(500).json({ ok: false, error: 'Failed to assign agent.' });
    }
};
exports.assignAgentToSubmission = assignAgentToSubmission;
const closeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { outcome } = req.body;
        const updated = await db_1.prisma.submission.update({
            where: { id },
            data: {
                closedAt: new Date(),
                closedBy: req.user?.email || 'admin',
                outcome,
            },
        });
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('CloseSubmission error:', err);
        res.status(500).json({ ok: false, error: 'Failed to close submission.' });
    }
};
exports.closeSubmission = closeSubmission;
