import Link from "next/link";
import { mockPatients } from "@/lib/mock-data";

export default function PatientListPage() {
  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">
            {mockPatients.length} patient(s) on record.
          </p>
        </div>
        <Link
          href="/patients/new"
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Patient
        </Link>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Date of Birth</th>
              <th className="px-5 py-3 font-medium">Caregiver</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPatients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {p.name}
                </td>
                <td className="px-5 py-4 text-slate-600">{p.dateOfBirth}</td>
                <td className="px-5 py-4 text-slate-600">
                  {p.caregiverName}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {p.caregiverContact}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/patients/${p.id}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}