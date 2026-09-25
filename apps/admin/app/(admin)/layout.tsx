import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/lessons", label: "Lessons" },
  { href: "/live-sessions", label: "Live Sessions" },
  { href: "/enrollments", label: "Enrollments" },
  { href: "/payments", label: "Payments" },
  { href: "/content", label: "Content" },
  { href: "/enquiries", label: "Enquiries" },
  { href: "/users", label: "Users" },
  { href: "/reports", label: "Reports" },
  { href: "/audit-log", label: "Audit Log" }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #2d2d2d", padding: 18, background: "#121216" }}>
        <h2 style={{ marginTop: 0 }}>Mission Mindfulness</h2>
        <p style={{ marginTop: 4, opacity: 0.8 }}>Admin Dashboard</p>
        <nav style={{ display: "grid", gap: 10, marginTop: 20 }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "#f4d27a", textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section style={{ padding: 24 }}>{children}</section>
    </main>
  );
}
