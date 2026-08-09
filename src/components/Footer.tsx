import React from 'react';
import { Heart, ShieldCheck, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80 py-10 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-wide">
                ONESTOP <span className="text-teal-600">HEALTH</span>
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                One Health ID. One Complete Medical History. One Connected System.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-wrap items-center justify-start md:justify-end gap-6 text-slate-600">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Aadhaar Tokenized Privacy</span>
            </span>
            <span>•</span>
            <span className="font-medium">Consent-Driven Architecture</span>
            <span>•</span>
            <span className="font-medium">Immutable Audit Logging</span>
          </div>
        </div>

        {/* Hackathon Disclaimer Banner */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 flex items-start gap-3 text-teal-900">
          <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Legal & Medical Disclaimer — Hackathon Demonstration Prototype
            </h4>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              ONESTOP HEALTH is a hackathon prototype designed to demonstrate a unified digital healthcare ecosystem. It is not a substitute for professional medical advice, diagnosis, or treatment. All demo patients, medical records, doctors, and pharmacy listings are fictional data created solely for functional demonstration. Real-world deployment would require compliance with applicable healthcare, privacy, cybersecurity, identity, and medical regulations.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-4">
          <p>© 2026 ONESTOP HEALTH Platform. All rights reserved.</p>
          <p className="font-mono">Built for Hackathon Demonstration | Version 1.0.0-PROTOTYPE</p>
        </div>

      </div>
    </footer>
  );
};
