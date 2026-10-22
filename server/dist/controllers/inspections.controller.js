"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAgentToInspection = exports.updateInspectionStage = exports.getAdminInspections = exports.trackInspection = exports.requestInspection = void 0;
const db_1 = require("../config/db");
const email_service_1 = require("../services/email.service");
const notification_service_1 = require("../services/notification.service");
const shared_1 = require("@fdp/shared");
const requestInspection = async (req, res) => {
    try {
        const { clientName, clientEmail, clientPhone, propertyTitle, propertyLocation, preferredDate, notes } = req.body;
        if (!clientName || !clientEmail || !clientPhone || !propertyTitle) {
            res.status(400).json({ ok: false, error: 'Name, email, phone and property details are required.' });
            return;
        }
        // Generate reference code: FDP-INS-YYYY-XXXX
        const year = new Date().getFullYear();
        const count = await db_1.prisma.inspection.count();
        const reference = `FDP-INS-${year}-${String(count + 1).padStart(4, '0')}`;
        const inspection = await db_1.prisma.inspection.create({
            data: {
                reference,
                clientName,
                clientEmail,
                clientPhone,
                propertyTitle,
                propertyLocation: propertyLocation || 'Abuja',
                stage: 1, // Instruction & Scope
                scheduledDate: preferredDate ? new Date(preferredDate) : undefined,
                notes,
            },
        });
        // Alert admins
        await notification_service_1.notificationService.alertAdmins({
            title: `New Inspection Request: ${reference}`,
            message: `${clientName} requested an inspection for "${propertyTitle}" (${propertyLocation}).`,
            type: 'INSPECTION',
            link: `/admin/inspections?ref=${reference}`,
        });
        // Send confirmation to client
        await email_service_1.emailService.notifyInspectionStageUpdate(clientEmail, clientName, reference, 1, 'Instruction & Scope Initiated');
        res.status(201).json({
            ok: true,
            data: {
                reference,
                message: 'Inspection request submitted successfully. Check your email for your tracking reference.',
            },
        });
    }
    catch (err) {
        console.error('RequestInspection error:', err);
        res.status(500).json({ ok: false, error: 'Failed to submit inspection request.' });
    }
};
exports.requestInspection = requestInspection;
const trackInspection = async (req, res) => {
    try {
        const { reference } = req.params;
        const inspection = await db_1.prisma.inspection.findUnique({
            where: { reference: reference.toUpperCase().trim() },
            select: {
                reference: true,
                propertyTitle: true,
                propertyLocation: true,
                stage: true,
                officerName: true,
                scheduledDate: true,
                reportUrl: true,
                updatedAt: true,
            },
        });
        if (!inspection) {
            res.status(404).json({ ok: false, error: 'Inspection reference not found.' });
            return;
        }
        const stageInfo = shared_1.INSPECTION_PIPELINE_STAGES.find((s) => s.stage === inspection.stage);
        res.json({
            ok: true,
            data: {
                ...inspection,
                stageTitle: stageInfo?.title || `Stage ${inspection.stage}`,
                stageDescription: stageInfo?.description || '',
                totalStages: 9,
            },
        });
    }
    catch (err) {
        console.error('TrackInspection error:', err);
        res.status(500).json({ ok: false, error: 'Failed to look up inspection reference.' });
    }
};
exports.trackInspection = trackInspection;
// ─── Admin Controller Actions ────────────────────────────────────────────────
const getAdminInspections = async (req, res) => {
    try {
        const { stage, agentId } = req.query;
        const where = {};
        if (stage)
            where.stage = parseInt(stage);
        if (agentId)
            where.assignedAgentId = String(agentId);
        // If logged in as AGENT, only show inspections assigned to them
        if (req.user?.role === 'AGENT') {
            where.assignedAgentId = req.user.id;
        }
        const inspections = await db_1.prisma.inspection.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                assignedAgent: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        res.json({ ok: true, data: inspections });
    }
    catch (err) {
        console.error('GetAdminInspections error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve inspections.' });
    }
};
exports.getAdminInspections = getAdminInspections;
const updateInspectionStage = async (req, res) => {
    try {
        const { id } = req.params;
        const { stage, officerName, reportUrl, notes, scheduledDate, notifyClient } = req.body;
        const inspection = await db_1.prisma.inspection.findUnique({ where: { id } });
        if (!inspection) {
            res.status(404).json({ ok: false, error: 'Inspection not found.' });
            return;
        }
        const newStage = stage !== undefined ? Number(stage) : inspection.stage;
        const updated = await db_1.prisma.inspection.update({
            where: { id },
            data: {
                stage: newStage,
                officerName: officerName !== undefined ? officerName : inspection.officerName,
                reportUrl: reportUrl !== undefined ? reportUrl : inspection.reportUrl,
                notes: notes !== undefined ? notes : inspection.notes,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : inspection.scheduledDate,
            },
        });
        const stageInfo = shared_1.INSPECTION_PIPELINE_STAGES.find((s) => s.stage === newStage);
        if (notifyClient !== false && inspection.clientEmail) {
            await email_service_1.emailService.notifyInspectionStageUpdate(inspection.clientEmail, inspection.clientName, inspection.reference, newStage, stageInfo?.title || `Stage ${newStage}`, reportUrl || inspection.reportUrl || undefined);
        }
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('UpdateInspectionStage error:', err);
        res.status(500).json({ ok: false, error: 'Failed to update inspection stage.' });
    }
};
exports.updateInspectionStage = updateInspectionStage;
const assignAgentToInspection = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;
        const inspection = await db_1.prisma.inspection.findUnique({ where: { id } });
        if (!inspection) {
            res.status(404).json({ ok: false, error: 'Inspection not found.' });
            return;
        }
        const agent = agentId ? await db_1.prisma.user.findUnique({ where: { id: agentId } }) : null;
        const updated = await db_1.prisma.inspection.update({
            where: { id },
            data: { assignedAgentId: agentId || null },
            include: { assignedAgent: true },
        });
        if (agent && agent.email) {
            await email_service_1.emailService.notifyAgentAssigned(agent.email, agent.name, 'Site Inspection', inspection.reference, inspection.clientName);
        }
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('AssignAgentToInspection error:', err);
        res.status(500).json({ ok: false, error: 'Failed to assign agent to inspection.' });
    }
};
exports.assignAgentToInspection = assignAgentToInspection;
