import path from 'path';

// This is the base directory for data storage.
// It defaults to a local 'data' folder for development.
// In production, it uses the path from the LIARA_DATA_DIR environment variable.
const dataDir = process.env.LIARA_DATA_DIR || path.join(process.cwd(), 'data');

/**
 * Gets the absolute path for a data file.
 * @param fileName - The name of the data file (e.g., 'reservations.json').
 * @returns The full path to the data file.
 */
export function getDataFilePath(fileName: string): string {
  return path.join(dataDir, fileName);
}
