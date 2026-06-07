export type CaseCategory =
  | "POCSO"
  | "POSH"
  | "CHILD_MARRIAGE"
  | "WITNESS"
  | "EMERGENCY"
  | "GENERAL"
  | "UNKNOWN";

// Accepts optional rule outputs from legalRules.ts for deterministic-first classification
export function classifyCase(
  conversation: string,
  ruleHints?: { minorInvolved?: boolean; iccRequired?: boolean; emergencyEscalation?: boolean; childMarriageFlag?: boolean }
): CaseCategory {
  const text = conversation.toLowerCase();

  // 1. Deterministic rule outputs take priority when available
  if (ruleHints?.emergencyEscalation) return "EMERGENCY";
  if (ruleHints?.childMarriageFlag) return "CHILD_MARRIAGE";
  if (ruleHints?.minorInvolved) return "POCSO";
  if (ruleHints?.iccRequired) return "POSH";

  // 2. Keyword fallback (unchanged from original)
  // Emergency
  if (
    text.includes("suicide") ||
    text.includes("kill myself") ||
    text.includes("danger") ||
    text.includes("right now") ||
    text.includes("happening now")
  )
    return "EMERGENCY";

  // Child marriage
  if (
    text.includes("child marriage") ||
    text.includes("bal vivah") ||
    text.includes("बाल विवाह") ||
    text.includes("forced marriage") ||
    (text.includes("marriage") && (text.includes("minor") || text.includes("underage")))
  )
    return "CHILD_MARRIAGE";

  // POCSO
  if (
    text.includes("child") ||
    text.includes("minor") ||
    text.includes("school") ||
    text.includes("teacher") ||
    text.includes("pocso") ||
    text.includes("बच्चा") ||
    text.includes("बच्ची") ||
    text.includes("स्कूल") ||
    text.includes("below 18") ||
    text.includes("teenager") ||
    text.includes("son") ||
    text.includes("daughter") ||
    text.includes("nephew") ||
    text.includes("niece") ||
    (text.includes("abuse") && (text.includes("kid") || text.includes("young")))
  )
    return "POCSO";

  // POSH
  if (
    text.includes("workplace") ||
    text.includes("office") ||
    text.includes("colleague") ||
    text.includes("boss") ||
    text.includes("manager") ||
    text.includes("posh") ||
    text.includes("icc") ||
    text.includes("harassment at work") ||
    text.includes("sexual harassment") ||
    text.includes("कार्यस्थल") ||
    text.includes("ऑफिस") ||
    text.includes("सहकर्मी") ||
    text.includes("job") ||
    text.includes("employee") ||
    text.includes("employer")
  )
    return "POSH";

  // Witness
  if (
    text.includes("witness") ||
    text.includes("saw") ||
    text.includes("seen") ||
    text.includes("i saw") ||
    text.includes("i noticed") ||
    text.includes("i think someone") ||
    text.includes("गवाह") ||
    text.includes("देखा")
  )
    return "WITNESS";

  return "UNKNOWN";
}
