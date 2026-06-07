// ─────────────────────────────────────────────────────────────────────────────
// domainGuardrail.ts
//
// Lightweight keyword-based domain classifier.
// Runs BEFORE the LLM. Pure rule-based — zero latency overhead, no API call.
//
// Design principle: "allow on doubt."
// It is far worse to refuse someone in genuine distress than to allow a
// borderline query through. The guardrail only blocks messages where out-of-scope
// signals are strong AND in-scope signals are absent.
// ─────────────────────────────────────────────────────────────────────────────

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;         // which out-of-scope topic was detected
  redirectMessage: string; // polite redirect to show the user
}

// ── IN-SCOPE SIGNALS ─────────────────────────────────────────────────────────
// Strong: presence of ANY of these immediately allows the message through,
// even if out-of-scope keywords are also present.
const STRONG_IN_SCOPE: string[] = [
  // Legal acts and categories
  "pocso", "posh", "icc", "fir", "child marriage", "bal vivah",
  "बाल विवाह", "pocso", "posh",
  // Abuse / harm vocabulary
  "abuse", "abused", "abusing", "assault", "assaulted", "harass", "harassment",
  "inappropriate", "touched", "molest", "rape", "grooming", "exploitation",
  "शोषण", "उत्पीड़न", "दुर्व्यवहार",
  // Legal process vocabulary
  "complaint", "report", "rights", "legal aid", "lawyer", "advocate",
  "magistrate", "court", "fir", "police station", "sjpu", "cwc", "nalsa",
  "internal complaints", "witness", "victim", "survivor", "legal help",
  "section 19", "section 4", "article 39",
  // People in context
  "my daughter", "my son", "my child", "my niece", "my nephew",
  "मेरी बेटी", "मेरा बेटा", "मेरा बच्चा",
  // Situation vocabulary
  "scared", "afraid", "fear", "unsafe", "danger", "threat", "hurting",
  "helpline", "childline", "1098", "nalsa", "iccall", "she-box", "shebox",
  // Reporting / process
  "how to report", "where to report", "what to do", "next steps",
  "what are my rights", "can i file", "should i report",
];

// Weak in-scope: these alone aren't decisive but contribute to the score.
const WEAK_IN_SCOPE: string[] = [
  "child", "minor", "teacher", "school", "office", "workplace", "employee",
  "employer", "boss", "manager", "colleague", "company",
  "police", "report", "safe", "help", "support", "protect", "protection",
  "बच्चा", "बच्ची", "स्कूल", "ऑफिस", "सहायता", "सुरक्षा",
];

// ── OUT-OF-SCOPE SIGNALS ──────────────────────────────────────────────────────
// Each entry: [pattern, label for redirect message]
// Patterns are whole-word matched (surrounded by non-alpha) to reduce false positives.
const OUT_OF_SCOPE_PATTERNS: [RegExp, string][] = [
  // Food & Cooking
  [/\b(recipe|recipes|aloo paratha|biryani|dosa|roti|sabzi|khana|khane|cooking|bake|baking|chef|ingredient|ingredients|cuisine|restaurant|meal|breakfast|lunch|dinner|snack|dessert)\b/i, "cooking or food"],
  // Sports
  [/\b(cricket|ipl|world cup match|football|soccer|tennis|badminton|kabaddi|hockey match|icc trophy|score|scorecard|wicket|batsman|bowler|goalkeeper|fifa|formula one|f1 race|olympics|athlete|stadium|sports news)\b/i, "sports"],
  // Entertainment
  [/\b(movie|movies|film|films|series|web series|netflix|amazon prime|hotstar|bollywood|hollywood|actor|actress|celebrity|celebrities|singer|album|song lyrics|concert|box office|ott)\b/i, "movies or entertainment"],
  // Travel
  [/\b(travel|flight|airline|airport|hotel|resort|tourism|tourist|visa|passport|destination|vacation|holiday trip|booking\.com|makemytrip|irctc train booking)\b/i, "travel"],
  // Coding / Tech (narrow — only specific programming terms unlikely in legal context)
  [/\b(python script|javascript code|html css|react component|node\.?js|sql query|api endpoint|bug fix|github|stack overflow|machine learning model|neural network|algorithm)\b/i, "software development"],
  // Shopping & Fashion
  [/\b(amazon product|flipkart|online shopping|buy online|fashion trend|clothes shopping|discount deal|coupon code|myntra|meesho)\b/i, "shopping or fashion"],
  // Finance (narrow — crypto/stocks, not legal aid)
  [/\b(bitcoin|cryptocurrency|crypto trading|nifty|sensex|stock market|buy stocks|sell stocks|mutual fund returns|trading strategy|forex|zerodha|groww|upstox|demat account)\b/i, "finance or cryptocurrency"],
  // Gaming
  [/\b(pubg|bgmi|free fire|fortnite|minecraft|video game|gaming|esports|playstation|xbox|nintendo)\b/i, "gaming"],
  // Mathematics (narrow — avoids false positives on "section 4" type legal references)
  [/\b(calculus|trigonometry|quadratic equation|algebra problem|geometry proof|probability statistics homework)\b/i, "mathematics"],
  // Celebrity / Gossip
  [/\b(who won the oscar|grammy|emmy award|celebrity gossip|who is dating|celebrity marriage|box office collection|film review)\b/i, "celebrity news"],
  // Weather
  [/\b(weather forecast|temperature today|will it rain|monsoon forecast|humidity|climate prediction)\b/i, "weather"],
];

