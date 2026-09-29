import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db ? db.courses || [] : []);
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courseData = await request.json();
    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.courses) db.courses = [];

    // Check if updating existing or adding new
    if (courseData.id) {
      const index = db.courses.findIndex(c => c.id === courseData.id);
      if (index !== -1) {
        db.courses[index] = { ...db.courses[index], ...courseData };
      } else {
        db.courses.push(courseData);
      }
    } else {
      const newCourse = {
        ...courseData,
        id: `course-${Date.now()}`
      };
      db.courses.push(newCourse);
    }

    saveDb(db);
    return NextResponse.json({ success: true, courses: db.courses });
  } catch (error) {
    console.error('Course save error:', error);
    return NextResponse.json({ error: 'Failed to save course' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.courses = (db.courses || []).filter(c => c.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, courses: db.courses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
