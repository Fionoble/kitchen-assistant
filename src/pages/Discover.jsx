import { useSignal } from "@preact/signals";
import { recipes } from "../stores/recipes.js";
import { RecipeCard } from "../components/RecipeCard.jsx";
import { Icon } from "../components/Icon.jsx";

export function Discover() {
  const filter = useSignal("all");
  const allRecipes = recipes.value;

  const filtered =
    filter.value === "ai"
      ? allRecipes.filter((r) => r.aiGenerated)
      : filter.value === "saved"
        ? allRecipes.filter((r) => r.saved)
        : allRecipes;

  const featured = filtered[0];
  const rest = filtered.slice(featured ? 1 : 0);

  return (
    <div class="max-w-screen-xl mx-auto px-6 py-8">
      <section class="mb-12">
        <h2 class="font-headline text-5xl md:text-6xl text-primary font-bold mb-4 tracking-tight">
          Discover
        </h2>
        <p class="text-on-surface-variant text-lg leading-relaxed max-w-xl">
          Explore AI-generated recipes tailored to your taste, or get inspired by new ideas for
          tonight's dinner.
        </p>
      </section>

      <section class="mb-10">
        <div class="bg-surface-container-low p-2 rounded-full flex items-center shadow-sm max-w-2xl">
          <div class="flex-1 flex items-center px-4 gap-3">
            <Icon name="search" class="text-outline" />
            <input
              class="w-full bg-transparent border-none outline-none text-on-surface placeholder:text-outline py-3"
              placeholder="Search recipes, ingredients, cuisines..."
              type="text"
            />
          </div>
          <button class="btn-primary text-on-primary px-8 py-3 rounded-full font-bold">
            Search
          </button>
        </div>
      </section>

      <nav class="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: "all", label: "All Recipes" },
          { id: "ai", label: "AI Generated", icon: "auto_awesome" },
          { id: "saved", label: "Favorites", icon: "favorite" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => (filter.value = tab.id)}
            class={`px-6 py-2.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              filter.value === tab.id
                ? "btn-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {tab.icon && <Icon name={tab.icon} filled class="text-sm" />}
            {tab.label}
          </button>
        ))}
      </nav>

      {allRecipes.length === 0 ? (
        <div class="text-center py-20">
          <Icon name="restaurant_menu" class="text-7xl text-outline-variant mb-4" />
          <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">
            Your kitchen awaits
          </h3>
          <p class="text-on-surface-variant mb-8 max-w-md mx-auto">
            Start by chatting with your AI Chef to generate your first recipe, or create one
            manually.
          </p>
          <a
            href="/chef"
            class="btn-primary text-on-primary px-8 py-4 rounded-full font-bold inline-flex items-center gap-2"
          >
            <Icon name="auto_awesome" filled />
            Talk to AI Chef
          </a>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featured && (
            <div class="md:col-span-8">
              <RecipeCard recipe={featured} variant="hero" />
            </div>
          )}
          {rest.length > 0 && featured && (
            <div class="md:col-span-4">
              {rest[0] && <RecipeCard recipe={rest[0]} />}
            </div>
          )}
          {(featured ? rest.slice(1) : rest).map((recipe) => (
            <div key={recipe.id} class="md:col-span-4">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
