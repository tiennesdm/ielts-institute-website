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

    // Generate safe filename
    const ext = path.extname(file.name) || '.jpg';
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${sanitizedBase}_${Date.now()}${ext}`;

    // Generate Base64 Data URL as a 100% resilient fallback for cloud containers
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    // Attempt to save to public/uploads directory if filesystem is writable
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
      console.warn('Filesystem write not permitted, using Data URL fallback:', fsErr);
    }

    // Return disk URL if available, otherwise return Data URL
    const finalUrl = diskUrl || dataUrl;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      isDataUrl: !diskUrl
    });
  } catch (error) {
    console.error('File upload fatal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}
