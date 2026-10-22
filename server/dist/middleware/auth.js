"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
            req.cookies?.fdp_token;
        if (!token) {
            res.status(401).json({ ok: false, error: 'Authentication required. No token provided.' });
            return;
        }
        const secret = process.env.JWT_SECRET || 'fdp-default-secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true, role: true, active: true },
        });
        if (!user || !user.active) {
            res.status(401).json({ ok: false, error: 'User account not found or deactivated.' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ ok: false, error: 'Invalid or expired token.' });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
