import React from 'react';
import { 
  Shield, Users, Stethoscope, Pill, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';

export const AdminDashboard: React.FC = () => {
  const { 
    patients, doctors, pharmacists, records, 
    verifyDoctorStatus, verifyPharmacistStatus 
  } = useApp();

  const pendingDoctors = doctors.filter(d => d.verificationStatus === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      
      {/* ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] rounded-3xl p-6 sm:p-8 text-white border border-teal-400/20 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-300/20 border border-teal-300/40 flex items-center justify-center text-teal-100 shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">National Healthcare Verification Queue</h1>
            <p className="text-xs text-teal-100 mt-1 font-mono">
              System Administrator Portal • Ministry of Digital Health Governance
            </p>
          </div>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase font-mono">Registered Citizens</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length + 25000}</p>
          <span className="text-[11px] text-teal-700 font-semibold">100% Aadhaar Reference Tokenized</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase font-mono">Verified Doctors</span>
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{doctors.filter(d => d.verificationStatus === 'VERIFIED').length + 3500}</p>
          <span className="text-[11px] text-teal-700 font-semibold">{pendingDoctors.length} Pending Approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase font-mono">Verified Pharmacies</span>
            <Pill className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{pharmacists.filter(p => p.verificationStatus === 'VERIFIED').length + 1200}</p>
          <span className="text-[11px] text-teal-700 font-semibold">Licensed Dispensaries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase font-mono">Records Linked</span>
            <Activity className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{records.length + 98000}</p>
          <span className="text-[11px] text-teal-700 font-semibold">Immutable Medical Ledger</span>
        </div>

      </div>

      {/* DOCTOR & PHARMACIST APPROVAL QUEUE */}
      <div className="space-y-6">
        <h3 className="font-extrabold text-xl text-slate-900">Healthcare Professional Applications</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Doctor Applications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <span>Doctor Verifications</span>
              </h4>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {pendingDoctors.length} Pending
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {doctors.map(doc => (
                <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900">{doc.name}</h5>
                      <VerificationBadge status={doc.verificationStatus} />
                    </div>
                    <p className="text-slate-600 font-medium">{doc.specialty} • {doc.hospital}</p>
                    <p className="text-[10px] text-slate-500 font-mono">License: {doc.licenseNumber}</p>
                    
                    {/* Degree & Certification Display */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      {doc.degree && (
                        <span className="bg-teal-50 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                          🎓 {doc.degree}
                        </span>
                      )}
                      {doc.certification && (
                        <span className="bg-white text-slate-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-2xs">
                          📄 {doc.certification}
                        </span>
                      )}
                    </div>
                  </div>

                  {doc.verificationStatus === 'PENDING' && (
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => verifyDoctorStatus(doc.id, 'VERIFIED')}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-full text-xs transition-colors shadow-xs"
                      >
                        APPROVE
                      </button>
                      <button 
                        onClick={() => verifyDoctorStatus(doc.id, 'REJECTED')}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-200 font-semibold px-3.5 py-1.5 rounded-full text-xs"
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pharmacist Applications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <span>Pharmacy License Verifications</span>
              </h4>
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                {pharmacists.length} Registered
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {pharmacists.map(pharm => (
                <div key={pharm.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900">{pharm.pharmacyName}</h5>
                      <VerificationBadge status={pharm.verificationStatus} />
                    </div>
                    <p className="text-slate-600 font-medium">{pharm.address}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Drug License: {pharm.licenseNumber}</p>
                    
                    {/* Degree & Certification Display */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      {pharm.degree && (
                        <span className="bg-teal-50 text-teal-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                          💊 {pharm.degree}
                        </span>
                      )}
                      {pharm.certification && (
                        <span className="bg-white text-slate-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-2xs">
                          📄 {pharm.certification}
                        </span>
                      )}
                    </div>
                  </div>

                  {pharm.verificationStatus === 'PENDING' && (
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button 
                        onClick={() => verifyPharmacistStatus(pharm.id, 'VERIFIED')}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-full text-xs transition-colors shadow-xs"
                      >
                        APPROVE
                      </button>
                      <button 
                        onClick={() => verifyPharmacistStatus(pharm.id, 'REJECTED')}
                        className="bg-rose-100 text-rose-700 hover:bg-rose-200 font-semibold px-3.5 py-1.5 rounded-full text-xs"
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
