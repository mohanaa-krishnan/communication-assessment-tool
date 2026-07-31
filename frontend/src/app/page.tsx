import Link from "next/link";
import { mockPatients, mockAssessments } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalPatients = mockPatients.length;
  const approvedReports = mockAssessments.filter(
    (a) => a.status === "approved"
  ).length;
  const pendingReports = mockAssessments.filter(
    (a) => a.status === "draft"
  ).length;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-500 mt-1">
        Overview of your patients and assessment activity.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-sm text-slate-500">Total Patients</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {totalPatients}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-sm text-slate-500">Approved Reports</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {approvedReports}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">
            {pendingReports}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Patients
        </h2>
        <Link
          href="/patients"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="mt-3 bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        {mockPatients.map((p) => (
          <Link
            key={p.id}
            href={`/patients/${p.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
          >
            <div>
              <p className="font-medium text-slate-900">{p.name}</p>
              <p className="text-sm text-slate-500">DOB: {p.dateOfBirth}</p>
            </div>
            <span className="text-sm text-slate-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}