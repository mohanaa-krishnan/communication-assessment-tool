"use client";

import { use, useEffect, useState } from "react";
import { mockPatients } from "@/lib/mock-data";
import { ReportContent } from "@/lib/generate-mock-report";

export default function ParentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patient = mockPatients.find((p) => p.id === id);
  const [report, setReport] = useState<ReportContent | null>(null);

  useEffect(() => {
    // In production this reads the approved clinical_reports/parent_summaries
    // row via GET, not sessionStorage. Kept simple for demo continuity.
    const raw = sessionStorage.getItem(`cat-scores-${id}`);
    if (raw) {
      import("@/lib/generate-mock-report").then(({ generateMockReport }) => {
        setReport(generateMockReport(patient?.name ?? "", JSON.parse(raw)));
      });
    }
  }, [id, patient]);

  if (!patient) return <p className="text-slate-500">Patient not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold tracking-wide text-blue-600">
          COMMUNICATION ASSESSMENT TOOL
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          {patient.name}&apos;s Progress Summary
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Shared by your therapist — written for families
        </p>
      </div>

      {report ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-slate-700 leading-relaxed">
            {report.parentSummary}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
          No approved summary yet. Please check back after your next session.
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-blue-900 mb-2">
          Practice at home
        </h2>
        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
          <li>Practice joint attention using your child&apos;s favorite toy</li>
          <li>Model turn-taking during simple games</li>
          <li>Celebrate every attempt at eye contact and greeting</li>
        </ul>
      </div>
    </div>
  );
}