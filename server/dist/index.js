"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const priceListener_1 = require("./jobs/priceListener");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
// ─── Middleware ──────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: [CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '15mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '15mb' }));
app.use((0, cookie_parser_1.default)());
// Static uploads serving (photos only)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// ─── Request Logging ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    }
    next();
});
// ─── Mount Master API ────────────────────────────────────────────────────────
app.use('/api/v1', routes_1.default);
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.path}` });
});
// ─── Start Server & Background Services ──────────────────────────────────────
const server = app.listen(PORT, () => {
    console.log(`
  ════════════════════════════════════════════════════════════════════════
  🏢 FAIR DEAL PROPERTIES LTD - REST API & ADMIN BACKEND
  📡 Server listening on:   http://localhost:${PORT}
  🌐 Client URL allowed:     ${CLIENT_URL}
  📦 Database Engine:        MySQL (via Prisma ORM)
  ════════════════════════════════════════════════════════════════════════
  `);
    // Start the background price listener cron job
    priceListener_1.priceListenerJob.initScheduler();
});
// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.close(async () => {
        await db_1.prisma.$disconnect();
        console.log('✅ Prisma client disconnected. Server exited cleanly.');
        process.exit(0);
    });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
