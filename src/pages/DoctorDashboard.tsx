import React, { useState } from 'react';
import { 
  Search, ShieldCheck, AlertTriangle, Pill, 
  CheckCircle2, Plus, Lock, Calendar, FileText, UserCheck, ShieldAlert,
  Building, BookOpen, Clock, Activity, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { MedicineItem } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentDoctor, searchPatientByHealthId, hasAuthorizedAccess, 
    requestDoctorAccess, emergencyAccessOverride, createPrescription, records, prescriptions, consents, patients, appointments, activeTab, setActiveTab
  } = useApp();

  // Selected patient for lookup and patient details view
  const [searchHealthId, setSearchHealthId] = useState('OSH-IND-100234');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [accessRequestedMsg, setAccessRequestedMsg] = useState<string | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');

  // Prescription Form State
  const [showRxModal, setShowRxModal] = useState(false);
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { name: 'Amoxicillin 500mg', dosage: '1 Capsule', frequency: '1-0-1', duration: '5 Days', instructions: 'Finish complete course', timing: 'After Food' }
  ]);
  const [rxNotes, setRxNotes] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New Consent Request States
  const [requestHealthId, setRequestHealthId] = useState('');
  const [durationMode, setDurationMode] = useState<'preset' | 'date'>('preset');
  const [presetDuration, setPresetDuration] = useState('1h');
  const [tillDate, setTillDate] = useState(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);

  // Search Patient in Patients Registry
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessRequestedMsg(null);
    setSuccessBanner(null);
    const pat = searchPatientByHealthId(searchHealthId);
    setSelectedPatient(pat || null);
  };

  // Request Consent
  const handleRequestAccess = () => {
    if (!selectedPatient) return;
    const res = requestDoctorAccess(selectedPatient.healthId, '1h');
    setAccessRequestedMsg(res.message);
  };

  // Emergency Access
  const handleEmergencyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !emergencyReason) return;
    const res = emergencyAccessOverride(selectedPatient.healthId, emergencyReason);
    if (res.success) {
      setShowEmergencyModal(false);
      setSuccessBanner(`EMERGENCY ACCESS UNLOCKED for ${selectedPatient.name}. Access logged for medical audit review.`);
    }
  };

  // Request Access from the Consent Request Panel
  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestHealthId) return;
    const finalDuration = durationMode === 'date' ? `Till ${tillDate}` : presetDuration;
    const res = requestDoctorAccess(requestHealthId, finalDuration);
    setSuccessBanner(res.message);
    setRequestHealthId('');
  };

  // Add Medicine Row
  const addMedicineRow = () => {
    setMedicines(prev => [...prev, { name: '', dosage: '1 Tablet', frequency: '1-0-1', duration: '7 Days', instructions: '', timing: 'After Food' }]);
  };

  // Save Prescription
  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const res = createPrescription(selectedPatient.healthId, medicines, rxNotes);
    if (res.success) {
      setShowRxModal(false);
      setSuccessBanner(`Digital Prescription #${res.prescriptionId} issued successfully for ${selectedPatient.name}. Sent to Patient Health ID & Pharmacy network.`);
    }
  };

  const isUnlocked = selectedPatient ? hasAuthorizedAccess(selectedPatient.healthId, currentDoctor.id) : false;

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (['VERIFIED', 'ACTIVE', 'APPROVED', 'CONFIRMED', 'DISPENSED', 'GRANTED', 'AUTHORIZED'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-250/60';
    }
    if (['PENDING', 'SCHEDULED'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border border-amber-250/60';
    }
    if (['REJECTED', 'REVOKED', 'CANCELLED', 'CRITICAL', 'EXPIRED', 'DENIED'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border border-rose-250/60';
    }
    return 'bg-slate-50 text-slate-700 border border-slate-205';
  };

  // Filter lists by doctor
  const myConsents = consents.filter(c => c.providerId === currentDoctor.id);
  const myGrantedConsents = myConsents.filter(c => c.status === 'GRANTED');
  const myPrescriptions = prescriptions.filter(p => p.doctorName === currentDoctor.name);
  const myAppointments = appointments.filter(a => a.doctorId === currentDoctor.id);
  const confirmedAppointments = myAppointments.filter(a => a.status === 'CONFIRMED');

  // Retrieve unique patient details of currently consented patients
  const consentedPatients = patients.filter(p => 
    myGrantedConsents.some(c => c.patientId === p.id)
  );

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* 1. DOCTOR PROFILE HEADER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-medical-500 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white/20 select-none">
            {currentDoctor.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('').toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentDoctor.name}</h1>
              <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                VERIFIED DOCTOR
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-1 font-medium">
              {currentDoctor.specialty} • {currentDoctor.hospital}
            </p>
            <p className="text-[11px] text-teal-200 font-mono mt-0.5">
              Medical License: {currentDoctor.licenseNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successBanner && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-teal-705 hover:underline">Dismiss</button>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW A: DOCTOR DASHBOARD OVERVIEW (Refined & Professional) */}
      {/* =================================================================== */}
      {(activeTab === 'doctor-dashboard' || !activeTab) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Summary Metrics & Upcoming Calendar */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-soft text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Decrypted Ledger</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{myGrantedConsents.length} Patients</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-soft text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Prescriptions Signed</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{myPrescriptions.length} Issued</span>
              </div>
            </div>

            {/* Upcoming Confirmed Consultations Calendar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-medical-600" />
                  <span>Today's Appointments</span>
                </h3>
                <button 
                  onClick={() => setActiveTab('doctor-appointments')} 
                  className="text-[10px] text-medical-600 font-bold hover:underline flex items-center gap-0.5"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-3">
                {confirmedAppointments.slice(0, 3).length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-4">No consultations scheduled today.</p>
                ) : (
                  confirmedAppointments.slice(0, 3).map(apt => (
                    <div key={apt.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{apt.patientName}</span>
                        <span className="text-[10px] text-medical-600 font-mono">{apt.time}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] font-medium leading-none">Reason: {apt.reason}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Recent Activity Logs & Clinical Guidelines */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Guidelines & Clinical Safety Warnings */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <BookOpen className="w-4.5 h-4.5 text-medical-600" />
                <span>Practitioner Compliance & ABDM Protocols</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 bg-medical-50/20 border border-medical-100 rounded-2xl space-y-2">
                  <h4 className="font-bold text-medical-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-medical-600" />
                    Consent-Driven Data Access
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Always request time-bound digital consent requests before pulling clinical history or lab reports. Patients must approve requests on their health app.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-2xl space-y-2">
                  <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Emergency Bypass Compliance
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Emergency override (critical bypass) is strictly monitored and audited. Use override credentials only when the patient is incapacitated or unconscious.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Action Logs (Simulating EHR audit) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-4.5 h-4.5 text-medical-600 animate-pulse" />
                <span>Your Recent Workspace Activity</span>
              </h3>

              <div className="space-y-3.5 divide-y divide-slate-100">
                {myPrescriptions.length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-4">No recent prescriptions issued from this workspace.</p>
                ) : (
                  myPrescriptions.slice(0, 3).map((rx) => (
                    <div key={rx.id} className="pt-3.5 first:pt-0 text-xs flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Issued Digital Prescription #{rx.id}</span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold px-2 py-0.5 rounded-full">
                            SIGNED
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Patient: <strong>{rx.patientName}</strong> ({rx.patientHealthId}) • Medicines: {rx.medicines.map(m => m.name).join(', ')}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono text-right shrink-0 mt-0.5">{rx.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW B: MY PATIENTS VIEW (WITH MOVED REGISTRY LOOKUP) */}
      {/* =================================================================== */}
      {activeTab === 'doctor-patients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Patients Registry List & Citizen Registry Lookup */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* CITIZEN REGISTRY LOOKUP (Moved from dashboard overview to My Patients) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-medical-600" />
                <span>Search Citizen Registry</span>
              </h3>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Type any Health ID (e.g. `OSH-IND-100234`) to load a profile, check access status, or trigger bypass.
              </p>

              <form onSubmit={handleSearch} className="space-y-3">
                <input 
                  type="text" 
                  value={searchHealthId}
                  onChange={e => setSearchHealthId(e.target.value)}
                  placeholder="Enter Health ID (e.g. OSH-IND-100234)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  Search Registry ID
                </button>
              </form>
            </div>

            {/* List of currently consented Patients */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <UserCheck className="w-4.5 h-4.5 text-medical-600" />
                  <span>Authorized Patients</span>
                </h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Active decryption consents granted to you.</p>
              </div>

              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                {consentedPatients.length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-6">No patient consents active.</p>
                ) : (
                  consentedPatients.map((pat) => {
                    const activeConsent = myGrantedConsents.find(c => c.patientId === pat.id);
                    return (
                      <div 
                        key={pat.id}
                        onClick={() => { setSelectedPatient(pat); setSearchHealthId(pat.healthId); setSuccessBanner(null); }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedPatient?.id === pat.id 
                            ? 'bg-medical-50/50 border-medical-300 shadow-2xs' 
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{pat.name}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-250/60">
                            ACTIVE
                          </span>
                        </div>
                        <code className="text-[10px] text-slate-500 font-mono block mt-1">ID: {pat.healthId}</code>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Selected patient clinical profile EHR timeline */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-6 animate-fadeUp">
                {/* Details header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-medical-600 to-teal-400 text-white flex items-center justify-center text-sm font-black">
                      {selectedPatient.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{selectedPatient.name}</h3>
                      <p className="text-[10px] text-slate-450 font-mono">Health ID: {selectedPatient.healthId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <button 
                        onClick={() => setShowRxModal(true)}
                        className="bg-teal-605 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Write Prescription</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={handleRequestAccess}
                          className="bg-medical-700 hover:bg-medical-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
                        >
                          Request Access
                        </button>
                        <button 
                          onClick={() => setShowEmergencyModal(true)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                        >
                          Emergency Override
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {accessRequestedMsg && (
                  <div className="p-3 bg-amber-50 border border-amber-250 rounded-xl text-xs font-semibold text-amber-900 text-center animate-pulse">
                    ⚠️ {accessRequestedMsg} (Switch to patient view to grant consent!)
                  </div>
                )}

                {/* Patient particulars info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Allergies</span>
                    <span className="font-bold text-rose-700 block mt-0.5">{selectedPatient.allergies.join(', ') || 'None'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Conditions</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{selectedPatient.criticalConditions.join(', ') || 'None'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">DOB</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{selectedPatient.dob}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Blood Group</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{selectedPatient.bloodGroup}</span>
                  </div>
                </div>

                {/* Decrypted clinical timeline */}
                {isUnlocked ? (
                  <div className="space-y-4 pt-2">
                    <h4 className="font-bold text-slate-900 text-sm">Citizen Consultation Ledger</h4>
                    <div className="relative pl-6 border-l border-slate-200 space-y-4">
                      {records.filter(r => r.patientId === selectedPatient.id).map((rec) => (
                        <div key={rec.id} className="relative animate-fadeIn">
                          <div className="absolute -left-[30px] top-0.5 w-4.5 h-4.5 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-500">
                            <FileText className="w-2.5 h-2.5" />
                          </div>
                          <div className="bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs transition-colors">
                            <div className="flex justify-between font-bold text-slate-800">
                              <span>{rec.title}</span>
                              <span className="text-[9px] text-slate-400 font-mono">{rec.date}</span>
                            </div>
                            <p className="text-slate-550 text-[11px] mt-1">{rec.description}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono">Recorded by: {rec.doctorName} ({rec.hospital})</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-150 space-y-3">
                    <Lock className="w-10 h-10 text-slate-350 mx-auto animate-pulse" />
                    <h4 className="font-bold text-slate-750 text-sm">Citizen EHR Files Encrypted</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Access to digital clinical summaries requires patient consent verification. Request consent or trigger emergency bypass to load records.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-soft space-y-3 text-slate-500">
                <Search className="w-10 h-10 text-slate-350 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">Patient EHR Timeline View</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Search a citizen Health ID or select an authorized patient from the left panel registry list to decrypt.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW C: ACCESS REQUESTS LEDGER */}
      {/* =================================================================== */}
      {activeTab === 'doctor-access-requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeUp">
          {/* Left panel: Send Access Request Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 h-fit">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-medical-600" />
                <span>Request Citizen Consent</span>
              </h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Send a secure request for time-bound access decryption.</p>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Patient Health ID *</label>
                <input 
                  type="text" required
                  value={requestHealthId}
                  onChange={e => setRequestHealthId(e.target.value)}
                  placeholder="e.g. OSH-IND-100234"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* Duration Type selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-455 font-bold block uppercase font-mono">Consent Expiry Type *</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setDurationMode('preset')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      durationMode === 'preset'
                        ? 'bg-medical-600 text-white border-medical-500'
                        : 'bg-slate-55 text-slate-600 border-slate-200'
                    }`}
                  >
                    Preset Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('date')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      durationMode === 'date'
                        ? 'bg-medical-600 text-white border-medical-500'
                        : 'bg-slate-55 text-slate-600 border-slate-200'
                    }`}
                  >
                    Till Date (Calendar)
                  </button>
                </div>
              </div>

              {/* Duration parameters inputs */}
              {durationMode === 'preset' ? (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Preset Duration Limit *</label>
                  <select
                    value={presetDuration}
                    onChange={e => setPresetDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-semibold"
                  >
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Authorized Till Date *</label>
                  <input
                    type="date"
                    required
                    value={tillDate}
                    onChange={e => setTillDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2 rounded-xl text-xs shadow-xs"
              >
                Send Request
              </button>
            </form>
          </div>

          {/* Right panel: Access Requests Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 font-semibold">Your Sent Consent Requests</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Patient ID</th>
                    <th className="py-2.5 px-3">Request Date</th>
                    <th className="py-2.5 px-3">Duration Limit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myConsents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No access request logs found.</td>
                    </tr>
                  ) : (
                    myConsents.map((consent) => (
                      <tr key={consent.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{consent.patientId}</td>
                        <td className="py-3 px-3 text-slate-500">{new Date(consent.requestDate).toLocaleDateString()}</td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {consent.duration.startsWith('Till ') ? `Until ${consent.duration.replace('Till ', '')}` : consent.duration}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(consent.status)}`}>
                            {consent.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRESCRIPTION CREATION MODAL */}
      {showRxModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-elevated border border-slate-200 text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-650" />
                <h3 className="font-extrabold text-base text-slate-900">Create Digital Prescription</h3>
              </div>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-slate-655 p-1">✕</button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-mono">
                Patient Ledger: <strong>{selectedPatient.name}</strong> ({selectedPatient.healthId})
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                      <input 
                        type="text" required value={med.name}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].name = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="e.g. Amoxicillin 500mg"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                      <input 
                        type="text" value={med.dosage}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].dosage = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="1 Capsule"
                        className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Frequency (e.g. 1-0-1)</label>
                      <input 
                        type="text" value={med.frequency}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].frequency = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="1-0-1"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button" onClick={addMedicineRow}
                className="text-xs text-teal-705 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Another Medicine
              </button>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Instructions & Notes</label>
                <textarea 
                  value={rxNotes}
                  onChange={e => setRxNotes(e.target.value)}
                  placeholder="e.g. Finish complete course. Follow up in 10 days if symptoms persist."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none h-16"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" onClick={() => setShowRxModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-medical-700 hover:bg-medical-800 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  ISSUE PRESCRIPTION
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* EMERGENCY OVERRIDE MODAL */}
      {showEmergencyModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-rose-250 text-slate-900 space-y-4">
            
            <div className="flex items-center gap-2 text-rose-600 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-extrabold text-base">Emergency Access Override</h3>
            </div>

            <p className="text-xs text-slate-550 leading-relaxed">
              Triggering emergency access bypasses standard patient consent. This event will be logged in the immutable national medical audit trail for legal compliance.
            </p>

            <form onSubmit={handleEmergencyOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Emergency Override *</label>
                <textarea 
                  required value={emergencyReason}
                  onChange={e => setEmergencyReason(e.target.value)}
                  placeholder="e.g. Unconscious patient trauma admission; immediate blood group & allergy check required."
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 h-24"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-705 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
                >
                  CONFIRM OVERRIDE
                </button>
                <button 
                  type="button" onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
