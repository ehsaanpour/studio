import { promises as fs } from 'fs';
import path from 'path';
import { Engineer } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data/engineers.json');

async function readData(): Promise<Engineer[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: Engineer[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function addEngineer(engineer: Omit<Engineer, 'id'>): Promise<Engineer> {
  const engineers = await readData();
  const newEngineer: Engineer = {
    id: Date.now().toString(),
    ...engineer,
  };
  engineers.push(newEngineer);
  await writeData(engineers);
  return newEngineer;
}

export async function removeEngineer(id: string): Promise<void> {
  let engineers = await readData();
  engineers = engineers.filter((engineer) => engineer.id !== id);
  await writeData(engineers);
}

export async function listEngineers(): Promise<Engineer[]> {
  return readData();
}

