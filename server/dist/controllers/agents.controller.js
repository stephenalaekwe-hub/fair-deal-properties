"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentStatus = exports.createAgent = exports.getAgents = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const getAgents = async (req, res) => {
    try {
        const agents = await db_1.prisma.user.findMany({
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
    }
    catch (err) {
        console.error('GetAgents error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve agents.' });
    }
};
exports.getAgents = getAgents;
const createAgent = async (req, res) => {
    try {
        const { name, email, phone, role, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ ok: false, error: 'Name, email and password are required.' });
            return;
        }
        const existing = await db_1.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
        if (existing) {
            res.status(409).json({ ok: false, error: 'User with this email already exists.' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                name,
                email: email.toLowerCase().trim(),
                phone,
                role: role || 'AGENT',
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
    }
    catch (err) {
        console.error('CreateAgent error:', err);
        res.status(500).json({ ok: false, error: 'Failed to create agent account.' });
    }
};
exports.createAgent = createAgent;
const updateAgentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { active, role, phone, name } = req.body;
        const updated = await db_1.prisma.user.update({
            where: { id },
            data: { active, role, phone, name },
            select: { id: true, name: true, email: true, role: true, active: true },
        });
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('UpdateAgentStatus error:', err);
        res.status(500).json({ ok: false, error: 'Failed to update agent.' });
    }
};
exports.updateAgentStatus = updateAgentStatus;
