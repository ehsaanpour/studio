import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fs-utils';
import type { StudioReservationRequest } from '@/types';

const RESERVATIONS_FILE = 'reservations.json';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedData } = body;

    if (!id) {
      return NextResponse.json({ message: 'Reservation ID is required' }, { status: 400 });
    }

    const data = await readJsonFile<{ reservations: StudioReservationRequest[] }>(RESERVATIONS_FILE);
    const reservations = data?.reservations || [];

    const reservationIndex = reservations.findIndex((r: StudioReservationRequest) => r.id === id);

    if (reservationIndex === -1) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    const originalReservation = reservations[reservationIndex];

    // Prevent changing status or program name
    if (updatedData.status && updatedData.status !== originalReservation.status) {
        return NextResponse.json({ message: 'Cannot update status' }, { status: 400 });
    }
    if (updatedData.programName && updatedData.programName !== originalReservation.programName) {
        return NextResponse.json({ message: 'Cannot update program name' }, { status: 400 });
    }

    reservations[reservationIndex] = {
      ...originalReservation,
      dateTime: {
        reservationDate: updatedData.reservationDate,
        startTime: updatedData.reservationStartTime,
        endTime: updatedData.reservationEndTime,
      },
      studio: updatedData.studioSelection,
      studioServices: {
        ...originalReservation.studioServices,
        serviceType: updatedData.studioServiceType,
      },
      additionalServices: updatedData.additionalServices,
      updatedAt: new Date(),
    };

    await writeJsonFile(RESERVATIONS_FILE, { reservations });

    return NextResponse.json(reservations[reservationIndex]);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

