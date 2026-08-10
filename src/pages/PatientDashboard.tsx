import React, { useState } from 'react';
import { 
  ShieldCheck, Pill, Activity, 
  Stethoscope, FileText, 
  Filter, Search, CheckCircle2, Clock, Lock, Upload, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const PatientDashboard: React.FC = () => {
  const { 
    currentPatient, records, prescriptions, consents, 
    auditLogs, revokeConsent, grantConsent, denyConsent, addMedicalRecord, activeTab, setActiveTab
  } = useApp();

  // Sync internal viewMode with global activeTab
  const viewMode = activeTab === 'medications' ? 'MEDICATIONS' :
                   activeTab === 'medical-records' ? 'TIMELINE' :
                   activeTab === 'privacy-access' ? 'AUDIT' :
                   'OVERVIEW';

  const setViewMode = (mode: 'OVERVIEW' | 'MEDICATIONS' | 'TIMELINE' | 'HISTORY' | 'AUDIT') => {
    if (mode === 'OVERVIEW') setActiveTab('dashboard');
    else if (mode === 'MEDICATIONS') setActiveTab('medications');
    else if (mode === 'TIMELINE' || mode === 'HISTORY') setActiveTab('medical-records');
    else if (mode === 'AUDIT') setActiveTab('privacy-access');
  };

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom record upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newRecordData, setNewRecordData] = useState({
    title: '',
    type: 'CONSULTATION',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    hospital: '',
    doctorName: '',
    description: ''
  });

  // Filter records by patient
  const patientRecords = records.filter(r => r.patientId === currentPatient.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === currentPatient.id);
  const patientConsents = consents.filter(c => c.patientId === currentPatient.id);
  const patientAuditLogs = auditLogs.filter(a => a.patientId === currentPatient.id);

  // Apply Timeline Filters
  const filteredRecords = patientRecords.filter(r => {
    const matchesType = selectedTypeFilter === 'ALL' || r.type === selectedTypeFilter;
    const matchesQuery = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // Status Tone utility mapping
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (['VERIFIED', 'ACTIVE', 'APPROVED', 'CONFIRMED', 'DISPENSED', 'GRANTED', 'AUTHORIZED'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-250/60';
    }
    if (['PENDING', 'SCHEDULED'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border border-amber-250/60';
    }
    if (['REJECTED', 'REVOKED', 'CANCELLED', 'CRITICAL', 'EXPIRED', 'DENIED'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border border-rose-250/60';
    }
    if (['ADMITTED', 'EMERGENCY_OVERRIDE'].includes(s)) {
      return 'bg-medical-50 text-medical-700 border border-medical-250/60';
    }
    return 'bg-slate-50 text-slate-700 border border-slate-200';
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedicalRecord({
      patientId: currentPatient.id,
      type: newRecordData.type as any,
      title: newRecordData.title,
      date: newRecordData.date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: newRecordData.provider || 'Citizen Document Upload',
      hospital: newRecordData.hospital || 'Personal Records Vault',
      doctorName: newRecordData.doctorName || 'Self-Reported',
      description: newRecordData.description,
      details: {}
    });
    setShowUploadModal(false);
    setNewRecordData({
      title: '',
      type: 'CONSULTATION',
      date: new Date().toISOString().split('T')[0],
      provider: '',
      hospital: '',
      doctorName: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* 1. CLINICAL HEADER DASHBOARD BANNER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <img 
            src={currentPatient.photo} 
            alt={currentPatient.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-md animate-pulseRing"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentPatient.name}</h1>
              <span className="bg-teal-400/20 text-teal-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-300/30">
                PATIENT REGISTERED
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-teal-100 font-mono">
              <span>Health ID: <strong className="text-white">{currentPatient.healthId}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-white">{currentPatient.bloodGroup}</strong></span>
              <span>•</span>
              <span>DOB: {currentPatient.dob}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SUB-VIEW: OVERVIEW */}
      {/* =================================================================== */}
      {viewMode === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Health Card & Quick actions */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Your Digital ID Card</h3>
              <HealthCard patient={currentPatient} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Quick Operations</h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-medical-50 hover:bg-medical-100 text-medical-800 border border-medical-200 p-3 rounded-xl text-left font-semibold flex items-center justify-between"
                >
                  <span>Upload Medical Document</span>
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('AUDIT')}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 p-3 rounded-xl text-left font-semibold flex items-center justify-between"
                >
                  <span>Check Access Logs</span>
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Summaries & Recent Records */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Chronic Conditions</span>
                <span className="font-extrabold text-sm text-slate-900 mt-1 block">
                  {currentPatient.criticalConditions.join(', ')}
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Allergies Reported</span>
                <span className="font-extrabold text-sm text-rose-700 mt-1 block">
                  {currentPatient.allergies.join(', ')}
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Active Consents</span>
                <span className="font-extrabold text-sm text-slate-900 mt-1 block">
                  {patientConsents.filter(c => c.status === 'GRANTED').length} Doctors
                </span>
              </div>
            </div>

            {/* Recent Timeline Preview */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Recent Medical Logs</h3>
                <button onClick={() => setViewMode('TIMELINE')} className="text-xs text-medical-600 font-bold hover:underline">
                  View Full Timeline
                </button>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                {patientRecords.slice(0, 3).map((rec) => (
                  <div key={rec.id} className={`pt-4 first:pt-0 flex items-start justify-between text-xs`}>
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-55 flex items-center justify-center font-bold shrink-0 text-slate-600 bg-slate-100">
                        {rec.type === 'BIRTH' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {rec.type === 'VACCINATION' && <ShieldCheck className="w-5 h-5 text-teal-650" />}
                        {rec.type === 'CONSULTATION' && <Stethoscope className="w-5 h-5 text-medical-600" />}
                        {rec.type === 'MEDICATION' && <Pill className="w-5 h-5 text-medical-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{rec.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{rec.doctorName} • {rec.hospital}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{rec.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. SUB-VIEW: MEDICATIONS */}
      {/* =================================================================== */}
      {viewMode === 'MEDICATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Current Medications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-4.5 h-4.5 text-medical-600 animate-pulse" />
                <span>Current Medications</span>
              </h3>
              <span className="bg-teal-50 text-teal-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-100">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              {patientPrescriptions.filter(p => !p.dispensed).flatMap(p => p.medicines).length === 0 ? (
                <p className="text-slate-400 text-xs italic py-4 text-center">No active current medications.</p>
              ) : (
                patientPrescriptions.filter(p => !p.dispensed).flatMap(p => p.medicines).map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-xs text-slate-900 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-500"></span>
                    <span>{m.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Medication History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-slate-500" />
                <span>Medication History</span>
              </h3>
              <span className="bg-slate-100 text-slate-655 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                DISPENSED
              </span>
            </div>

            <div className="space-y-2">
              {patientPrescriptions.filter(p => p.dispensed).flatMap(p => p.medicines).length === 0 ? (
                <p className="text-slate-400 text-xs italic py-4 text-center">No past medication history.</p>
              ) : (
                patientPrescriptions.filter(p => p.dispensed).flatMap(p => p.medicines).map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/50 border border-slate-200/65 rounded-xl font-semibold text-xs text-slate-600 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
                    <span>{m.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 5. SUB-VIEW: INTERACTIVE TIMELINE */}
      {/* =================================================================== */}
      {viewMode === 'TIMELINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Filter panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-4 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-slate-900 text-sm">Filter Timeline</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Search keyword</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-450 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, hospital, diagnosis..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block font-mono">Record Category</label>
                <select 
                  value={selectedTypeFilter}
                  onChange={e => setSelectedTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none font-medium"
                >
                  <option value="ALL">All Records</option>
                  <option value="BIRTH">Birth Records</option>
                  <option value="VACCINATION">Vaccinations</option>
                  <option value="CONSULTATION">Consultations</option>
                  <option value="MEDICATION">Medication Dispensing</option>
                  <option value="SURGERY">Surgical History</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Chronological Timeline tree */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-6">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Unified Medical Timeline Ledger</h3>
            
            <div className="relative pl-8 border-l border-slate-200 space-y-6">
              {filteredRecords.length === 0 ? (
                <p className="text-slate-400 text-xs italic py-4">No records match the filter criteria.</p>
              ) : (
                filteredRecords.map((rec) => (
                  <div key={rec.id} className="relative animate-fadeUp">
                    {/* Circle Icon Badge */}
                    <div className="absolute -left-[42px] top-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-soft flex items-center justify-center text-slate-600">
                      {rec.type === 'BIRTH' && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />}
                      {rec.type === 'VACCINATION' && <ShieldCheck className="w-4.5 h-4.5 text-teal-600" />}
                      {rec.type === 'CONSULTATION' && <Stethoscope className="w-4.5 h-4.5 text-medical-600" />}
                      {rec.type === 'MEDICATION' && <Pill className="w-4.5 h-4.5 text-medical-600" />}
                      {rec.type === 'SURGERY' && <Activity className="w-4.5 h-4.5 text-rose-600" />}
                    </div>

                    <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-2 text-xs transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(rec.type)}`}>
                            {rec.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-450 font-mono font-semibold">{rec.date} at {rec.time || 'N/A'}</span>
                      </div>

                      <p className="text-slate-600 leading-relaxed">{rec.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-450 border-t border-slate-100 pt-2 font-mono">
                        <div>PROVIDER: <strong className="text-slate-700">{rec.provider}</strong></div>
                        <div>HOSPITAL: <strong className="text-slate-700">{rec.hospital}</strong></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 6. SUB-VIEW: PRIVACY & ACCESS LOGS */}
      {/* =================================================================== */}
      {viewMode === 'AUDIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeUp">
          
          {/* Active Consents panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 space-y-4 h-fit">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Active Practitioner Consents</h3>
            
            <div className="space-y-3.5">
              {patientConsents.length === 0 ? (
                <p className="text-slate-400 text-xs italic">No access records exist.</p>
              ) : (
                patientConsents.map((consent) => (
                  <div key={consent.id} className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{consent.providerName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{consent.organization}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(consent.status)}`}>
                        {consent.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-450 font-mono">
                      <span>Access: {consent.duration}</span>
                      {consent.expiresAt && (
                        <span>Expires: {new Date(consent.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-slate-100">
                      {consent.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => grantConsent(consent.id)}
                            className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors"
                          >
                            Grant
                          </button>
                          <button 
                            onClick={() => denyConsent(consent.id)}
                            className="flex-1 bg-rose-600 text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors"
                          >
                            Deny
                          </button>
                        </>
                      )}
                      {consent.status === 'GRANTED' && (
                        <button 
                          onClick={() => revokeConsent(consent.id)}
                          className="w-full bg-rose-600 text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors"
                        >
                          Revoke Access Immediately
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit Logs list */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Data Access History Log</h3>
            <div className="space-y-3.5 divide-y divide-slate-100">
              {patientAuditLogs.map((log) => (
                <div key={log.id} className="pt-3.5 first:pt-0 text-xs flex justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-550 mt-1">
                      Accessed by: <strong>{log.actorName}</strong> ({log.actorRole}) • {log.organization}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono text-right shrink-0 mt-0.5">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 7. CUSTOM MEDICAL RECORD UPLOAD MODAL */}
      {/* =================================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-slate-150 text-slate-900 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-medical-600" />
                <span>Upload Medical Report</span>
              </h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-655 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Report Title / Consultation Name *</label>
                <input 
                  type="text" required
                  value={newRecordData.title}
                  onChange={e => setNewRecordData({ ...newRecordData, title: e.target.value })}
                  placeholder="e.g. Precautionary Vaccine Certificate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Record Type *</label>
                  <select 
                    value={newRecordData.type}
                    onChange={e => setNewRecordData({ ...newRecordData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="CONSULTATION">Consultation</option>
                    <option value="VACCINATION">Vaccination</option>
                    <option value="LAB_TEST">Lab Test</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Record Date *</label>
                  <input 
                    type="date" required
                    value={newRecordData.date}
                    onChange={e => setNewRecordData({ ...newRecordData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Doctor Name</label>
                  <input 
                    type="text"
                    value={newRecordData.doctorName}
                    onChange={e => setNewRecordData({ ...newRecordData, doctorName: e.target.value })}
                    placeholder="Dr. S. Kulkarni"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Hospital / Institution</label>
                  <input 
                    type="text"
                    value={newRecordData.hospital}
                    onChange={e => setNewRecordData({ ...newRecordData, hospital: e.target.value })}
                    placeholder="St. Martha Hospital"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Report Description / Details *</label>
                <textarea 
                  required
                  value={newRecordData.description}
                  onChange={e => setNewRecordData({ ...newRecordData, description: e.target.value })}
                  placeholder="Summarize report outcomes..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
              >
                Upload to Health ID Ledger
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
