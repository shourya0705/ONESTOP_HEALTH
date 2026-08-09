import React, { useState } from 'react';
import { 
  Search, ShieldCheck, AlertTriangle, Pill, 
  CheckCircle2, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';
import type { MedicineItem } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentDoctor, searchPatientByHealthId, hasAuthorizedAccess, 
    requestDoctorAccess, emergencyAccessOverride, createPrescription
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      
      {/* DOCTOR PROFILE HEADER */}
      <div className="bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] rounded-3xl p-6 sm:p-8 text-white border border-teal-400/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentDoctor.avatarUrl} 
            alt={currentDoctor.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentDoctor.name}</h1>
              <VerificationBadge status={currentDoctor.verificationStatus} />
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

      {/* PATIENT HEALTH ID LOOKUP BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4 max-w-2xl">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" />
          <span>Patient Health ID Lookup</span>
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={searchHealthId}
            onChange={e => setSearchHealthId(e.target.value)}
            placeholder="Enter Patient Health ID (e.g. OSH-IND-100234)"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
          />
          <button 
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md active:scale-95"
          >
            SEARCH PATIENT
          </button>
        </form>
      </div>

      {/* SUCCESS BANNER */}
      {successBanner && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-teal-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* PATIENT AUTHORIZED MEDICAL RECORD VIEW */}
      {selectedPatient && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-8 animate-fadeIn">
          
          {/* Patient Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={selectedPatient.photo} 
                alt={selectedPatient.name} 
                className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <h3 className="font-extrabold text-2xl text-slate-900">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Health ID: <strong className="text-teal-700">{selectedPatient.healthId}</strong> | Gender: {selectedPatient.gender} | DOB: {selectedPatient.dob}
                </p>
              </div>
            </div>

            {/* Access Status & Trigger */}
            <div className="flex items-center gap-3">
              {isUnlocked ? (
                <span className="bg-teal-50 text-teal-800 font-bold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-teal-200">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>RECORD ACCESS AUTHORIZED</span>
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRequestAccess}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-full text-xs transition-all shadow-md"
                  >
                    REQUEST ACCESS
                  </button>
                  <button 
                    onClick={() => setShowEmergencyModal(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-full text-xs transition-all shadow-md"
                  >
                    EMERGENCY OVERRIDE
                  </button>
                </div>
              )}
            </div>
          </div>

          {accessRequestedMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 text-center">
              {accessRequestedMsg} (Switch to Patient Role in top bar to grant consent!)
            </div>
          )}

          {/* CRITICAL WARNING BANNERS (ALLERGIES & CONDITIONS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider">CRITICAL ALLERGY CONTRAINDICATIONS</h4>
                <p className="text-xs font-bold mt-1 text-rose-700">
                  {selectedPatient.allergies.join(', ') || 'None Reported'}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider">CHRONIC CONDITIONS</h4>
                <p className="text-xs font-semibold mt-1">
                  {selectedPatient.criticalConditions.join(', ') || 'None Reported'}
                </p>
              </div>
            </div>

          </div>

          {/* CLINICAL WORKFLOW ACTIONS */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <h4 className="font-extrabold text-lg text-slate-900">Consultation & Prescriptions</h4>
            
            <button 
              onClick={() => setShowRxModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Pill className="w-4 h-4" />
              <span>CREATE DIGITAL PRESCRIPTION</span>
            </button>
          </div>

        </div>
      )}

      {/* PRESCRIPTION CREATION MODAL */}
      {showRxModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-teal-600" />
                <h3 className="font-extrabold text-xl text-slate-900">Create Digital Prescription</h3>
              </div>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
                Patient: <strong>{selectedPatient.name}</strong> ({selectedPatient.healthId})
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                      <input 
                        type="text"
                        required
                        value={med.name}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].name = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="e.g. Amoxicillin 500mg"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                      <input 
                        type="text"
                        value={med.dosage}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].dosage = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="1 Capsule"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Frequency (e.g. 1-0-1)</label>
                      <input 
                        type="text"
                        value={med.frequency}
                        onChange={e => {
                          const updated = [...medicines];
                          updated[idx].frequency = e.target.value;
                          setMedicines(updated);
                        }}
                        placeholder="1-0-1"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={addMedicineRow}
                className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Another Medicine
              </button>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Instructions & Notes</label>
                <textarea 
                  value={rxNotes}
                  onChange={e => setRxNotes(e.target.value)}
                  placeholder="e.g. Follow up in 10 days if symptoms persist. Stay hydrated."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 h-16"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowRxModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 font-semibold rounded-full text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-xs shadow-md"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 text-slate-900 space-y-4">
            
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-extrabold text-xl">Emergency Access Override</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Triggering emergency access bypasses standard patient consent. This event will be logged in the immutable national medical audit trail for legal compliance.
            </p>

            <form onSubmit={handleEmergencyOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Emergency Override *</label>
                <textarea 
                  required
                  value={emergencyReason}
                  onChange={e => setEmergencyReason(e.target.value)}
                  placeholder="e.g. Unconscious patient trauma admission; immediate blood group & allergy check required."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 h-24"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-full text-xs shadow-md"
                >
                  CONFIRM EMERGENCY ACCESS
                </button>
                <button 
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-full text-xs"
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
