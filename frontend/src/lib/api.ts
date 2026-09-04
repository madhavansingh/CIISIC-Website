import { 
  ProblemStatement, User, SubmissionStatus, UserRole, 
  ProblemAssignment, SolutionSubmission, SolutionStatus 
} from '../types';

/**
 * Base URL comes from VITE_API_URL (e.g., http://localhost:3001)
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

// Local memory store for JWT (initialized from localStorage)
let authToken = localStorage.getItem('ciisic_jwt_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('ciisic_jwt_token', token);
  } else {
    localStorage.removeItem('ciisic_jwt_token');
  }
}

// Local database helpers
function getLocalChallenges(): ProblemStatement[] {
  const saved = localStorage.getItem('ciisic_submissions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Purge legacy mock challenge IDs from early development
        const filtered = parsed.filter((c: any) => !c?.id?.startsWith?.('CII-2025-010'));
        if (filtered.length !== parsed.length) {
          localStorage.setItem('ciisic_submissions', JSON.stringify(filtered));
        }
        return filtered;
      }
    } catch {
      // ignore
    }
  }
  return [];
}

function saveLocalChallenges(challenges: ProblemStatement[]) {
  localStorage.setItem('ciisic_submissions', JSON.stringify(challenges));
}

/** Problem Assignments (Institutions assigning challenges to student teams) */
export function getLocalAssignments(): ProblemAssignment[] {
  const saved = localStorage.getItem('ciisic_assignments');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
  }
  return [];
}

export function saveLocalAssignments(assignments: ProblemAssignment[]) {
  localStorage.setItem('ciisic_assignments', JSON.stringify(assignments));
}

export function createAssignment(data: Omit<ProblemAssignment, 'id' | 'assignedDate' | 'status'>): ProblemAssignment {
  const assignments = getLocalAssignments();
  const newAssignment: ProblemAssignment = {
    ...data,
    id: 'ASG-' + Date.now().toString(36).toUpperCase(),
    assignedDate: new Date().toISOString(),
    status: 'ASSIGNED',
  };
  assignments.unshift(newAssignment);
  saveLocalAssignments(assignments);
  return newAssignment;
}

/** Solutions Submissions (Institutions/Teams submitting proposals to Industry challenges) */
export function getLocalSolutions(): SolutionSubmission[] {
  const saved = localStorage.getItem('ciisic_solutions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
  }
  return [];
}

export function saveLocalSolutions(solutions: SolutionSubmission[]) {
  localStorage.setItem('ciisic_solutions', JSON.stringify(solutions));
}

