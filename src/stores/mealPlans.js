import { signal } from "@preact/signals";

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const mealPlans = signal(loadFromStorage("kitchen-meal-plans", []));

function persist() {
  localStorage.setItem("kitchen-meal-plans", JSON.stringify(mealPlans.value));
}

export function addMealPlan(plan) {
  const p = { ...plan, id: plan.id || crypto.randomUUID(), createdAt: Date.now() };
  mealPlans.value = [p, ...mealPlans.value];
  persist();
  return p;
}

export function removeMealPlan(id) {
  mealPlans.value = mealPlans.value.filter((p) => p.id !== id);
  persist();
}

export function updateMealPlan(id, updates) {
  mealPlans.value = mealPlans.value.map((p) => (p.id === id ? { ...p, ...updates } : p));
  persist();
}

export function addRecipeToDay(planId, day, meal, recipeId) {
  mealPlans.value = mealPlans.value.map((p) => {
    if (p.id !== planId) return p;
    const days = { ...p.days };
    if (!days[day]) days[day] = {};
    days[day] = { ...days[day], [meal]: recipeId };
    return { ...p, days };
  });
  persist();
}
