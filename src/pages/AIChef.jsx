import { useSignal, useComputed } from "@preact/signals";
import { useRef } from "preact/hooks";
import { useEffect } from "preact/hooks";
import { messages, isLoading, sendMessage, parseRecipeFromMessage, clearChat } from "../stores/chat.js";
import { addRecipe } from "../stores/recipes.js";
import { hasApiKey } from "../stores/profile.js";
import { generateRecipeImage, generatingImages } from "../stores/imageGen.js";
import { Icon } from "../components/Icon.jsx";

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  const recipe = !isUser ? parseRecipeFromMessage(msg.content) : null;
  const textContent = msg.content.replace(/```recipe[\s\S]*?```/g, "").trim();
  const saved = useSignal(false);
  const savedId = useSignal(null);

  const handleSaveRecipe = () => {
    if (!recipe || saved.value) return;
    const savedRecipe = addRecipe({
      ...recipe,
      aiGenerated: true,
    });
    saved.value = true;
    savedId.value = savedRecipe.id;
    generateRecipeImage(savedRecipe.id, recipe.title, recipe.description);
  };

  return (
    <div class={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div class="w-8 h-8 rounded-full btn-primary flex items-center justify-center shrink-0 mt-1 shadow-[0px_4px_12px_rgba(21,66,18,0.15)]">
          <Icon name="auto_awesome" filled class="text-white text-[18px]" />
        </div>
      )}
      {isUser && (
        <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mt-1">
          <Icon name="person" class="text-on-surface-variant text-[18px]" />
        </div>
      )}
      <div class={`flex flex-col gap-2 max-w-[85%] min-w-0 ${isUser ? "items-end" : ""}`}>
        <div
          class={`p-5 rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.02)] overflow-hidden ${
            isUser
              ? "bg-primary-container text-on-primary-container rounded-tr-none"
              : "bg-surface-container-lowest rounded-tl-none border border-outline-variant/10"
          }`}
        >
          {textContent && (
            <p class="leading-relaxed whitespace-pre-wrap">{textContent}</p>
          )}
          {recipe && (
            <div class="mt-4 bg-surface-container-low p-4 rounded-xl">
              <span class="text-[10px] uppercase tracking-widest font-bold text-tertiary-container mb-1 block">
                AI Recommendation
              </span>
              <h3 class="font-headline font-bold text-lg text-primary">{recipe.title}</h3>
              {recipe.description && (
                <p class="text-on-surface-variant text-sm mt-1">{recipe.description}</p>
              )}
              <div class="flex flex-wrap items-center gap-3 mt-2 text-on-surface-variant text-sm">
                {recipe.time && (
                  <span class="flex items-center gap-1">
                    <Icon name="schedule" class="text-[14px]" /> {recipe.time}
                  </span>
                )}
                {recipe.servings && (
                  <span class="flex items-center gap-1">
                    <Icon name="group" class="text-[14px]" /> Serves {recipe.servings}
                  </span>
                )}
                {recipe.calories && (
                  <span class="flex items-center gap-1">
                    <Icon name="local_fire_department" class="text-[14px]" /> {recipe.calories} kcal
                  </span>
                )}
                {recipe.difficulty && (
                  <span class="flex items-center gap-1">
                    <Icon name="restaurant" class="text-[14px]" /> {recipe.difficulty}
                  </span>
                )}
              </div>

              {recipe.ingredients?.length > 0 && (
                <div class="mt-4 pt-3 border-t border-outline-variant/15">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Ingredients ({recipe.ingredients.length})
                  </h4>
                  <ul class="space-y-1">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} class="flex items-start gap-2 text-sm text-on-surface">
                        <span class="text-primary mt-0.5">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.steps?.length > 0 && (
                <div class="mt-4 pt-3 border-t border-outline-variant/15">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Steps ({recipe.steps.length})
                  </h4>
                  <ol class="space-y-2">
                    {recipe.steps.map((step, i) => (
                      <li key={i} class="flex items-start gap-2 text-sm text-on-surface">
                        <span class="text-primary font-bold shrink-0">{i + 1}.</span>
                        <div>
                          <span class="font-semibold">{step.title}</span>
                          {" — "}
                          <span class="text-on-surface-variant">{step.description}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <button
                onClick={handleSaveRecipe}
                disabled={saved.value}
                class={`mt-4 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
                  saved.value
                    ? "bg-secondary-container text-on-secondary-container cursor-default"
                    : "btn-primary text-on-primary active:scale-95"
                }`}
              >
                <Icon name={saved.value ? "check_circle" : "bookmark_add"} filled={saved.value} class="text-sm" />
                {saved.value ? "Saved to Library" : "Save to Library"}
              </button>
              {saved.value && savedId.value && generatingImages.value.has(savedId.value) && (
                <div class="mt-2 flex items-center gap-2 text-xs text-on-surface-variant">
                  <div class="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  Generating recipe image...
                </div>
              )}
            </div>
          )}
        </div>
        <span class="text-[11px] font-semibold text-on-surface-variant px-1">
          {isUser ? "YOU" : "AI CHEF"} •{" "}
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  { icon: "restaurant", label: "What can I make with chicken?" },
  { icon: "timer", label: "Quick 15-minute dinner" },
  { icon: "eco", label: "Healthy vegetarian meal" },
  { icon: "cake", label: "Easy dessert ideas" },
];

export function AIChef() {
  const input = useSignal("");
  const chatEndRef = useRef(null);
  const apiKeyReady = hasApiKey.value;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.value.length]);

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text || isLoading.value) return;
    input.value = "";
    try {
      await sendMessage(text);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div class="flex flex-col max-w-3xl mx-auto w-full px-4 pt-6 pb-40">
      <div class="mb-8 text-center md:text-left">
        <h2 class="text-3xl font-headline font-bold text-primary mb-2">AI Chef</h2>
        <p class="text-on-surface-variant max-w-lg">
          Your personal sous chef. Ask for recipes based on ingredients you have, dietary needs, or
          just what you're in the mood for.
        </p>
      </div>

      {!apiKeyReady && (
        <div class="bg-tertiary-fixed/30 p-6 rounded-xl mb-8 text-center">
          <Icon name="key" class="text-3xl text-tertiary mb-2" />
          <h3 class="font-bold text-lg mb-2">Set up your API key</h3>
          <p class="text-on-surface-variant text-sm mb-4">
            To chat with AI Chef, add your API key in Profile settings.
          </p>
          <a
            href="/profile"
            class="btn-primary text-on-primary px-6 py-3 rounded-full font-bold inline-flex items-center gap-2"
          >
            <Icon name="settings" />
            Go to Profile
          </a>
        </div>
      )}

      <div class="space-y-6 flex-grow">
        {messages.value.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}

        {isLoading.value && (
          <div class="flex items-center gap-2 px-12">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:75ms]" />
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span class="text-[11px] font-bold ml-2 text-on-surface-variant">
              CHEF IS THINKING
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {messages.value.length === 0 && apiKeyReady && (
        <div class="mb-8">
          <p class="text-sm font-semibold text-on-surface-variant mb-3">Try asking:</p>
          <div class="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  input.value = s.label;
                  handleSend();
                }}
                class="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-sm text-primary font-semibold shadow-sm hover:bg-surface transition-colors flex items-center gap-2"
              >
                <Icon name={s.icon} filled class="text-[18px] text-tertiary" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.value.length > 0 && (
        <div class="mb-4 flex justify-center">
          <button
            onClick={clearChat}
            class="text-sm text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
          >
            <Icon name="delete_sweep" class="text-sm" />
            Clear conversation
          </button>
        </div>
      )}

      <div class="fixed bottom-20 md:bottom-0 left-0 w-full z-40">
        <div class="bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 px-6 py-4 pb-6 md:pb-8 shadow-[0px_-8px_40px_rgba(0,0,0,0.05)]">
          <div class="max-w-3xl mx-auto flex items-center gap-4">
            <div class="flex-grow relative">
              <input
                class="w-full bg-surface-container-low border-none rounded-2xl px-6 py-3.5 pr-12 focus:ring-2 focus:ring-primary/10 text-on-surface placeholder:text-on-surface-variant/60 outline-none"
                placeholder="Tell me what ingredients you have..."
                type="text"
                value={input.value}
                onInput={(e) => (input.value = e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                disabled={!apiKeyReady}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.value.trim() || isLoading.value || !apiKeyReady}
              class="w-12 h-12 rounded-full btn-primary flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform duration-200 disabled:opacity-50"
            >
              <Icon name="send" filled />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