export async function submitSolution(data: Omit<SolutionSubmission, 'id' | 'submittedAt' | 'status'>): Promise<SolutionSubmission> {
  const solutions = getLocalSolutions();
  const newSolution: SolutionSubmission = {
    ...data,
    id: 'SOL-' + Date.now().toString(36).toUpperCase(),
    submittedAt: new Date().toISOString(),
    status: 'SUBMITTED',
  };

  solutions.unshift(newSolution);
  saveLocalSolutions(solutions);

  // If this solution is linked to an assignment, update assignment status
  if (data.assignmentId) {
    const assignments = getLocalAssignments();
    const idx = assignments.findIndex(a => a.id === data.assignmentId);
    if (idx !== -1) {
      assignments[idx].status = 'SUBMITTED';
      assignments[idx].solutionId = newSolution.id;
      saveLocalAssignments(assignments);
    }
  }

  // Attempt backend API dispatch if API_BASE is configured
  if (API_BASE) {
    try {
      await fetchJSON(`${API_BASE}/api/challenges/${data.challengeId}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: data.summary,
          approachDoc: data.attachmentUrl || data.demoUrl || '',
          isDraft: false,
        }),
      });
    } catch (e) {
      console.warn('Backend proposal dispatch fallback to local state:', e);
    }
  }

  return newSolution;
}

export async function reviewSolution(
  solutionId: string, 
  status: SolutionStatus, 
  feedback?: string, 
  revisionNotes?: string
): Promise<SolutionSubmission> {
  const solutions = getLocalSolutions();
  const index = solutions.findIndex(s => s.id === solutionId);
  if (index === -1) {
    throw new Error('Solution not found');
  }

  solutions[index] = {
    ...solutions[index],
    status,
    reviewedAt: new Date().toISOString(),
    industryFeedback: feedback !== undefined ? feedback : solutions[index].industryFeedback,
    revisionNotes: revisionNotes !== undefined ? revisionNotes : solutions[index].revisionNotes,
  };

  saveLocalSolutions(solutions);
  return solutions[index];
}

/** Helper to fetch JSON automatically injecting Authorization Bearer header */
async function fetchJSON<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }
  
  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'API error');
  }
  return data.data as T;
}

/** Backend user to frontend User mapper */
export function mapBackendUserToFrontend(backendUser: any): User {
  let role: UserRole = 'industry';
  if (backendUser.role === 'CII_ADMIN' || backendUser.role === 'SUPER_ADMIN' || backendUser.role === 'admin') {
    role = 'admin';
  } else if (backendUser.role === 'INSTITUTION_SPOC' || backendUser.role === 'institution' || backendUser.role === 'STUDENT') {
    role = 'institution';
  } else if (backendUser.role === 'INDUSTRY_SPOC' || backendUser.role === 'industry') {
    role = 'industry';
  }

  const instName =
    backendUser.institutionProfile?.institution?.name ||
    backendUser.institutionName ||
    '';
  const instCity =
    backendUser.institutionProfile?.institution?.city ||
    backendUser.institutionCity ||
    '';
  const compName =
    backendUser.industryProfile?.companyName ||
    backendUser.companyName ||
    '';
  const desig =
    backendUser.industryProfile?.designation ||
    backendUser.institutionProfile?.designation ||
    backendUser.designation ||
    '';
  const dept =
    backendUser.institutionProfile?.department ||
    backendUser.department ||
    '';
  const phone =
    backendUser.industryProfile?.phone ||
    backendUser.institutionProfile?.phone ||
    backendUser.phone ||
    '';

  return {
    id: backendUser.id,
    name: backendUser.name || 'User',
    email: backendUser.email,
    role,
    companyName: compName,
    designation: desig,
    institutionName: instName,
    institutionCity: instCity,
    department: dept,
    phone,
  };
}

/** Auth */
export async function login(email: string, password: string, _roleHint?: UserRole): Promise<User> {
  const url = API_BASE ? `${API_BASE}/api/auth/login` : '/api/auth/login';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Invalid email or password');
  }

  setAuthToken(data.token);
  const user = mapBackendUserToFrontend(data.user);
  localStorage.setItem('ciisic_current_user', JSON.stringify(user));
  return user;
}

export async function registerIndustry(data: {
  companyName: string;
  industry: string;
  websiteUrl?: string;
  isCIIMember?: boolean;
  contactPerson: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message: string; requiresApproval: boolean }> {
  const url = API_BASE ? `${API_BASE}/api/auth/register` : '/api/auth/register';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email.trim(),
      password: data.password,
      name: data.contactPerson,
      role: 'INDUSTRY_SPOC',
      companyName: data.companyName,
      industry: data.industry,
      websiteUrl: data.websiteUrl || '',
      isCIIMember: data.isCIIMember ?? true,
    }),
  });

  const resJson = await response.json();
  if (!response.ok || !resJson.success) {
    throw new Error(resJson.message || 'Industry registration failed');
  }

  return {
    success: true,
    requiresApproval: true,
    message: 'Your enterprise registration has been submitted and is pending CII Administrator review. You will be able to log in once approved.',
  };
}

export async function registerInstitution(data: {
  institutionName: string;
  institutionCity: string;
  coordinatorName: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  password?: string;
}): Promise<{ success: boolean; message: string; requiresApproval: boolean }> {
  const url = API_BASE ? `${API_BASE}/api/auth/register` : '/api/auth/register';
  const password = data.password || 'Spoc@1234';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email.trim(),
      password,
      name: data.coordinatorName,
      role: 'INSTITUTION_SPOC',
      spocInstitutionId: data.institutionName,
      department: data.department,
      designation: data.designation,
    }),
  });

  const resJson = await response.json();
  if (!response.ok || !resJson.success) {
    throw new Error(resJson.message || 'Institution registration failed');
  }

  return {
    success: true,
    requiresApproval: true,
    message: 'Your academic institution registration has been submitted and is pending CII Administrator review. You will be able to log in once approved.',
  };
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const url = API_BASE ? `${API_BASE}/api/auth/change-password` : '/api/auth/change-password';
  return await fetchJSON<{ success: boolean; message: string }>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export interface RegistrationItem {
  id: string;
  name: string;
  email: string;
  role: 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
  createdAt: string;
  entityName: string;
  industrySector?: string;
  department?: string;
  designation?: string;
  websiteUrl?: string;
  isCIIMember?: boolean;
  institutionCity?: string;
}

export async function fetchAdminRegistrations(status?: string, role?: string): Promise<RegistrationItem[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (role) params.set('role', role);

  const query = params.toString() ? `?${params.toString()}` : '';
  const url = API_BASE ? `${API_BASE}/api/admin/registrations${query}` : `/api/admin/registrations${query}`;
  try {
    return await fetchJSON<RegistrationItem[]>(url);
  } catch (e) {
    console.warn('Failed to fetch admin registrations:', e);
    return [];
  }
}

export async function reviewRegistration(id: string, action: 'APPROVE' | 'REJECT', remarks?: string): Promise<any> {
  const url = API_BASE ? `${API_BASE}/api/admin/registrations/${id}/review` : `/api/admin/registrations/${id}/review`;
  return await fetchJSON<any>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, remarks }),
  });
}

export async function logout() {
  const url = API_BASE ? `${API_BASE}/api/auth/logout` : '/api/auth/logout';
  try {
    const headers = new Headers();
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }
    await fetch(url, {
      method: 'POST',
      headers,
    });
  } catch (e) {
    console.error("Logout request error:", e);
  } finally {
    setAuthToken(null);
    localStorage.removeItem('ciisic_current_user');
  }
}

export async function getSession(): Promise<User | null> {
  if (!authToken) {
    return null;
  }

  const url = API_BASE ? `${API_BASE}/api/auth/me` : '/api/auth/me';
  try {
    const backendData = await fetchJSON<any>(url);
    const user = mapBackendUserToFrontend(backendData);
    localStorage.setItem('ciisic_current_user', JSON.stringify(user));
    return user;
  } catch {
    setAuthToken(null);
    localStorage.removeItem('ciisic_current_user');
    return null;
  }
}

/** Challenges */
export async function fetchChallenges(): Promise<ProblemStatement[]> {
  if (API_BASE) {
    try {
      const res = await fetchJSON<{ data?: any[]; [key: string]: any }>(`${API_BASE}/api/challenges`);
      const challengesList = Array.isArray(res) ? res : (res?.data || []);
      return challengesList.map(mapBackendToProblemStatement);
    } catch (e) {
      console.warn('Backend fetchChallenges failed, falling back to local data:', e);
    }
  }

  return getLocalChallenges();
}

export async function fetchChallengeById(id: string): Promise<ProblemStatement> {
  if (API_BASE) {
    try {
      const challenge = await fetchJSON<any>(`${API_BASE}/api/challenges/${id}`);
      return mapBackendToProblemStatement(challenge);
    } catch (e) {
      console.warn(`Backend fetchChallengeById failed for ${id}, checking local:`, e);
    }
  }

  const challenges = getLocalChallenges();
  const found = challenges.find(c => c.id === id);
  if (!found) {
    throw new Error('Problem statement not found');
  }
  return found;
}

function mapSectorToCellTheme(sector: string): string {
  const normalized = (sector || '').toUpperCase().trim();
  if (normalized.includes("AGRI") || normalized.includes("FARM") || normalized.includes("FOOD")) {
    return "AGRITECH";
  }
  if (normalized.includes("AI") || normalized.includes("SOFTWARE") || normalized.includes("TECH") || normalized.includes("INFORMATION")) {
    return "AI_IN_BUSINESS";
  }
  if (normalized.includes("START") || normalized.includes("ENTREP")) {
    return "STARTUP";
  }
  if (normalized.includes("FAMILY") || normalized.includes("BUSINESS")) {
    return "FAMILY_BUSINESS";
  }
  if (normalized.includes("TALENT") || normalized.includes("EDUCATION") || normalized.includes("ACADEMIC")) {
    return "TALENT_READINESS";
  }
  if (normalized.includes("SKILL") || normalized.includes("TRAIN") || normalized.includes("DEVELOPMENT")) {
    return "SKILL_DEVELOPMENT";
  }
  return "RESEARCH_INNOVATION";
}

function getDeadline(payload: any): string {
  const notes = payload.additional?.additionalNotes || '';
  const match = notes.match(/Target date:\s*(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const [_, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    if (date > new Date()) {
      return date.toISOString();
    }
  }
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 3);
  return defaultDate.toISOString();
}

function getBudgetRange(payload: any): string {
  const notes = payload.additional?.additionalNotes || '';
  const match = notes.match(/Budget allocated:\s*([^\.]+)/);
  if (match) {
    return match[1].trim();
  }
  return notes || 'Not Specified';
}

function flattenChallengePayload(payload: any): any {
  const flat: any = {
    title: payload.details?.title || 'No Title Provided',
    description: payload.details?.description || 'No Description Provided',
    problemStatement: payload.details?.businessChallenge || payload.details?.description || 'No Problem Statement Provided',
    domain: mapSectorToCellTheme(payload.company?.industrySector || payload.company?.industryName || ''),
    deadline: getDeadline(payload),
    budgetRange: getBudgetRange(payload),
    tags: payload.technical?.requiredTechnologies || [],
    attachmentUrls: payload.additional?.fileAttachmentName ? [payload.additional.fileAttachmentName] : [],
    organizationName: payload.company?.companyName || 'Unknown Organization',
    duration: payload.technical?.expectedDuration || '6 Months',
  };

  if (payload.status) {
    const statusMap: Record<SubmissionStatus, string> = {
      'Pending': 'PENDING_APPROVAL',
      'Approved': 'OPEN',
      'Rejected': 'REJECTED',
    };
    flat.status = statusMap[payload.status as SubmissionStatus] || 'DRAFT';
  }

  return flat;
}

export async function createChallenge(payload: Omit<ProblemStatement, 'id' | 'status' | 'submittedDate'>): Promise<ProblemStatement> {
  if (API_BASE) {
    try {
      const flatPayload = flattenChallengePayload(payload);
      const created = await fetchJSON<any>(`${API_BASE}/api/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatPayload),
      });
      return mapBackendToProblemStatement(created);
    } catch (e) {
      console.warn('Backend createChallenge failed, persisting locally:', e);
    }
  }

  // Local creation
  const idNumber = Math.floor(1000 + Math.random() * 9000);
  const newChallenge: ProblemStatement = {
    ...payload,
    id: `CII-2025-${idNumber}`,
    status: 'Pending',
    submittedDate: new Date().toISOString(),
  };

  const challenges = getLocalChallenges();
  const updated = [newChallenge, ...challenges];
  saveLocalChallenges(updated);
  return newChallenge;
}

