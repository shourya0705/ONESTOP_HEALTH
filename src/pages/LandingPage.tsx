import React from 'react';
import { 
  ShieldCheck, QrCode, Bot, Users, Stethoscope, 
  Pill, ArrowRight, CheckCircle2, FileText, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setCurrentRole, currentPatient } = useApp();

  return (
    <div className="space-y-20 pb-16 font-sans">
      
      {/* HERO SECTION MATCHING REFERENCE PHOTO */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#f0fdfa] via-[#f8fdfc] to-white border-b border-teal-100/60">
        
        {/* Soft Mint Ambient Background Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Dot Badge */}
            <div className="inline-flex items-center gap-2 text-teal-600 text-xs font-bold font-mono tracking-wider uppercase bg-teal-50 border border-teal-200/80 px-3.5 py-1 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>INDIA'S CONNECTED HEALTH PLATFORM</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
              One trusted health record for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600">
                every citizen
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Instantly access, share, and protect medical records across doctors, hospitals, and pharmacies with consent-led security.
            </p>

            {/* Action Buttons Matching Photo */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-3">
              <button 
                onClick={() => {
                  setCurrentRole('PATIENT');
                  setActiveTab('register');
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-lg shadow-teal-600/25 flex items-center gap-2 active:scale-95"
              >
                <span>Register for Health ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  setCurrentRole('PATIENT');
                  setActiveTab('dashboard');
                }}
                className="bg-white hover:bg-slate-50 text-slate-800 font-medium px-6 py-3.5 rounded-full text-sm border border-slate-200/80 shadow-xs transition-all flex items-center gap-2 hover:border-slate-300"
              >
                <span>Sign In to Portal</span>
              </button>

              <button 
                onClick={() => setActiveTab('verify-id')}
                className="bg-white hover:bg-slate-50 text-slate-800 font-medium px-6 py-3.5 rounded-full text-sm border border-slate-200/80 shadow-xs transition-all flex items-center gap-2 hover:border-slate-300"
              >
                <span>Scan Health Card</span>
              </button>
            </div>

            {/* Micro Metrics Row */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/60 text-xs">
              <div>
                <p className="text-xl font-extrabold text-slate-900 font-mono">25,000+</p>
                <p className="text-slate-500 font-medium">Registered Citizens</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-teal-600 font-mono">3,500+</p>
                <p className="text-slate-500 font-medium">Verified Doctors</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-emerald-600 font-mono">1,200+</p>
                <p className="text-slate-500 font-medium">Pharmacies</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-cyan-600 font-mono">150+</p>
                <p className="text-slate-500 font-medium">Hospitals</p>
              </div>
            </div>

          </div>

          {/* Hero Right Interactive Card & Floating Badges */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Concentric Glow Graphic Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[440px] h-[440px] rounded-full border border-teal-200/60 bg-teal-50/40"></div>
              <div className="absolute w-[340px] h-[340px] rounded-full border border-teal-300/40"></div>
            </div>

            {/* Floating Top Left Badge */}
            <div className="absolute -top-3 -left-2 sm:-left-6 z-20 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Identity Verified</p>
                <p className="text-[10px] text-slate-500 font-medium">Aadhaar Linked</p>
              </div>
            </div>

            {/* Health Card Element */}
            <div className="w-full max-w-md relative z-10 transform hover:scale-[1.01] transition-transform duration-300">
              <HealthCard 
                patient={currentPatient} 
                onVerifyClick={() => setActiveTab('verify-id')}
              />
            </div>

            {/* Floating Bottom Right Badge */}
            <div className="absolute -bottom-4 -right-2 sm:-right-6 z-20 bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Consent Locked</p>
                <p className="text-[10px] text-slate-500 font-medium">Time-bound Access</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="features">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest">
            SIMPLIFIED HEALTHCARE WORKFLOW
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900">How ONESTOP HEALTH Works</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            A unified digital continuum keeping patients in complete control of their lifetime medical records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Create Health ID', desc: 'Register with Aadhaar token & mobile OTP uniqueness check.', icon: ShieldCheck },
            { step: '02', title: 'Verify Identity', desc: 'Receive instant digital Health Card & tokenized QR code.', icon: QrCode },
            { step: '03', title: 'Store Medical History', desc: 'Birth records, vaccinations, lab tests & surgeries linked automatically.', icon: FileText },
            { step: '04', title: 'Consent Access', desc: 'Doctors request access. You grant 30m, 1h, or 24h permission.', icon: Lock },
            { step: '05', title: 'Pharmacy Fulfilled', desc: 'Pharmacists verify digital prescriptions & update timeline.', icon: Pill }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative">
              <div className="text-2xl font-black font-mono text-teal-100 mb-2">{item.step}</div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 border border-teal-100">
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLE FEATURE BREAKDOWNS */}
      <section className="bg-gradient-to-b from-teal-50/40 via-slate-50 to-teal-50/20 py-16 border-y border-teal-100/50" id="ecosystem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono font-bold text-teal-600 uppercase tracking-widest">
              CONNECTED HEALTH ECOSYSTEM
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Empowering Every Stakeholder</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Citizens */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">For Patients & Citizens</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>One lifetime Health Card for all hospitals</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Interactive chronological Medical Timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>ONESTOP AI assistant for record queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Grant / revoke doctor access anytime</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  setCurrentRole('PATIENT');
                  setActiveTab('dashboard');
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-xs transition-colors shadow-sm"
              >
                Launch Patient Portal
              </button>
            </div>

            {/* Doctors */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">For Doctors & Clinics</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Instant access to authorized patient histories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Automatic allergy & drug interaction banners</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Digital prescription writer & lab report uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Medical Council credentials</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  setCurrentRole('DOCTOR');
                  setActiveTab('doctor-dashboard');
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full text-xs transition-colors shadow-sm"
              >
                Launch Doctor Portal
              </button>
            </div>

            {/* Pharmacies */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <Pill className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">For Pharmacies & Chemists</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verify digital prescriptions via Health ID scan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Prevent counterfeit & duplicate prescriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Automatic medication record posting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Complete pharmacy transaction audit logs</span>
                </li>
              </ul>
              <button 
                onClick={() => {
                  setCurrentRole('PHARMACIST');
                  setActiveTab('pharmacy-dashboard');
                }}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full text-xs transition-colors shadow-sm"
              >
                Launch Pharmacy Portal
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ONESTOP AI SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="security">
        <div className="bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-teal-400/20">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 text-teal-100 text-xs px-3 py-1 rounded-full border border-teal-300/30 backdrop-blur-xs">
              <Bot className="w-4 h-4 text-teal-200" />
              <span>AI Health Record Assistant</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white">
              Instant AI Navigation of Authorized Medical History
            </h3>
            <p className="text-teal-100 text-sm leading-relaxed">
              Ask natural questions like <em>"What medications am I taking?"</em> or <em>"When was my last surgery?"</em> ONESTOP AI parses your authorized database records to provide accurate summaries without inventing medical facts.
            </p>
            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => {
                  setCurrentRole('PATIENT');
                  setActiveTab('dashboard');
                }}
                className="bg-white hover:bg-teal-50 text-[#024959] font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md active:scale-95"
              >
                Try ONESTOP AI Chat
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
