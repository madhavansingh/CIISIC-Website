import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, FileText, Settings, ShieldAlert, ArrowLeft, CheckCircle, 
  XCircle, Clock, MessageSquare, Download, Calendar, Sparkles, AlertTriangle,
  Edit, Save, X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { sanitizeHTML } from '../lib/html';
import { fetchChallengeById } from '../lib/api';
import { getOriginalFileName } from '../lib/file';
import { ProblemStatement } from '../types';

export const SubmissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, submissions, updateSubmissionStatus, updateSubmission, showToast } = useApp();

  const [submission, setSubmission] = useState<ProblemStatement | null>(() => {
    return submissions.find((sub) => sub.id === id) || null;
  });
  const [isLoading, setIsLoading] = useState(!submission);
  const [error, setError] = useState<string | null>(null);

  const backLink = currentUser?.role === 'admin' ? '/admin/dashboard' : '/industry/dashboard';
  const backLinkText = currentUser?.role === 'admin' ? 'Back to Admin Command Ledger' : 'Back to Industry Workspace';

  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state
  const [editTitle, setEditTitle] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editIndustryCategory, setEditIndustryCategory] = useState('');
  const [editIndustrySector, setEditIndustrySector] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBusinessChallenge, setEditBusinessChallenge] = useState('');
  const [editExistingProcess, setEditExistingProcess] = useState('');
  const [editExpectedOutcome, setEditExpectedOutcome] = useState('');
  const [editProjectObjectives, setEditProjectObjectives] = useState('');
  const [editTechnologies, setEditTechnologies] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editBranches, setEditBranches] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Fetch challenge by ID on mount
  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchChallengeById(id);
        if (active) {
          setSubmission(data);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to load challenge details');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // Sync form states with loaded submission
  useEffect(() => {
    if (submission) {
      setRemarks(submission.reviewRemarks || '');
      setEditTitle(submission.details.title || '');
      setEditCompanyName(submission.company.companyName || '');
      setEditIndustryCategory(submission.company.industryName || '');
      setEditIndustrySector(submission.company.industrySector || '');
      setEditDescription(submission.details.description || '');
      setEditBusinessChallenge(submission.details.businessChallenge || '');
      setEditExistingProcess(submission.details.existingProcess || '');
      setEditExpectedOutcome(submission.details.expectedOutcome || '');
      setEditProjectObjectives(submission.details.projectObjectives || '');
      setEditTechnologies(submission.technical.requiredTechnologies.join(', ') || '');
      setEditSkills(submission.technical.requiredSkills.join(', ') || '');
      setEditBranches(submission.technical.preferredBranches.join(', ') || '');
      setEditDuration(submission.technical.expectedDuration || '');
    }
  }, [submission]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="h-20 bg-slate-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
            <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
          </div>
          <div className="lg:col-span-4 h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#0b2545] font-display">Submission Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The requested problem statement reference ID does not exist or has been removed."}</p>
        <Link to={backLink} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2545] bg-[#eef4f8] px-4 py-2 rounded-xl border border-blue-100">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateSubmissionStatus(submission.id, 'Approved', remarks.trim() || 'Approved by CII Administration.');
      setIsSubmitting(false);
      showToast(`Submission ${submission.id} has been APPROVED.`, 'success');
      navigate('/admin/dashboard');
    }, 600);
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      showToast('A review remark/rejection reason is required to reject a submission.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      updateSubmissionStatus(submission.id, 'Rejected', remarks.trim());
      setIsSubmitting(false);
      showToast(`Submission ${submission.id} has been REJECTED/RETURNED with reasons.`, 'info');
      navigate('/admin/dashboard');
    }, 600);
  };

  const handleSave = () => {
    if (!editTitle.trim() || editTitle.trim().length < 25) {
      showToast('Title must be at least 25 characters.', 'error');
      return;
    }
    if (!editDescription.trim() || editDescription.trim().length < 25) {
      showToast('Description must be at least 25 characters.', 'error');
      return;
    }

    const updatedSubmission = {
      ...submission,
      company: {
        ...submission.company,
        companyName: editCompanyName,
        industryName: editIndustryCategory,
        industrySector: editIndustrySector
      },
      details: {
        ...submission.details,
        title: editTitle,
        description: editDescription,
        businessChallenge: editBusinessChallenge,
        existingProcess: editExistingProcess,
        expectedOutcome: editExpectedOutcome,
        projectObjectives: editProjectObjectives
      },
      technical: {
        ...submission.technical,
        requiredTechnologies: editTechnologies.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredBranches: editBranches.split(',').map(s => s.trim()).filter(Boolean),
        expectedDuration: editDuration
      },
      editedByAdmin: true
    };

    updateSubmission(updatedSubmission);
    setIsEditing(false);
    showToast('Submission details updated and marked as Edited by CII Admin.', 'success');
  };

  const handleCancel = () => {
    setEditTitle(submission.details.title);
    setEditCompanyName(submission.company.companyName);
    setEditIndustryCategory(submission.company.industryName);
    setEditIndustrySector(submission.company.industrySector);
    setEditDescription(submission.details.description);
    setEditBusinessChallenge(submission.details.businessChallenge);
    setEditExistingProcess(submission.details.existingProcess);
    setEditExpectedOutcome(submission.details.expectedOutcome);
    setEditProjectObjectives(submission.details.projectObjectives);
    setEditTechnologies(submission.technical.requiredTechnologies.join(', '));
    setEditSkills(submission.technical.requiredSkills.join(', '));
    setEditBranches(submission.technical.preferredBranches.join(', '));
    setEditDuration(submission.technical.expectedDuration);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved for Distribution
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-4 w-4 text-red-600" /> Rejected / Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock className="h-4 w-4 text-amber-500" /> Pending Administrative Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title block with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1 flex-1">
          <Link to={backLink} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0b2545] transition-colors mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> {backLinkText}
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-black text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              REF ID: {submission.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">Submitted on: {new Date(submission.submittedDate).toLocaleString()}</span>
            {submission.editedByAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                Edited by CII Admin
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Filing Problem Statement Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-lg font-bold text-[#0b2545] bg-slate-50/50 focus:outline-none focus:border-[#0b2545]"
                placeholder="Problem statement title..."
              />
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-black text-[#0b2545] font-display tracking-tight mt-1 leading-tight">
              {submission.details.title}
            </h1>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {getStatusBadge(submission.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Details Sections) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Company Profile */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="h-5 w-5 text-[#8f6d3b]" /> Industry SPOC Profile
            </h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Company Name</span>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Industry category</span>
                  <input
                    type="text"
                    value={editIndustryCategory}
                    onChange={(e) => setEditIndustryCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Company Name</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{submission.company.companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Industry category</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{submission.company.industryName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SPOC Name</span>
                  <span className="font-semibold text-slate-700 block mt-0.5">{submission.company.representativeName} ({submission.company.designation})</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Information</span>
                  <span className="text-slate-600 block mt-0.5">{submission.company.email} • {submission.company.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Corporate website</span>
                  <a href={`https://${submission.company.website.replace(/https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#8f6d3b] hover:underline block mt-0.5 font-medium">{submission.company.website}</a>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Problem Statement */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-[#8f6d3b]" /> Problem Statement
            </h2>

            {isEditing ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Problem Statement Description</span>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed bg-slate-50/50"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Expected Outcome</span>
                  <textarea
                    rows={3}
                    value={editExpectedOutcome}
                    onChange={(e) => setEditExpectedOutcome(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Problem Statement Description</span>
                  <div 
                    className="text-slate-700 leading-relaxed font-medium html-content space-y-2 text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(submission.details.description) }}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Outcome</span>
                  <div 
                    className="text-slate-700 leading-relaxed font-medium html-content space-y-2 text-xs sm:text-sm"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(submission.details.expectedOutcome) }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Deliverables & Terms */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-[#0b2545] font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-[#8f6d3b]" /> Supporting Documents/Attachments
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expected Project Deliverables</span>
                <p className="text-slate-600 mt-1 leading-relaxed font-medium">{submission.additional.expectedDeliverables}</p>
              </div>

              {submission.additional.additionalNotes && (
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Additional Notes</span>
                  <p className="text-slate-600 mt-1 leading-relaxed font-medium italic">{submission.additional.additionalNotes}</p>
                </div>
              )}

              {/* Attachment Card & Preview Section */}
              {submission.additional.fileAttachmentName ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <span className="text-base shrink-0">📄</span>
                        <span className="truncate max-w-[200px] sm:max-w-md" title={getOriginalFileName(submission.additional.fileAttachmentName)}>
                          {getOriginalFileName(submission.additional.fileAttachmentName)}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Uploaded Successfully
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById("supporting-document-preview");
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white border border-slate-200 text-[#0b2545] hover:border-slate-300 hover:text-slate-850 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm transition-colors cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          if (submission.additional.fileAttachmentName.startsWith('http') || submission.additional.fileAttachmentName.startsWith('/')) {
                            window.open(submission.additional.fileAttachmentName, '_blank');
                          } else {
                            alert(`Initiating mock download: ${submission.additional.fileAttachmentName}`);
                          }
                        }}
                        className="bg-[#0b2545] text-white hover:bg-opacity-90 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                      <a 
                        href={submission.additional.fileAttachmentName} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-white border border-slate-200 text-[#0b2545] hover:border-slate-350 hover:text-slate-850 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm transition-all text-center inline-block"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                  
                  {/* Premium PDF preview iframe */}
                  {(submission.additional.fileAttachmentName.toLowerCase().endsWith('.pdf') || 
                    submission.additional.fileAttachmentName.includes('supabase.co')) && (
                    <div id="supporting-document-preview" className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner mt-4">
                      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                        Supporting Document
                      </div>
                      <iframe
                        src={submission.additional.fileAttachmentName}
                        className="w-full h-[480px] border-0"
                        title="PDF Preview"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-500 font-semibold italic text-center">
                  No additional data sheets or attachments filed with this statement.
                </div>
              )}

              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 text-[11px] text-slate-500 leading-normal flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Representative official declaration signed and verified. Intellectual property conditions acknowledged by organization.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Review remarks input / Filing Timeline) */}
        <div className="lg:col-span-4 space-y-6">
          {currentUser?.role === 'admin' ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 space-y-5 sticky top-24">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-[#8f6d3b]" /> Administrative Actions
              </h3>
              
              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Review remarks &amp; Instructions
                  </label>
                  <textarea
                    rows={5}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter comments detailing why this statement is being approved, or reasons and workarounds in case of rejection/return for revisions."
                    className="block w-full p-3.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0b2545] bg-slate-50/50 resize-y leading-relaxed"
                  ></textarea>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    These remarks will be displayed instantly on the Industry partner&apos;s workspace.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || isEditing}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-emerald-700/90 hover:bg-emerald-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Approve Statement
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isSubmitting || isEditing}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-red-700/90 hover:bg-red-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Reject &amp; Require Reason
                  </button>

                  <div className="pt-2 border-t border-slate-100">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#8f6d3b]" /> Edit Fields
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleSave}
                          className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#0b2545] hover:bg-[#134074] transition-all shadow-sm cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-sm cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">Review Status:</span>
                  <span className="font-bold text-slate-700 font-mono">{submission.status}</span>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-none p-6 space-y-5 sticky top-24">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-[#8f6d3b]" /> Submission Status
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Filing Timeline</span>
                  <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-5">
                    {/* Event 1 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 bg-emerald-500 text-white rounded-full p-0.5">
                        <CheckCircle className="h-2.5 w-2.5" />
                      </span>
                      <p className="text-xs font-bold text-slate-800">Statement Submitted</p>
                      <p className="text-[10px] text-slate-400">{new Date(submission.submittedDate).toLocaleDateString()}</p>
                    </div>

                    {/* Event 2 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-1 rounded-full p-0.5 ${
                        submission.status === 'Pending' ? 'bg-amber-400 text-white animate-pulse' : 'bg-emerald-500 text-white'
                      }`}>
                        {submission.status === 'Pending' ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                      </span>
                      <p className="text-xs font-bold text-slate-800">Filing Verification</p>
                      <p className="text-[10px] text-slate-400">Processed automatically</p>
                    </div>

                    {/* Event 3 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-1 rounded-full p-0.5 ${
                        submission.status === 'Pending' 
                          ? 'bg-slate-200 text-slate-400' 
                          : submission.status === 'Approved' 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {submission.status === 'Pending' ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                      </span>
                      <p className="text-xs font-bold text-slate-800">
                        {submission.status === 'Pending' 
                          ? 'CII Admin Review' 
                          : submission.status === 'Approved' 
                          ? 'Approved' 
                          : 'Returned for Revisions'
                        }
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {submission.status === 'Pending' ? 'Awaiting administrative approval' : 'Review completed'}
                      </p>
                    </div>
                  </div>
                </div>

                {submission.reviewRemarks && (
                  <div className="pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-black text-[#002147] uppercase tracking-wider block">CII Admin Remarks</span>
                    <p className="text-xs text-slate-600 italic font-medium leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50">
                      &quot;{submission.reviewRemarks}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
