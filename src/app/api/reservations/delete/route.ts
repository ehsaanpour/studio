import { NextResponse } from 'next/server';
import { getReservationsServer } from '@/server/lib/reservation-data';
import { writeJsonFile } from '@/lib/fs-utils';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { requestId } = await request.json();
    
    // Get all reservations
    const reservations = await getReservationsServer();
    
    // Filter out the reservation to be deleted
    const updatedReservations = reservations.filter(r => r.id !== requestId);
    
    // Save the updated reservations
    await writeJsonFile('reservations.json', { reservations: updatedReservations });
    
    return NextResponse.json({ message: 'Reservation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 