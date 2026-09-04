import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const IndustryLogin: React.FC = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Successfully logged in to Industry Partner Portal!', 'success');
      navigate('/industry/dashboard');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#edf4f0]/60 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-6 relative z-10 animate-fade-in">
        {/* Navigation back to Homepage */}
        <div className="flex justify-between items-center px-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#063028] transition-all group"
            id="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Homepage
          </Link>
          <span className="text-xs font-bold text-[#063028] tracking-wider uppercase bg-[#edf4f0] border border-[#063028]/15 px-3 py-1 rounded-full">
            Industry Portal
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
          {/* Top Banner / Color Accent */}
          <div className="h-2 bg-gradient-to-r from-[#063028] via-[#c48825] to-[#063028]"></div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Logo and Headings */}
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-[#edf4f0] text-[#063028] border border-[#063028]/15 flex items-center justify-center shadow-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
                  Industry Partner Portal
                </h2>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Propose corporate problem statements and collaborate with academic research teams.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-sm font-medium text-red-800 leading-relaxed animate-fade-in" id="login-error">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit} id="industry-login-form">
              {/* Corporate Email Address */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-stone-700">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full pl-11 pr-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 transition-all bg-white font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-bold text-stone-700">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact the Confederation of Indian Industry (CII) Support at contact@ciisic.org to recover your password.')}
                    className="text-sm font-semibold text-[#c48825] hover:text-[#a6711c] hover:underline cursor-pointer"
                    id="forgot-password-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-11 pr-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 transition-all bg-white font-medium"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium text-stone-700 hover:text-stone-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#063028] border-stone-300 rounded focus:ring-[#063028] cursor-pointer"
                    id="remember-me"
                  />
                  Remember my session
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] focus:outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-md active:scale-[0.99]"
                id="sign-in-btn"
              >
                {isLoading ? 'Verifying Corporate Session...' : 'Sign In to Partner Portal'}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-stone-600">
                  New enterprise partner?{' '}
                  <Link to="/industry/register" className="font-bold text-[#c48825] hover:underline inline-flex items-center gap-1">
                    Register Industry Account <ArrowRight className="h-3 w-3" />
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Administrator Portal Redirect */}
        <div className="text-center pt-4">
          <p className="text-sm text-stone-600 inline-flex items-center justify-center gap-1.5 flex-wrap">
            <span>CII Platform Officer?</span>
            <Link 
              to="/admin/login" 
              className="font-bold text-[#c48825] hover:text-[#a6711c] hover:underline inline-flex items-center gap-1"
              id="admin-portal-link"
            >
              <ShieldCheck className="h-4 w-4 text-[#c48825]" /> Go to Administrator Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
