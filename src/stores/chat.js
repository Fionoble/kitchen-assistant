import { signal } from "@preact/signals";
import { profile } from "./profile.js";

export const messages = signal(loadFromStorage("kitchen-chat", []));
export const isLoading = signal(false);

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function persistMessages() {
  localStorage.setItem("kitchen-chat", JSON.stringify(messages.value));
}

export function clearChat() {
  messages.value = [];
  persistMessages();
}

function buildSystemPrompt() {
  const p = profile.value;
  let sys = `You are a friendly, knowledgeable AI sous chef and kitchen assistant. You help users create meals, suggest recipes, and provide cooking guidance. Always respond with practical, actionable advice.

When suggesting a recipe, format it as JSON inside a code block like this:
\`\`\`recipe
{
  "title": "Recipe Name",
  "description": "Brief description",
  "time": "30 min",
  "servings": 4,
  "calories": 450,
  "difficulty": "Easy",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": [
    {"title": "Step Title", "description": "Step details"}
  ],
  "tags": ["tag1", "tag2"]
}
\`\`\`

You can include text before and after the recipe block. Always include a recipe block when suggesting a specific dish.`;

  if (p.dietaryRestrictions?.length) {
    sys += `\n\nUser dietary restrictions: ${p.dietaryRestrictions.join(", ")}. Always respect these.`;
  }
  if (p.allergies?.length) {
    sys += `\nUser allergies: ${p.allergies.join(", ")}. NEVER suggest ingredients containing these.`;
  }
  if (p.servingSize) {
    sys += `\nDefault serving size: ${p.servingSize} people.`;
  }
  if (p.appliances?.length) {
    sys += `\nAvailable kitchen appliances: ${p.appliances.join(", ")}. Feel free to suggest recipes that use these.`;
  }
  return sys;
}

async function callOpenAI(apiKey, msgs) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: msgs, max_tokens: 2048 }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function sendMessage(text) {
  const p = profile.value;
  if (!p.apiKey) throw new Error("Please set your OpenAI API key in Profile settings.");

  const userMsg = { role: "user", content: text, timestamp: Date.now() };
  messages.value = [...messages.value, userMsg];
  persistMessages();
  isLoading.value = true;

  try {
    const apiMessages = [
      { role: "system", content: buildSystemPrompt() },
      ...messages.value.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await callOpenAI(p.apiKey, apiMessages);
    const aiMsg = { role: "assistant", content: response, timestamp: Date.now() };
    messages.value = [...messages.value, aiMsg];
    persistMessages();
  } finally {
    isLoading.value = false;
  }
}

export function parseRecipeFromMessage(content) {
  const match = content.match(/```recipe\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}
