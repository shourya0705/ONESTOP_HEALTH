import React, { useState } from 'react';
import { 
  Pill, Search, CheckCircle2, 
  Check, Lock, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';

export const PharmacistDashboard: React.FC = () => {
  const { currentPharmacist, prescriptions, searchPatientByHealthId, dispensePrescription } = useApp();

  const [searchHealthId, setSearchHealthId] = useState('OSH-IND-100234');
  const [searchedPatient, setSearchedPatient] = useState<any | null>(null);
  const [dispenseStatusMsg, setDispenseStatusMsg] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispenseStatusMsg(null);
    const pat = searchPatientByHealthId(searchHealthId);
    setSearchedPatient(pat || null);
  };

  const handleDispense = (prescriptionId: string) => {
    const res = dispensePrescription(prescriptionId);
    setDispenseStatusMsg(res.message);
  };

  // Active prescriptions for searched patient
  const patientPrescriptions = searchedPatient 
    ? prescriptions.filter(p => p.patientId === searchedPatient.id)
    : prescriptions;

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (['VERIFIED', 'ACTIVE', 'APPROVED', 'CONFIRMED', 'DISPENSED', 'GRANTED', 'AUTHORIZED'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-250/60';
    }
    if (['PENDING', 'SCHEDULED'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border border-amber-250/60';
    }
    return 'bg-slate-50 text-slate-700 border border-slate-205';
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* PHARMACIST PROFILE HEADER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/25 border border-teal-300/30 flex items-center justify-center text-teal-200 shadow-md shrink-0">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentPharmacist.pharmacyName}</h1>
              <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                VERIFIED PHARMACY
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-1 font-medium">
              Pharmacist License: {currentPharmacist.licenseNumber} • {currentPharmacist.address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search & Demo IDs */}
        <div className="space-y-6 lg:col-span-1">
          {/* PATIENT PRESCRIPTION LOOKUP */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-medical-650" />
              <span>Dispense Verification</span>
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
                FETCH RX RECORDS
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Demo Search Shortcuts</h3>
            <div className="flex flex-col gap-2 text-xs">
              <button 
                onClick={() => { setSearchHealthId('OSH-IND-100234'); const pat = searchPatientByHealthId('OSH-IND-100234'); setSearchedPatient(pat); }}
                className="text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-100 font-mono text-teal-700 font-bold"
              >
                OSH-IND-100234 (Aarav Sharma)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Prescription entries list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DISPENSE CONFIRMATION MSG */}
          {dispenseStatusMsg && (
            <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>{dispenseStatusMsg}</span>
              </div>
              <button onClick={() => setDispenseStatusMsg(null)} className="text-teal-705 hover:underline">Dismiss</button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Valid Digital Prescriptions Ledger</h3>

            {patientPrescriptions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500 text-xs">
                No pending or active prescriptions found for this patient.
              </div>
            ) : (
              patientPrescriptions.map(rx => (
                <div key={rx.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 animate-fadeUp">
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        Rx ID: #{rx.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2">Patient: {rx.patientName} <code className="text-xs text-slate-550">({rx.patientHealthId})</code></h4>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-semibold text-slate-650 block">Prescribed by {rx.doctorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rx.date}</span>
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-650 mb-2">Prescribed Medication Items:</h5>
                    {rx.medicines.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 font-medium">
                        <span className="font-bold text-slate-900">{m.name} <span className="text-slate-450 font-normal">({m.dosage})</span></span>
                        <span className="text-teal-800 font-mono text-[11px]">{m.frequency} • {m.duration} • [{m.timing}]</span>
                      </div>
                    ))}
                  </div>

                  {/* Dispense Action Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    {rx.dispensed ? (
                      <span className="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200 shadow-2xs">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Dispensed by {rx.dispensedBy} ({rx.dispensedAt?.slice(0, 10)})</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleDispense(rx.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <Pill className="w-4 h-4 text-teal-200" />
                        <span>DISPENSE MEDICATION & RECORD UPDATE</span>
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
