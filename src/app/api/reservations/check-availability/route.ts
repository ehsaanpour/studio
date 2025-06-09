import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/fs-utils';
import type { StudioReservationRequest } from '@/types';

interface ReservationsData {
  reservations: StudioReservationRequest[];
}

const RESERVATIONS_FILE = 'reservations.json';

export async function POST(request: Request) {
  try {
    const { dateTime, studio } = await request.json();
    
    // Read existing reservations
    const data = await readJsonFile<ReservationsData>(RESERVATIONS_FILE);
    const reservations = data.reservations || [];

    // Check for overlapping reservations
    const hasOverlap = reservations.some(reservation => {
      // Skip cancelled reservations
      if (reservation.status === 'cancelled') return false;

      // Check if it's the same studio
      if (reservation.studio !== studio) return false;

      // Check if it's the same date
      const reservationDate = new Date(reservation.dateTime.reservationDate);
      const requestedDate = new Date(dateTime.reservationDate);
      if (reservationDate.toDateString() !== requestedDate.toDateString()) return false;

      // Check for time overlap
      const reservationStart = reservation.dateTime.startTime;
      const reservationEnd = reservation.dateTime.endTime;
      const requestedStart = dateTime.startTime;
      const requestedEnd = dateTime.endTime;

      return (
        (requestedStart >= reservationStart && requestedStart < reservationEnd) ||
        (requestedEnd > reservationStart && requestedEnd <= reservationEnd) ||
        (requestedStart <= reservationStart && requestedEnd >= reservationEnd)
      );
    });

    return NextResponse.json({ 
      isAvailable: !hasOverlap,
      message: hasOverlap ? 'این زمان قبلاً رزرو شده است.' : 'این زمان قابل رزرو است.'
    });
  } catch (error) {
    console.error('Error checking reservation availability:', error);
    return NextResponse.json({ 
      isAvailable: false,
      message: 'خطا در بررسی دسترسی‌پذیری زمان رزرو.'
    }, { status: 500 });
  }
} 