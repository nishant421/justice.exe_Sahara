# Sahara सहारा

> **हर आवाज़ को न्याय मिले — Every voice deserves justice.**

An AI-powered, trauma-informed legal first responder for POCSO and POSH survivors in India. Sahara helps survivors, parents, and witnesses understand their legal rights in a safe, empathetic, and judgment-free environment — in Hindi and English.

---

## What It Does

Sahara acts as a first point of contact for people dealing with child sexual abuse (POCSO) or workplace sexual harassment (POSH). It guides them through their legal options, generates a personalized action plan, and connects them with emergency resources — all without storing any personal data.

**Who it's for:**
- Survivors seeking to understand their rights
- Parents reporting abuse on behalf of a child
- Witnesses unsure of their legal obligations

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript |
| AI | Google Gemini 2.0 Flash |
| Styling | Tailwind CSS v4 + Radix UI |
| PDF Export | jsPDF |
| Speech | Web Speech API (STT + TTS) |

---

## Features

- **Voice + Text Input** — speak or type in Hindi or English
- **Legal RAG** — responses grounded in actual POCSO and POSH sections
- **Emergency Detection** — auto-surfaces helpline numbers in crisis situations
- **Action Plan Generator** — downloadable, step-by-step legal roadmap
- **Analytics Dashboard** — usage insights for organizations
- **Zero Data Storage** — no conversations are logged or retained

---

## Quick Start

### 1. Clone the repo
```bash
git clone git@github.com:nishant421/justice.exe_Sahara.git
cd justice.exe_Sahara
```

### 2. Get a Gemini API Key (free)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API key**
3. Copy the key

### 3. Set up environment
Create a `.env.local` file in the project root:
```
GEMINI_API_KEY=your_key_here
```

### 4. Install and run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Scenarios

Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) and try:

- **Child Abuse (POCSO)** — Parent reporting child abuse, step-by-step POCSO guidance
- **Workplace Harassment (POSH)** — Employee filing a POSH complaint
- **Witness** — Guidance for someone who witnessed an incident

---

## Architecture

```
User speaks / types
       ↓
Web Speech API (Speech-to-Text)
       ↓
Next.js API Route (/api/chat)
       ↓
Emergency Detection → surfaces helpline numbers if needed
       ↓
Legal RAG (keyword + vector search over POCSO / POSH docs)
       ↓
Gemini 2.0 Flash (empathy-first system prompt)
       ↓
Response with cited legal sections
       ↓
Browser Speech Synthesis (Text-to-Speech)
```

---

## Legal Knowledge Base

### POCSO (Protection of Children from Sexual Offences Act)
Sections 3, 4, 5, 7, 8, 19, 21, 24, 25, 26, 28, 40

### POSH (Prevention of Sexual Harassment at Workplace Act)
Sections 2(n), 4, 9, 10, 11, 12, 26

### Additional Resources
- Article 39A — Free Legal Aid
- NALSA, Childline 1098, SHe-Box, iCALL, One Stop Centre

---

## Safety Principles

1. **Empathy first** — every response validates feelings before delivering information
2. **No blame** — never questions why someone didn't report sooner
3. **Information, not advice** — provides legal information and guidance, not legal counsel
4. **Emergency override** — detects crisis language and immediately shows emergency contacts
5. **No data retention** — no conversations are stored or logged
6. **Identity protection** — never asks for identifying information

---

## Emergency Contacts

| Service | Number |
|---------|--------|
| Police / Emergency | 112 |
| Childline | 1098 |
| Women Helpline | 181 |
| iCALL Counseling | 9152987821 |
| NALSA Legal Aid | 15100 |

---

## Deployment

Deploy to Vercel in one command:
```bash
npm i -g vercel
vercel --prod
```

Add `GEMINI_API_KEY` as an environment variable in your Vercel project dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Main chat endpoint (RAG + Gemini)
│   │   └── action-plan/   # Action plan generation endpoint
│   ├── chat/              # Chat UI page
│   ├── dashboard/         # Analytics dashboard
│   └── page.tsx           # Landing page
└── lib/
    ├── gemini.ts           # Gemini API client
    ├── legal-docs.ts       # POCSO + POSH document store
    ├── vectorSearch.ts     # Semantic search over legal docs
    ├── emergency-detection.ts
    ├── action-plan.ts
    ├── classify.ts
    ├── legalRules.ts
    └── domainGuardrail.ts
```

---

*Sahara provides information and support only — not legal advice. In an emergency, call 112.*
