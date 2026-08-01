import { BehaviourScore } from "@/types";

export interface ReportContent {
  clinicalImpression: string;
  recommendations: string;
  parentSummary: string;
}

// TODO: replace this function's body with a real call to
// POST /generate-report (Gemini) once the backend endpoint is ready.
// Keep the same return shape so the Report page doesn't need to change.
export function generateMockReport(
  patientName: string,
  scores: BehaviourScore[]
): ReportContent {
  const present = scores.filter((s) => s.result === "present");
  const absent = scores.filter((s) => s.result === "absent");

  const clinicalImpression = `${patientName} demonstrated ${present.length} of 10 assessed communication behaviours during this session. Behaviours consistently present included ${
    present.map((s) => s.behaviour).join(", ") || "none"
  }. Behaviours not observed during this session included ${
    absent.map((s) => s.behaviour).join(", ") || "none"
  }. These findings should be interpreted alongside the therapist's direct clinical observations.`;

  const recommendations = absent
    .map(
      (s) =>
        `- Target "${s.behaviour}" with structured practice activities over the coming sessions.`
    )
    .join("\n") || "- Continue reinforcing all currently present behaviours.";

  const parentSummary = `During this visit, we looked at how ${patientName} communicates in ${scores.length} everyday situations. ${patientName} showed strong skills in ${
    present.length
  } of these areas. We're going to keep practicing the remaining ${
    absent.length
  } areas together — your therapist will share simple activities you can try at home.`;

  return { clinicalImpression, recommendations, parentSummary };
}