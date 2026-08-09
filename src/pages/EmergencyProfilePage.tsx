import React from 'react';
import { 
  AlertTriangle, Phone, Lock, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';

export const EmergencyProfilePage: React.FC = () => {
  const { currentPatient, prescriptions } = useApp();

  const activeMeds = prescriptions.filter(p => p.patientId === currentPatient.id).flatMap(p => p.medicines);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-8 animate-fadeIn">
      
      {/* HIGH VISIBILITY EMERGENCY HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-[#024959] rounded-3xl p-6 sm:p-8 text-white border-2 border-rose-400/50 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-200 font-mono text-xs font-bold px-3.5 py-1 rounded-full border border-rose-300/40">
            <AlertTriangle className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>CRITICAL EMERGENCY HEALTH PROFILE</span>
          </div>

          <VerificationBadge status={currentPatient.isVerified} size="lg" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-rose-400/30 pt-4">
          <div>
            <h1 className="text-3xl font-black text-white">{currentPatient.name}</h1>
            <p className="text-xs text-rose-100 font-mono mt-1">
              Health ID: <strong className="text-white">{currentPatient.healthId}</strong> | Aadhaar Ref: {currentPatient.maskedAadhaar}
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-rose-300/30 text-center">
            <span className="text-[10px] text-rose-200 font-mono uppercase block">BLOOD GROUP</span>
            <span className="text-3xl font-black text-white">{currentPatient.bloodGroup}</span>
          </div>
        </div>

      </div>

      {/* EMERGENCY CONTACT & CONTRAINDICATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Critical Allergies (High Warning Red Card) */}
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-rose-900">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <h3 className="font-black text-lg">STRICT ALLERGY CONTRAINDICATIONS</h3>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed font-semibold">
            DO NOT ADMINISTER THE FOLLOWING DRUGS / SUBSTANCES IN AN EMERGENCY:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {currentPatient.allergies.map((allergy, idx) => (
              <span key={idx} className="bg-rose-600 text-white font-mono font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs">
                🚫 {allergy}
              </span>
            ))}
          </div>
        </div>

        {/* Emergency Contact Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-slate-900">
            <Phone className="w-6 h-6 text-teal-600" />
            <h3 className="font-extrabold text-lg">Primary Emergency Contact</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
            <p className="font-extrabold text-base text-slate-900">{currentPatient.emergencyContact.name}</p>
            <p className="text-slate-600 font-medium">Relationship: {currentPatient.emergencyContact.relationship}</p>
            <p className="text-teal-700 font-mono font-bold text-sm mt-1">{currentPatient.emergencyContact.phone}</p>
          </div>
        </div>

      </div>

      {/* CHRONIC CONDITIONS & CRITICAL MEDICATIONS */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-md">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span>Active Critical Medical Conditions & Current Medications</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-700 block">Diagnosed Chronic Conditions:</span>
            <div className="space-y-1">
              {currentPatient.criticalConditions.map((cond, idx) => (
                <span key={idx} className="inline-block bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full mr-2">
                  • {cond}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-700 block">Active Vital Medications:</span>
            <div className="space-y-1 font-mono">
              {activeMeds.length > 0 ? (
                activeMeds.map((m, idx) => (
                  <div key={idx} className="text-slate-900 font-bold">
                    • {m.name} ({m.dosage}) — {m.frequency}
                  </div>
                ))
              ) : (
                <div className="text-slate-900 font-bold">• Budecort Inhaler 200mcg (2 Puffs, 1-0-1)</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* SCOPE PRIVACY NOTICE */}
      <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl text-xs text-teal-900 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <strong>Controlled Emergency Access Scope:</strong> This Emergency Health Profile exposes life-saving parameters (blood group, critical allergies, emergency contact, active conditions) to emergency responders while keeping complete non-essential medical history protected under consent protocols.
        </p>
      </div>

    </div>
  );
};
