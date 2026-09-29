import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDb } from './db';

const SESSION_COOKIE_NAME = 'apex_admin_session';
const SECRET = 'apex-ielts-super-secret-key-2026';

export function signToken(username) {
  const payload = `${username}:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyToken(token) {
  try {
    if (!token) return false;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp, hmac] = decoded.split(':');
    if (!username || !timestamp || !hmac) return false;
    
    // Check HMAC
    const expectedHmac = crypto.createHmac('sha256', SECRET).update(`${username}:${timestamp}`).digest('hex');
    if (hmac !== expectedHmac) return false;

    // Check expiration (e.g. 7 days)
    const tokenTime = parseInt(timestamp, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > maxAge) return false;

    return { username };
  } catch (e) {
    return false;
  }
}

export function verifyAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifyToken(token);
}

export function authenticateAdmin(username, password) {
  const db = getDb();
  if (!db || !db.admin) return false;
  
  if (db.admin.username === username && db.admin.password === password) {
    return true;
  }
  return false;
}

export { SESSION_COOKIE_NAME };
