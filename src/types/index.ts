export type UserRole = 'PATIENT' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN' | 'GUEST';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type RecordType = 
  | 'BIRTH'
  | 'VACCINATION'
  | 'CONSULTATION'
  | 'MEDICATION'
  | 'SURGERY'
  | 'LAB_TEST'
  | 'HOSPITALIZATION';

export interface Patient {
  id: string;
  healthId: string; // format: OSH-IND-XXXXXXXX
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  photo?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  criticalConditions: string[];
  maskedAadhaar: string; // e.g., XXXX-XXXX-4892
  isVerified: boolean;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  licenseNumber: string;
  specialty: string;
  degree?: string;
  certification?: string;
  hospital: string;
  phone: string;
  email: string;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
}

export interface Pharmacist {
  id: string;
  name: string;
  licenseNumber: string;
  pharmacyName: string;
  degree?: string;
  certification?: string;
  address: string;
  phone: string;
  email: string;
  verificationStatus: VerificationStatus;
  photo?: string;
}

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Anytime';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: RecordType;
  title: string;
  date: string;
  time: string;
  provider: string;
  hospital: string;
  doctorName: string;
  description: string;
  details?: {
    dose?: string;
    nextDoseDate?: string;
    symptoms?: string[];
    diagnosis?: string | string[];
    medicines?: MedicineItem[];
    surgeon?: string;
    outcome?: string;
    testResults?: string;
    referenceRange?: string;
    dischargeSummary?: string;
    reaction?: string;
    severity?: 'Mild' | 'Moderate' | 'Severe';
  };
  documentUrl?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientHealthId: string;
  doctorId: string;
  doctorName: string;
  hospital: string;
  date: string;
  medicines: MedicineItem[];
  dispensed: boolean;
  dispensedAt?: string;
  dispensedBy?: string;
  notes?: string;
}

export type AccessDuration = '30m' | '1h' | '24h' | 'EMERGENCY' | string;

export interface ConsentRecord {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  providerRole: 'DOCTOR' | 'PHARMACIST';
  organization: string;
  requestDate: string;
  duration: AccessDuration;
  status: 'PENDING' | 'GRANTED' | 'DENIED' | 'REVOKED';
  expiresAt?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  organization: string;
  action: string;
  patientId: string;
  patientName: string;
  recordType: string;
  timestamp: string;
  status: 'AUTHORIZED' | 'REVOKED' | 'EMERGENCY_OVERRIDE';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  timestamp: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientHealthId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED';
}
