// ─────────────────────────────────────────────────────────
// legalRules.ts
// Deterministic legal rule engine — no LLM involved here.
// Thresholds are hard-coded from Indian statute text.
// The LLM consumes rule outputs; it does not determine them.
// ─────────────────────────────────────────────────────────

export interface IntakeState {
  age: number | null;
  childInvolved: boolean | null;
  workplace: boolean | null;
  employeeCount: number | null;
  immediateDanger: boolean | null;
  reportedBefore: boolean | null;
  relationshipToVictim: string | null; // "self" | "parent" | "witness" | "colleague" | null
  state: string | null;
  gender: "male" | "female" | "other" | null;
}

export interface RuleOutput {
  minorInvolved: boolean;        // age < 18 → POCSO jurisdiction
  iccRequired: boolean;          // employer ≥ 10 employees → must have ICC (POSH §4)
  childMarriageFlag: boolean;    // girl < 18 or boy < 21 → Prohibition of Child Marriage Act
  emergencyEscalation: boolean;  // immediate danger → bypass normal flow
  pocsoApplicable: boolean;      // POCSO framework applies
  poshApplicable: boolean;       // POSH Act applies
  witnessProtectionApplicable: boolean;
  mandatoryReportingRequired: boolean; // POCSO §19 — anyone must report
  lccApplicable: boolean;        // Local Complaints Committee (employer < 10 workers)
  rulesSummary: string[];        // Human-readable rule outputs for LLM context
}

/**
 * Apply deterministic legal rules from intake state.
 * All thresholds sourced directly from Indian statute text.
 */
export function applyLegalRules(intake: Partial<IntakeState>): RuleOutput {
  const age = intake.age ?? null;
  const employeeCount = intake.employeeCount ?? null;
  const isMinor = age !== null ? age < 18 : (intake.childInvolved === true);
  const isWorkplace = intake.workplace === true;
  const isLargeEmployer = employeeCount !== null && employeeCount >= 10; // POSH §4 threshold
  const isSmallEmployer = isWorkplace && employeeCount !== null && employeeCount < 10;
  const isWitness = intake.relationshipToVictim === "witness";
  const isDanger = intake.immediateDanger === true;

  // Child Marriage Act: girl < 18, boy < 21 (Prohibition of Child Marriage Act, 2006)
  const childMarriageFlag =
    age !== null &&
    ((intake.gender === "female" && age < 18) ||
      (intake.gender === "male" && age < 21) ||
      (intake.gender === null && age < 18));

  const rulesSummary: string[] = [];

  if (isMinor) {
    rulesSummary.push("RULE: Person is a MINOR (under 18). POCSO Act 2012 applies. Consent is legally irrelevant. Mandatory reporting (POCSO §19) is triggered.");
  }
  if (isWorkplace && isLargeEmployer) {
    rulesSummary.push(`RULE: Workplace with ${employeeCount}+ employees. Employer is legally required to have an Internal Complaints Committee (POSH Act §4). ICC must be presided by a senior woman employee.`);
  }
  if (isWorkplace && isSmallEmployer) {
    rulesSummary.push(`RULE: Workplace with fewer than 10 employees. ICC is not mandatory. Complaint goes to Local Complaints Committee (LCC) at District level (POSH Act §6).`);
  }
  if (childMarriageFlag) {
    rulesSummary.push("RULE: Person's age falls below the legal marriage threshold (18 for girls, 21 for boys). Prohibition of Child Marriage Act 2006 applies.");
  }
  if (isDanger) {
    rulesSummary.push("RULE: IMMEDIATE DANGER DETECTED. Emergency escalation required. Normal intake flow suspended. Emergency contacts must be shown first.");
  }
  if (isWitness) {
    rulesSummary.push("RULE: Person is a witness. POCSO §19 mandatory reporting duty applies. Witness Protection Scheme 2018 available.");
  }
  if (isMinor && !isDanger) {
    rulesSummary.push("RULE: Child's statement must be recorded at home by a woman officer in plain clothes (POCSO §24). Child cannot be detained overnight at police station.");
  }

  return {
    minorInvolved: isMinor,
    iccRequired: isWorkplace && isLargeEmployer,
    childMarriageFlag,
    emergencyEscalation: isDanger,
    pocsoApplicable: isMinor,
    poshApplicable: isWorkplace,
    witnessProtectionApplicable: isWitness,
    mandatoryReportingRequired: isMinor || isWitness,
    lccApplicable: isSmallEmployer,
    rulesSummary,
  };
}

/**
 * Extract intake facts from free-form conversation text.
 * Simple regex patterns — no LLM involved.
 * Returns only the fields that could be determined; others remain undefined.
 */
export function extractIntakeFromConversation(text: string): Partial<IntakeState> {
  const intake: Partial<IntakeState> = {};

  // Age: "9 years old", "9-year-old", "aged 9", "9 साल"
  const ageMatch = text.match(/\b(\d{1,2})\s*[-\s]?years?\s*old\b/i)
    || text.match(/\b(\d{1,2})\s*[-\s]?(?:year|yr|y\.?o\.?)/i)
    || text.match(/\baged?\s+(\d{1,2})\b/i)
    || text.match(/\b(\d{1,2})\s*साल\b/)
    || text.match(/\b(\d{1,2})\s*वर्ष\b/);
  if (ageMatch) {
    const parsed = parseInt(ageMatch[1]);
    if (parsed >= 1 && parsed <= 100) intake.age = parsed;
  }

  // Child involved (keyword presence)
  if (/\b(child|minor|kid|boy|girl|son|daughter|nephew|niece|student|बच्च|बच्ची|लड़क)\b/i.test(text)) {
    intake.childInvolved = true;
  }

  // Workplace context
  if (/\b(office|workplace|work|job|colleague|boss|manager|company|employer|organization|firm|कार्यस्थल|ऑफिस|नौकरी)\b/i.test(text)) {
    intake.workplace = true;
  }

  // Employee count: "50 employees", "company of 200"
  const empMatch = text.match(/\b(\d+)\s*(?:employee|staff|worker|people\s+work)/i)
    || text.match(/company\s+of\s+(\d+)/i);
  if (empMatch) {
    intake.employeeCount = parseInt(empMatch[1]);
  }

  // Immediate danger signals
  if (/\b(right now|happening now|immediate|currently|abusing me now|he is here|they are here|खतरा|अभी हो रहा|मदद)\b/i.test(text)) {
    intake.immediateDanger = true;
  }

  // Previously reported
  if (/\b(already reported|filed|complaint|fir|पहले|शिकायत की)\b/i.test(text)) {
    intake.reportedBefore = true;
  }

  // Relationship to victim
  if (/\b(i am the victim|myself|my own|मैं पीड़ित)\b/i.test(text)) {
    intake.relationshipToVictim = "self";
  } else if (/\b(my (son|daughter|child|niece|nephew|kid)|my child|मेरा बच्चा|मेरी बच्ची)\b/i.test(text)) {
    intake.relationshipToVictim = "parent";
  } else if (/\b(witness|saw|seen|i saw|noticed|देखा|गवाह)\b/i.test(text)) {
    intake.relationshipToVictim = "witness";
  } else if (/\b(colleague|coworker|co-worker|सहकर्मी)\b/i.test(text)) {
    intake.relationshipToVictim = "colleague";
  }

  // Gender hints
  if (/\b(she|her|girl|woman|daughter|महिला|लड़की)\b/i.test(text)) {
    intake.gender = "female";
  } else if (/\b(he|his|boy|man|son|पुरुष|लड़का)\b/i.test(text)) {
    intake.gender = "male";
  }

  return intake;
}
