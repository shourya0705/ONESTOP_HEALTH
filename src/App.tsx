import React from 'react';
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

const AppContent: React.FC = () => {
  const { activeTab, currentRole } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'register':
        return <RegisterPage />;
      case 'verify-id':
        return <VerifyHealthID />;
      case 'dashboard':
      case 'medical-history':
      case 'consent-manager':
        return <PatientDashboard />;
      case 'emergency-profile':
        return <EmergencyProfilePage />;
      case 'doctor-dashboard':
        return <DoctorDashboard />;
      case 'pharmacy-dashboard':
        return <PharmacistDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        if (currentRole === 'GUEST') return <LandingPage />;
        if (currentRole === 'DOCTOR') return <DoctorDashboard />;
        if (currentRole === 'PHARMACIST') return <PharmacistDashboard />;
        if (currentRole === 'ADMIN') return <AdminDashboard />;
        return <PatientDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      
      <main className="flex-1">
        {renderActiveView()}
      </main>

      <AIAssistant />
      <ConsentModal />
      <Footer />
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
