"use client";

import { use } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockPatients, mockAssessments } from "@/lib/mock-data";
import { mockTrend, mockRecommendations } from "@/lib/mock-profile";

export default function CommunicationProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patient = mockPatients.find((p) => p.id === id);
  const assessments = mockAssessments.filter((a) => a.patientId === id);
  const trend = mockTrend[id] ?? [];
  const recommendations = mockRecommendations[id] ?? [];

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
        Communication Intelligence Profile
      </h1>
      <p className="text-slate-500 mt-1">
        Longitudinal view of {patient.name}&apos;s communication progress.
      </p>

      <div className="mt-6 bg-white border border-slate-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Behaviours Present Over Time
        </h2>
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="presentCount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">
            Not enough data yet — trends appear after 2+ assessments.
          </p>
        )}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">
        Assessment Timeline
      </h2>
      <div className="mt-3 bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        {assessments.map((a) => (
          <div key={a.id} className="px-5 py-4 flex items-center justify-between">
            <p className="font-medium text-slate-900">{a.assessmentDate}</p>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                a.status === "approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {a.status}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">
        Therapy Recommendations
      </h2>
      <div className="mt-3 bg-white border border-slate-200 rounded-lg p-5">
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
          {recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}