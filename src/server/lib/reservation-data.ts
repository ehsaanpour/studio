'use server';

import fs from 'fs/promises';
import path from 'path';
import { readJsonFile, writeJsonFile } from '@/lib/fs-utils';
import type { StudioReservationRequest } from '@/types';

// This interface is crucial for correctly typing the nested structure of reservations.json
interface ReservationsData {
  reservations: StudioReservationRequest[];
}

const RESERVATIONS_FILE = 'reservations.json';

function calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        return 0;
    }
    const difference = end.getTime() - start.getTime();
    return difference / (1000 * 60 * 60);
}

// Helper function to get reservations from JSON file
async function getStoredReservations(): Promise<StudioReservationRequest[]> {
  try {
    // Correctly type the expected data structure from the JSON file.
    const data = await readJsonFile<ReservationsData>(RESERVATIONS_FILE);
    // Return the nested reservations array, or an empty array if data is null.
    return data?.reservations || [];
  } catch (error) {
    console.error('Error reading reservations file:', error);
    return [];
  }
}

// Helper function to save reservations to JSON file
async function saveReservations(reservations: StudioReservationRequest[]): Promise<void> {
  try {
    const correctedReservations = reservations.map(r => {
        if (r.type === 'producer') {
            r.studioServices.hoursPerDay = calculateDuration(r.dateTime.startTime, r.dateTime.endTime);
        }
        return r;
    });
    // Wrap the array in the expected { reservations: [...] } structure.
    await writeJsonFile(RESERVATIONS_FILE, { reservations: correctedReservations });
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
      reservations[index].updatedAt = new Date();
      await saveReservations(reservations);
    } else {
      throw new Error('Reservation not found');
    }
  } catch (error) {
    console.error('Server Error updating reservation status:', error);
    throw error;
  }
}

export async function assignEngineerToServer(reservationId: string, engineerIds: string[], engineerCount: number): Promise<void> {
  try {
    const reservations = await getStoredReservations();
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index !== -1) {
      reservations[index].engineers = engineerIds;
      reservations[index].engineerCount = engineerCount;
      reservations[index].status = 'finalized';
      reservations[index].updatedAt = new Date();
      if ('engineerId' in reservations[index]) {
        delete (reservations[index] as any).engineerId;
      }
      await saveReservations(reservations);
    } else {
      throw new Error('Reservation not found');
    }
  } catch (error) {
    console.error('Server Error assigning engineer:', error);
    throw error;
  }
}

export async function deleteReservationServer(id: string): Promise<void> {
  try {
    const reservations = await getStoredReservations();
    const updatedReservations = reservations.filter(r => r.id !== id);
    if (reservations.length === updatedReservations.length) {
      throw new Error('Reservation to delete not found');
    }
    await saveReservations(updatedReservations);
  } catch (error) {
    console.error(`Server Error deleting reservation ${id}:`, error);
    throw error;
  }
}

export async function deleteAllReservationsServer(): Promise<void> {
  try {
    await saveReservations([]);
  } catch (error) {
    console.error('Server Error deleting all reservations:', error);
    throw error;
  }
}

