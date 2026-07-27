import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, PlusCircle, CheckCircle, Clock, AlertTriangle, FileText, 
  User, Mail, Phone, Globe, Briefcase, ChevronRight, FileCheck, X,
  Calendar, DollarSign, UploadCloud, ArrowLeft, RefreshCw, Eye, Download
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { sanitizeHTML, stripHTML } from '../lib/html';
import { uploadFile } from '../lib/api';
import { getOriginalFileName } from '../lib/file';

export const IndustryDashboard: React.FC = () => {
  const { currentUser, submissions, addSubmission, showToast } = useApp();
  
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Pending Approval
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
      const { attachedFile, ...rest } = prev;
      return rest;
    });
    setAttachedFile(file);
    showToast(`File attached: ${file.name}`, 'info');
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setErrors(prev => {
      const { attachedFile, ...rest } = prev;
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
      showToast('Validation failed. Please correct the inline errors.', 'error');
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
          projectObjectives: `1. Analyze parameters for ${title}.\n2. Build a highly reliable engineering prototype.\n3. Verify operational safety against standard metrics.`
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
    } catch (err) {
      showToast('Failed to final-submit the problem statement.', 'error');
    }
  };

  const handleReturnToDashboard = () => {
    // Clear custom form fields except user details
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
    // Keep user details but clear statement details
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

  console.log('currentUser:', currentUser);
  console.log('submissions:', submissions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header - Welcome back (NOT inside a card) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border-b border-slate-100 pb-6" id="dashboard-header">
        <div className="space-y-2.5 min-w-0 flex-1">
          <div className="space-y-0.5">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Welcome Back,</p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#002147] tracking-tight font-display flex items-center gap-2 flex-wrap break-words break-all">
              <span>{currentUser?.name || 'Industry Partner'}</span>
            </h1>
          </div>
        </div>

        {/* Primary Action Button */}
        {currentView === 'dashboard' && (
          <button
            onClick={() => {
              setCurrentView('form');
              scrollToForm();
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#002147] hover:bg-[#0056b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
            id="primary-action-btn"
          >
            <PlusCircle className="h-4 w-4" /> Submit Problem Statement
          </button>
        )}
      </div>

      {/* Corporate Profile Summary - Responsive Grid Layout */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/20 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4" id="profile-summary">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-[#0056b3]" /> Corporate Profile Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          {/* Company Name */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Company Name</span>
            <p className="font-bold text-[#002147] text-base break-words break-all">{currentUser?.companyName || 'Tata Motors Ltd'}</p>
          </div>

          {/* Industry Category */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Industry Category</span>
            <p className="font-bold text-[#002147] text-base break-words break-all">Automotive & Manufacturing</p>
          </div>

          {/* SPOC Name */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">SPOC Name</span>
            <p className="font-bold text-[#002147] text-base break-words break-all">{currentUser?.name || 'Rajesh Sharma'}</p>
          </div>

          {/* Official Email */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Official Email</span>
            <p className="font-semibold text-slate-700 truncate break-all">{currentUser?.email || 'industry@cii.in'}</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Phone Number</span>
            <p className="font-semibold text-slate-700 break-words break-all">+91 98765 43210</p>
          </div>

          {/* Website */}
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Website</span>
            <p className="font-semibold text-slate-700 truncate">
              <a href="https://www.tatamotors.com" target="_blank" rel="noopener noreferrer" className="text-[#0056b3] hover:underline flex items-center gap-1 break-all">
                www.tatamotors.com <Globe className="h-3 w-3 inline shrink-0" />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD VIEW - Filed Statements ledger */}
      {currentView === 'dashboard' && (
        <div className="space-y-6 animate-fade-in" id="dashboard-ledger">
          {/* Submissions Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-none">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Submissions</div>
              <div className="text-2xl font-black text-[#002147] mt-0.5 font-display">{stats.total}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-none">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Approved</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5 font-display">{stats.approved}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-none">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Rejected</div>
              <div className="text-2xl font-black text-red-600 mt-0.5 font-display">{stats.rejected}</div>
            </div>
          </div>

          {/* Table/List Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#002147] font-display">
                Submitted Proposals
              </h2>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Showing {mySubmissions.length} Statements
              </span>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-700 text-sm">No Problem Statements Filed Yet</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Get started by creating your first problem statement to receive solutions from engineering institutions.</p>
                </div>
                <button
                  onClick={() => setCurrentView('form')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#002147] rounded-xl hover:bg-[#0056b3] transition-all cursor-pointer shadow-sm"
                >
                  <PlusCircle className="h-4 w-4" /> Propose First Statement
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((sub) => (
                  <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-none space-y-4 hover:border-slate-300 transition-all duration-150">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">REF ID: {sub.id}</span>
                          <span className="text-xs text-slate-400 font-medium">{new Date(sub.submittedDate).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#002147] hover:text-[#0056b3] transition-colors mt-1 break-words break-all">
                          {sub.details.title}
                        </h3>
                      </div>
                      <div className="shrink-0">{getStatusBadge(sub.status)}</div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed break-words break-all">
                      {stripHTML(sub.details.description)}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] bg-slate-50 border border-slate-200/60 text-slate-500 font-semibold px-2 py-0.5 rounded font-mono">
                          {sub.technical.difficultyLevel} Tier
                        </span>
                        <span className="text-[10px] bg-[#f0f5fa] text-[#0056b3] font-semibold px-2 py-0.5 rounded">
                          {sub.company.industrySector}
                        </span>
                        {sub.additional.fileAttachmentName && (
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold max-w-[180px] sm:max-w-[300px]">
                            <span>📄</span>
                            <a
                              href={sub.additional.fileAttachmentName}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0056b3] hover:underline truncate"
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
                              className="p-0.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 transition-colors shrink-0"
                              title="Download file"
                            >
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <Link 
                        to={`/details/${sub.id}`} 
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0056b3] hover:underline"
                      >
                        View Full Details <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* Admin remarks display */}
                    {sub.reviewRemarks && (
                      <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/30 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#002147] block">CII Administrator Remarks</span>
                        <p className="text-xs text-slate-600 leading-normal italic font-medium">
                          &quot;{sub.reviewRemarks}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FORM SECTION, REVIEW SECTION, SUCCESS SECTION WRAPPERS */}
      <div ref={formSectionRef} className="scroll-mt-6">
        
        {/* SUBMIT FORM VIEW */}
        {currentView === 'form' && (
          <div className="space-y-6 animate-fade-in" id="problem-form-section">
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/50 py-2.5 px-4 rounded-xl border border-slate-200/50">
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#002147] cursor-pointer">Dashboard</button>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-[#002147] font-black">Submit Problem Statement</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-black text-[#002147] font-display flex items-center gap-2">
                  <FileText className="h-5.5 w-5.5 text-[#0056b3]" /> Post a Problem Statement
                </h2>
                <p className="text-xs text-slate-500">Provide official communication handles and parameters of your active physical or analytical challenge.</p>
              </div>

              <form onSubmit={handleReviewSubmission} className="space-y-8" id="problem-form">
                
                {/* Section A: Company Information */}
                <div className="space-y-5">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Company Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Company Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Tata Motors Ltd"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.companyName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.companyName && <p className="text-xs text-red-500 font-medium mt-1">{errors.companyName}</p>}
                    </div>

                    {/* 2. Industry Category */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Industry Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={industryCategory}
                        onChange={(e) => setIndustryCategory(e.target.value)}
                        placeholder="e.g. Manufacturing"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.industryCategory ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.industryCategory && <p className="text-xs text-red-500 font-medium mt-1">{errors.industryCategory}</p>}
                    </div>

                    {/* 3. SPOC Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        SPOC Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={spocName}
                        onChange={(e) => setSpocName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.spocName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.spocName && <p className="text-xs text-red-500 font-medium mt-1">{errors.spocName}</p>}
                    </div>

                    {/* 4. Official Email Address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Official Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
                    </div>

                    {/* 5. Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.phone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
                    </div>

                    {/* 6. Company Website URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Company Website URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="www.company.com"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.website ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.website && <p className="text-xs text-red-500 font-medium mt-1">{errors.website}</p>}
                    </div>
                  </div>
                </div>

                {/* Section B: Problem Statement Details */}
                <div className="space-y-5">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Problem Statement Specifications
                  </h3>

                  <div className="grid grid-cols-1 gap-6">
                    {/* 7. Problem Statement Title */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Problem Statement Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Short descriptive title of the challenge"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                          errors.title ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.title ? (
                          <p className="text-xs text-red-500 font-medium">{errors.title}</p>
                        ) : (
                          <p className="text-[10px] text-slate-400">Min 25 characters</p>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{title.length} chars</span>
                      </div>
                    </div>

                    {/* 8. Problem Statement Description */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Problem Statement Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the core operational or physical engineering bottleneck inside your production line, environment parameters, and systems used."
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 resize-y leading-relaxed ${
                          errors.description ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.description && <p className="text-xs text-red-500 font-medium mt-1">{errors.description}</p>}
                    </div>

                    {/* 9. Expected Outcomes */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Expected Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={expectedOutcomes}
                        onChange={(e) => setExpectedOutcomes(e.target.value)}
                        placeholder="What physical benchmarks, accuracy metrics, or engineering deliverables must the final academic solution satisfy?"
                        className={`block w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 resize-y leading-relaxed ${
                          errors.expectedOutcomes ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                        }`}
                      />
                      {errors.expectedOutcomes && <p className="text-xs text-red-500 font-medium mt-1">{errors.expectedOutcomes}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* 10. Budget */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Budget / Funding Offered <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. Rs 5,00,000"
                            className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 ${
                              errors.budget ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          {errors.budget && (
                            <p className="text-xs text-red-500 font-medium">{errors.budget}</p>
                          )}
                        </div>
                      </div>

                      {/* 11. Deadline */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Expected Solution Deadline <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10 transition-all font-medium bg-slate-50/50 cursor-pointer ${
                              errors.deadline ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-[#0056b3]'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          {errors.deadline ? (
                            <p className="text-xs text-red-500 font-medium">{errors.deadline}</p>
                          ) : (
                            <p className="text-[10px] text-slate-400">Format: DD/MM/YYYY</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 12. Supporting Documents / Attachments */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Supporting Documents / Attachments
                      </label>
                      
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-150 ${
                          dragOver 
                            ? 'border-[#0056b3] bg-blue-50/40' 
                            : attachedFile 
                            ? 'border-emerald-300 bg-emerald-50/10' 
                            : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50'
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
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <div className="leading-tight">
                              <p className="text-sm font-bold text-slate-800">{attachedFile.name}</p>
                              <p className="text-xs text-slate-500 font-mono">
                                ({attachedFile.size < 1024 * 1024 ? `${(attachedFile.size / 1024).toFixed(1)} KB` : `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`})
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeAttachedFile}
                              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
                            >
                              <X className="h-3 w-3" /> Remove File
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="form-file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                            <UploadCloud className="h-10 w-10 text-slate-400" />
                            <div>
                              <span className="text-sm font-bold text-[#0056b3] hover:underline">Click to upload</span>
                              <span className="text-sm text-slate-500"> or drag and drop</span>
                            </div>
                            <p className="text-[10px] text-slate-400">Images (Max 2MB) &amp; PDF (Max 10MB)</p>
                          </label>
                        )}
                      </div>
                      
                      {errors.attachedFile && (
                        <p className="text-xs text-red-500 font-medium mt-1">{errors.attachedFile}</p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Form Buttons */}
                <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Form
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView('dashboard')}
                      className="px-5 py-3 border border-transparent hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#002147] hover:bg-[#0056b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Review Submission <Eye className="h-4 w-4" />
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
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/50 py-2.5 px-4 rounded-xl border border-slate-200/50">
              <button onClick={() => setCurrentView('dashboard')} className="hover:text-[#002147] cursor-pointer">Dashboard</button>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <button onClick={() => setCurrentView('form')} className="hover:text-[#002147] cursor-pointer">Submit Problem Statement</button>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-[#002147] font-black">Review Parameters</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-xl font-black text-[#002147] font-display flex items-center gap-2">
                  <FileCheck className="h-5.5 w-5.5 text-emerald-600" /> Review Problem Statement Parameters
                </h2>
                <p className="text-xs text-slate-500">Carefully review the proposed physical bottlenecks and corporate contact details before completing filing.</p>
              </div>

              <div className="space-y-8">
                
                {/* 1. Company Information Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-4">
                  <h3 className="text-xs font-black text-[#002147] uppercase tracking-wider border-b border-slate-200 pb-2">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Company Name</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{companyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Industry Category</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{industryCategory}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">SPOC Name</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{spocName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Official Email</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Phone Number</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Company Website</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{website}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Problem Statement Parameters Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-150 space-y-5">
                  <h3 className="text-xs font-black text-[#002147] uppercase tracking-wider border-b border-slate-200 pb-2">
                    Problem Statement Parameters
                  </h3>
                  
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Problem Title</span>
                      <span className="font-bold text-slate-800 text-base block mt-0.5">{title}</span>
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Detailed Description</span>
                      <div 
                        className="text-slate-700 leading-relaxed font-medium html-content mt-1 space-y-2 text-xs sm:text-sm"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Expected Outcomes</span>
                      <div 
                        className="text-slate-700 leading-relaxed font-medium html-content mt-1 space-y-2 text-xs sm:text-sm"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(expectedOutcomes) }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Allocated Budget</span>
                        <span className="font-bold text-slate-800 block mt-0.5">{budget}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Target Solution Deadline</span>
                        <span className="font-bold text-slate-800 block mt-0.5">{formatToDDMMYYYY(deadline)}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Uploaded Supporting Files</span>
                      {attachedFile ? (
                        <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-emerald-600" />
                            <span className="font-bold text-emerald-800 text-xs">{attachedFile.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-600">({attachedFile.size < 1024 * 1024 ? `${(attachedFile.size / 1024).toFixed(1)} KB` : `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB`})</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium mt-1 block italic">No files attached</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms agreement notice */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/50 text-xs text-slate-600 leading-normal">
                  <strong className="text-slate-800">CII Disclaimer:</strong> Clicking Final Submit registers this challenge inside the official CII-SIC directory ledger. The parameters will be locked and sent directly to administrators for rapid distribution approvals.
                </div>

                {/* Review Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-150 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentView('form')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Edit
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl cursor-pointer shadow-md transition-all"
                  >
                    Final Submit &amp; File Proposal <CheckCircle className="h-4 w-4" />
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
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/50 py-2.5 px-4 rounded-xl border border-slate-200/50">
              <button onClick={handleReturnToDashboard} className="hover:text-[#002147] cursor-pointer">Dashboard</button>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-[#002147] font-black">Submission Successful</span>
            </nav>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
              {/* Minimal Clean Message (NO illustrations, animations, or submission icons as per specification) */}
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-[#002147] font-display">
                  Submission Completed
                </h2>
                <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-md mx-auto">
                  "Your problem statement has been submitted successfully."
                </p>
              </div>

              {/* Success Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={handleSubmitAnother}
                  className="px-5 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Submit Another Problem Statement
                </button>
                <button
                  onClick={handleReturnToDashboard}
                  className="px-6 py-3.5 bg-[#002147] hover:bg-[#0056b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
