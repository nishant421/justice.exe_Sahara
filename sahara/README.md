# Sahara सहारा
### हर आवाज़ को न्याय मिले — Every voice deserves justice.

**AI-powered trauma-informed legal first responder for POCSO and POSH survivors in India.**

---

## 🚀 Quick Start (3 steps)

### 1. Get a Gemini API Key (FREE)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API Key" → "Create API key"
3. Copy the key

### 2. Set Environment Variable
Edit `.env.local` in this folder:
```
GEMINI_API_KEY=your_key_here
```

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Demo Scenarios (for judges)

Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) and click:
- **👨‍👧 Child Abuse (POCSO)** — Parent reporting child abuse, POCSO guidance
- **👩‍💼 Workplace Harassment (POSH)** — Employee filing POSH complaint
- **👁️ I Witnessed Something** — Witness reporting guidance

---

## 📋 Features

| Feature | Status |
|---------|--------|
| Voice Input (Web Speech API) | ✅ |
| Voice Output (Speech Synthesis) | ✅ |
| Text Chat Fallback | ✅ |
| Hindi + English | ✅ |
| Legal RAG (POCSO + POSH) | ✅ |
| Emergency Detection | ✅ |
| Action Plan Generator | ✅ |
| Download Action Plan | ✅ |
| Analytics Dashboard | ✅ |
| Landing Page | ✅ |

---

## Architecture

```
User speaks/types
    ↓
Web Speech API (STT)
    ↓
Next.js API Route (/api/chat)
    ↓
Emergency Detection → Show contacts if needed
    ↓
Legal RAG (keyword search over POCSO/POSH docs)
    ↓
Gemini 2.0 Flash (empathy-first system prompt)
    ↓
Response with cited legal sections
    ↓
Browser Speech Synthesis (TTS)
```

---

## Legal Knowledge Base

### POCSO Sections Covered
3, 4, 5, 7, 8, 19, 21, 24, 25, 26, 28, 40

### POSH Sections Covered
2(n), 4, 9, 10, 11, 12, 26

### Additional
- Article 39A (Free Legal Aid)
- NALSA, Childline 1098, SHe-Box, iCALL, One Stop Centre

---

## Safety Principles

1. **Empathy First** — Every response validates feelings before information
2. **No Blame** — Never questions why someone didn't report sooner
3. **No Legal Advice** — Provides information and guidance, not legal counsel
4. **Emergency Override** — Detects crisis situations and shows emergency contacts
5. **Confidential** — No data stored, no conversation logging
6. **Identity Protection** — Never asks for identifying information

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel --prod
# Set GEMINI_API_KEY in Vercel dashboard
```

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

*Sahara provides information and support only — not legal advice.*
