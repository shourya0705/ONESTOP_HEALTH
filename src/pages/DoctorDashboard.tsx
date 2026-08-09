import React, { useState } from 'react';
import { 
  Search, ShieldCheck, AlertTriangle, Pill, 
  CheckCircle2, Plus, Lock, HeartPulse, Building2, Eye, Calendar, FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';
import type { MedicineItem } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentDoctor, searchPatientByHealthId, hasAuthorizedAccess, 
    requestDoctorAccess, emergencyAccessOverride, createPrescription, records, prescriptions, consents
  } = useApp();

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

  // Search Patient
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

      {/* 2. DOCTOR WORKSPACE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search & Quick stats */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* PATIENT LOOKUP BAR */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-medical-650" />
              <span>Citizen Registry Lookup</span>
            </h3>

            <form onSubmit={handleSearch} className="space-y-3">
              <input 
                type="text" 
                value={searchHealthId}
                onChange={e => setSearchHealthId(e.target.value)}
                placeholder="Enter Patient Health ID (e.g. OSH-IND-100234)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100 transition-all"
              />
              <button 
                type="submit"
                className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
              >
                SEARCH CITIZEN RECORD
              </button>
            </form>
          </div>

          {/* Quick Demo Tips */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Bypass Verification IDs</h3>
            <div className="flex flex-col gap-2 text-xs">
              <button 
                onClick={() => { setSearchHealthId('OSH-IND-100234'); const pat = searchPatientByHealthId('OSH-IND-100234'); setSelectedPatient(pat); }}
                className="text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-100 font-mono text-teal-700 font-bold"
              >
                OSH-IND-100234 (Aarav Sharma)
              </button>
              <button 
                onClick={() => { setSearchHealthId('OSH-IND-200567'); const pat = searchPatientByHealthId('OSH-IND-200567'); setSelectedPatient(pat); }}
                className="text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-100 font-mono text-teal-700 font-bold"
              >
                OSH-IND-200567 (Sunita Patel)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Search Result Display */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SUCCESS BANNER */}
          {successBanner && (
            <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>{successBanner}</span>
              </div>
              <button onClick={() => setSuccessBanner(null)} className="text-teal-705 hover:underline">Dismiss</button>
            </div>
          )}

          {selectedPatient ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-6 animate-fadeUp">
              
              {/* Patient header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-medical-600 to-teal-400 text-white flex items-center justify-center text-base font-black">
                    {selectedPatient.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Health ID: <span className="text-medical-600 font-semibold">{selectedPatient.healthId}</span> | DOB: {selectedPatient.dob}
                    </p>
                  </div>
                </div>

                {/* Lock Status / Action */}
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Access Authorized
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={handleRequestAccess}
                        className="bg-medical-700 hover:bg-medical-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
                      >
                        Request Access
                      </button>
                      <button 
                        onClick={() => setShowEmergencyModal(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
                      >
                        Emergency Bypass
                      </button>
                    </>
                  )}
                </div>
              </div>

              {accessRequestedMsg && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 text-center animate-pulse">
                  ⚠️ {accessRequestedMsg} (Switch to GUEST/PATIENT in the switcher bar to grant consent!)
                </div>
              )}

              {/* Warnings and profile details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-900">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider block font-mono">ALLERGY CONTRAINDICATIONS</h4>
                    <p className="text-xs font-bold mt-1 text-rose-700">
                      {selectedPatient.allergies.join(', ') || 'None Reported'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 text-slate-800">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider block font-mono">CHRONIC CONDITIONS</h4>
                    <p className="text-xs font-bold mt-1 text-slate-700">
                      {selectedPatient.criticalConditions.join(', ') || 'None Reported'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unlocked Medical Content */}
              {isUnlocked ? (
                <div className="space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">
                  
                  {/* Actions Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900">Patient Medical History Timeline</h4>
                    <button 
                      onClick={() => setShowRxModal(true)}
                      className="bg-teal-600 hover:bg-teal-705 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Issue Digital Prescription</span>
                    </button>
                  </div>

                  {/* History List */}
                  <div className="relative pl-6 border-l border-slate-200 space-y-4">
                    {records.filter(r => r.patientId === selectedPatient.id).map(rec => (
                      <div key={rec.id} className="relative">
                        <div className="absolute -left-[30px] top-0.5 w-4.5 h-4.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                          <FileText className="w-2.5 h-2.5" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{rec.title}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{rec.date}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1">{rec.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">Recorded by: {rec.doctorName} ({rec.hospital})</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <Lock className="w-8 h-8 text-slate-350 mx-auto" />
                  <h4 className="font-bold text-slate-700 text-sm">Medical Records Encrypted</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Full consultation history, prescriptions and laboratory parameters are locked. Request time-bound patient consent to decrypt.
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl shadow-soft space-y-3 text-slate-500">
              <Search className="w-10 h-10 text-slate-350 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No Patient Loaded</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Search a patient Health ID using the sidebar lookup panel to load clinical files.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* PRESCRIPTION CREATION MODAL */}
      {showRxModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-elevated border border-slate-200 text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-650" />
                <h3 className="font-extrabold text-base text-slate-900">Create Digital Prescription</h3>
              </div>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-slate-650 p-1">✕</button>
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
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
                className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
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
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
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
