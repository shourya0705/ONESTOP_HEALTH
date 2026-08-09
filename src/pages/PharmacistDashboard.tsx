import React, { useState } from 'react';
import { 
  Pill, Search, CheckCircle2, 
  Check
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      
      {/* PHARMACIST PROFILE HEADER */}
      <div className="bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] rounded-3xl p-6 sm:p-8 text-white border border-teal-400/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-300/20 border border-teal-300/40 flex items-center justify-center text-teal-100 shadow-md">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentPharmacist.pharmacyName}</h1>
              <VerificationBadge status={currentPharmacist.verificationStatus} />
            </div>
            <p className="text-xs text-teal-100 mt-1 font-medium">
              Pharmacist License: {currentPharmacist.licenseNumber} • {currentPharmacist.address}
            </p>
          </div>
        </div>
      </div>

      {/* PATIENT PRESCRIPTION LOOKUP */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4 max-w-2xl">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" />
          <span>Pharmacy Patient Prescription Lookup</span>
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
            FETCH RX
          </button>
        </form>
      </div>

      {/* DISPENSE CONFIRMATION MSG */}
      {dispenseStatusMsg && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>{dispenseStatusMsg}</span>
          </div>
          <button onClick={() => setDispenseStatusMsg(null)} className="text-teal-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* PRESCRIPTIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-xl text-slate-900">Valid Digital Prescriptions</h3>

        {patientPrescriptions.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 text-center text-slate-500 text-xs">
            No pending or active prescriptions found for this patient.
          </div>
        ) : (
          patientPrescriptions.map(rx => (
            <div key={rx.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    Prescription #{rx.id}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-1.5">Patient: {rx.patientName} ({rx.patientHealthId})</h4>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 block">Prescribed by {rx.doctorName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{rx.date}</span>
                </div>
              </div>

              {/* Medicines List */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <h5 className="font-bold text-slate-700 mb-2">Prescribed Medication Items:</h5>
                {rx.medicines.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 font-medium">
                    <span className="font-bold text-slate-900">{m.name} ({m.dosage})</span>
                    <span className="text-teal-800 font-mono">{m.frequency} • {m.duration} • [{m.timing}]</span>
                  </div>
                ))}
              </div>

              {/* Dispense Action Bar */}
              <div className="pt-2 flex items-center justify-between">
                {rx.dispensed ? (
                  <span className="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-slate-200">
                    <Check className="w-4 h-4 text-teal-600" />
                    <span>Dispensed by {rx.dispensedBy} ({rx.dispensedAt?.slice(0, 10)})</span>
                  </span>
                ) : (
                  <button 
                    onClick={() => handleDispense(rx.id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <Pill className="w-4 h-4" />
                    <span>DISPENSE MEDICINE & UPDATE TIMELINE</span>
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
