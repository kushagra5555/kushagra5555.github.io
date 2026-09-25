export type Role = "admin" | "parent_student" | "instructor";

export interface Course {
  id: string;
  slug: string;
  title: string;
  price_paise: number;
  display_price: string;
  currency: "INR";
  enquiry_only: boolean;
  published: boolean;
  review_required: boolean;
}
