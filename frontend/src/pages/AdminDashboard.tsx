import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle, AlertTriangle, Search, 
  ChevronLeft, ChevronRight, Eye, Check, X, 
  SlidersHorizontal, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { stripHTML } from '../lib/html';

export const AdminDashboard: React.FC = () => {
  const { submissions, updateSubmissionStatus, showToast, currentUser } = useApp();

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

  // Compute metrics cards
  const metrics = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'Pending').length,
      approved: submissions.filter(s => s.status === 'Approved').length,
      rejected: submissions.filter(s => s.status === 'Rejected').length
    };
  }, [submissions]);

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
            Conduct administrative reviews, download technical attachments, and issue decisions on filed research statements.
          </p>
        </div>
      </div>

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

    </div>
  );
};
