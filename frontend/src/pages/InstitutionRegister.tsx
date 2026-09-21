import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowLeft, ArrowRight, Building, User, Phone, CheckCircle } from 'lucide-react';
import { ALL_INSTITUTIONS } from '../data/institutions';
import { registerInstitution } from '../lib/api';
import { useApp } from '../contexts/AppContext';

export const InstitutionRegister: React.FC = () => {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [selectedInstName, setSelectedInstName] = useState(ALL_INSTITUTIONS[0]?.name || '');
  const [customInstName, setCustomInstName] = useState('');
  const [isCustomInst, setIsCustomInst] = useState(false);
  const [city, setCity] = useState(ALL_INSTITUTIONS[0]?.city || 'Indore');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('CII Innovation Cell Coordinator');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToCharter, setAgreedToCharter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInstitutionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__OTHER__') {
      setIsCustomInst(true);
      setSelectedInstName('');
    } else {
      setIsCustomInst(false);
      setSelectedInstName(val);
      const found = ALL_INSTITUTIONS.find(i => i.name === val);
      if (found) {
        setCity(found.city);
      }
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalInstName = isCustomInst ? customInstName.trim() : selectedInstName.trim();

    if (!finalInstName) {
      setError('Please select or enter your institution name.');
      return;
    }
    if (!coordinatorName || !email || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      return;
    }

    setIsLoading(true);
    try {
      await registerInstitution({
        institutionName: finalInstName,
        institutionCity: city,
        coordinatorName,
        email,
        department,
        designation,
        phone,
        password,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register institution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const finalInstName = isCustomInst ? customInstName.trim() : selectedInstName.trim();
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fade-in relative z-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif text-[#063028]">
              Registration Submitted!
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a6711c]">
              Pending CII Admin Approval
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
            <p>
              Thank you for registering <strong className="text-[#063028]">{finalInstName}</strong>.
            </p>
            <p>
              Your academic SPOC registration has been submitted to the CII Administrator for verification and approval.
            </p>
            <p className="text-stone-500 text-xs">
              Once approved by the CII Admin, you can log in with your email (<strong>{email}</strong>) to adopt industry problem statements and assign student innovation teams.
            </p>
          </div>

          <Link
            to="/institution/login"
            className="block w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all shadow-md text-center"
          >
            Go to Institution Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden flex items-center justify-center">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#edf4f0]/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full space-y-6 relative z-10 animate-fade-in">
        {/* Navigation back */}
        <div className="flex justify-between items-center px-1">
          <Link 
            to="/institution/login" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#063028] transition-all group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Institution Login</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-[#063028] bg-[#edf4f0] px-3 py-1 rounded-full border border-[#063028]/20">
            Institution Onboarding
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#063028] px-8 pt-8 pb-7 text-center relative overflow-hidden text-white">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-xs ring-1 ring-white/20 shadow-inner">
                <GraduationCap className="h-7 w-7 text-[#c48825]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                Register Partner Institution
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto font-normal">
                Join the CII Industry–Academia Excellence network to adopt industrial challenges and assign student teams.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-7 sm:p-9 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <span className="shrink-0 font-bold">!</span>
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Institution Selection */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="institution-select">
                  Select Partner Academic Institution *
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <select
                    id="institution-select"
                    value={isCustomInst ? '__OTHER__' : selectedInstName}
                    onChange={handleInstitutionSelect}
                    className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 cursor-pointer"
                  >
                    <optgroup label="Indore Division Partner Universities">
                      {ALL_INSTITUTIONS.filter(i => i.city === 'Indore').map(inst => (
                        <option key={inst.name} value={inst.name}>
                          {inst.name} ({inst.city})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Bhopal Division Partner Universities">
                      {ALL_INSTITUTIONS.filter(i => i.city === 'Bhopal').map(inst => (
                        <option key={inst.name} value={inst.name}>
                          {inst.name} ({inst.city})
                        </option>
                      ))}
                    </optgroup>
                    <option value="__OTHER__">+ Other Institution / University</option>
                  </select>
                </div>
              </div>

              {/* Custom Institution input if chosen */}
              {isCustomInst && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5 text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="custom-inst-name">
                      Institution Name *
                    </label>
                    <input
                      id="custom-inst-name"
                      type="text"
                      required
                      value={customInstName}
                      onChange={(e) => setCustomInstName(e.target.value)}
                      placeholder="e.g. Rajiv Gandhi Proudyogiki Vishwavidyalaya"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="inst-city">
                      City
                    </label>
                    <input
                      id="inst-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bhopal / Indore"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                </div>
              )}

              {/* Coordinator Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="coordinator-name">
                    Faculty Coordinator / SPOC Name *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="coordinator-name"
                      type="text"
                      required
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                      placeholder="Dr. Priya Sharma"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="coordinator-email">
                    Official Academic Email *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="coordinator-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="spoc@university.edu.in"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 text-left sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="dept-name">
                    Department
                  </label>
                  <input
                    id="dept-name"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                  />
                </div>

                <div className="space-y-1.5 text-left sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="designation">
                    Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Professor & HOD"
                    className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                  />
                </div>

                <div className="space-y-1.5 text-left sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="phone">
                    Contact Phone
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765..."
                      className="block w-full pl-9 pr-3 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="password">
                    Password *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 pl-1">Min 8 chars, must include an uppercase letter and a number.</p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700" htmlFor="confirm-password">
                    Confirm Password *
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 bg-white focus:outline-none focus:border-[#063028]"
                    />
                  </div>
                </div>
              </div>

              {/* Charter Agreement */}
              <div className="flex items-start gap-2.5 pt-1 text-left">
                <input
                  id="charter"
                  type="checkbox"
                  checked={agreedToCharter}
                  onChange={(e) => setAgreedToCharter(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 text-[#063028] border-stone-300 rounded focus:ring-[#063028] cursor-pointer shrink-0"
                />
                <label htmlFor="charter" className="text-xs text-stone-600 leading-relaxed cursor-pointer select-none">
                  I certify that I am an authorized academic coordinator or faculty representative of this institution and agree to adhere to the CII Student Innovation Challenge collaboration charter and IP guidelines.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] focus:outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-md active:scale-[0.99]"
              >
                {isLoading ? 'Creating Institution Account...' : 'Register Institution & Enter Portal'}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-stone-100">
              <p className="text-xs sm:text-sm text-stone-600">
                Already registered your institution?{' '}
                <Link 
                  to="/institution/login" 
                  className="font-bold text-[#063028] hover:text-[#c48825] underline underline-offset-2 transition-colors"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
