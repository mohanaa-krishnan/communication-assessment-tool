export default function Home() {
  const patients = [
    {
      name: "Arjun Kumar",
      age: "6 years",
      profile: "Autism support",
      lastAssessment: "Today",
    },
    {
      name: "Meera S",
      age: "8 years",
      profile: "Speech delay",
      lastAssessment: "Yesterday",
    },
    {
      name: "Kavin R",
      age: "5 years",
      profile: "Language screening",
      lastAssessment: "Jul 29",
    },
  ];

  const workflow = [
    "Patient",
    "Assessment",
    "AI report",
    "Clinician review",
    "Parent summary",
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold tracking-wide text-white">
              CAT
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">
                Clinical workspace
              </p>
              <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                Communication Assessment Tool
              </h1>
            </div>
          </div>
          <button className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Add Patient
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Today's patients
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">12</p>
            <p className="mt-2 text-sm text-emerald-700">4 ready to assess</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending reports
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">3</p>
            <p className="mt-2 text-sm text-amber-700">Needs clinician review</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed assessments
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">8</p>
            <p className="mt-2 text-sm text-indigo-700">Profiles updated</p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Patient Queue
                </h2>
                <p className="text-sm text-slate-500">
                  Select a child to continue the clinical workflow.
                </p>
              </div>
              <span className="w-fit rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
                Demo clinic
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <div
                  className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={patient.name}
                >
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {patient.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {patient.age} - {patient.profile} - Last assessment:{" "}
                      {patient.lastAssessment}
                    </p>
                  </div>
                  <button className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:border-teal-700 hover:text-teal-800">
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Today's Flow
            </h2>
            <div className="mt-5 space-y-3">
              {workflow.map((step, index) => (
                <div className="flex items-center gap-3" key={step}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4">
              <p className="text-sm font-semibold text-teal-900">
                AI assists clinicians. It never replaces clinical judgment.
              </p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
