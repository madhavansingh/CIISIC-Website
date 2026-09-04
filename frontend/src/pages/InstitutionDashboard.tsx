import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Building2, Users, FileText, CheckCircle2, 
  Clock, ArrowRight, Search, Plus, ExternalLink, AlertCircle, 
  Layers, Sparkles, Filter, ChevronRight, Check, X, Eye, Send, Award, Lock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ProblemStatement, ProblemAssignment, SolutionSubmission } from '../types';
import { ChangePasswordModal } from '../components/common/ChangePasswordModal';

export const InstitutionDashboard: React.FC = () => {
  const { currentUser, submissions, assignments, solutions, assignChallenge, showToast } = useApp();
  const navigate = useNavigate();

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Active Tab: 'available' | 'assignments' | 'solutions'
  const [activeTab, setActiveTab] = useState<'available' | 'assignments' | 'solutions'>('available');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  // Assign Team Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedChallengeForAssign, setSelectedChallengeForAssign] = useState<ProblemStatement | null>(null);
  
  // Assignment Form State
  const [teamName, setTeamName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadDepartment, setLeadDepartment] = useState('Computer Science');
  const [leadYear, setLeadYear] = useState('3rd Year UG');
  const [membersInput, setMembersInput] = useState(''); // Comma or newline separated
  const [mentorName, setMentorName] = useState(currentUser?.name || '');
  const [mentorDesignation, setMentorDesignation] = useState(currentUser?.designation || 'Associate Professor');
  const [mentorEmail, setMentorEmail] = useState(currentUser?.email || '');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignError, setAssignError] = useState('');

  // Solution View Details Modal
  const [viewSolutionModal, setViewSolutionModal] = useState<SolutionSubmission | null>(null);

  // Available approved challenges
  const approvedChallenges = useMemo(() => {
    return submissions.filter(s => s.status === 'Approved');
  }, [submissions]);

  // Unique sectors for filtering
  const sectors = useMemo(() => {
    const list = approvedChallenges.map(c => c.company.industrySector || c.company.industryName).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [approvedChallenges]);

  // Filtered available challenges
  const filteredAvailable = useMemo(() => {
    return approvedChallenges.filter(c => {
      if (selectedSector !== 'All') {
        const sec = (c.company.industrySector || c.company.industryName || '').toLowerCase();
        if (!sec.includes(selectedSector.toLowerCase())) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.details.title.toLowerCase().includes(q) ||
          c.company.companyName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [approvedChallenges, selectedSector, searchQuery]);

  // Current institution's assignments
  const institutionAssignments = useMemo(() => {
    return assignments.filter(a => 
      !currentUser?.institutionName || 
      a.institutionName.toLowerCase() === currentUser.institutionName.toLowerCase()
    );
  }, [assignments, currentUser]);

  // Current institution's submitted solutions
  const institutionSolutions = useMemo(() => {
    return solutions.filter(s => 
      !currentUser?.institutionName || 
      s.institutionName.toLowerCase() === currentUser.institutionName.toLowerCase()
    );
  }, [solutions, currentUser]);

  // Open modal for a specific challenge
  const handleOpenAssignModal = (challenge: ProblemStatement) => {
    setSelectedChallengeForAssign(challenge);
    setTeamName('');
    setLeadName('');
    setLeadEmail('');
    setMembersInput('');
    setAssignError('');
    setIsAssignModalOpen(true);
  };

  // Submit Team Assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError('');

    if (!selectedChallengeForAssign) return;
    if (!teamName || !leadName || !leadEmail) {
      setAssignError('Please provide team name, lead name, and student email.');
      return;
    }

    // Parse team members
    const membersList = membersInput
      .split(/[\n,]+/)
      .map(m => m.trim())
      .filter(Boolean)
      .map(nameOrEmail => ({
        name: nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail,
        email: nameOrEmail.includes('@') ? nameOrEmail : `${nameOrEmail.toLowerCase().replace(/\s+/g, '')}@student.edu`,
      }));

    try {
      await assignChallenge({
        challengeId: selectedChallengeForAssign.id,
        challengeTitle: selectedChallengeForAssign.details.title,
        industryCompanyName: selectedChallengeForAssign.company.companyName,
        industrySector: selectedChallengeForAssign.company.industrySector,
        institutionId: currentUser?.id || 'inst_01',
        institutionName: currentUser?.institutionName || 'Partner Institution',
        teamName,
        teamLead: {
          name: leadName,
          email: leadEmail,
          department: leadDepartment,
          yearOfStudy: leadYear,
        },
        teamMembers: membersList,
        facultyMentor: {
          name: mentorName,
          designation: mentorDesignation,
          email: mentorEmail,
        },
        notes: assignmentNotes,
      });

      setIsAssignModalOpen(false);
      setActiveTab('assignments');
    } catch (err: any) {
      setAssignError(err.message || 'Failed to create team assignment.');
    }
  };

  return (
    <div className="bg-[#faf8f4] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <GraduationCap className="w-80 h-80 text-[#063028]" />
          </div>

          <div className="space-y-3 relative z-10 text-left max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#edf4f0] text-[#063028] border border-[#063028]/15">
                Institution Innovation Portal
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold text-stone-600 bg-stone-100">
                {currentUser?.institutionCity || 'Madhya Pradesh'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063028] font-serif tracking-tight">
              {currentUser?.institutionName || 'Partner Academic Institution'}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Coordinator: <strong className="text-stone-800 font-semibold">{currentUser?.name || 'Academic SPOC'}</strong> • {currentUser?.designation || 'Innovation Cell Lead'} ({currentUser?.department || 'R&D Cell'})
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10 flex-wrap">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white text-stone-700 border border-stone-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-stone-50 transition-all shadow-2xs cursor-pointer"
            >
              <Lock className="h-4 w-4 text-[#c48825]" /> Change Password
            </button>
            <Link
              to="/problem-statements"
              className="inline-flex items-center gap-2 px-4 py-3 bg-[#063028] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#04201a] transition-all shadow-2xs"
            >
              <Search className="h-4 w-4" /> Browse Problems
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Available Problems</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#063028] font-serif">{approvedChallenges.length}</p>
            <p className="text-[11px] text-stone-500">Open for institutional adoption</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c48825]">Assigned Teams</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#c48825] font-serif">{institutionAssignments.length}</p>
            <p className="text-[11px] text-stone-500">Student teams actively working</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Solutions Submitted</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#063028] font-serif">{institutionSolutions.length}</p>
            <p className="text-[11px] text-stone-500">Sent to industry partners</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">Approved Solutions</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-700 font-serif">
              {institutionSolutions.filter(s => s.status === 'APPROVED').length}
            </p>
            <p className="text-[11px] text-stone-500">Shortlisted by corporate sponsors</p>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="border-b border-stone-200 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'available'
                ? 'border-[#063028] text-[#063028] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="h-4 w-4" /> Available Problem Statements ({approvedChallenges.length})
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'border-[#063028] text-[#063028] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="h-4 w-4" /> My Assigned Teams ({institutionAssignments.length})
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'solutions'
                ? 'border-[#063028] text-[#063028] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="h-4 w-4" /> Submitted Solutions &amp; Reviews ({institutionSolutions.length})
          </button>
        </div>

        {/* TAB 1: AVAILABLE PROBLEM STATEMENTS */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {/* Search & Sector Filters */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96 text-left">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search challenges, keywords, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#063028]"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-stone-500 whitespace-nowrap">Sector:</span>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl text-xs font-semibold bg-white text-stone-800 focus:outline-none focus:border-[#063028] cursor-pointer"
                >
                  {sectors.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Challenges List */}
            {filteredAvailable.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-stone-400 mx-auto" />
                <h3 className="text-lg font-bold text-stone-800">No Open Challenges Found</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  There are currently no approved challenges matching your query. Industry partners post new problems regularly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAvailable.map(challenge => {
                  const existingAssignment = institutionAssignments.find(a => a.challengeId === challenge.id);
                  return (
                    <div 
                      key={challenge.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs hover:border-[#063028] transition-all flex flex-col justify-between text-left space-y-5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#edf4f0] text-[#063028] border border-[#063028]/15">
                            {challenge.company.industrySector || challenge.company.industryName}
                          </span>
                          <span className="text-xs font-mono text-stone-500">{challenge.id}</span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#c48825] uppercase tracking-wider">{challenge.company.companyName}</p>
                          <h3 className="text-lg font-bold text-stone-900 font-serif leading-snug mt-1">
                            {challenge.details.title}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                          {challenge.details.description}
                        </p>

                        {/* Tech tags */}
                        {challenge.technical.requiredTechnologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {challenge.technical.requiredTechnologies.slice(0, 4).map((tech, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px] font-medium">
                                {tech}
                              </span>
                            ))}
                            {challenge.technical.requiredTechnologies.length > 4 && (
                              <span className="px-1.5 py-0.5 text-stone-500 text-[11px]">
                                +{challenge.technical.requiredTechnologies.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action footer */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
                        <Link
                          to={`/details/${challenge.id}`}
                          className="text-xs font-bold text-stone-700 hover:text-[#063028] inline-flex items-center gap-1"
                        >
                          View Full Spec <ExternalLink className="h-3.5 w-3.5" />
                        </Link>

                        {existingAssignment ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-green-50 text-green-800 border border-green-200">
                            <Check className="h-3.5 w-3.5" /> Assigned to {existingAssignment.teamName}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenAssignModal(challenge)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#063028] text-white text-xs font-bold rounded-xl hover:bg-[#04201a] transition-all shadow-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Assign to Student Team
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY INSTITUTION'S ASSIGNED TEAMS */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div>
                <h2 className="text-xl font-bold text-[#063028] font-serif text-left">
                  Assigned Innovation Teams
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 text-left">
                  Teams currently working on industrial problem statements under faculty mentorship.
                </p>
              </div>
            </div>

            {institutionAssignments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center space-y-4">
                <Users className="h-12 w-12 text-stone-400 mx-auto" />
                <h3 className="text-xl font-bold text-stone-800 font-serif">No Teams Assigned Yet</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Browse open industry problem statements and assign them to your talented engineering or research students.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-5 py-2.5 bg-[#063028] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#04201a] transition-all cursor-pointer"
                  >
                    Browse Available Challenges &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institutionAssignments.map(assignment => {
                  const hasSolution = Boolean(assignment.solutionId);
                  return (
                    <div 
                      key={assignment.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs text-left flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                            {assignment.id}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            hasSolution 
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {hasSolution ? 'Solution Submitted' : 'In Progress'}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#c48825] uppercase tracking-wider">{assignment.industryCompanyName}</p>
                          <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif mt-0.5">
                            {assignment.challengeTitle}
                          </h3>
                        </div>

                        {/* Team Details Card */}
                        <div className="bg-[#faf8f4] p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
                          <p className="font-bold text-[#063028] text-sm">
                            Team: {assignment.teamName}
                          </p>
                          <p>
                            <strong>Lead:</strong> {assignment.teamLead.name} ({assignment.teamLead.department} • {assignment.teamLead.yearOfStudy})
                          </p>
                          <p>
                            <strong>Email:</strong> {assignment.teamLead.email}
                          </p>
                          {assignment.teamMembers?.length > 0 && (
                            <p>
                              <strong>Members ({assignment.teamMembers.length}):</strong>{' '}
                              {assignment.teamMembers.map(m => m.name).join(', ')}
                            </p>
                          )}
                          <p>
                            <strong>Mentor:</strong> {assignment.facultyMentor.name} ({assignment.facultyMentor.designation})
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                        <Link
                          to={`/details/${assignment.challengeId}`}
                          className="text-xs font-semibold text-stone-600 hover:text-[#063028]"
                        >
                          View Challenge Spec
                        </Link>

                        {hasSolution ? (
                          <button
                            onClick={() => {
                              const found = solutions.find(s => s.id === assignment.solutionId);
                              if (found) setViewSolutionModal(found);
                              else setActiveTab('solutions');
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 text-[#063028] text-xs font-bold rounded-xl hover:bg-stone-200 transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Solution
                          </button>
                        ) : (
                          <Link
                            to={`/institution/submit-solution/${assignment.challengeId}?assignmentId=${assignment.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#063028] text-white text-xs font-bold rounded-xl hover:bg-[#04201a] transition-all shadow-xs"
                          >
                            <Send className="h-3.5 w-3.5" /> Submit Solution &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBMITTED SOLUTIONS & REVIEWS */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div className="px-1 text-left">
              <h2 className="text-xl font-bold text-[#063028] font-serif">
                Submitted Solutions &amp; Industry Reviews
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Track corporate sponsor evaluations, reviewer remarks, and shortlisted student prototypes.
              </p>
            </div>

            {institutionSolutions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center space-y-4">
                <FileText className="h-12 w-12 text-stone-400 mx-auto" />
                <h3 className="text-xl font-bold text-stone-800 font-serif">No Solutions Submitted Yet</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Once your student teams develop their solution approaches, submit them here to connect directly with corporate sponsors.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="px-5 py-2.5 bg-[#063028] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#04201a] transition-all cursor-pointer"
                  >
                    View Assigned Teams &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {institutionSolutions.map(solution => {
                  return (
                    <div 
                      key={solution.id}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs text-left space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                            {solution.id}
                          </span>
                          <p className="text-xs font-bold text-[#c48825] uppercase tracking-wider mt-1">{solution.industryCompanyName}</p>
                          <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                            {solution.title}
                          </h3>
                          <p className="text-xs text-stone-500">
                            Challenge: <strong className="text-stone-700">{solution.challengeTitle}</strong> ({solution.challengeId})
                          </p>
                        </div>

                        <div className="shrink-0 flex sm:flex-col sm:items-end gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            solution.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : solution.status === 'REVISION_REQUESTED'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : solution.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {solution.status.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Submitted: {new Date(solution.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Details & Approach summary */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Executive Solution Summary</h4>
                        <p className="text-sm text-stone-700 leading-relaxed font-normal bg-[#faf8f4] p-4 rounded-xl border border-stone-200">
                          {solution.summary}
                        </p>
                      </div>

                      {/* Team & Mentor info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                        <div>
                          <p className="text-stone-500 font-bold uppercase text-[10px]">Team Name</p>
                          <p className="font-bold text-stone-900 text-sm mt-0.5">{solution.teamName}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 font-bold uppercase text-[10px]">Student Lead</p>
                          <p className="font-semibold text-stone-900 mt-0.5">{solution.teamLead.name} ({solution.teamLead.department})</p>
                          <p className="text-stone-500">{solution.teamLead.email}</p>
                        </div>
                        <div>
                          <p className="text-stone-500 font-bold uppercase text-[10px]">Faculty Mentor</p>
                          <p className="font-semibold text-stone-900 mt-0.5">{solution.facultyMentor.name}</p>
                          <p className="text-stone-500">{solution.facultyMentor.designation}</p>
                        </div>
                      </div>

                      {/* Tech stack */}
                      {solution.technologiesUsed?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-xs font-bold text-stone-500 mr-1">Tech Stack:</span>
                          {solution.technologiesUsed.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#edf4f0] text-[#063028] text-xs rounded-md font-semibold">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Demo URL / Link */}
                      {solution.demoUrl && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-stone-600">Demo Prototype:</span>
                          <a 
                            href={solution.demoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#c48825] hover:underline font-bold inline-flex items-center gap-1"
                          >
                            {solution.demoUrl} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      {/* Industry Feedback Banner if reviewed */}
                      {solution.industryFeedback && (
                        <div className="p-4 rounded-xl bg-[#fef6e7] border border-[#c48825]/30 space-y-1">
                          <span className="text-xs font-bold text-[#a6711c] uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="h-4 w-4" /> Feedback from {solution.industryCompanyName}:
                          </span>
                          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed italic">
                            &quot;{solution.industryFeedback}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ASSIGN TEAM MODAL DIALOG */}
      {isAssignModalOpen && selectedChallengeForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left my-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#a6711c]">Assign Challenge</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#063028] font-serif leading-snug">
                  {selectedChallengeForAssign.details.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Enterprise: <strong className="text-stone-700">{selectedChallengeForAssign.company.companyName}</strong> ({selectedChallengeForAssign.id})
                </p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {assignError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
                {assignError}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-700">Student Team Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. VisionEdge AI Team"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Lead Student Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Arjun Verma"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Lead Email *</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="arjun@student.jlu.edu.in"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Branch / Department</label>
                  <input
                    type="text"
                    value={leadDepartment}
                    onChange={(e) => setLeadDepartment(e.target.value)}
                    placeholder="Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Academic Year</label>
                  <select
                    value={leadYear}
                    onChange={(e) => setLeadYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028] bg-white cursor-pointer"
                  >
                    <option value="2nd Year UG">2nd Year UG</option>
                    <option value="3rd Year UG">3rd Year UG</option>
                    <option value="Final Year UG">Final Year UG</option>
                    <option value="Postgraduate (PG) / M.Tech">Postgraduate (PG) / M.Tech</option>
                    <option value="PhD Research Scholar">PhD Research Scholar</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-700">Additional Team Members (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  placeholder="Neha Tiwari (neha@student.edu), Rahul K (rahul@student.edu)"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#063028]"
                />
              </div>

              {/* Faculty Mentor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Faculty Advisor / Mentor Name</label>
                  <input
                    type="text"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="Dr. Priya Sharma"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Mentor Email</label>
                  <input
                    type="email"
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    placeholder="mentor@university.edu.in"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#063028]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#063028] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#04201a] transition-all shadow-sm cursor-pointer"
                >
                  Assign to Student Team
                </button>
              </div>
            </form>
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
