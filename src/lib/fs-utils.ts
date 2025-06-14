import fs from 'fs/promises';
import path from 'path';

// Use a more robust path resolution that works in both development and production
const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'data')  // In production, use /data directory
  : path.join(process.cwd(), 'src', 'data'); // In development, use /src/data

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    await fs.mkdir(DATA_DIR, { recursive: true }); // Ensure directory exists
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, return null
      return null;
    }
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    await fs.mkdir(DATA_DIR, { recursive: true }); // Ensure directory exists
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}