// ── REDIRECT MESSAGES ─────────────────────────────────────────────────────────
// Warm but clear. Mentions what Sahara CAN help with.
function buildRedirectMessage(topic: string, language: string): string {
  if (language === "hi") {
    return `मैं सहारा हूँ — एक विशेष कानूनी सहायता सेवा जो बच्चों की सुरक्षा, कार्यस्थल उत्पीड़न, कानूनी अधिकार, शिकायत प्रक्रिया और न्याय तक पहुंच पर केंद्रित है।\n\n${topic} के बारे में मैं मदद नहीं कर सकती, लेकिन अगर आपको POCSO, POSH, बाल विवाह, FIR दर्ज करना, या किसी कानूनी मामले में सहायता चाहिए तो मैं यहाँ हूँ। क्या मैं उस विषय पर आपकी मदद कर सकती हूँ?`;
  }
  return `I'm Sahara — a specialist legal support assistant focused on child protection, workplace harassment, legal rights, reporting processes, and access to justice.\n\nI'm not able to assist with ${topic}, but I'm here if you need help with a POCSO or POSH matter, understanding your legal rights, filing an FIR, or finding support resources. Is there something along those lines I can help you with?`;
}

// ── MAIN GUARDRAIL FUNCTION ───────────────────────────────────────────────────
export function checkDomain(
  message: string,
  language = "en"
): GuardrailResult {
  const text = message.toLowerCase();

  // 1. Strong in-scope signal → always allow, immediately.
  //    Someone in distress must never be blocked by a false-positive match.
  const hasStrongInScope = STRONG_IN_SCOPE.some((kw) =>
    text.includes(kw.toLowerCase())
  );
  if (hasStrongInScope) {
    return { allowed: true, redirectMessage: "" };
  }

  // 2. Check for out-of-scope patterns.
  const matchedTopic = OUT_OF_SCOPE_PATTERNS.find(([pattern]) =>
    pattern.test(text)
  );
  if (!matchedTopic) {
    // No out-of-scope signal detected → allow.
    return { allowed: true, redirectMessage: "" };
  }

  // 3. Out-of-scope pattern matched. Now check weak in-scope signals.
  //    If even one weak in-scope signal is present, allow through (doubt → allow).
  const hasWeakInScope = WEAK_IN_SCOPE.some((kw) =>
    text.includes(kw.toLowerCase())
  );
  if (hasWeakInScope) {
    return { allowed: true, redirectMessage: "" };
  }

  // 4. Out-of-scope matched, no in-scope signals at all → redirect.
  const [, topic] = matchedTopic;
  return {
    allowed: false,
    reason: topic,
    redirectMessage: buildRedirectMessage(topic, language),
  };
}
