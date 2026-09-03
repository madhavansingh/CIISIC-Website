import { ProblemStatement, User, SubmissionStatus } from '../types';
import { INITIAL_CHALLENGES, INITIAL_USERS } from '../data/mockData';

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

// Local mock database helpers
function getLocalChallenges(): ProblemStatement[] {
  const saved = localStorage.getItem('ciisic_submissions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem('ciisic_submissions', JSON.stringify(INITIAL_CHALLENGES));
  return INITIAL_CHALLENGES;
}

function saveLocalChallenges(challenges: ProblemStatement[]) {
  localStorage.setItem('ciisic_submissions', JSON.stringify(challenges));
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

/** Auth */
export async function login(email: string, password: string): Promise<User> {
  if (API_BASE) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setAuthToken(data.token);
        return data.user;
      }
    } catch (e) {
      console.warn('Backend login failed, using local auth:', e);
    }
  }

  // Resilient Local Mock Login
  const normalizedEmail = email.toLowerCase().trim();
  const isAdmin = normalizedEmail.includes('admin') || normalizedEmail === 'admin@cii.in';

  let user: User;
  if (isAdmin) {
    user = {
      id: 'usr_adm_' + Date.now().toString(36),
      name: 'CII Administrator',
      email: normalizedEmail,
      role: 'admin',
      companyName: 'Confederation of Indian Industry',
      designation: 'CII Regional Director',
      industry: 'Industry-Academia Relations',
    };
  } else {
    // Check known initial users or construct industry profile
    const existing = INITIAL_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      user = existing;
    } else {
      const domainName = normalizedEmail.split('@')[1]?.split('.')[0] || 'Enterprise';
      const formattedCompany = domainName.charAt(0).toUpperCase() + domainName.slice(1) + ' Ltd';
      user = {
        id: 'usr_ind_' + Date.now().toString(36),
        name: normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: normalizedEmail,
        role: 'industry',
        companyName: formattedCompany,
        designation: 'Corporate R&D Lead',
        industry: 'Industrial Innovation',
      };
    }
  }

  const mockToken = 'mock_jwt_' + btoa(JSON.stringify(user));
  setAuthToken(mockToken);
  localStorage.setItem('ciisic_current_user', JSON.stringify(user));
  return user;
}

export async function logout() {
  if (API_BASE) {
    const headers = new Headers();
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers,
      });
    } catch (e) {
      console.error("Logout request error:", e);
    }
  }

  setAuthToken(null);
  localStorage.removeItem('ciisic_current_user');
}

export async function getSession(): Promise<User | null> {
  if (API_BASE && authToken && !authToken.startsWith('mock_jwt_')) {
    try {
      return await fetchJSON<User>(`${API_BASE}/api/auth/me`);
    } catch {
      setAuthToken(null);
      return null;
    }
  }

  // Local token inspection
  const savedUser = localStorage.getItem('ciisic_current_user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }
  return null;
}

/** Challenges */
export async function fetchChallenges(): Promise<ProblemStatement[]> {
  if (API_BASE) {
    try {
      const res = await fetchJSON<{ data?: any[]; [key: string]: any }>(`${API_BASE}/api/challenges`);
      const challengesList = Array.isArray(res) ? res : (res?.data || []);
      if (challengesList.length > 0) {
        return challengesList.map(mapBackendToProblemStatement);
      }
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
function mapBackendToProblemStatement(backend: any): ProblemStatement {
  return {
    id: backend.id,
    company: {
      industryName: backend.domain ?? '',
      companyName: backend.organizationName ?? '',
      representativeName: backend.industry?.representativeName ?? '',
      designation: backend.industry?.designation ?? '',
      email: backend.industry?.email ?? '',
      phone: backend.industry?.phone ?? '',
      website: backend.industry?.website ?? '',
      industrySector: backend.domain ?? '',
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

