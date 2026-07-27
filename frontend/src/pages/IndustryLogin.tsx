import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowLeft, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 relative overflow-hidden">
      {/* Visual background decorations - Subtle Grid & Decorative Blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-70"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-6 relative z-10 animate-fade-in">
        {/* Navigation back to Homepage */}
        <div className="flex justify-between items-center px-1">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#002147] transition-all group"
            id="back-to-home"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Homepage
          </Link>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-slate-100 px-2 py-1 rounded">
            CII-SIC HUB
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden premium-shadow">
          {/* Top Banner / Color Accent */}
          <div className="h-2.5 bg-gradient-to-r from-[#002147] via-[#0056b3] to-[#002147]"></div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Logo and Headings */}
            <div className="text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#002147] to-[#0056b3] flex items-center justify-center text-white shadow-lg shadow-blue-900/10 transform hover:scale-105 transition-transform duration-200">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-[#002147] tracking-tight font-display">
                  Industry Partner Portal
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  Propose corporate problem statements &amp; collaborate with top-tier academic researchers
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs font-semibold text-red-800 leading-relaxed animate-fade-in" id="login-error">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit} id="industry-login-form">
              {/* Corporate Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-all bg-slate-50/50 hover:bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact the Confederation of Indian Industry (CII) Support to recover your password.')}
                    className="text-[11px] font-semibold text-[#0056b3] hover:underline"
                    id="forgot-password-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0056b3] focus:ring-2 focus:ring-[#0056b3]/10 transition-all bg-slate-50/50 hover:bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-slate-600 hover:text-slate-800">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4.5 w-4.5 text-[#002147] border-slate-300 rounded focus:ring-[#002147] focus:ring-offset-0 cursor-pointer"
                    id="remember-me"
                  />
                  Remember my session
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#002147] hover:bg-[#0056b3] focus:outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-md shadow-blue-900/10 active:scale-[0.99]"
                id="sign-in-btn"
              >
                {isLoading ? 'Verifying Corporate Session...' : 'Sign In to Partner Portal'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>


          </div>
        </div>

        {/* Administrator Portal Redirect */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500 inline-flex items-center justify-center gap-1.5 flex-wrap">
            <span>CII Platform Officer?</span>
            <Link 
              to="/admin/login" 
              className="font-bold text-[#0056b3] hover:underline inline-flex items-center gap-1"
              id="admin-portal-link"
            >
              <ShieldCheck className="h-4 w-4 text-[#0056b3]" /> Go to Administrator Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
