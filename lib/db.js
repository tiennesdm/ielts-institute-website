import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure database file exists
export function getDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error('Database file not found');
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
}

// Atomically save database file
export function saveDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// Update specific section
export function updateSection(sectionName, newContent) {
  const db = getDb();
  if (!db) return false;
  db[sectionName] = newContent;
  return saveDb(db);
}
