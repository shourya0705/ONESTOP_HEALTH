import React, { useState } from 'react';
import { 
  Bell, Bot, User, Stethoscope, 
  Pill, Shield, Home, HeartPulse
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentRole, setCurrentRole, activeTab, setActiveTab, 
    notifications, currentPatient, currentDoctor, currentPharmacist,
    setAiDrawerOpen, markNotificationRead
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read && (n.userId === currentPatient.id || currentRole === 'ADMIN'));

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-soft">
      {/* HACKATHON DEMO ROLE SWITCHER BAR */}
      <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-medical-700 text-white font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-2xs">
            HACKATHON SWITCHER
          </span>
          <span className="text-slate-500 hidden sm:inline font-medium">Test other workspaces instantly:</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {(['GUEST', 'PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                setCurrentRole(role);
                if (role === 'GUEST') setActiveTab('landing');
                else if (role === 'PATIENT') setActiveTab('dashboard');
                else if (role === 'DOCTOR') setActiveTab('doctor-dashboard');
                else if (role === 'PHARMACIST') setActiveTab('pharmacy-dashboard');
                else if (role === 'ADMIN') setActiveTab('admin-dashboard');
              }}
              className={`px-2.5 py-0.5 rounded-full font-semibold transition-all ${
                currentRole === role
                  ? 'bg-medical-600 text-white shadow-2xs font-bold scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{role === 'GUEST' ? 'Landing' : role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo with HeartPulse gradient and double wordmark */}
        <div 
          onClick={() => setActiveTab(currentRole === 'GUEST' ? 'landing' : 'dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <HeartPulse className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-slate-900 group-hover:text-medical-600 transition-colors">
              ONESTOP
            </span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-medical-600">
              HEALTH
            </span>
          </div>
        </div>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold">
          <button 
            onClick={() => {
              setCurrentRole('DOCTOR');
              setActiveTab('doctor-dashboard');
            }}
            className="text-slate-600 hover:text-medical-600 transition-colors font-semibold"
          >
            Find Doctors
          </button>
          <button 
            onClick={() => setActiveTab('verify-id')}
            className={`text-slate-600 hover:text-medical-600 transition-colors font-semibold ${activeTab === 'verify-id' ? 'text-medical-600 font-bold' : ''}`}
          >
            Verify Health ID
          </button>

          <button 
            onClick={() => {
              setCurrentRole('PATIENT');
              setActiveTab('dashboard');
            }}
            className="text-slate-600 hover:text-medical-600 transition-colors font-semibold"
          >
            Sign in
          </button>

          <button 
            onClick={() => setActiveTab('register')}
            className="bg-medical-700 hover:bg-medical-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-[0.98]"
          >
            Get Your Health ID
          </button>
        </nav>

        {/* Mobile menu and Quick Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button 
            onClick={() => setActiveTab('register')}
            className="bg-medical-700 hover:bg-medical-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Get Health ID
          </button>
        </div>

      </div>
    </header>
  );
};
