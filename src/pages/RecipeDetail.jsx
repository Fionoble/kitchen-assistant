import { useRoute, useLocation } from "preact-iso";
import { getRecipe, toggleFavorite, favoriteIds, removeRecipe } from "../stores/recipes.js";
import { useRecipeImage } from "../hooks/useRecipeImage.js";
import { generatingImages } from "../stores/imageGen.js";
import { deleteImage } from "../stores/imageDb.js";
import { Icon } from "../components/Icon.jsx";

export function RecipeDetail() {
  const { params } = useRoute();
  const { route } = useLocation();
  const recipe = getRecipe(params.id);

  if (!recipe) {
    return (
      <div class="max-w-3xl mx-auto px-6 py-20 text-center">
        <Icon name="search_off" class="text-7xl text-outline-variant mb-4" />
        <h2 class="font-headline text-2xl font-bold mb-2">Recipe not found</h2>
        <a href="/library" class="text-primary font-bold">Back to Library</a>
      </div>
    );
  }

  const isFav = favoriteIds.value.has(recipe.id);
  const imageUrl = useRecipeImage(recipe.id, recipe.hasImage);
  const isGenerating = generatingImages.value.has(recipe.id);
  const imgSrc = imageUrl.value || recipe.image;

  const handleDelete = () => {
    if (confirm("Remove this recipe from your library?")) {
      deleteImage(recipe.id).catch(() => {});
      removeRecipe(recipe.id);
      route("/library");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: `Check out this recipe: ${recipe.title}${recipe.description ? " - " + recipe.description : ""}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(
        `${recipe.title}\n${recipe.description || ""}\n\nIngredients:\n${(recipe.ingredients || []).join("\n")}`
      );
      alert("Recipe copied to clipboard!");
    }
  };

  return (
    <div class="max-w-screen-xl mx-auto pb-8">
      <section class="relative px-6 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div class="md:col-span-7 z-10">
          <div class="flex items-center gap-4 mb-4">
            <a href="/library" class="text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="arrow_back" />
            </a>
            {recipe.aiGenerated && (
              <div class="flex items-center gap-2 text-tertiary font-bold tracking-wider uppercase text-xs">
                <Icon name="auto_awesome" filled class="text-sm" />
                AI Generated Recipe
              </div>
            )}
          </div>
          <h2 class="font-headline text-4xl md:text-6xl font-bold text-primary leading-tight mb-6">
            {recipe.title}
          </h2>
          {recipe.description && (
            <p class="text-on-surface-variant text-lg max-w-md leading-relaxed mb-8">
              {recipe.description}
            </p>
          )}
          <div class="flex flex-wrap gap-4 items-center">
            {recipe.time && (
              <div class="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <Icon name="schedule" class="text-primary" />
                <span class="text-sm font-semibold">{recipe.time}</span>
              </div>
            )}
            {recipe.servings && (
              <div class="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <Icon name="restaurant" class="text-primary" />
                <span class="text-sm font-semibold">Serves {recipe.servings}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div class="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <Icon name="signal_cellular_alt" class="text-primary" />
                <span class="text-sm font-semibold">{recipe.difficulty}</span>
              </div>
            )}
            {recipe.calories && (
              <div class="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                <Icon name="local_fire_department" class="text-primary" />
                <span class="text-sm font-semibold">{recipe.calories} kcal</span>
              </div>
            )}
          </div>
        </div>
        {(imgSrc || isGenerating) && (
          <div class="md:col-span-5 relative">
            <div class="relative rounded-[2.5rem] overflow-hidden editorial-shadow aspect-[4/5]">
              {imgSrc ? (
                <img
                  alt={recipe.title}
                  class="w-full h-full object-cover"
                  src={imgSrc}
                />
              ) : (
                <div class="w-full h-full bg-gradient-to-br from-primary/10 to-tertiary/10 flex flex-col items-center justify-center gap-3">
                  <div class="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <span class="text-sm font-semibold text-on-surface-variant">Generating image...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section class="px-6 mt-12 flex flex-wrap justify-between items-center gap-6">
        <div class="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(recipe.id)}
            class={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isFav
                ? "bg-red-50 text-red-500"
                : "bg-surface-container-high text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <Icon name="favorite" filled={isFav} />
          </button>
          <button
            onClick={handleShare}
            class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
          >
            <Icon name="share" />
          </button>
          <button
            onClick={handleDelete}
            class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors duration-300"
          >
            <Icon name="delete" />
          </button>
        </div>
        {recipe.tags?.length > 0 && (
          <div class="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                class="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      <section class="px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {recipe.ingredients?.length > 0 && (
          <div class="lg:col-span-4 bg-surface-container-low p-8 rounded-[2rem]">
            <h3 class="font-headline text-2xl font-bold mb-6 flex items-center gap-3">
              Ingredients
              <span class="text-sm font-body font-normal text-on-surface-variant">
                ({recipe.ingredients.length} items)
              </span>
            </h3>
            <ul class="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} class="flex items-center gap-4 group cursor-pointer">
                  <div class="relative w-6 h-6 flex items-center justify-center">
                    <input
                      class="peer appearance-none w-6 h-6 border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                      type="checkbox"
                    />
                    <Icon
                      name="check"
                      class="absolute text-white opacity-0 peer-checked:opacity-100 text-sm pointer-events-none"
                    />
                  </div>
                  <span class="font-medium group-hover:text-primary transition-colors peer-checked:line-through">
                    {ing}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.steps?.length > 0 && (
          <div class={recipe.ingredients?.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            <h3 class="font-headline text-2xl font-bold mb-8">Preparation</h3>
            <div class="space-y-10">
              {recipe.steps.map((step, i) => (
                <div key={i} class="flex gap-6">
                  <div
                    class={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl editorial-shadow ${
                      i === 0
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-primary"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div class="space-y-2 pt-2">
                    <h4 class="font-bold text-lg text-primary">{step.title}</h4>
                    <p class="text-on-surface-variant leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