export async function updateChallenge(id: string, payload: Partial<ProblemStatement>): Promise<ProblemStatement> {
  if (API_BASE) {
    try {
      const flatPayload = {};
      const tempFlat = flattenChallengePayload(payload);
      
      if (payload.details?.title) (flatPayload as any).title = tempFlat.title;
      if (payload.details?.description) (flatPayload as any).description = tempFlat.description;
      if (payload.details?.businessChallenge) (flatPayload as any).problemStatement = tempFlat.problemStatement;
      if (payload.company?.industrySector || payload.company?.industryName) (flatPayload as any).domain = tempFlat.domain;
      if (payload.additional?.additionalNotes) {
        (flatPayload as any).budgetRange = tempFlat.budgetRange;
        (flatPayload as any).deadline = tempFlat.deadline;
      }
      if (payload.technical?.requiredTechnologies) (flatPayload as any).tags = tempFlat.tags;
      if (payload.additional?.fileAttachmentName) (flatPayload as any).attachmentUrls = tempFlat.attachmentUrls;
      if (payload.company?.companyName) (flatPayload as any).organizationName = tempFlat.organizationName;
      if (payload.technical?.expectedDuration) (flatPayload as any).duration = tempFlat.duration;
      if (payload.status) (flatPayload as any).status = tempFlat.status;

      const updated = await fetchJSON<any>(`${API_BASE}/api/challenges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatPayload),
      });
      return mapBackendToProblemStatement(updated);
    } catch (e) {
      console.warn('Backend updateChallenge failed, updating locally:', e);
    }
  }

  const challenges = getLocalChallenges();
  const index = challenges.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Problem statement not found');
  }

  const current = challenges[index];
  const merged: ProblemStatement = {
    ...current,
    ...payload,
    company: { ...current.company, ...(payload.company || {}) },
    details: { ...current.details, ...(payload.details || {}) },
    technical: { ...current.technical, ...(payload.technical || {}) },
    additional: { ...current.additional, ...(payload.additional || {}) },
    status: payload.status || current.status,
    reviewRemarks: payload.reviewRemarks !== undefined ? payload.reviewRemarks : current.reviewRemarks,
    editedByAdmin: payload.editedByAdmin !== undefined ? payload.editedByAdmin : current.editedByAdmin,
  };

  challenges[index] = merged;
  saveLocalChallenges(challenges);
  return merged;
}

/** Admin review */
export async function reviewChallenge(id: string, status: SubmissionStatus, remarks?: string) {
  if (API_BASE) {
    try {
      const action = status === 'Approved' ? 'APPROVE' : 'REJECT';
      const body: any = { action };
      if (remarks) body.remarks = remarks;
      await fetchJSON<any>(`${API_BASE}/api/admin/challenges/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return;
    } catch (e) {
      console.warn('Backend reviewChallenge failed, updating locally:', e);
    }
  }

  const challenges = getLocalChallenges();
  const index = challenges.findIndex(c => c.id === id);
  if (index !== -1) {
    challenges[index].status = status;
    if (remarks) challenges[index].reviewRemarks = remarks;
    saveLocalChallenges(challenges);
  }
}

/** File upload */
export async function uploadFile(file: File, type: 'LOGO' | 'DOCUMENT'): Promise<{ url: string }> {
  if (API_BASE) {
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);

      const result = await fetchJSON<any>(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: form,
      });
      return result;
    } catch (e) {
      console.warn('Backend uploadFile failed, generating local object URL:', e);
    }
  }

  // Fallback to local object URL or file representation
  const objectUrl = URL.createObjectURL(file);
  return { url: objectUrl };
}

