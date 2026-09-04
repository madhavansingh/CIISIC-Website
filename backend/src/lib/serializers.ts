import { Role } from "@prisma/client";

// ─── Types returned to clients ────────────────────────────────────────────────

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
};

export type SafeChallenge = {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  domain: string;
  status: string;
  deadline: Date;
  budgetRange?: string | null; // stripped for students
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  organizationName?: string | null;
  duration?: string | null;
  reviewRemarks?: string | null;
  reviewedAt?: Date | null;
  reviewerId?: string | null;
  industry: {
    companyName: string;
    industry: string;
    logoUrl: string | null;
    isCIIMember: boolean;
    email?: string;
    representativeName?: string;
  };
  _count?: { proposals: number };
  attachmentUrls?: string[];
};
export type SafeProposal = {
  id: string;
  challengeId: string;
  status: string;
  summary: string;
  approachDoc: string | null;
  revisionNotes?: string | null;
  feedbackByIndustry?: string | null; // stripped from other students
  submittedAt: Date;
  updatedAt: Date;
  student?: {
    name?: string; // PII (only for admins/spoc/owner)
    email?: string; // PII (only for admins/spoc/owner)
    enrollmentNo?: string; // PII (only for admins/spoc/owner)
    department: string;
    yearOfStudy: number;
    skills: string[];
  };
  challenge?: {
    title: string;
    domain: string;
  };
};

// ─── Serializers ──────────────────────────────────────────────────────────────

/**
 * Strip passwordHash and internal fields from user records.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeUser(user: any): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

/**
 * Serialize a challenge.
 * - Students: budgetRange is stripped.
 * - Industry SPOC: only their own challenges show full budget.
 * - Admins: see everything.
 */
export function serializeChallenge(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  challenge: any,
  requestingRole?: Role,
  requestingUserId?: string
): SafeChallenge {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    problemStatement: challenge.problemStatement,
    domain: challenge.domain,
    status: challenge.status,
    deadline: challenge.deadline,
    budgetRange: challenge.budgetRange ?? null,
    tags: challenge.tags ?? [],
    viewCount: challenge.viewCount,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
    publishedAt: challenge.publishedAt,
    organizationName: challenge.organizationName,
    duration: challenge.duration,
    reviewRemarks: challenge.reviewRemarks,
    reviewedAt: challenge.reviewedAt,
    reviewerId: challenge.reviewerId,
    industry: {
      companyName: challenge.industryProfile?.companyName ?? "",
      industry: challenge.industryProfile?.industry ?? "",
      logoUrl: challenge.industryProfile?.logoUrl ?? null,
      isCIIMember: challenge.industryProfile?.isCIIMember ?? false,
      email: challenge.industryProfile?.user?.email ?? "",
      representativeName: challenge.industryProfile?.user?.name ?? "",
    },
    _count: challenge._count,
    attachmentUrls: challenge.attachmentUrls ?? [],
  };
}

/**
 * Serialize a proposal.
 * - Industry SPOC: student identity/PII hidden (only department, year, skills)
 * - Institution SPOC: sees PII only if student belongs to their institution
 * - Student: sees own proposal + PII
 * - Admin: sees everything
 */
export function serializeProposal(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proposal: any,
  requestingRole: Role,
  requestingUserId?: string,
  requestingUserInstitutionId?: string
): SafeProposal {
  const isAdmin =
    requestingRole === "SUPER_ADMIN" || requestingRole === "CII_ADMIN";
  const isIndustry = requestingRole === "INDUSTRY_SPOC";
  const isOwner =
    requestingRole === "STUDENT" &&
    proposal.studentProfile?.userId === requestingUserId;

  const isInstSpocOwner =
    requestingRole === "INSTITUTION_SPOC" &&
    requestingUserInstitutionId &&
    proposal.studentProfile?.institutionId === requestingUserInstitutionId;

  // Check if we can show PII (Name, Email, Enrollment Number)
  const showPII = isAdmin || isOwner || isInstSpocOwner;

  let studentData: SafeProposal["student"] = undefined;

  if (proposal.studentProfile) {
    studentData = {
      department: proposal.studentProfile.department,
      yearOfStudy: proposal.studentProfile.yearOfStudy,
      skills: proposal.studentProfile.skills ?? [],
      ...(showPII && {
        name: proposal.studentProfile.user?.name ?? proposal.studentProfile.name,
        email: proposal.studentProfile.user?.email ?? proposal.studentProfile.email,
        enrollmentNo: proposal.studentProfile.enrollmentNo,
      }),
    };
  }

  // Only show feedback when status is terminal
  const showFeedback =
    isAdmin ||
    ((isOwner || isIndustry) &&
      ["APPROVED", "REJECTED"].includes(proposal.status));

  return {
    id: proposal.id,
    challengeId: proposal.challengeId,
    status: proposal.status,
    summary: proposal.summary,
    approachDoc: proposal.approachDoc,
    revisionNotes: proposal.revisionNotes,
    feedbackByIndustry: showFeedback ? proposal.feedbackByIndustry : undefined,
    submittedAt: proposal.submittedAt,
    updatedAt: proposal.updatedAt,
    student: studentData,
    challenge: proposal.challenge
      ? {
          title: proposal.challenge.title,
          domain: proposal.challenge.domain,
        }
      : undefined,
  };
}
