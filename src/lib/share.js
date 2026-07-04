import { getImage } from "../stores/imageDb.js";
import { showToast } from "../stores/toast.js";

function slugify(title) {
  return (
    (title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "recipe"
  );
}

// Clean plain text — this lands in Signal/iMessage bubbles.
function buildShareText(recipe) {
  const lines = [recipe.title];
  if (recipe.ingredients?.length) {
    lines.push("", "Ingredients:", ...recipe.ingredients.map((ing) => `• ${ing}`));
  }
  if (recipe.steps?.length) {
    lines.push(
      "",
      "Steps:",
      ...recipe.steps.map((step, i) => {
        const body =
          typeof step === "string"
            ? step
            : [step.title, step.description].filter(Boolean).join(" — ");
        return `${i + 1}. ${body}`;
      })
    );
  }
  lines.push("", "🍳 via Cooking Buddy");
  return lines.join("\n");
}

// Share a recipe card via the native share sheet (with its generated photo
// when possible), falling back to the clipboard.
export async function shareRecipe(recipe) {
  const title = recipe.title || "Recipe";
  const text = buildShareText(recipe);

  try {
    let files;
    if (recipe.hasImage) {
      const blob = await getImage(recipe.id).catch(() => null);
      if (blob) {
        const file = new File([blob], `${slugify(recipe.title)}.png`, {
          type: blob.type || "image/png",
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          files = [file];
        }
      }
    }

    if (navigator.share) {
      await navigator.share(files ? { title, text, files } : { title, text });
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast("Copied recipe to clipboard");
  } catch (err) {
    // User dismissed the share sheet — nothing to do.
    if (err?.name === "AbortError") return;
    console.error("Share failed:", err);
    showToast("Couldn't share this recipe");
  }
}
