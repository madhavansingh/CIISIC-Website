import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  Building2, ArrowLeft, Send, CheckCircle2, AlertCircle, 
  ExternalLink, Layers, FileText, Code2, Users, User,
  Plus, X, Award, ShieldCheck, Sparkles
} from 'lucide-react';
import { StudentTeamLead, StudentTeamMember, FacultyMentor } from '../types';

export const SubmitSolution: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('assignmentId');
  const navigate = useNavigate();
  const { challenges, assignments, user, submitSolution } = useApp();

  const challenge = challenges.find((c) => c.id === challengeId);
  const assignment = assignments.find((a) => a.id === assignmentId || a.challengeId === challengeId);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [detailedApproach, setDetailedApproach] = useState('');
  const [deliverablesDescription, setDeliverablesDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState<string[]>([]);
  const [demoUrl, setDemoUrl] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');

  // Team states (pre-populated from assignment if available)
  const [teamName, setTeamName] = useState(assignment?.teamName || '');
  const [teamLead, setTeamLead] = useState<StudentTeamLead>(
    assignment?.teamLead || {
      name: '',
      email: '',
      department: '',
      yearOfStudy: '',
      phone: '',
    }
  );
  const [teamMembers, setTeamMembers] = useState<StudentTeamMember[]>(
    assignment?.teamMembers || []
  );
  const [facultyMentor, setFacultyMentor] = useState<FacultyMentor>(
    assignment?.facultyMentor || {
      name: '',
      designation: '',
      email: '',
      phone: '',
    }
  );

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (assignment) {
      setTeamName(assignment.teamName);
      setTeamLead(assignment.teamLead);
      setTeamMembers(assignment.teamMembers || []);
      setFacultyMentor(assignment.facultyMentor);
    }
  }, [assignment]);

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !technologiesUsed.includes(trimmed)) {
      setTechnologiesUsed([...technologiesUsed, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologiesUsed(technologiesUsed.filter((t) => t !== tech));
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole.trim() || 'Team Member',
      },
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('');
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !summary.trim() || !detailedApproach.trim()) {
      setError('Please provide a solution title, executive summary, and detailed approach.');
      return;
    }

    if (!teamName.trim() || !teamLead.name.trim() || !teamLead.email.trim()) {
      setError('Please complete the team details with at least a team name, lead name, and lead email.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSolution({
        challengeId: challenge?.id || challengeId || 'CHAL-UNKNOWN',
        challengeTitle: challenge?.title || 'Industry Problem Statement',
        industryCompanyName: challenge?.industryCompanyName || 'CII Partner Industry',
        industrySector: challenge?.industrySector || 'Technology & Manufacturing',
        institutionId: user?.institutionId || assignment?.institutionId || 'INST-UNKNOWN',
        institutionName: user?.institutionName || assignment?.institutionName || 'Affiliated Institution',
        assignmentId: assignment?.id || assignmentId || undefined,
        teamName,
        teamLead,
        teamMembers,
        facultyMentor,
        title,
        summary,
        detailedApproach,
        technologiesUsed,
        deliverablesDescription: deliverablesDescription || 'Complete technical report, architecture diagrams, and prototype source code.',
        demoUrl: demoUrl || undefined,
        attachmentUrl: attachmentUrl || undefined,
        documentName: documentName || (attachmentUrl ? 'Solution_Proposal_Document.pdf' : undefined),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/institution/dashboard?tab=solutions');
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to submit solution proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!challenge && !challengeId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem Statement Not Found</h2>
        <p className="text-gray-600 mb-6">
          The challenge you are submitting a solution for could not be identified.
        </p>
        <Link
          to="/institution/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#063028] text-white font-medium hover:bg-[#063028]/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Institution Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Breadcrumb & Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/institution/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#063028] hover:text-[#c48825] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Institution Dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official CII-SIC Solution Submission
          </div>
        </div>

        {/* Challenge summary banner */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full pointer-events-none -z-0 opacity-60" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#063028]/10 text-[#063028]">
                {challenge?.industrySector || 'Industrial Challenge'}
              </span>
              <span className="text-xs font-medium text-gray-500">
                Posted by: <strong className="text-gray-800">{challenge?.industryCompanyName || 'Industry Partner'}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 mb-3">
              {challenge?.title || 'Industrial Problem Statement'}
            </h1>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {challenge?.description || 'Address this real-world industrial need with innovative academic research and student engineering.'}
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Solution Submitted Successfully!</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Your proposal has been dispatched to {challenge?.industryCompanyName || 'the industry partner'} and CII administrators for evaluation. Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Team & Faculty Details */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#c48825]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Institution & Student Team</h2>
                <p className="text-xs text-gray-500">
                  {user?.institutionName || assignment?.institutionName || 'Your academic institution'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Assigned Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Apex Robotics Lab"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Faculty Mentor Name
                </label>
                <input
                  type="text"
                  value={facultyMentor.name}
                  onChange={(e) => setFacultyMentor({ ...facultyMentor, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
              </div>
            </div>

            {/* Team Lead Sub-card */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#063028]" />
                Student Team Lead (SPOC)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={teamLead.name}
                    onChange={(e) => setTeamLead({ ...teamLead, name: e.target.value })}
                    placeholder="Student Lead Name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={teamLead.email}
                    onChange={(e) => setTeamLead({ ...teamLead, email: e.target.value })}
                    placeholder="student@univ.edu.in"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={teamLead.department}
                    onChange={(e) => setTeamLead({ ...teamLead, department: e.target.value })}
                    placeholder="e.g. Mechanical / CSE"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                </div>
              </div>
            </div>

            {/* Additional Members */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Team Co-Investigators / Members ({teamMembers.length})
              </label>
              
              {teamMembers.length > 0 && (
                <div className="space-y-2 mb-3">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg text-xs">
                      <div>
                        <span className="font-semibold text-gray-900">{member.name}</span>
                        <span className="text-gray-500 ml-2">({member.email})</span>
                        {member.role && <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-gray-600">{member.role}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Member Name"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Member Email"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (e.g. Firmware)"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Member
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Proposed Solution Architecture */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#063028]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Technical Solution Proposal</h2>
                <p className="text-xs text-gray-500">Provide an in-depth breakdown of your proposed engineering approach</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Solution Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Edge AI-Powered Defect Classification Pipeline with Sub-100ms Latency"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Executive Summary *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  High-level overview of the solution, its feasibility, and expected impact for {challenge?.industryCompanyName || 'the industry partner'}.
                </p>
                <textarea
                  required
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide a concise 2-3 paragraph summary detailing how this solution solves the industrial bottleneck..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Detailed Technical Methodology & Architecture *
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Detail the system architecture, mathematical models, algorithms, hardware components, and implementation roadmap.
                </p>
                <textarea
                  required
                  rows={6}
                  value={detailedApproach}
                  onChange={(e) => setDetailedApproach(e.target.value)}
                  placeholder="1. System Architecture:
2. Algorithmic Formulation & Data Pipeline:
3. Hardware / Sensor Integration:
4. Validation & Testing Protocols:
5. Scalability & Deployment Considerations:"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028] leading-relaxed font-mono text-xs"
                />
              </div>

              {/* Technologies Used (Chips) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Core Technologies & Frameworks
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {technologiesUsed.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#063028]/10 text-[#063028] text-xs font-semibold"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="Type technology & press Enter (e.g. PyTorch, ROS2, LoRaWAN)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Deliverables & Artifacts Description
                </label>
                <textarea
                  rows={3}
                  value={deliverablesDescription}
                  onChange={(e) => setDeliverablesDescription(e.target.value)}
                  placeholder="e.g. Functional prototype code repository, CAD drawings (STEP files), BOM (Bill of Materials), and test validation report."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#063028]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Links & Prototype Documentation */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Prototypes, Repository & Attachments</h2>
                <p className="text-xs text-gray-500">Provide direct links to working demos, source repositories, or presentations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Working Prototype / GitHub / Video URL
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://github.com/team/project or https://youtu.be/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Detailed Pitch Deck / Report (Drive or Cloud Link)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#063028]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submission Action Card */}
          <div className="bg-gradient-to-r from-[#063028] to-[#0b483c] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <Award className="w-5 h-5 text-[#c48825]" />
                Ready to submit for Industry Review?
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
                Once submitted, {challenge?.industryCompanyName || 'the industry partner'} and CII-SIC committee members will receive instant access to evaluate your team’s proposal.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/institution/dashboard"
                className="w-1/2 sm:w-auto text-center px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-[#c48825] hover:bg-[#b0781e] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Proposal
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SubmitSolution;
