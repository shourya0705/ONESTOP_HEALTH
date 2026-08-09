import React, { useState } from 'react';
import { ShieldAlert, Clock, CheckCircle2, XCircle, Building2, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AccessDuration } from '../types';

export const ConsentModal: React.FC = () => {
  const { consents, currentPatient, grantConsent, denyConsent } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<AccessDuration>('1h');

  // Find pending requests for current patient
  const pendingConsents = consents.filter(c => c.patientId === currentPatient.id && c.status === 'PENDING');

  if (pendingConsents.length === 0) return null;

  const currentRequest = pendingConsents[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-slate-900 relative">
        
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4 mx-auto shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-center font-extrabold text-xl text-slate-900">Medical Record Access Request</h3>
        <p className="text-center text-xs text-slate-500 mt-1">
          A healthcare provider is requesting access to your ONESTOP Health ID records.
        </p>

        <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Requesting Healthcare Provider</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              {currentRequest.providerName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Hospital / Clinic</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {currentRequest.organization}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
            <span className="text-slate-500 font-medium">Requested Scope</span>
            <span className="font-mono text-teal-800 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
              Full Medical History & Prescriptions
            </span>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Select Grant Duration:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['30m', '1h', '24h'] as AccessDuration[]).map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`py-2 px-3 rounded-full border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  selectedDuration === dur
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{dur === '30m' ? '30 Mins' : dur === '1h' ? '1 Hour' : '24 Hours'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => grantConsent(currentRequest.id)}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ALLOW ACCESS</span>
          </button>
          
          <button
            onClick={() => denyConsent(currentRequest.id)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold rounded-full text-xs border border-slate-200 transition-colors flex items-center gap-1"
          >
            <XCircle className="w-4 h-4" />
            <span>DENY</span>
          </button>
        </div>

      </div>
    </div>
  );
};
