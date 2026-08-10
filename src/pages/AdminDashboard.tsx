import React, { useState } from 'react';
import { 
  Shield, Users, Stethoscope, Pill, Activity, FileText, CheckCircle2,
  Database, ShieldCheck, ShieldAlert, Building, Clock, Eye, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Patient } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    patients, doctors, pharmacists, records, consents, auditLogs,
    verifyDoctorStatus, verifyPharmacistStatus, activeTab 
  } = useApp();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const pendingDoctors = doctors.filter(d => d.verificationStatus === 'PENDING');
  const pendingPharmacists = pharmacists.filter(p => p.verificationStatus === 'PENDING');

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
    return 'bg-slate-50 text-slate-700 border border-slate-205';
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* ADMIN HEADER BANNER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-elevated flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/25 border border-teal-300/30 flex items-center justify-center text-teal-250 shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">National Health Governance Registry</h1>
            <p className="text-xs text-teal-100 mt-1 font-mono">
              System Administrator Portal • Ministry of Digital Health Infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* METRICS CARDS GRID (Always visible at top of Admin Portal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Registered Citizens</span>
            <Users className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{patients.length}</p>
          <span className="text-[10px] text-teal-750 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">Aadhaar Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Verified Doctors</span>
            <Stethoscope className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{doctors.filter(d => d.verificationStatus === 'VERIFIED').length}</p>
          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 block w-fit">{pendingDoctors.length} Verification Pending</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Verified Chemists</span>
            <Pill className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{pharmacists.filter(p => p.verificationStatus === 'VERIFIED').length}</p>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">{pendingPharmacists.length} Verification Pending</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider">EHR Records Linked</span>
            <Activity className="w-4.5 h-4.5 text-medical-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{records.length}</p>
          <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100 block w-fit">Tokenized Documents</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: ANALYTICS DASHBOARD OVERVIEW */}
      {/* =================================================================== */}
      {(activeTab === 'admin-dashboard' || !activeTab) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-4.5 h-4.5 text-medical-600" />
              <span>National Health Registry Compliance Alerts</span>
            </h3>
            
            <div className="space-y-4 text-xs text-slate-650 leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-1">Aadhaar Linkage Status</h4>
                <p>All citizen digital health records are validated against Aadhaar biometric checks. Verification queues show the tokenized ID hash of registered applicants.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-1">Audit Log Compliance Protocol</h4>
                <p>Every transaction, decryption override, and consent grant is logged in the cryptographic ledger. Administrators monitor overrides for clinical security compliance.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Verification Summary</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-55 rounded-xl border border-slate-150">
                <span className="font-semibold text-slate-700">Pending Doctors:</span>
                <span className="font-bold text-slate-900 font-mono">{pendingDoctors.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-55 rounded-xl border border-slate-150">
                <span className="font-semibold text-slate-700">Pending Chemists:</span>
                <span className="font-bold text-slate-900 font-mono">{pendingPharmacists.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: VERIFY PROFESSIONALS QUEUES */}
      {/* =================================================================== */}
      {activeTab === 'admin-verify-professionals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Doctors Queue Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-medical-600" />
                <span>Doctor verification queue</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-250/60">
                {pendingDoctors.length} Pending Approval
              </span>
            </div>

            <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {doctors.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6">No Doctor records present in queue.</p>
              ) : (
                doctors.map(doc => (
                  <div key={doc.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{doc.name}</h5>
                        <p className="text-slate-500 font-medium text-[11px]">{doc.specialty} • {doc.hospital}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(doc.verificationStatus)}`}>
                        {doc.verificationStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-500 text-[11px]">
                      <p>License ID: <strong className="font-mono text-slate-700">{doc.licenseNumber}</strong></p>
                      <p>Qualifications: <strong className="text-slate-700 font-medium">{doc.degree || 'Medical degree certification'}</strong></p>
                      {doc.phone && <p>Contact: <strong className="text-slate-700 font-medium">{doc.phone}</strong></p>}
                    </div>

                    {doc.verificationStatus === 'PENDING' && (
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => verifyDoctorStatus(doc.id, 'VERIFIED')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px]"
                        >
                          Approve Registration
                        </button>
                        <button 
                          onClick={() => verifyDoctorStatus(doc.id, 'REJECTED')}
                          className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold py-1.5 rounded-lg text-[10px]"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pharmacy Queue Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <span>Pharmacy verification queue</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-250/60">
                {pendingPharmacists.length} Pending Approval
              </span>
            </div>

            <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {pharmacists.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6">No pharmacy records present in queue.</p>
              ) : (
                pharmacists.map(pharm => (
                  <div key={pharm.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{pharm.pharmacyName}</h5>
                        <p className="text-slate-500 font-medium text-[11px]">Registered Pharmacist: {pharm.name}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(pharm.verificationStatus)}`}>
                        {pharm.verificationStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-500 text-[11px]">
                      <p>Drug License Number: <strong className="font-mono text-slate-700">{pharm.licenseNumber}</strong></p>
                      <p>Location: <strong className="text-slate-700 font-medium">{pharm.address}</strong></p>
                      {pharm.phone && <p>Contact: <strong className="text-slate-700 font-medium">{pharm.phone}</strong></p>}
                    </div>

                    {pharm.verificationStatus === 'PENDING' && (
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => verifyPharmacistStatus(pharm.id, 'VERIFIED')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px]"
                        >
                          Approve Licensing
                        </button>
                        <button 
                          onClick={() => verifyPharmacistStatus(pharm.id, 'REJECTED')}
                          className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold py-1.5 rounded-lg text-[10px]"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PATIENT LEDGER REGISTRY */}
      {/* =================================================================== */}
      {activeTab === 'admin-patients' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-medical-600" />
            <span>National Citizen Health Registry Logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-55">
                  <th className="py-2.5 px-3">Citizen Name</th>
                  <th className="py-2.5 px-3">National Health ID</th>
                  <th className="py-2.5 px-3">Age / Gender</th>
                  <th className="py-2.5 px-3">Aadhaar Token Mapping</th>
                  <th className="py-2.5 px-3">Allergies / Critical Conditions</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map(pat => (
                  <tr key={pat.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-3 font-bold text-slate-800">{pat.name}</td>
                    <td className="py-3 px-3 font-mono text-teal-800 font-semibold">{pat.healthId}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {pat.gender} (DOB: {pat.dob})
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">{pat.maskedAadhaar || 'XXXX-XXXX-XXXX'}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {pat.allergies.slice(0, 2).map((a, i) => (
                          <span key={i} className="bg-rose-50 text-rose-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-rose-100">
                            {a}
                          </span>
                        ))}
                        {pat.criticalConditions.slice(0, 2).map((c, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedPatient(pat)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: AUDIT LOGS */}
      {/* =================================================================== */}
      {activeTab === 'admin-audit-logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-medical-600" />
            <span>National Cryptographic Audit Trail Logs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-55">
                  <th className="py-2.5 px-3">Transaction</th>
                  <th className="py-2.5 px-3">Actor Role</th>
                  <th className="py-2.5 px-3">Affiliation</th>
                  <th className="py-2.5 px-3">Patient Ledger</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{log.action}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Tx: #{log.id}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-650 font-mono text-[10px]">{log.actorRole}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{log.actorName} ({log.organization})</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{log.patientName || 'N/A'}</td>
                    <td className="py-3 px-3 text-slate-450 font-mono text-[10px]">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: CONSENTS LEDGER */}
      {/* =================================================================== */}
      {activeTab === 'admin-consents' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-medical-600" />
            <span>National Consent Record Registry Database</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-55">
                  <th className="py-2.5 px-3">Consent ID</th>
                  <th className="py-2.5 px-3">Citizen Health ID</th>
                  <th className="py-2.5 px-3">Requested Provider</th>
                  <th className="py-2.5 px-3">Requested Duration</th>
                  <th className="py-2.5 px-3">Expiry Limits</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consents.map(consent => (
                  <tr key={consent.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">#{consent.id}</td>
                    <td className="py-3 px-3 font-mono text-teal-800 font-semibold">{consent.patientId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-650">
                      {consent.providerName} <span className="text-[10px] text-slate-400 font-mono font-normal">({consent.providerRole})</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {consent.duration.startsWith('Till ') ? `Until ${consent.duration.replace('Till ', '')}` : consent.duration}
                    </td>
                    <td className="py-3 px-3 text-slate-450 font-mono text-[10px]">{consent.expiresAt || 'N/A'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(consent.status)}`}>
                        {consent.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 6: HOSPITALS REGISTER */}
      {/* =================================================================== */}
      {activeTab === 'admin-hospitals' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-medical-600" />
            <span>National ABDM Clinic & Hospital Registry</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-bold text-slate-900">Fortis National Heart Center</h4>
              <p className="text-slate-500">Cardiology Specialized Department • Bengaluru, KA</p>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 inline-block w-fit">ACTIVE NODE</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
              <h4 className="font-bold text-slate-900">Manipal Super Specialty Hospital</h4>
              <p className="text-slate-500">Pulmonology & General Clinical Center • Mumbai, MH</p>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 inline-block w-fit">ACTIVE NODE</span>
            </div>
          </div>
        </div>
      )}

      {/* CITIZEN DETAILED INSPECT MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-slate-200 text-slate-900 space-y-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900">Citizen Details: {selectedPatient.name}</h4>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-slate-500">Blood Group: <strong className="text-slate-800">{selectedPatient.bloodGroup}</strong></p>
                <p className="text-slate-500">DOB: <strong className="text-slate-800">{selectedPatient.dob}</strong></p>
                <p className="text-slate-500">Gender: <strong className="text-slate-800">{selectedPatient.gender}</strong></p>
                <p className="text-slate-500">Phone: <strong className="text-slate-800">{selectedPatient.phone}</strong></p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">Residential Address:</p>
                <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">{selectedPatient.address}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">Emergency Contact Contact:</p>
                <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship}) - <strong>{selectedPatient.emergencyContact.phone}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
