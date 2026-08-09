import React, { useState } from 'react';
import { 
  Plus, Bell, Bot, User, Stethoscope, 
  Pill, Shield, Home
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 text-slate-900 shadow-xs">
      {/* HACKATHON DEMO ROLE SWITCHER BAR */}
      <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-teal-600 text-white font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            HACKATHON DEMO SWITCHER
          </span>
          <span className="text-slate-600 hidden sm:inline font-medium">Test Roles Instantly:</span>
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
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                currentRole === role
                  ? 'bg-teal-600 text-white font-bold shadow-sm scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {role === 'GUEST' && <Home className="w-3.5 h-3.5" />}
              {role === 'PATIENT' && <User className="w-3.5 h-3.5" />}
              {role === 'DOCTOR' && <Stethoscope className="w-3.5 h-3.5" />}
              {role === 'PHARMACIST' && <Pill className="w-3.5 h-3.5" />}
              {role === 'ADMIN' && <Shield className="w-3.5 h-3.5" />}
              <span>{role === 'GUEST' ? 'Landing' : role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo matching reference photo */}
        <div 
          onClick={() => setActiveTab(currentRole === 'GUEST' ? 'landing' : 'dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                ONESTOP <span className="text-teal-600">HEALTH</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links based on Role */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {currentRole === 'PATIENT' && (
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                My Dashboard
              </button>
            </>
          )}

          {currentRole === 'DOCTOR' && (
            <>
              <button 
                onClick={() => setActiveTab('doctor-dashboard')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'doctor-dashboard' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                Doctor Portal
              </button>
              <button 
                onClick={() => setActiveTab('verify-id')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'verify-id' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                Verify Health ID
              </button>
            </>
          )}

          {currentRole === 'PHARMACIST' && (
            <>
              <button 
                onClick={() => setActiveTab('pharmacy-dashboard')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'pharmacy-dashboard' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                Pharmacy Portal
              </button>
              <button 
                onClick={() => setActiveTab('verify-id')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'verify-id' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                Verify ID & Dispense
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <button 
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 rounded-full transition-colors ${activeTab === 'admin-dashboard' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                Admin Control Panel
              </button>
            </>
          )}

          {currentRole === 'GUEST' && (
            <>
              <a href="#features" className="text-slate-600 hover:text-teal-600 transition-colors">Features</a>
              <a href="#ecosystem" className="text-slate-600 hover:text-teal-600 transition-colors">Ecosystem</a>
              <a href="#security" className="text-slate-600 hover:text-teal-600 transition-colors">Security</a>
              <a 
                href="#professionals" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentRole('DOCTOR');
                  setActiveTab('doctor-dashboard');
                }}
                className="text-slate-600 hover:text-teal-600 transition-colors"
              >
                For Professionals
              </a>
              <button 
                onClick={() => setActiveTab('register')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-full transition-all shadow-md shadow-teal-600/20 active:scale-95"
              >
                Get Health ID
              </button>
            </>
          )}
        </nav>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5">
          {currentRole !== 'GUEST' && currentRole !== 'PATIENT' && (
            <button 
              onClick={() => setActiveTab('register')}
              className="hidden sm:inline-flex bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-4 py-2 rounded-full shadow-sm transition-all"
            >
              Get Health ID
            </button>
          )}

          {/* ONESTOP AI Launch Button */}
          <button 
            onClick={() => setAiDrawerOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">ONESTOP AI</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 border border-slate-200 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-teal-600 font-mono font-semibold">{unreadNotifs.length} unread</span>
                </div>

                <div className="my-2 max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          n.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-teal-50/50 border-teal-200 text-slate-800'
                        }`}
                      >
                        <p className="font-semibold text-teal-700">{n.title}</p>
                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="pl-2 border-l border-slate-200 hidden sm:flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">
                {currentRole === 'PATIENT' ? currentPatient.name : currentRole === 'DOCTOR' ? currentDoctor.name : currentRole === 'PHARMACIST' ? currentPharmacist.name : 'System Admin'}
              </p>
              <p className="text-[10px] text-teal-600 font-mono font-semibold">
                {currentRole === 'PATIENT' ? currentPatient.healthId : currentRole === 'DOCTOR' ? currentDoctor.specialty : currentRole === 'PHARMACIST' ? 'Verified Pharmacy' : 'Super Admin'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
