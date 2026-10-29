import { enquirySchema } from '@/lib/validation';
import { readBody, ok, fail } from '@/lib/http';
import { record } from '@/lib/store';
import { composeInternalAlert, notify } from '@/lib/notify';
import { auditLog } from '@/lib/audit';
import { RETENTION } from '@/lib/retention';
import { listings } from '@/data/listings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/enquiry - enquiry raised against a specific marketplace listing. */
export async function POST(req: Request) {
  const parsed = await readBody(req, enquirySchema, 'enquiry');
  if ('response' in parsed) return parsed.response;

  const reqTitle = (parsed.data.propertyTitle || '').toLowerCase().trim();
  const match = listings.find((l) => l.title.toLowerCase().trim() === reqTitle) ||
    listings.find((l) => reqTitle.includes(l.title.toLowerCase().trim()) || l.title.toLowerCase().trim().includes(reqTitle));

  const slug = match?.slug || 'direct-enquiry';
  const verification = match?.verificationStatus || parsed.data.verificationStatus || 'FDP Registry';

  const rec = await record('enquiry', { ...parsed.data, listingSlug: slug }, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  try {
    auditLog({
      event: 'enquiry.received',
      reference: rec.reference,
      lawfulBasis: 'consent',
      retentionMonths: RETENTION['enquiry'].months,
      retentionBasis: RETENTION['enquiry'].basis,
    });
  } catch (err: any) {
    console.warn('[fdp:enquiry] Audit warning:', err?.message || err);
  }

  try {
    await notify(composeInternalAlert(rec));
  } catch (err: any) {
    console.warn('[fdp:enquiry] Notify warning:', err?.message || err);
  }

  return ok({
    reference: rec.reference,
    listing: { slug, title: match?.title || parsed.data.propertyTitle, verificationStatus: verification },
    message:
      'Your enquiry has been logged against this listing. We will confirm current availability and '
      + 'the verification record before responding substantively.',
  }, 201);
}
