"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const listings_controller_1 = require("../controllers/listings.controller");
const inspections_controller_1 = require("../controllers/inspections.controller");
const submissions_controller_1 = require("../controllers/submissions.controller");
const agents_controller_1 = require("../controllers/agents.controller");
const rates_controller_1 = require("../controllers/rates.controller");
const analytics_controller_1 = require("../controllers/analytics.controller");
const upload_controller_1 = require("../controllers/upload.controller");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ─── Health Probe ────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString(), status: 'UP' });
});
// ─── Authentication ──────────────────────────────────────────────────────────
router.post('/auth/login', auth_controller_1.login);
router.get('/auth/me', auth_1.requireAuth, auth_controller_1.getMe);
router.post('/auth/logout', auth_controller_1.logout);
// ─── Public Endpoints ────────────────────────────────────────────────────────
router.get('/listings', listings_controller_1.getListings);
router.get('/listings/:slug', listings_controller_1.getListingBySlug);
router.post('/inspections/request', inspections_controller_1.requestInspection);
router.get('/inspections/track/:reference', inspections_controller_1.trackInspection);
router.post('/submissions/:collection', submissions_controller_1.submitForm);
router.get('/rates/financing', rates_controller_1.getFinancingRoutes);
router.post('/rates/compare', rates_controller_1.compareFinancing);
// ─── Media Upload (Pictures Only - Strictly No Videos) ───────────────────────
router.post('/upload', (req, res) => {
    upload_1.uploadImage.single('file')(req, res, (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err.message || 'Only picture uploads (PNG, JPG, WebP) are allowed. Videos are strictly prohibited.',
            });
            return;
        }
        (0, upload_controller_1.handleSingleUpload)(req, res);
    });
});
router.post('/upload/multiple', (req, res) => {
    upload_1.uploadImage.array('files', 12)(req, res, (err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                error: err.message || 'Only picture uploads (PNG, JPG, WebP) are allowed. Videos are strictly prohibited.',
            });
            return;
        }
        (0, upload_controller_1.handleMultipleUpload)(req, res);
    });
});
// ─── Protected Admin Endpoints ───────────────────────────────────────────────
router.get('/admin/analytics/overview', auth_1.requireAuth, analytics_controller_1.getDashboardStats);
// Listings management
router.post('/admin/listings', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), listings_controller_1.createListing);
router.put('/admin/listings/:id', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), listings_controller_1.updateListing);
router.patch('/admin/listings/:id/assign-agent', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), listings_controller_1.assignAgentToListing);
// Inspections management
router.get('/admin/inspections', auth_1.requireAuth, inspections_controller_1.getAdminInspections);
router.patch('/admin/inspections/:id/stage', auth_1.requireAuth, inspections_controller_1.updateInspectionStage);
router.patch('/admin/inspections/:id/assign-agent', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), inspections_controller_1.assignAgentToInspection);
// Submissions / Leads management
router.get('/admin/submissions', auth_1.requireAuth, submissions_controller_1.getAdminSubmissions);
router.patch('/admin/submissions/:id/assign-agent', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), submissions_controller_1.assignAgentToSubmission);
router.patch('/admin/submissions/:id/close', auth_1.requireAuth, submissions_controller_1.closeSubmission);
// Agents management
router.get('/admin/agents', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), agents_controller_1.getAgents);
router.post('/admin/agents', auth_1.requireAuth, (0, auth_1.requireRole)('SUPER_ADMIN'), agents_controller_1.createAgent);
router.patch('/admin/agents/:id/status', auth_1.requireAuth, (0, auth_1.requireRole)('SUPER_ADMIN'), agents_controller_1.updateAgentStatus);
// Rates & Listener Scraper management
router.put('/admin/rates/:id', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), rates_controller_1.updateFinancingRoute);
router.get('/admin/scraped-logs', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), rates_controller_1.getScrapedLogs);
router.post('/admin/scraped-logs/:id/apply', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), rates_controller_1.applyScrapedLog);
router.post('/admin/listener/run-now', auth_1.requireAuth, (0, auth_1.requireRole)('ADMIN', 'SUPER_ADMIN'), rates_controller_1.triggerListenerNow);
exports.default = router;
