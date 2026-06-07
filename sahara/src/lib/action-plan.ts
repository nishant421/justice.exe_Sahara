export interface ActionPlan {
  category: string;
  situationSummary: string;
  relevantRights: string[];
  legalSections: { section: string; summary: string }[];
  immediateNextSteps: string[];
  importantContacts: { name: string; number: string; note: string }[];
  supportResources: { name: string; contact: string; description: string }[];
  safetyRecommendations: string[];
}

export function buildActionPlan(category: string, conversationSummary: string): ActionPlan {
  const isPOCSO = category === "POCSO";
  const isPOSH = category === "POSH";
  const isWitness = category === "WITNESS";

  const plan: ActionPlan = {
    category,
    situationSummary: conversationSummary,
    relevantRights: [],
    legalSections: [],
    immediateNextSteps: [],
    importantContacts: [],
    supportResources: [],
    safetyRecommendations: [],
  };

  if (isPOCSO) {
    plan.relevantRights = [
      "The child has the right to be heard in a child-friendly environment",
      "The child's identity must be protected at all stages",
      "Free legal aid is available through NALSA",
      "Medical examination must be conducted with consent and by a qualified doctor",
      "The child cannot be detained at the police station overnight",
    ];
    plan.legalSections = [
      { section: "POCSO Section 19", summary: "Mandatory reporting – anyone must report suspected child abuse" },
      { section: "POCSO Section 24", summary: "Child's statement to be recorded at home, by a woman officer for girl child" },
      { section: "POCSO Section 28", summary: "Special Courts conduct child-friendly in-camera trials" },
      { section: "POCSO Section 40", summary: "Child-friendly atmosphere guaranteed during trial" },
      { section: "Article 39A", summary: "Free legal aid is your constitutional right" },
    ];
    plan.immediateNextSteps = [
      "Call Childline 1098 (24x7 free) or the nearest police station",
      "Ensure the child is in a safe place away from the alleged abuser",
      "Do NOT pressure the child to repeat their account multiple times",
      "Preserve any evidence if safe to do so (messages, records)",
      "Take the child for medical examination at a government hospital",
      "File an FIR at the nearest police station – they are legally obligated to register it",
      "Request a woman police officer for recording the child's statement",
      "Apply for free legal aid at the nearest District Legal Services Authority",
    ];
    plan.importantContacts = [
      { name: "Childline", number: "1098", note: "24x7 free helpline for child protection" },
      { name: "Emergency / Police", number: "112", note: "Immediate danger or emergency" },
      { name: "NALSA (Legal Aid)", number: "15100", note: "Free legal services" },
      { name: "Women Helpline", number: "181", note: "One Stop Centre services" },
    ];
  } else if (isPOSH) {
    plan.relevantRights = [
      "Right to file a complaint with the Internal Complaints Committee (ICC) within 3 months",
      "Right to interim relief including transfer or leave during inquiry",
      "Right to confidentiality throughout the process",
      "Right to appeal the ICC decision",
      "Right to free legal aid if needed",
    ];
    plan.legalSections = [
      { section: "POSH Section 2(n)", summary: "Comprehensive definition of sexual harassment at workplace" },
      { section: "POSH Section 4", summary: "Every employer with 10+ employees must have an ICC" },
      { section: "POSH Section 9", summary: "File written complaint to ICC within 3 months of incident" },
      { section: "POSH Section 11", summary: "Inquiry must be completed within 90 days" },
      { section: "POSH Section 12", summary: "You can request interim relief (transfer, leave) during inquiry" },
    ];
    plan.immediateNextSteps = [
      "Identify whether your organization has an ICC (ask HR if needed)",
      "Document the incident(s) in writing with dates, times, witnesses",
      "File a written complaint to the ICC within 3 months of the incident",
      "Request interim measures if needed (transfer, work from home, leave)",
      "If no ICC exists, file with the Local Complaints Committee (LCC) at the District level",
      "You can also file on SHe-Box portal: shebox.nic.in",
      "Keep copies of all communications for your records",
    ];
    plan.importantContacts = [
      { name: "SHe-Box Portal", number: "shebox.nic.in", note: "Online POSH complaint portal" },
      { name: "Women Helpline", number: "181", note: "One Stop Centre, One Stop services" },
      { name: "iCALL Counseling", number: "9152987821", note: "Free psychological support" },
      { name: "NALSA (Legal Aid)", number: "15100", note: "Free legal services if needed" },
    ];
  } else if (isWitness) {
    plan.relevantRights = [
      "Witnesses have the right to protection under Witness Protection Scheme 2018",
      "Anonymous reporting is possible through Childline 1098 or police",
      "You will not be penalized for good-faith reporting",
    ];
    plan.legalSections = [
      { section: "POCSO Section 19", summary: "Any person who suspects child abuse is legally REQUIRED to report" },
      { section: "POCSO Section 21", summary: "Failure to report is itself a criminal offence" },
    ];
    plan.immediateNextSteps = [
      "Report to the nearest police station or call 1098 (Childline) or 112",
      "Share what you observed – you don't need to have all the details",
      "Your identity can be kept confidential if you request",
      "Provide any evidence you may have (photos, messages, records)",
    ];
    plan.importantContacts = [
      { name: "Childline", number: "1098", note: "Report anonymously if needed" },
      { name: "Emergency / Police", number: "112", note: "File a complaint" },
      { name: "Women Helpline", number: "181", note: "Witness support and guidance" },
    ];
  } else {
    plan.relevantRights = [
      "Every citizen has the right to free legal aid under Article 39A",
      "You have the right to file a police complaint for any crime",
      "The police must register your FIR if you report a cognizable offence",
    ];
    plan.legalSections = [
      { section: "Article 39A", summary: "Free legal aid is your constitutional right" },
    ];
    plan.immediateNextSteps = [
      "Identify the most relevant legal category for your situation",
      "Reach out to a legal aid service for guidance",
      "Contact a helpline for emotional support and further direction",
    ];
    plan.importantContacts = [
      { name: "NALSA (Legal Aid)", number: "15100", note: "Free legal services" },
      { name: "iCALL Counseling", number: "9152987821", note: "Emotional support" },
      { name: "Emergency", number: "112", note: "If in danger" },
    ];
  }

  plan.supportResources = [
    { name: "iCALL – TISS", contact: "9152987821", description: "Free psychological counseling and trauma support" },
    { name: "One Stop Centre (Sakhi)", contact: "181", description: "Medical, legal, shelter, and counseling" },
    { name: "NALSA", contact: "15100", description: "Free legal representation at all stages" },
    { name: "Childline", contact: "1098", description: "24x7 child protection helpline" },
  ];

  plan.safetyRecommendations = [
    "Your safety is the top priority — ensure you are in a safe space",
    "You don't have to face this alone — reach out to a trusted person",
    "All conversations with helplines are confidential",
    "Take things one step at a time — you don't need to have all answers right now",
    "It is okay to ask for help and support",
  ];

  return plan;
}
