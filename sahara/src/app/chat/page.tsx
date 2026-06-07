"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mic, MicOff, Send, Volume2, VolumeX, Shield, Phone,
  AlertTriangle, FileText, ChevronLeft, Loader2, Globe, Download
} from "lucide-react";
import { EMERGENCY_CONTACTS } from "@/lib/emergency-detection";
import { ActionPlan } from "@/lib/action-plan";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
  isEmergency?: boolean;
  citedSections?: { title: string; section?: string; category: string }[];
  citedPrecedents?: { case: string; year: string; topic: string }[];
}

const DEMO_SCENARIOS: Record<string, string> = {
  pocso: "My daughter is 9 years old. Her school teacher has been behaving inappropriately with her and I'm very worried. She has been coming home scared and yesterday told me something that disturbed me deeply. What should I do? I don't know where to start.",
  posh: "I work at a company and my senior manager has been making inappropriate comments and touching me without my consent. I'm afraid to report because I might lose my job. What are my rights? Does our company need to have a committee?",
  witness: "I live next to a family and I've been hearing a child crying unusually often. Yesterday I saw some marks on the child's arms. I'm not sure what's happening but I'm worried. Am I supposed to report this? How do I report without getting involved unnecessarily?",
};

const GREETING_MESSAGES: Record<string, string> = {
  en: "Namaste. I'm Sahara — your safe space to understand your rights and find support.\n\nI'm here to listen without judgment. Whatever you're going through, you don't have to face it alone.\n\nYou can speak or type in Hindi or English. How can I support you today?",
  hi: "नमस्ते। मैं सहारा हूँ — आपका भरोसेमंद साथी जो आपके अधिकारों को समझने में और सहायता पाने में मदद करता है।\n\nमैं यहाँ हूँ बिना किसी निर्णय के सुनने के लिए। आप जो भी महसूस कर रहे हैं, आपको अकेले नहीं सामना करना है।\n\nआप हिंदी या अंग्रेज़ी में बोल या लिख सकते हैं। आज मैं आपकी कैसे मदद कर सकती हूँ?",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get("scenario");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [showEmergency, setShowEmergency] = useState(false);
  const [category, setCategory] = useState<string>("UNKNOWN");
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSupported("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    // Add greeting
    const greeting: Message = {
      id: "greeting",
      role: "assistant",
      text: GREETING_MESSAGES[language],
      timestamp: new Date(),
    };
    setMessages([greeting]);

    // Auto-populate scenario
    if (scenario && DEMO_SCENARIOS[scenario]) {
      setTimeout(() => {
        setInputText(DEMO_SCENARIOS[scenario]);
      }, 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || !synthRef.current) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1.05;

      const voices = synthRef.current.getVoices();
      const preferred = voices.find(
        (v) => v.lang === (language === "hi" ? "hi-IN" : "en-IN") && v.name.toLowerCase().includes("female")
      ) || voices.find((v) => v.lang === (language === "hi" ? "hi-IN" : "en-IN"));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    },
    [voiceEnabled, language]
  );

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (!speechSupported) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text || inputText.trim();
      if (!msg || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text: msg,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setIsLoading(true);

      // Build conversation history for API
      const history = messages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));
      history.push({ role: "user", parts: [{ text: msg }] });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, language }),
        });
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: data.response,
          timestamp: new Date(),
          isEmergency: data.isEmergency,
          citedSections: data.citedSections,
          citedPrecedents: data.citedPrecedents,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setCategory(data.category || "UNKNOWN");

        if (data.isEmergency) setShowEmergency(true);
        if (voiceEnabled) speak(data.response);
      } catch (err) {
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "I'm sorry, there was a connection issue. Please try again. If this is an emergency, please call 112 immediately.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading, messages, language, voiceEnabled, speak]
  );

  const generateActionPlan = async () => {
    setIsGeneratingPlan(true);
    const history = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
    try {
      const res = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (data.plan) {
        setActionPlan(data.plan);
        setShowActionPlan(true);
      }
    } catch {
      alert("Could not generate action plan. Please try again.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const downloadPDF = () => {
    if (!actionPlan) return;
    // Build text content
    const lines = [
      "SAHARA सहारा — ACTION PLAN",
      "========================",
      "",
      `Category: ${actionPlan.category}`,
      "",
      "SITUATION SUMMARY",
      actionPlan.situationSummary,
      "",
      "YOUR RIGHTS",
      ...actionPlan.relevantRights.map((r, i) => `${i + 1}. ${r}`),
      "",
      "RELEVANT LEGAL SECTIONS",
      ...actionPlan.legalSections.map((s) => `• ${s.section}: ${s.summary}`),
      "",
      "IMMEDIATE NEXT STEPS",
      ...actionPlan.immediateNextSteps.map((s, i) => `${i + 1}. ${s}`),
      "",
      "IMPORTANT CONTACTS",
      ...actionPlan.importantContacts.map((c) => `• ${c.name}: ${c.number} — ${c.note}`),
      "",
      "SUPPORT RESOURCES",
      ...actionPlan.supportResources.map((r) => `• ${r.name} (${r.contact}): ${r.description}`),
      "",
      "SAFETY RECOMMENDATIONS",
      ...actionPlan.safetyRecommendations.map((r, i) => `${i + 1}. ${r}`),
      "",
      "---",
      "Generated by Sahara सहारा — हर आवाज़ को न्याय मिले",
      "Sahara provides information and support only, not legal advice.",
    ];
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sahara-action-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryBadge: Record<string, { label: string; color: string; bg: string }> = {
    POCSO: { label: "POCSO Case", color: "#dc2626", bg: "#fef2f2" },
    POSH: { label: "POSH Case", color: "#2563eb", bg: "#eff6ff" },
    CHILD_MARRIAGE: { label: "Child Marriage", color: "#b45309", bg: "#fffbeb" },
    WITNESS: { label: "Witness", color: "#7c3aed", bg: "#faf5ff" },
    EMERGENCY: { label: "Emergency", color: "#dc2626", bg: "#fef2f2" },
    GENERAL: { label: "General", color: "#0f766e", bg: "#f0fdfa" },
    UNKNOWN: { label: "Listening...", color: "#64748b", bg: "#f8fafc" },
  };

  const badge = categoryBadge[category] || categoryBadge.UNKNOWN;

  return (
    <div className="flex flex-col h-screen" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">Sahara सहारा</div>
              <div className="text-xs text-gray-500">Confidential · Safe · Free</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Category badge */}
          {category !== "UNKNOWN" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: badge.color, background: badge.bg }}>
              {badge.label}
            </span>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#e2e8f0", color: "#1e3a5f" }}
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          {/* Voice toggle */}
          <button
            onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
            className="p-2 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#e2e8f0", color: voiceEnabled ? "#0f766e" : "#94a3b8" }}
            title={voiceEnabled ? "Mute voice" : "Enable voice"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Emergency button */}
          <button
            onClick={() => setShowEmergency(!showEmergency)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" }}
          >
            <Phone className="w-3.5 h-3.5" />
            Emergency
          </button>
        </div>
      </header>

      {/* Emergency Panel */}
      {showEmergency && (
        <div className="fade-in mx-4 mt-3 p-4 rounded-2xl" style={{ background: "#fef2f2", border: "1.5px solid #fca5a5" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-bold text-red-700">Emergency Contacts — Help is Available Now</span>
            <button onClick={() => setShowEmergency(false)} className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none">×</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {EMERGENCY_CONTACTS.map((c) => (
              <div key={c.number} className="p-3 bg-white rounded-xl text-center" style={{ border: "1px solid #fecaca" }}>
                <div className="text-xl mb-1">{c.icon}</div>
                <div className="font-black text-lg" style={{ color: "#dc2626" }}>{c.number}</div>
                <div className="text-xs text-gray-600">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex fade-in ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)" }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${message.role === "user" ? "order-1" : "order-2"}`}>
              <div
                className="px-4 py-3 rounded-2xl leading-relaxed text-sm whitespace-pre-wrap"
                style={
                  message.role === "user"
                    ? { background: "linear-gradient(135deg, #1e3a5f, #0f766e)", color: "white", borderBottomRightRadius: "4px" }
                    : { background: "white", color: "#1e293b", border: "1px solid #e2e8f0", borderBottomLeftRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                }
              >
                {message.text}
              </div>
              {message.citedSections && message.citedSections.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {message.citedSections.map((s) => (
                    <span key={s.title} className="px-2 py-1 rounded-lg text-xs font-medium" style={{ background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4" }}>
                      ⚖️ {s.section || s.title}
                    </span>
                  ))}
                </div>
              )}
              {message.citedPrecedents && message.citedPrecedents.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {message.citedPrecedents.map((p) => (
                    <span key={p.case} className="px-2 py-1 rounded-lg text-xs font-medium" title={p.topic} style={{ background: "#faf5ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                      🏛️ {p.case} ({p.year})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start fade-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0" style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border" style={{ border: "1px solid #e2e8f0" }}>
              <div className="typing-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Demo Scenarios */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2 text-center">Try a demo scenario:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { key: "pocso", label: "👨‍👧 Child Abuse (POCSO)" },
              { key: "posh", label: "👩‍💼 Workplace Harassment (POSH)" },
              { key: "witness", label: "👁️ I Witnessed Something" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => sendMessage(DEMO_SCENARIOS[key])}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                style={{ background: "#f0f7ff", color: "#1e3a5f", border: "1px solid #bfdbfe" }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan Button */}
      {messages.length > 3 && (
        <div className="px-4 pb-2 flex justify-center">
          <button
            onClick={generateActionPlan}
            disabled={isGeneratingPlan}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)", color: "white" }}
          >
            {isGeneratingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate My Action Plan
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 bg-white border-t">
        <div className="flex items-center gap-2 p-2 rounded-2xl" style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
          {speechSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2.5 rounded-xl flex-shrink-0 transition-all ${isListening ? "voice-active" : ""}`}
              style={{
                background: isListening ? "#0f766e" : "#f0fdfa",
                color: isListening ? "white" : "#0f766e",
                border: `1.5px solid ${isListening ? "#0f766e" : "#99f6e4"}`,
              }}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={language === "hi" ? "अपनी बात यहाँ लिखें..." : "Type or speak your message..."}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 px-2"
          />
          {isSpeaking && (
            <button onClick={stopSpeaking} className="p-2 rounded-xl" style={{ background: "#fef2f2", color: "#dc2626" }}>
              <VolumeX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl flex-shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)", color: "white" }}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Confidential · Not legal advice · Call 112 if in immediate danger
        </p>
      </div>

      {/* Action Plan Modal */}
      {showActionPlan && actionPlan && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[85vh] flex flex-col fade-in">
            <div className="flex items-center justify-between p-6 border-b" style={{ background: "linear-gradient(135deg, #1e3a5f, #0f766e)", borderRadius: "24px 24px 0 0" }}>
              <div>
                <h2 className="text-xl font-bold text-white">Your Action Plan</h2>
                <p className="text-teal-200 text-sm">Generated for: {actionPlan.category} case</p>
              </div>
              <div className="flex gap-2">
                <button onClick={downloadPDF} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button onClick={() => setShowActionPlan(false)} className="text-white hover:text-teal-200 text-2xl leading-none">×</button>
              </div>
            </div>
            <div className="overflow-y-auto p-6 space-y-5">
              {/* Situation */}
              <Section title="📋 Situation Summary">
                <p className="text-gray-700 text-sm leading-relaxed">{actionPlan.situationSummary}</p>
              </Section>

              {/* Rights */}
              <Section title="⚖️ Your Rights">
                <ul className="space-y-2">
                  {actionPlan.relevantRights.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-teal-500 font-bold mt-0.5">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Legal sections */}
              <Section title="📚 Relevant Legal Sections">
                <div className="space-y-2">
                  {actionPlan.legalSections.map((s) => (
                    <div key={s.section} className="p-3 rounded-xl" style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}>
                      <div className="font-bold text-sm" style={{ color: "#0f766e" }}>{s.section}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{s.summary}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Next steps */}
              <Section title="🚀 Immediate Next Steps">
                <ol className="space-y-2">
                  {actionPlan.immediateNextSteps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: "#1e3a5f", color: "white" }}>{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              {/* Contacts */}
              <Section title="📞 Important Contacts">
                <div className="grid grid-cols-2 gap-2">
                  {actionPlan.importantContacts.map((c) => (
                    <div key={c.number} className="p-3 rounded-xl bg-white" style={{ border: "1px solid #e2e8f0" }}>
                      <div className="font-black text-lg" style={{ color: "#1e3a5f" }}>{c.number}</div>
                      <div className="text-xs font-semibold text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.note}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Safety */}
              <Section title="🛡️ Safety Reminders">
                <ul className="space-y-1">
                  {actionPlan.safetyRecommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-yellow-500">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>

              <p className="text-xs text-gray-400 text-center pt-2 border-t">
                Sahara provides information and support only — not legal advice. Generated by Sahara सहारा.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
