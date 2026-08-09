import type { Patient, Doctor, Pharmacist, MedicalRecord, Prescription, ConsentRecord, AuditLog, NotificationItem } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    healthId: 'OSH-IND-100234',
    name: 'Aarav Sharma',
    dob: '1995-04-12',
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    address: '42 Lotus Heights, Indiranagar, Bengaluru, KA 560038',
    bloodGroup: 'O+',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    emergencyContact: {
      name: 'Priya Sharma (Wife)',
      relationship: 'Spouse',
      phone: '+91 98765 99887'
    },
    allergies: ['Penicillin', 'Peanuts', 'Dust Mites'],
    criticalConditions: ['Asthma (Mild)', 'Hypertension'],
    maskedAadhaar: 'XXXX-XXXX-4892',
    isVerified: true,
    createdAt: '2020-01-15T10:00:00Z'
  },
  {
    id: 'pat-2',
    healthId: 'OSH-IND-200567',
    name: 'Sunita Patel',
    dob: '1988-11-23',
    gender: 'Female',
    phone: '+91 98123 45678',
    email: 'sunita.patel@example.com',
    address: '108 Sunrise Greens, Powai, Mumbai, MH 400076',
    bloodGroup: 'B+',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    emergencyContact: {
      name: 'Ramesh Patel (Husband)',
      relationship: 'Spouse',
      phone: '+91 98123 99000'
    },
    allergies: ['Sulfa Drugs'],
    criticalConditions: ['Type 2 Diabetes'],
    maskedAadhaar: 'XXXX-XXXX-8123',
    isVerified: true,
    createdAt: '2021-03-20T14:30:00Z'
  },
  {
    id: 'pat-3',
    healthId: 'OSH-IND-300890',
    name: 'Vikram Singh',
    dob: '1972-07-05',
    gender: 'Male',
    phone: '+91 99001 12233',
    email: 'vikram.singh@example.com',
    address: '15 Civil Lines, Jaipur, RJ 302006',
    bloodGroup: 'AB+',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    emergencyContact: {
      name: 'Kavita Singh (Daughter)',
      relationship: 'Daughter',
      phone: '+91 99001 88776'
    },
    allergies: ['Latex'],
    criticalConditions: ['Coronary Artery Disease'],
    maskedAadhaar: 'XXXX-XXXX-3341',
    isVerified: true,
    createdAt: '2019-08-10T09:15:00Z'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rahul Sharma',
    licenseNumber: 'MCI-2012-84920',
    specialty: 'Cardiology',
    degree: 'MBBS, MD (Cardiology), FACC',
    certification: 'National Medical Commission Certificate #NMC-CARD-84920.pdf',
    hospital: 'Fortis National Heart Center',
    phone: '+91 98222 11100',
    email: 'dr.rahul.sharma@fortis.org',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Roy',
    licenseNumber: 'MCI-2016-39201',
    specialty: 'General Medicine & Pulmonology',
    degree: 'MBBS, MD (Pulmonology)',
    certification: 'Medical Council Board Certificate #MCB-PULM-39201.pdf',
    hospital: 'Manipal Super Specialty Hospital',
    phone: '+91 98333 22211',
    email: 'dr.ananya@manipal.org',
    verificationStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce7890f?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Mehta',
    licenseNumber: 'MCI-2018-91023',
    specialty: 'Orthopedics & Sports Surgery',
    degree: 'MBBS, MS (Orthopedics), M.Ch',
    certification: 'State Medical Registration & Fellowship Cert #SMC-ORTHO-91023.pdf',
    hospital: 'Apollo Healthcare Center',
    phone: '+91 98444 33322',
    email: 'dr.rajesh@apollohealth.org',
    verificationStatus: 'PENDING',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_PHARMACISTS: Pharmacist[] = [
  {
    id: 'pharm-1',
    name: 'Apollo Pharmacy Central',
    licenseNumber: 'KA-DRUG-88492',
    pharmacyName: 'Apollo Care Pharmacy #104',
    degree: 'B.Pharm, Registered Pharmacist',
    certification: 'State Pharmacy Council License #SPC-KA-88492.pdf',
    address: 'MG Road Metro Station Complex, Bengaluru',
    phone: '+91 80 2559 8800',
    email: 'dispense@apollopharmacy.in',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'pharm-2',
    name: 'MedPlus Health Mart',
    licenseNumber: 'KA-DRUG-77291',
    pharmacyName: 'MedPlus Indiranagar 100ft',
    degree: 'M.Pharm (Clinical Pharmacy)',
    certification: 'Pharmacy Practice Certificate #PPC-KA-77291.pdf',
    address: '100ft Road, Indiranagar, Bengaluru',
    phone: '+91 80 4123 9988',
    email: 'store88@medplus.in',
    verificationStatus: 'VERIFIED'
  }
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    patientId: 'pat-1',
    type: 'BIRTH',
    title: 'Birth & Infant Registration',
    date: '1995-04-12',
    time: '08:45 AM',
    provider: 'St. Martha Healthcare',
    hospital: 'St. Martha General Hospital',
    doctorName: 'Dr. S. K. Kulkarni',
    description: 'Normal delivery. Healthy birth weight 3.2 kg. Infant APGAR score 9/10.',
    details: {
      dischargeSummary: 'Mother and infant discharged in good condition after 48 hours monitoring.'
    }
  },
  {
    id: 'rec-2',
    patientId: 'pat-1',
    type: 'VACCINATION',
    title: 'Hepatitis B & Polio Immunization',
    date: '1995-04-15',
    time: '10:00 AM',
    provider: 'Urban Health Center',
    hospital: 'Urban Primary Health Unit',
    doctorName: 'Dr. Neha Verma',
    description: 'Primary birth dose immunizations administered safely.',
    details: {
      dose: 'Dose 1 of 3',
      nextDoseDate: '1995-05-15'
    }
  },
  {
    id: 'rec-3',
    patientId: 'pat-1',
    type: 'VACCINATION',
    title: 'COVID-19 Booster Vaccine (Corbevax)',
    date: '2022-06-18',
    time: '11:30 AM',
    provider: 'Manipal Hospital',
    hospital: 'Manipal Super Specialty Hospital',
    doctorName: 'Dr. Ananya Roy',
    description: 'Booster precautions dose administered in left deltoid.',
    details: {
      dose: 'Precaution Dose',
      nextDoseDate: 'N/A'
    }
  },
  {
    id: 'rec-4',
    patientId: 'pat-1',
    type: 'CONSULTATION',
    title: 'Routine Cardiac & Asthma Assessment',
    date: '2024-02-10',
    time: '03:15 PM',
    provider: 'Fortis National Heart Center',
    hospital: 'Fortis National Heart Center',
    doctorName: 'Dr. Rahul Sharma',
    description: 'Patient presented with mild dyspnea after exertion. Blood pressure 125/82 mmHg. Clear chest sounds.',
    details: {
      symptoms: ['Mild shortness of breath', 'Chest tightness during jog'],
      diagnosis: ['Controlled Mild Bronchial Asthma'],
      medicines: [
        {
          name: 'Budecort Inhaler 200mcg',
          dosage: '2 Puffs',
          frequency: 'Twice daily',
          duration: '30 Days',
          instructions: 'Rinse mouth after inhalation',
          timing: 'Anytime'
        },
        {
          name: 'Montair LC 10mg',
          dosage: '1 Tablet',
          frequency: 'Once daily at bedtime',
          duration: '30 Days',
          instructions: 'Take with water before sleep',
          timing: 'After Food'
        }
      ]
    }
  },
  {
    id: 'rec-5',
    patientId: 'pat-1',
    type: 'LAB_TEST',
    title: 'Comprehensive Lipid & Blood Panel',
    date: '2025-01-20',
    time: '09:00 AM',
    provider: 'Dr. Lal PathLabs',
    hospital: 'Dr. Lal Diagnostic Center',
    doctorName: 'Dr. Rahul Sharma',
    description: 'Routine Annual Blood Biochemistry and Lipid Profile.',
    details: {
      testResults: 'Total Cholesterol: 185 mg/dL (Desirable), HDL: 48 mg/dL, Triglycerides: 140 mg/dL, HbA1c: 5.4% (Normal)',
      referenceRange: 'Total Cholesterol < 200 mg/dL, HbA1c < 5.7%'
    }
  },
  {
    id: 'rec-6',
    patientId: 'pat-1',
    type: 'SURGERY',
    title: 'Laparoscopic Appendectomy',
    date: '2025-07-14',
    time: '06:00 AM',
    provider: 'Apollo Healthcare Center',
    hospital: 'Apollo Healthcare Center',
    doctorName: 'Dr. Rajesh Mehta',
    description: 'Emergency laparoscopic excision of inflamed non-perforated appendix under general anesthesia.',
    details: {
      surgeon: 'Dr. Rajesh Mehta, MS General Surgery',
      outcome: 'Successful procedure without intra-operative complications. Discharged post-op day 2.'
    }
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-101',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    patientHealthId: 'OSH-IND-100234',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rahul Sharma',
    hospital: 'Fortis National Heart Center',
    date: '2026-08-01',
    dispensed: true,
    dispensedAt: '2026-08-01T17:45:00Z',
    dispensedBy: 'Apollo Pharmacy Central',
    notes: 'Prescribed post cardiac & respiratory checkup.',
    medicines: [
      {
        name: 'Budecort Inhaler 200mcg',
        dosage: '2 Puffs',
        frequency: '1-0-1',
        duration: '30 Days',
        instructions: 'Rinse mouth after inhalation',
        timing: 'Anytime'
      },
      {
        name: 'Montair LC 10mg',
        dosage: '1 Tablet',
        frequency: '0-0-1',
        duration: '30 Days',
        instructions: 'Take at night before sleep',
        timing: 'After Food'
      }
    ]
  }
];

