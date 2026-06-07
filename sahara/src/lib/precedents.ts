// ─────────────────────────────────────────────────────────
// precedents.ts
// Lightweight landmark judgment library.
// Statutes remain primary. These principles are supporting context only.
// ─────────────────────────────────────────────────────────

export interface Precedent {
  case: string;
  year: string;
  court: string;
  topic: string;
  principle: string;
  applicableTo: string[]; // tags used for retrieval
}

export const PRECEDENTS: Precedent[] = [
  {
    case: "Vishaka v. State of Rajasthan",
    year: "1997",
    court: "Supreme Court of India",
    topic: "Employer duty — Workplace Sexual Harassment",
    principle: "Employers have a constitutional duty to provide a safe working environment free from sexual harassment. Sexual harassment at the workplace violates Articles 14, 15, and 21 of the Constitution. The Vishaka Guidelines (now codified as the POSH Act 2013) mandate that employers constitute Complaints Committees and take preventive action.",
    applicableTo: ["POSH", "workplace", "harassment", "employer", "icc", "committee", "duty"],
  },
  {
    case: "Independent Thought v. Union of India",
    year: "2017",
    court: "Supreme Court of India",
    topic: "Minor Wife — POCSO Protection",
    principle: "Sexual intercourse with a minor wife (a girl below 18 years) constitutes rape under POCSO and IPC Section 376. Marital status does not override POCSO protections. A child's age — not marital status — determines legal protection. This ruling closed the marital rape exception for minors.",
    applicableTo: ["POCSO", "child marriage", "minor", "consent", "marriage", "wife"],
  },
  {
    case: "Nipun Saxena v. Union of India",
    year: "2018",
    court: "Supreme Court of India",
    topic: "Victim Identity Protection — POCSO and Sexual Offences",
    principle: "The identity of victims of sexual assault (including POCSO cases) must be strictly protected at all stages — investigation, trial, media reporting, and judgment. Courts must not record identifying information in judgments. Media and individuals disclosing victim identity face prosecution under Section 228A IPC.",
    applicableTo: ["POCSO", "POSH", "identity", "privacy", "media", "disclosure", "victim"],
  },
  {
    case: "State of Maharashtra v. Madhukar Narayan Mardikar",
    year: "1991",
    court: "Supreme Court of India",
    topic: "Victim Character — Irrelevance of Past Conduct",
    principle: "Every woman, regardless of her past conduct or lifestyle, has the right to sexual privacy and bodily integrity. A victim's character or past sexual history is irrelevant in sexual assault cases and cannot be used to undermine her testimony or credibility.",
    applicableTo: ["POCSO", "POSH", "victim", "character", "evidence", "credibility", "testimony"],
  },
  {
    case: "Bachpan Bachao Andolan v. Union of India",
    year: "2011",
    court: "Supreme Court of India",
    topic: "State Duty — Child Protection Infrastructure",
    principle: "The State has a positive constitutional obligation to prevent child abuse and exploitation. Special Juvenile Police Units (SJPU) and Child Welfare Committees (CWC) must be functional in every district. Citizens and NGOs can approach courts for systemic child protection failures.",
    applicableTo: ["POCSO", "child", "protection", "SJPU", "CWC", "state duty", "juvenile"],
  },
  {
    case: "Medha Kotwal Lele v. Union of India",
    year: "2012",
    court: "Supreme Court of India",
    topic: "POSH Compliance Enforcement",
    principle: "States and employers must implement Vishaka Guidelines (now POSH Act) in letter and spirit. High Courts can monitor and enforce compliance. Non-compliance by employers is punishable. Every government body and organisation is required to constitute a Complaints Committee.",
    applicableTo: ["POSH", "employer", "icc", "compliance", "enforcement", "government"],
  },
  {
    case: "Aparna Bhat v. State of Madhya Pradesh",
    year: "2021",
    court: "Supreme Court of India",
    topic: "Sensitization in Sexual Offences — No Stereotype Conditions",
    principle: "Courts cannot impose conditions that stereotype survivors or trivialise sexual offences (e.g., directing accused to tie rakhi to the survivor, or requiring the survivor to forgive). Such conditions violate the dignity of survivors and are unconstitutional. Survivors must never be asked to compromise with their abuser.",
    applicableTo: ["POCSO", "POSH", "dignity", "stereotypes", "court", "conditions", "survivor"],
  },
];

/**
 * Retrieve relevant precedents by matching tags against the query/category.
 * Returns at most 2 precedents to avoid overwhelming LLM context.
 */
export function searchPrecedents(query: string, category?: string): Precedent[] {
  const q = (query + " " + (category || "")).toLowerCase();
  const scored = PRECEDENTS.map((p) => {
    let score = 0;
    for (const tag of p.applicableTo) {
      if (q.includes(tag.toLowerCase())) score += 2;
    }
    if (category && p.applicableTo.includes(category)) score += 3;
    if (q.includes(p.topic.toLowerCase())) score += 2;
    return { p, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.p);
}
