import React, { useState } from 'react';
import { 
  Calendar, Check, X, ShieldAlert, FileText, Stethoscope, PlusCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AppointmentsManager: React.FC = () => {
  const { 
    currentRole, currentPatient, currentDoctor, doctors, 
    appointments, bookAppointment, updateAppointmentStatus 
  } = useApp();

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDoctorId);
    if (!doc) return;

    const res = bookAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientHealthId: currentPatient.healthId,
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      hospital: doc.hospital,
      date,
      time,
      reason
    });

    if (res.success) {
      setSuccessMsg(`Appointment request submitted to ${doc.name} successfully.`);
      setReason('');
      setTimeout(() => setSuccessMsg(null), 5000);
    }
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

  // 1. PATIENT VIEW
  if (currentRole === 'PATIENT') {
    const myApts = appointments.filter(a => a.patientId === currentPatient.id);

    return (
      <div className="space-y-6 animate-fadeUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Consultation Appointments</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Book new consultations or check your verification status.</p>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center gap-2 text-xs font-semibold shadow-2xs">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form Card */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 h-fit">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PlusCircle className="w-4.5 h-4.5 text-medical-600" />
              <span>Book Consultation</span>
            </h3>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Select Doctor *</label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-semibold text-slate-800"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty}) - {d.hospital}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Preferred Time *</label>
                  <select
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:15 PM">03:15 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Reason for Visit / Symptoms *</label>
                <textarea
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Cough, wheezing, or cardiovascular checkup follow-up..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
              >
                Submit Booking Request
              </button>
            </form>
          </div>

          {/* Bookings List Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-medical-600" />
              <span>Your Appointment Ledger</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Practitioner</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myApts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No scheduled appointments.</td>
                    </tr>
                  ) : (
                    myApts.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{apt.doctorName}</p>
                          <p className="text-[10px] text-slate-500">{apt.specialty} • {apt.hospital}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-700">{apt.date}</p>
                          <p className="text-[10px] text-slate-450 font-mono">{apt.time}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{apt.reason}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(apt.status)}`}>
                            {apt.status}
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
      </div>
    );
  }

  // 2. DOCTOR VIEW
  if (currentRole === 'DOCTOR') {
    const myApts = appointments.filter(a => a.doctorId === currentDoctor.id);
    const pendingApts = myApts.filter(a => a.status === 'PENDING');
    const confirmedApts = myApts.filter(a => a.status === 'CONFIRMED');

    return (
      <div className="space-y-6 animate-fadeUp">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Consultations</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage incoming appointment requests and confirm schedules.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Requests Column */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4 h-fit">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600" />
              <span>Incoming Requests ({pendingApts.length})</span>
            </h3>

            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {pendingApts.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-6">No pending patient requests.</p>
              ) : (
                pendingApts.map(apt => (
                  <div key={apt.id} className="bg-slate-50/50 border border-slate-200/60 p-4 rounded-xl space-y-3 text-xs animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{apt.patientName}</span>
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[8px] font-bold px-2 py-0.5 rounded-full">
                          PENDING
                        </span>
                      </div>
                      <code className="text-[10px] text-slate-500 font-mono block mt-0.5">ID: {apt.patientHealthId}</code>
                    </div>

                    <div className="space-y-1 text-slate-600 border-t border-slate-150/40 pt-2">
                      <p className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-450" />
                        <span>{apt.date} at {apt.time}</span>
                      </p>
                      <p className="text-slate-500 text-[11px] leading-relaxed italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                        "{apt.reason}"
                      </p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'CONFIRMED')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'REJECTED')}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Confirmed Schedule Column */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Stethoscope className="w-4.5 h-4.5 text-medical-600" />
              <span>Confirmed Consultations Ledger</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Patient Particulars</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Reason for Visit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {confirmedApts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No confirmed consultations today.</td>
                    </tr>
                  ) : (
                    confirmedApts.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{apt.patientName}</p>
                          <code className="text-[10px] text-slate-550 font-mono">{apt.patientHealthId}</code>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          <p>{apt.date}</p>
                          <p className="text-[10px] text-slate-450 font-mono font-medium">{apt.time}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-555 max-w-xs truncate italic">"{apt.reason}"</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/60 px-2 py-0.5 rounded-full text-[9px] font-bold">
                            CONFIRMED
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
      </div>
    );
  }

  return null;
};
