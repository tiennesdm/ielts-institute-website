import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'firstclass-edu-storage-0760435741';
const GCS_FILE_NAME = 'db.json';

let storageClient = null;
let gcsBucket = null;
let isGcsAvailable = null;
let lastGcsSync = 0;
let cachedDb = null;

function getStorage() {
  if (isGcsAvailable === false) return null;
  if (!storageClient) {
    try {
      const { Storage } = require('@google-cloud/storage');
      storageClient = new Storage();
      gcsBucket = storageClient.bucket(BUCKET_NAME);
      isGcsAvailable = true;
    } catch (e) {
      console.warn('GCS storage not available locally, using local disk:', e.message);
      isGcsAvailable = false;
      return null;
    }
  }
  return gcsBucket;
}

// Background sync from GCS to ensure live updates persist across container deployments
async function syncFromGcs() {
  const bucket = getStorage();
  if (!bucket) return;

  try {
    const file = bucket.file(GCS_FILE_NAME);
    const [exists] = await file.exists();
    if (!exists) return;

    const [contents] = await file.download();
    const data = JSON.parse(contents.toString('utf-8'));
    cachedDb = data;
    lastGcsSync = Date.now();

    // Persist to local container disk
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[DB] Successfully synced latest data from GCS bucket');
  } catch (err) {
    console.warn('[DB] GCS sync notice:', err.message);
  }
}

// Trigger initial sync on module load if running in production
if (process.env.NODE_ENV === 'production') {
  syncFromGcs().catch(() => {});
}

// Synchronously read database
export function getDb() {
  try {
    // If running in production and haven't synced recently, trigger async refresh
    if (process.env.NODE_ENV === 'production' && Date.now() - lastGcsSync > 15000) {
      syncFromGcs().catch(() => {});
    }

    if (cachedDb) {
      return cachedDb;
    }

    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      cachedDb = JSON.parse(data);
      return cachedDb;
    }

    throw new Error('Database file not found');
  } catch (error) {
    console.error('Error reading database:', error);
    return cachedDb || null;
  }
}

// Save database both to local disk and to Google Cloud Storage
export function saveDb(data) {
  try {
    cachedDb = data;
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${DB_PATH}.tmp`;
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, jsonStr, 'utf-8');
    fs.renameSync(tempPath, DB_PATH);

    // Asynchronously save to Google Cloud Storage bucket
    const bucket = getStorage();
    if (bucket) {
      const file = bucket.file(GCS_FILE_NAME);
      file.save(jsonStr, {
        contentType: 'application/json',
        resumable: false,
        metadata: {
          cacheControl: 'no-cache, max-age=0'
        }
      }).then(() => {
        lastGcsSync = Date.now();
        console.log('[DB] Successfully saved to persistent GCS bucket:', BUCKET_NAME);
      }).catch((gcsErr) => {
        console.error('[DB] GCS upload notice:', gcsErr.message);
      });
    }

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
