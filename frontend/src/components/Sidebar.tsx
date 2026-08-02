import Link from "next/link";

const navItems = [
  
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white min-h-screen">
      <div className="px-5 py-5 border-b border-slate-200">
        <p className="text-sm font-semibold tracking-wide text-slate-500">
          COMMUNICATION
        </p>
        <p className="text-lg font-bold text-slate-900">Assessment Tool</p>
      </div>
      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}