const EMERGENCY_KEYWORDS = [
  // Suicide / self-harm
  "suicide", "kill myself", "end my life", "want to die", "self harm", "cut myself",
  "खुदकुशी", "जीना नहीं", "मर जाऊं", "जान दे दूं",
  // Immediate danger
  "he is here", "they are here", "right now", "happening now", "abusing me now",
  "threatening me", "danger", "help me now", "emergency", "hurting me",
  "अभी हो रहा है", "खतरा", "मदद करो",
  // Active abuse
  "being abused", "being assaulted", "being harassed right now",
];

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

export const EMERGENCY_CONTACTS = [
  { name: "Emergency / Police", number: "112", icon: "🚨" },
  { name: "Childline", number: "1098", icon: "👶" },
  { name: "Women Helpline", number: "181", icon: "👩" },
  { name: "iCALL Counseling", number: "9152987821", icon: "💙" },
  { name: "NALSA Legal Aid", number: "15100", icon: "⚖️" },
];
