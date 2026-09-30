import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';

    // Generate clean safe filename with guaranteed extension
    let rawExt = path.extname(file.name || '');
    if (!rawExt || rawExt.length < 2) {
      if (mimeType.includes('png')) rawExt = '.png';
      else if (mimeType.includes('webp')) rawExt = '.webp';
      else if (mimeType.includes('svg')) rawExt = '.svg';
      else rawExt = '.jpg';
    }
    const sanitizedBase = path.basename(file.name || 'image', rawExt).replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${sanitizedBase}_${Date.now()}${rawExt}`;

    // Base64 Data URL: 100% resilient across stateless Cloud Run instances & previews
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Also attempt disk write to public/uploads
    let diskUrl = null;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      diskUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      console.warn('Filesystem write optional notice:', fsErr?.message);
    }

    // Return dataUrl as primary so preview never 404s and images survive container restarts
    return NextResponse.json({
      success: true,
      url: dataUrl,
      diskUrl: diskUrl,
      filename: filename
    });
  } catch (error) {
    console.error('File upload fatal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}
