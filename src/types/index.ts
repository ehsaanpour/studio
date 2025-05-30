// FormEase specific types (can be removed or commented out)
/*
export interface FormFieldSuggestion {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: string[]; // For select, radio
}

export interface FormFieldDefinition extends FormFieldSuggestion {
  placeholder?: string;
  required: boolean;
  validationRules?: string[];
}

export interface AppForm {
  id: string;
  name: string;
  description?: string;
  fields: FormFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}
*/

// Studio Reservation System Types
export interface PersonalInformation {
  nameOrOrganization: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface ReservationDateTime {
  reservationDate: Date;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export type StudioSelection = 'studio2' | 'studio5' | 'studio6'; // استودیو ۲ (فرانسه), استودیو ۵ (-۳), استودیو ۶ (مایا ناصر)

export interface StudioServicesInfo {
  serviceType: 'with_crew' | 'without_crew'; // استودیو با عوامل, استودیو بدون عوامل و تجهیزات
  numberOfDays: number;
  hoursPerDay: number;
}

export type AdditionalService =
  | 'videowall'
  | 'led_monitor'
  | 'xdcam'
  | 'stream_iranian'
  | 'stream_foreign'
  | 'stream_server'
  | 'zoom'
  | 'google_meet'
  | 'ms_teams'
  | 'lobby'
  | 'crane'
  | 'makeup_artist'
  | 'service_staff';

export type CateringService =
  | 'drinks'
  | 'breakfast'
  | 'snack'
  | 'lunch'
  | 'dinner';

export interface StudioReservationRequest {
  id: string; // Auto-generated or from backend
  type: 'guest' | 'producer';
  requesterName?: string; // For producer, derived from their login
  
  personalInfo?: PersonalInformation; // Required for guest, optional/excluded for producer
  
  dateTime: ReservationDateTime;
  studio: StudioSelection;
  studioServices: StudioServicesInfo;
  additionalServices?: AdditionalService[];
  cateringServices?: CateringService[]; // Excluded for producer
  
  status: 'new' | 'read' | 'confirmed' | 'cancelled';
  submittedAt: Date;
  updatedAt?: Date;
}

export interface Producer {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

