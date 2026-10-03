import { getDbAsync } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const db = await getDbAsync();
  const seo = db?.settings?.seo || {};
  const instituteName = db?.settings?.instituteName || 'First Class Global Education';
  const tagline = db?.settings?.tagline !== undefined ? db.settings.tagline : 'Premier IELTS, PTE & Study Abroad Academy';

  return {
    title: seo.metaTitle || (tagline ? `${instituteName} | ${tagline}` : instituteName),
    description: seo.metaDescription || `${instituteName} - Premier IELTS, PTE & Spoken English Institute. Daily 1-on-1 speaking, CD-IELTS computer lab, Cambridge certified trainers and verified 8+ band results.`,
    keywords: seo.keywords || 'IELTS Coaching, PTE Academic, Study Abroad, Canada Visa, UK Student Visa, Chandigarh IELTS Institute, Band 8 Preparation',
  };
}

export default async function HomePage() {
  const db = await getDbAsync();
  return <HomeClient initialData={db} />;
}
