"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPatientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverContact, setCaregiverContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: replace with POST /patient once backend is ready
    console.log({ name, dob, caregiverName, caregiverContact });
    setTimeout(() => {
      router.push("/patients");
    }, 400);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Add Patient</h1>
      <p className="text-slate-500 mt-1">
        Enter basic patient and caregiver details.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white border border-slate-200 rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Aarav Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Caregiver Name
          </label>
          <input
            type="text"
            required
            value={caregiverName}
            onChange={(e) => setCaregiverName(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Priya Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Caregiver Contact
          </label>
          <input
            type="tel"
            required
            value={caregiverContact}
            onChange={(e) => setCaregiverContact(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 9876543210"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}