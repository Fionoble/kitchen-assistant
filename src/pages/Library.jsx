import { useSignal } from "@preact/signals";
import { recipes, favoriteIds } from "../stores/recipes.js";
import { RecipeCard } from "../components/RecipeCard.jsx";
import { Icon } from "../components/Icon.jsx";

export function Library() {
  const filter = useSignal("all");
  const search = useSignal("");

  const allRecipes = recipes.value;
  const favIds = favoriteIds.value;

  let filtered = allRecipes;
  if (filter.value === "favorites") filtered = filtered.filter((r) => favIds.has(r.id));
  if (filter.value === "ai") filtered = filtered.filter((r) => r.aiGenerated);

  if (search.value) {
    const q = search.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients?.some((i) => i.toLowerCase().includes(q))
    );
  }

  return (
    <div class="max-w-screen-xl mx-auto px-6 pt-8 pb-8">
      <section class="mb-12">
        <h2 class="font-headline text-5xl md:text-6xl text-primary font-bold mb-4 tracking-tight">
          Your Kitchen Library
        </h2>
        <p class="text-on-surface-variant text-lg leading-relaxed">
          {allRecipes.length} recipe{allRecipes.length !== 1 ? "s" : ""} saved. Your culinary
          memories and AI inspirations, all in one place.
        </p>
      </section>

      <section class="mb-8">
        <div class="bg-surface-container-low p-2 rounded-full flex items-center shadow-sm max-w-2xl">
          <div class="flex-1 flex items-center px-4 gap-3">
            <Icon name="search" class="text-outline" />
            <input
              class="w-full bg-transparent border-none outline-none text-on-surface placeholder:text-outline py-3"
              placeholder="Search your recipes, ingredients..."
              type="text"
              value={search.value}
              onInput={(e) => (search.value = e.currentTarget.value)}
            />
          </div>
        </div>
      </section>

      <nav class="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: "all", label: "All Recipes" },
          { id: "favorites", label: "Favorites", icon: "favorite" },
          { id: "ai", label: "AI Generated", icon: "auto_awesome" },
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

      {filtered.length === 0 ? (
        <div class="text-center py-20">
          <Icon name="menu_book" class="text-7xl text-outline-variant mb-4" />
          <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">
            {search.value || filter.value !== "all"
              ? "No recipes match your search"
              : "No recipes yet"}
          </h3>
          <p class="text-on-surface-variant mb-8">
            {!search.value && filter.value === "all"
              ? "Chat with AI Chef to create your first recipe!"
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
