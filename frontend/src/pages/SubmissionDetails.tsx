import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, FileText, Settings, ShieldAlert, ArrowLeft, CheckCircle, 
  XCircle, Clock, MessageSquare, AlertTriangle,
  Edit, Save, X, Wrench, Share2, Printer, Copy, GraduationCap, CheckCircle2
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

  const backLink = currentUser?.role === 'admin' 
    ? '/admin/dashboard' 
    : currentUser?.role === 'industry'
    ? '/industry/dashboard'
    : '/problem-statements';
  const backLinkText = currentUser?.role === 'admin' 
    ? 'Back to Admin Command Ledger' 
    : currentUser?.role === 'industry'
    ? 'Back to Industry Workspace'
    : 'Back to Problem Statements Directory';

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
      } catch (err: unknown) {
        if (active) {
          const message = err instanceof Error ? err.message : 'Failed to load challenge details';
          setError(message);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-10 bg-stone-200 rounded-xl w-1/3"></div>
        <div className="h-20 bg-stone-200 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-48 bg-stone-200 rounded-3xl"></div>
            <div className="h-64 bg-stone-200 rounded-3xl"></div>
          </div>
          <div className="lg:col-span-4 h-96 bg-stone-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-[#063028] font-serif">Submission Not Found</h2>
        <p className="text-base text-stone-600">{error || "The requested problem statement reference ID does not exist or has been removed."}</p>
        <Link to={backLink} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#063028] px-5 py-2.5 rounded-xl hover:bg-[#04201a]">
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> Approved for Distribution
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="h-4 w-4 text-red-600" /> Returned / Revisions Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="h-4 w-4 text-amber-600 animate-pulse" /> Pending Administrative Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Title block with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2 flex-1">
          <Link to={backLink} className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:text-[#063028] transition-colors mb-1">
            <ArrowLeft className="h-4 w-4" /> {backLinkText}
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold text-[#063028] bg-[#edf4f0] border border-[#063028]/20 px-2.5 py-1 rounded">
              REF ID: {submission.id}
            </span>
            <span className="text-xs text-stone-500 font-medium">Submitted on {new Date(submission.submittedDate).toLocaleString()}</span>
            {submission.editedByAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                Edited by CII Admin
              </span>
            )}
          </div>
          {isEditing ? (
            <div className="mt-3">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Problem Statement Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-xl text-lg font-bold text-[#063028] bg-white focus:outline-none focus:border-[#063028]"
                placeholder="Problem statement title..."
              />
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#063028] font-serif tracking-tight mt-1 leading-tight">
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
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#063028] font-serif flex items-center gap-2 border-b border-stone-100 pb-3">
              <Building2 className="h-5 w-5 text-[#c48825]" /> Industry SPOC Profile
            </h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Company Name</span>
                  <input
                    type="text"
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Industry category</span>
                  <input
                    type="text"
                    value={editIndustryCategory}
                    onChange={(e) => setEditIndustryCategory(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Company Name</span>
                  <span className="font-bold text-stone-900 text-base block mt-1">{submission.company.companyName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Industry category</span>
                  <span className="font-semibold text-stone-800 text-base block mt-1">{submission.company.industryName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">SPOC Name</span>
                  <span className="font-semibold text-stone-800 text-base block mt-1">{submission.company.representativeName} ({submission.company.designation})</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Contact Information</span>
                  <span className="text-stone-700 text-base block mt-1">{submission.company.email} • {submission.company.phone}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Corporate website</span>
                  <a href={`https://${submission.company.website.replace(/https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-[#c48825] hover:text-[#a6711c] hover:underline block mt-1 font-medium text-base">{submission.company.website}</a>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Problem Statement */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#063028] font-serif flex items-center gap-2 border-b border-stone-100 pb-3">
              <FileText className="h-5 w-5 text-[#c48825]" /> Problem Statement
            </h2>

            {isEditing ? (
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Problem Statement Description</span>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-xl text-sm leading-relaxed bg-white"
                  />
                </div>

                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">Expected Outcome</span>
                  <textarea
                    rows={3}
                    value={editExpectedOutcome}
                    onChange={(e) => setEditExpectedOutcome(e.target.value)}
                    className="w-full p-3 border border-stone-300 rounded-xl text-sm leading-relaxed bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-sm sm:text-base">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Problem Statement Description</span>
                  <div 
                    className="text-stone-700 leading-relaxed font-medium html-content space-y-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(submission.details.description) }}
                  />
                </div>

                <div className="space-y-1 pt-2 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Expected Outcome</span>
                  <div 
                    className="text-stone-700 leading-relaxed font-medium html-content space-y-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(submission.details.expectedOutcome) }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Technical Specifications */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#063028] font-serif flex items-center gap-2 border-b border-stone-100 pb-3">
              <Wrench className="h-5 w-5 text-[#c48825]" /> Technical Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm sm:text-base">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Required Technologies</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {submission.technical.requiredTechnologies.map((tech, idx) => (
                    <span key={idx} className="bg-[#edf4f0] text-[#063028] border border-[#063028]/20 px-2.5 py-1 rounded text-xs font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Key Skillsets</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {submission.technical.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Target Engineering Branches</span>
                <p className="text-stone-800 font-semibold mt-1">
                  {submission.technical.preferredBranches.join(', ') || 'All Relevant Engineering Disciplines'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Project Timeline / Difficulty</span>
                <p className="text-stone-800 font-semibold mt-1">
                  {submission.technical.expectedDuration} • {submission.technical.difficultyLevel} Tier
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Supporting Documents / Attachments */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#063028] font-serif flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-[#c48825]" /> Supporting Documents &amp; Deliverables
            </h2>

            <div className="space-y-5 text-sm sm:text-base">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Expected Project Deliverables</span>
                <p className="text-stone-700 mt-1 leading-relaxed font-medium">{submission.additional.expectedDeliverables}</p>
              </div>

              {submission.additional.additionalNotes && (
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Additional Notes &amp; Funding</span>
                  <p className="text-stone-700 mt-1 leading-relaxed font-medium italic">{submission.additional.additionalNotes}</p>
                </div>
              )}

              {/* Attachment Card & Preview Section */}
              {submission.additional.fileAttachmentName ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#faf8f4] rounded-2xl border border-stone-200">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-base font-bold text-stone-800">
                        <span className="shrink-0">📄</span>
                        <span className="truncate max-w-[200px] sm:max-w-md" title={getOriginalFileName(submission.additional.fileAttachmentName)}>
                          {getOriginalFileName(submission.additional.fileAttachmentName)}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Uploaded Successfully
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById("supporting-document-preview");
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white border border-stone-300 text-[#063028] hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          if (submission.additional.fileAttachmentName.startsWith('http') || submission.additional.fileAttachmentName.startsWith('/')) {
                            window.open(submission.additional.fileAttachmentName, '_blank');
                          } else {
                            showToast(`Initiating download for ${submission.additional.fileAttachmentName}`, 'info');
                          }
                        }}
                        className="bg-[#063028] text-white hover:bg-[#04201a] px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                      <a 
                        href={submission.additional.fileAttachmentName} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-white border border-stone-300 text-[#063028] hover:bg-stone-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all text-center inline-block"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                  
                  {/* Premium PDF preview iframe */}
                  {(submission.additional.fileAttachmentName.toLowerCase().endsWith('.pdf') || 
                    submission.additional.fileAttachmentName.includes('supabase.co')) && (
                    <div id="supporting-document-preview" className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 shadow-inner mt-4">
                      <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 text-xs font-bold text-stone-700">
                        Supporting Document Preview
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
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-sm text-stone-500 font-medium italic text-center">
                  No additional data sheets or attachments filed with this statement.
                </div>
              )}

              <div className="p-4 bg-[#edf4f0]/60 rounded-2xl border border-[#063028]/10 text-xs text-stone-700 leading-normal flex items-start gap-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>Representative official declaration signed and verified. Intellectual property conditions acknowledged by organization under CII guidelines.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Review remarks input / Filing Timeline) */}
        <div className="lg:col-span-4 space-y-6">
          {currentUser?.role === 'admin' ? (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-5 sticky top-24">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#c48825]" /> Administrative Actions
              </h3>
              
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Review remarks &amp; Instructions
                  </label>
                  <textarea
                    rows={5}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter review comments detailing approval conditions, or specific reasons for returning/revising."
                    className="block w-full p-3.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#063028] bg-white resize-y leading-relaxed text-stone-900"
                  ></textarea>
                  <p className="text-xs text-stone-500 leading-normal">
                    These remarks will be displayed instantly on the Industry partner&apos;s workspace.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting || isEditing}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Approve Statement
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isSubmitting || isEditing}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-700 hover:bg-red-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Reject &amp; Require Reason
                  </button>

                  <div className="pt-2 border-t border-stone-100">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl text-sm font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-300 transition-all shadow-xs cursor-pointer"
                      >
                        <Edit className="h-4 w-4 text-[#c48825]" /> Edit Fields
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleSave}
                          className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all shadow-xs cursor-pointer"
                        >
                          <Save className="h-4 w-4" /> Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex justify-center items-center gap-1 py-3 px-3 rounded-xl text-sm font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all shadow-xs cursor-pointer"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-between text-sm text-stone-500">
                  <span className="font-semibold">Review Status:</span>
                  <span className="font-bold text-stone-800 font-mono">{submission.status}</span>
                </div>

              </div>
            </div>
          ) : currentUser?.role === 'industry' ? (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-5 sticky top-24">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 pb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#c48825]" /> Submission Status
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Filing Timeline</span>
                  <div className="relative border-l-2 border-stone-200 pl-4 ml-2 space-y-5">
                    {/* Event 1 */}
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 bg-emerald-600 text-white rounded-full p-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </span>
                      <p className="text-sm font-bold text-stone-800">Statement Submitted</p>
                      <p className="text-xs text-stone-500">{new Date(submission.submittedDate).toLocaleDateString()}</p>
                    </div>

                    {/* Event 2 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-1 rounded-full p-0.5 ${
                        submission.status === 'Pending' ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-600 text-white'
                      }`}>
                        {submission.status === 'Pending' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3 text-white" />}
                      </span>
                      <p className="text-sm font-bold text-stone-800">Filing Verification</p>
                      <p className="text-xs text-stone-500">Processed automatically</p>
                    </div>

                    {/* Event 3 */}
                    <div className="relative">
                      <span className={`absolute -left-[21px] top-1 rounded-full p-0.5 ${
                        submission.status === 'Pending' 
                          ? 'bg-stone-200 text-stone-500' 
                          : submission.status === 'Approved' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {submission.status === 'Pending' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      </span>
                      <p className="text-sm font-bold text-stone-800">
                        {submission.status === 'Pending' 
                          ? 'CII Admin Review' 
                          : submission.status === 'Approved' 
                          ? 'Approved for Distribution' 
                          : 'Returned for Revisions'
                        }
                      </p>
                      <p className="text-xs text-stone-500">
                        {submission.status === 'Pending' ? 'Awaiting administrative action' : 'Review completed'}
                      </p>
                    </div>
                  </div>
                </div>

                {submission.reviewRemarks && (
                  <div className="pt-3 border-t border-stone-100 space-y-1">
                    <span className="text-xs font-bold text-[#063028] uppercase tracking-wider block">CII Admin Remarks</span>
                    <p className="text-sm text-stone-700 italic font-medium leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                      &quot;{submission.reviewRemarks}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Public Visitor / Student / Faculty Actions Panel */
            <div className="space-y-6 sticky top-24">
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#c48825]" /> Innovation Challenge
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Challenge
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#063028] font-serif">
                    Interested in Solving this Challenge?
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Students from partner institutions can collaborate with faculty mentors to build a working prototype addressing this industry problem statement.
                  </p>
                  <ul className="space-y-2 text-xs text-stone-700 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c48825] mt-1.5 shrink-0"></span>
                      <span>Form a multidisciplinary student team (2-4 members)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c48825] mt-1.5 shrink-0"></span>
                      <span>Connect with your college CII Innovation SPOC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c48825] mt-1.5 shrink-0"></span>
                      <span>Submit your solution abstract for CII Industry evaluation</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 space-y-2.5 border-t border-stone-100">
                  {currentUser?.role === 'institution' ? (
                    <>
                      <Link
                        to={`/institution/dashboard?assignChallengeId=${submission.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#063028] hover:bg-[#04201a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                      >
                        <GraduationCap className="h-4 w-4 text-[#c48825]" /> Assign to Student Team
                      </Link>
                      <Link
                        to={`/institution/submit-solution/${submission.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#c48825] hover:bg-[#b0781e] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                      >
                        Submit Solution Proposal
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/institution/login?redirect=/institution/dashboard?assignChallengeId=${submission.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#063028] hover:bg-[#04201a] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                      >
                        <GraduationCap className="h-4 w-4 text-[#c48825]" /> Institution / Team Login to Assign
                      </Link>
                      <Link
                        to="/institutions"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-all"
                      >
                        Browse Partner Institutions
                      </Link>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast('Problem statement link copied to clipboard!', 'success');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5 text-stone-500" /> Share Link
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5 text-stone-500" /> Print Brief
                    </button>
                  </div>
                </div>
              </div>

              {/* Secretariat Support Card */}
              <div className="bg-[#faf8f4] rounded-2xl border border-stone-200/90 p-5 space-y-2 text-xs text-stone-600">
                <span className="font-bold text-[#063028] block">Corporate R&amp;D Inquiries</span>
                <p>
                  Industrial enterprise seeking to collaborate or modify this problem statement? Contact the CII Secretariat at{' '}
                  <a href="mailto:contact@ciisic.org" className="text-[#c48825] font-bold hover:underline">
                    contact@ciisic.org
                  </a>.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
