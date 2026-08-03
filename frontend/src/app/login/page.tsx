"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const [submitting, setSubmitting] = useState(false);

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    setSubmitting(false);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Unable to retrieve user.");
    setSubmitting(false);
    return;
  }

  // Therapist?
  const { data: therapist } = await supabase
    .from("therapists")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (therapist) {
    router.push("/");
    return;
  }

  // Parent?
  const { data: parent } = await supabase
    .from("parents")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (parent) {
    router.push("/parent");
    return;
  }

  // Unknown account
  await supabase.auth.signOut();
  alert("Your account has not been registered.");
  setSubmitting(false);
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
  {submitting ? "Signing in..." : "Sign In"}
</button>
          </form>
        </div>

       
      </div>
    </div>
  );
}