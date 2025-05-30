import type { Producer } from '@/types';
import { readJsonFile, writeJsonFile } from './fs-utils';

interface ProducersData {
  producers: Producer[];
}

const PRODUCERS_FILE = 'producers.json';

// Helper function to get producers from JSON file
async function getStoredProducers(): Promise<Producer[]> {
  const data = await readJsonFile<ProducersData>(PRODUCERS_FILE);
  return data.producers || [];
}

// Helper function to save producers to JSON file
async function saveProducers(producers: Producer[]): Promise<void> {
  await writeJsonFile<ProducersData>(PRODUCERS_FILE, { producers });
}

export async function addProducer(producer: Omit<Producer, 'id'>): Promise<string> {
  try {
    const producers = await getStoredProducers();
    const newProducer: Producer = {
      id: Date.now().toString(),
      ...producer
    };
    producers.push(newProducer);
    await saveProducers(producers);
    return newProducer.id;
  } catch (error) {
    console.error('Error adding producer:', error);
    throw error;
  }
}

export async function getProducerByUsername(username: string): Promise<Producer | null> {
  try {
    const producers = await getStoredProducers();
    return producers.find(p => p.username === username) || null;
  } catch (error) {
    console.error('Error getting producer:', error);
    throw error;
  }
}

export async function getAllProducers(): Promise<Producer[]> {
  try {
    return await getStoredProducers();
  } catch (error) {
    console.error('Error getting all producers:', error);
    throw error;
  }
}

export async function deleteProducer(producerId: string): Promise<void> {
  try {
    const producers = await getStoredProducers();
    const updatedProducers = producers.filter(p => p.id !== producerId);
    await saveProducers(updatedProducers);
  } catch (error) {
    console.error('Error deleting producer:', error);
    throw error;
  }
} 