import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function GET(request, { params }) {
  try {
    const fileSegments = params?.file;
    if (!fileSegments || fileSegments.length === 0) {
      return new NextResponse('File path not provided', { status: 400 });
    }

    const filename = fileSegments.join('/');
    
    // Check multiple possible paths
    const candidates = [
      path.join(process.cwd(), 'public', 'uploads', filename),
      path.join(process.cwd(), 'data', 'uploads', filename),
      path.join('/app', 'public', 'uploads', filename),
      path.join('/app', 'data', 'uploads', filename),
    ];

    let foundPath = null;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        foundPath = c;
        break;
      }
    }

    if (foundPath) {
      const ext = path.extname(foundPath).toLowerCase();
      const mime = MIME_MAP[ext] || 'image/jpeg';
      const fileBuffer = fs.readFileSync(foundPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