export const INITIAL_CONSENTS: ConsentRecord[] = [
  {
    id: 'cons-1',
    patientId: 'pat-1',
    providerId: 'doc-1',
    providerName: 'Dr. Rahul Sharma',
    providerRole: 'DOCTOR',
    organization: 'Fortis National Heart Center',
    requestDate: '2026-08-08T10:00:00Z',
    duration: '24h',
    status: 'GRANTED',
    expiresAt: '2026-08-09T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    actorName: 'Dr. Rahul Sharma',
    actorRole: 'DOCTOR (Cardiology)',
    organization: 'Fortis National Heart Center',
    action: 'Accessed Medical Timeline & Allergy Warning Profile',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    recordType: 'Full Medical History',
    timestamp: '2026-08-08 10:05:12 AM',
    status: 'AUTHORIZED'
  },
  {
    id: 'log-102',
    actorName: 'Apollo Pharmacy Central',
    actorRole: 'PHARMACIST',
    organization: 'Apollo Care Pharmacy #104',
    action: 'Verified Prescription #rx-101 and Dispensed Medication',
    patientId: 'pat-1',
    patientName: 'Aarav Sharma',
    recordType: 'Prescription',
    timestamp: '2026-08-01 05:45:00 PM',
    status: 'AUTHORIZED'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'pat-1',
    title: 'Access Granted',
    message: 'Dr. Rahul Sharma was granted temporary 24-hour access to your Health ID records.',
    type: 'SUCCESS',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'pat-1',
    title: 'Medication Dispensed',
    message: 'Apollo Pharmacy Central fulfilled prescription #rx-101 and updated your timeline.',
    type: 'INFO',
    timestamp: '1 day ago',
    read: true
  }
];
