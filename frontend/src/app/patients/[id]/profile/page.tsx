"use client";

import { use, useEffect, useState } from "react";
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
import { getCommunicationProfile, CommunicationProfile } from "@/lib/api";

export default function CommunicationProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<CommunicationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCommunicationProfile(id)
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Something went wrong.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error || !profile)
    return (
      <p className="text-red-600">
        Something went wrong: {error ?? "Patient not found."}
      </p>
    );

  const { patient, approvedAssessments, trend } = profile;

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
            No approved assessments yet — trends appear once a therapist
            approves at least one report.
          </p>
        )}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">
        Approved Assessment Timeline
      </h2>
      <div className="mt-3 bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        {approvedAssessments.length === 0 && (
          <p className="px-5 py-4 text-sm text-slate-500">
            No approved assessments yet.
          </p>
        )}
        {approvedAssessments.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <p className="font-medium text-slate-900">{a.assessmentDate}</p>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              approved
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}