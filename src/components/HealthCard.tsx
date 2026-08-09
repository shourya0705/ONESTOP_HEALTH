import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, QrCode, Printer, 
  Share2, Plus, Copy, Check, Info, Lock
} from 'lucide-react';
import type { Patient } from '../types';
import { VerificationBadge } from './VerificationBadge';

interface Props {
  patient: Patient;
  onVerifyClick?: () => void;
}

export const HealthCard: React.FC<Props> = ({ patient, onVerifyClick }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient.healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Digital Health Card Container - Styled exactly as reference photo */}
      <div className="printable-card relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-teal-900/30 text-white bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] border border-teal-400/30 max-w-lg mx-auto p-6">
        
        {/* Decorative Wave/Circular Overlay Pattern */}
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full border border-teal-300/10 bg-teal-400/5 blur-xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full border border-teal-200/10 bg-emerald-400/5 blur-xl pointer-events-none"></div>
        
        {/* Card Header */}
        <div className="pb-4 flex items-center justify-between border-b border-teal-400/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white text-[#024959] flex items-center justify-center font-black shadow-sm">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="font-extrabold text-base tracking-wider text-white">
              ONESTOP <span className="text-teal-200">HEALTH</span>
            </h3>
          </div>

          <VerificationBadge status={patient.isVerified} />
        </div>

        {/* Card Main Content Area */}
        <div className="py-5 grid grid-cols-12 gap-4 items-center">
          {/* Avatar */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="relative group">
              <img 
                src={patient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
                alt={patient.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-200/60 shadow-lg"
              />
            </div>
          </div>

          {/* Patient Details */}
          <div className="col-span-8 space-y-1.5">
            <div>
              <p className="text-[10px] text-teal-200 uppercase font-mono tracking-wider">Citizen Name</p>
              <h4 className="font-bold text-xl text-white tracking-wide">{patient.name}</h4>
              <p className="text-xs text-teal-200 font-mono">HEALTH ID: <span className="font-bold text-white">{patient.healthId}</span></p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 text-xs border-t border-teal-400/20">
              <div>
                <span className="text-[9px] text-teal-200 uppercase block font-mono">Date of Birth</span>
                <span className="font-semibold text-white">{patient.dob}</span>
              </div>
              <div>
                <span className="text-[9px] text-teal-200 uppercase block font-mono">Blood Group</span>
                <span className="font-bold text-teal-100">{patient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[9px] text-teal-200 uppercase block font-mono">Aadhaar</span>
                <span className="font-mono text-white text-[11px]">{patient.maskedAadhaar}</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowQRModal(true)}>
                <QrCode className="w-3.5 h-3.5 text-teal-200" />
                <span className="text-[10px] text-teal-100 font-mono underline">QR TOKEN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Security Footnote matching photo */}
        <div className="pt-3 border-t border-teal-400/20 flex items-center justify-between text-[11px] text-teal-100">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-teal-200" />
            <span>Consent Protected</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-teal-200">
            <span>Secured by ABDM Protocol</span>
          </div>
        </div>

        {/* Quick Action Bar for Interactive UI */}
        <div className="mt-4 pt-3 border-t border-teal-400/10 flex items-center justify-between text-xs">
          <button 
            onClick={onVerifyClick || (() => setShowQRModal(true))}
            className="bg-white hover:bg-teal-50 text-[#024959] font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Verify Card</span>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyId}
              className="p-1.5 bg-teal-800/40 hover:bg-teal-700/60 rounded-full text-teal-100 border border-teal-400/30 transition-colors"
              title="Copy Health ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={() => setShowQRModal(true)}
              className="p-1.5 bg-teal-800/40 hover:bg-teal-700/60 rounded-full text-teal-100 border border-teal-400/30 transition-colors"
              title="Show QR Code"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handlePrint}
              className="p-1.5 bg-teal-800/40 hover:bg-teal-700/60 rounded-full text-teal-100 border border-teal-400/30 transition-colors"
              title="Print Health Card"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* QR Code Inspection Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-slate-900 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-900">Digital Health ID QR</h3>
              </div>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-6 flex flex-col items-center justify-center p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
              <div className="p-3 bg-white rounded-xl shadow-md border border-slate-100">
                <QRCodeSVG 
                  value={`https://onestophealth.gov.in/verify?id=${patient.healthId}&token=OSH-${Date.now()}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mt-3 font-mono text-sm font-bold text-teal-800">{patient.healthId}</p>
              <p className="text-xs text-slate-600 mt-1 font-medium">{patient.name}</p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong>Privacy Notice:</strong> This QR code encodes a tokenized Health ID. Full medical records require active patient consent authorization.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setShowQRModal(false);
                  if (onVerifyClick) onVerifyClick();
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify ID Token
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
