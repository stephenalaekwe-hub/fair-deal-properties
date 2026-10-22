import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { prisma } from './config/db';
import { priceListenerJob } from './jobs/priceListener';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Static uploads serving (photos only)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  }
  next();
});

// ─── Mount Master API ────────────────────────────────────────────────────────
app.use('/api/v1', routes);

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
  priceListenerJob.initScheduler();
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = async () => {
  console.log('\n🛑 Gracefully shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Prisma client disconnected. Server exited cleanly.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
