import { NextResponse } from 'next/server';
import { getReservationsServer, addReservationServer, updateReservationStatusServer } from '@/server/lib/reservation-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const reservations = await getReservationsServer();
    if (id) {
      const reservation = reservations.find(r => r.id === id);
      if (reservation) {
        return NextResponse.json(reservation);
      } else {
        return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
      }
    }
    return NextResponse.json(reservations, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('API Error fetching reservations:', error);
    return NextResponse.json({ message: 'Error fetching reservations' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request: Request) {
  try {
    const { formData: newRequest } = await request.json(); // Expecting the full newRequest object
    await addReservationServer(newRequest);
    return NextResponse.json({ message: 'Reservation added successfully' }, { status: 201 });
  } catch (error) {
    console.error('API Error adding reservation:', error);
    return NextResponse.json({ message: 'Error adding reservation' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { requestId, newStatus } = await request.json();
    if (!requestId || !newStatus) {
      return NextResponse.json({ message: 'Request ID and new status are required' }, { status: 400 });
    }
    await updateReservationStatusServer(requestId, newStatus);
    return NextResponse.json({ message: 'Reservation status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('API Error updating reservation status:', error);
    return NextResponse.json({ message: 'Error updating reservation status' }, { status: 500 });
  }
}
