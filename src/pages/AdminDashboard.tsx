import React from 'react';
import { 
  Shield, Users, Stethoscope, Pill, Activity, FileText, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';

export const AdminDashboard: React.FC = () => {
  const { 
    patients, doctors, pharmacists, records, 
    verifyDoctorStatus, verifyPharmacistStatus 
  } = useApp();

  const pendingDoctors = doctors.filter(d => d.verificationStatus === 'PENDING');
  const pendingPharmacists = pharmacists.filter(p => p.verificationStatus === 'PENDING');

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
      
      {/* 1. ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-elevated flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/25 border border-teal-300/30 flex items-center justify-center text-teal-250 shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">National Healthcare Verification Queue</h1>
            <p className="text-xs text-teal-100 mt-1 font-mono">
              System Administrator Portal • Ministry of Digital Health Governance
            </p>
          </div>
        </div>
      </div>

      {/* 2. METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Registered Citizens</span>
            <Users className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length + 25000}</p>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">Aadhaar Tokenized</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Verified Doctors</span>
            <Stethoscope className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{doctors.filter(d => d.verificationStatus === 'VERIFIED').length + 3500}</p>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 block w-fit">{pendingDoctors.length} Pending Approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Verified Pharmacies</span>
            <Pill className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{pharmacists.filter(p => p.verificationStatus === 'VERIFIED').length + 1200}</p>
          <span className="text-[10px] text-teal-705 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">Licensed Chemists</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase font-mono">Records Linked</span>
            <Activity className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{records.length + 98000}</p>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">Immutable Ledger</span>
        </div>

      </div>

      {/* 3. DOCTOR & PHARMACIST APPROVAL QUEUE */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-900 text-sm">Healthcare Professional Applications Queue</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Doctor Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-medical-650" />
                <span>Doctor Verification Requests</span>
              </h4>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-250/60">
                {pendingDoctors.length} Pending
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {doctors.length === 0 ? (
                <p className="text-slate-400 italic">No doctor registrations found.</p>
              ) : (
                doctors.map(doc => (
                  <div key={doc.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-sm">{doc.name}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(doc.verificationStatus)}`}>
                          {doc.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{doc.specialty} • {doc.hospital}</p>
                      <p className="text-[10px] text-slate-400 font-mono">License: {doc.licenseNumber}</p>
                      
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        {doc.degree && (
                          <span className="bg-teal-50 text-teal-850 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                            🎓 {doc.degree}
                          </span>
                        )}
                        {doc.certification && (
                          <span className="bg-white text-slate-600 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border border-slate-300">
                            📄 {doc.certification}
                          </span>
                        )}
                      </div>
                    </div>

                    {doc.verificationStatus === 'PENDING' && (
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button 
                          onClick={() => verifyDoctorStatus(doc.id, 'VERIFIED')}
                          className="bg-teal-650 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] transition-colors shadow-2xs active:scale-95"
                        >
                          APPROVE
                        </button>
                        <button 
                          onClick={() => verifyDoctorStatus(doc.id, 'REJECTED')}
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold px-3.5 py-1.5 rounded-xl text-[10px] border border-rose-200 active:scale-95"
                        >
                          REJECT
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pharmacist Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-5 h-5 text-medical-650" />
                <span>Pharmacy Licensing Requests</span>
              </h4>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-250/60">
                {pendingPharmacists.length} Pending
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {pharmacists.length === 0 ? (
                <p className="text-slate-400 italic">No pharmacy registrations found.</p>
              ) : (
                pharmacists.map(pharm => (
                  <div key={pharm.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-slate-900 text-sm">{pharm.pharmacyName}</h5>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(pharm.verificationStatus)}`}>
                          {pharm.verificationStatus}
                        </span>
                      </div>
                      <p className="text-slate-650 font-medium">{pharm.address}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Drug License: {pharm.licenseNumber}</p>
                      
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        {pharm.degree && (
                          <span className="bg-teal-50 text-teal-850 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                            💊 {pharm.degree}
                          </span>
                        )}
                        {pharm.certification && (
                          <span className="bg-white text-slate-650 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border border-slate-300">
                            📄 {pharm.certification}
                          </span>
                        )}
                      </div>
                    </div>

                    {pharm.verificationStatus === 'PENDING' && (
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button 
                          onClick={() => verifyPharmacistStatus(pharm.id, 'VERIFIED')}
                          className="bg-teal-655 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] transition-colors shadow-2xs active:scale-95"
                        >
                          APPROVE
                        </button>
                        <button 
                          onClick={() => verifyPharmacistStatus(pharm.id, 'REJECTED')}
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold px-3.5 py-1.5 rounded-xl text-[10px] border border-rose-200 active:scale-95"
                        >
                          REJECT
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
