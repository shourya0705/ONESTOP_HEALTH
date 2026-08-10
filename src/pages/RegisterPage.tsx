import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, User, 
  AlertCircle, CheckCircle2, Lock, ArrowRight, Key,
  Camera, Stethoscope, Pill, Upload, FileCheck, HeartPulse
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HealthCard } from '../components/HealthCard';

export const RegisterPage: React.FC = () => {
  const { 
    registerPatient, registerDoctor, registerPharmacist, 
    patients, setActiveTab, setCurrentRole 
  } = useApp();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [registerMode, setRegisterMode] = useState<'PATIENT' | 'DOCTOR' | 'PHARMACIST'>('PATIENT');

  const [step, setStep] = useState<'FORM' | 'OTP' | 'SUCCESS'>('FORM');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Form state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    dob: '1998-06-15',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'O+',
    photo: '', 
    aadhaarRef: '', 
    emergencyName: '',
    emergencyPhone: '',
    emergencyRel: 'Family',
    allergies: '',
    criticalConditions: '',
    password: ''
  });

  // Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: 'Cardiology',
    licenseNumber: '',
    certificationName: '',
    hospital: '',
    phone: '',
    email: '',
    photo: '',
    aadhaar: '',
    password: ''
  });

  // Doctor Multiple Degrees State
  const [doctorDegrees, setDoctorDegrees] = useState<string[]>(['MBBS', 'MD']);
  const [newDocDegree, setNewDocDegree] = useState('');

  // Pharmacist Form State
  const [pharmacistForm, setPharmacistForm] = useState({
    name: '',
    pharmacyName: '',
    licenseNumber: '',
    certificationName: '',
    address: '',
    phone: '',
    email: '',
    photo: '',
    aadhaar: '',
    password: ''
  });

  // Pharmacist Multiple Degrees State
  const [pharmacistDegrees, setPharmacistDegrees] = useState<string[]>(['B.Pharm']);
  const [newPharmDegree, setNewPharmDegree] = useState('');

  // Simulated OTP state
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [createdHealthId, setCreatedHealthId] = useState<string | null>(null);

  // Photo Upload Handlers
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

  const handleDoctorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctorForm(prev => ({ ...prev, photo: reader.result as string }));
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePharmacistPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPharmacistForm(prev => ({ ...prev, photo: reader.result as string }));
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add/Remove Doctor Degree
  const handleAddDocDegree = () => {
    if (newDocDegree.trim() && !doctorDegrees.includes(newDocDegree.trim())) {
      setDoctorDegrees([...doctorDegrees, newDocDegree.trim()]);
      setNewDocDegree('');
    }
  };

  const handleRemoveDocDegree = (deg: string) => {
    setDoctorDegrees(doctorDegrees.filter(d => d !== deg));
  };

  // Add/Remove Pharmacist Degree
  const handleAddPharmDegree = () => {
    if (newPharmDegree.trim() && !pharmacistDegrees.includes(newPharmDegree.trim())) {
      setPharmacistDegrees([...pharmacistDegrees, newPharmDegree.trim()]);
      setNewPharmDegree('');
    }
  };

  const handleRemovePharmDegree = (deg: string) => {
    setPharmacistDegrees(pharmacistDegrees.filter(d => d !== deg));
  };

  // Preset photos
  const presetPhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  ];

  const presetDoctorPhotos = [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1594824813566-88855ce7890f?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
  ];

  const presetPharmacistPhotos = [
    'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'
  ];

  // Submit Login Form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginMobile) {
      setErrorMessage('Please enter your registered mobile number.');
      return;
    }

    // Direct mock validation & login routing
    if (loginMobile.includes('98765 43210') || loginMobile === '9876543210') {
      setCurrentRole('PATIENT');
      setActiveTab('dashboard');
    } else if (loginMobile.includes('98222 11100') || loginMobile === '9822211100') {
      setCurrentRole('DOCTOR');
      setActiveTab('doctor-dashboard');
    } else if (loginMobile.includes('80 2559 8800') || loginMobile === '8025598800') {
      setCurrentRole('PHARMACIST');
      setActiveTab('pharmacy-dashboard');
    } else if (loginMobile.includes('admin') || loginMobile === '9999999999' || loginMobile === '9999999999') {
      setCurrentRole('ADMIN');
      setActiveTab('admin-dashboard');
    } else {
      // General fallbacks
      setCurrentRole('PATIENT');
      setActiveTab('dashboard');
    }
  };

  // Auto fill credentials handler
  const handleAutoFill = (role: 'PATIENT' | 'DOCTOR' | 'PHARMACIST' | 'ADMIN') => {
    setErrorMessage(null);
    if (role === 'PATIENT') {
      setLoginMobile('9876543210');
      setLoginPassword('demo123');
    } else if (role === 'DOCTOR') {
      setLoginMobile('9822211100');
      setLoginPassword('demo123');
    } else if (role === 'PHARMACIST') {
      setLoginMobile('8025598800');
      setLoginPassword('demo123');
    } else if (role === 'ADMIN') {
      setLoginMobile('9999999999');
      setLoginPassword('demo123');
    }
  };

  // Submit Patient Form
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.photo) {
      setErrorMessage('A Patient Photo is mandatory for generating a verified Universal Health ID. Please upload or select a photo.');
      return;
    }

    if (formData.phone.length !== 10) {
      setErrorMessage('Patient mobile number must be exactly 10 digits.');
      return;
    }

    if (formData.aadhaarRef.length !== 12) {
      setErrorMessage('Patient Aadhaar Card number must be exactly 12 digits.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.aadhaarRef) {
      setErrorMessage('Please fill in all mandatory identity fields.');
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

    if (!doctorForm.photo) {
      setErrorMessage('A Doctor Photograph is mandatory for registration.');
      return;
    }

    if (doctorForm.phone.length !== 10) {
      setErrorMessage('Doctor mobile number must be exactly 10 digits.');
      return;
    }

    if (doctorForm.aadhaar.length !== 12) {
      setErrorMessage('Doctor Aadhaar Card number must be exactly 12 digits.');
      return;
    }

    if (doctorDegrees.length === 0) {
      setErrorMessage('At least one Degree / Qualification is mandatory.');
      return;
    }

    if (!doctorForm.name || !doctorForm.licenseNumber || !doctorForm.hospital || !doctorForm.phone || !doctorForm.aadhaar) {
      setErrorMessage('Please fill in all required medical qualification, Aadhaar, phone, and licensing fields.');
      return;
    }

    const certDocName = doctorForm.certificationName || `Degree_Cert_${doctorForm.licenseNumber.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

    const res = registerDoctor({
      name: doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`,
      specialty: doctorForm.specialty,
      licenseNumber: doctorForm.licenseNumber,
      degree: doctorDegrees.join(', '),
      certification: certDocName,
      hospital: doctorForm.hospital,
      phone: doctorForm.phone,
      email: doctorForm.email || `${doctorForm.name.toLowerCase().replace(/[^a-z]/g, '')}@hospital.org`,
      avatarUrl: doctorForm.photo,
      password: doctorForm.password
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

    if (!pharmacistForm.photo) {
      setErrorMessage('A Pharmacist Photograph is mandatory for registration.');
      return;
    }

    if (pharmacistForm.phone.length !== 10) {
      setErrorMessage('Pharmacist mobile number must be exactly 10 digits.');
      return;
    }

    if (pharmacistForm.aadhaar.length !== 12) {
      setErrorMessage('Pharmacist Aadhaar Card number must be exactly 12 digits.');
      return;
    }

    if (pharmacistDegrees.length === 0) {
      setErrorMessage('At least one Degree / Qualification is mandatory.');
      return;
    }

    if (!pharmacistForm.name || !pharmacistForm.pharmacyName || !pharmacistForm.licenseNumber || !pharmacistForm.phone || !pharmacistForm.aadhaar) {
      setErrorMessage('Please fill in all required pharmacist name, Aadhaar, pharmacy name, phone, and licensing fields.');
      return;
    }

    const certDocName = pharmacistForm.certificationName || `Drug_License_${pharmacistForm.licenseNumber.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

    const res = registerPharmacist({
      name: pharmacistForm.name,
      pharmacyName: pharmacistForm.pharmacyName,
      licenseNumber: pharmacistForm.licenseNumber,
      degree: pharmacistDegrees.join(', '),
      certification: certDocName,
      address: pharmacistForm.address || 'MG Road Metro Station Complex, Bengaluru',
      phone: pharmacistForm.phone,
      email: pharmacistForm.email || `pharmacy@onestop.in`,
      photo: pharmacistForm.photo,
      password: pharmacistForm.password
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
      address: formData.address || 'Indiranagar, Bengaluru, KA 560038',
      bloodGroup: formData.bloodGroup,
      photo: formData.photo,
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone || formData.phone
      },
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : ['None Reported'],
      criticalConditions: formData.criticalConditions ? formData.criticalConditions.split(',').map(s => s.trim()) : ['None'],
      maskedAadhaar: `XXXX-XXXX-${formData.aadhaarRef.slice(-4)}`,
      password: formData.password
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
    <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center hero-gradient text-white">
      
      {/* Centered White Card wrapper */}
      <div className="bg-white rounded-3xl p-8 shadow-elevated border border-slate-200/80 w-full max-w-xl text-slate-900 animate-fadeUp">
        
        {/* Card Header with unified HeartPulse icon logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-medical-600 to-teal-50 flex items-center justify-center text-white mx-auto shadow-md">
            <HeartPulse className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {isLogin ? 'Sign In to Portal' : 'National Health ID Registry'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isLogin 
              ? 'Access your unified patient timeline, doctor cockpit or pharmacy dispenser.' 
              : 'Register for a dynamic Health ID or apply as verified practitioner.'
            }
          </p>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 shadow-xs mb-5 animate-pulse">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs uppercase tracking-wider">Validation Alert</h4>
              <p className="text-xs font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* A. LOGIN PORTAL CARD CONTENT */}
        {/* ======================================================== */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Registered Mobile Number / User ID (10 digits)</label>
              <div className="relative">
                <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  required
                  maxLength={10}
                  value={loginMobile}
                  onChange={e => setLoginMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Security Access PIN / Password</label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-medical-700 hover:bg-medical-800 text-white font-bold py-3.5 rounded-xl text-xs tracking-wide shadow-md transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              <span>SIGN IN TO MY WORKSPACE</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            {/* Switch to Register link */}
            <div className="text-center pt-3 text-xs text-slate-500 font-medium">
              Don't have a verified Health ID?{' '}
              <button 
                type="button" 
                onClick={() => { setIsLogin(false); setStep('FORM'); setErrorMessage(null); }}
                className="text-medical-600 hover:underline font-bold"
              >
                Register here
              </button>
            </div>

          </form>
        ) : (
          /* ======================================================== */
          /* B. REGISTRATION PORTAL CARD CONTENT */
          /* ======================================================== */
          <div className="space-y-6">
            
            {/* 3-Tab Registration switcher */}
            {step === 'FORM' && (
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex gap-1 text-xs font-bold w-full">
                <button
                  onClick={() => { setRegisterMode('PATIENT'); setErrorMessage(null); }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    registerMode === 'PATIENT' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Citizen</span>
                </button>

                <button
                  onClick={() => { setRegisterMode('DOCTOR'); setErrorMessage(null); }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    registerMode === 'DOCTOR' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Doctor</span>
                </button>

                <button
                  onClick={() => { setRegisterMode('PHARMACIST'); setErrorMessage(null); }}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    registerMode === 'PHARMACIST' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>Pharmacist</span>
                </button>
              </div>
            )}

            {/* B1. PATIENT FORM REGISTRATION */}
            {step === 'FORM' && registerMode === 'PATIENT' && (
              <form onSubmit={handlePatientSubmit} className="space-y-5">
                
                {/* Photo Upload Section */}
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-655" />
                    <span>Citizen Photo * (Mandatory verification profile)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Patient preview" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] cursor-pointer shadow-2xs inline-block transition-colors">
                        Upload file
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {presetPhotos.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, photo: url }))}
                            className={`w-7 h-7 rounded-full overflow-hidden border ${formData.photo === url ? 'border-teal-650 ring-2 ring-teal-100 scale-105' : 'border-transparent'}`}
                          >
                            <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile Number (10 digits) *</label>
                    <input 
                      type="tel" required maxLength={10} value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Date of Birth *</label>
                    <input 
                      type="date" required value={formData.dob}
                      onChange={e => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Blood Group *</label>
                    <select 
                      value={formData.bloodGroup}
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-bold text-teal-700"
                    >
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Aadhaar Card Number (12 digits) *</label>
                    <input 
                      type="text" required maxLength={12} value={formData.aadhaarRef}
                      onChange={e => setFormData({ ...formData, aadhaarRef: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Password (for future sign in) *</label>
                    <input 
                      type="password" required value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter secure password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Allergies (leave blank if none)</label>
                    <input 
                      type="text" value={formData.allergies}
                      onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Dust Mites"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Pre-existing Diseases / Critical Conditions (leave blank if none)</label>
                    <input 
                      type="text" value={formData.criticalConditions}
                      onChange={e => setFormData({ ...formData, criticalConditions: e.target.value })}
                      placeholder="e.g. Asthma (Mild), Hypertension"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <span>PROCEED TO OTP VERIFICATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* B2. DOCTOR FORM REGISTRATION */}
            {step === 'FORM' && registerMode === 'DOCTOR' && (
              <form onSubmit={handleDoctorSubmit} className="space-y-5">
                
                {/* Doctor Photo Section */}
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-650" />
                    <span>Doctor Photo * (Mandatory verification profile)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {doctorForm.photo ? (
                      <img src={doctorForm.photo} alt="Doctor preview" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] cursor-pointer shadow-2xs inline-block transition-colors">
                        Upload file
                        <input type="file" accept="image/*" onChange={handleDoctorPhotoUpload} className="hidden" />
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {presetDoctorPhotos.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setDoctorForm(prev => ({ ...prev, photo: url }))}
                            className={`w-7 h-7 rounded-full overflow-hidden border ${doctorForm.photo === url ? 'border-teal-650 ring-2 ring-teal-100 scale-105' : 'border-transparent'}`}
                          >
                            <img src={url} alt={`Preset Doctor ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Doctor Full Name *</label>
                    <input 
                      type="text" required value={doctorForm.name}
                      onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Mehta"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile Number (10 digits) *</label>
                    <input 
                      type="tel" required maxLength={10} value={doctorForm.phone}
                      onChange={e => setDoctorForm({ ...doctorForm, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 9822211100"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Medical Council License Number *</label>
                    <input 
                      type="text" required value={doctorForm.licenseNumber}
                      onChange={e => setDoctorForm({ ...doctorForm, licenseNumber: e.target.value })}
                      placeholder="e.g. MCI-2018-91023"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Aadhaar Card Number (12 digits) *</label>
                    <input 
                      type="text" required maxLength={12} value={doctorForm.aadhaar}
                      onChange={e => setDoctorForm({ ...doctorForm, aadhaar: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Specialty *</label>
                    <select
                      value={doctorForm.specialty}
                      onChange={e => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Medicine & Pulmonology">General Medicine & Pulmonology</option>
                      <option value="Orthopedics & Sports Surgery">Orthopedics & Sports Surgery</option>
                      <option value="Dermatology">Dermatology</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Primary Hospital / Clinic *</label>
                    <input 
                      type="text" required value={doctorForm.hospital}
                      onChange={e => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
                      placeholder="e.g. Apollo Healthcare Center"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  {/* Multiple Degrees Section */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Degrees & Qualifications *</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {doctorDegrees.map(deg => (
                        <span key={deg} className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                          <span>{deg}</span>
                          <button type="button" onClick={() => handleRemoveDocDegree(deg)} className="text-teal-600 hover:text-teal-850 font-extrabold text-[10px]">✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newDocDegree}
                        onChange={e => setNewDocDegree(e.target.value)}
                        placeholder="e.g. DNB, FRCS, M.Ch"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                      <button 
                        type="button"
                        onClick={handleAddDocDegree}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-205 text-slate-750 font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap"
                      >
                        + Add Degree
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Degree Cert / Medical Council Document</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={doctorForm.certificationName} readOnly
                        placeholder="Attach licensing board certificate..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-650"
                      />
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Attach</span>
                        <input type="file" onChange={e => {
                          if (e.target.files?.[0]) setDoctorForm({ ...doctorForm, certificationName: e.target.files[0].name });
                        }} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Password (for future sign in) *</label>
                    <input 
                      type="password" required value={doctorForm.password}
                      onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })}
                      placeholder="Enter secure password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>SUBMIT REGISTRY APPLICATION</span>
                </button>
              </form>
            )}

            {/* B3. PHARMACIST FORM REGISTRATION */}
            {step === 'FORM' && registerMode === 'PHARMACIST' && (
              <form onSubmit={handlePharmacistSubmit} className="space-y-5">
                
                {/* Pharmacist Photo Section */}
                <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-655" />
                    <span>Pharmacist Photo * (Mandatory verification profile)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {pharmacistForm.photo ? (
                      <img src={pharmacistForm.photo} alt="Pharmacist preview" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] cursor-pointer shadow-2xs inline-block transition-colors">
                        Upload file
                        <input type="file" accept="image/*" onChange={handlePharmacistPhotoUpload} className="hidden" />
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {presetPharmacistPhotos.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPharmacistForm(prev => ({ ...prev, photo: url }))}
                            className={`w-7 h-7 rounded-full overflow-hidden border ${pharmacistForm.photo === url ? 'border-teal-650 ring-2 ring-teal-100 scale-105' : 'border-transparent'}`}
                          >
                            <img src={url} alt={`Preset Pharmacist ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Pharmacist Full Name *</label>
                    <input 
                      type="text" required value={pharmacistForm.name}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile Number (10 digits) *</label>
                    <input 
                      type="tel" required maxLength={10} value={pharmacistForm.phone}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 8025598800"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Pharmacy Enterprise Name *</label>
                    <input 
                      type="text" required value={pharmacistForm.pharmacyName}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, pharmacyName: e.target.value })}
                      placeholder="e.g. Apollo Care Pharmacy #104"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Drug License Number *</label>
                    <input 
                      type="text" required value={pharmacistForm.licenseNumber}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, licenseNumber: e.target.value })}
                      placeholder="e.g. KA-DRUG-88492"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Aadhaar Card Number (12 digits) *</label>
                    <input 
                      type="text" required maxLength={12} value={pharmacistForm.aadhaar}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, aadhaar: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 987654321012"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Multiple Degrees Section */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Degrees & Qualifications *</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {pharmacistDegrees.map(deg => (
                        <span key={deg} className="bg-teal-50 text-teal-805 border border-teal-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                          <span>{deg}</span>
                          <button type="button" onClick={() => handleRemovePharmDegree(deg)} className="text-teal-605 hover:text-teal-800 font-extrabold text-[10px]">✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newPharmDegree}
                        onChange={e => setNewPharmDegree(e.target.value)}
                        placeholder="e.g. M.Pharm, Pharm.D"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                      <button 
                        type="button"
                        onClick={handleAddPharmDegree}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-205 text-slate-750 font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap"
                      >
                        + Add Degree
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Pharmacy Council Certification *</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" value={pharmacistForm.certificationName} readOnly
                        placeholder="Drug_License_Cert.pdf"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-700 focus:outline-none"
                      />
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-3 py-2.5 rounded-xl text-xs cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Attach</span>
                        <input type="file" onChange={e => {
                          if (e.target.files?.[0]) setPharmacistForm({ ...pharmacistForm, certificationName: e.target.files[0].name });
                        }} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Physical Address *</label>
                    <input 
                      type="text" required value={pharmacistForm.address}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, address: e.target.value })}
                      placeholder="e.g. MG Road Metro Complex, Bengaluru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password (for future sign in) *</label>
                    <input 
                      type="password" required value={pharmacistForm.password}
                      onChange={e => setPharmacistForm({ ...pharmacistForm, password: e.target.value })}
                      placeholder="Enter secure password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>SUBMIT PHARMACY APPLICATION</span>
                </button>
              </form>
            )}

            {/* B4. STEP 2: OTP VERIFICATION VIEW */}
            {step === 'OTP' && (
              <div className="space-y-5 text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-650 flex items-center justify-center mx-auto shadow-2xs">
                  <Key className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Enter Verification Code</h3>
                  <p className="text-xs text-slate-550 mt-1">We sent a 6-digit OTP to your mobile number.</p>
                </div>
                <div className="bg-teal-50 border border-teal-150 rounded-xl py-2 px-3 text-xs text-teal-900 font-mono inline-block">
                  <strong>DEMO OTP CODE:</strong> <strong className="text-teal-700 text-sm ml-1">{generatedOtp}</strong>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-sm mx-auto">
                  <input 
                    type="text" required maxLength={6} value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:border-teal-500 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-teal-650 hover:bg-teal-750 text-white font-bold py-3.5 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFY & GENERATE CARD</span>
                  </button>
                </form>
              </div>
            )}

            {/* B5. STEP 3: REGISTRATION SUCCESS */}
            {step === 'SUCCESS' && (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">Identity Registry Activated!</h3>
                  <p className="text-xs text-slate-500 mt-1">{successMessage || `Welcome to ONESTOP HEALTH ecosystem, ${formData.name || 'Citizen'}.`}</p>
                </div>

                {registerMode === 'PATIENT' && newPatient && (
                  <div className="max-w-md mx-auto pt-2">
                    <HealthCard patient={newPatient} />
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (registerMode === 'PATIENT') {
                      setCurrentRole('PATIENT');
                      setActiveTab('dashboard');
                    } else if (registerMode === 'DOCTOR') {
                      setCurrentRole('ADMIN');
                      setActiveTab('admin-dashboard');
                    } else {
                      setCurrentRole('PHARMACIST');
                      setActiveTab('pharmacy-dashboard');
                    }
                  }}
                  className="bg-medical-700 hover:bg-medical-800 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all active:scale-[0.98] inline-flex items-center gap-1.5"
                >
                  <span>ENTER PORTAL WORKSPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Switch back to Login */}
            {step === 'FORM' && (
              <div className="text-center pt-3 text-xs text-slate-500 font-medium border-t border-slate-100">
                Already have a verified Health ID?{' '}
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(true); setErrorMessage(null); }}
                  className="text-medical-600 hover:underline font-bold"
                >
                  Sign in here
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* C. FROSTED DEMO LOGIN HELPER BAR (ONLY IN LOGIN MODE) */}
      {isLogin && (
        <div className="w-full max-w-lg mt-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left text-white space-y-3.5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Key className="w-4 h-4 text-teal-300" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-200">Simulated Demo Credentials</h4>
          </div>
          <p className="text-[10px] text-slate-350 leading-relaxed font-medium">
            Click any bypass role button below to automatically load coordinates and pre-fill credentials (Password: <strong className="text-white">demo123</strong>).
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button 
              onClick={() => handleAutoFill('PATIENT')}
              className="bg-white/10 hover:bg-white/15 text-left p-2.5 rounded-xl border border-white/5 font-semibold text-slate-200 hover:text-white transition-colors"
            >
              👤 Patient: Aarav Sharma
            </button>
            <button 
              onClick={() => handleAutoFill('DOCTOR')}
              className="bg-white/10 hover:bg-white/15 text-left p-2.5 rounded-xl border border-white/5 font-semibold text-slate-200 hover:text-white transition-colors"
            >
              🩺 Doctor: Dr. Rahul Sharma
            </button>
            <button 
              onClick={() => handleAutoFill('PHARMACIST')}
              className="bg-white/10 hover:bg-white/15 text-left p-2.5 rounded-xl border border-white/5 font-semibold text-slate-200 hover:text-white transition-colors"
            >
              💊 Pharmacy: Apollo Care
            </button>
            <button 
              onClick={() => handleAutoFill('ADMIN')}
              className="bg-white/10 hover:bg-white/15 text-left p-2.5 rounded-xl border border-white/5 font-semibold text-slate-200 hover:text-white transition-colors"
            >
              🛡️ Admin: System Controller
            </button>
          </div>
        </div>
      )}

      {/* Prototype Warning note */}
      <p className="text-[10px] text-white/40 mt-8 font-medium">
        ⚠️ ONESTOP National Portal. Simulated Auth Framework. Safe demo only.
      </p>

    </div>
  );
};
