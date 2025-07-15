'use server';

import fs from 'fs/promises';
import path from 'path';
import { readJsonFile, writeJsonFile } from '@/lib/fs-utils';
import type { StudioReservationRequest } from '@/types';

interface ReservationsData {
  reservations: StudioReservationRequest[];
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RESERVATIONS_FILE = 'reservations.json';

// Helper function to get reservations from JSON file
async function getStoredReservations(): Promise<StudioReservationRequest[]> {
  try {
    const data = await readJsonFile<ReservationsData>(RESERVATIONS_FILE);
    return data?.reservations || [];
  } catch (error) {
    console.error('Error reading reservations file:', error);
    return [];
  }
}

// Helper function to save reservations to JSON file
async function saveReservations(reservations: StudioReservationRequest[]): Promise<void> {
  try {
    await writeJsonFile(RESERVATIONS_FILE, { reservations });
  } catch (error) {
    console.error('Error saving reservations:', error);
    throw error;
  }
}

export async function getReservationsServer(): Promise<StudioReservationRequest[]> {
  try {
    return await getStoredReservations();
  } catch (error) {
    console.error('Server Error getting all reservations:', error);
    throw error;
  }
}

export async function addReservationServer(newRequest: StudioReservationRequest): Promise<void> {
  try {
    const reservations = await getStoredReservations();
    reservations.push(newRequest);
    await saveReservations(reservations);
  } catch (error) {
    console.error('Server Error adding reservation:', error);
    throw error;
  }
}

export async function updateReservationStatusServer(requestId: string, newStatus: StudioReservationRequest['status']): Promise<void> {
  try {
    const reservations = await getStoredReservations();
    const index = reservations.findIndex(r => r.id === requestId);
    if (index !== -1) {
      reservations[index].status = newStatus;
      reservations[index].updatedAt = new Date(); // Update timestamp
      await saveReservations(reservations);
    } else {
      throw new Error('Reservation not found');
    }
  } catch (error) {
    console.error('Server Error updating reservation status:', error);
    throw error;
  }
}

export async function assignEngineerToServer(reservationId: string, engineerId: string): Promise<void> {
  try {
    const reservations = await getStoredReservations();
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index !== -1) {
      reservations[index].engineerId = engineerId;
      reservations[index].updatedAt = new Date(); // Update timestamp
      await saveReservations(reservations);
    } else {
      throw new Error('Reservation not found');
    }
  } catch (error) {
    console.error('Server Error assigning engineer:', error);
    throw error;
  }
}

