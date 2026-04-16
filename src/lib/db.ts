import { openDB, type IDBPDatabase } from 'idb'
import { DB_NAME, DB_STORE, DB_VERSION } from '../constants'
import type { Highlight } from '../types'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(DB_STORE, { keyPath: 'id' })
        store.createIndex('letterNumber', 'letterNumber')
        store.createIndex('timestamp', 'timestamp')
      },
    })
  }
  return dbPromise
}

export async function getAllHighlights(): Promise<Highlight[]> {
  const db = await getDB()
  return db.getAll(DB_STORE)
}

export async function getHighlightsForLetter(letterNumber: number): Promise<Highlight[]> {
  const db = await getDB()
  return db.getAllFromIndex(DB_STORE, 'letterNumber', letterNumber)
}

export async function addHighlight(h: Highlight): Promise<void> {
  const db = await getDB()
  await db.put(DB_STORE, h)
}

export async function deleteHighlight(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(DB_STORE, id)
}

export async function clearAllHighlights(): Promise<void> {
  const db = await getDB()
  await db.clear(DB_STORE)
}
