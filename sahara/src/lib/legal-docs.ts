export interface LegalDoc {
  id: string;
  title: string;
  category: "POCSO" | "POSH" | "GENERAL" | "RIGHTS";
  section?: string;
  content: string;
  keywords: string[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  // POCSO
  {
    id: "pocso-3",
    title: "POCSO Section 3 – Penetrative Sexual Assault",
    category: "POCSO",
    section: "Section 3",
    content:
      "Under POCSO Section 3, penetrative sexual assault against a child (under 18) is a serious cognizable offence. Any person who commits penetrative sexual assault shall be punished with rigorous imprisonment for a term which shall not be less than seven years and may extend to imprisonment for life, along with fine.",
    keywords: ["child", "sexual assault", "pocso", "penetrative", "abuse", "minor"],
  },
  {
    id: "pocso-4",
    title: "POCSO Section 4 – Punishment for Penetrative Sexual Assault",
    category: "POCSO",
    section: "Section 4",
    content:
      "POCSO Section 4 prescribes punishment: minimum 20 years imprisonment, extendable to life imprisonment or death in aggravated cases (Section 5/6). The punishment reflects the gravity of crimes against children.",
    keywords: ["punishment", "imprisonment", "pocso", "child", "sentence"],
  },
  {
    id: "pocso-5",
    title: "POCSO Section 5 – Aggravated Penetrative Sexual Assault",
    category: "POCSO",
    section: "Section 5",
    content:
      "Aggravated POCSO cases include assault by police officer, public servant, armed force member, relative, doctor, teacher, or when the child is below 12 years old. These attract enhanced punishment up to death penalty.",
    keywords: ["aggravated", "teacher", "police", "relative", "child below 12", "pocso"],
  },
  {
    id: "pocso-7",
    title: "POCSO Section 7 – Sexual Assault",
    category: "POCSO",
    section: "Section 7",
    content:
      "POCSO Section 7 covers non-penetrative sexual assault – touching a child's genitals, breast, or making the child touch the offender's body. Punishment is 3-5 years imprisonment plus fine.",
    keywords: ["touching", "sexual assault", "non-penetrative", "child", "pocso"],
  },
  {
    id: "pocso-8",
    title: "POCSO Section 8 – Punishment for Sexual Assault",
    category: "POCSO",
    section: "Section 8",
    content:
      "Punishment under Section 8 for sexual assault (Section 7) is imprisonment of 3 to 5 years and fine.",
    keywords: ["punishment", "section 8", "pocso", "sentence"],
  },
  {
    id: "pocso-19",
    title: "POCSO Section 19 – Mandatory Reporting",
    category: "POCSO",
    section: "Section 19",
    content:
      "POCSO Section 19 mandates that ANY person (not just officials) who has knowledge or apprehension that a sexual offence has been committed against a child MUST report it to the Special Juvenile Police Unit (SJPU) or local police. Failure to report is punishable by 6 months imprisonment or fine. Parents, teachers, doctors, neighbors are all covered.",
    keywords: ["mandatory reporting", "report", "duty", "police", "SJPU", "obligation", "must report"],
  },
  {
    id: "pocso-21",
    title: "POCSO Section 21 – Punishment for Failure to Report",
    category: "POCSO",
    section: "Section 21",
    content:
      "Any person who fails to report a POCSO offence or fails to record such offence commits a criminal offence punishable with 6 months imprisonment, or fine, or both. Media persons face additional fines for non-disclosure of victim identity.",
    keywords: ["failure to report", "punishment", "non-reporting", "pocso"],
  },
  {
    id: "pocso-24",
    title: "POCSO Section 24 – Recording Child's Statement",
    category: "POCSO",
    section: "Section 24",
    content:
      "Under POCSO, a child's statement must be recorded at the child's residence or a place of their choice. Police must be in plain clothes. Statement must be recorded in child's own words. A woman officer must record the statement of a girl child. No child shall be detained overnight at the police station.",
    keywords: ["statement", "recording", "child statement", "police", "protection", "pocso"],
  },
  {
    id: "pocso-25",
    title: "POCSO Section 25 – Recording Child's Statement by Magistrate",
    category: "POCSO",
    section: "Section 25",
    content:
      "A Magistrate must record a child's statement as a Commission, at the child's residence or accessible place. The child should not be confronted with the accused. Special Educator or interpreter must assist if needed.",
    keywords: ["magistrate", "statement", "child", "pocso", "record"],
  },
  {
    id: "pocso-26",
    title: "POCSO Section 26 – Additional Provisions for Recording",
    category: "POCSO",
    section: "Section 26",
    content:
      "The child's statement may be video-graphed. A child is not required to repeat their statement multiple times. The child shall not be exposed to the accused and the court may take measures to protect the child's identity.",
    keywords: ["video recording", "statement", "child protection", "pocso", "identity protection"],
  },
  {
    id: "pocso-28",
    title: "POCSO Section 28 – Special Courts",
    category: "POCSO",
    section: "Section 28",
    content:
      "The State Government shall designate Special Courts for the purpose of providing speedy trial of offences under POCSO. The Special Court shall conduct the trial in camera (in private). The Special Court ensures child-friendly procedures.",
    keywords: ["special court", "trial", "in camera", "speedy trial", "child court", "pocso"],
  },
  {
    id: "pocso-40",
    title: "POCSO Section 40 – Child-Friendly Atmosphere",
    category: "POCSO",
    section: "Section 40",
    content:
      "POCSO guarantees that the trial shall be conducted in a child-friendly atmosphere. The identity of the child shall not be disclosed in any media. The court may allow a support person to accompany the child.",
    keywords: ["child friendly", "atmosphere", "support person", "identity", "pocso", "media"],
  },

  // POSH
  {
    id: "posh-2n",
    title: "POSH Section 2(n) – Definition of Sexual Harassment",
    category: "POSH",
    section: "Section 2(n)",
    content:
      "Under POSH Act 2013, Sexual Harassment includes: (i) physical contact and advances, (ii) demand or request for sexual favors, (iii) sexually colored remarks, (iv) showing pornography, (v) any other unwelcome physical, verbal or non-verbal conduct of a sexual nature. This includes quid pro quo harassment and hostile work environment.",
    keywords: ["sexual harassment", "definition", "workplace", "posh", "unwelcome", "hostile environment"],
  },
  {
    id: "posh-4",
    title: "POSH Section 4 – Internal Complaints Committee (ICC)",
    category: "POSH",
    section: "Section 4",
    content:
      "Every employer with 10 or more employees MUST constitute an Internal Complaints Committee (ICC). ICC must have: (a) Presiding Officer – senior woman employee, (b) two employee members committed to women's causes, (c) one external member from NGO/legal field. At least half members must be women. ICC has powers of a Civil Court.",
    keywords: ["ICC", "internal complaints committee", "employer", "workplace", "posh", "committee"],
  },
  {
    id: "posh-9",
    title: "POSH Section 9 – Filing Complaint",
    category: "POSH",
    section: "Section 9",
    content:
      "A complainant can file a written complaint to the ICC within 3 months of the incident (extendable by another 3 months for sufficient cause). If the aggrieved woman is unable to file, any other person on her behalf can do so. If incapacitated, legal heir or prescribed person can file.",
    keywords: ["complaint", "filing", "ICC", "3 months", "deadline", "posh", "how to file"],
  },
  {
    id: "posh-10",
    title: "POSH Section 10 – Conciliation",
    category: "POSH",
    section: "Section 10",
    content:
      "Before initiating inquiry, the ICC may, at the request of the aggrieved woman, attempt conciliation between the parties. No monetary settlement shall be a basis for conciliation. If conciliation fails, the ICC shall proceed with inquiry.",
    keywords: ["conciliation", "settlement", "mediation", "posh", "ICC"],
  },
  {
    id: "posh-11",
    title: "POSH Section 11 – Inquiry into Complaint",
    category: "POSH",
    section: "Section 11",
    content:
      "The ICC shall complete inquiry within 90 days. Both parties shall be given opportunity to be heard. Principles of natural justice must be followed. The inquiry shall be kept confidential. The ICC can recommend interim relief to the employer.",
    keywords: ["inquiry", "90 days", "investigation", "natural justice", "posh", "ICC process"],
  },
  {
    id: "posh-12",
    title: "POSH Section 12 – Interim Relief",
    category: "POSH",
    section: "Section 12",
    content:
      "During pending inquiry, the ICC can recommend to employer: (a) transfer of aggrieved woman or respondent, (b) grant leave to aggrieved woman (up to 3 months), (c) restrain respondent from reporting on aggrieved woman, (d) other interim relief as warranted.",
    keywords: ["interim relief", "transfer", "leave", "protection", "posh", "pending inquiry"],
  },
  {
    id: "posh-26",
    title: "POSH Section 26 – Penalty for Non-Compliance",
    category: "POSH",
    section: "Section 26",
    content:
      "An employer who fails to constitute ICC or comply with POSH provisions shall be liable to pay a fine of up to Rs. 50,000. Repeat violations may result in cancellation of license/registration. District Officer has power to impose penalties.",
    keywords: ["penalty", "fine", "non-compliance", "employer", "posh", "50000"],
  },

  // General Rights & Support
  {
    id: "article-39a",
    title: "Article 39A – Free Legal Aid",
    category: "RIGHTS",
    content:
      "Article 39A of the Indian Constitution directs the State to ensure equal justice and free legal aid to citizens who cannot afford legal representation due to economic or other disability. The Legal Services Authorities Act 1987 implements this through NALSA (National Legal Services Authority) and SLSA (State Legal Services Authorities).",
    keywords: ["free legal aid", "lawyer", "legal help", "nalsa", "article 39a", "rights", "free"],
  },
  {
    id: "nalsa",
    title: "NALSA – National Legal Services Authority",
    category: "RIGHTS",
    content:
      "NALSA provides free legal services to women, children, SC/ST, persons with disabilities, victims of trafficking, and economically weaker sections. Contact: 15100 (Toll-Free). NALSA has a special scheme for victims of sexual crimes. Legal aid is provided at all stages including police station, court, and trial.",
    keywords: ["nalsa", "free legal services", "legal aid", "helpline", "15100", "lawyer", "rights"],
  },
  {
    id: "childline",
    title: "Childline 1098 – Child Helpline",
    category: "GENERAL",
    content:
      "Childline 1098 is India's first 24-hour, free emergency phone outreach service for children in need of care and protection. Available 24x7, free of cost. Can be called by the child, or any adult on behalf of the child. Childline connects children to police, shelter homes, medical services, and legal aid.",
    keywords: ["childline", "1098", "child helpline", "emergency", "24 hours", "child abuse", "report"],
  },
  {
    id: "she-box",
    title: "SHe-Box – Online Complaint Portal for POSH",
    category: "POSH",
    content:
      "SHe-Box (Sexual Harassment electronic Box) is an online complaint management system by Ministry of Women and Child Development. It enables women employees (government and private sector) to file complaints of sexual harassment at the workplace. Portal: shebox.nic.in. All complaints are monitored and tracked.",
    keywords: ["she-box", "online complaint", "workplace", "posh", "government portal", "shebox.nic.in"],
  },
  {
    id: "icall",
    title: "iCALL – Psychological Counseling Helpline",
    category: "GENERAL",
    content:
      "iCALL is a free, confidential counseling and referral service by TISS (Tata Institute of Social Sciences). Provides free psychological support to survivors of abuse, trauma, and harassment. Contact: 9152987821. Services available in Hindi and English. Email: icall@tiss.edu",
    keywords: ["icall", "counseling", "mental health", "trauma", "9152987821", "tiss", "support", "helpline"],
  },
  {
    id: "dcpu",
    title: "District Child Protection Unit (DCPU)",
    category: "POCSO",
    content:
      "Every district has a District Child Protection Unit (DCPU) under the Juvenile Justice Act. DCPU coordinates child protection services including shelter, medical, legal, and rehabilitation. DCPU works with SJPU (Special Juvenile Police Unit) for POCSO cases. Contact your District Collector's office for DCPU details.",
    keywords: ["DCPU", "district", "child protection", "SJPU", "juvenile", "local help"],
  },
  {
    id: "one-stop-centre",
    title: "One Stop Centre – Sakhi",
    category: "GENERAL",
    content:
      "One Stop Centres (Sakhi) provide integrated services to women affected by violence including domestic violence, sexual assault, and workplace harassment. Services include medical, legal, psychological counseling, police facilitation, shelter. Toll-free: 181 (Women Helpline). Available in most districts.",
    keywords: ["one stop centre", "sakhi", "181", "women helpline", "shelter", "support"],
  },
  {
    id: "victim-compensation",
    title: "Victim Compensation – POCSO and POSH",
    category: "RIGHTS",
    content:
      "Under POCSO, Special Courts can award compensation to child victims during trial or after conviction. Under POSH, the ICC can recommend compensation based on mental trauma, medical expenses, and loss of career opportunity. Free legal aid is available through NALSA for claiming compensation.",
    keywords: ["compensation", "victim rights", "money", "damages", "court", "pocso compensation", "posh compensation"],
  },
];

export function searchLegalDocs(query: string, limit = 3): LegalDoc[] {
  const q = query.toLowerCase();
  const scored = LEGAL_DOCS.map((doc) => {
    let score = 0;
    const text = (doc.title + " " + doc.content + " " + doc.keywords.join(" ")).toLowerCase();
    const words = q.split(/\s+/);
    for (const word of words) {
      if (word.length < 3) continue;
      if (text.includes(word)) score += 2;
      if (doc.keywords.some((k) => k.toLowerCase().includes(word))) score += 3;
    }
    // Category boost
    if (q.includes("pocso") && doc.category === "POCSO") score += 5;
    if (q.includes("posh") && doc.category === "POSH") score += 5;
    if (q.includes("child") && doc.category === "POCSO") score += 3;
    if (q.includes("workplace") && doc.category === "POSH") score += 3;
    if (q.includes("report") || q.includes("complaint")) score += 1;
    return { doc, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}
