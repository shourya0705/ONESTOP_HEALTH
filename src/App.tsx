import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { ConsentModal } from './components/ConsentModal';

import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyHealthID } from './pages/VerifyHealthID';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PharmacistDashboard } from './pages/PharmacistDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmergencyProfilePage } from './pages/EmergencyProfilePage';
import { HealthCard } from './components/HealthCard';

import { 
  HeartPulse, LogOut, Menu, X, Bell, User, Stethoscope, 
  Pill, Shield, Activity, Calendar, FileText, QrCode, Bot, ShieldCheck
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, setActiveTab, currentRole, setCurrentRole,
    currentPatient, currentDoctor, currentPharmacist, setAiDrawerOpen,
    notifications, markNotificationRead
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Filter notifications for current user/admin
  const userNotifications = notifications.filter(
    n => !n.read && (n.userId === currentPatient.id || currentRole === 'ADMIN')
  );

  const handleSignOut = () => {
    setCurrentRole('GUEST');
    setActiveTab('landing');
  };

  // Define sidebar navigation items for each role
  const getNavItems = () => {
    switch (currentRole) {
      case 'PATIENT':
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: Activity },
          { id: 'health-card', label: 'Digital Health Card', icon: QrCode },
          { id: 'medical-records', label: 'Medical Records', icon: FileText },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'privacy-access', label: 'Privacy & Access', icon: ShieldCheck },
          { id: 'onestop-ai', label: 'ONESTOP AI', icon: Bot, action: () => setAiDrawerOpen(true) },
        ];
      case 'DOCTOR':
        return [
          { id: 'doctor-dashboard', label: 'Dashboard', icon: Activity },
          { id: 'doctor-patients', label: 'My Patients', icon: User },
          { id: 'verify-id', label: 'Verify Health ID', icon: QrCode },
          { id: 'doctor-appointments', label: 'Appointments', icon: Calendar },
          { id: 'doctor-access-requests', label: 'Access Requests', icon: ShieldCheck },
          { id: 'onestop-ai', label: 'ONESTOP AI', icon: Bot, action: () => setAiDrawerOpen(true) },
        ];
      case 'PHARMACIST':
        return [
          { id: 'pharmacy-dashboard', label: 'Dashboard', icon: Activity },
          { id: 'verify-id', label: 'Verify Patient', icon: QrCode },
          { id: 'pharmacy-dispense', label: 'Dispense Medicine', icon: Pill },
          { id: 'pharmacy-access-requests', label: 'Access Requests', icon: ShieldCheck },
        ];
      case 'ADMIN':
        return [
          { id: 'admin-dashboard', label: 'Analytics Dashboard', icon: Activity },
          { id: 'admin-verify-professionals', label: 'Verify Professionals', icon: ShieldCheck },
          { id: 'admin-patients', label: 'Patients Registry', icon: User },
          { id: 'admin-hospitals', label: 'Hospitals', icon: Stethoscope },
          { id: 'admin-audit-logs', label: 'Audit Logs', icon: FileText },
          { id: 'admin-consents', label: 'Consents Ledger', icon: Shield },
        ];
      default:
        return [];
    }
  };

  const getWorkspaceTitle = () => {
    switch (currentRole) {
      case 'PATIENT': return 'My Health Portal';
      case 'DOCTOR': return 'Doctor Workspace';
      case 'PHARMACIST': return 'Pharmacy Portal';
      case 'ADMIN': return 'Admin Control Panel';
      default: return 'Workspace';
    }
  };

  const getRoleStatusBadge = () => {
    switch (currentRole) {
      case 'PATIENT':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Identity Verified
          </span>
        );
      case 'DOCTOR':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            License Verified
          </span>
        );
      case 'PHARMACIST':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Pharmacy Verified
          </span>
        );
      case 'ADMIN':
        return (
          <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            System Admin
          </span>
        );
      default:
        return null;
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'register':
        return <RegisterPage />;
      case 'verify-id':
        return <VerifyHealthID />;
      case 'dashboard':
      case 'medical-records':
      case 'medications':
      case 'privacy-access':
        return <PatientDashboard />;
      case 'health-card':
        return (
          <div className="space-y-6 max-w-lg mx-auto py-4 animate-fadeUp">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Digital Health ID Card</h2>
              <p className="text-xs text-slate-500">Universal identification for verified clinics, hospitals and pharmacies.</p>
            </div>
            <HealthCard patient={currentPatient} onVerifyClick={() => setActiveTab('verify-id')} />
          </div>
        );
      case 'appointments':
      case 'doctor-appointments':
        return (
          <div className="space-y-6 animate-fadeUp">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Consultation Appointments</h2>
                <p className="text-xs text-slate-500">View upcoming and past appointments in the network.</p>
              </div>
              <button 
                onClick={() => alert("Appointment booking is simulated in this prototype.")}
                className="bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
              >
                Book New Appointment
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">Upcoming Consultations</h3>
                  <div className="divide-y divide-slate-100">
                    <div className="py-4 flex items-start justify-between first:pt-0">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center font-bold">
                          12
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Dr. Rahul Sharma</p>
                          <p className="text-xs text-slate-500">Cardiology assessment - Fortis Center</p>
                          <p className="text-[11px] text-medical-600 font-medium mt-1">Tomorrow at 10:30 AM</p>
                        </div>
                      </div>
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="py-4 flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                          18
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Dr. Ananya Roy</p>
                          <p className="text-xs text-slate-500">Asthma checkup - Manipal Hospital</p>
                          <p className="text-[11px] text-teal-600 font-medium mt-1">18 Aug 2026 at 3:15 PM</p>
                        </div>
                      </div>
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        SCHEDULED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Appointment Policy</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Consultations require verified Health ID validation. Your Health ID will automatically be checked by the clinic when you arrive.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <strong>Need Help?</strong> Call customer care or ask ONESTOP AI.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'emergency-profile':
        return <EmergencyProfilePage />;
      case 'doctor-dashboard':
      case 'doctor-patients':
      case 'doctor-access-requests':
        return <DoctorDashboard />;
      case 'pharmacy-dashboard':
      case 'pharmacy-dispense':
      case 'pharmacy-access-requests':
        return <PharmacistDashboard />;
      case 'admin-dashboard':
      case 'admin-verify-professionals':
      case 'admin-patients':
      case 'admin-hospitals':
      case 'admin-audit-logs':
      case 'admin-consents':
        return <AdminDashboard />;
      default:
        if (currentRole === 'GUEST') return <LandingPage />;
        if (currentRole === 'DOCTOR') return <DoctorDashboard />;
        if (currentRole === 'PHARMACIST') return <PharmacistDashboard />;
        if (currentRole === 'ADMIN') return <AdminDashboard />;
        return <PatientDashboard />;
    }
  };

  const navItems = getNavItems();

  // 1. PUBLIC LANDING LAYOUT
  if (currentRole === 'GUEST') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-medical-500 selection:text-slate-950">
        <Navbar />
        
        <main className="flex-1">
          {renderActiveView()}
        </main>

        <AIAssistant />
        <ConsentModal />
        <Footer />
      </div>
    );
  }

  // 2. AUTHENTICATED WORKSPACE LAYOUT
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-medical-500 selection:text-slate-950">
      
      {/* 2A. FIXED SIDEBAR - DESKTOP */}
      <aside className="w-64 bg-medical-950 text-white flex-col hidden md:flex shrink-0 border-r border-medical-900">
        
        {/* Brand */}
        <div className="p-6 border-b border-medical-900/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <HeartPulse className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-white">ONESTOP</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-teal-300">HEALTH</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action || (() => setActiveTab(item.id))}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-medical-700/70 text-white shadow-xs'
                    : 'text-white/65 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-teal-300' : 'text-white/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-medical-900/50 space-y-3 bg-medical-950/40">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-600 to-teal-500 text-white flex items-center justify-center text-xs font-bold font-mono">
              {currentRole === 'PATIENT' ? currentPatient.name[0] : currentRole === 'DOCTOR' ? currentDoctor.name.replace('Dr. ', '')[0] : currentPharmacist.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs truncate">
                {currentRole === 'PATIENT' ? currentPatient.name : currentRole === 'DOCTOR' ? currentDoctor.name : currentPharmacist.name}
              </p>
              <p className="text-[10px] text-teal-300 font-mono truncate">
                {currentRole === 'PATIENT' ? currentPatient.healthId : currentRole === 'DOCTOR' ? currentDoctor.licenseNumber : 'Verified Pharmacy'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors mt-2"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* 2B. MOBILE SIDEBAR OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Scrim */}
          <div 
            className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-medical-950 text-white animate-slideLeft">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 border-b border-medical-900/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-medical-600 to-teal-500 flex items-center justify-center text-white">
                <HeartPulse className="w-5.5 h-5.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-[15px] tracking-tight">ONESTOP</span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-teal-300">HEALTH</span>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) item.action();
                      else setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all ${
                      isActive ? 'bg-medical-700/70 text-white' : 'text-white/65 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-teal-300' : 'text-white/50'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-medical-900/50 space-y-3 bg-medical-950/40">
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2C. WORKSPACE MAIN COLUMN */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        
        {/* HACKATHON DEMO ROLE SWITCHER BAR (Always keep on top for testing) */}
        <div className="bg-slate-100 px-4 py-1.5 border-b border-slate-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-medical-700 text-white font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-xs">
              DEMO MODE
            </span>
            <span className="text-slate-600 hidden sm:inline font-medium">Switch roles instantly:</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['GUEST', 'PATIENT', 'DOCTOR', 'PHARMACIST', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setCurrentRole(role as any);
                  if (role === 'GUEST') setActiveTab('landing');
                  else if (role === 'PATIENT') setActiveTab('dashboard');
                  else if (role === 'DOCTOR') setActiveTab('doctor-dashboard');
                  else if (role === 'PHARMACIST') setActiveTab('pharmacy-dashboard');
                  else if (role === 'ADMIN') setActiveTab('admin-dashboard');
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  currentRole === role
                    ? 'bg-medical-600 text-white shadow-2xs font-bold scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {role === 'GUEST' ? 'Landing' : role}
              </button>
            ))}
          </div>
        </div>

        {/* STICKY GLASS TOP BAR */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                {getWorkspaceTitle()}
              </h2>
              {currentRole === 'PATIENT' && (
                <span className="text-[10px] text-slate-500 font-mono font-medium mt-1 inline-block">
                  Health ID: <span className="text-medical-600 font-semibold">{currentPatient.healthId}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className="hidden sm:block">
              {getRoleStatusBadge()}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 border border-slate-200/60 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {userNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white">
                    {userNotifications.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-elevated p-3.5 z-50 text-xs animate-fadeUp">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Workspace Alerts</span>
                    <span className="text-[10px] text-medical-600 font-mono font-semibold">{userNotifications.length} new</span>
                  </div>

                  <div className="my-2 max-h-64 overflow-y-auto space-y-2">
                    {userNotifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">No workspace messages</p>
                    ) : (
                      userNotifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className="p-2.5 rounded-xl border border-medical-100 bg-medical-50/20 text-slate-800 hover:bg-medical-50/50 transition-colors cursor-pointer"
                        >
                          <p className="font-semibold text-medical-800">{n.title}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Block */}
            <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentRole === 'PATIENT' ? currentPatient.name[0] : currentRole === 'DOCTOR' ? currentDoctor.name.replace('Dr. ', '')[0] : currentPharmacist.name[0]}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-800">
                  {currentRole === 'PATIENT' ? currentPatient.name : currentRole === 'DOCTOR' ? currentDoctor.name : currentPharmacist.name}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                  {currentRole === 'PATIENT' ? 'PATIENT' : currentRole}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 bg-slate-50/60 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-8">
          {renderActiveView()}
        </main>

        {/* PROTOTYPE FOOTER */}
        <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500 font-medium">
          <p>⚠️ ONESTOP HEALTH is a hackathon prototype demonstrating consent-driven healthcare workflows. Not for real-world deployment.</p>
        </footer>

        {/* DRAWERS & MODALS */}
        <AIAssistant />
        <ConsentModal />
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
