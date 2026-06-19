const fetch = require("node-fetch");
const fallback = require("../data/fallbackQuestions.json");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

// Optional free cloud fallback for when Ollama isn't reachable (e.g. in production
// on a host like Render where you can't run a local LLM). Get a free key at
// https://console.groq.com and set GROQ_API_KEY in your environment — if it's
// not set, this layer is simply skipped and we go straight to the static bank.
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function buildPrompt(category, level, type, count) {
  const typeInstruction =
    type === "Coding"
      ? `Each question must involve writing, reading, or debugging actual code.
- If fixing a bug: put the BUGGY code inside the "question" field as plain text (use \\n for line breaks, no markdown fences).
- The "answer" field must contain the CORRECT/COMPLETE code first (plain text, \\n for line breaks), then a brief explanation after a blank line.
- Questions should be practical: fix a bug, implement a function, explain output, refactor code.`
      : `Each question should be a conceptual/theory question (no code-writing required).
- The "answer" field should be a clear prose explanation.`;

  return `Generate ${count} ${level} level ${category} interview questions for a frontend developer.
Question type: ${type}.
${typeInstruction}

IMPORTANT: Return ONLY a raw JSON array (no markdown, no wrapper object), like this:
[{"question": "...", "answer": "...", "hints": ["hint1", "hint2"], "tags": ["tag1", "tag2"]}]`;
}

function extractJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON array found in model output");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function normalizeQuestions(parsed, count, type) {
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Model returned an empty/invalid array");
  }
  return parsed.slice(0, count).map((q) => ({
    question: q.question || "",
    answer: q.answer || "",
    hints: Array.isArray(q.hints) ? q.hints : [],
    tags: Array.isArray(q.tags) ? q.tags : [],
    type,
  }));
}

function getFallbackQuestions(category, level, count) {
  const pool = fallback[category]?.[level] || [];
  // cycle through the pool if more questions are requested than available
  const result = [];
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    result.push(pool[i % pool.length]);
  }
  return result;
}

// ---------- Layer 1: local Ollama ----------
async function tryOllama(prompt, count, type) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      format: "json",
    }),
    timeout: 60000,
  });

  if (!response.ok) {
    throw new Error(`Ollama responded with status ${response.status}`);
  }

  const data = await response.json();
  const parsed = extractJsonArray(data.response || "");
  return normalizeQuestions(parsed, count, type);
}

// ---------- Layer 2: free hosted Groq API (used when Ollama isn't reachable,
// e.g. in production where you can't run a local LLM) ----------
async function tryGroq(prompt, count, type) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not set, skipping cloud fallback");
  }

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You output only raw JSON arrays with no markdown, no code fences, no commentary.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
    timeout: 30000,
  });

  if (!response.ok) {
    throw new Error(`Groq responded with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const parsed = extractJsonArray(content);
  return normalizeQuestions(parsed, count, type);
}

function buildAnswerPrompt(question, category, level, type) {
  const typeInstruction =
    type === "Coding"
      ? "The answer must contain the complete working code solution (plain text, use \\n for line breaks), followed by a brief explanation after a blank line."
      : "The answer should be a clear, detailed prose explanation. No code blocks needed.";

  return `You are a senior frontend developer and technical interviewer.

A user has written the following ${level} level ${category} interview question (type: ${type}):

"${question}"

Your task:
1. Write a thorough, correct answer for this question.
2. Write 2-3 short hints that guide someone to the answer without giving it away.
3. Write 3-5 relevant tags (lowercase, single words or hyphenated).

${typeInstruction}

Return ONLY a raw JSON object (no markdown, no code fences), like this:
{"answer": "...", "hints": ["hint1", "hint2"], "tags": ["tag1", "tag2"]}`;
}

async function tryOllamaAnswer(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false, format: "json" }),
    timeout: 60000,
  });
  if (!response.ok) throw new Error(`Ollama responded with status ${response.status}`);
  const data = await response.json();
  const parsed = JSON.parse(data.response || "{}");
  if (!parsed.answer) throw new Error("No answer in Ollama response");
  return parsed;
}

async function tryGroqAnswer(prompt) {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not set, skipping cloud fallback");
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You output only raw JSON objects with no markdown, no code fences, no commentary." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    }),
    timeout: 30000,
  });
  if (!response.ok) throw new Error(`Groq responded with status ${response.status}`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in Groq response");
  const parsed = JSON.parse(content.slice(start, end + 1));
  if (!parsed.answer) throw new Error("No answer in Groq response");
  return parsed;
}

async function generateAnswer(question, category, level, type) {
  const prompt = buildAnswerPrompt(question, category, level, type);
  try {
    const result = await tryOllamaAnswer(prompt);
    return { source: "ollama", ...result };
  } catch (ollamaErr) {
    try {
      const result = await tryGroqAnswer(prompt);
      return { source: "groq", ...result };
    } catch (groqErr) {
      return {
        source: "fallback",
        error: `ollama: ${ollamaErr.message}; groq: ${groqErr.message}`,
        answer: "",
        hints: [],
        tags: [],
      };
    }
  }
}

async function generateQuestions(category, level, type, count) {
  const prompt = buildPrompt(category, level, type, count);

  try {
    const questions = await tryOllama(prompt, count, type);
    return { source: "ollama", questions };
  } catch (ollamaErr) {
    try {
      const questions = await tryGroq(prompt, count, type);
      return { source: "groq", questions };
    } catch (groqErr) {
      // Both local Ollama and the cloud fallback are unavailable -> use the
      // static sample bank so the app still works end-to-end.
      return {
        source: "fallback",
        error: `ollama: ${ollamaErr.message}; groq: ${groqErr.message}`,
        questions: getFallbackQuestions(category, level, count).map((q) => ({ ...q, type })),
      };
    }
  }
}

module.exports = { generateQuestions, generateAnswer };