/** Mappers */
function formatThemeToSector(theme?: string): string {
  if (!theme) return 'General Innovation';
  const map: Record<string, string> = {
    'AI_IN_BUSINESS': 'Artificial Intelligence',
    'AGRITECH': 'Agritech',
    'RESEARCH_INNOVATION': 'Research & Innovation',
    'FAMILY_BUSINESS': 'Manufacturing & Enterprise',
    'TALENT_READINESS': 'Talent & Education',
    'SKILL_DEVELOPMENT': 'Skill Development',
    'STARTUP': 'Startup & Incubation',
  };
  return map[theme] || theme;
}

function mapBackendToProblemStatement(backend: any): ProblemStatement {
  const sectorName = formatThemeToSector(backend.domain);
  const company = backend.organizationName || backend.industry?.companyName || 'Corporate Partner';
  return {
    id: backend.id,
    company: {
      industryName: sectorName,
      companyName: company,
      representativeName: backend.industry?.representativeName ?? '',
      designation: backend.industry?.designation ?? 'Corporate R&D',
      email: backend.industry?.email ?? '',
      phone: backend.industry?.phone ?? '',
      website: backend.industry?.website ?? '',
      industrySector: sectorName,
    },
    details: {
      title: backend.title ?? '',
      description: backend.description ?? '',
      businessChallenge: backend.problemStatement ?? '',
      existingProcess: '',
      expectedOutcome: backend.description ?? '',
      projectObjectives: '',
    },
    technical: {
      requiredTechnologies: backend.tags ?? [],
      requiredSkills: [],
      preferredBranches: [],
      preferredAcademicYear: '',
      difficultyLevel: 'Medium',
      expectedDuration: backend.duration ?? '',
    },
    additional: {
      expectedDeliverables: '',
      additionalNotes: backend.budgetRange ?? '',
      fileAttachmentName: backend.attachmentUrls?.[0] ?? '',
      declarationAccepted: true,
    },
    status: mapBackendStatus(backend.status),
    submittedDate: backend.createdAt || new Date().toISOString(),
    reviewRemarks: backend.reviewRemarks,
  } as ProblemStatement;
}

function mapBackendStatus(status: string): SubmissionStatus {
  const map: Record<string, SubmissionStatus> = {
    PENDING_APPROVAL: 'Pending',
    OPEN: 'Approved',
    REJECTED: 'Rejected',
    DRAFT: 'Pending',
    UNDER_REVIEW: 'Pending',
    CLOSED: 'Approved',
    ARCHIVED: 'Rejected',
  };
  return map[status] || 'Pending';
}

