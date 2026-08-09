import React, { useState } from 'react';
import { 
  ShieldCheck, QrCode, Bot, Users, Stethoscope, 
  Pill, ArrowRight, CheckCircle2, FileText, Lock, 
  AlertOctagon, ShieldAlert, Heart, Terminal, Database, HelpCircle, ChevronDown, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setCurrentRole, currentPatient } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is a universal Health ID?",
      a: "A unique 12-digit digital identifier for citizens that connects all their health records across different hospitals, clinics, and pharmacies into a single secure ledger."
    },
    {
      q: "How does consent-driven access work?",
      a: "No doctor or hospital can view your records without your permission. When they request access, you receive a notification to approve access for a set duration (e.g., 30 mins, 1 hour, or 24 hours). You can revoke access at any time."
    },
    {
      q: "Can the AI diagnostic assistant prescribe medicines?",
      a: "No. ONESTOP AI is strictly an information navigator. It reads your authorized records to summarize your history or guide you on general health education. It never makes diagnoses or prescribes medications."
    },
    {
      q: "Is my medical data secure?",
      a: "Yes. All records are secured using standard role-based access protocols and consent ledgers, keeping your sensitive health information encrypted and under your complete control."
    }
  ];

  return (
    <div className="space-y-0 pb-0 font-sans bg-slate-50/50">
      
      {/* 1. DARK HERO SECTION */}
      <section className="relative hero-gradient text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-medical-900">
        
        {/* Soft Radial Glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-medical-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              <span>One Health ID. One Complete Health Journey.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.1] text-white">
              Clinical, secure ledger for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-medical-300">
                every citizen's health
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Maintain a lifetime, consent-driven medical registry connecting doctors, hospitals, and pharmacies under a single digital identifier.
            </p>

            {/* Three CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => {
                  setCurrentRole('PATIENT');
                  setActiveTab('register');
                }}
                className="bg-teal-500 hover:bg-teal-650 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all shadow-md hover:shadow-teal-500/20 active:scale-[0.98] flex items-center gap-2"
              >
                <span>Get Your Health ID</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => {
                  setCurrentRole('DOCTOR');
                  setActiveTab('verify-id');
                }}
                className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all backdrop-blur-xs active:scale-[0.98]"
              >
                Verify ID Card
              </button>

              <button 
                onClick={() => {
                  setCurrentRole('DOCTOR');
                  setActiveTab('doctor-dashboard');
                }}
                className="text-teal-300 hover:text-teal-200 text-xs font-bold flex items-center gap-1 transition-colors hover:underline"
              >
                <span>Find Doctors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust Bullets */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 text-xs text-slate-350">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Government-grade data security</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100% time-bound patient consent</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Unified clinical timeline</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column: Mock Health Card + Floating Glass Notifications */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Concentric Glow Graphic Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[380px] h-[380px] rounded-full border border-white/5 bg-white/1"></div>
              <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10"></div>
            </div>

            {/* Mock White Health Card (Stunning visual contrast against dark hero bg) */}
            <div className="bg-white rounded-3xl p-6 shadow-elevated text-slate-900 border border-slate-200/80 w-full max-w-sm relative z-10 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(6deg)_rotateX(3deg)_translateY(-2px)]">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-extrabold text-[11px] tracking-tight">ONESTOP</span>
                    <span className="text-[7px] font-bold tracking-[0.2em] text-medical-650">HEALTH</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                  VERIFIED
                </span>
              </div>

              {/* Avatar Initials & Main Details */}
              <div className="py-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-medical-600 to-teal-400 text-white flex items-center justify-center text-lg font-black font-sans">
                  AS
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Aarav Sharma</h4>
                  <code className="text-[10px] text-slate-500 font-mono tracking-wider">Health ID: OSH-IND-100234</code>
                </div>
              </div>

              {/* DOB / Blood Group Tiles */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-200/60 p-2 rounded-xl text-center">
                  <span className="text-[7px] text-slate-400 uppercase font-mono block">DOB</span>
                  <span className="font-bold text-[11px] text-slate-700">12-04-1995</span>
                </div>
                <div className="bg-teal-50 text-teal-800 border border-teal-100 p-2 rounded-xl text-center">
                  <span className="text-[7px] text-teal-600 uppercase font-mono block">BLOOD</span>
                  <span className="font-extrabold text-[11px]">O+</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 p-2 rounded-xl text-center flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-slate-400" />
                </div>
              </div>

              {/* Allergy + Meds Chips */}
              <div className="space-y-1.5">
                <span className="text-[7px] text-slate-400 uppercase font-mono font-semibold block">Active Contraindications</span>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[8px] font-bold px-2 py-0.5 rounded-full">
                    Penicillin Allergy
                  </span>
                  <span className="bg-medical-50 text-medical-700 border border-medical-200 text-[8px] font-bold px-2 py-0.5 rounded-full">
                    Montair LC
                  </span>
                </div>
              </div>

              {/* Dotted QR Pattern */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-450 font-mono">
                <span>Secure token code</span>
                <span>ABDM Compliant</span>
              </div>
            </div>

            {/* Floating Glass Notification Card 1 (Top Left) */}
            <div className="absolute -top-6 -left-6 z-20 bg-white/10 backdrop-blur-md border border-white/15 shadow-elevated rounded-2xl p-3 flex items-center gap-3 text-left w-60">
              <div className="w-8 h-8 rounded-full bg-teal-500/25 border border-teal-400/40 text-teal-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[10px] text-white">Access Approved</p>
                <p className="text-[9px] text-slate-300 truncate">Dr. Ananya Roy accessed records (1h)</p>
              </div>
            </div>

            {/* Floating Glass Notification Card 2 (Bottom Right) */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-white/10 backdrop-blur-md border border-white/15 shadow-elevated rounded-2xl p-3 flex items-center gap-3 text-left w-56">
              <div className="w-8 h-8 rounded-full bg-medical-500/25 border border-medical-400/40 text-medical-200 flex items-center justify-center shrink-0">
                <Pill className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[10px] text-white">Dispensing Fulfill</p>
                <p className="text-[9px] text-slate-300 truncate">Montair LC Dispensed by Apollo</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. STATS BAND */}
      <section className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">25,000+</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Registered Citizens</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-medical-600 font-mono tracking-tight">3,500+</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Verified Doctors</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-teal-600 font-mono tracking-tight">1,200+</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Pharmacies</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">150+</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Hospitals</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-teal-650 font-mono tracking-tight">10,000+</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Secure Consents</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-medical-650 font-mono tracking-tight">99.9%</p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">Uptime SLA</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-medium italic">
            * All data metrics shown are simulated statistical figures for the hackathon prototype.
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-medical-600 uppercase tracking-widest">
            SIMPLIFIED HEALTH LEDGER WORKFLOW
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How ONESTOP HEALTH Works</h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            A secure digital registry keeping citizens in complete control of their lifetime medical history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Create Health ID', desc: 'Register with simulated Aadhaar and generate your identifier.' },
            { step: '02', title: 'Verify Identity', desc: 'Secure your card with a dynamic, time-bound QR token.' },
            { step: '03', title: 'Request Consent', desc: 'Healthcare professionals request access. You grant or revoke permissions.' },
            { step: '04', title: 'Dispense & Sync', desc: 'Pharmacists fulfill digital prescriptions. Records sync automatically.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div>
                <span className="text-5xl font-black font-mono text-slate-100 select-none block tracking-tighter leading-none mb-3">
                  {item.step}
                </span>
                <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ALTERNATING LIGHT/DARK FEATURE SECTIONS */}
      
      {/* 4A. PATIENTS SECTION (LIGHT) */}
      <section className="bg-white py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-medical-50 text-medical-800 border border-medical-100 text-xs px-3 py-1 rounded-full font-semibold">
              <Users className="w-4.5 h-4.5" />
              <span>For Patients & Citizens</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Complete Lifetime Health Journey, Consolidated
            </h3>
            <p className="text-slate-550 text-sm leading-relaxed">
              Access your medical records, check active prescriptions, and view audit history in one clinical portal.
            </p>
            <ul className="space-y-3.5 text-xs text-slate-650">
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Unified digital Health Card matching ABDM specs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Dynamic time-based consent controls for doctors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Chronological health assessment timeline.</span>
              </li>
            </ul>
          </div>

          {/* Timeline Panel Mock Preview */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-soft space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Chronological Health Timeline</h4>
            <div className="relative pl-6 border-l border-slate-200 space-y-5">
              
              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-4.5 h-4.5 rounded-full bg-medical-100 text-medical-700 flex items-center justify-center border border-white">
                  <Stethoscope className="w-2.5 h-2.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Routine Cardiac Assessment</span>
                    <span className="text-[9px] text-slate-400 font-mono">10 Aug 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dr. Rahul Sharma - Fortis Center</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[30px] top-0.5 w-4.5 h-4.5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center border border-white">
                  <Pill className="w-2.5 h-2.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Dispensed: Montair LC</span>
                    <span className="text-[9px] text-slate-400 font-mono">08 Aug 2026</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Apollo Pharmacy Indiranagar</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4B. DOCTORS SECTION (DARK) */}
      <section className="bg-medical-950 text-white py-20 border-b border-medical-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-xs text-white">Doctor Portal Workspace</span>
              <span className="bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                VERIFIED REGISTRY
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
                <p className="text-slate-400 font-mono text-[9px] uppercase">Search Patient Health ID</p>
                <div className="flex gap-2 mt-1.5">
                  <div className="flex-1 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 font-mono">
                    OSH-IND-100234
                  </div>
                  <button className="bg-teal-500 text-white font-bold px-3.5 rounded-lg">Search</button>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Aarav Sharma</p>
                  <p className="text-[10px] text-slate-400 font-mono">Verified Card • O+</p>
                </div>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  PENDING CONSENT
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-teal-300 border border-teal-500/30 text-xs px-3 py-1 rounded-full font-semibold">
              <Stethoscope className="w-4.5 h-4.5" />
              <span>For Doctors & Clinics</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Clinical Access Driven Solely by Patient Consent
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Verify Health IDs, request record authorization, write digital prescriptions, and receive immediate contraindication alerts.
            </p>
            <ol className="space-y-4 text-xs text-slate-300">
              <li className="flex gap-3">
                <span className="font-mono font-bold text-teal-400 text-sm shrink-0">1.</span>
                <span>Search patient by Aadhaar token or Health ID.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-teal-400 text-sm shrink-0">2.</span>
                <span>Trigger a secure, time-bound consent notification.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono font-bold text-teal-400 text-sm shrink-0">3.</span>
                <span>Review complete history ledger once approved.</span>
              </li>
            </ol>
          </div>

        </div>
      </section>

      {/* 4C. PHARMACIES SECTION (LIGHT) */}
      <section className="bg-white py-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-100 text-xs px-3 py-1 rounded-full font-semibold">
              <Pill className="w-4.5 h-4.5" />
              <span>For Pharmacies & Chemists</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Verify and Dispense Digital Prescriptions Instantly
            </h3>
            <p className="text-slate-550 text-sm leading-relaxed">
              Securely access patient prescriptions, log medication fulfillments, and prevent duplicate dispensing.
            </p>
            <div className="space-y-3 text-xs text-slate-650">
              <div className="flex gap-2">
                <Check className="w-4.5 h-4.5 text-teal-650 shrink-0" />
                <span>Verify prescription authenticity via Health ID token scan.</span>
              </div>
              <div className="flex gap-2">
                <Check className="w-4.5 h-4.5 text-teal-650 shrink-0" />
                <span>Dispense records post directly to citizen history.</span>
              </div>
            </div>
          </div>

          {/* Pharmacy panel mockup */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-soft space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Prescription Dispense Panel</h4>
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">Rx ID: #rx-104</span>
                <span className="text-rose-600 font-semibold uppercase text-[10px]">ACTIVE</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Montair LC 10mg</p>
                    <p className="text-[10px] text-slate-500">1 Tablet, at night (10 Days)</p>
                  </div>
                  <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PENDING
                  </span>
                </div>
              </div>
              <button 
                onClick={() => alert("Dispensing flow verified in prototype dashboard.")}
                className="w-full bg-teal-600 text-white font-bold py-2 rounded-xl mt-1 text-center"
              >
                Confirm Dispensing
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4D. ONESTOP AI SECTION (DARK TEAL GRADIENT) */}
      <section className="bg-gradient-to-br from-teal-950 to-teal-900 text-white py-20 border-b border-teal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-teal-300 border border-teal-500/30 text-xs px-3 py-1 rounded-full font-semibold">
              <Bot className="w-4.5 h-4.5" />
              <span>ONESTOP AI Health Navigation</span>
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Natural Language Navigation of Factual Medical Ledgers
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ask ONESTOP AI to query your records. The assistant is structured to call specific database tools to fetch verified history details, preventing hallucinated answers.
            </p>
            <div className="bg-teal-900/40 border border-teal-800/60 p-3 rounded-2xl text-xs text-teal-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4.5 h-4.5 text-teal-400 shrink-0 mt-0.5" />
              <p>
                <strong> Factual Safeguard:</strong> The AI can only fetch data you or the doctor are explicitly authorized to access via consent.
              </p>
            </div>
          </div>

          {/* Mock Terminal Chat Preview */}
          <div className="lg:col-span-6 bg-slate-950 rounded-3xl border border-teal-800/40 p-5 shadow-elevated space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-teal-900/60 pb-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-teal-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>ONESTOP AI SANDBOX</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            </div>

            {/* Chat Messages Mock */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto">
              <div className="flex justify-end">
                <span className="bg-medical-500 text-white rounded-2xl rounded-br-none px-3.5 py-2.5 max-w-[80%] font-medium">
                  What medications am I taking?
                </span>
              </div>

              <div className="flex justify-start flex-col items-start gap-2">
                <div className="font-mono text-[9px] bg-slate-900 border border-teal-900/80 text-teal-300 px-2 py-1 rounded-lg">
                  API Tool Call: ledger.get_prescriptions("pat-1")
                </div>
                <div className="bg-white/10 backdrop-blur-md text-slate-100 rounded-2xl rounded-bl-none px-3.5 py-2.5 max-w-[85%] border border-white/10">
                  Based on prescription records:
                  • **Montair LC 10mg** (1 tablet daily)
                  • **Budecort Inhaler** (2 puffs daily)
                </div>
              </div>
            </div>

            <div className="text-[9px] text-teal-300/60 text-center font-medium italic">
              * AI diagnostics are educational. AI guidance is not medical advice.
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECURITY GRID SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-medical-600 uppercase tracking-widest">
            REGULATORY CYBERSECURITY
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Health Security</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center border border-medical-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Role-Based Access Control</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict RBAC ensures only licensed, verified professionals (NMC registration checked) can access citizen record pathways.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">National Audit Logging</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every card verification, prescription dispense, and record look-up writes an immutable audit trail on the user logs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Time-Bound Consent Lock</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authorization automatically expires after 30 mins, 1 hour, or 24 hours. The patient retains full authority to revoke access.
            </p>
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY BAND SECTION */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Emergency Left Preview Panel */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-5 shadow-lg border border-red-300 w-full max-w-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-red-650 font-bold text-xs uppercase">
                <AlertOctagon className="w-4.5 h-4.5" />
                <span>Emergency Profile</span>
              </div>
              <span className="bg-red-50 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                OVERRIDE PROTOCOL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                <span className="text-[8px] text-slate-400 font-mono block">BLOOD GROUP</span>
                <span className="font-black text-red-600 text-sm">O+</span>
              </div>
              <div className="bg-red-50 text-red-800 border border-red-100 p-2.5 rounded-xl">
                <span className="text-[8px] text-red-600 font-mono block">ALLERGIES</span>
                <span className="font-bold text-[10px] truncate block">Penicillin, Peanuts</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-600">
              <p className="font-bold text-slate-700">Emergency Contacts:</p>
              <p className="mt-0.5">Priya Sharma (Wife) • +91 98765 99887</p>
            </div>
          </div>

          {/* Emergency Right Text details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white border border-white/20 text-xs px-3 py-1 rounded-full font-bold">
              <ShieldAlert className="w-4.5 h-4.5 text-red-200" />
              <span>Critical Emergency Action</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Emergency Profile Access Override
            </h3>
            <p className="text-red-50 text-xs sm:text-sm leading-relaxed">
              In severe medical crises, authorized medical officers can trigger a logged emergency override to view blood groups, allergies, and critical health indices without patient OTP verification.
            </p>
            <button 
              onClick={() => {
                setCurrentRole('DOCTOR');
                setActiveTab('verify-id');
              }}
              className="bg-white hover:bg-slate-50 text-red-650 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-md active:scale-[0.98]"
            >
              Verify Emergency Bypass
            </button>
          </div>

        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <HelpCircle className="w-8 h-8 text-medical-600 mx-auto" />
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left font-bold text-slate-800 flex justify-between items-center text-xs sm:text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-550 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. DARK CTA */}
      <section className="bg-medical-950 text-white py-16 text-center border-t border-medical-900">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h3 className="text-3xl font-extrabold tracking-tight">Join India's Digital Health Revolution</h3>
          <p className="text-slate-350 text-sm max-w-xl mx-auto leading-relaxed">
            Create your universal Health ID in minutes. Maintain ownership of your medical registry.
          </p>
          <button 
            onClick={() => {
              setCurrentRole('PATIENT');
              setActiveTab('register');
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all shadow-md hover:shadow-teal-500/20 active:scale-[0.98]"
          >
            Register Now
          </button>
        </div>
      </section>

      {/* 9. DARK FOOTER */}
      <footer className="bg-[#0b1220] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-[13px] tracking-tight text-white">ONESTOP HEALTH</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Providing citizens with a single health registry and consent-based health journal.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider mb-3">Platform Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => { setCurrentRole('PATIENT'); setActiveTab('register'); }} className="hover:text-white transition-colors">Get Health ID</button></li>
              <li><button onClick={() => { setCurrentRole('DOCTOR'); setActiveTab('doctor-dashboard'); }} className="hover:text-white transition-colors">Find Doctors</button></li>
              <li><button onClick={() => setActiveTab('verify-id')} className="hover:text-white transition-colors">Verify Health ID</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider mb-3">Regulatory & Security</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#security" className="hover:text-white transition-colors">ABDM Guidelines</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Consent Framework</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase text-[10px] tracking-wider mb-3">Hackathon Info</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Developed as a digital healthcare ecosystem prototype to showcase AI integrations in identity ledgers.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-900 text-center text-[10px] text-slate-650">
          <p>© 2026 ONESTOP HEALTH National Portal. All Rights Reserved. Fictional Patient Data Prototype.</p>
        </div>
      </footer>

    </div>
  );
};
