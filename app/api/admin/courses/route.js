import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const courses = db ? db.courses || [] : [];
  const config = db?.settings?.sections?.courses || {
    badge: "Target Band 8+ Programs",
    title: "Our Certified IELTS & English Programs",
    subtitle: "Tailored curriculums designed by former IELTS examiners. Choose the program that fits your target band, immigration deadline, or study abroad dream.",
    ctaText: "Book Free Demo For This Course",
    show: true
  };
  return NextResponse.json({
    courses,
    config
  });
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const itemData = await request.json();
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.courses) db.courses = [];
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.courses) {
      db.settings.sections.courses = {
        badge: "Target Band 8+ Programs",
        title: "Our Certified IELTS & English Programs",
        subtitle: "Tailored curriculums designed by former IELTS examiners. Choose the program that fits your target band, immigration deadline, or study abroad dream.",
        ctaText: "Book Free Demo For This Course",
        show: true
      };
    }

    // 1. Action: update section config
    if (itemData.action === 'update_config') {
      db.settings.sections.courses = {
        ...db.settings.sections.courses,
        ...itemData.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        courses: db.courses,
        config: db.settings.sections.courses
      });
    }

    // 2. Action: toggle active visibility for individual course
    if (itemData.action === 'toggle_active') {
      const index = db.courses.findIndex(c => c.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.courses[index].isActive !== false;
        db.courses[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({
          success: true,
          courses: db.courses,
          config: db.settings.sections.courses
        });
      }
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit course
    const courseItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (courseItem.id) {
      const index = db.courses.findIndex(c => c.id === courseItem.id);
      if (index !== -1) {
        db.courses[index] = { ...db.courses[index], ...courseItem };
      } else {
        db.courses.push(courseItem);
      }
    } else {
      const newCourse = {
        ...courseItem,
        id: `course-${Date.now()}`
      };
      db.courses.push(newCourse);
    }

    await saveDb(db);
    return NextResponse.json({
      success: true,
      courses: db.courses,
      config: db.settings.sections.courses
    });
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

    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.courses = (db.courses || []).filter(c => c.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, courses: db.courses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
