import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';
import type { Issue } from '../types';

const DB_NAME = 'city-issues-db';
const DB_VERSION = 1;
const STORE_NAME = 'issues';

interface CityIssuesDB {
  issues: {
    key: string;
    value: Issue;
  };
}

let dbInstance: IDBPDatabase<CityIssuesDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<CityIssuesDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<CityIssuesDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

export async function getAllIssues(): Promise<Issue[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function addIssue(issue: Issue): Promise<string> {
  const db = await getDB();
  await db.put(STORE_NAME, issue);
  return issue.id;
}

export async function updateIssue(issue: Issue): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, issue);
}

export async function deleteIssue(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function getIssueCount(): Promise<number> {
  const db = await getDB();
  return db.count(STORE_NAME);
}

export async function clearAllIssues(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
