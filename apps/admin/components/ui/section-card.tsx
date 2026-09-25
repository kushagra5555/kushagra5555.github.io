import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid #2f2f35",
        borderRadius: 14,
        padding: 16,
        background: "#16161c"
      }}
    >
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle ? <p style={{ opacity: 0.8, marginTop: 8 }}>{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}
