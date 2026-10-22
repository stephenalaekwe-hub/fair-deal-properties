import { mortgageCompareSchema } from '@/lib/validation';
import { readBody, ok } from '@/lib/http';
import { compareRoutes } from '@/data/financing';

export const runtime = 'nodejs';

/**
 * POST /api/mortgage/compare
 *
 * Compares financing routes on total cost of credit. Where a route publishes no rate,
 * the monetary columns are returned as null. The firm does not lend, does not receive
 * a commission that varies by route, and this endpoint does not rank or recommend -
 * it computes.
 */
export async function POST(req: Request) {
  const parsed = await readBody(req, mortgageCompareSchema, 'mortgage');
  if ('response' in parsed) return parsed.response;

  const comparisons = compareRoutes(parsed.data);

  return ok({
    input: parsed.data,
    comparisons,
    disclosure:
      'Figures are indicative and computed from published scheme terms. They are not an offer, a '
      + 'pre-approval or a guarantee of allocation. Schemes revise terms without notice. Obtain a '
      + 'written offer letter, including all fees, before relying on any figure here.',
    caveat:
      'Total cost of credit is the correct basis of comparison. The lowest headline rate is '
      + 'frequently not the lowest total cost once tenor, equity requirement and fees are included.',
  });
}
