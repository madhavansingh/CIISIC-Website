import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Lock, Mail, ArrowLeft, ArrowRight, 
  Globe, User, Phone, CheckCircle2, ShieldCheck, 
  Briefcase, AlertCircle 
} from 'lucide-react';
import { registerIndustry } from '../lib/api';

const INDUSTRY_SECTORS = [
  'Information Technology & Software',
  'Automotive & Transportation',
  'Manufacturing & Heavy Engineering',
  'Agritech & Food Processing',
  'Healthcare & Pharmaceuticals',
  'Renewable Energy & Power',
  'Electronics & Semiconductor',
  'Logistics & Supply Chain',
  'Biotechnology & Life Sciences',
  'Other Industrial Sector',
];

export const IndustryRegister: React.FC = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRY_SECTORS[0]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isCIIMember, setIsCIIMember] = useState(true);
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim()) {
      setError('Please provide your corporate enterprise name.');
      return;
    }

    if (!contactPerson.trim()) {
      setError('Please provide the authorized corporate representative name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid official corporate email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one uppercase letter and one number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await registerIndustry({
        companyName: companyName.trim(),
        industry,
        websiteUrl: websiteUrl.trim() || undefined,
        isCIIMember,
        contactPerson: contactPerson.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 text-center space-y-6 animate-fade-in relative z-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
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
              Thank you for registering <strong className="text-[#063028]">{companyName}</strong> on the CII Innovation Portal.
            </p>
            <p>
              Your enterprise profile is currently in <strong>pending approval status</strong>. The CII Administrator will verify your corporate registration shortly.
            </p>
            <p className="text-stone-500 text-xs">
              Once approved, you will be able to log in with your email (<strong>{email}</strong>) and start posting live industrial problem statements.
            </p>
          </div>

          <button
            onClick={() => navigate('/industry/login')}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all shadow-md"
          >
            Go to Industry Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#edf4f0]/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-6 relative z-10 animate-fade-in">
        {/* Navigation back */}
        <div className="flex justify-between items-center px-1">
          <Link 
            to="/industry/login" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#063028] transition-all group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Industry Login</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a6711c] bg-[#fef6e7] px-3 py-1 rounded-full border border-[#c48825]/20">
            Enterprise Onboarding
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
          <div className="bg-[#063028] px-8 pt-8 pb-7 text-center text-white">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl ring-1 ring-white/20">
                <Building2 className="h-7 w-7 text-[#c48825]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                Industry Partner Registration
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                Register your corporate enterprise with CII. After administrator review and approval, post problem statements to tap top academic talent.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 sm:p-9 space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 border-b border-stone-100 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c48825]" /> Enterprise Information
              </h3>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Enterprise Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Tata Motors Ltd, L&T Technology Services"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                  />
                </div>
              </div>

              {/* Industry Sector & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Industry Sector *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                  >
                    {INDUSTRY_SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Website URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>
              </div>

              {/* CII Member checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="cii-member"
                  checked={isCIIMember}
                  onChange={(e) => setIsCIIMember(e.target.checked)}
                  className="h-4 w-4 text-[#063028] border-stone-300 rounded focus:ring-[#063028] cursor-pointer"
                />
                <label htmlFor="cii-member" className="text-xs font-medium text-stone-700 cursor-pointer select-none">
                  Our organization is an existing member of the Confederation of Indian Industry (CII)
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 border-b border-stone-100 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#c48825]" /> Authorized Corporate SPOC
              </h3>

              {/* Contact Person & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Representative Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Designation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Lead Engineer, R&D Director"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Official Corporate Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Corporate Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="spoc@company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Phone / Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 chars, 1 uppercase, 1 digit"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Note on Approval */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>CII Administrative Approval Required:</strong> All registered industry accounts are verified by the CII Innovation Directorate before problem statement posting privileges are activated.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] focus:outline-none transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? 'Submitting Registration...' : 'Submit Enterprise Registration'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>

            {/* Already registered link */}
            <div className="text-center pt-2">
              <p className="text-xs text-stone-600">
                Already approved or registered?{' '}
                <Link to="/industry/login" className="font-bold text-[#c48825] hover:underline">
                  Sign in to Partner Portal
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
