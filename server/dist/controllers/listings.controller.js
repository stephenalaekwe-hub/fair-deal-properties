"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAgentToListing = exports.updateListing = exports.createListing = exports.getListingBySlug = exports.getListings = void 0;
const db_1 = require("../config/db");
const email_service_1 = require("../services/email.service");
const getListings = async (req, res) => {
    try {
        const { city, type, source, diaspora, mortgage, affordable, offplan, maxPrice, q, sort = 'featured', page = '1', pageSize = '30', } = req.query;
        const where = {};
        if (city && ['abuja', 'lagos', 'ogun', 'nationwide'].includes(city)) {
            where.city = city;
        }
        if (type && ['residential', 'commercial', 'land'].includes(type)) {
            where.propertyType = type;
        }
        if (source && ['fdp', 'developer', 'mreif', 'fhf', 'fha', 'fmbn', 'pmi', 'offmarket'].includes(source)) {
            where.source = source;
        }
        if (diaspora === 'true')
            where.diasporaFriendly = true;
        if (mortgage === 'true')
            where.mortgageEligible = true;
        if (affordable === 'true')
            where.affordable = true;
        if (offplan === 'true')
            where.offPlan = true;
        if (maxPrice) {
            where.priceMillionsNGN = { lte: parseFloat(maxPrice) };
        }
        if (q) {
            const searchStr = String(q);
            where.OR = [
                { title: { contains: searchStr } },
                { location: { contains: searchStr } },
                { description: { contains: searchStr } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price-asc')
            orderBy = { priceMillionsNGN: 'asc' };
        if (sort === 'price-desc')
            orderBy = { priceMillionsNGN: 'desc' };
        if (sort === 'title')
            orderBy = { title: 'asc' };
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limit = Math.min(60, Math.max(1, parseInt(pageSize) || 30));
        const skip = (pageNum - 1) * limit;
        const [listings, total] = await Promise.all([
            db_1.prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    assignedAgent: {
                        select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
                    },
                },
            }),
            db_1.prisma.listing.count({ where }),
        ]);
        res.json({
            ok: true,
            data: {
                total,
                page: pageNum,
                pageSize: limit,
                listings,
            },
        });
    }
    catch (err) {
        console.error('GetListings error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve listings.' });
    }
};
exports.getListings = getListings;
const getListingBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const listing = await db_1.prisma.listing.findUnique({
            where: { slug },
            include: {
                assignedAgent: {
                    select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
                },
            },
        });
        if (!listing) {
            res.status(404).json({ ok: false, error: 'Listing not found.' });
            return;
        }
        res.json({ ok: true, data: listing });
    }
    catch (err) {
        console.error('GetListingBySlug error:', err);
        res.status(500).json({ ok: false, error: 'Failed to retrieve listing.' });
    }
};
exports.getListingBySlug = getListingBySlug;
// ─── Admin Controller Actions ────────────────────────────────────────────────
const createListing = async (req, res) => {
    try {
        const payload = req.body;
        const listing = await db_1.prisma.listing.create({
            data: {
                ...payload,
                priceMillionsNGN: payload.priceMillionsNGN ? Number(payload.priceMillionsNGN) : null,
            },
        });
        res.status(201).json({ ok: true, data: listing });
    }
    catch (err) {
        console.error('CreateListing error:', err);
        res.status(500).json({ ok: false, error: 'Failed to create listing.' });
    }
};
exports.createListing = createListing;
const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const listing = await db_1.prisma.listing.update({
            where: { id },
            data: {
                ...payload,
                priceMillionsNGN: payload.priceMillionsNGN !== undefined ? Number(payload.priceMillionsNGN) : undefined,
            },
        });
        res.json({ ok: true, data: listing });
    }
    catch (err) {
        console.error('UpdateListing error:', err);
        res.status(500).json({ ok: false, error: 'Failed to update listing.' });
    }
};
exports.updateListing = updateListing;
const assignAgentToListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentId } = req.body;
        const listing = await db_1.prisma.listing.findUnique({ where: { id } });
        if (!listing) {
            res.status(404).json({ ok: false, error: 'Listing not found.' });
            return;
        }
        const agent = agentId ? await db_1.prisma.user.findUnique({ where: { id: agentId } }) : null;
        const updated = await db_1.prisma.listing.update({
            where: { id },
            data: { assignedAgentId: agentId || null },
            include: { assignedAgent: true },
        });
        if (agent && agent.email) {
            await email_service_1.emailService.notifyAgentAssigned(agent.email, agent.name, 'Property Listing Portfolio', listing.title);
        }
        res.json({ ok: true, data: updated });
    }
    catch (err) {
        console.error('AssignAgentToListing error:', err);
        res.status(500).json({ ok: false, error: 'Failed to assign agent to listing.' });
    }
};
exports.assignAgentToListing = assignAgentToListing;
