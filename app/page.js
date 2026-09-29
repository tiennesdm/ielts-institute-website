import { getDb } from '@/lib/db';
import HomeClient from './HomeClient';

export const revalidate = 0;

export default function HomePage() {
  const db = getDb();
  return <HomeClient initialData={db} />;
}
