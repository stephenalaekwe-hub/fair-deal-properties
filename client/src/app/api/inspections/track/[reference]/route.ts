import { GET as getInspection } from '../../[reference]/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  context: { params: Promise<{ reference: string }> }
) {
  return getInspection(req, context);
}
