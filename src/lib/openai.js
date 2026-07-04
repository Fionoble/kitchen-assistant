import { gatewayToken, profile } from "../stores/profile.js";

// Two auth modes: the Republic gateway (keys live server-side, this browser
// holds only Cooking Buddy's revocable app token) or BYOK (guest mode —
// bring your own OpenAI key). The gateway token takes precedence.
const GATEWAY_BASE = "https://republic-gateway.p-fio-noble.workers.dev";

/**
 * Build the URL + headers for an OpenAI-compatible endpoint path
 * (e.g. "chat/completions", "images/generations").
 * Returns null when no AI access is configured.
 */
export function openAIRequest(path) {
  const token = gatewayToken.value;
  if (token) {
    return {
      url: `${GATEWAY_BASE}/openai/v1/${path}`,
      headers: { "Content-Type": "application/json", "x-proxy-token": token },
    };
  }
  const apiKey = profile.value.apiKey;
  if (apiKey) {
    return {
      url: `https://api.openai.com/v1/${path}`,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    };
  }
  return null;
}
