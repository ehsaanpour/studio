'use client';

import type { StudioReservationRequest, PersonalInformation, ReservationDateTime, StudioSelection, StudioServicesInfo, AdditionalService, CateringService, Repetition } from '@/types';
import type { GuestFormValues } from '@/components/forms/guest-reservation-form';
import type { ProducerFormValues } from '@/components/forms/producer-reservation-form';

export async function getReservations(): Promise<StudioReservationRequest[]> {
  try {
    const response = await fetch('/api/reservations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const reservationsWithDates = data.map((reservation: StudioReservationRequest) => ({
      ...reservation,
      submittedAt: new Date(reservation.submittedAt)
    }));
    return reservationsWithDates.sort((a: StudioReservationRequest, b: StudioReservationRequest) => b.submittedAt.getTime() - a.submittedAt.getTime());
  } catch (error) {
    console.error('Error fetching reservations from API:', error);
    return [];
  }
}

export async function getReservationById(id: string): Promise<StudioReservationRequest | null> {
  try {
    const response = await fetch(`/api/reservations?id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reservation = await response.json();
    return {
      ...reservation,
      submittedAt: new Date(reservation.submittedAt),
      dateTime: {
        ...reservation.dateTime,
        reservationDate: new Date(reservation.dateTime.reservationDate),
      },
    };
  } catch (error) {
    console.error('Error fetching reservation by ID from API:', error);
    return null;
  }
}

export async function addReservation(
  formData: GuestFormValues | ProducerFormValues,
  type: 'guest' | 'producer',
  producerName?: string
): Promise<void> {
  const newId = Date.now().toString();
  let requestDetailsBase: Omit<StudioReservationRequest, 'id' | 'type' | 'requesterName' | 'personalInfo' | 'cateringServices' | 'submittedAt' | 'status' | 'updatedAt' | 'programName'>;
  let personalInfo: PersonalInformation | undefined;
  let cateringServices: CateringService[] | undefined;
  let requester: string | undefined;
  let programName: string;

  if (type === 'guest') {
    const guestData = formData as GuestFormValues;
    requester = guestData.personalInfoName;
    personalInfo = {
      nameOrOrganization: guestData.personalInfoName,
      phoneNumber: guestData.personalInfoPhone,
      emailAddress: guestData.personalInfoEmail,
    };
    cateringServices = guestData.cateringServices as CateringService[];
    programName = 'Guest Reservation';
    requestDetailsBase = {
      dateTime: {
        reservationDate: guestData.reservationDate,
        startTime: guestData.reservationStartTime,
        endTime: guestData.reservationEndTime,
      },
      studio: guestData.studioSelection,
      studioServices: {
        serviceType: guestData.studioServiceType,
        numberOfDays: guestData.studioServiceDays,
        hoursPerDay: guestData.studioServiceHoursPerDay,
      },
      additionalServices: guestData.additionalServices as AdditionalService[],
      details: undefined,
      repetition: undefined,
      engineers: [],
      engineerCount: 1,
    };
  } else {
    const producerData = formData as ProducerFormValues;
    requester = producerName;
    programName = producerData.programName;
    requestDetailsBase = {
      dateTime: {
        reservationDate: producerData.reservationDate,
        startTime: producerData.reservationStartTime,
        endTime: producerData.reservationEndTime,
      },
      studio: producerData.studioSelection,
      studioServices: {
        serviceType: producerData.studioServiceType,
        numberOfDays: 1,
        hoursPerDay: 0, // Server will calculate this
      },
      additionalServices: producerData.additionalServices as AdditionalService[],
      details: producerData.details,
      repetition: { type: producerData.repetitionType, endDate: producerData.repetitionEndDate },
      engineers: [],
      engineerCount: 1, // Default to 1, will be updated in engineer assignment
    };
  }

  const newRequest: StudioReservationRequest = {
    id: newId,
    type: type,
    requesterName: requester,
    programName: programName,
    personalInfo: personalInfo,
    ...requestDetailsBase,
    cateringServices: cateringServices,
    submittedAt: new Date(),
    status: 'new',
  };

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: newRequest, type, producerName }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error adding reservation via API:', error);
    throw error;
  }
}

export async function updateReservationStatus(requestId: string, newStatus: StudioReservationRequest['status']): Promise<void> {
  try {
    const response = await fetch('/api/reservations', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestId, newStatus }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating reservation status via API:', error);
    throw error;
  }
}

export async function deleteReservation(requestId: string): Promise<void> {
  try {
    const response = await fetch(`/api/reservations/delete?id=${requestId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting reservation via API:', error);
    throw error;
  }
}
