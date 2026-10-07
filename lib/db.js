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
export async function syncFromGcs() {
  const bucket = getStorage();
  if (!bucket) return;

  try {
    const file = bucket.file(GCS_FILE_NAME);
    const [exists] = await file.exists();
    if (!exists) return;

    const [contents] = await file.download();
    const data = JSON.parse(contents.toString('utf-8'));

    // Non-destructive merge: GCS bucket data takes 100% priority.
    // If new feature keys or default sections exist in local template, backfill only what's missing.
    let mergedData = data;
    if (fs.existsSync(DB_PATH)) {
      try {
        const localDefault = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        mergedData = { ...localDefault, ...data };
        if (localDefault.settings && data.settings) {
          mergedData.settings = {
            ...localDefault.settings,
            ...data.settings,
            sections: {
              ...(localDefault.settings.sections || {}),
              ...(data.settings.sections || {})
            }
          };
        }
      } catch (e) {
        mergedData = data;
      }
    }

    cachedDb = mergedData;
    lastGcsSync = Date.now();

    // Persist to local container disk
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(mergedData, null, 2), 'utf-8');
    console.log('[DB] Successfully synced and preserved live data from GCS bucket');
  } catch (err) {
    console.warn('[DB] GCS sync notice:', err.message);
  }
}

// Trigger initial sync on module load if running in production
if (process.env.NODE_ENV === 'production') {
  syncFromGcs().catch(() => {});
}

// Async read - ensures fresh sync from GCS if older than 3 seconds
export async function getDbAsync() {
  if ((process.env.NODE_ENV === 'production' || process.env.GCS_BUCKET_NAME) && Date.now() - lastGcsSync > 3000) {
    await syncFromGcs();
  }
  return getDb();
}

// Synchronously read database from local disk
export function getDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      cachedDb = JSON.parse(data);
      return cachedDb;
    }

    if (cachedDb) {
      return cachedDb;
    }

    throw new Error('Database file not found');
  } catch (error) {
    console.error('Error reading database:', error);
    return cachedDb || null;
  }
}

// Save database both to local disk and to Google Cloud Storage (awaited for consistency)
export async function saveDb(data) {
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

    // Save to Google Cloud Storage bucket and await completion
    const bucket = getStorage();
    if (bucket) {
      try {
        const file = bucket.file(GCS_FILE_NAME);
        await file.save(jsonStr, {
          contentType: 'application/json',
          resumable: false,
          metadata: {
            cacheControl: 'no-cache, max-age=0'
          }
        });
        lastGcsSync = Date.now();
        console.log('[DB] Successfully saved to persistent GCS bucket:', BUCKET_NAME);
      } catch (gcsErr) {
        console.error('[DB] GCS upload notice:', gcsErr.message);
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// Update specific section
export async function updateSection(sectionName, newContent) {
  const db = await getDbAsync();
  if (!db) return false;
  db[sectionName] = newContent;
  return await saveDb(db);
}
