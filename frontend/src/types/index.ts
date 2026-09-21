export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CompanyInfo {
  industryName: string;
  companyName: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  website: string;
  industrySector: string;
}

export interface ProblemDetails {
  title: string;
  description: string;
  businessChallenge: string;
  existingProcess: string;
  expectedOutcome: string;
  projectObjectives: string;
}

export interface TechnicalDetails {
  requiredTechnologies: string[];
  requiredSkills: string[];
  preferredBranches: string[];
  preferredAcademicYear: string;
  difficultyLevel: DifficultyLevel;
  expectedDuration: string;
}

export interface AdditionalDetails {
  expectedDeliverables: string;
  additionalNotes: string;
  fileAttachmentName?: string;
  declarationAccepted: boolean;
}

export interface ProblemStatement {
  id: string;
  company: CompanyInfo;
  details: ProblemDetails;
  technical: TechnicalDetails;
  additional: AdditionalDetails;
  status: SubmissionStatus;
  submittedDate: string;
  reviewRemarks?: string;
  editedByAdmin?: boolean;
}

export type UserRole = 'industry' | 'admin' | 'institution';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  designation?: string;
  industry?: string;
  institutionName?: string;
  institutionCity?: string;
  department?: string;
  phone?: string;
}

export type AssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED';

export interface StudentTeamLead {
  name: string;
  email: string;
  department: string;
  yearOfStudy: string;
  phone?: string;
}

export interface StudentTeamMember {
  name: string;
  email: string;
  role?: string;
}

export interface FacultyMentor {
  name: string;
  designation: string;
  email: string;
  phone?: string;
}

export interface ProblemAssignment {
  id: string;
  challengeId: string;
  challengeTitle: string;
  industryCompanyName: string;
  industrySector?: string;
  institutionId: string;
  institutionName: string;
  teamName: string;
  teamLead: StudentTeamLead;
  teamMembers: StudentTeamMember[];
  facultyMentor: FacultyMentor;
  assignedDate: string;
  status: AssignmentStatus;
  notes?: string;
  solutionId?: string;
}

export type SolutionStatus = 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REVISION_REQUESTED' 
  | 'REJECTED';

export interface SolutionSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  industryCompanyName: string;
  industrySector?: string;
  institutionId: string;
  institutionName: string;
  assignmentId?: string;
  teamName: string;
  teamLead: StudentTeamLead;
  teamMembers: StudentTeamMember[];
  facultyMentor: FacultyMentor;
  title: string;
  summary: string;
  detailedApproach: string;
  technologiesUsed: string[];
  deliverablesDescription: string;
  demoUrl?: string;
  attachmentUrl?: string;
  documentName?: string;
  status: SolutionStatus;
  submittedAt: string;
  reviewedAt?: string;
  industryFeedback?: string;
  revisionNotes?: string;
}
