"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockPatients } from "@/lib/mock-data";
import { BehaviourScore } from "@/types";
import {
  generateMockReport,
  ReportContent,
} from "@/lib/mock-report";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const patient = mockPatients.find((p) => p.id === id);

  const [report, setReport] = useState<ReportContent | null>(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!patient) return;
    const raw = sessionStorage.getItem(`cat-scores-${id}`);
    const scores: BehaviourScore[] = raw
      ? JSON.parse(raw)
      : []; // no scores found — therapist should redo the assessment
    setReport(generateMockReport(patient.name, scores));
  }, [id, patient]);

  function handleApprove() {
    // TODO: replace with POST that saves clinical_reports + parent_summaries
    setApproved(true);
    setTimeout(() => {
      router.push(`/patients/${id}/profile`);
    }, 700);
  }

  if (!patient) return <p className="text-slate-500">Patient not found.</p>;
  if (!report) return <p className="text-slate-500">Generating report...</p>;

  return (
    <div className="max-w-3xl">
      <Link
        href={`/patients/${id}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to {patient.name}
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          AI-Generated Report
        </h1>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
          Draft — pending your review
        </span>
      </div>
      <p className="text-slate-500 mt-1">
        Review and edit before approving. Nothing is saved until you approve.
      </p>

      <div className="mt-6 space-y-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Clinical Impression
          </label>
          <textarea
            value={report.clinicalImpression}
            onChange={(e) =>
              setReport({ ...report, clinicalImpression: e.target.value })
            }
            rows={4}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Recommendations
          </label>
          <textarea
            value={report.recommendations}
            onChange={(e) =>
              setReport({ ...report, recommendations: e.target.value })
            }
            rows={4}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Parent-Friendly Summary
          </label>
          <textarea
            value={report.parentSummary}
            onChange={(e) =>
              setReport({ ...report, parentSummary: e.target.value })
            }
            rows={4}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleApprove}
          disabled={approved}
          className="bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
          {approved ? "Approved ✓" : "Approve Report"}
        </button>
        <p className="text-sm text-slate-500">
          Therapist approval is mandatory — this button is the only way a
          report gets saved.
        </p>
      </div>
    </div>
  );
}