import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No image file provided' }, { status: 400 });
    }

    if (file.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|m4v|3gp)$/i.test(file.name)) {
      return NextResponse.json(
        { ok: false, error: 'Video files are strictly prohibited. Please upload an image file (PNG, JPG, WebP).' },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: 'Image exceeds the maximum allowed size of 15MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      ok: true,
      data: {
        url: dataUrl,
        name: file.name,
        size: file.size,
        mimeType,
      },
    });
  } catch (err: any) {
    console.error('[fdp:upload] Upload processing error:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
