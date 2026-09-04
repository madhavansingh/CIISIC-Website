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
    if (location.pathname === '/institutions') {
      setActiveSection('institutions');
      return;
    }
    if (location.pathname === '/problem-statements' || location.pathname.startsWith('/details')) {
      setActiveSection('problem-statements');
      return;
    }

    const handleScroll = () => {
      const sections = ['hero', 'about-ciisic', 'partner-institutions', 'our-ecosystem', 'how-it-works', 'get-involved'];
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
    <div className="min-h-screen bg-[#faf7f0] flex flex-col font-sans selection:bg-[#c48825]/20 selection:text-[#063028]">
      {/* Dynamic Session Bar */}
      {currentUser && (
        <div className="bg-[#063028] text-white py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12 text-xs font-medium border-b border-white/10 z-50">
          <div className="w-full flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              {currentUser.role === 'admin' ? (
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
                  CII Admin Portal
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-200 uppercase tracking-wider">
                  <Building className="h-4 w-4 text-stone-300 shrink-0" />
                  {currentUser.companyName}
                </span>
              )}
            </div>
            <div className="relative profile-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer font-bold select-none text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#c48825] text-white flex items-center justify-center font-extrabold text-[10px] uppercase shadow-sm">
                  {getInitials(currentUser.name)}
                </div>
                <span>{currentUser.name}</span>
                <span className="text-[9px] opacity-75">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200/80 py-1.5 z-[100] origin-top-right text-xs divide-y divide-stone-100 animate-fade-in">
                  {/* User Profile Header */}
                  <div className="px-4 py-3 bg-stone-50/70">
                    <p className="font-extrabold text-stone-900 truncate text-sm">{currentUser.name}</p>
                    <p className="text-xs text-[#063028] font-bold uppercase tracking-wider mt-0.5">
                      {currentUser.role === 'admin' ? 'CII Admin' : 'Industry Partner'}
                    </p>
                    <p className="text-xs text-stone-600 font-medium truncate mt-1">{currentUser.email}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to={currentUser.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard'}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 font-bold text-stone-700 hover:bg-stone-50 hover:text-[#063028] rounded-lg transition-all text-xs sm:text-sm"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5 text-stone-400 shrink-0" />
                      <span>Dashboard</span>
                    </Link>
                    {currentUser.role === 'industry' && (
                      <Link
                        to="/industry/submit"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 font-bold text-stone-700 hover:bg-stone-50 hover:text-[#063028] rounded-lg transition-all text-xs sm:text-sm"
                      >
                        <PlusCircle className="h-4.5 w-4.5 text-stone-400 shrink-0" />
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
                      className="w-full flex items-center gap-2 px-3 py-2.5 font-bold text-red-650 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all text-left cursor-pointer text-xs sm:text-sm"
                    >
                      <LogOut className="h-4.5 w-4.5 text-red-500 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Premium Navbar - Full Width & Adaptive */}
      <nav id="platform-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e4dc] shadow-xs w-full">
        <div className="w-full px-4 sm:px-6 lg:px-6 xl:px-8 2xl:px-10">
          <div className="flex justify-between items-center h-18 w-full">
            {/* Logo and Brand */}
            <div className="flex items-center shrink-0 pr-2 lg:pr-3 xl:pr-4">
              <Link to="/" className="shrink-0 flex items-center gap-2.5 sm:gap-3">
                <CiiLogo size="md" />
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#063028] font-serif">
                    CIISIC
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-600 font-semibold tracking-wide mt-0.5 whitespace-nowrap">
                    CII Student Innovation Challenge
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-1 lg:mx-2 xl:mx-3 space-x-0.5 xl:space-x-1">
              {!currentUser && (
                <>
                  <button
                    onClick={() => handleNavClick('hero')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'hero' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('about-ciisic')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'about-ciisic' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    About CIISIC
                  </button>
                  <button
                    onClick={() => handleNavClick('partner-institutions')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'partner-institutions' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    Institutions
                  </button>
                  <Link
                    to="/problem-statements"
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'problem-statements' || location.pathname === '/problem-statements' || location.pathname.startsWith('/details')
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    Problem Statements
                  </Link>
                  <button
                    onClick={() => handleNavClick('our-ecosystem')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'our-ecosystem' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    Our Ecosystem
                  </button>
                  <button
                    onClick={() => handleNavClick('how-it-works')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'how-it-works' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => handleNavClick('get-involved')}
                    className={`relative py-1.5 px-2 xl:px-2.5 text-xs xl:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeSection === 'get-involved' 
                        ? 'text-[#063028] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 xl:after:left-2.5 xl:after:right-2.5 after:h-[2px] after:bg-[#c48825] after:rounded-full' 
                        : 'text-stone-700 hover:text-[#063028]'
                    }`}
                  >
                    Get Involved
                  </button>
                </>
              )}
            </div>

            {/* Desktop CTA buttons on the right */}
            <div className="hidden lg:flex items-center space-x-2 shrink-0 pl-1 xl:pl-3">
              {!currentUser ? (
                <>
                  <Link
                    to="/industry/login"
                    className="px-3 xl:px-3.5 py-1.5 xl:py-2 border border-stone-800 text-stone-900 bg-transparent hover:bg-stone-50 text-xs xl:text-[13px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs"
                  >
                    Register as Industry
                  </Link>
                  <Link
                    to="/admin/login"
                    className="px-3 xl:px-3.5 py-1.5 xl:py-2 bg-[#063028] text-white text-xs xl:text-[13px] font-bold rounded-xl hover:bg-[#04201a] transition-all whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    CII Admin
                  </Link>
                </>
              ) : (
                <Link
                  to={currentUser.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard'}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                    location.pathname.includes('/dashboard') 
                      ? 'text-white bg-[#063028] border-[#063028] shadow-xs' 
                      : 'text-[#063028] bg-stone-50 hover:bg-stone-100 border-stone-200'
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
                className="inline-flex items-center justify-center p-2 rounded-lg text-stone-600 hover:text-[#063028] hover:bg-stone-100 transition-colors cursor-pointer"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-stone-200 bg-white animate-fade-in shadow-lg">
            <div className="px-4 pt-3 pb-4 space-y-1 sm:px-6">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick('hero')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'hero' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('about-ciisic')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'about-ciisic' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    About CIISIC
                  </button>
                  <button
                    onClick={() => handleNavClick('partner-institutions')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'partner-institutions' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    Institutions
                  </button>
                  <Link
                    to="/problem-statements"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      location.pathname === '/problem-statements' || location.pathname.startsWith('/details')
                        ? 'text-[#063028] bg-[#edf4f0] font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    Problem Statements
                  </Link>
                  <button
                    onClick={() => handleNavClick('our-ecosystem')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'our-ecosystem' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    Our Ecosystem
                  </button>
                  <button
                    onClick={() => handleNavClick('how-it-works')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'how-it-works' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => handleNavClick('get-involved')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      activeSection === 'get-involved' ? 'text-[#063028] bg-[#edf4f0] font-bold' : 'text-stone-700 hover:bg-stone-50 hover:text-[#063028]'
                    }`}
                  >
                    Get Involved
                  </button>

                  <div className="border-t border-stone-200 my-2 pt-2 space-y-2 px-1">
                    <Link
                      to="/industry/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-base font-semibold border border-stone-800 text-stone-900 text-center hover:bg-stone-50 transition-all cursor-pointer"
                    >
                      Register as Industry
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full py-2.5 rounded-lg text-base font-semibold bg-[#063028] text-white text-center hover:bg-[#04201a] transition-all cursor-pointer shadow-xs"
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
                    className="block px-3 py-2 rounded-md text-base font-bold text-[#063028] hover:bg-stone-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/problem-statements"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-bold text-stone-700 hover:bg-stone-50"
                  >
                    Problem Statements
                  </Link>
                  {currentUser.role === 'industry' && (
                    <Link
                      to="/industry/submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-bold text-stone-700 hover:bg-stone-50"
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

