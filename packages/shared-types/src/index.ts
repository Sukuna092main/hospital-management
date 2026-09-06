// ---- Enums (khớp docs/schema.dbml) ----
export type UserRoleName = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'PHARMACIST' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type OauthProvider = 'GOOGLE' | 'FACEBOOK';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH';
export type MessageRole = 'USER' | 'BOT';

// ---- Auth ----
export interface JwtPayload {
  sub: string; // users.id
  email: string;
  roles: UserRoleName[];
  iat?: number;
  exp?: number;
}

// ---- Identity ----
export interface User {
  id: string;
  email: string;
  status: UserStatus;
  roles?: UserRoleName[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'CANCEL' | 'DISPENSE' | string;
  resourceType: 'MEDICAL_RECORD' | 'APPOINTMENT' | 'USER' | 'INVOICE' | string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---- Scheduling ----
export interface Patient {
  id: string;
  userId: string; // ref -> Identity.users.id
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  insuranceNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface Department {
  id: number;
  name: string;
  location: string;
}

export interface Doctor {
  id: string;
  userId: string; // ref -> Identity.users.id
  fullName: string;
  specialty: string;
  licenseNumber: string;
  departmentId: number;
  status: 'ON_DUTY' | 'OFF';
}

export interface Staff {
  id: string;
  userId: string;
  fullName: string;
  role: 'NURSE' | 'TECHNICIAN';
  departmentId: number;
}

export interface Schedule {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  reason?: string;
  createdAt: string;
}

export interface AppointmentStatusHistory {
  id: string;
  appointmentId: string;
  oldStatus: AppointmentStatus | null;
  newStatus: AppointmentStatus;
  changedBy: string; // ref -> Identity.users.id
  changedAt: string;
}

// ---- Clinical (MongoDB embedded) ----
export interface Vitals {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
}

export interface PrescriptionItem {
  id: string;
  medicationId: string; // ref -> Resource.medications.id
  name: string; // snapshot
  dosage: string;
  quantity: number;
  unitPrice: number; // snapshot
  instructions?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string; // ref -> Scheduling.patients.id
  doctorId: string;
  appointmentId: string;
  visitDate: string;
  diagnosisIcd10?: string;
  diagnosisDescription?: string;
  vitals?: Vitals;
  prescriptions: PrescriptionItem[];
  notes?: string;
  createdAt: string;
}

// ---- Resource ----
export interface Medication {
  id: string;
  name: string;
  sku: string;
  unit: string;
  price: number;
  description?: string;
}

export interface InventoryBatch {
  id: string;
  medicationId: string;
  batchNumber: string;
  stockQuantity: number;
  reorderThreshold: number;
  expiryDate: string;
}

export interface DispenseRecord {
  id: string;
  prescriptionId: string; // ref -> Clinical.records.prescriptions[].id
  medicationId: string;
  batchId: string;
  quantity: number;
  dispensedBy: string; // ref -> Scheduling.staff.id
  dispensedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemType: 'CONSULTATION' | 'LAB' | 'MEDICATION' | 'ROOM';
  description: string;
  amount: number;
  sourceType?: string;
  sourceId?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId: string;
  subtotal: number;
  insuranceCovered: number;
  patientPayable: number;
  status: InvoiceStatus;
  items?: InvoiceItem[];
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'EWALLET';
  transactionRef?: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  refundedAt: string;
}

// ---- Engagement ----
export interface Notification {
  id: string;
  userId: string;
  channel: NotificationChannel;
  eventType: string;
  content: string;
  status: 'SENT' | 'FAILED';
  sentAt: string;
}

export interface Faq {
  id: string;
  category: 'GIO_KHAM' | 'THU_TUC' | 'BAO_HIEM' | 'KHOA_PHONG';
  question: string;
  answer: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

// ---- API chung (RFC 7807 + phân trang) ----
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}