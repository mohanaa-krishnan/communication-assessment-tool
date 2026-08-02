export type BehaviourResult = "present" | "sometimes" | "absent" | "unscored";

export interface BehaviourScore {
  behaviour: string;
  result: BehaviourResult;
  notes: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  caregiverName: string;
  caregiverContact: string;
  createdAt: string;
}

export type AssessmentStatus = "draft" | "approved";

export interface Assessment {
  id: string;
  patientId: string;
  assessmentDate: string;
  status: AssessmentStatus;
  scores: BehaviourScore[];
  aiDraft?: string;
  finalContent?: string;
}