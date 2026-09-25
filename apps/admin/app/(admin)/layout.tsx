import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ borderRight: "1px solid #2d2d2d", padding: 16 }}>
        <h2>Mission Mindfulness</h2>
        <p>Admin</p>
      </aside>
      <section style={{ padding: 24 }}>{children}</section>
    </main>
  );
}
