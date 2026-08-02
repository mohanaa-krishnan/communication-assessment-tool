"use client";

import { useEffect, useState } from "react";
import { getParentDashboard } from "@/lib/api";

export default function ParentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Replace this with an actual logged-in parent ID later
    getParentDashboard("343b0408-cfff-414d-b6de-d6ec0a23246d")
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold">
        Welcome {data.parent.full_name} 👋
      </h1>

      <div className="mt-6 bg-white border rounded-lg p-5">

        <h2 className="text-xl font-semibold">
          Child Information
        </h2>

        <p className="mt-3">
          <b>Name:</b> {data.patient.full_name}
        </p>

        <p>
          <b>Date of Birth:</b> {data.patient.date_of_birth}
        </p>

      </div>

    </div>
  );
}