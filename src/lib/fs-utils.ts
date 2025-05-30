// Utility functions for reading/writing JSON data using localStorage (browser only)

export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const data = localStorage.getItem(filename);
    return data ? JSON.parse(data) : {} as T;
  } catch (error) {
    console.error('Error reading file:', error);
    return {} as T;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    localStorage.setItem(filename, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
} 