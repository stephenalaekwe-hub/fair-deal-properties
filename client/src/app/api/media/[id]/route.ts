import { NextResponse } from 'next/server';
import { getUploadedMediaById } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const media = await getUploadedMediaById(id);

    if (!media || !media.base64Data) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const buffer = Buffer.from(media.base64Data, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': media.mimeType || 'image/jpeg',
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[fdp:media] Error serving media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

