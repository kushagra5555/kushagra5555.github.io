insert into public.site_settings (key, value, review_required, published) values
('brand.profile', '{"name":"Mission Mindfulness","tagline":"Nurturing Human Intelligence","legal_company_name":"MMI Mindworks (OPC) Private Limited","website":"https://missionmindfulness.in","support_phone":"+91 89487 65399","support_email":"missionmindfulness16@gmail.com","service_availability":"Online across India","offline_note":"Offline programme availability in Dehradun is subject to confirmation."}', false, true),
('brand.social', '{"youtube":"https://www.youtube.com/@Missionmindfulness9384/featured","instagram":"https://www.instagram.com/mission_mindfulness_/","facebook":"https://www.facebook.com/profile.php?id=61592178920654","whatsapp_url":null,"whatsapp_number":null,"whatsapp_review_required":true}', false, true),
('founder.profile', '{"name":"Anurag Kumar Jayswal","description":"Mission Mindfulness is led by Anurag Kumar Jayswal, whose work brings together student learning practice, mindful focus, and public demonstrations of memory and reading activities.","review_required":false}', false, true),
('compliance.boundaries', '{"scope":"Mission Mindfulness provides educational activities related to study habits, attention, reading, recall, mindfulness practices, and communication. It is not a medical, mental-health, clinical, or therapeutic service. It does not diagnose, treat, cure, or prevent any condition."}', false, true),
('tax_and_refunds', '{"gstin":null,"gst_rate":null,"gst_inclusive":null,"invoice_format":null,"refund_authoriser":null,"refund_workflow":null}', true, false),
('school_programmes', '{"features":["Student workshops for memory, focus, reading, recall, and study-practice activities","Six-day Brain Retreat and three-month Foundation Batch options","Teacher orientation","Parent information sessions","School workshop or partnership enquiry"],"launch_workflow":"school-enquiry","future_modules":["bulk-enrollment","invoices","school-admin-accounts","mou-document-generation"]}', false, true)
on conflict (key) do nothing;

insert into public.courses (
  slug, title, short_description, description, age_min, age_max, duration_label, format, price_paise, display_price, currency,
  active, published, enquiry_only, review_required, themes, outcomes, schedule
)
values
(
  'brain-retreat',
  '6-Day Brain Retreat',
  'Structured memory training and mindful focus for children aged 7 to 14.',
  'Structured memory training, mindful focus, and clear practice systems for children aged 7 to 14, helping them learn with confidence.',
  7,
  14,
  'Six evenings',
  'Live evening programme',
  49900,
  '₹499',
  'INR',
  true,
  true,
  false,
  false,
  array['Focus','Memory','Attention','Learning Skills','Confidence','Mindfulness'],
  array['Learn with confidence through consistent guided practice'],
  '{"time_choices":["6–7 PM","7–8 PM"],"marketing_line":"Six evenings, choose 6–7 PM or 7–8 PM. Rs. 499 to begin with a clear plan."}'::jsonb
),
(
  'complete-brain-mastery',
  'Mission Mindfulness Foundation Batch',
  'Three-month foundation option focused on memory, focus, reading, and recall.',
  'A deeper learning, memory, concentration, calm-focus, and confidence programme for children.',
  7,
  14,
  'Three-month Foundation Batch option',
  null,
  499900,
  '₹4,999',
  'INR',
  true,
  true,
  false,
  true,
  array['Student memory','Focus','Reading','Recall','Revision systems','Study-practice activities','Calm memory recall'],
  array[]::text[],
  '{"module_breakdown":"review required","trainer":"review required","delivery_method":"review required","final_schedule":"review required"}'::jsonb
),
(
  'teacher-trainer-training-programme',
  'Teacher/Trainer Training Programme',
  'Educational and professional-development programme for educators and trainers.',
  'A programme for educators, coaches, mentors, counsellors, trainers, and adult professional learners who want to teach children with more structure and care.',
  null,
  null,
  '21 days',
  'On-demand lessons + mentor-led sessions',
  1500000,
  'From ₹15,000',
  'INR',
  true,
  true,
  true,
  false,
  array['Responsible teaching practice','Communication','Reflection'],
  array['Observe patterns','Practise skills','Apply responsibly','Review progress'],
  '{"practical_classes":"8:00 PM to 9:00 PM, four days each week","discussion_classes":"9:00 PM to 10:00 PM, two days each week","dates":"confirmed before enrolment","mentor_details":"confirmed before enrolment","seat_availability":"confirmed before enrolment"}'::jsonb
)
on conflict (slug) do nothing;

insert into public.legal_pages (slug, title, body, status, review_required) values
('privacy-policy', 'Privacy Policy (Draft)', 'Pre-launch draft requiring lawyer review. Includes enquiry/account data use, parent-supervised enrolment guidance, and user rights requests.', 'draft', true),
('terms-and-conditions', 'Terms and Conditions (Draft)', 'Pre-launch draft requiring lawyer review. Access is personal, schedules may change with notice, and no guaranteed outcomes.', 'draft', true),
('refund-cancellation-policy', 'Refund / Cancellation Policy (Draft)', 'Pre-launch draft requiring lawyer review. Current draft position: payments are generally non-refundable after place/access confirmation unless required by law.', 'draft', true),
('disclaimer', 'Educational Disclaimer (Draft)', 'Learning material is educational and not medical, psychological, diagnostic, therapeutic, legal, or financial advice.', 'draft', true),
('cookie-policy', 'Cookie Policy (Draft)', 'Pre-launch draft requiring lawyer review. Essential auth cookies and optional analytics cookies may be used.', 'draft', true),
('data-deletion', 'Data Deletion Request (Draft)', 'Request by email to missionmindfulness16@gmail.com with subject Data deletion request. Draft timeline target: within 30 days where legally permitted.', 'draft', true)
on conflict (slug) do nothing;

insert into public.faqs (scope, question, answer, sort_order, published, review_required) values
('general', 'Is this a medical or therapeutic service?', 'No. Mission Mindfulness is an educational learning-practice platform and not a medical, clinical, or therapeutic service.', 1, true, false),
('general', 'Can WhatsApp support be used now?', 'Official WhatsApp support details are pending business confirmation and will be published once confirmed.', 2, true, true)
on conflict do nothing;
