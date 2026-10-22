import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { emailService } from '../services/email.service';
import { City, ListingSource, PropertyType } from '@prisma/client';

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      city,
      type,
      source,
      diaspora,
      mortgage,
      affordable,
      offplan,
      maxPrice,
      q,
      sort = 'featured',
      page = '1',
      pageSize = '30',
    } = req.query;

    const where: any = {};

    if (city && ['abuja', 'lagos', 'ogun', 'nationwide'].includes(city as string)) {
      where.city = city as City;
    }
    if (type && ['residential', 'commercial', 'land'].includes(type as string)) {
      where.propertyType = type as PropertyType;
    }
    if (source && ['fdp', 'developer', 'mreif', 'fhf', 'fha', 'fmbn', 'pmi', 'offmarket'].includes(source as string)) {
      where.source = source as ListingSource;
    }
    if (diaspora === 'true') where.diasporaFriendly = true;
    if (mortgage === 'true') where.mortgageEligible = true;
    if (affordable === 'true') where.affordable = true;
    if (offplan === 'true') where.offPlan = true;

    if (maxPrice) {
      where.priceMillionsNGN = { lte: parseFloat(maxPrice as string) };
    }

    if (q) {
      const searchStr = String(q);
      where.OR = [
        { title: { contains: searchStr } },
        { location: { contains: searchStr } },
        { description: { contains: searchStr } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { priceMillionsNGN: 'asc' };
    if (sort === 'price-desc') orderBy = { priceMillionsNGN: 'desc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(60, Math.max(1, parseInt(pageSize as string) || 30));
    const skip = (pageNum - 1) * limit;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
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
      prisma.listing.count({ where }),
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
  } catch (err) {
    console.error('GetListings error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve listings.' });
  }
};

export const getListingBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const listing = await prisma.listing.findUnique({
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
  } catch (err) {
    console.error('GetListingBySlug error:', err);
    res.status(500).json({ ok: false, error: 'Failed to retrieve listing.' });
  }
};

// ─── Admin Controller Actions ────────────────────────────────────────────────

export const createListing = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const listing = await prisma.listing.create({
      data: {
        ...payload,
        priceMillionsNGN: payload.priceMillionsNGN ? Number(payload.priceMillionsNGN) : null,
      },
    });
    res.status(201).json({ ok: true, data: listing });
  } catch (err) {
    console.error('CreateListing error:', err);
    res.status(500).json({ ok: false, error: 'Failed to create listing.' });
  }
};

export const updateListing = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...payload,
        priceMillionsNGN: payload.priceMillionsNGN !== undefined ? Number(payload.priceMillionsNGN) : undefined,
      },
    });

    res.json({ ok: true, data: listing });
  } catch (err) {
    console.error('UpdateListing error:', err);
    res.status(500).json({ ok: false, error: 'Failed to update listing.' });
  }
};

export const assignAgentToListing = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      res.status(404).json({ ok: false, error: 'Listing not found.' });
      return;
    }

    const agent = agentId ? await prisma.user.findUnique({ where: { id: agentId } }) : null;

    const updated = await prisma.listing.update({
      where: { id },
      data: { assignedAgentId: agentId || null },
      include: { assignedAgent: true },
    });

    if (agent && agent.email) {
      await emailService.notifyAgentAssigned(
        agent.email,
        agent.name,
        'Property Listing Portfolio',
        listing.title
      );
    }

    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error('AssignAgentToListing error:', err);
    res.status(500).json({ ok: false, error: 'Failed to assign agent to listing.' });
  }
};
