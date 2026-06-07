import { NextRequest, NextResponse } from "next/server";
import { chat, ConversationMessage } from "@/lib/gemini";
import { searchLegalDocs } from "@/lib/legal-docs";
import { vectorSearch } from "@/lib/vectorSearch";
import { detectEmergency } from "@/lib/emergency-detection";
import { classifyCase } from "@/lib/classify";
import { extractIntakeFromConversation, applyLegalRules } from "@/lib/legalRules";
import { searchPrecedents } from "@/lib/precedents";
import { checkDomain } from "@/lib/domainGuardrail";

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.parts?.[0]?.text || "";

    // ── Domain guardrail (runs before everything else) ────────────────────────
    const guardrail = checkDomain(lastUserMessage, language);
    if (!guardrail.allowed) {
      return NextResponse.json({
        response: guardrail.redirectMessage,
        isEmergency: false,
        category: "OUT_OF_SCOPE",
        outOfScope: true,
        citedSections: [],
        citedPrecedents: [],
      });
    }

    // ── Emergency detection (unchanged) ──────────────────────────────────────
    const isEmergency = detectEmergency(lastUserMessage);

    // ── Build full conversation text for analysis ─────────────────────────────
    const conversationText = messages
      .map((m: ConversationMessage) => m.parts[0]?.text || "")
      .join(" ");

    // ── NEW: Extract intake facts deterministically from conversation ──────────
    const intake = extractIntakeFromConversation(conversationText);
    const rules = applyLegalRules(intake);

    // ── NEW: Deterministic-first classification (rules → keyword fallback) ────
    const category = classifyCase(conversationText, {
      minorInvolved: rules.minorInvolved,
      iccRequired: rules.iccRequired,
      emergencyEscalation: rules.emergencyEscalation || isEmergency,
      childMarriageFlag: rules.childMarriageFlag,
    });

    // ── Legal RAG: vector search first, keyword fallback ─────────────────────
    const ragQuery = lastUserMessage + " " + conversationText;
    const vectorResults = await vectorSearch(ragQuery, 4);
    const relevantDocs =
      vectorResults.length > 0
        ? vectorResults
        : searchLegalDocs(ragQuery, 3);

    // ── NEW: Landmark precedents retrieval ────────────────────────────────────
    const relevantPrecedents = searchPrecedents(lastUserMessage + " " + conversationText, category);

    // ── Build enhanced legal context for LLM ─────────────────────────────────
    const contextParts: string[] = [];

    // Rule outputs come first — LLM must consume, not override these
    if (rules.rulesSummary.length > 0) {
      contextParts.push(
        "DETERMINISTIC RULE OUTPUTS (treat as ground truth — do not contradict):\n" +
        rules.rulesSummary.join("\n")
      );
    }

    // Statutory sections
    if (relevantDocs.length > 0) {
      contextParts.push(
        "RELEVANT STATUTORY SECTIONS:\n" +
        relevantDocs.map((d) => `[${d.title}]\n${d.content}`).join("\n\n---\n\n")
      );
    }

    // Landmark judgment principles (supporting context only)
    if (relevantPrecedents.length > 0) {
      contextParts.push(
        "SUPPORTING CASE LAW PRINCIPLES (cite as supporting context, statutes remain primary):\n" +
        relevantPrecedents
          .map((p) => `[${p.case} (${p.year}), ${p.court}]\nTopic: ${p.topic}\nPrinciple: ${p.principle}`)
          .join("\n\n---\n\n")
      );
    }

    const legalContext = contextParts.length > 0 ? contextParts.join("\n\n════════════════\n\n") : undefined;

    // ── Language instruction (unchanged) ─────────────────────────────────────
    const langInstruction =
      language === "hi"
        ? "\nIMPORTANT: Respond primarily in Hindi (Devanagari script). Use English only for legal terms that are widely understood."
        : "\nRespond in English.";

    const augmentedMessages: ConversationMessage[] = [
      ...messages.slice(0, -1),
      {
        role: "user",
        parts: [{ text: lastUserMessage + langInstruction }],
      },
    ];

    // ── LLM call (unchanged interface) ───────────────────────────────────────
    const response = await chat(augmentedMessages, legalContext);

    return NextResponse.json({
      response,
      isEmergency: isEmergency || rules.emergencyEscalation,
      category,
      // NEW: expose intake + rule outputs to client for debugging/display
      intake,
      rules: {
        minorInvolved: rules.minorInvolved,
        iccRequired: rules.iccRequired,
        emergencyEscalation: rules.emergencyEscalation,
        mandatoryReportingRequired: rules.mandatoryReportingRequired,
      },
      citedSections: relevantDocs.map((d) => ({
        title: d.title,
        section: d.section,
        category: d.category,
      })),
      // NEW: cited precedents in response
      citedPrecedents: relevantPrecedents.map((p) => ({
        case: p.case,
        year: p.year,
        topic: p.topic,
      })),
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
