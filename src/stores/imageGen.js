import { signal } from "@preact/signals";
import { profile } from "./profile.js";
import { saveImage } from "./imageDb.js";
import { updateRecipe } from "./recipes.js";

// Track which recipes are currently generating images
export const generatingImages = signal(new Set());

export async function generateRecipeImage(recipeId, title, description) {
  const apiKey = profile.value.apiKey;
  if (!apiKey) return;

  generatingImages.value = new Set([...generatingImages.value, recipeId]);

  try {
    const prompt = `Professional food photography of "${title}". ${description || ""} Beautifully plated, natural lighting, shallow depth of field, rustic ceramic plate, warm tones. Editorial food magazine style.`;

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "low",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Image generation failed:", errText);
      return;
    }

    const data = await res.json();
    const b64 = data.data[0].b64_json;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/png" });

    await saveImage(recipeId, blob);
    // Store an object URL marker so components know an image exists
    updateRecipe(recipeId, { hasImage: true });
  } catch (err) {
    console.error("Image generation error:", err);
  } finally {
    const next = new Set(generatingImages.value);
    next.delete(recipeId);
    generatingImages.value = next;
  }
}
