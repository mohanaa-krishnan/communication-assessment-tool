"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Demo patient used for the Parent role — replace once parent-patient
// linking exists. Matches the Test Patient we've been using throughout.
const DEMO_PARENT_PATIENT_ID = "ae5e3c4c-f1d7-49d4-ac8c-67bbb92cff83";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"therapist" | "parent">("therapist");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // NOTE: cosmetic only — no real authentication yet. Credentials are
    // not validated. This screen exists to demonstrate the intended
    // role-based flow (Therapist vs Parent/Caregiver).
    setTimeout(() => {
      if (role === "therapist") {
        router.push("/");
      } else {
        router.push(`/patients/${DEMO_PARENT_PATIENT_ID}/parent-view`);
      }
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            COMMUNICATION ASSESSMENT TOOL
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Sign in
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex mb-5 border border-slate-200 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("therapist")}
              className={`flex-1 text-sm font-medium py-2 ${
                role === "therapist"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Therapist
            </button>
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`flex-1 text-sm font-medium py-2 ${
                role === "parent"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Parent / Caregiver
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting
                ? "Signing in..."
                : `Sign in as ${role === "therapist" ? "Therapist" : "Parent"}`}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Demo build — credentials are not verified yet.
        </p>
      </div>
    </div>
  );
}