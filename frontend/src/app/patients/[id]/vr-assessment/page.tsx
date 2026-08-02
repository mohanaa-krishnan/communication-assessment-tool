"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getPatient } from "@/lib/api";
import { Patient } from "@/types";

const steps = [
  { label: "Teacher greets the patient", icon: "👋" },
  { label: "Teacher points to objects", icon: "👉" },
  { label: "Patient responds", icon: "🗣️" },
  { label: "Therapist scores Present / Absent", icon: "✅" },
];

export default function VrAssessmentStub({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
 const [patient, setPatient] = useState<Patient | null>(null);
const [activeStep, setActiveStep] = useState(0);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getPatient(id)
    .then(setPatient)
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, [id]);

if (loading)
  return <p className="text-slate-500">Loading patient...</p>;

if (!patient)
  return <p className="text-slate-500">Patient not found.</p>;

  return (
    <div className="max-w-2xl">
      <Link
        href={`/patients/${id}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to {patient.name}
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mt-3">
        Browser VR Assessment
      </h1>
      <p className="text-slate-500 mt-1">
        Virtual Classroom scenario — standardizes how behaviours are elicited.
        No headset required.
      </p>

      <div className="mt-6 bg-slate-900 text-white rounded-lg aspect-video flex flex-col items-center justify-center text-center p-8">
        <p className="text-5xl mb-4">{steps[activeStep].icon}</p>
        <p className="text-lg font-medium">{steps[activeStep].label}</p>
        <p className="text-slate-400 text-sm mt-2">
          Step {activeStep + 1} of {steps.length}
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
          disabled={activeStep === 0}
          className="text-sm font-medium px-4 py-2 rounded-md border border-slate-300 disabled:opacity-40"
        >
          ← Previous
        </button>
        {activeStep < steps.length - 1 ? (
          <button
            onClick={() => setActiveStep((s) => s + 1)}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Next Step →
          </button>
        ) : (
          <Link
            href={`/patients/${id}/assessment/new`}
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Score This Session →
          </Link>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        MVP note: this is a simplified browser walkthrough for demo purposes.
        The full build renders an interactive Three.js classroom scene.
      </p>
    </div>
  );
}