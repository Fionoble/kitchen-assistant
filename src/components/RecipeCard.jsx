import { Icon } from "./Icon.jsx";
import { toggleFavorite, favoriteIds } from "../stores/recipes.js";
import { useRecipeImage } from "../hooks/useRecipeImage.js";
import { generatingImages } from "../stores/imageGen.js";

export function RecipeCard({ recipe, variant = "default" }) {
  const isFav = favoriteIds.value.has(recipe.id);
  const imageUrl = useRecipeImage(recipe.id, recipe.hasImage);
  const isGenerating = generatingImages.value.has(recipe.id);
  const imgSrc = imageUrl.value || recipe.image;

  if (variant === "hero") {
    return (
      <a
        href={`/recipe/${recipe.id}`}
        class="group relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all h-[400px] block no-underline"
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={recipe.title}
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div class="absolute inset-0 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
            {isGenerating && (
              <div class="flex flex-col items-center gap-2 text-on-primary/70">
                <div class="w-6 h-6 rounded-full border-2 border-on-primary/50 border-t-transparent animate-spin" />
                <span class="text-xs font-semibold">Generating image...</span>
              </div>
            )}
          </div>
        )}
        <div class="absolute inset-0 recipe-card-gradient" />
        {recipe.aiGenerated && (
          <div class="absolute top-4 left-4">
            <span class="bg-primary/80 text-on-primary font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-md">
              <Icon name="auto_awesome" filled class="text-xs" />
              AI GENERATED
            </span>
          </div>
        )}
        <div class="absolute bottom-0 left-0 p-8 w-full">
          <h3 class="font-headline text-3xl text-white font-bold mb-2">{recipe.title}</h3>
          <div class="flex items-center gap-4 text-white/90 font-medium">
            {recipe.time && (
              <span class="flex items-center gap-1 text-sm">
                <Icon name="schedule" class="text-sm" /> {recipe.time}
              </span>
            )}
            {recipe.calories && (
              <span class="flex items-center gap-1 text-sm">
                <Icon name="local_fire_department" class="text-sm" /> {recipe.calories} kcal
              </span>
            )}
          </div>
        </div>
      </a>
    );
  }

  return (
    <div class="group overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all">
      <a href={`/recipe/${recipe.id}`} class="block no-underline">
        <div class="h-48 overflow-hidden relative bg-surface-container">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={recipe.title}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div class="w-full h-full bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center">
              {isGenerating ? (
                <div class="flex flex-col items-center gap-2 text-primary/50">
                  <div class="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <span class="text-xs font-semibold">Generating...</span>
                </div>
              ) : (
                <Icon name="restaurant" class="text-6xl text-primary/30" />
              )}
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
            class="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Icon
              name="favorite"
              filled={isFav}
              class={isFav ? "text-red-500" : "text-outline"}
            />
          </button>
          {recipe.aiGenerated && (
            <div class="absolute top-4 left-4 bg-tertiary-container/90 text-on-tertiary-fixed font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-md">
              <Icon name="auto_awesome" filled class="text-xs" />
              AI
            </div>
          )}
        </div>
        <div class="p-5">
          <h3 class="font-headline text-xl font-bold text-on-surface mb-1">{recipe.title}</h3>
          {recipe.description && (
            <p class="text-on-surface-variant text-sm mb-4 line-clamp-2">{recipe.description}</p>
          )}
          <div class="flex items-center justify-between pt-3 border-t border-surface-container">
            <div class="flex items-center gap-3">
              {recipe.time && (
                <span class="flex items-center gap-1 text-on-surface-variant text-sm">
                  <Icon name="timer" class="text-sm" /> {recipe.time}
                </span>
              )}
              {recipe.difficulty && (
                <span class="flex items-center gap-1 text-on-surface-variant text-sm">
                  <Icon name="restaurant" class="text-sm" /> {recipe.difficulty}
                </span>
              )}
            </div>
            {recipe.servings && (
              <span class="text-on-surface-variant text-sm flex items-center gap-1">
                <Icon name="group" class="text-sm" /> {recipe.servings}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
