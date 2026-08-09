import React, { useState } from 'react';
import { 
  ShieldCheck, Pill, Activity, 
  Stethoscope, FileText, AlertTriangle, 
  Filter, Search, Eye, Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const PatientDashboard: React.FC = () => {
  const { 
    currentPatient, records, prescriptions, consents, 
    auditLogs, setActiveTab, setAiDrawerOpen, revokeConsent 
  } = useApp();

  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'TIMELINE' | 'HISTORY' | 'AUDIT'>('OVERVIEW');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-8">
      
      {/* PATIENT HEADER DASHBOARD BANNER */}
      <div className="bg-gradient-to-br from-[#024959] via-[#036564] to-[#007a78] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-teal-400/20">
        <div className="flex items-center gap-4">
          <img 
            src={currentPatient.photo} 
            alt={currentPatient.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentPatient.name}</h1>
              <span className="bg-teal-300/20 text-teal-100 text-xs font-semibold px-3 py-0.5 rounded-full border border-teal-300/30">
                ACTIVE IDENTITY
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-teal-100 font-mono">
              <span>Health ID: <strong className="text-white">{currentPatient.healthId}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-white">{currentPatient.bloodGroup}</strong></span>
              <span>•</span>
              <span>DOB: {currentPatient.dob}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setAiDrawerOpen(true)}
            className="bg-white hover:bg-teal-50 text-[#024959] font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Ask ONESTOP AI</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('emergency-profile')}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border border-rose-300/40 font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>Emergency Profile</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold">
        <button 
          onClick={() => setViewMode('OVERVIEW')}
          className={`px-4 py-2 rounded-full transition-all ${viewMode === 'OVERVIEW' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          Dashboard Overview
        </button>

        <button 
          onClick={() => setViewMode('TIMELINE')}
          className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${viewMode === 'TIMELINE' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <Activity className="w-4 h-4" />
          <span>Interactive Timeline</span>
        </button>

        <button 
          onClick={() => setViewMode('HISTORY')}
          className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${viewMode === 'HISTORY' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <FileText className="w-4 h-4" />
          <span>My Medical History</span>
        </button>

        <button 
          onClick={() => setViewMode('AUDIT')}
          className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${viewMode === 'AUDIT' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <Eye className="w-4 h-4 text-teal-200" />
          <span>Who Accessed My Data ({patientAuditLogs.length})</span>
        </button>
      </div>

      {/* VIEW 1: OVERVIEW CARDS */}
      {viewMode === 'OVERVIEW' && (
        <div className="space-y-8">
          
          {/* Top Quick Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Health ID & Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Health ID Status</span>
                <ShieldCheck className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900 font-mono">{currentPatient.healthId}</p>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">✓ Verified National Registry</p>
              </div>
            </div>

            {/* Card 2: Allergies */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Allergies & Contra</span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900 truncate">
                  {currentPatient.allergies.join(', ') || 'None'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated warning to doctors</p>
              </div>
            </div>

            {/* Card 3: Active Medications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Current Medications</span>
                <Pill className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">
                  {patientPrescriptions.flatMap(p => p.medicines).length} Active Rx
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Budecort, Montair LC</p>
              </div>
            </div>

            {/* Card 4: Vaccinations */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Vaccination History</span>
                <Activity className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">
                  {patientRecords.filter(r => r.type === 'VACCINATION').length} Doses Logged
                </p>
                <p className="text-xs text-teal-700 font-semibold mt-0.5">COVID-19 Booster Complete</p>
              </div>
            </div>

          </div>

          {/* Middle Layout: Health Card Widget + Recent Medical Timeline Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Digital Health Card</h3>
              <HealthCard patient={currentPatient} />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900">Recent Medical Activity</h3>
                <button 
                  onClick={() => setViewMode('TIMELINE')}
                  className="text-xs text-teal-700 font-bold hover:underline"
                >
                  View Complete Timeline →
                </button>
              </div>

              <div className="space-y-3">
                {patientRecords.slice(0, 4).map(rec => (
                  <div key={rec.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-100">
                        {rec.type.substring(0, 4)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{rec.title}</h4>
                        <p className="text-xs text-slate-500">{rec.hospital} • {rec.doctorName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400">{rec.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: INTERACTIVE MEDICAL TIMELINE */}
      {viewMode === 'TIMELINE' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-700">Filter Timeline:</span>
              
              <select 
                value={selectedTypeFilter}
                onChange={e => setSelectedTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="BIRTH">Birth Records</option>
                <option value="VACCINATION">Vaccinations</option>
                <option value="CONSULTATION">Doctor Consultations</option>
                <option value="MEDICATION">Medications</option>
                <option value="SURGERY">Surgeries</option>
                <option value="LAB_TEST">Lab Tests</option>
              </select>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search record title, doctor, hospital..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Timeline Visual Chronology */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-teal-400 before:via-teal-600 before:to-slate-300">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="relative group">
                
                {/* Timeline Dot */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border-4 border-teal-600 shadow-md group-hover:scale-125 transition-transform"></div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-teal-50 text-teal-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border border-teal-100">
                        {rec.type}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900">{rec.title}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      📅 {rec.date} • {rec.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rec.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Healthcare Provider / Hospital</span>
                      <span className="font-semibold text-slate-800">{rec.hospital}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Attending Physician</span>
                      <span className="font-semibold text-teal-800">{rec.doctorName}</span>
                    </div>
                  </div>

                  {rec.details?.medicines && (
                    <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3 text-xs space-y-1">
                      <span className="font-bold text-teal-900 block">Prescribed Medication List:</span>
                      {rec.details.medicines.map((m, i) => (
                        <div key={i} className="text-teal-800 font-mono">
                          • {m.name} ({m.dosage}) — {m.frequency} [{m.timing}]
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 3: CATEGORIZED MEDICAL HISTORY */}
      {viewMode === 'HISTORY' && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-xl text-slate-900">Categorized Medical History Ledger</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vaccinations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Vaccination Records</span>
              </h4>
              <div className="space-y-2 text-xs">
                {patientRecords.filter(r => r.type === 'VACCINATION').map(v => (
                  <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{v.title}</span>
                      <span className="text-teal-700">{v.date}</span>
                    </div>
                    <p className="text-slate-500 mt-1">{v.hospital} • {v.details?.dose || 'Dose 1'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Surgeries */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-rose-600" />
                <span>Surgeries & Operations</span>
              </h4>
              <div className="space-y-2 text-xs">
                {patientRecords.filter(r => r.type === 'SURGERY').map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{s.title}</span>
                      <span className="text-rose-700">{s.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{s.description}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Surgeon: {s.details?.surgeon || s.doctorName}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 4: CONSENT MANAGER & AUDIT LOGS */}
      {viewMode === 'AUDIT' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">Who Accessed My Records?</h3>
              <p className="text-xs text-slate-500">Immutable record of every doctor, hospital, and pharmacy access event.</p>
            </div>
          </div>

          {/* Active Consents */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-sm uppercase font-mono text-teal-700">Active Permissions & Grants</h4>
            {patientConsents.filter(c => c.status === 'GRANTED').length === 0 ? (
              <p className="text-xs text-slate-500 italic">No active external doctor access permissions currently active.</p>
            ) : (
              patientConsents.filter(c => c.status === 'GRANTED').map(c => (
                <div key={c.id} className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{c.providerName} ({c.providerRole})</h5>
                    <p className="text-slate-600">{c.organization} • Granted for {c.duration}</p>
                  </div>
                  <button 
                    onClick={() => revokeConsent(c.id)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-1.5 rounded-full text-xs transition-colors shadow-xs"
                  >
                    REVOKE ACCESS
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[11px]">
                  <th className="p-3.5">Healthcare Actor</th>
                  <th className="p-3.5">Organization</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patientAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{log.actorName} <span className="text-slate-500 font-normal">({log.actorRole})</span></td>
                    <td className="p-3.5 text-slate-700">{log.organization}</td>
                    <td className="p-3.5 text-slate-800">{log.action}</td>
                    <td className="p-3.5 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="p-3.5 font-mono font-bold text-teal-700">✓ {log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
