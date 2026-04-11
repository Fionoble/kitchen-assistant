import { useSignal } from "@preact/signals";
import { mealPlans, addMealPlan, removeMealPlan } from "../stores/mealPlans.js";
import { recipes } from "../stores/recipes.js";
import { Icon } from "../components/Icon.jsx";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

function MealSlot({ recipeId, onAssign, onClear }) {
  const recipe = recipeId ? recipes.value.find((r) => r.id === recipeId) : null;
  const showPicker = useSignal(false);
  const allRecipes = recipes.value;

  if (recipe) {
    return (
      <div class="bg-surface-container-lowest p-3 rounded-xl flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon name="restaurant" class="text-primary text-sm" />
        </div>
        <span class="text-sm font-medium truncate flex-grow">{recipe.title}</span>
        <button
          onClick={onClear}
          class="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="close" class="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <div class="relative">
      <button
        onClick={() => (showPicker.value = !showPicker.value)}
        class="w-full bg-surface-container-lowest p-3 rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors border border-dashed border-outline-variant/30"
      >
        <Icon name="add" class="text-sm" />
        <span class="text-xs font-semibold">Add</span>
      </button>
      {showPicker.value && allRecipes.length > 0 && (
        <div class="absolute top-full mt-1 left-0 right-0 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 z-20 max-h-48 overflow-y-auto">
          {allRecipes.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onAssign(r.id);
                showPicker.value = false;
              }}
              class="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {r.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan }) {
  const expanded = useSignal(false);

  const handleAssign = (day, meal, recipeId) => {
    const days = { ...(plan.days || {}) };
    if (!days[day]) days[day] = {};
    days[day] = { ...days[day], [meal]: recipeId };
    const updated = mealPlans.value.map((p) => (p.id === plan.id ? { ...p, days } : p));
    mealPlans.value = updated;
    localStorage.setItem("kitchen-meal-plans", JSON.stringify(updated));
  };

  const handleClear = (day, meal) => {
    const days = { ...(plan.days || {}) };
    if (days[day]) {
      const { [meal]: _, ...rest } = days[day];
      days[day] = rest;
    }
    const updated = mealPlans.value.map((p) => (p.id === plan.id ? { ...p, days } : p));
    mealPlans.value = updated;
    localStorage.setItem("kitchen-meal-plans", JSON.stringify(updated));
  };

  return (
    <div class="bg-surface-container-low rounded-[2rem] overflow-hidden">
      <button
        onClick={() => (expanded.value = !expanded.value)}
        class="w-full p-6 flex items-center justify-between"
      >
        <div>
          <h3 class="font-headline text-xl font-bold text-left">{plan.name}</h3>
          <p class="text-on-surface-variant text-sm text-left">
            {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this meal plan?")) removeMealPlan(plan.id);
            }}
            class="text-on-surface-variant hover:text-error transition-colors"
          >
            <Icon name="delete" />
          </button>
          <Icon
            name="expand_more"
            class={`text-on-surface-variant transition-transform ${expanded.value ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded.value && (
        <div class="px-6 pb-6 overflow-x-auto">
          <table class="w-full min-w-[600px]">
            <thead>
              <tr>
                <th class="text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider pb-3 w-24" />
                {MEALS.map((meal) => (
                  <th
                    key={meal}
                    class="text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider pb-3 px-2"
                  >
                    {meal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td class="py-2 text-sm font-semibold text-primary align-top">{day.slice(0, 3)}</td>
                  {MEALS.map((meal) => (
                    <td key={meal} class="py-2 px-2 align-top">
                      <MealSlot
                        recipeId={plan.days?.[day]?.[meal]}
                        onAssign={(id) => handleAssign(day, meal, id)}
                        onClear={() => handleClear(day, meal)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MealPlans() {
  const newPlanName = useSignal("");

  const handleCreate = () => {
    const name = newPlanName.value.trim();
    if (!name) return;
    addMealPlan({ name, days: {} });
    newPlanName.value = "";
  };

  return (
    <div class="max-w-screen-xl mx-auto px-6 py-8">
      <section class="mb-10">
        <h2 class="font-headline text-4xl md:text-5xl text-primary font-bold mb-4 tracking-tight">
          Meal Plans
        </h2>
        <p class="text-on-surface-variant text-lg leading-relaxed max-w-xl">
          Organize your week with curated meal plans. Drag recipes from your library into any slot.
        </p>
      </section>

      <section class="mb-10">
        <div class="bg-surface-container-low p-2 rounded-full flex items-center shadow-sm max-w-lg">
          <input
            class="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-outline px-4 py-3"
            placeholder="New meal plan name..."
            value={newPlanName.value}
            onInput={(e) => (newPlanName.value = e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            onClick={handleCreate}
            disabled={!newPlanName.value.trim()}
            class="btn-primary text-on-primary px-6 py-3 rounded-full font-bold disabled:opacity-50"
          >
            Create Plan
          </button>
        </div>
      </section>

      {mealPlans.value.length === 0 ? (
        <div class="text-center py-20">
          <Icon name="calendar_month" class="text-7xl text-outline-variant mb-4" />
          <h3 class="font-headline text-2xl font-bold text-on-surface mb-2">No meal plans yet</h3>
          <p class="text-on-surface-variant">Create your first meal plan to organize your week.</p>
        </div>
      ) : (
        <div class="space-y-6">
          {mealPlans.value.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
