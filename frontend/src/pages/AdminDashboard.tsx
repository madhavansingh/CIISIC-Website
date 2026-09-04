import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle, AlertTriangle, Search, 
  ChevronLeft, ChevronRight, Eye, Check, X, 
  SlidersHorizontal, LayoutDashboard, GraduationCap, Building2,
  ExternalLink, Clock, Sparkles, MessageSquare, User, Lock, ShieldCheck, Filter, AlertCircle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { stripHTML } from '../lib/html';
import { SolutionStatus, SolutionSubmission } from '../types';
import { fetchAdminRegistrations, reviewRegistration, RegistrationItem } from '../lib/api';
import { ChangePasswordModal } from '../components/common/ChangePasswordModal';

export const AdminDashboard: React.FC = () => {
  const { submissions, updateSubmissionStatus, showToast, currentUser, solutions, reviewSolution } = useApp();

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState<'challenges' | 'solutions' | 'registrations'>('challenges');

  // Registrations state
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [regStatusFilter, setRegStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [regRoleFilter, setRegRoleFilter] = useState<'ALL' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC'>('ALL');
  const [isProcessingReg, setIsProcessingReg] = useState<string | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const loadRegistrations = async () => {
    const list = await fetchAdminRegistrations();
    setRegistrations(list);
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const handleApproveRegistration = async (id: string, name: string) => {
    setIsProcessingReg(id);
    try {
      await reviewRegistration(id, 'APPROVE');
      showToast(`Approved registration for ${name}. They can now log in directly without approval.`, 'success');
      await loadRegistrations();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve registration', 'error');
    } finally {
      setIsProcessingReg(null);
    }
  };

  const handleRejectRegistration = async (id: string, name: string) => {
    setIsProcessingReg(id);
    try {
      await reviewRegistration(id, 'REJECT', rejectRemarks);
      showToast(`Registration for ${name} rejected.`, 'info');
      setRejectModalId(null);
      setRejectRemarks('');
      await loadRegistrations();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject registration', 'error');
    } finally {
      setIsProcessingReg(null);
    }
  };

  const pendingRegCount = useMemo(() => {
    return registrations.filter(r => r.approvalStatus === 'PENDING').length;
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    let list = [...registrations];
    if (regStatusFilter !== 'ALL') {
      list = list.filter(r => r.approvalStatus === regStatusFilter);
    }
    if (regRoleFilter !== 'ALL') {
      list = list.filter(r => r.role === regRoleFilter);
    }
    return list;
  }, [registrations, regStatusFilter, regRoleFilter]);

  // Solution search & filter state
  const [solutionSearch, setSolutionSearch] = useState('');
  const [solutionStatusFilter, setSolutionStatusFilter] = useState<string>('All');
  const [selectedSolutionForReview, setSelectedSolutionForReview] = useState<SolutionSubmission | null>(null);
  const [adminDecision, setAdminDecision] = useState<SolutionStatus>('APPROVED');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [isAdminReviewing, setIsAdminReviewing] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Extract all unique sectors for the filter dropdown
  const uniqueSectors = useMemo(() => {
    const sectors = submissions.map(s => s.company.industrySector);
    return ['All', ...Array.from(new Set(sectors))];
  }, [submissions]);

  // Compute metrics cards for problem statements
  const metrics = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'Pending').length,
      approved: submissions.filter(s => s.status === 'Approved').length,
      rejected: submissions.filter(s => s.status === 'Rejected').length
    };
  }, [submissions]);

  // Compute metrics for institutional solutions
  const solutionMetrics = useMemo(() => {
    return {
      total: solutions.length,
      underReview: solutions.filter(s => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED').length,
      approved: solutions.filter(s => s.status === 'APPROVED').length,
      revisions: solutions.filter(s => s.status === 'REVISION_REQUESTED').length,
      rejected: solutions.filter(s => s.status === 'REJECTED').length,
    };
  }, [solutions]);

  // Process solutions search & filter
  const processedSolutions = useMemo(() => {
    let result = [...solutions];
    if (solutionSearch.trim() !== '') {
      const q = solutionSearch.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.institutionName.toLowerCase().includes(q) ||
          s.teamName.toLowerCase().includes(q) ||
          s.challengeTitle.toLowerCase().includes(q) ||
          s.industryCompanyName.toLowerCase().includes(q)
      );
    }
    if (solutionStatusFilter !== 'All') {
      result = result.filter(s => s.status === solutionStatusFilter);
    }
    return result;
  }, [solutions, solutionSearch, solutionStatusFilter]);

  const handleOpenAdminReview = (sol: SolutionSubmission) => {
    setSelectedSolutionForReview(sol);
    setAdminDecision(sol.status === 'SUBMITTED' ? 'APPROVED' : sol.status);
    setAdminFeedback(sol.industryFeedback || '');
  };

  const handleSaveAdminReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutionForReview) return;
    setIsAdminReviewing(true);
    try {
      await reviewSolution(selectedSolutionForReview.id, adminDecision, adminFeedback);
      showToast(`Solution marked as ${adminDecision.replace('_', ' ')}.`, 'success');
      setSelectedSolutionForReview(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update review.', 'error');
    } finally {
      setIsAdminReviewing(false);
    }
  };

  // Process search, filters, and sort
  const processedSubmissions = useMemo(() => {
    let result = [...submissions];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => 
          s.details.title.toLowerCase().includes(q) ||
          s.company.companyName.toLowerCase().includes(q) ||
          s.company.representativeName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Sector filter
    if (sectorFilter !== 'All') {
      result = result.filter(s => s.company.industrySector === sectorFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      }
      if (sortBy === 'date-desc') {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
      if (sortBy === 'title-asc') {
        return a.details.title.localeCompare(b.details.title);
      }
      return 0;
    });

    return result;
  }, [submissions, searchQuery, statusFilter, sectorFilter, sortBy]);

  // Paginated subset
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [processedSubmissions, currentPage]);

  const totalPages = Math.ceil(processedSubmissions.length / itemsPerPage) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Quick Action handlers
  const handleQuickApprove = (id: string) => {
    updateSubmissionStatus(id, 'Approved', 'Approved via Admin Review.');
    showToast(`Submission ${id} Approved successfully!`, 'success');
  };

  const handleQuickReject = (id: string) => {
    updateSubmissionStatus(id, 'Rejected', 'Rejected via Admin Review.');
    showToast(`Submission ${id} marked as Rejected.`, 'info');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Check className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <X className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#edf4f0] text-[#063028]">
              <LayoutDashboard className="h-6 w-6 text-[#063028]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#063028] font-serif tracking-tight">
              Welcome back, {currentUser?.name || 'Admin'}
            </h1>
          </div>
          <p className="text-base text-stone-600 leading-relaxed pl-1">
            Review partner registrations, approve industry problem statements, and track university solution proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <Lock className="w-4 h-4 text-[#c48825]" /> Change Password
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-6 mb-8 overflow-x-auto">
        <button
          onClick={() => setAdminTab('challenges')}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'challenges'
              ? 'text-[#063028] border-b-2 border-[#063028]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          Industry Problem Statements
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#edf4f0] text-[#063028]">
            {submissions.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('solutions')}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'solutions'
              ? 'text-[#063028] border-b-2 border-[#063028]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Institutional Solutions Pipeline
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {solutions.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('registrations')}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            adminTab === 'registrations'
              ? 'text-[#063028] border-b-2 border-[#063028]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Partner Registrations
          {pendingRegCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
              {pendingRegCount} Pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
              {registrations.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INDUSTRY CHALLENGES */}
      {adminTab === 'challenges' && (
        <>
          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Submissions</div>
            <div className="text-3xl font-extrabold text-[#063028] font-serif leading-none">{metrics.total}</div>
          </div>
          <div className="p-3 bg-[#edf4f0] text-[#063028] rounded-xl"><FileText className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Approved</div>
            <div className="text-3xl font-extrabold text-emerald-700 font-serif leading-none">{metrics.approved}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl"><CheckCircle className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Rejected</div>
            <div className="text-3xl font-extrabold text-red-700 font-serif leading-none">{metrics.rejected}</div>
          </div>
          <div className="p-3 bg-red-50 text-red-700 rounded-xl"><AlertTriangle className="h-6 w-6" /></div>
        </div>

      </div>

      {/* Query Filter panel */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by Title, Ref ID, Company Name, or Representative..."
              className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
            />
          </div>

          {/* Sorting and Filter dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 font-semibold focus:outline-none focus:border-[#063028] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sectorFilter}
              onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
              className="px-4 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 font-semibold focus:outline-none focus:border-[#063028] cursor-pointer"
            >
              {uniqueSectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector === 'All' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 font-semibold focus:outline-none focus:border-[#063028] cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>

          </div>

        </div>
      </div>

      {/* Main Submissions Ledger Table/Grid */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        
        {processedSubmissions.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <SlidersHorizontal className="h-12 w-12 text-stone-300 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-stone-800 text-base">No Matching Results Found</p>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">Try refining your keyword search or filter criteria.</p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); setSectorFilter('All'); }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-bold text-[#063028] border border-stone-200 cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase font-bold tracking-wider font-mono">
                    <th className="px-6 py-4">Filing ID &amp; Date</th>
                    <th className="px-6 py-4">Filing Corporation</th>
                    <th className="px-6 py-4">Problem Statement Title</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 text-sm">
                  {paginatedSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors group">
                      
                      {/* Filing ID & Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col leading-tight">
                          <span className="font-mono font-bold text-[#063028] text-sm">{sub.id}</span>
                          <span className="text-xs text-stone-500 mt-1">{new Date(sub.submittedDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Filing Corporation */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-xs">
                          <span className="font-bold text-stone-900 text-base leading-tight">{sub.company.companyName}</span>
                          <span className="text-xs text-stone-500 mt-0.5 truncate">{sub.company.representativeName} • {sub.company.email}</span>
                          <span className="text-xs text-[#c48825] font-bold mt-1 uppercase tracking-wide">{sub.company.industrySector}</span>
                        </div>
                      </td>

                      {/* Problem Title */}
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-bold text-[#063028] text-base line-clamp-1 leading-normal">
                            {sub.details.title}
                          </p>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-1 leading-relaxed">{stripHTML(sub.details.description)}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {getStatusBadge(sub.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/details/${sub.id}`}
                            className="p-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-700 hover:bg-[#063028] hover:text-white transition-all shadow-xs"
                            title="View Full Details"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </Link>
                          
                          {sub.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(sub.id)}
                                className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-xs cursor-pointer"
                                title="Approve Problem"
                              >
                                <Check className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleQuickReject(sub.id)}
                                className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-xs cursor-pointer"
                                title="Reject Problem"
                              >
                                <X className="h-4.5 w-4.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stack Cards View */}
            <div className="block md:hidden divide-y divide-stone-100">
              {paginatedSubmissions.map((sub) => (
                <div key={sub.id} className="p-5 space-y-4">
                  
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono font-bold text-stone-400">ID: {sub.id}</span>
                      <h3 className="font-bold text-stone-900 text-base leading-snug">{sub.details.title}</h3>
                    </div>
                    <div className="shrink-0">{getStatusBadge(sub.status)}</div>
                  </div>

                  <div className="text-sm text-stone-600 space-y-1">
                    <p><strong className="text-stone-800">Company:</strong> {sub.company.companyName}</p>
                    <p><strong className="text-stone-800">Sector:</strong> {sub.company.industrySector}</p>
                    <p><strong className="text-stone-800">Representative:</strong> {sub.company.representativeName}</p>
                    <p><strong className="text-stone-800">Filing Date:</strong> {new Date(sub.submittedDate).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-stone-100">
                    <span className="text-xs text-stone-500 font-mono">{new Date(sub.submittedDate).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/details/${sub.id}`}
                        className="px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-sm font-bold text-[#063028] flex items-center gap-1.5"
                      >
                        <Eye className="h-4 w-4" /> View
                      </Link>
                      {sub.status === 'Pending' && (
                        <button
                          onClick={() => handleQuickApprove(sub.id)}
                          className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="border-t border-stone-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4 bg-stone-50/70">
                <span className="text-sm text-stone-600 font-medium">
                  Showing page {currentPage} of {totalPages} ({processedSubmissions.length} statements matching query)
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`h-9 w-9 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? 'bg-[#063028] border-[#063028] text-white shadow-xs'
                          : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

          </>
        )}

      </div>
      </>
      )}

      {/* TAB 2: INSTITUTIONAL SOLUTIONS PIPELINE */}
      {adminTab === 'solutions' && (
        <div className="space-y-8 animate-fade-in">
          {/* Solution Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Solutions</div>
                <div className="text-3xl font-extrabold text-[#063028] font-serif leading-none">{solutionMetrics.total}</div>
              </div>
              <div className="p-3 bg-[#edf4f0] text-[#063028] rounded-xl"><GraduationCap className="h-6 w-6" /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Under Review</div>
                <div className="text-3xl font-extrabold text-blue-700 font-serif leading-none">{solutionMetrics.underReview}</div>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><Clock className="h-6 w-6" /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Approved / Shortlisted</div>
                <div className="text-3xl font-extrabold text-emerald-700 font-serif leading-none">{solutionMetrics.approved}</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl"><CheckCircle className="h-6 w-6" /></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Revisions Requested</div>
                <div className="text-3xl font-extrabold text-amber-700 font-serif leading-none">{solutionMetrics.revisions}</div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl"><AlertTriangle className="h-6 w-6" /></div>
            </div>
          </div>

          {/* Solutions Search & Status Filter */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={solutionSearch}
                onChange={(e) => setSolutionSearch(e.target.value)}
                placeholder="Search solutions by team, institution, problem title, or industry partner..."
                className="block w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={solutionStatusFilter}
                onChange={(e) => setSolutionStatusFilter(e.target.value)}
                className="px-4 py-3 border border-stone-300 rounded-xl text-sm bg-white text-stone-800 font-semibold focus:outline-none focus:border-[#063028] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved / Shortlisted</option>
                <option value="REVISION_REQUESTED">Revision Requested</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Solutions List */}
          {processedSolutions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
              <GraduationCap className="h-12 w-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">No Institutional Solutions Found</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                No solutions currently match your search criteria. As academic teams submit solutions against CII industry challenges, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedSolutions.map((sol) => (
                <div key={sol.id} className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-4 hover:border-stone-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#063028] bg-[#edf4f0] px-2 py-0.5 rounded">
                          Challenge: {sol.challengeTitle}
                        </span>
                        <span className="text-xs text-stone-500">
                          Industry: <strong>{sol.industryCompanyName}</strong>
                        </span>
                        <span className="text-xs text-stone-400">
                          • Submitted on {new Date(sol.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#063028] font-serif mt-1">
                        {sol.title}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        sol.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        sol.status === 'REVISION_REQUESTED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        sol.status === 'REJECTED' ? 'bg-red-50 text-red-800 border border-red-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {sol.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Institution and Team info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                        <GraduationCap className="w-4 h-4 text-[#063028]" />
                        {sol.institutionName}
                      </div>
                      <p className="text-stone-600">
                        <strong>Team:</strong> {sol.teamName} | <strong>Lead:</strong> {sol.teamLead.name} ({sol.teamLead.email})
                      </p>
                      <p className="text-stone-500 mt-0.5">
                        Dept: {sol.teamLead.department} • Year: {sol.teamLead.yearOfStudy}
                      </p>
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                        <User className="w-4 h-4 text-[#c48825]" />
                        Faculty Mentor
                      </div>
                      <p className="text-stone-700 font-semibold">{sol.facultyMentor.name}</p>
                      <p className="text-stone-500">{sol.facultyMentor.designation} • {sol.facultyMentor.email}</p>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {sol.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100">
                    <div className="flex flex-wrap items-center gap-3">
                      {sol.demoUrl && (
                        <a
                          href={sol.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Working Demo / Prototype
                        </a>
                      )}
                      {sol.attachmentUrl && (
                        <a
                          href={sol.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" /> Pitch Report
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenAdminReview(sol)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#063028] text-white text-xs font-bold hover:bg-[#063028]/90 transition-all cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#c48825]" />
                      Moderate &amp; Set Status
                    </button>
                  </div>

                  {sol.industryFeedback && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                      <span className="font-bold text-[#063028] block mb-0.5">Recorded Review Notes:</span>
                      <p className="text-stone-700 italic">&quot;{sol.industryFeedback}&quot;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Admin Review / Moderation Modal */}
          {selectedSolutionForReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl border border-stone-200 max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c48825]">
                      CII Admin Solution Moderation
                    </span>
                    <h3 className="text-lg font-bold font-serif text-[#063028] mt-0.5">
                      {selectedSolutionForReview.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSolutionForReview(null)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <p><strong>Team:</strong> {selectedSolutionForReview.teamName} ({selectedSolutionForReview.institutionName})</p>
                  <p><strong>Challenge:</strong> {selectedSolutionForReview.challengeTitle}</p>
                </div>

                <form onSubmit={handleSaveAdminReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Set Moderation Status *
                    </label>
                    <select
                      value={adminDecision}
                      onChange={(e) => setAdminDecision(e.target.value as SolutionStatus)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                    >
                      <option value="APPROVED">Approved / Shortlisted for Pilot</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="REVISION_REQUESTED">Revision Requested</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Admin Moderation Remarks
                    </label>
                    <textarea
                      rows={4}
                      value={adminFeedback}
                      onChange={(e) => setAdminFeedback(e.target.value)}
                      placeholder="Official notes from the CII committee..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedSolutionForReview(null)}
                      className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdminReviewing}
                      className="px-5 py-2 rounded-xl bg-[#063028] hover:bg-[#063028]/90 text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
                    >
                      {isAdminReviewing ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PARTNER REGISTRATIONS REVIEW */}
      {adminTab === 'registrations' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</div>
                <div className="text-3xl font-extrabold text-amber-700 font-serif leading-none">
                  {registrations.filter(r => r.approvalStatus === 'PENDING').length}
                </div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Industry Partners</div>
                <div className="text-3xl font-extrabold text-[#063028] font-serif leading-none">
                  {registrations.filter(r => r.role === 'INDUSTRY_SPOC').length}
                </div>
              </div>
              <div className="p-3 bg-[#edf4f0] text-[#063028] rounded-xl">
                <Building2 className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Academic Institutions</div>
                <div className="text-3xl font-extrabold text-stone-800 font-serif leading-none">
                  {registrations.filter(r => r.role === 'INSTITUTION_SPOC').length}
                </div>
              </div>
              <div className="p-3 bg-stone-100 text-stone-700 rounded-xl">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1 pr-2">Status:</span>
              {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRegStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    regStatusFilter === st
                      ? 'bg-[#063028] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'PENDING' ? 'Pending Approval' : st === 'APPROVED' ? 'Approved' : st === 'REJECTED' ? 'Rejected' : 'All'}
                  <span className="ml-1.5 opacity-70">
                    ({st === 'ALL' ? registrations.length : registrations.filter(r => r.approvalStatus === st).length})
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Type:</span>
              <select
                value={regRoleFilter}
                onChange={(e) => setRegRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#063028] bg-white"
              >
                <option value="ALL">All Partners</option>
                <option value="INDUSTRY_SPOC">Industry Enterprises</option>
                <option value="INSTITUTION_SPOC">Academic Institutions</option>
              </select>
            </div>
          </div>

          {/* Registration List */}
          {filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-700">No registrations found</h3>
              <p className="text-xs text-stone-500">
                {regStatusFilter === 'PENDING'
                  ? 'There are currently no pending industry or academic registrations awaiting review.'
                  : 'Try selecting a different filter above.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((reg) => {
                const isIndustry = reg.role === 'INDUSTRY_SPOC';
                const isPending = reg.approvalStatus === 'PENDING';
                const isApproved = reg.approvalStatus === 'APPROVED';
                const isRejected = reg.approvalStatus === 'REJECTED';
                const isProcessing = isProcessingReg === reg.id;

                return (
                  <div
                    key={reg.id}
                    className={`bg-white rounded-2xl border transition-all p-6 space-y-4 ${
                      isPending
                        ? 'border-amber-300 shadow-xs'
                        : isApproved
                        ? 'border-emerald-200/90'
                        : 'border-stone-200 opacity-80'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isIndustry
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}>
                          {isIndustry ? <Building2 className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                          {isIndustry ? 'Industry Enterprise' : 'Academic Institution'}
                        </span>

                        <h3 className="text-lg font-bold font-serif text-[#063028]">
                          {reg.entityName}
                        </h3>

                        {reg.isCIIMember && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#edf4f0] text-[#063028] border border-[#063028]/15">
                            CII Member
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved & Active
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-300 flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-red-600" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Authorized SPOC</span>
                        <p className="font-semibold text-stone-900 text-sm">{reg.name}</p>
                        <p className="text-stone-500">{reg.designation || 'Representative'}</p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Official Contact</span>
                        <p className="font-medium text-stone-800 truncate">{reg.email}</p>
                        <p className="text-stone-500">{isIndustry ? 'Enterprise Portal' : reg.department || 'Academic Cell'}</p>
                      </div>

                      <div>
                        <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Sector / Region</span>
                        <p className="font-medium text-stone-800">{reg.industrySector || reg.institutionCity || 'Madhya Pradesh'}</p>
                        {reg.websiteUrl && (
                          <a
                            href={reg.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#c48825] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            Visit Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div>
                        <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Applied Date</span>
                        <p className="font-medium text-stone-800">
                          {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-stone-400 text-[11px]">
                          {new Date(reg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 flex-wrap gap-3">
                      <div className="text-xs text-stone-500">
                        {isPending && 'Requires CII Admin verification before portal login & problem statement creation.'}
                        {isApproved && 'Account approved. User can log in with their credentials directly without further approval.'}
                        {isRejected && 'Account rejected. Access to portal restricted.'}
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() => setRejectModalId(reg.id)}
                              disabled={isProcessing}
                              className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveRegistration(reg.id, reg.entityName)}
                              disabled={isProcessing}
                              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {isProcessing ? 'Approving...' : 'Approve Registration'}
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            onClick={() => setRejectModalId(reg.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-red-700 hover:bg-red-50 text-xs font-medium transition-all cursor-pointer"
                          >
                            Revoke Approval
                          </button>
                        )}

                        {isRejected && (
                          <button
                            onClick={() => handleApproveRegistration(reg.id, reg.entityName)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reject Remarks Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-red-700 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-base font-serif">Reject Registration</h3>
              <button
                onClick={() => { setRejectModalId(null); setRejectRemarks(''); }}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-stone-600">
                Are you sure you want to reject this registration? You can specify optional remarks explaining the reason to the applicant.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Rejection Remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  placeholder="e.g. Incomplete corporate verification details or invalid registration number."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setRejectModalId(null); setRejectRemarks(''); }}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectRegistration(rejectModalId, 'Partner')}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => showToast('Password successfully updated!', 'success')}
      />

    </div>
  );
};
