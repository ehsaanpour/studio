'use client';

import type { StudioReservationRequest, PersonalInformation, ReservationDateTime, StudioSelection, StudioServicesInfo, AdditionalService, CateringService } from '@/types';
import type { GuestFormValues } from '@/components/forms/guest-reservation-form';
import type { ProducerFormValues } from '@/components/forms/producer-reservation-form';
// import { readJsonFile, writeJsonFile } from './fs-utils'; // No longer directly used here

// interface ReservationsData { // No longer needed
//   reservations: StudioReservationRequest[];
// }

// const RESERVATIONS_FILE = 'reservations.json'; // No longer directly used here
// const listeners: Set<() => void> = new Set(); // No longer needed for client-side reactivity

// Helper function to get reservations from JSON file // No longer needed
// async function getStoredReservations(): Promise<StudioReservationRequest[]> {
//   const data = await readJsonFile<ReservationsData>(RESERVATIONS_FILE);
//   return data?.reservations || [];
// }

// Helper function to save reservations to JSON file // No longer needed
// async function saveReservations(reservations: StudioReservationRequest[]): Promise<void> {
//   await writeJsonFile<ReservationsData>(RESERVATIONS_FILE, { reservations });
// }

export async function getReservations(): Promise<StudioReservationRequest[]> {
  try {
    const response = await fetch('/api/reservations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Convert submittedAt string to Date object for sorting
    const reservationsWithDates = data.map((reservation: StudioReservationRequest) => ({
      ...reservation,
      submittedAt: new Date(reservation.submittedAt) // Ensure submittedAt is a Date object
    }));
    return reservationsWithDates.sort((a: StudioReservationRequest, b: StudioReservationRequest) => b.submittedAt.getTime() - a.submittedAt.getTime());
  } catch (error) {
    console.error('Error fetching reservations from API:', error);
    return [];
  }
}

export async function addReservation(
  formData: GuestFormValues | ProducerFormValues,
  type: 'guest' | 'producer',
  producerName?: string
): Promise<void> {
  // The newId, requestDetailsBase, personalInfo, cateringServices, requester logic
  // should ideally be moved to the API route or a server action
  // For now, I'll keep it here and send the constructed object to the API
  const newId = Date.now().toString();
  let requestDetailsBase: Omit<StudioReservationRequest, 'id' | 'type' | 'requesterName' | 'personalInfo' | 'cateringServices' | 'submittedAt' | 'status' | 'updatedAt' | 'programName'>;
  let personalInfo: PersonalInformation | undefined;
  let cateringServices: CateringService[] | undefined;
  let requester: string | undefined;
  let programName: string; // Declare programName here

  if (type === 'guest') {
    const guestData = formData as GuestFormValues;
    requester = guestData.personalInfoName;
    personalInfo = {
      nameOrOrganization: guestData.personalInfoName,
      phoneNumber: guestData.personalInfoPhone,
      emailAddress: guestData.personalInfoEmail,
    };
    cateringServices = guestData.cateringServices as CateringService[];
    programName = 'Guest Reservation'; // Default program name for guest
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
    };
  } else {
    const producerData = formData as ProducerFormValues;
    requester = producerName;
    programName = producerData.programName; // Get program name from producer form data
    requestDetailsBase = {
      dateTime: {
        reservationDate: producerData.reservationDate,
        startTime: producerData.reservationStartTime,
        endTime: producerData.reservationEndTime,
      },
      studio: producerData.studioSelection,
      studioServices: {
        serviceType: producerData.studioServiceType,
        numberOfDays: producerData.studioServiceDays,
        hoursPerDay: producerData.studioServiceHoursPerDay,
      },
      additionalServices: producerData.additionalServices as AdditionalService[],
    };
  }

  const newRequest: StudioReservationRequest = {
    id: newId,
    type: type,
    requesterName: requester,
    programName: programName, // Assign programName here
    personalInfo: personalInfo,
    ...requestDetailsBase,
    cateringServices: cateringServices,
    submittedAt: new Date(), // Save as Date object
    status: 'new',
  };

  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: newRequest, type, producerName }), // Send the constructed request
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

// export function subscribe(listener: () => void) { // No longer needed
//   listeners.add(listener);
//   return () => listeners.delete(listener);
// }

// function notifyListeners() { // No longer needed
//   listeners.forEach(listener => listener());
// }

// Function to clear reservations for testing or reset (optional) // No longer needed
// export async function clearAllReservations_DEV_ONLY(): Promise<void> {
//   await saveReservations([]);
//   notifyListeners();
// }
