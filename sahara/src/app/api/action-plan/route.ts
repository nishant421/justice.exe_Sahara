import { NextRequest, NextResponse } from "next/server";
import { buildActionPlan } from "@/lib/action-plan";
import { classifyCase } from "@/lib/classify";
import { anthropicClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const conversationText = (messages || [])
      .map((m: { role: string; parts: { text: string }[] }) => `${m.role}: ${m.parts[0]?.text || ""}`)
      .join("\n");

    const category = classifyCase(conversationText);

    let situationSummary = "A person reached out to Sahara seeking guidance and support.";
    try {
      const response = await anthropicClient.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `Based on this conversation, write a 2-3 sentence neutral, empathetic summary of the situation WITHOUT identifying information. Focus on the type of concern raised.\n\nConversation:\n${conversationText.slice(0, 2000)}\n\nSummary:`,
          },
        ],
      });
      const block = response.content[0];
      if (block.type === "text") situationSummary = block.text.trim();
    } catch {
      // fallback to default
    }

    const plan = buildActionPlan(category, situationSummary);

    return NextResponse.json({ plan, category });
  } catch (error: unknown) {
    console.error("Action plan API error:", error);
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
