import { ReviewBadge } from "../../../components/ui/review-badge";
import { SectionCard } from "../../../components/ui/section-card";

const phaseCards = [
  { name: "Schema + RLS baseline", done: true },
  { name: "Secure payment worker skeleton", done: true },
  { name: "Admin CRUD integration", done: false },
  { name: "Learning area integration", done: false },
  { name: "Release hardening", done: false }
];

const compliance = [
  "All uncertain legal/business items remain editable and marked review required.",
  "No official WhatsApp URL is published yet; keep WhatsApp fields editable.",
  "Legal pages are draft status pending lawyer review."
];

export default function DashboardPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ marginBottom: 0 }}>Dashboard Overview</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Nurturing Human Intelligence · staging-safe implementation progress
      </p>

      <SectionCard title="Implementation phases" subtitle="Current build state">
        <div style={{ display: "grid", gap: 10 }}>
          {phaseCards.map((phase) => (
            <div
              key={phase.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #2b2b31",
                borderRadius: 10,
                padding: 10
              }}
            >
              <span>{phase.name}</span>
              <ReviewBadge reviewRequired={!phase.done} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Compliance reminders" subtitle="Must remain true in future changes">
        <ul>
          {compliance.map((line) => (
            <li key={line} style={{ marginBottom: 8 }}>
              {line}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
