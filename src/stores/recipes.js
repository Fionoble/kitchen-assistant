import { signal, computed } from "@preact/signals";

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const recipes = signal(loadFromStorage("kitchen-recipes", []));
export const favoriteIds = signal(new Set(loadFromStorage("kitchen-favorites", [])));

export const savedRecipes = computed(() =>
  recipes.value.filter((r) => favoriteIds.value.has(r.id))
);

export function addRecipe(recipe) {
  const r = { ...recipe, id: recipe.id || crypto.randomUUID(), createdAt: Date.now() };
  recipes.value = [r, ...recipes.value];
  persist("kitchen-recipes", recipes.value);
  return r;
}

export function removeRecipe(id) {
  recipes.value = recipes.value.filter((r) => r.id !== id);
  persist("kitchen-recipes", recipes.value);
}

export function toggleFavorite(id) {
  const next = new Set(favoriteIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  favoriteIds.value = next;
  persist("kitchen-favorites", [...next]);
}

export function getRecipe(id) {
  return recipes.value.find((r) => r.id === id);
}

export function updateRecipe(id, updates) {
  recipes.value = recipes.value.map((r) => (r.id === id ? { ...r, ...updates } : r));
  persist("kitchen-recipes", recipes.value);
}
