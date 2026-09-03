import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowLeft, Building2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AdminLogin: React.FC = () => {
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrative password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid corporate email address.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Successfully logged in as CII Administrator.', 'success');
      navigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#faf8f4] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#edf4f0]/60 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10 animate-fade-in">
        <div className="flex justify-between items-center px-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-[#063028] transition-all group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Homepage
          </Link>
          <span className="text-xs font-bold text-[#063028] tracking-wider uppercase bg-[#edf4f0] border border-[#063028]/15 px-3 py-1 rounded-full">
            Admin Portal
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#063028] via-[#c48825] to-[#063028]"></div>

          <div className="p-8 sm:p-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-[#edf4f0] text-[#063028] border border-[#063028]/15 flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
                  CII Admin Portal
                </h2>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Review submissions, publish requirements, and manage academic partners.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-sm font-medium text-red-800 leading-relaxed animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-stone-700">
                  CII Administrative Email
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
                    placeholder="admin@cii.in"
                    className="block w-full pl-11 pr-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 transition-all bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-bold text-stone-700">
                    Administrative Key
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact the Confederation of Indian Industry (CII) Support at contact@ciisic.org to recover your password.')}
                    className="text-sm font-semibold text-[#c48825] hover:text-[#a6711c] hover:underline cursor-pointer"
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
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrative key"
                    className="block w-full pl-11 pr-11 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 transition-all bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center">
                <label htmlFor="remember_me" className="flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium text-stone-700 hover:text-stone-900">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#063028] focus:ring-[#063028] border-stone-300 rounded cursor-pointer"
                  />
                  Remember my session
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] focus:outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-md active:scale-[0.99]"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In as Administrator'}
              </button>
            </form>
          </div>
        </div>

        {/* Alternate link */}
        <div className="text-center pt-4">
          <p className="text-sm text-stone-600 inline-flex items-center justify-center gap-1.5 flex-wrap">
            <span>Corporate Representative?</span>
            <Link 
              to="/industry/login" 
              className="font-bold text-[#c48825] hover:text-[#a6711c] hover:underline inline-flex items-center gap-1"
            >
              <Building2 className="h-4 w-4" /> Go to Industry Partner Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
