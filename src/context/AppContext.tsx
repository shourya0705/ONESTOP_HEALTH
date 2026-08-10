import React, { createContext, useContext, useState } from 'react';
import type { 
  UserRole, Patient, Doctor, Pharmacist, MedicalRecord, 
  Prescription, ConsentRecord, AuditLog, NotificationItem, MedicineItem, AccessDuration, Appointment
} from '../types';
import { 
  INITIAL_PATIENTS, INITIAL_DOCTORS, INITIAL_PHARMACISTS, 
  INITIAL_RECORDS, INITIAL_PRESCRIPTIONS, INITIAL_CONSENTS, 
  INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS 
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  patients: Patient[];
  doctors: Doctor[];
  pharmacists: Pharmacist[];
  records: MedicalRecord[];
  prescriptions: Prescription[];
  consents: ConsentRecord[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  
  currentPatient: Patient;
  currentDoctor: Doctor;
  currentPharmacist: Pharmacist;
  
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  
  // Workflows & Actions
  registerPatient: (data: Omit<Patient, 'id' | 'healthId' | 'isVerified' | 'createdAt'>) => { success: boolean; healthId?: string; error?: string };
  registerDoctor: (data: Omit<Doctor, 'id' | 'verificationStatus'>) => { success: boolean; message?: string };
  registerPharmacist: (data: Omit<Pharmacist, 'id' | 'verificationStatus'>) => { success: boolean; message?: string };
  requestDoctorAccess: (patientHealthId: string, duration: AccessDuration) => { success: boolean; message: string; consentId?: string };
  grantConsent: (consentId: string) => void;
  denyConsent: (consentId: string) => void;
  revokeConsent: (consentId: string) => void;
  emergencyAccessOverride: (patientHealthId: string, reason: string) => { success: boolean; patient?: Patient };
  
  createPrescription: (patientHealthId: string, medicines: MedicineItem[], notes?: string) => { success: boolean; prescriptionId?: string };
  dispensePrescription: (prescriptionId: string, substitutions?: Record<string, string>) => { success: boolean; message: string };
  
  verifyDoctorStatus: (doctorId: string, status: 'VERIFIED' | 'REJECTED') => void;
  verifyPharmacistStatus: (pharmacistId: string, status: 'VERIFIED' | 'REJECTED') => void;
  
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  markNotificationRead: (notifId: string) => void;
  
  appointments: Appointment[];
  bookAppointment: (data: Omit<Appointment, 'id' | 'status'>) => { success: boolean; message: string };
  updateAppointmentStatus: (id: string, status: 'CONFIRMED' | 'REJECTED' | 'COMPLETED') => void;
  
  searchPatientByHealthId: (healthId: string) => Patient | undefined;
  hasAuthorizedAccess: (patientHealthId: string, providerId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>(INITIAL_PHARMACISTS);
  const [records, setRecords] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [currentPatientId, setCurrentPatientId] = useState<string>('pat-1');
  const [currentDoctorId] = useState<string>('doc-1');
  const [currentPharmacistId] = useState<string>('pharm-1');
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      patientId: 'pat-1',
      patientName: 'Aarav Sharma',
      patientHealthId: 'OSH-IND-100234',
      doctorId: 'doc-1',
      doctorName: 'Dr. Rahul Sharma',
      specialty: 'Cardiology',
      hospital: 'Fortis National Heart Center',
      date: '2026-08-12',
      time: '10:30 AM',
      reason: 'Routine cardiovascular follow-up checkup',
      status: 'CONFIRMED'
    },
    {
      id: 'apt-2',
      patientId: 'pat-1',
      patientName: 'Aarav Sharma',
      patientHealthId: 'OSH-IND-100234',
      doctorId: 'doc-2',
      doctorName: 'Dr. Ananya Roy',
      specialty: 'Pulmonology',
      hospital: 'Manipal Super Specialty Hospital',
      date: '2026-08-18',
      time: '03:15 PM',
      reason: 'Asthma inhaler adjustment and breathing test',
      status: 'PENDING'
    }
  ]);

  const currentPatient = patients.find(p => p.id === currentPatientId) || patients[0];
  const currentDoctor = doctors.find(d => d.id === currentDoctorId) || doctors[0];
  const currentPharmacist = pharmacists.find(p => p.id === currentPharmacistId) || pharmacists[0];

  // Helper to generate unique OSH Health ID
  const generateHealthId = (): string => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `OSH-IND-${randomNum}`;
  };

  // Register New Citizen
  const registerPatient = (data: Omit<Patient, 'id' | 'healthId' | 'isVerified' | 'createdAt'>) => {
    // Uniqueness check: Mobile number or Masked Aadhaar
    const phoneExists = patients.some(p => p.phone === data.phone);
    const aadhaarExists = patients.some(p => p.maskedAadhaar === data.maskedAadhaar);
    
    if (phoneExists || aadhaarExists) {
      return { 
        success: false, 
        error: 'A Health ID already exists for this citizen. Please recover or verify your existing Health ID.' 
      };
    }

    const newHealthId = generateHealthId();
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      healthId: newHealthId,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    setPatients(prev => [newPatient, ...prev]);
    setCurrentPatientId(newPatient.id);

    // Create birth / initial profile audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: newPatient.name,
      actorRole: 'CITIZEN',
      organization: 'ONESTOP National Portal',
      action: 'Created Universal Digital Health ID',
      patientId: newPatient.id,
      patientName: newPatient.name,
      recordType: 'Registration',
      timestamp: new Date().toLocaleString(),
      status: 'AUTHORIZED'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return { success: true, healthId: newHealthId };
  };

  // Register New Doctor
  const registerDoctor = (data: Omit<Doctor, 'id' | 'verificationStatus'>) => {
    const newDoc: Doctor = {
      ...data,
      id: `doc-${Date.now()}`,
      verificationStatus: 'PENDING'
    };
    setDoctors(prev => [newDoc, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `log-doc-reg-${Date.now()}`,
      actorName: newDoc.name,
      actorRole: 'DOCTOR (APPLICANT)',
      organization: newDoc.hospital,
      action: `Submitted Medical Registration & Degree (${newDoc.degree || 'Medical License'})`,
      patientId: 'N/A',
      patientName: 'N/A',
      recordType: 'Doctor Licensing Registration',
      timestamp: new Date().toLocaleString(),
      status: 'AUTHORIZED'
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: 'Doctor registration application submitted for National Registry Verification!' };
  };

  // Register New Pharmacist
  const registerPharmacist = (data: Omit<Pharmacist, 'id' | 'verificationStatus'>) => {
    const newPharm: Pharmacist = {
      ...data,
      id: `pharm-${Date.now()}`,
      verificationStatus: 'PENDING'
    };
    setPharmacists(prev => [newPharm, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `log-pharm-reg-${Date.now()}`,
      actorName: newPharm.pharmacyName,
      actorRole: 'PHARMACIST (APPLICANT)',
      organization: newPharm.pharmacyName,
      action: `Submitted Pharmacy License & Degree (${newPharm.degree || 'Drug License'})`,
      patientId: 'N/A',
      patientName: 'N/A',
      recordType: 'Pharmacy Licensing Registration',
      timestamp: new Date().toLocaleString(),
      status: 'AUTHORIZED'
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: 'Pharmacy registration application submitted for Drug License Verification!' };
  };

  // Search Patient
  const searchPatientByHealthId = (healthId: string) => {
    const cleanId = healthId.trim().toUpperCase();
    return patients.find(p => p.healthId.toUpperCase() === cleanId || p.maskedAadhaar.includes(cleanId));
  };

  // Check consent authorization
  const hasAuthorizedAccess = (patientHealthId: string, providerId: string) => {
    const patient = searchPatientByHealthId(patientHealthId);
    if (!patient) return false;
    
    const activeConsent = consents.find(
      c => c.patientId === patient.id && c.providerId === providerId && c.status === 'GRANTED'
    );
    return !!activeConsent;
  };

  // Request Access (Doctor/Pharmacist -> Patient)
  const requestDoctorAccess = (patientHealthId: string, duration: AccessDuration) => {
    const targetPatient = searchPatientByHealthId(patientHealthId);
    if (!targetPatient) {
      return { success: false, message: 'Health ID not found in ONESTOP Health Registry.' };
    }

    const isPharm = currentRole === 'PHARMACIST';

    // Create Consent Request
    const newConsent: ConsentRecord = {
      id: `cons-${Date.now()}`,
      patientId: targetPatient.id,
      providerId: isPharm ? currentPharmacist.id : currentDoctor.id,
      providerName: isPharm ? currentPharmacist.pharmacyName : currentDoctor.name,
      providerRole: isPharm ? 'PHARMACIST' : 'DOCTOR',
      organization: isPharm ? currentPharmacist.pharmacyName : currentDoctor.hospital,
      requestDate: new Date().toISOString(),
      duration: duration,
      status: 'PENDING'
    };

    setConsents(prev => [newConsent, ...prev]);

    // Send instant Notification to Patient
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetPatient.id,
      title: 'New Access Request',
      message: `${newConsent.providerName} requested access to your medical history for ${duration}.`,
      type: 'ALERT',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: `Access request sent to ${targetPatient.name}. Waiting for consent approval.`, consentId: newConsent.id };
  };

  // Grant Consent
  const grantConsent = (consentId: string) => {
    let targetConsent: ConsentRecord | undefined;
    setConsents(prev => prev.map(c => {
      if (c.id === consentId) {
        targetConsent = c;
        const now = new Date();
        let expTime: string;
        if (c.duration.startsWith('Till ')) {
          const dateStr = c.duration.replace('Till ', '');
          const targetDate = new Date(dateStr);
          targetDate.setHours(23, 59, 59, 999);
          expTime = targetDate.toISOString();
        } else {
          let expireHours = 1;
          if (c.duration === '30m') expireHours = 0.5;
          if (c.duration === '24h') expireHours = 24;
          expTime = new Date(now.getTime() + expireHours * 3600 * 1000).toISOString();
        }
        return { ...c, status: 'GRANTED', expiresAt: expTime };
      }
      return c;
    }));

    if (targetConsent) {
      const patient = patients.find(p => p.id === targetConsent?.patientId);
      // Log Audit
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        actorName: targetConsent.providerName,
        actorRole: targetConsent.providerRole,
        organization: targetConsent.organization,
        action: `Patient Granted Record Access (${targetConsent.duration})`,
        patientId: targetConsent.patientId,
        patientName: patient?.name || 'Patient',
        recordType: 'Full Medical History',
        timestamp: new Date().toLocaleString(),
        status: 'AUTHORIZED'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // Deny Consent
  const denyConsent = (consentId: string) => {
    setConsents(prev => prev.map(c => c.id === consentId ? { ...c, status: 'DENIED' } : c));
  };

  // Revoke Consent
  const revokeConsent = (consentId: string) => {
    let targetConsent: ConsentRecord | undefined;
    setConsents(prev => prev.map(c => {
      if (c.id === consentId) {
        targetConsent = c;
        return { ...c, status: 'REVOKED' };
      }
      return c;
    }));

    if (targetConsent) {
      const patient = patients.find(p => p.id === targetConsent?.patientId);
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        actorName: targetConsent.providerName,
        actorRole: targetConsent.providerRole,
        organization: targetConsent.organization,
        action: 'Patient Revoked Record Access',
        patientId: targetConsent.patientId,
        patientName: patient?.name || 'Patient',
        recordType: 'Medical History',
        timestamp: new Date().toLocaleString(),
        status: 'REVOKED'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // Emergency Access Override
  const emergencyAccessOverride = (patientHealthId: string, reason: string) => {
    const targetPatient = searchPatientByHealthId(patientHealthId);
    if (!targetPatient) {
      return { success: false };
    }

    const emergencyConsent: ConsentRecord = {
      id: `cons-emerg-${Date.now()}`,
      patientId: targetPatient.id,
      providerId: currentDoctor.id,
      providerName: currentDoctor.name,
      providerRole: 'DOCTOR',
      organization: currentDoctor.hospital,
      requestDate: new Date().toISOString(),
      duration: 'EMERGENCY',
      status: 'GRANTED',
      expiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
    };

    setConsents(prev => [emergencyConsent, ...prev]);

    // High Priority Audit Log
    const emergencyLog: AuditLog = {
      id: `log-emerg-${Date.now()}`,
      actorName: currentDoctor.name,
      actorRole: 'DOCTOR (EMERGENCY OVERRIDE)',
      organization: currentDoctor.hospital,
      action: `EMERGENCY ACCESS TRIGGERED: ${reason}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      recordType: 'Emergency Profile & History',
      timestamp: new Date().toLocaleString(),
      status: 'EMERGENCY_OVERRIDE'
    };
    setAuditLogs(prev => [emergencyLog, ...prev]);

    return { success: true, patient: targetPatient };
  };

  // Doctor Creates Digital Prescription
  const createPrescription = (patientHealthId: string, medicines: MedicineItem[], notes?: string) => {
    const targetPatient = searchPatientByHealthId(patientHealthId);
    if (!targetPatient) return { success: false };

    const newRx: Prescription = {
      id: `rx-${Math.floor(100 + Math.random() * 900)}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      patientHealthId: targetPatient.healthId,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      hospital: currentDoctor.hospital,
      date: new Date().toISOString().split('T')[0],
      medicines,
      dispensed: false,
      notes
    };

    setPrescriptions(prev => [newRx, ...prev]);

    // Send Notification to Patient
    const notif: NotificationItem = {
      id: `notif-rx-${Date.now()}`,
      userId: targetPatient.id,
      title: 'New Digital Prescription Created',
      message: `${currentDoctor.name} generated a new digital prescription (#${newRx.id}).`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    // Create Audit Log
    const audit: AuditLog = {
      id: `log-rx-${Date.now()}`,
      actorName: currentDoctor.name,
      actorRole: 'DOCTOR',
      organization: currentDoctor.hospital,
      action: `Issued Digital Prescription #${newRx.id}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      recordType: 'Prescription',
      timestamp: new Date().toLocaleString(),
      status: 'AUTHORIZED'
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, prescriptionId: newRx.id };
  };

  // Pharmacist Dispense Medicine Workflow
  const dispensePrescription = (prescriptionId: string, substitutions?: Record<string, string>) => {
    const rx = prescriptions.find(p => p.id === prescriptionId);
    if (!rx) return { success: false, message: 'Prescription not found.' };
    if (rx.dispensed) return { success: false, message: 'This prescription has already been dispensed.' };

    const nowStr = new Date().toISOString();
    
    // Determine dispensed medicines names taking substitutions into account
    const finalMedicines = rx.medicines.map(m => {
      if (substitutions && substitutions[m.name]) {
        return {
          ...m,
          name: `${substitutions[m.name]} (Substituted for ${m.name})`
        };
      }
      return m;
    });

    // 1. Mark prescription as dispensed
    setPrescriptions(prev => prev.map(p => p.id === prescriptionId ? {
      ...p,
      dispensed: true,
      dispensedAt: nowStr,
      dispensedBy: currentPharmacist.pharmacyName,
      substitutions: substitutions
    } : p));

    // 2. Automatically append MEDICATION record to patient's Medical History Timeline
    const newRecord: MedicalRecord = {
      id: `rec-disp-${Date.now()}`,
      patientId: rx.patientId,
      type: 'MEDICATION',
      title: `Pharmacy Dispensed: ${finalMedicines.map(m => m.name).join(', ')}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: currentPharmacist.pharmacyName,
      hospital: currentPharmacist.pharmacyName,
      doctorName: rx.doctorName,
      description: `Fulfilled under Prescription #${rx.id}. Dispensed by ${currentPharmacist.name}.${
        substitutions && Object.keys(substitutions).length > 0
          ? ` Substitutions made: ${Object.entries(substitutions).map(([orig, sub]) => `${orig} -> ${sub}`).join(', ')}.`
          : ''
      }`,
      details: {
        medicines: finalMedicines
      }
    };
    setRecords(prev => [newRecord, ...prev]);

    // 3. Log Audit Entry
    const audit: AuditLog = {
      id: `log-disp-${Date.now()}`,
      actorName: currentPharmacist.pharmacyName,
      actorRole: 'PHARMACIST',
      organization: currentPharmacist.pharmacyName,
      action: `Fulfilled & Dispensed Prescription #${rx.id}${
        substitutions && Object.keys(substitutions).length > 0 ? ' with substitutions' : ''
      }`,
      patientId: rx.patientId,
      patientName: rx.patientName,
      recordType: 'Pharmacy Dispensing',
      timestamp: new Date().toLocaleString(),
      status: 'AUTHORIZED'
    };
    setAuditLogs(prev => [audit, ...prev]);

    // 4. Send Notification
    const notif: NotificationItem = {
      id: `notif-disp-${Date.now()}`,
      userId: rx.patientId,
      title: 'Medication Dispensed',
      message: `Your prescription #${rx.id} was successfully dispensed by ${currentPharmacist.pharmacyName} and added to your Medical History Timeline.${
        substitutions && Object.keys(substitutions).length > 0 ? ' (Substitutions applied)' : ''
      }`,
      type: 'SUCCESS',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: `Prescription #${rx.id} dispensed successfully! Patient medical timeline updated.` };
  };

  // Admin Doctor Verification
  const verifyDoctorStatus = (doctorId: string, status: 'VERIFIED' | 'REJECTED') => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, verificationStatus: status } : d));
  };

  // Admin Pharmacist Verification
  const verifyPharmacistStatus = (pharmacistId: string, status: 'VERIFIED' | 'REJECTED') => {
    setPharmacists(prev => prev.map(p => p.id === pharmacistId ? { ...p, verificationStatus: status } : p));
  };

  // Add Custom Medical Record
  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>) => {
    const newRec: MedicalRecord = {
      ...recordData,
      id: `rec-${Date.now()}`
    };
    setRecords(prev => [newRec, ...prev]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      status: 'PENDING'
    };
    setAppointments(prev => [newApt, ...prev]);

    // Send notification to Doctor
    const notif: NotificationItem = {
      id: `notif-apt-${Date.now()}`,
      userId: data.doctorId,
      title: 'Appointment Request Received',
      message: `Patient ${data.patientName} (${data.patientHealthId}) has requested an appointment on ${data.date} at ${data.time}.`,
      type: 'ALERT',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: 'Appointment request sent successfully.' };
  };

  const updateAppointmentStatus = (id: string, status: 'CONFIRMED' | 'REJECTED' | 'COMPLETED') => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        // Send notification to Patient
        const notif: NotificationItem = {
          id: `notif-apt-status-${Date.now()}`,
          userId: a.patientId,
          title: status === 'CONFIRMED' ? 'Appointment Approved' : 'Appointment Rejected',
          message: status === 'CONFIRMED'
            ? `${a.doctorName} accepted your consultation request for ${a.date} at ${a.time}.`
            : `${a.doctorName} was unable to accept your request for ${a.date} at ${a.time}.`,
          type: status === 'CONFIRMED' ? 'SUCCESS' : 'WARNING',
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prevNotif => [notif, ...prevNotif]);
        return { ...a, status };
      }
      return a;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      activeTab,
      setActiveTab,
      patients,
      doctors,
      pharmacists,
      records,
      prescriptions,
      consents,
      auditLogs,
      notifications,
      currentPatient,
      currentDoctor,
      currentPharmacist,
      aiDrawerOpen,
      setAiDrawerOpen,
      registerPatient,
      registerDoctor,
      registerPharmacist,
      requestDoctorAccess,
      grantConsent,
      denyConsent,
      revokeConsent,
      emergencyAccessOverride,
      createPrescription,
      dispensePrescription,
      verifyDoctorStatus,
      verifyPharmacistStatus,
      addMedicalRecord,
      markNotificationRead,
      appointments,
      bookAppointment,
      updateAppointmentStatus,
      searchPatientByHealthId,
      hasAuthorizedAccess
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
