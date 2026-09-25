"use client";

import { ReviewBadge } from "../../../components/ui/review-badge";
import { SectionCard } from "../../../components/ui/section-card";
import { siteSettingsDraft } from "../../../lib/mock-data";

export default function ContentPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>Content & Site Settings</h1>

      <SectionCard title="Brand and support" subtitle="Editable public details">
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="Brand name" value={siteSettingsDraft.brandName} />
          <Field label="Tagline" value={siteSettingsDraft.tagline} />
          <Field label="Legal company name" value={siteSettingsDraft.legalCompanyName} />
          <Field label="Support phone" value={siteSettingsDraft.supportPhone} />
          <Field label="Support email" value={siteSettingsDraft.supportEmail} />
          <Field label="Official website" value={siteSettingsDraft.website} />
        </div>
      </SectionCard>

      <SectionCard title="Social and WhatsApp" subtitle="Do not publish WhatsApp until confirmed">
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="YouTube" value={siteSettingsDraft.social.youtube} />
          <Field label="Instagram" value={siteSettingsDraft.social.instagram} />
          <Field label="Facebook" value={siteSettingsDraft.social.facebook} />
          <Field label="WhatsApp URL" value={siteSettingsDraft.whatsappUrl} />
          <Field label="WhatsApp number" value={siteSettingsDraft.whatsappNumber} />
          <ReviewBadge reviewRequired />
        </div>
      </SectionCard>

      <SectionCard title="GST / tax / refunds" subtitle="Keep review required until business confirms details">
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="GSTIN" value={siteSettingsDraft.taxAndRefund.gstin} />
          <Field label="GST rate" value={siteSettingsDraft.taxAndRefund.gstRate} />
          <Field label="GST inclusive/exclusive" value={siteSettingsDraft.taxAndRefund.gstInclusive} />
          <Field label="Invoice format" value={siteSettingsDraft.taxAndRefund.invoiceFormat} />
          <Field label="Refund authoriser" value={siteSettingsDraft.taxAndRefund.refundAuthoriser} />
          <Field label="Razorpay refund workflow" value={siteSettingsDraft.taxAndRefund.refundWorkflow} />
          <ReviewBadge reviewRequired />
          <button style={saveButtonStyle} type="button">
            Save (wiring pending)
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label>
      <div>{label}</div>
      <input defaultValue={value} style={inputStyle} />
    </label>
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

const saveButtonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #d4af37",
  background: "#191915",
  color: "#f4d27a",
  cursor: "pointer",
  width: "fit-content"
} as const;
