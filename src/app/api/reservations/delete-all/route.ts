import { NextRequest, NextResponse } from 'next/server';
import { deleteAllReservationsServer } from '@/server/lib/reservation-data';

export async function POST(req: NextRequest) {
  try {
    await deleteAllReservationsServer();

    return NextResponse.json({ message: 'All reservations deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Error deleting all reservations:', error);
    return NextResponse.json({ error: 'Failed to delete all reservations' }, { status: 500 });
  }
}

