import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, Printer, Copy, Check, Lock, Share2, RefreshCw
} from 'lucide-react';
import type { Patient } from '../types';

interface Props {
  patient: Patient;
  onVerifyClick?: () => void;
}

export const HealthCard: React.FC<Props> = ({ patient }) => {
  const [copied, setCopied] = useState(false);
  const [qrToken, setQrToken] = useState(`OSH-IND-TOKEN-${Date.now().toString().slice(-6)}`);
  const [cardTilted, setCardTilted] = useState(false);

  useEffect(() => {
    // Soft tilt-on-load micro-animation trigger
    const timer = setTimeout(() => {
      setCardTilted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(patient.healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRotateQR = () => {
    setQrToken(`OSH-IND-TOKEN-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* 3D TILT GRADIENT CARD */}
      <div 
        className={`printable-card relative overflow-hidden rounded-3xl shadow-elevated border border-white/10 text-white bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 p-6 transition-all duration-700 ease-out ${
          cardTilted 
            ? 'shadow-teal-950/20 [transform:perspective(1000px)_rotateX(2deg)_rotateY(-1deg)]' 
            : '[transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)]'
        } hover:[transform:perspective(1000px)_rotateX(5deg)_rotateY(-3deg)_translateY(-2px)]`}
      >
        
        {/* Decorative Wave/Circular Overlay Pattern */}
        <div className="absolute -right-8 -top-8 w-60 h-60 rounded-full bg-teal-400/5 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-medical-400/5 blur-2xl pointer-events-none"></div>
        
        {/* Card Header */}
        <div className="pb-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-sm border border-white/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[13px] tracking-tight text-white">ONESTOP</span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-teal-300">HEALTH</span>
            </div>
          </div>

          <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            VERIFIED
          </span>
        </div>

        {/* Card Main Content */}
        <div className="py-5 grid grid-cols-12 gap-5 items-center">
          
          {/* Avatar with pulse ring */}
          <div className="col-span-4 flex flex-col items-center justify-center relative">
            <div className="absolute w-18 h-18 rounded-full border border-white/20 animate-ping opacity-60"></div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-medical-500 text-white flex items-center justify-center text-xl font-bold font-sans shadow-md border-2 border-white select-none">
              {patient.photo ? (
                <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(patient.name)}</span>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="col-span-8 space-y-2">
            <div>
              <p className="text-[9px] text-teal-200 uppercase font-mono tracking-wider font-semibold">Citizen Name</p>
              <h4 className="font-bold text-lg text-white tracking-wide leading-tight">{patient.name}</h4>
              <code className="text-[11px] text-teal-300 font-mono tracking-wide block mt-0.5">ID: {patient.healthId}</code>
            </div>
          </div>
        </div>

        {/* White-Glass Info Grid */}
        <div className="grid grid-cols-4 gap-2.5 text-xs">
          <div className="col-span-3 grid grid-cols-2 gap-2">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-2 rounded-xl flex flex-col">
              <span className="text-[8px] text-teal-200 uppercase font-mono font-semibold tracking-wider">Date of Birth</span>
              <span className="font-bold text-white mt-0.5">{patient.dob}</span>
            </div>
            <div className="bg-teal-500 text-white border border-teal-400/30 p-2 rounded-xl flex flex-col shadow-xs">
              <span className="text-[8px] text-teal-100 uppercase font-mono font-semibold tracking-wider">Blood Group</span>
              <span className="font-extrabold mt-0.5 text-white">{patient.bloodGroup}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-2 rounded-xl flex flex-col col-span-2">
              <span className="text-[8px] text-teal-200 uppercase font-mono font-semibold tracking-wider">Aadhaar Token</span>
              <span className="font-mono text-white text-[11px] mt-0.5">{patient.maskedAadhaar}</span>
            </div>
          </div>
          <div className="col-span-1 bg-white p-1.5 rounded-xl flex items-center justify-center shadow-xs self-stretch">
            <QRCodeSVG 
              value={`https://onestophealth.gov.in/verify?id=${patient.healthId}&token=${qrToken}`}
              size={54}
              level="H"
              includeMargin={false}
              fgColor="#142857"
            />
          </div>
        </div>

        {/* Red Allergy Chips Section */}
        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-1.5">
            <span className="text-[8px] text-red-200 uppercase font-mono font-semibold tracking-wider block">Allergy Contraindications</span>
            <div className="flex flex-wrap gap-1">
              {patient.allergies.map((allergy, index) => (
                <span 
                  key={index}
                  className="bg-red-500/20 text-red-200 border border-red-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-full"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card Security Footnote - Dark Strip */}
        <div className="bg-medical-950/60 -mx-6 -mb-6 mt-4.5 px-6 py-2.5 flex items-center justify-between text-[10px] text-teal-200 border-t border-medical-800/40">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-teal-300" />
            <span>Secure Token Only</span>
          </div>
          <span className="font-mono text-[9px] text-teal-300/80">Secured under ABDM Protocol</span>
        </div>

      </div>

      {/* CARD ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
        <button
          onClick={handlePrint}
          className="flex-1 min-w-[120px] bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" />
          <span>Print Card</span>
        </button>

        <button
          onClick={handleRotateQR}
          className="flex-1 min-w-[120px] bg-teal-600 hover:bg-teal-705 text-white font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          <span>Rotate Token</span>
        </button>

        <button
          onClick={handleCopyId}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center"
          title="Copy Health ID"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={() => alert(`Share token copied: https://onestophealth.gov.in/verify?id=${patient.healthId}&token=${qrToken}`)}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center"
          title="Share Temporary Token"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
