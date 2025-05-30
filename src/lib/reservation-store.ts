'use client';

import type { StudioReservationRequest, PersonalInformation, ReservationDateTime, StudioSelection, StudioServicesInfo, AdditionalService, CateringService } from '@/types';
import type { GuestFormValues } from '@/components/forms/guest-reservation-form';
import type { ProducerFormValues } from '@/components/forms/producer-reservation-form';
import { readJsonFile, writeJsonFile } from './fs-utils';

interface ReservationsData {
  reservations: StudioReservationRequest[];
}

const RESERVATIONS_FILE = 'reservations.json';
const listeners: Set<() => void> = new Set();

// Helper function to get reservations from JSON file
async function getStoredReservations(): Promise<StudioReservationRequest[]> {
  const data = await readJsonFile<ReservationsData>(RESERVATIONS_FILE);
  return data?.reservations || [];
}

// Helper function to save reservations to JSON file
async function saveReservations(reservations: StudioReservationRequest[]): Promise<void> {
  await writeJsonFile<ReservationsData>(RESERVATIONS_FILE, { reservations });
}

export async function getReservations(): Promise<StudioReservationRequest[]> {
  const reservations = await getStoredReservations();
  // Convert submittedAt string to Date object for sorting
  const reservationsWithDates = reservations.map(reservation => ({
    ...reservation,
    submittedAt: new Date(reservation.submittedAt) // Ensure submittedAt is a Date object
  }));
  return reservationsWithDates.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

export async function addReservation(
  formData: GuestFormValues | ProducerFormValues,
  type: 'guest' | 'producer',
  producerName?: string
): Promise<void> {
  const newId = Date.now().toString();
  let requestDetailsBase: Omit<StudioReservationRequest, 'id' | 'type' | 'requesterName' | 'personalInfo' | 'cateringServices' | 'submittedAt' | 'status' | 'updatedAt'>;
  let personalInfo: PersonalInformation | undefined;
  let cateringServices: CateringService[] | undefined;
  let requester: string | undefined;

  if (type === 'guest') {
    const guestData = formData as GuestFormValues;
    requester = guestData.personalInfoName;
    personalInfo = {
      nameOrOrganization: guestData.personalInfoName,
      phoneNumber: guestData.personalInfoPhone,
      emailAddress: guestData.personalInfoEmail,
    };
    cateringServices = guestData.cateringServices as CateringService[];
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
    personalInfo: personalInfo,
    ...requestDetailsBase,
    cateringServices: cateringServices,
    submittedAt: new Date(), // Save as Date object
    status: 'new',
  };

  const reservations = await getStoredReservations();
  reservations.unshift(newRequest);
  await saveReservations(reservations);
  notifyListeners();
}

export async function updateReservationStatus(requestId: string, newStatus: StudioReservationRequest['status']): Promise<void> {
  const reservations = await getStoredReservations();
  const requestIndex = reservations.findIndex(req => req.id === requestId);
  
  if (requestIndex !== -1) {
    reservations[requestIndex] = {
      ...reservations[requestIndex],
      status: newStatus,
      updatedAt: new Date(),
    };
    await saveReservations(reservations);
    notifyListeners();
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(listener => listener());
}

// Function to clear reservations for testing or reset (optional)
export async function clearAllReservations_DEV_ONLY(): Promise<void> {
  await saveReservations([]);
  notifyListeners();
}
