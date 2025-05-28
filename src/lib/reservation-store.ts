
'use client';

import type { StudioReservationRequest, PersonalInformation, ReservationDateTime, StudioSelection, StudioServicesInfo, AdditionalService, CateringService } from '@/types';
import type { GuestFormValues } from '@/components/forms/guest-reservation-form'; // Will create this type if not exported
import type { ProducerFormValues } from '@/components/forms/producer-reservation-form'; // Will create this type if not exported


let reservations: StudioReservationRequest[] = [];
const listeners: Set<() => void> = new Set();

export function getReservations(): StudioReservationRequest[] {
  return [...reservations].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()); // Return a copy, sorted newest first
}

export function addReservation(
  formData: GuestFormValues | ProducerFormValues,
  type: 'guest' | 'producer',
  producerName?: string
) {
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
    cateringServices = guestData.cateringServices;
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
      additionalServices: guestData.additionalServices,
    };
  } else { // producer
    const producerData = formData as ProducerFormValues;
    requester = producerName;
    // personalInfo and cateringServices are not submitted by producer
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
      additionalServices: producerData.additionalServices,
    };
  }

  const newRequest: StudioReservationRequest = {
    id: newId,
    type: type,
    requesterName: requester,
    personalInfo: personalInfo,
    ...requestDetailsBase,
    cateringServices: cateringServices,
    submittedAt: new Date(),
    status: 'new',
  };

  reservations = [newRequest, ...reservations]; // Add to the beginning
  notifyListeners();
}

export function updateReservationStatus(id: string, status: 'new' | 'read' | 'confirmed' | 'cancelled') {
    const requestIndex = reservations.findIndex(req => req.id === id);
    if (requestIndex > -1) {
        reservations[requestIndex].status = status;
        reservations[requestIndex].updatedAt = new Date();
        notifyListeners();
        console.log(`Reservation ${id} status updated to ${status}`, reservations);
    }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener); // Unsubscribe function
}

function notifyListeners() {
  listeners.forEach(listener => listener());
}

// Function to clear reservations for testing or reset (optional)
export function clearAllReservations_DEV_ONLY() {
    reservations = [];
    notifyListeners();
}
