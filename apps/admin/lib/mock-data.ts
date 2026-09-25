export interface AdminCourseDraft {
  title: string;
  slug: string;
  displayPrice: string;
  pricePaise: number;
  currency: "INR";
  duration: string;
  schedule: string;
  trainer: string;
  enquiryOnly: boolean;
  reviewRequired: boolean;
}

export const courseDrafts: AdminCourseDraft[] = [
  {
    title: "6-Day Brain Retreat",
    slug: "brain-retreat",
    displayPrice: "₹499",
    pricePaise: 49900,
    currency: "INR",
    duration: "Six evenings",
    schedule: "6–7 PM or 7–8 PM",
    trainer: "Anurag Kumar Jayswal",
    enquiryOnly: false,
    reviewRequired: false
  },
  {
    title: "Mission Mindfulness Foundation Batch",
    slug: "complete-brain-mastery",
    displayPrice: "₹4,999",
    pricePaise: 499900,
    currency: "INR",
    duration: "Three-month Foundation Batch option",
    schedule: "review required",
    trainer: "review required",
    enquiryOnly: false,
    reviewRequired: true
  },
  {
    title: "Teacher/Trainer Training Programme",
    slug: "teacher-trainer-training-programme",
    displayPrice: "From ₹15,000",
    pricePaise: 1500000,
    currency: "INR",
    duration: "21 days",
    schedule: "Practical: 8:00–9:00 PM (4 days/week), Discussion: 9:00–10:00 PM (2 days/week)",
    trainer: "confirmed before enrolment",
    enquiryOnly: true,
    reviewRequired: true
  }
];

export const siteSettingsDraft = {
  brandName: "Mission Mindfulness",
  tagline: "Nurturing Human Intelligence",
  legalCompanyName: "MMI Mindworks (OPC) Private Limited",
  supportPhone: "+91 89487 65399",
  supportEmail: "missionmindfulness16@gmail.com",
  website: "https://missionmindfulness.in",
  social: {
    youtube: "https://www.youtube.com/@Missionmindfulness9384/featured",
    instagram: "https://www.instagram.com/mission_mindfulness_/",
    facebook: "https://www.facebook.com/profile.php?id=61592178920654"
  },
  whatsappUrl: "",
  whatsappNumber: "",
  taxAndRefund: {
    gstin: "",
    gstRate: "",
    gstInclusive: "",
    invoiceFormat: "",
    refundAuthoriser: "",
    refundWorkflow: ""
  }
};
