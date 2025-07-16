import { NextRequest, NextResponse } from 'next/server';
import { deleteReservationServer } from '@/server/lib/reservation-data';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    await deleteReservationServer(id);

    return NextResponse.json({ message: 'Reservation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Error deleting reservation:', error);
    return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
  }
}

