"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getParentDashboard } from "@/lib/api";

export default function ParentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const dashboard = await getParentDashboard(user.id);
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
    load();
  }, [router]);

  if (error) return <p className="text-red-600">Something went wrong: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">
        Welcome {data.parent.full_name} 👋
      </h1>

      <div className="mt-6 bg-white border rounded-lg p-5">
        <h2 className="text-xl font-semibold">Child Information</h2>
        <p className="mt-3">
          <b>Name:</b> {data.patient.full_name}
        </p>
        <p>
          <b>Date of Birth:</b> {data.patient.date_of_birth}
        </p>
      </div>
      <div className="mt-6 bg-white border rounded-lg p-5">
  <h2 className="text-xl font-semibold">
    Latest Approved Report
  </h2>

  {data.report ? (
    <div className="space-y-6 mt-4">

      <div>
        <h3 className="font-semibold text-slate-700">
          Clinical Impression
        </h3>
        <p className="mt-2 whitespace-pre-wrap">
          {data.report.therapist_report}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-700">
          Recommendations
        </h3>
        <p className="mt-2 whitespace-pre-wrap">
          {data.report.recommendations}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-700">
          Parent Summary
        </h3>
        <p className="mt-2 whitespace-pre-wrap">
          {data.report.parent_summary}
        </p>
      </div>

    </div>
  ) : (
    <p className="text-slate-500 mt-3">
      No approved report available yet.
    </p>
  )}
</div>
    </div>
  );
}
