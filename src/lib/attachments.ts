const DB_NAME = 'dsa-tracker';
const STORE_NAME = 'attachments';
const VERSION = 1;

export interface Attachment {
  id: string;
  problemId: number;
  name: string;
  mimeType: string;
  blob: Blob;
  createdAt: string;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('problemId', 'problemId', { unique: false });
      }
    };
  });
  return dbPromise;
}

export async function getAttachments(problemId: number): Promise<Attachment[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const idx = tx.objectStore(STORE_NAME).index('problemId');
    const req = idx.getAll(IDBKeyRange.only(problemId));
    req.onsuccess = () => {
      const arr = (req.result as Attachment[]).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      resolve(arr);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addAttachment(att: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment> {
  const db = await openDB();
  const id = `${att.problemId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full: Attachment = { ...att, id, createdAt: new Date().toISOString() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).add(full);
    req.onsuccess = () => resolve(full);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteAttachment(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAttachmentCounts(): Promise<Map<number, number>> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const counts = new Map<number, number>();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        const att = cursor.value as Attachment;
        counts.set(att.problemId, (counts.get(att.problemId) || 0) + 1);
        cursor.continue();
      } else {
        resolve(counts);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
