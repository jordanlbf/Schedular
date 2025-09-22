// Schedule Delivery feature types
export interface DeliverySchedule {
  id: string;
  orderId: string;
  customerId: string;
  deliveryDate: Date;
  timeSlot: TimeSlot;
  address: DeliveryAddress;
  status: DeliveryStatus;
  driver?: Driver;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  capacity: number;
  available: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
}

export interface DeliverySlot {
  date: Date;
  slots: TimeSlot[];
}

export interface ScheduleDeliveryState {
  schedules: DeliverySchedule[];
  availableSlots: DeliverySlot[];
  selectedSlot: TimeSlot | null;
  isLoading: boolean;
  error: string | null;
}
