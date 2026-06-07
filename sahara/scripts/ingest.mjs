/**
 * Sahara Knowledge Base Ingestion Script
 * ─────────────────────────────────────────────────────────
 * Reads markdown files from knowledge_base/
 * Chunks by ## headings
 * Generates Gemini text-embedding-004 embeddings
 * Writes src/lib/vector-store.json
 *
 * Usage:
 *   npm run ingest
 *
 * To add new documents:
 *   1. Place a .md or .txt file in knowledge_base/
 *   2. Run: npm run ingest
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Load .env.local ───────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
  console.error("\n❌ ERROR: GEMINI_API_KEY is not set in .env.local");
  console.error("   Get a free key at: https://aistudio.google.com");
  console.error("   Then add to .env.local: GEMINI_API_KEY=your_key_here\n");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// ── Category mapping from filename ────────────────────────────────────────────
function inferCategory(filename) {
  const name = basename(filename, extname(filename)).toLowerCase();
  if (name.includes("pocso")) return "POCSO";
  if (name.includes("posh")) return "POSH";
  if (name.includes("child_marriage")) return "CHILD_MARRIAGE";
  if (name.includes("legal_aid")) return "RIGHTS";
  if (name.includes("childline") || name.includes("support")) return "GENERAL";
  if (name.includes("judgment")) return "GENERAL";
  return "GENERAL";
}

// ── Parse markdown into chunks by ## headings ─────────────────────────────────
function parseChunks(content, source) {
  const category = inferCategory(source);
  const lines = content.split("\n");
  const chunks = [];

  let currentHeading = "";
  let currentLines = [];
  let fileTitle = "";

  for (const line of lines) {
    if (line.startsWith("# ")) {
      fileTitle = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ")) {
      // Save previous chunk
      if (currentHeading && currentLines.join("").trim().length > 20) {
        chunks.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = line.slice(3).trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  // Don't forget the last chunk
  if (currentHeading && currentLines.join("").trim().length > 20) {
    chunks.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return chunks.map((chunk, idx) => ({
    id: `${basename(source, extname(source))}-${idx}`,
    source: basename(source),
    fileTitle,
    heading: chunk.heading,
    // Combine heading + content for embedding — more context = better retrieval
    textForEmbedding: `${chunk.heading}\n\n${chunk.content}`,
    content: chunk.content,
    category,
  }));
}

// ── Generate embedding with retry ─────────────────────────────────────────────
async function embedWithRetry(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`   ⚠ Retry ${i + 1}/${retries}...`);
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
}

// ── Main ingestion ────────────────────────────────────────────────────────────
async function main() {
  const KB_DIR = join(ROOT, "knowledge_base");
  const OUT_PATH = join(ROOT, "src", "lib", "vector-store.json");

  if (!existsSync(KB_DIR)) {
    console.error(`\n❌ knowledge_base/ folder not found at: ${KB_DIR}\n`);
    process.exit(1);
  }

  const files = readdirSync(KB_DIR).filter(
    (f) => f.endsWith(".md") || f.endsWith(".txt")
  );

  if (files.length === 0) {
    console.error("\n❌ No .md or .txt files found in knowledge_base/\n");
    process.exit(1);
  }

  console.log(`\n📚 Sahara Knowledge Base Ingestion`);
  console.log(`   Model: text-embedding-004`);
  console.log(`   Found ${files.length} document(s): ${files.join(", ")}`);
  console.log(`   Output: src/lib/vector-store.json\n`);

  const allChunks = [];

  for (const file of files) {
    const content = readFileSync(join(KB_DIR, file), "utf8");
    const chunks = parseChunks(content, file);
    console.log(`📄 ${file} → ${chunks.length} chunks`);
    allChunks.push(...chunks.map((c) => ({ ...c, _file: file })));
  }

  console.log(`\n🔢 Total chunks to embed: ${allChunks.length}`);
  console.log(`⏳ Generating embeddings (this takes ~${Math.ceil(allChunks.length * 0.5)} seconds)...\n`);

  const embedded = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    process.stdout.write(
      `   [${i + 1}/${allChunks.length}] ${chunk.source} — ${chunk.heading.slice(0, 50)}...`
    );

    const embedding = await embedWithRetry(chunk.textForEmbedding);

    embedded.push({
      id: chunk.id,
      source: chunk.source,
      fileTitle: chunk.fileTitle,
      heading: chunk.heading,
      content: chunk.content,
      category: chunk.category,
      embedding,
    });

    console.log(` ✓ (${embedding.length} dims)`);

    // Gentle rate limiting — Gemini free tier allows ~60 requests/minute
    if (i < allChunks.length - 1) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const store = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model: "text-embedding-004",
    dimensions: embedded[0]?.embedding?.length ?? 768,
    chunkCount: embedded.length,
    chunks: embedded,
  };

  writeFileSync(OUT_PATH, JSON.stringify(store, null, 2), "utf8");

  const fileSizeKB = Math.round(
    Buffer.byteLength(JSON.stringify(store)) / 1024
  );

  console.log(`\n✅ Ingestion complete!`);
  console.log(`   Chunks indexed: ${embedded.length}`);
  console.log(`   Embedding dims: ${store.dimensions}`);
  console.log(`   Vector store size: ${fileSizeKB} KB`);
  console.log(`   Saved to: src/lib/vector-store.json`);
  console.log(`\n📋 Breakdown by source:`);

  const bySource = {};
  for (const c of embedded) {
    bySource[c.source] = (bySource[c.source] || 0) + 1;
  }
  for (const [src, count] of Object.entries(bySource)) {
    console.log(`   ${src}: ${count} chunks`);
  }

  console.log(`\n🔍 Running retrieval tests...\n`);
  await runRetrievalTests(embedded);

  console.log(`\n✅ Done. To add new documents:`);
  console.log(`   1. Place .md or .txt files in knowledge_base/`);
  console.log(`   2. Run: npm run ingest\n`);
}

// ── Cosine similarity ─────────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function search(query, chunks, limit = 3) {
  const queryEmbedding = await embedWithRetry(query);
  const scored = chunks.map((c) => ({
    ...c,
    score: cosineSimilarity(queryEmbedding, c.embedding),
  }));
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

// ── Retrieval validation tests ────────────────────────────────────────────────
async function runRetrievalTests(chunks) {
  const tests = [
    { query: "Teacher touched my daughter", expected: "POCSO" },
    { query: "My company has no ICC", expected: "POSH" },
    { query: "Child marriage prevention reporting", expected: "CHILD_MARRIAGE" },
    { query: "Free legal aid lawyer", expected: "RIGHTS" },
    { query: "Childline 1098 emergency", expected: "GENERAL" },
    { query: "Mandatory reporting obligation Section 19", expected: "POCSO" },
    { query: "Workplace sexual harassment complaint ICC", expected: "POSH" },
  ];

  let passed = 0;
  for (const test of tests) {
    const results = await search(test.query, chunks, 3);
    const topCategory = results[0]?.category;
    const topScore = results[0]?.score?.toFixed(3);
    const topHeading = results[0]?.heading?.slice(0, 50);
    const ok = topCategory === test.expected;
    if (ok) passed++;
    const icon = ok ? "✅" : "⚠️";
    console.log(`${icon} "${test.query.slice(0, 40)}"`);
    console.log(`   → [${topCategory}] ${topHeading} (score: ${topScore})`);
    await new Promise((r) => setTimeout(r, 100));
  }
  console.log(`\n   Retrieval tests: ${passed}/${tests.length} passed`);
}

main().catch((err) => {
  console.error("\n❌ Ingestion failed:", err.message);
  process.exit(1);
});
