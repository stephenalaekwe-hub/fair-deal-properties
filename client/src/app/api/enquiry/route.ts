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

  // An enquiry must attach to a listing that exists. A property title that matches
  // nothing in the register means either a stale page or a crafted payload.
  const match = listings.find((l) => l.title === parsed.data.propertyTitle);
  if (!match) {
    return fail('That property could not be found in the current register. It may have been withdrawn.', 404);
  }

  const rec = await record('enquiry', { ...parsed.data, listingSlug: match.slug }, {
    ip: parsed.ip,
    userAgent: req.headers.get('user-agent'),
  });

  auditLog({
    event: 'enquiry.received',
    reference: rec.reference,
    lawfulBasis: 'consent',
    retentionMonths: RETENTION['enquiry'].months,
    retentionBasis: RETENTION['enquiry'].basis,
  });

  await notify(composeInternalAlert(rec));

  try {
    await fetch('http://localhost:5000/api/v1/submissions/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        propertyTitle: parsed.data.propertyTitle,
        payload: { ...parsed.data, listingSlug: match.slug },
      }),
    });
  } catch (err) {
    console.error('Failed to forward enquiry to backend db:', err);
  }

  return ok({
    reference: rec.reference,
    listing: { slug: match.slug, title: match.title, verificationStatus: match.verificationStatus },
    message:
      'Your enquiry has been logged against this listing. We will confirm current availability and '
      + 'the verification record before responding substantively.',
  }, 201);
}
