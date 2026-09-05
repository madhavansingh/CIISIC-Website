import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, PlusCircle, CheckCircle, Clock, AlertTriangle, FileText, 
  Globe, ChevronRight, FileCheck, X,
  Calendar, IndianRupee, UploadCloud, ArrowLeft, RefreshCw, Eye, Download,
  GraduationCap, ExternalLink, Award, Sparkles, MessageSquare, Send, CheckSquare, Layers, User, Lock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { sanitizeHTML, stripHTML } from '../lib/html';
import { uploadFile } from '../lib/api';
import { getOriginalFileName } from '../lib/file';
import { SolutionSubmission, SolutionStatus } from '../types';
import { ChangePasswordModal } from '../components/common/ChangePasswordModal';

export const IndustryDashboard: React.FC = () => {
  const { currentUser, submissions, addSubmission, showToast, solutions, reviewSolution } = useApp();
  
  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Dashboard tab state
  const [activeDashboardTab, setActiveDashboardTab] = useState<'statements' | 'solutions'>('statements');
  const [selectedSolutionForReview, setSelectedSolutionForReview] = useState<SolutionSubmission | null>(null);
  const [reviewDecision, setReviewDecision] = useState<SolutionStatus>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [solutionSearch, setSolutionSearch] = useState('');
  const [solutionStatusFilter, setSolutionStatusFilter] = useState<string>('All');
  
  // Dashboard states
  const [currentView, setCurrentView] = useState<'dashboard' | 'form' | 'review' | 'success'>('dashboard');
  
  // Form input states
  const [companyName, setCompanyName] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [spocName, setSpocName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expectedOutcomes, setExpectedOutcomes] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState(''); // Stores YYYY-MM-DD
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  // Drag and drop state
  const [dragOver, setDragOver] = useState(false);
  
  // Form error state
  interface FormErrors {
    companyName?: string;
    industryCategory?: string;
    spocName?: string;
    email?: string;
    phone?: string;
    website?: string;
    title?: string;
    description?: string;
    expectedOutcomes?: string;
    budget?: string;
    deadline?: string;
    attachedFile?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});

  const formSectionRef = useRef<HTMLDivElement>(null);

  // Auto-populate company info from currently logged in user on mount or user change
  useEffect(() => {
    if (currentUser) {
      setCompanyName(currentUser.companyName || 'Tata Motors Ltd');
      setIndustryCategory('Automotive & Manufacturing');
      setSpocName(currentUser.name || 'Rajesh Sharma');
      setEmail(currentUser.email || 'industry@cii.in');
      setPhone('+91 98765 43210');
      setWebsite('www.tatamotors.com');
    }
  }, [currentUser]);

  // Scroll to form helper
  const scrollToForm = () => {
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Filter submissions to only display those belonging to this logged in industry partner
  const mySubmissions = submissions.filter(
    (sub) => sub.company.email.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const stats = {
    total: mySubmissions.length,
    pending: mySubmissions.filter((s) => s.status === 'Pending').length,
    approved: mySubmissions.filter((s) => s.status === 'Approved').length,
    rejected: mySubmissions.filter((s) => s.status === 'Rejected').length,
  };

  // Filter solutions submitted for this industry partner
  const mySolutions = solutions.filter((sol) => {
    if (currentUser?.companyName && sol.industryCompanyName.toLowerCase().includes(currentUser.companyName.toLowerCase())) {
      return true;
    }
    return mySubmissions.some(
      (sub) => sub.id === sol.challengeId || sub.details.title.toLowerCase() === sol.challengeTitle.toLowerCase()
    );
  });

  const solutionStats = {
    total: mySolutions.length,
    underReview: mySolutions.filter((s) => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED').length,
    approved: mySolutions.filter((s) => s.status === 'APPROVED').length,
    revisions: mySolutions.filter((s) => s.status === 'REVISION_REQUESTED').length,
  };

  const getSolutionStatusBadge = (status: SolutionStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Shortlisted / Approved
          </span>
        );
      case 'REVISION_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Revision Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <X className="h-3.5 w-3.5 text-red-600" /> Not Selected
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Clock className="h-3.5 w-3.5 text-purple-600" /> Submitted
          </span>
        );
    }
  };

  const handleOpenReview = (sol: SolutionSubmission) => {
    setSelectedSolutionForReview(sol);
    setReviewDecision(sol.status === 'SUBMITTED' ? 'APPROVED' : sol.status);
    setReviewNotes(sol.industryFeedback || '');
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForReview) return;
    setIsReviewing(true);
    try {
      await reviewSolution(selectedSolutionForReview.id, reviewDecision, reviewNotes);
      showToast(`Solution evaluation saved as ${reviewDecision.replace('_', ' ')}.`, 'success');
      setSelectedSolutionForReview(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update evaluation.', 'error');
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" /> Pending Review
          </span>
        );
    }
  };

  // Format YYYY-MM-DD date to DD/MM/YYYY
  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    
    if (!isPdf && !isImage) {
      setErrors(prev => ({ ...prev, attachedFile: 'Invalid format. Only Images (max 2MB) and PDF (max 10MB) are allowed.' }));
      setAttachedFile(null);
      showToast('Unsupported file type', 'error');
      return;
    }

    if (isImage && file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, attachedFile: 'Image size exceeds the 2 MB limit.' }));
      setAttachedFile(null);
      showToast('Image is too large (Max 2MB)', 'error');
      return;
    }

    if (isPdf && file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, attachedFile: 'PDF size exceeds the 10 MB limit.' }));
      setAttachedFile(null);
      showToast('PDF is too large (Max 10MB)', 'error');
      return;
    }

    // Valid file
    setErrors(prev => {
      const { attachedFile: _, ...rest } = prev;
      return rest;
    });
    setAttachedFile(file);
    showToast(`File attached: ${file.name}`, 'info');
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setErrors(prev => {
      const { attachedFile: _, ...rest } = prev;
      return rest;
    });
  };

  // Form Reset
  const handleReset = () => {
    setCompanyName(currentUser?.companyName || 'Tata Motors Ltd');
    setIndustryCategory('Automotive & Manufacturing');
    setSpocName(currentUser?.name || 'Rajesh Sharma');
    setEmail(currentUser?.email || 'industry@cii.in');
    setPhone('+91 98765 43210');
    setWebsite('www.tatamotors.com');
    setTitle('');
    setDescription('');
    setExpectedOutcomes('');
    setBudget('');
    setDeadline('');
    setAttachedFile(null);
    setErrors({});
    showToast('Form has been reset to your corporate defaults.', 'info');
    scrollToForm();
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Company Information
    if (!companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }

    if (!industryCategory.trim()) {
      newErrors.industryCategory = 'Industry Category is required';
    }

    if (!spocName.trim()) {
      newErrors.spocName = 'SPOC Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Official Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid official email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    }

    if (!website.trim()) {
      newErrors.website = 'Company Website URL is required';
    } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    // Problem Statement
    if (!title.trim()) {
      newErrors.title = 'Problem Statement Title is required';
    } else if (title.length < 25) {
      newErrors.title = 'Problem Statement Title must be at least 25 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Problem Statement Description is required';
    }

    if (!expectedOutcomes.trim()) {
      newErrors.expectedOutcomes = 'Expected Outcomes description is required';
    }

    if (!budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Review submission
  const handleReviewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentView('review');
      showToast('Form validated! Please review your submission parameters.', 'success');
      scrollToForm();
    } else {
      showToast('Validation failed. Please correct the highlighted errors.', 'error');
    }
  };

  // Final submit
  const handleFinalSubmit = async () => {
    try {
      let attachmentUrl: string | undefined = undefined;
      if (attachedFile) {
        showToast('Uploading document attachment...', 'info');
        const uploadRes = await uploadFile(attachedFile, 'DOCUMENT');
        attachmentUrl = uploadRes.url;
      }

      await addSubmission({
        company: {
          industryName: industryCategory,
          companyName: companyName,
          representativeName: spocName,
          designation: currentUser?.designation || 'Head of Innovation & R&D',
          email: email,
          phone: phone,
          website: website,
          industrySector: industryCategory,
        },
        details: {
          title: title,
          description: description,
          businessChallenge: description,
          existingProcess: 'Handled via manual inspections and fixed calendar schedules.',
          expectedOutcome: expectedOutcomes,
          projectObjectives: `1. Analyze parameters for ${title}.\n2. Build a reliable engineering prototype.\n3. Verify operational safety against standard metrics.`
        },
        technical: {
          requiredTechnologies: ['AI Frameworks', 'Data Pipelines', 'Enterprise Edge Integrations'],
          requiredSkills: ['Problem Formulation', 'Industrial Engineering', 'Full Stack Development'],
          preferredBranches: ['Computer Science', 'Electrical Engineering', 'Mechanical Systems'],
          preferredAcademicYear: 'Final Year UG / Postgraduate (PG)',
          difficultyLevel: 'Medium',
          expectedDuration: '6 Months'
        },
        additional: {
          expectedDeliverables: 'Production code repository, mechanical schematics, and an integration deployment checklist.',
          additionalNotes: budget ? `Budget allocated: ${budget}. Target date: ${formatToDDMMYYYY(deadline)}` : '',
          fileAttachmentName: attachmentUrl,
          declarationAccepted: true
        }
      });

      setCurrentView('success');
      showToast('Your problem statement has been submitted successfully.', 'success');
      scrollToForm();
    } catch {
      showToast('Failed to submit the problem statement. Please try again.', 'error');
    }
  };

  const handleReturnToDashboard = () => {
    setTitle('');
    setDescription('');
    setExpectedOutcomes('');
    setBudget('');
    setDeadline('');
    setAttachedFile(null);
    setErrors({});
    setCurrentView('dashboard');
  };

  const handleSubmitAnother = () => {
    setTitle('');
    setDescription('');
    setExpectedOutcomes('');
    setBudget('');
    setDeadline('');
    setAttachedFile(null);
    setErrors({});
    setCurrentView('form');
    scrollToForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Header - Welcome back */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-stone-200 pb-6" id="dashboard-header">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs font-bold text-[#c48825] uppercase tracking-wider">Industry Partner Portal</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight font-serif flex items-center gap-2 flex-wrap">
            <span>Welcome, {currentUser?.name || 'Industry Partner'}</span>
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            Manage your filed problem statements, track CII review feedback, and initiate new university research collaborations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Lock className="h-4 w-4 text-[#c48825]" /> Change Password
          </button>

          {currentView === 'dashboard' && (
            <button
              onClick={() => {
                setCurrentView('form');
                scrollToForm();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#063028] hover:bg-[#04201a] text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
              id="primary-action-btn"
            >
              <PlusCircle className="h-4.5 w-4.5" /> Submit Problem Statement
            </button>
          )}
        </div>
      </div>

      {/* Corporate Profile Summary - Responsive Grid Layout */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4" id="profile-summary">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5 text-[#063028]" /> Corporate Profile Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          {/* Company Name */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Company Name</span>
            <p className="font-bold text-[#063028] text-base">{currentUser?.companyName || 'Tata Motors Ltd'}</p>
          </div>

          {/* Industry Category */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Industry Category</span>
            <p className="font-bold text-[#063028] text-base">Automotive &amp; Manufacturing</p>
          </div>

          {/* SPOC Name */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Representative / SPOC</span>
            <p className="font-bold text-[#063028] text-base">{currentUser?.name || 'Rajesh Sharma'}</p>
          </div>

          {/* Official Email */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Official Email</span>
            <p className="font-medium text-stone-700 text-base truncate">{currentUser?.email || 'industry@cii.in'}</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Phone Number</span>
            <p className="font-medium text-stone-700 text-base">+91 98765 43210</p>
          </div>

          {/* Website */}
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Website</span>
            <p className="font-medium text-base">
              <a href="https://www.tatamotors.com" target="_blank" rel="noopener noreferrer" className="text-[#c48825] hover:text-[#a6711c] hover:underline flex items-center gap-1">
                www.tatamotors.com <Globe className="h-4 w-4 inline shrink-0" />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD VIEW - Filed Statements ledger & Received Solutions */}
      {currentView === 'dashboard' && (
        <div className="space-y-6 animate-fade-in" id="dashboard-ledger">
          {/* Main Tab Navigation */}
          <div className="flex border-b border-stone-200 gap-6">
            <button
              onClick={() => setActiveDashboardTab('statements')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
                activeDashboardTab === 'statements'
                  ? 'text-[#063028] border-b-2 border-[#063028]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              Posted Problem Statements
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#edf4f0] text-[#063028]">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveDashboardTab('solutions')}
              className={`pb-3 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
                activeDashboardTab === 'solutions'
                  ? 'text-[#063028] border-b-2 border-[#063028]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student Solutions Received
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {mySolutions.length}
              </span>
            </button>
          </div>

          {/* TAB 1: PROBLEM STATEMENTS */}
          {activeDashboardTab === 'statements' && (
            <>
              {/* Submissions Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Submissions</div>
                  <div className="text-3xl font-extrabold text-[#063028] mt-1 font-serif">{stats.total}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Approved for Distribution</div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1 font-serif">{stats.approved}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Review</div>
                  <div className="text-3xl font-extrabold text-amber-700 mt-1 font-serif">{stats.pending}</div>
                </div>
              </div>

              {/* Table/List Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#063028] font-serif">
                    Submitted Problem Statements
                  </h2>
                  <span className="text-sm font-semibold text-stone-500">
                    Showing {mySubmissions.length} Statements
                  </span>
                </div>

                {mySubmissions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                    <FileText className="h-12 w-12 text-stone-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-bold text-stone-800 text-base">No Problem Statements Filed Yet</p>
                      <p className="text-sm text-stone-600 max-w-sm mx-auto">Get started by creating your first problem statement to receive solutions from engineering institutions.</p>
                    </div>
                    <button
                      onClick={() => setCurrentView('form')}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#063028] rounded-xl hover:bg-[#04201a] transition-all cursor-pointer shadow-sm"
                    >
                      <PlusCircle className="h-4.5 w-4.5" /> Submit First Statement
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mySubmissions.map((sub) => (
                      <div key={sub.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4 hover:border-stone-300 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-bold text-[#063028] bg-[#edf4f0] border border-[#063028]/20 px-2 py-0.5 rounded">REF ID: {sub.id}</span>
                              <span className="text-xs text-stone-500 font-medium">Filed on {new Date(sub.submittedDate).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#063028] hover:text-[#c48825] transition-colors mt-1">
                              {sub.details.title}
                            </h3>
                          </div>
                          <div className="shrink-0">{getStatusBadge(sub.status)}</div>
                        </div>

                        <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                          {stripHTML(sub.details.description)}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs bg-stone-100 border border-stone-200 text-stone-700 font-semibold px-2.5 py-1 rounded">
                              {sub.technical.difficultyLevel} Tier
                            </span>
                            <span className="text-xs bg-[#edf4f0] text-[#063028] font-bold px-2.5 py-1 rounded">
                              {sub.company.industrySector}
                            </span>
                            {sub.additional.fileAttachmentName && (
                              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 text-stone-700 px-2.5 py-1 rounded text-xs font-bold max-w-[220px] sm:max-w-[320px]">
                                <span>📄</span>
                                <a
                                  href={sub.additional.fileAttachmentName}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#063028] hover:underline truncate"
                                  title={getOriginalFileName(sub.additional.fileAttachmentName)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {getOriginalFileName(sub.additional.fileAttachmentName)}
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(sub.additional.fileAttachmentName, '_blank');
                                  }}
                                  className="p-0.5 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-700 transition-colors shrink-0"
                                  title="Download file"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          <Link 
                            to={`/details/${sub.id}`} 
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#c48825] hover:text-[#a6711c] hover:underline"
                          >
                            View Full Details <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>

                        {/* Admin remarks display */}
                        {sub.reviewRemarks && (
                          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#063028] block">CII Administrator Remarks</span>
                            <p className="text-sm text-stone-700 leading-relaxed italic font-medium">
                              &quot;{sub.reviewRemarks}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: INSTITUTIONAL SOLUTIONS RECEIVED */}
          {activeDashboardTab === 'solutions' && (
            <div className="space-y-6">
              {/* Solution Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Received</div>
                  <div className="text-2xl font-extrabold text-[#063028] mt-1 font-serif">{solutionStats.total}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Evaluation</div>
                  <div className="text-2xl font-extrabold text-blue-700 mt-1 font-serif">{solutionStats.underReview}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Shortlisted / Approved</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-serif">{solutionStats.approved}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Revisions Requested</div>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1 font-serif">{solutionStats.revisions}</div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <input
                  type="text"
                  value={solutionSearch}
                  onChange={(e) => setSolutionSearch(e.target.value)}
                  placeholder="Search by team, institution, or solution title..."
                  className="w-full sm:w-80 px-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-stone-500">Status:</span>
                  <select
                    value={solutionStatusFilter}
                    onChange={(e) => setSolutionStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved / Shortlisted</option>
                    <option value="REVISION_REQUESTED">Revision Requested</option>
                    <option value="REJECTED">Not Selected</option>
                  </select>
                </div>
              </div>

              {/* Solutions List */}
              {mySolutions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                  <GraduationCap className="h-12 w-12 text-stone-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-stone-800 text-base">No Solutions Submitted Yet</p>
                    <p className="text-sm text-stone-600 max-w-md mx-auto">
                      Academic institutions and student engineering teams across Madhya Pradesh are currently reviewing your approved problem statements. Once solutions are filed, they will appear here for your review and pilot shortlisting.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {mySolutions
                    .filter((sol) => {
                      const matchesQuery = 
                        sol.title.toLowerCase().includes(solutionSearch.toLowerCase()) ||
                        sol.institutionName.toLowerCase().includes(solutionSearch.toLowerCase()) ||
                        sol.teamName.toLowerCase().includes(solutionSearch.toLowerCase()) ||
                        sol.challengeTitle.toLowerCase().includes(solutionSearch.toLowerCase());
                      const matchesFilter = solutionStatusFilter === 'All' || sol.status === solutionStatusFilter;
                      return matchesQuery && matchesFilter;
                    })
                    .map((sol) => (
                      <div key={sol.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5 hover:border-stone-300 transition-all">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#063028] bg-[#edf4f0] px-2 py-0.5 rounded">
                                Problem: {sol.challengeTitle}
                              </span>
                              <span className="text-xs text-stone-500">
                                Submitted on {new Date(sol.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#063028] mt-1 font-serif">
                              {sol.title}
                            </h3>
                          </div>
                          <div className="shrink-0">
                            {getSolutionStatusBadge(sol.status)}
                          </div>
                        </div>

                        {/* Institution & Team Credentials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                          <div>
                            <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                              <GraduationCap className="w-4 h-4 text-[#063028]" />
                              {sol.institutionName}
                            </div>
                            <p className="text-stone-600">
                              <strong className="text-stone-800">Team:</strong> {sol.teamName}
                            </p>
                            <p className="text-stone-600 mt-0.5">
                              <strong className="text-stone-800">Lead:</strong> {sol.teamLead.name} ({sol.teamLead.email}) — {sol.teamLead.department}
                            </p>
                            {sol.teamMembers.length > 0 && (
                              <p className="text-stone-500 mt-0.5">
                                + {sol.teamMembers.length} additional team members
                              </p>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                              <User className="w-4 h-4 text-[#c48825]" />
                              Faculty Mentor
                            </div>
                            <p className="text-stone-700 font-semibold">{sol.facultyMentor.name}</p>
                            <p className="text-stone-500">{sol.facultyMentor.designation}</p>
                            <p className="text-stone-500">{sol.facultyMentor.email}</p>
                          </div>
                        </div>

                        {/* Summary & Technical Approach */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                            Executive Summary
                          </p>
                          <p className="text-sm text-stone-700 leading-relaxed">
                            {sol.summary}
                          </p>
                        </div>

                        {/* Technologies */}
                        {sol.technologiesUsed && sol.technologiesUsed.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-xs font-bold text-stone-500 mr-1">Stack:</span>
                            {sol.technologiesUsed.map((tech) => (
                              <span key={tech} className="px-2 py-0.5 text-xs font-medium bg-[#063028]/10 text-[#063028] rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* External Links & Evaluation Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                          <div className="flex flex-wrap items-center gap-3">
                            {sol.demoUrl && (
                              <a
                                href={sol.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Live Demo / Prototype
                              </a>
                            )}
                            {sol.attachmentUrl && (
                              <a
                                href={sol.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" /> {sol.documentName || 'Pitch Deck / Report'}
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenReview(sol)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#063028] hover:bg-[#063028]/90 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#c48825]" />
                            Evaluate &amp; Provide Feedback
                          </button>
                        </div>

                        {/* Current Feedback Callout */}
                        {sol.industryFeedback && (
                          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-[#063028] uppercase tracking-wider block">
                              Your Evaluator Feedback ({sol.reviewedAt ? new Date(sol.reviewedAt).toLocaleDateString() : 'Active'})
                            </span>
                            <p className="text-stone-700 italic">&quot;{sol.industryFeedback}&quot;</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Solution Review Modal */}
          {selectedSolutionForReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c48825]">
                      Industrial Evaluation
                    </span>
                    <h3 className="text-xl font-bold font-serif text-[#063028] mt-0.5">
                      {selectedSolutionForReview.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Submitted by <strong>{selectedSolutionForReview.teamName}</strong> ({selectedSolutionForReview.institutionName})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSolutionForReview(null)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Technical Methodology Review */}
                <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="font-bold text-stone-700 uppercase tracking-wider">Detailed Technical Approach:</div>
                  <p className="text-stone-700 whitespace-pre-line leading-relaxed font-mono text-xs">
                    {selectedSolutionForReview.detailedApproach}
                  </p>
                </div>

                <form onSubmit={handleSaveReview} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Evaluation Decision *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setReviewDecision('APPROVED')}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          reviewDecision === 'APPROVED'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 mb-1" />
                        <div>Shortlist / Pilot</div>
                        <div className="text-[10px] font-normal text-stone-500 mt-0.5">Solution meets criteria</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewDecision('REVISION_REQUESTED')}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          reviewDecision === 'REVISION_REQUESTED'
                            ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 mb-1" />
                        <div>Request Revision</div>
                        <div className="text-[10px] font-normal text-stone-500 mt-0.5">Needs clarification</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewDecision('REJECTED')}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          reviewDecision === 'REJECTED'
                            ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500/20'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <X className="w-4 h-4 text-red-600 mb-1" />
                        <div>Decline Solution</div>
                        <div className="text-[10px] font-normal text-stone-500 mt-0.5">Not viable for rollout</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Feedback &amp; Guidance for the Student Team
                    </label>
                    <textarea
                      rows={4}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Provide constructive technical notes, queries on prototype latency, or pilot testing instructions..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedSolutionForReview(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isReviewing}
                      className="px-5 py-2.5 rounded-xl bg-[#063028] hover:bg-[#063028]/90 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isReviewing ? 'Saving Evaluation...' : 'Save & Notify Institution'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM SECTION, REVIEW SECTION, SUCCESS SECTION WRAPPERS */}
      <div ref={formSectionRef} className="scroll-mt-6">
        
        {/* SUBMIT FORM VIEW */}
        {currentView === 'form' && (
          <div className="space-y-6 animate-fade-in" id="problem-form-section">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white py-3 px-5 rounded-2xl border border-stone-200/90">
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#063028] font-bold cursor-pointer">Dashboard</button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <span className="text-[#063028] font-extrabold">Submit Problem Statement</span>
            </nav>

            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 space-y-8 shadow-sm">
              <div className="border-b border-stone-200 pb-5">
                <h2 className="text-2xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                  <FileText className="h-6 w-6 text-[#c48825]" /> Post a Problem Statement
                </h2>
                <p className="text-sm text-stone-600 mt-1">Provide communication handles and parameters of your active physical or analytical challenge.</p>
              </div>

              <form onSubmit={handleReviewSubmission} className="space-y-8" id="problem-form">
                
                {/* Section A: Company Information */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 pb-2">
                    Company Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Company Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Tata Motors Ltd"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.companyName ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>}
                    </div>

                    {/* 2. Industry Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Industry Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={industryCategory}
                        onChange={(e) => setIndustryCategory(e.target.value)}
                        placeholder="e.g. Manufacturing"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.industryCategory ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.industryCategory && <p className="text-sm text-red-600 mt-1">{errors.industryCategory}</p>}
                    </div>

                    {/* 3. SPOC Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        SPOC / Representative Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={spocName}
                        onChange={(e) => setSpocName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.spocName ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.spocName && <p className="text-sm text-red-600 mt-1">{errors.spocName}</p>}
                    </div>

                    {/* 4. Official Email Address */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.email ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    {/* 5. Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.phone ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    {/* 6. Company Website URL */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Company Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="www.company.com"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.website ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
                    </div>
                  </div>
                </div>

                {/* Section B: Problem Statement Details */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 pb-2">
                    Problem Statement Specifications
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {/* 7. Problem Statement Title */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Problem Statement Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Automated Quality Defect Detection for Casting Dies"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                          errors.title ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.title ? (
                          <p className="text-sm text-red-600">{errors.title}</p>
                        ) : (
                          <p className="text-xs text-stone-500">Minimum 25 characters</p>
                        )}
                        <span className="text-xs text-stone-400 font-mono">{title.length} chars</span>
                      </div>
                    </div>

                    {/* 8. Problem Statement Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Problem Statement Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the operational challenge, environment parameters, and physical specifications."
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed ${
                          errors.description ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                    </div>

                    {/* 9. Expected Outcomes */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Expected Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={expectedOutcomes}
                        onChange={(e) => setExpectedOutcomes(e.target.value)}
                        placeholder="What benchmarks, accuracy metrics, or engineering deliverables must the solution satisfy?"
                        className={`block w-full px-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed ${
                          errors.expectedOutcomes ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                        }`}
                      />
                      {errors.expectedOutcomes && <p className="text-sm text-red-600 mt-1">{errors.expectedOutcomes}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* 10. Budget */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-stone-700">
                          Budget / Funding Offered <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <IndianRupee className="h-5 w-5" />
                          </span>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. Rs 5,00,000"
                            className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white ${
                              errors.budget ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                            }`}
                          />
                        </div>
                        {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget}</p>}
                      </div>

                      {/* 11. Deadline */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-stone-700">
                          Expected Solution Deadline <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                            <Calendar className="h-5 w-5" />
                          </span>
                          <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={`block w-full pl-11 pr-4 py-3 border rounded-xl text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#063028]/10 bg-white cursor-pointer ${
                              errors.deadline ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#063028]'
                            }`}
                          />
                        </div>
                        {errors.deadline && <p className="text-sm text-red-600 mt-1">{errors.deadline}</p>}
                      </div>
                    </div>

                    {/* 12. Supporting Documents / Attachments */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">
                        Supporting Documents / Attachments
                      </label>
                      
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                          dragOver 
                            ? 'border-[#063028] bg-[#edf4f0]' 
                            : attachedFile 
                            ? 'border-emerald-300 bg-emerald-50/20' 
                            : 'border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="file"
                          id="form-file-upload"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                        />

                        {attachedFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <div className="leading-tight">
                              <p className="text-base font-bold text-stone-900">{attachedFile.name}</p>
                              <p className="text-xs text-stone-500 font-mono">
                                ({attachedFile.size < 1024 * 1024 ? `${(attachedFile.size / 1024).toFixed(1)} KB` : `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`})
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeAttachedFile}
                              className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                            >
                              <X className="h-4 w-4" /> Remove File
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="form-file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                            <UploadCloud className="h-10 w-10 text-stone-400" />
                            <div>
                              <span className="text-base font-bold text-[#c48825] hover:text-[#a6711c] underline">Click to upload</span>
                              <span className="text-base text-stone-600"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-stone-500">Images (Max 2MB) &amp; PDF (Max 10MB)</p>
                          </label>
                        )}
                      </div>
                      
                      {errors.attachedFile && (
                        <p className="text-sm text-red-600 mt-1">{errors.attachedFile}</p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Form Buttons */}
                <div className="border-t border-stone-200 pt-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-stone-300 hover:bg-stone-50 rounded-xl text-sm font-bold text-stone-700 transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Reset Form
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView('dashboard')}
                      className="px-5 py-3 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#063028] hover:bg-[#04201a] text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Review Submission <Eye className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* REVIEW SUBMISSION VIEW */}
        {currentView === 'review' && (
          <div className="space-y-6 animate-fade-in" id="review-submission-section">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white py-3 px-5 rounded-2xl border border-stone-200/90">
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#063028] font-bold cursor-pointer">Dashboard</button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <button onClick={() => setCurrentView('form')} className="hover:text-[#063028] font-bold cursor-pointer">Submit Problem</button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <span className="text-[#063028] font-extrabold">Review Parameters</span>
            </nav>

            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 space-y-8 shadow-sm">
              <div className="border-b border-stone-200 pb-5">
                <h2 className="text-2xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                  <FileCheck className="h-6 w-6 text-emerald-700" /> Review Problem Statement Parameters
                </h2>
                <p className="text-sm text-stone-600 mt-1">Carefully review the proposed physical bottlenecks and corporate contact details before completing filing.</p>
              </div>

              <div className="space-y-8">
                
                {/* 1. Company Information Section */}
                <div className="bg-[#faf8f4] p-6 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-xs font-bold text-[#063028] uppercase tracking-wider border-b border-stone-200 pb-2">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Company Name</span>
                      <span className="font-bold text-stone-900 block mt-1">{companyName}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Industry Category</span>
                      <span className="font-semibold text-stone-800 block mt-1">{industryCategory}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">SPOC Name</span>
                      <span className="font-semibold text-stone-800 block mt-1">{spocName}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Official Email</span>
                      <span className="font-semibold text-stone-800 block mt-1">{email}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Phone Number</span>
                      <span className="font-semibold text-stone-800 block mt-1">{phone}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Company Website</span>
                      <span className="font-semibold text-stone-800 block mt-1">{website}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Problem Statement Parameters Section */}
                <div className="bg-[#faf8f4] p-6 rounded-2xl border border-stone-200 space-y-5">
                  <h3 className="text-xs font-bold text-[#063028] uppercase tracking-wider border-b border-stone-200 pb-2">
                    Problem Statement Parameters
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Problem Title</span>
                      <span className="font-bold text-[#063028] text-lg block mt-1">{title}</span>
                    </div>
                    
                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Detailed Description</span>
                      <div 
                        className="text-stone-700 leading-relaxed font-medium html-content mt-1 space-y-2 text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                      />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Expected Outcomes</span>
                      <div 
                        className="text-stone-700 leading-relaxed font-medium html-content mt-1 space-y-2 text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(expectedOutcomes) }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Allocated Budget</span>
                        <span className="font-bold text-stone-900 block mt-1">{budget}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Target Solution Deadline</span>
                        <span className="font-bold text-stone-900 block mt-1">{formatToDDMMYYYY(deadline)}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Uploaded Supporting Files</span>
                      {attachedFile ? (
                        <div className="mt-2 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-emerald-700" />
                            <span className="font-bold text-emerald-900 text-sm">{attachedFile.name}</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-700">({attachedFile.size < 1024 * 1024 ? `${(attachedFile.size / 1024).toFixed(1)} KB` : `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`})</span>
                        </div>
                      ) : (
                        <span className="text-stone-500 font-medium mt-1 block italic">No files attached</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms agreement notice */}
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-sm text-stone-700 leading-relaxed">
                  <strong className="text-stone-900">CII Disclaimer:</strong> Submitting this statement registers your challenge inside the official CII-SIC directory ledger. The parameters will be locked and sent directly to administrators for rapid distribution approvals.
                </div>

                {/* Review Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 border-t border-stone-200 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentView('form')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-sm font-bold text-stone-700 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Edit
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#063028] hover:bg-[#04201a] text-white text-sm font-bold rounded-xl cursor-pointer shadow-md transition-all"
                  >
                    Final Submit &amp; File Proposal <CheckCircle className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SUCCESS CONFIRMATION VIEW */}
        {currentView === 'success' && (
          <div className="space-y-6 animate-fade-in" id="success-section">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white py-3 px-5 rounded-2xl border border-stone-200/90">
              <button onClick={handleReturnToDashboard} className="hover:text-[#063028] font-bold cursor-pointer">Dashboard</button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <span className="text-[#063028] font-extrabold">Submission Successful</span>
            </nav>

            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
              <div className="space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center mb-2">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#063028] font-serif">
                  Submission Completed
                </h2>
                <p className="text-stone-700 text-base font-medium leading-relaxed max-w-md mx-auto">
                  Your problem statement has been submitted successfully and is queued for CII administrator review.
                </p>
              </div>

              {/* Success Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={handleSubmitAnother}
                  className="px-5 py-3.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-sm font-bold text-stone-700 transition-all cursor-pointer"
                >
                  Submit Another Statement
                </button>
                <button
                  onClick={handleReturnToDashboard}
                  className="px-6 py-3.5 bg-[#063028] hover:bg-[#04201a] text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => showToast('Password successfully updated!', 'success')}
      />
    </div>
  );
};
