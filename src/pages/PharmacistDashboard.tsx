import React, { useState } from 'react';
import { 
  Pill, Search, CheckCircle2, 
  Check, Lock, ShieldCheck, ShieldAlert,
  Building, BookOpen, Clock, Activity, FileText, Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PharmacistDashboard: React.FC = () => {
  const { 
    currentPharmacist, prescriptions, searchPatientByHealthId, dispensePrescription, 
    requestDoctorAccess, consents, activeTab 
  } = useApp();

  if (currentPharmacist.verificationStatus !== 'VERIFIED') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft text-center py-16 space-y-4 max-w-lg mx-auto mt-10 animate-fadeUp">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Pharmacy Verification Required</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your pharmacy dispensing workspace is currently locked. Your drug license verification request (**Drug License: {currentPharmacist.licenseNumber}**) is pending review by the Ministry of Digital Health administrators.
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-655">
          <p className="font-bold text-slate-850">Pharmacy Details Submitted:</p>
          <p>• Enterprise: <span className="font-semibold text-slate-700">{currentPharmacist.pharmacyName}</span></p>
          <p>• Registered Pharmacist: <span className="font-semibold text-slate-700">{currentPharmacist.name}</span></p>
          <p>• Location: <span className="font-semibold text-slate-700">{currentPharmacist.address}</span></p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold">Please switch to the **ADMIN** role in the top switcher bar to approve this credential.</p>
      </div>
    );
  }

  const [searchHealthId, setSearchHealthId] = useState('OSH-IND-100234');
  const [searchedPatient, setSearchedPatient] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [dispenseStatusMsg, setDispenseStatusMsg] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<Record<string, Record<string, string>>>({});

  // New Consent Request States
  const [requestHealthId, setRequestHealthId] = useState('');
  const [durationMode, setDurationMode] = useState<'preset' | 'date'>('preset');
  const [presetDuration, setPresetDuration] = useState('1h');
  const [tillDate, setTillDate] = useState(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispenseStatusMsg(null);
    setSearchError(null);
    const pat = searchPatientByHealthId(searchHealthId);
    if (!pat) {
      setSearchError('Patient not found or invalid Health ID.');
      setSearchedPatient(null);
    } else {
      setSearchedPatient(pat);
    }
  };

  const handleDispense = (prescriptionId: string) => {
    const rxSubs = substitutions[prescriptionId] || {};
    const cleanSubs: Record<string, string> = {};
    Object.entries(rxSubs).forEach(([k, v]) => {
      if (v.trim()) {
        cleanSubs[k] = v.trim();
      }
    });
    const res = dispensePrescription(prescriptionId, cleanSubs);
    setDispenseStatusMsg(res.message);
  };

  const handleCreateRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestHealthId) return;
    const finalDuration = durationMode === 'date' ? `Till ${tillDate}` : presetDuration;
    const res = requestDoctorAccess(requestHealthId, finalDuration);
    setDispenseStatusMsg(res.message);
    setRequestHealthId('');
  };

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

  // Active prescriptions for searched patient
  const patientPrescriptions = searchedPatient 
    ? prescriptions.filter(p => p.patientId === searchedPatient.id)
    : prescriptions;

  const myFulfillmentCount = prescriptions.filter(
    p => p.dispensed && p.dispensedBy === currentPharmacist.pharmacyName
  ).length;

  const activePrescriptionsInNetwork = prescriptions.filter(p => !p.dispensed);

  const myConsents = consents.filter(c => c.providerId === currentPharmacist.id);

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* PHARMACIST PROFILE HEADER */}
      <div className="bg-gradient-to-br from-medical-900 via-medical-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/25 border border-teal-300/30 flex items-center justify-center text-teal-200 shadow-md shrink-0">
            <Pill className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{currentPharmacist.pharmacyName}</h1>
              <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                VERIFIED PHARMACY
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-1 font-medium">
              Pharmacist License: {currentPharmacist.licenseNumber} • {currentPharmacist.address}
            </p>
          </div>
        </div>
      </div>

      {/* Global Status/Success Alert banner */}
      {dispenseStatusMsg && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>{dispenseStatusMsg}</span>
          </div>
          <button onClick={() => setDispenseStatusMsg(null)} className="text-teal-705 hover:underline">Dismiss</button>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW A: PHARMACY DASHBOARD OVERVIEW */}
      {/* =================================================================== */}
      {(activeTab === 'pharmacy-dashboard' || !activeTab) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Metrics & Quick Shortcuts */}
          <div className="space-y-6 lg:col-span-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-soft">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Fulfillments</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{myFulfillmentCount} Dispensed</span>
              </div>
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-soft">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Pending Rx</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{activePrescriptionsInNetwork.length} In Queue</span>
              </div>
            </div>

            {/* Compliance guidelines */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <BookOpen className="w-4 h-4 text-medical-600" />
                <span>Verification Checklist</span>
              </h3>
              <ul className="space-y-2 text-slate-550 list-disc pl-4 leading-relaxed">
                <li>Verify citizen Health ID QR code before dispensing drugs.</li>
                <li>Ensure digital signatures exist on the prescription record.</li>
                <li>Check active allergy contraindications before fulfilling antibiotics.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Recent Activity Log */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-4.5 h-4.5 text-medical-600" />
                <span>Your Recent Dispensing History</span>
              </h3>

              <div className="space-y-3.5 divide-y divide-slate-100">
                {prescriptions.filter(p => p.dispensed && p.dispensedBy === currentPharmacist.pharmacyName).length === 0 ? (
                  <p className="text-slate-400 text-xs italic text-center py-4">No recent dispensings recorded from this pharmacy.</p>
                ) : (
                  prescriptions.filter(p => p.dispensed && p.dispensedBy === currentPharmacist.pharmacyName).map((rx) => (
                    <div key={rx.id} className="pt-3.5 first:pt-0 text-xs flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Dispensed Rx #{rx.id}</span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/60 text-[8px] font-bold px-2 py-0.5 rounded-full">
                            COMPLETED
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Patient: <strong>{rx.patientName}</strong> ({rx.patientHealthId}) • Medicines: {rx.medicines.map(m => m.name).join(', ')}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-450 font-mono text-right shrink-0 mt-0.5">{rx.dispensedAt?.slice(0, 10)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW B: DISPENSE MEDICINE PAGE */}
      {/* =================================================================== */}
      {activeTab === 'pharmacy-dispense' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Search & Shortcuts */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-medical-600" />
                <span>Fetch Prescription</span>
              </h3>

              <form onSubmit={handleSearch} className="space-y-3">
                <input 
                  type="text" 
                  value={searchHealthId}
                  onChange={e => setSearchHealthId(e.target.value)}
                  placeholder="Enter Patient Health ID (e.g. OSH-IND-100234)"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  Fetch Prescriptions
                </button>

                {searchError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2.5 rounded-xl text-[11px] font-bold text-center animate-fadeIn">
                    ⚠️ {searchError}
                  </div>
                )}
              </form>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Demo Shortcuts</h3>
              <div className="flex flex-col gap-2 text-xs">
                <button 
                  onClick={() => { setSearchHealthId('OSH-IND-100234'); const pat = searchPatientByHealthId('OSH-IND-100234'); setSearchedPatient(pat); }}
                  className="text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-100 font-mono text-teal-700 font-bold"
                >
                  Load Aarav Sharma (OSH-IND-100234)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Prescriptions Ledger */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Fulfillment prescription records</h3>

            {patientPrescriptions.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500 text-xs">
                No active or matching prescriptions found. Search a Health ID to load prescriptions.
              </div>
            ) : (
              patientPrescriptions.map(rx => (
                <div key={rx.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 animate-fadeUp">
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-105 pb-3">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        Rx ID: #{rx.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2">Patient: {rx.patientName} <code className="text-xs text-slate-550">({rx.patientHealthId})</code></h4>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-semibold text-slate-650 block">Prescribed by {rx.doctorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{rx.date}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2.5 text-xs">
                    {rx.medicines.map((m, idx) => {
                      const isSubstituted = !!substitutions[rx.id]?.[m.name];
                      const subValue = substitutions[rx.id]?.[m.name] || '';

                      return (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-100 font-medium">
                          <div>
                            <span className="font-bold text-slate-900">{m.name} <span className="text-slate-450 font-normal">({m.dosage})</span></span>
                            <span className="text-teal-800 font-mono text-[11px] block md:inline md:ml-2">{m.frequency} • {m.duration}</span>
                            {rx.dispensed && rx.substitutions?.[m.name] && (
                              <p className="text-[10px] text-teal-700 font-semibold mt-1 bg-teal-50 px-2 py-0.5 rounded border border-teal-150 w-fit">
                                💊 Substituted with: {rx.substitutions[m.name]}
                              </p>
                            )}
                          </div>

                          {!rx.dispensed && (
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-500 font-bold select-none">
                                <input 
                                  type="checkbox"
                                  checked={isSubstituted}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSubstitutions(prev => ({
                                      ...prev,
                                      [rx.id]: {
                                        ...(prev[rx.id] || {}),
                                        [m.name]: checked ? (prev[rx.id]?.[m.name] || m.name) : ''
                                      }
                                    }));
                                  }}
                                  className="rounded text-teal-605 focus:ring-teal-500 w-3.5 h-3.5"
                                />
                                <span>Substitute (Out of Stock)</span>
                              </label>
                              
                              {isSubstituted && (
                                <input 
                                  type="text"
                                  value={subValue}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setSubstitutions(prev => ({
                                      ...prev,
                                      [rx.id]: {
                                        ...(prev[rx.id] || {}),
                                        [m.name]: val
                                      }
                                    }));
                                  }}
                                  placeholder="Substitute Drug Given"
                                  className="bg-slate-55 border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none w-44 font-semibold text-slate-800 focus:border-teal-500 focus:bg-white"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    {rx.dispensed ? (
                      <span className="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200 text-xs shadow-2xs">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Dispensed by {rx.dispensedBy} ({rx.dispensedAt?.slice(0, 10)})</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleDispense(rx.id)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98] text-xs"
                      >
                        <Pill className="w-4 h-4 text-teal-200" />
                        <span>DISPENSE DRUGS</span>
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW C: ACCESS REQUESTS LEDGER */}
      {/* =================================================================== */}
      {activeTab === 'pharmacy-access-requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeUp">
          
          {/* Left panel: Send Access Request Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 h-fit">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-medical-600" />
                <span>Request Patient Consent</span>
              </h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Request secure consent to verify medication histories.</p>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-455 font-bold block uppercase font-mono">Patient Health ID *</label>
                <input 
                  type="text" required
                  value={requestHealthId}
                  onChange={e => setRequestHealthId(e.target.value)}
                  placeholder="e.g. OSH-IND-100234"
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              {/* Duration Type selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Consent Expiry Type *</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setDurationMode('preset')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      durationMode === 'preset'
                        ? 'bg-medical-600 text-white border-medical-500'
                        : 'bg-slate-55 text-slate-600 border-slate-200'
                    }`}
                  >
                    Preset Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('date')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      durationMode === 'date'
                        ? 'bg-medical-600 text-white border-medical-500'
                        : 'bg-slate-55 text-slate-600 border-slate-200'
                    }`}
                  >
                    Till Date (Calendar)
                  </button>
                </div>
              </div>

              {/* Duration parameters inputs */}
              {durationMode === 'preset' ? (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Preset Duration Limit *</label>
                  <select
                    value={presetDuration}
                    onChange={e => setPresetDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-semibold"
                  >
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold block uppercase font-mono">Authorized Till Date *</label>
                  <input
                    type="date"
                    required
                    value={tillDate}
                    onChange={e => setTillDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2 rounded-xl text-xs shadow-xs"
              >
                Send Request
              </button>
            </form>
          </div>

          {/* Right panel: Access Requests Log */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 font-semibold">Your Sent Consent Requests</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Patient ID</th>
                    <th className="py-2.5 px-3">Request Date</th>
                    <th className="py-2.5 px-3">Duration Limit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myConsents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No access request logs found.</td>
                    </tr>
                  ) : (
                    myConsents.map((consent) => (
                      <tr key={consent.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{consent.patientId}</td>
                        <td className="py-3 px-3 text-slate-550">{new Date(consent.requestDate).toLocaleDateString()}</td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {consent.duration.startsWith('Till ') ? `Until ${consent.duration.replace('Till ', '')}` : consent.duration}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(consent.status)}`}>
                            {consent.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
