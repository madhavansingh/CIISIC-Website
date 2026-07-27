import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Building, ShieldCheck, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { CiiLogo } from '../components/CiiLogo';
import { Toast } from '../components/Toast';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownOpen && !(e.target as HTMLElement).closest('.profile-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  // Active section scroll highlighter
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('institutions'); // Highlight institutions as the active navigation item when viewing that page
      return;
    }

    const handleScroll = () => {
      const sections = ['hero', 'about-ciisic', 'our-ecosystem', 'how-it-works', 'partner-institutions', 'get-involved'];
      const scrollPosition = window.scrollY + 160; // Offset for sticky navbar

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately to sync on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    
    if (sectionId === 'partner-institutions' && location.pathname === '/institutions') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      // Wait a moment for the page to transition, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500/20 selection:text-[#002147]">
      {/* Dynamic Session Bar */}
      {currentUser && (
        <div className="bg-[#002147] text-white py-1.5 px-4 text-xs font-medium border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              {currentUser.role === 'admin' ? (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  CII Admin Portal
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-200 uppercase tracking-wider">
                  <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {currentUser.companyName}
                </span>
              )}
            </div>
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 hover:bg-white/10 px-2.5 py-0.5 rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer font-bold select-none text-[10px]"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center font-extrabold text-[8px] uppercase shadow-sm">
                  {getInitials(currentUser.name)}
                </div>
                <span>{currentUser.name}</span>
                <span className="text-[7px] opacity-75">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-[100] origin-top-right text-xs divide-y divide-slate-100 animate-fade-in">
                  {/* User Profile Header */}
                  <div className="px-4 py-3 bg-slate-50/70">
                    <p className="font-extrabold text-slate-900 truncate text-xs">{currentUser.name}</p>
                    <p className="text-[9px] text-[#001a66] font-black uppercase tracking-wider mt-0.5">
                      {currentUser.role === 'admin' ? 'CII Admin' : 'Industry Partner'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold truncate mt-1">{currentUser.email}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to={currentUser.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 font-bold text-slate-700 hover:bg-slate-50 hover:text-[#001a66] rounded-lg transition-all text-xs"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Dashboard</span>
                    </Link>
                    {currentUser.role === 'industry' && (
                      <Link
                        to="/industry/submit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 font-bold text-slate-700 hover:bg-slate-50 hover:text-[#001a66] rounded-lg transition-all text-xs"
                      >
                        <PlusCircle className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Submit Problem</span>
                      </Link>
                    )}
                  </div>
                  
                  {/* Sign Out */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 font-bold text-red-650 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all text-left cursor-pointer text-xs"
                    >
                      <LogOut className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Premium Navbar */}
      <nav id="platform-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center shrink-0 pr-4 xl:pr-8">
              <Link to="/" className="shrink-0 flex items-center gap-3">
                <CiiLogo size="md" />
                <div className="flex flex-col justify-center leading-none">
                  <span className="text-base font-extrabold tracking-tight text-[#001A66] font-display">
                    CIISIC
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5">
                    CII Student Innovation Challenge
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center flex-grow mx-2 xl:mx-6 space-x-0.5 xl:space-x-1.5">
              {!currentUser && (
                <>
                  <button
                    onClick={() => handleNavClick('hero')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'hero' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('about-ciisic')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'about-ciisic' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    About CIISIC
                  </button>
                  <button
                    onClick={() => handleNavClick('our-ecosystem')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'our-ecosystem' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    Our Ecosystem
                  </button>
                  <button
                    onClick={() => handleNavClick('how-it-works')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'how-it-works' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => handleNavClick('partner-institutions')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'partner-institutions' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    Institutions
                  </button>
                  <button
                    onClick={() => handleNavClick('get-involved')}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all ${
                      activeSection === 'get-involved' 
                        ? 'text-[#001A66] bg-slate-100 font-bold' 
                        : 'text-slate-600 hover:text-[#001A66] hover:bg-slate-50/50'
                    }`}
                  >
                    Get Involved
                  </button>
                </>
              )}
            </div>

            {/* Desktop CTA buttons on the right */}
            <div className="hidden lg:flex items-center space-x-3 shrink-0 pl-2 xl:pl-6">
              {!currentUser ? (
                <>
                  <Link
                    to="/industry/login"
                    className="px-4 py-2.5 bg-[#001A66] text-white text-xs font-bold rounded-lg hover:bg-[#0056b3] transition-all whitespace-nowrap"
                  >
                    Register as Industry
                  </Link>
                  <Link
                    to="/admin/login"
                    className="px-4 py-2.5 bg-[#001A66] text-white text-xs font-bold rounded-lg hover:bg-[#0056b3] transition-all whitespace-nowrap"
                  >
                    CII Admin
                  </Link>
                </>
              ) : (
                <Link
                  to={currentUser.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard'}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    location.pathname.includes('/dashboard') 
                      ? 'text-white bg-[#001A66] border-[#001A66] shadow-sm' 
                      : 'text-[#001A66] bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-[#001A66] hover:bg-slate-100 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick('hero')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'hero' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('about-ciisic')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'about-ciisic' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    About CIISIC
                  </button>
                  <button
                    onClick={() => handleNavClick('our-ecosystem')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'our-ecosystem' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    Our Ecosystem
                  </button>
                  <button
                    onClick={() => handleNavClick('how-it-works')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'how-it-works' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => handleNavClick('partner-institutions')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'partner-institutions' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    Institutions
                  </button>
                  <button
                    onClick={() => handleNavClick('get-involved')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                      activeSection === 'get-involved' ? 'text-[#001A66] bg-slate-50 font-bold' : 'text-slate-700 hover:bg-slate-50 hover:text-[#001A66]'
                    }`}
                  >
                    Get Involved
                  </button>

                  <div className="border-t border-slate-100 my-2 pt-2 space-y-2 px-3">
                    <Link
                      to="/industry/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-base font-bold bg-[#001A66] text-white text-center hover:bg-[#0056b3] transition-all"
                    >
                      Register as Industry
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-base font-bold bg-[#001A66] text-white text-center hover:bg-[#0056b3] transition-all"
                    >
                      CII Admin
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={currentUser.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-bold text-[#001A66] hover:bg-slate-50"
                  >
                    Dashboard
                  </Link>
                  {currentUser.role === 'industry' && (
                    <Link
                      to="/industry/submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Submit Problem
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-base font-bold bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Global Toast component */}
      <Toast />
    </div>
  );
};

