"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ ok: false, error: 'Email and password are required.' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
        if (!user || !user.active) {
            res.status(401).json({ ok: false, error: 'Invalid credentials or inactive account.' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ ok: false, error: 'Invalid credentials.' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'fdp-default-secret';
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });
        // Set HTTP-only secure cookie
        res.cookie('fdp_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            ok: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    avatarUrl: user.avatarUrl,
                },
            },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ ok: false, error: 'Internal server error during login.' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ ok: false, error: 'Unauthorized.' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatarUrl: true,
                createdAt: true,
            },
        });
        res.json({ ok: true, data: user });
    }
    catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ ok: false, error: 'Failed to fetch user profile.' });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    res.clearCookie('fdp_token');
    res.json({ ok: true, message: 'Logged out successfully.' });
};
exports.logout = logout;
