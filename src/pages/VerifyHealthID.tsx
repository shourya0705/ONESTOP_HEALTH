import React, { useState } from 'react';
import { 
  ShieldCheck, QrCode, Search, CheckCircle2, XCircle, 
  Lock, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationBadge } from '../components/VerificationBadge';
import confetti from 'canvas-confetti';

export const VerifyHealthID: React.FC = () => {
  const { searchPatientByHealthId, requestDoctorAccess, currentRole } = useApp();

  const [inputVal, setInputVal] = useState('OSH-IND-100234');
  const [isScanning, setIsScanning] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [requestSentMsg, setRequestSentMsg] = useState<string | null>(null);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setScanError(null);
    setRequestSentMsg(null);
    setIsScanning(true);
    setVerifiedResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const found = searchPatientByHealthId(inputVal);

      if (found) {
        setVerifiedResult(found);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        setScanError(`Invalid Health ID or token '${inputVal}'. No matching citizen record found.`);
      }
    }, 1000);
  };

  const handleRequestRecordAccess = () => {
    if (!verifiedResult) return;
    const res = requestDoctorAccess(verifiedResult.healthId, '1h');
    setRequestSentMsg(res.message);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans space-y-8 animate-fadeUp">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center mx-auto shadow-soft">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">National Health ID Token Verifier</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Scan or enter a citizen's Health ID to verify identity authenticity and status.
        </p>
      </div>

      {/* Verification Scanner Form */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft max-w-xl mx-auto space-y-6">
        
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700">Enter Universal Health ID or Aadhaar Reference Token:</label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="e.g. OSH-IND-100234"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100 transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={isScanning}
              className="bg-medical-700 hover:bg-medical-800 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-xs flex items-center gap-2 active:scale-[0.98]"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-teal-200" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-teal-200" />
                  <span>VERIFY</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Demo Pre-fills */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Demo Test IDs:</span>
          <button 
            type="button"
            onClick={() => { setInputVal('OSH-IND-100234'); handleVerify(); }}
            className="text-teal-700 hover:underline font-mono bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200"
          >
            OSH-IND-100234 (Aarav)
          </button>
          <button 
            type="button"
            onClick={() => { setInputVal('OSH-IND-200567'); handleVerify(); }}
            className="text-teal-700 hover:underline font-mono bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200"
          >
            OSH-IND-200567 (Sunita)
          </button>
        </div>

      </div>

      {/* SCANNING ANIMATION INDICATOR */}
      {isScanning && (
        <div className="bg-medical-950 text-teal-100 p-8 rounded-3xl border border-medical-900 text-center space-y-3 animate-pulse shadow-elevated max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-transparent animate-spin mx-auto"></div>
          <h3 className="font-bold text-lg text-white">Verifying Health ID Ledger...</h3>
          <p className="text-xs text-teal-200 font-mono">Querying National Cryptographic Directory</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {scanError && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-2 text-rose-900 max-w-xl mx-auto shadow-soft">
          <XCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="font-bold text-lg">Verification Failed</h3>
          <p className="text-xs">{scanError}</p>
        </div>
      )}

      {/* VERIFIED RESULT CARD */}
      {verifiedResult && !isScanning && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 max-w-xl mx-auto space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-650 border border-teal-100 flex items-center justify-center shadow-soft">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Identity Verified</h3>
                <p className="text-xs text-slate-500 font-mono">Authentic Citizen Token</p>
              </div>
            </div>
            <VerificationBadge status={verifiedResult.isVerified} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/85">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Citizen Name</span>
              <span className="font-bold text-base text-slate-900">{verifiedResult.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Universal Health ID</span>
              <span className="font-mono font-bold text-medical-600">{verifiedResult.healthId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Blood Group</span>
              <span className="font-extrabold text-teal-800">{verifiedResult.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Identity Reference</span>
              <span className="font-mono text-slate-800">{verifiedResult.maskedAadhaar}</span>
            </div>
          </div>

          {/* Privacy Protection Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Medical Record Privacy Enforced</h4>
              <p className="mt-0.5 leading-relaxed text-[11px] text-amber-800">
                Scanning the Health ID token verifies citizen identity only. Full medical timeline access requires explicit patient consent approval.
              </p>
            </div>
          </div>

          {/* Healthcare Professional Action Button */}
          {currentRole === 'DOCTOR' && (
            <div className="pt-2 border-t border-slate-100 space-y-3">
              {requestSentMsg ? (
                <div className="p-3 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold text-center">
                  {requestSentMsg}
                </div>
              ) : (
                <button
                  onClick={handleRequestRecordAccess}
                  className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-200" />
                  <span>REQUEST AUTHORIZED RECORD ACCESS (1 HOUR)</span>
                </button>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
