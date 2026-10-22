import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import {
  getListings,
  getListingBySlug,
  createListing,
  updateListing,
  assignAgentToListing,
} from '../controllers/listings.controller';
import {
  requestInspection,
  trackInspection,
  getAdminInspections,
  updateInspectionStage,
  assignAgentToInspection,
} from '../controllers/inspections.controller';
import {
  submitForm,
  getAdminSubmissions,
  assignAgentToSubmission,
  closeSubmission,
} from '../controllers/submissions.controller';
import {
  getAgents,
  createAgent,
  updateAgentStatus,
} from '../controllers/agents.controller';
import {
  getFinancingRoutes,
  compareFinancing,
  updateFinancingRoute,
  getScrapedLogs,
  applyScrapedLog,
  triggerListenerNow,
} from '../controllers/rates.controller';
import { getDashboardStats } from '../controllers/analytics.controller';
import { handleSingleUpload, handleMultipleUpload } from '../controllers/upload.controller';
import { uploadImage } from '../middleware/upload';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// ─── Health Probe ────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), status: 'UP' });
});

// ─── Authentication ──────────────────────────────────────────────────────────
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, getMe);
router.post('/auth/logout', logout);

// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/listings', getListings);
router.get('/listings/:slug', getListingBySlug);

router.post('/inspections/request', requestInspection);
router.get('/inspections/track/:reference', trackInspection);

router.post('/submissions/:collection', submitForm);

router.get('/rates/financing', getFinancingRoutes);
router.post('/rates/compare', compareFinancing);

// ─── Media Upload (Pictures Only - Strictly No Videos) ───────────────────────
router.post('/upload', (req, res) => {
  uploadImage.single('file')(req, res, (err: any) => {
    if (err) {
      res.status(400).json({
        ok: false,
        error: err.message || 'Only picture uploads (PNG, JPG, WebP) are allowed. Videos are strictly prohibited.',
      });
      return;
    }
    handleSingleUpload(req, res);
  });
});

router.post('/upload/multiple', (req, res) => {
  uploadImage.array('files', 12)(req, res, (err: any) => {
    if (err) {
      res.status(400).json({
        ok: false,
        error: err.message || 'Only picture uploads (PNG, JPG, WebP) are allowed. Videos are strictly prohibited.',
      });
      return;
    }
    handleMultipleUpload(req, res);
  });
});

// ─── Protected Admin Endpoints ───────────────────────────────────────────────
router.get('/admin/analytics/overview', requireAuth, getDashboardStats);

// Listings management
router.post('/admin/listings', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), createListing);
router.put('/admin/listings/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), updateListing);
router.patch('/admin/listings/:id/assign-agent', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), assignAgentToListing);

// Inspections management
router.get('/admin/inspections', requireAuth, getAdminInspections);
router.patch('/admin/inspections/:id/stage', requireAuth, updateInspectionStage);
router.patch('/admin/inspections/:id/assign-agent', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), assignAgentToInspection);

// Submissions / Leads management
router.get('/admin/submissions', requireAuth, getAdminSubmissions);
router.patch('/admin/submissions/:id/assign-agent', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), assignAgentToSubmission);
router.patch('/admin/submissions/:id/close', requireAuth, closeSubmission);

// Agents management
router.get('/admin/agents', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), getAgents);
router.post('/admin/agents', requireAuth, requireRole('SUPER_ADMIN'), createAgent);
router.patch('/admin/agents/:id/status', requireAuth, requireRole('SUPER_ADMIN'), updateAgentStatus);

// Rates & Listener Scraper management
router.put('/admin/rates/:id', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), updateFinancingRoute);
router.get('/admin/scraped-logs', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), getScrapedLogs);
router.post('/admin/scraped-logs/:id/apply', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), applyScrapedLog);
router.post('/admin/listener/run-now', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), triggerListenerNow);

export default router;
