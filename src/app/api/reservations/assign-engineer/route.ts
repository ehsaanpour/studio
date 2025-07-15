import { NextRequest, NextResponse } from 'next/server';
import { assignEngineerToServer } from '@/server/lib/reservation-data';

export async function POST(req: NextRequest) {
  try {
    const { reservationId, engineerId } = await req.json();

    if (!reservationId || !engineerId) {
      return NextResponse.json({ error: 'Reservation ID and Engineer ID are required' }, { status: 400 });
    }

    await assignEngineerToServer(reservationId, engineerId);

    return NextResponse.json({ message: 'Engineer assigned successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Error assigning engineer:', error);
    return NextResponse.json({ error: 'Failed to assign engineer' }, { status: 500 });
  }
}

