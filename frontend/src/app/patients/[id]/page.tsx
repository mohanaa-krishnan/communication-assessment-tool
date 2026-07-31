import Link from "next/link";
import { notFound } from "next/navigation";
import { mockPatients, mockAssessments } from "@/lib/mock-data";

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = mockPatients.find((p) => p.id === id);
  if (!patient) return notFound();

  const assessments = mockAssessments.filter((a) => a.patientId === id);

  return (
    <div className="max-w-3xl">
      <Link href="/patients" className="text-sm text-blue-600 hover:underline">
        ← Back to Patients
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
          <p className="text-slate-500 mt-1">DOB: {patient.dateOfBirth}</p>
        </div>
    <div className="flex gap-2">
          <Link
            href={`/patients/${patient.id}/vr-assessment`}
            className="bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
          >
            VR Assessment
          </Link>
          <Link
            href={`/patients/${patient.id}/profile`}
            className="bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
          >
            View Intelligence Profile
          </Link>
          <Link
            href={`/patients/${patient.id}/assessment/new`}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Start Assessment
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-lg p-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Caregiver</p>
          <p className="font-medium text-slate-900">{patient.caregiverName}</p>
        </div>
        <div>
          <p className="text-slate-500">Contact</p>
          <p className="font-medium text-slate-900">
            {patient.caregiverContact}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">
        Assessment History
      </h2>
      <div className="mt-3 bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
        {assessments.length === 0 && (
          <p className="px-5 py-4 text-sm text-slate-500">
            No assessments yet.
          </p>
        )}
        {assessments.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-medium text-slate-900">{a.assessmentDate}</p>
              <p className="text-sm text-slate-500 capitalize">{a.status}</p>
            </div>
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
    </div>
  );
}