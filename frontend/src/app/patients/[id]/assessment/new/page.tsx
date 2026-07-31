"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BEHAVIOURS } from "@/lib/behaviours";
import { mockPatients } from "@/lib/mock-data";
import { BehaviourResult } from "@/types";

interface ScoreRow {
  behaviour: string;
  result: BehaviourResult;
  notes: string;
}

export default function NewAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const patient = mockPatients.find((p) => p.id === id);

  const [scores, setScores] = useState<ScoreRow[]>(
    BEHAVIOURS.map((b) => ({ behaviour: b, result: "unscored", notes: "" }))
  );
  const [submitting, setSubmitting] = useState(false);

  function setResult(index: number, result: BehaviourResult) {
    setScores((prev) =>
      prev.map((row, i) => (i === index ? { ...row, result } : row))
    );
  }

  function setNotes(index: number, notes: string) {
    setScores((prev) =>
      prev.map((row, i) => (i === index ? { ...row, notes } : row))
    );
  }

  const allScored = scores.every((s) => s.result !== "unscored");

function handleSubmit() {
    setSubmitting(true);
    // TODO: replace with POST /assessment once backend is ready
    sessionStorage.setItem(`cat-scores-${id}`, JSON.stringify(scores));
    setTimeout(() => {
      router.push(`/patients/${id}/report`);
    }, 400);
  }
  if (!patient) {
    return <p className="text-slate-500">Patient not found.</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        href={`/patients/${id}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to {patient.name}
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mt-3">
        New Assessment
      </h1>
      <p className="text-slate-500 mt-1">
        Score each behaviour as Present or Absent. Notes are optional.
      </p>

      <div className="mt-6 space-y-3">
        {scores.map((row, i) => (
          <div
            key={row.behaviour}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900">{row.behaviour}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResult(i, "present")}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md border ${
                    row.result === "present"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setResult(i, "absent")}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md border ${
                    row.result === "absent"
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Absent
                </button>
              </div>
            </div>
            <textarea
              value={row.notes}
              onChange={(e) => setNotes(i, e.target.value)}
              placeholder="Optional clinical notes..."
              rows={2}
              className="mt-3 w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!allScored || submitting}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save & Generate AI Report"}
        </button>
        {!allScored && (
          <p className="text-sm text-slate-500">
            Score all 10 behaviours to continue.
          </p>
        )}
      </div>
    </div>
  );
}