"use client";

import { useMemo, useState } from "react";
import { ReviewBadge } from "../../../components/ui/review-badge";
import { SectionCard } from "../../../components/ui/section-card";
import { courseDrafts } from "../../../lib/mock-data";

export default function CoursesPage() {
  const [selectedSlug, setSelectedSlug] = useState(courseDrafts[0]?.slug ?? "");

  const selected = useMemo(
    () => courseDrafts.find((course) => course.slug === selectedSlug) ?? courseDrafts[0],
    [selectedSlug]
  );

  if (!selected) {
    return <p>No courses available yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Courses</h1>
      <SectionCard title="Course list" subtitle="Published draft records from confirmed public information">
        <div style={{ display: "grid", gap: 8 }}>
          {courseDrafts.map((course) => (
            <button
              key={course.slug}
              onClick={() => setSelectedSlug(course.slug)}
              style={{
                textAlign: "left",
                borderRadius: 10,
                border: course.slug === selected.slug ? "1px solid #d4af37" : "1px solid #2d2d35",
                padding: 10,
                background: "#111116",
                color: "#f4d27a",
                cursor: "pointer"
              }}
            >
              <strong>{course.title}</strong>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span>{course.displayPrice}</span>
                <ReviewBadge reviewRequired={course.reviewRequired} />
              </div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Course editor" subtitle="Fields remain editable; unconfirmed fields are review required.">
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            <div>Title</div>
            <input defaultValue={selected.title} style={inputStyle} />
          </label>
          <label>
            <div>Slug</div>
            <input defaultValue={selected.slug} style={inputStyle} />
          </label>
          <label>
            <div>Display price</div>
            <input defaultValue={selected.displayPrice} style={inputStyle} />
          </label>
          <label>
            <div>Price (paise)</div>
            <input defaultValue={String(selected.pricePaise)} style={inputStyle} />
          </label>
          <label>
            <div>Duration</div>
            <input defaultValue={selected.duration} style={inputStyle} />
          </label>
          <label>
            <div>Schedule</div>
            <textarea defaultValue={selected.schedule} style={textareaStyle} />
          </label>
          <label>
            <div>Trainer</div>
            <input defaultValue={selected.trainer} style={inputStyle} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" defaultChecked={selected.enquiryOnly} />
            Enquiry-only course
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ReviewBadge reviewRequired={selected.reviewRequired} />
            <button style={saveButtonStyle} type="button">
              Save (wiring pending)
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 4,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #2d2d35",
  background: "#0e0e12",
  color: "#f4d27a"
} as const;

const textareaStyle = {
  ...inputStyle,
  minHeight: 90
} as const;

const saveButtonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #d4af37",
  background: "#191915",
  color: "#f4d27a",
  cursor: "pointer"
} as const;
