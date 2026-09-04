import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProblemStatement, User, SubmissionStatus, UserRole, 
  ProblemAssignment, SolutionSubmission, SolutionStatus 
} from '../types';
import { 
  login as apiLogin, logout as apiLogout, getSession, 
  fetchChallenges, createChallenge, updateChallenge, reviewChallenge,
  getLocalAssignments, createAssignment, getLocalSolutions,
  submitSolution as apiSubmitSolution, reviewSolution as apiReviewSolution
} from '../lib/api';

export interface ToastType {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  submissions: ProblemStatement[];
  assignments: ProblemAssignment[];
  solutions: SolutionSubmission[];
  toast: ToastType | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (email: string, password: string, roleHint?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addSubmission: (submission: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => Promise<string>;
  updateSubmissionStatus: (id: string, status: SubmissionStatus, remarks?: string) => Promise<void>;
  updateSubmission: (submission: ProblemStatement) => Promise<void>;
  assignChallenge: (assignmentData: Omit<ProblemAssignment, 'id' | 'assignedDate' | 'status'>) => Promise<ProblemAssignment>;
  submitSolution: (solutionData: Omit<SolutionSubmission, 'id' | 'submittedAt' | 'status'>) => Promise<SolutionSubmission>;
  reviewSolution: (solutionId: string, status: SolutionStatus, feedback?: string, revisionNotes?: string) => Promise<SolutionSubmission>;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mapUserRole = (user: any): User => {
  const roleMap: Record<string, UserRole> = {
    INDUSTRY_SPOC: 'industry',
    SUPER_ADMIN: 'admin',
    CII_ADMIN: 'admin',
    INSTITUTION_SPOC: 'institution',
    STUDENT: 'institution',
    industry: 'industry',
    admin: 'admin',
    institution: 'institution',
  };
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMap[user.role] || (user.role as UserRole) || 'industry',
    companyName: user.industryProfile?.companyName ?? user.companyName,
    designation: user.industryProfile?.designation ?? user.institutionProfile?.designation ?? user.designation,
    industry: user.industryProfile?.industry ?? user.industry,
    institutionName: user.institutionProfile?.institution?.name ?? user.institutionName,
    institutionCity: user.institutionProfile?.institution?.city ?? user.institutionCity,
    department: user.institutionProfile?.department ?? user.department,
    phone: user.phone,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load submissions from backend or fallback to localStorage
  const [submissions, setSubmissions] = useState<ProblemStatement[]>([]);
  const [assignments, setAssignments] = useState<ProblemAssignment[]>(getLocalAssignments);
  const [solutions, setSolutions] = useState<SolutionSubmission[]>(getLocalSolutions);

  // Load current user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ciisic_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Fetch session on mount
  useEffect(() => {
    (async () => {
      const user = await getSession();
      if (user) {
        setCurrentUser(mapUserRole(user));
      } else {
        setCurrentUser(null);
      }
    })();
  }, []);

  // Fetch challenges whenever current user changes
  useEffect(() => {
    (async () => {
      try {
        const challenges = await fetchChallenges();
        setSubmissions(challenges);
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
      }
    })();
  }, [currentUser]);

  // Sync submissions to localStorage (optional)
  useEffect(() => {
    if (submissions.length) {
      localStorage.setItem('ciisic_submissions', JSON.stringify(submissions));
    }
  }, [submissions]);

  // Global toast notification state
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ciisic_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ciisic_current_user');
    }
  }, [currentUser]);

  const login = async (email: string, password: string, roleHint?: UserRole) => {
    try {
      const user = await apiLogin(email, password, roleHint);
      setCurrentUser(mapUserRole(user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
  };

  const addSubmission = async (submissionData: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>) => {
    const created = await createChallenge(submissionData);
    setSubmissions((prev) => [created, ...prev]);
    return created.id;
  };

  const updateSubmissionStatus = async (id: string, status: SubmissionStatus, remarks?: string) => {
    await reviewChallenge(id, status, remarks);
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status, reviewRemarks: remarks } : sub
      )
    );
  };

  const updateSubmission = async (updated: ProblemStatement) => {
    const saved = await updateChallenge(updated.id, updated);
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === saved.id ? saved : sub))
    );
  };

  const assignChallenge = async (assignmentData: Omit<ProblemAssignment, 'id' | 'assignedDate' | 'status'>): Promise<ProblemAssignment> => {
    const created = createAssignment(assignmentData);
    setAssignments((prev) => [created, ...prev]);
    showToast(`Assigned ${assignmentData.challengeTitle} to ${assignmentData.teamName}`, 'success');
    return created;
  };

  const submitSolution = async (solutionData: Omit<SolutionSubmission, 'id' | 'submittedAt' | 'status'>): Promise<SolutionSubmission> => {
    const created = await apiSubmitSolution(solutionData);
    setSolutions((prev) => [created, ...prev]);
    // Refresh assignments in case one was linked
    setAssignments(getLocalAssignments());
    showToast('Solution submitted successfully to Industry and CII review!', 'success');
    return created;
  };

  const reviewSolution = async (
    solutionId: string, 
    status: SolutionStatus, 
    feedback?: string, 
    revisionNotes?: string
  ): Promise<SolutionSubmission> => {
    const updated = await apiReviewSolution(solutionId, status, feedback, revisionNotes);
    setSolutions((prev) =>
      prev.map((sol) => (sol.id === solutionId ? updated : sol))
    );
    showToast(`Solution marked as ${status.replace('_', ' ')}`, 'success');
    return updated;
  };

  const resetData = () => {
    setCurrentUser(null);
    setSubmissions([]);
    setAssignments([]);
    setSolutions([]);
    localStorage.removeItem('ciisic_current_user');
    localStorage.removeItem('ciisic_submissions');
    localStorage.removeItem('ciisic_assignments');
    localStorage.removeItem('ciisic_solutions');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        submissions,
        assignments,
        solutions,
        toast,
        showToast,
        hideToast,
        login,
        logout,
        addSubmission,
        updateSubmissionStatus,
        updateSubmission,
        assignChallenge,
        submitSolution,
        reviewSolution,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
