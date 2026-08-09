import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, User, 
  AlertCircle, CheckCircle2, Lock, ArrowRight, Key,
  Camera, Stethoscope, Pill, Upload, FileCheck, Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const RegisterPage: React.FC = () => {
  const { 
    registerPatient, registerDoctor, registerPharmacist, 
    patients, setActiveTab, setCurrentRole 
  } = useApp();

  // Registration Mode: PATIENT, DOCTOR, or PHARMACIST
  const [registerMode, setRegisterMode] = useState<'PATIENT' | 'DOCTOR' | 'PHARMACIST'>('PATIENT');

  const [step, setStep] = useState<'FORM' | 'OTP' | 'SUCCESS'>('FORM');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    dob: '1998-06-15',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    photo: '', // Mandatory patient photo
    aadhaarRef: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRel: 'Family',
    allergies: '',
    criticalConditions: ''
  });

  // Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: 'Cardiology',
    licenseNumber: '',
    degree: 'MBBS, MD',
    certificationName: '',
    hospital: '',
    phone: '',
    email: ''
  });

  // Pharmacist Form State
  const [pharmacistForm, setPharmacistForm] = useState({
    name: '',
    pharmacyName: '',
    licenseNumber: '',
    degree: 'B.Pharm',
    certificationName: '',
    address: '',
    phone: '',
    email: ''
  });

  // Simulated OTP state
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [createdHealthId, setCreatedHealthId] = useState<string | null>(null);

  // Photo Upload Handler for Patient
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset photo selection
  const presetPhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  ];

  // Submit Patient Form
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // MANDATORY PHOTO VALIDATION
    if (!formData.photo) {
      setErrorMessage('A Patient Photo is mandatory for generating a verified Universal Health ID. Please upload or select a clear photo.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.aadhaarRef) {
      setErrorMessage('Please fill in all mandatory identity fields.');
      return;
    }

    const phoneExists = patients.some(p => p.phone === formData.phone);
    const aadhaarExists = patients.some(p => p.maskedAadhaar.slice(-4) === formData.aadhaarRef.slice(-4));

    if (phoneExists || aadhaarExists) {
      setErrorMessage('A Health ID already exists for this citizen. Please recover or verify your existing Health ID.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep('OTP');
  };

  // Submit Doctor Form
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!doctorForm.name || !doctorForm.licenseNumber || !doctorForm.degree || !doctorForm.hospital) {
      setErrorMessage('Please fill in all required medical qualification and licensing fields.');
      return;
    }

    const certDocName = doctorForm.certificationName || `Degree_Cert_${doctorForm.licenseNumber.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

    const res = registerDoctor({
      name: doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`,
      specialty: doctorForm.specialty,
      licenseNumber: doctorForm.licenseNumber,
      degree: doctorForm.degree,
      certification: certDocName,
      hospital: doctorForm.hospital,
      phone: doctorForm.phone || '+91 98000 11122',
      email: doctorForm.email || `${doctorForm.name.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
    });

    if (res.success) {
      setSuccessMessage(res.message || 'Doctor application submitted successfully!');
      setStep('SUCCESS');
    }
  };

  // Submit Pharmacist Form
  const handlePharmacistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!pharmacistForm.pharmacyName || !pharmacistForm.licenseNumber || !pharmacistForm.degree) {
      setErrorMessage('Please fill in all required pharmacy licensing and qualification fields.');
      return;
    }

    const certDocName = pharmacistForm.certificationName || `Drug_License_${pharmacistForm.licenseNumber.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

    const res = registerPharmacist({
      name: pharmacistForm.name || pharmacistForm.pharmacyName,
      pharmacyName: pharmacistForm.pharmacyName,
      licenseNumber: pharmacistForm.licenseNumber,
      degree: pharmacistForm.degree,
      certification: certDocName,
      address: pharmacistForm.address || 'Central Market Complex, New Delhi',
      phone: pharmacistForm.phone || '+91 80 4000 1122',
      email: pharmacistForm.email || `pharmacy@onestop.in`
    });

    if (res.success) {
      setSuccessMessage(res.message || 'Pharmacy application submitted successfully!');
      setStep('SUCCESS');
    }
  };

  // Verify Patient OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '123456') {
      setErrorMessage(`Invalid OTP code. Demo code: ${generatedOtp}`);
      return;
    }

    setErrorMessage(null);

    const result = registerPatient({
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address: formData.address || 'Civil Lines, New Delhi, DL 110054',
      bloodGroup: formData.bloodGroup,
      photo: formData.photo,
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone || formData.phone
      },
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : ['None Reported'],
      criticalConditions: formData.criticalConditions ? formData.criticalConditions.split(',').map(s => s.trim()) : ['None'],
      maskedAadhaar: `XXXX-XXXX-${formData.aadhaarRef.slice(-4)}`
    });

    if (result.success && result.healthId) {
      setCreatedHealthId(result.healthId);
      setStep('SUCCESS');
    } else if (result.error) {
      setErrorMessage(result.error);
      setStep('FORM');
    }
  };

  const newPatient = patients.find(p => p.healthId === createdHealthId) || patients[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">National Healthcare Registration Portal</h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Register for a lifetime digital Health ID or apply as a verified Doctor or Pharmacist.
        </p>
      </div>

      {/* REGISTRATION ROLE SELECTOR TABS */}
      {step === 'FORM' && (
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200/80 flex items-center gap-1 text-xs font-bold max-w-xl w-full">
            <button
              onClick={() => { setRegisterMode('PATIENT'); setErrorMessage(null); }}
              className={`flex-1 py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                registerMode === 'PATIENT'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient / Citizen</span>
            </button>

            <button
              onClick={() => { setRegisterMode('DOCTOR'); setErrorMessage(null); }}
              className={`flex-1 py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                registerMode === 'DOCTOR'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => { setRegisterMode('PHARMACIST'); setErrorMessage(null); }}
              className={`flex-1 py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                registerMode === 'PHARMACIST'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Pharmacist</span>
            </button>
          </div>
        </div>
      )}

      {/* ERROR ALERT BANNER */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 shadow-xs animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs uppercase tracking-wider">Validation Alert</h4>
            <p className="text-xs font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* ==================== 1. PATIENT REGISTRATION FORM ==================== */}
      {step === 'FORM' && registerMode === 'PATIENT' && (
        <form onSubmit={handlePatientSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900">1. Citizen Identity & Mandatory Photo</h3>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
              STEP 1 OF 2
            </span>
          </div>

          {/* MANDATORY PATIENT PHOTO SECTION */}
          <div className="p-4 bg-teal-50/60 border-2 border-dashed border-teal-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>Citizen Photograph * (MANDATORY FOR VERIFIED HEALTH ID)</span>
              </label>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                REQUIRED
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Patient Preview" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-full text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>

                  <span className="text-xs text-slate-400 font-medium">or choose demo avatar:</span>
                </div>

                <div className="flex items-center gap-2">
                  {presetPhotos.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setFormData(prev => ({ ...prev, photo: url })); setErrorMessage(null); }}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        formData.photo === url ? 'border-teal-600 scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (For OTP Verification) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
              <input 
                type="date" 
                required
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group *</label>
              <select 
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-bold text-teal-700"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Reference / Token (Last 4 Digits) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  maxLength={4}
                  required
                  value={formData.aadhaarRef}
                  onChange={e => setFormData({ ...formData, aadhaarRef: e.target.value })}
                  placeholder="e.g. 5892"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Full Aadhaar is tokenized for privacy protection.</p>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">2. Medical & Emergency Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Name & Phone</label>
                <input 
                  type="text" 
                  value={formData.emergencyName}
                  onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="e.g. Sunita Verma (+91 98765 44332)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies (Comma Separated)</label>
                <input 
                  type="text" 
                  value={formData.allergies}
                  onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Peanuts"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <span>PROCEED TO OTP VERIFICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* ==================== 2. DOCTOR REGISTRATION FORM ==================== */}
      {step === 'FORM' && registerMode === 'DOCTOR' && (
        <form onSubmit={handleDoctorSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <span>Medical Practitioner & Doctor Registration</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              REQUIRES ADMIN APPROVAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name *</label>
              <input 
                type="text" 
                required
                value={doctorForm.name}
                onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                placeholder="e.g. Dr. Rajesh Mehta"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medical Council License Number *</label>
              <input 
                type="text" 
                required
                value={doctorForm.licenseNumber}
                onChange={e => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                placeholder="e.g. MCI-2026-99182"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty *</label>
              <select
                value={doctorForm.specialty}
                onChange={e => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine & Pulmonology">General Medicine & Pulmonology</option>
                <option value="Orthopedics & Sports Surgery">Orthopedics & Sports Surgery</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Hospital / Clinic *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  required
                  value={doctorForm.hospital}
                  onChange={e => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                  placeholder="e.g. Fortis National Heart Center"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Medical Degree & Qualifications *</label>
              <input 
                type="text" 
                required
                value={doctorForm.degree}
                onChange={e => setDoctorForm({ ...doctorForm, degree: e.target.value })}
                placeholder="e.g. MBBS, MD (Cardiology), FACC"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-teal-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Degree & Certificate Document *</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={doctorForm.certificationName}
                  onChange={e => setDoctorForm({ ...doctorForm, certificationName: e.target.value })}
                  placeholder="e.g. MBBS_Certificate_MCI.pdf"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-teal-500"
                />
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-200 flex items-center gap-1 shrink-0">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Attach</span>
                  <input type="file" onChange={(e) => {
                    if (e.target.files?.[0]) setDoctorForm({ ...doctorForm, certificationName: e.target.files[0].name });
                  }} className="hidden" />
                </label>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>SUBMIT DOCTOR APPLICATION FOR APPROVAL</span>
            </button>
          </div>

        </form>
      )}

      {/* ==================== 3. PHARMACIST REGISTRATION FORM ==================== */}
      {step === 'FORM' && registerMode === 'PHARMACIST' && (
        <form onSubmit={handlePharmacistSubmit} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-6">
          
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>Pharmacy & Licensed Dispensary Registration</span>
            </h3>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
              DRUG LICENSE VERIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Enterprise Name *</label>
              <input 
                type="text" 
                required
                value={pharmacistForm.pharmacyName}
                onChange={e => setPharmacistForm({ ...pharmacistForm, pharmacyName: e.target.value })}
                placeholder="e.g. Apollo Care Pharmacy #108"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State Drug License Number *</label>
              <input 
                type="text" 
                required
                value={pharmacistForm.licenseNumber}
                onChange={e => setPharmacistForm({ ...pharmacistForm, licenseNumber: e.target.value })}
                placeholder="e.g. KA-DRUG-99812"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacist Qualification / Degree *</label>
              <input 
                type="text" 
                required
                value={pharmacistForm.degree}
                onChange={e => setPharmacistForm({ ...pharmacistForm, degree: e.target.value })}
                placeholder="e.g. B.Pharm, Registered Pharmacist"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-teal-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Council Certification *</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={pharmacistForm.certificationName}
                  onChange={e => setPharmacistForm({ ...pharmacistForm, certificationName: e.target.value })}
                  placeholder="e.g. Drug_License_Cert.pdf"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-teal-500"
                />
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-200 flex items-center gap-1 shrink-0">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Attach</span>
                  <input type="file" onChange={(e) => {
                    if (e.target.files?.[0]) setPharmacistForm({ ...pharmacistForm, certificationName: e.target.files[0].name });
                  }} className="hidden" />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Physical Address *</label>
              <input 
                type="text" 
                required
                value={pharmacistForm.address}
                onChange={e => setPharmacistForm({ ...pharmacistForm, address: e.target.value })}
                placeholder="e.g. 100ft Road, Indiranagar, Bengaluru, KA 560038"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>SUBMIT PHARMACY APPLICATION FOR APPROVAL</span>
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: PATIENT OTP VERIFICATION */}
      {step === 'OTP' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl max-w-md mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <Key className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-extrabold text-xl text-slate-900">Mobile OTP Verification</h3>
            <p className="text-xs text-slate-500 mt-1">
              Sent 6-digit authentication code to <strong className="text-slate-800">{formData.phone}</strong>.
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-xs text-teal-900 font-mono">
            <strong>HACKATHON DEMO OTP:</strong> <span className="text-base font-bold text-teal-700 ml-1">{generatedOtp}</span>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input 
              type="text" 
              maxLength={6}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 text-center text-xl font-mono font-bold tracking-widest text-slate-900 focus:border-teal-500 focus:outline-none"
            />

            <button 
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>VERIFY OTP & GENERATE HEALTH ID</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: SUCCESS & HEALTH CARD DISPLAY */}
      {step === 'SUCCESS' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-8 animate-fadeIn">
          
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {registerMode === 'PATIENT' ? 'Universal Health ID Created Successfully!' : 'Application Submitted Successfully!'}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {successMessage || `Welcome, ${newPatient.name}. Your Health ID photo and identity parameters are securely activated.`}
            </p>
          </div>

          {/* Generated Health Card for Patient */}
          {registerMode === 'PATIENT' && newPatient && (
            <div className="max-w-md mx-auto">
              <HealthCard 
                patient={newPatient} 
                onVerifyClick={() => setActiveTab('verify-id')}
              />
            </div>
          )}

          <div className="pt-4 flex justify-center gap-4">
            <button 
              onClick={() => {
                if (registerMode === 'PATIENT') {
                  setCurrentRole('PATIENT');
                  setActiveTab('dashboard');
                } else if (registerMode === 'DOCTOR') {
                  setCurrentRole('ADMIN');
                  setActiveTab('dashboard');
                } else {
                  setCurrentRole('PHARMACIST');
                  setActiveTab('dashboard');
                }
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md flex items-center gap-2"
            >
              <span>
                {registerMode === 'PATIENT' ? 'GO TO MY PATIENT DASHBOARD' : registerMode === 'DOCTOR' ? 'VIEW IN ADMIN VERIFICATION QUEUE' : 'GO TO PHARMACY PORTAL'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
