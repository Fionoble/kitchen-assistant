import { useSignal } from "@preact/signals";
import {
  profile,
  updateProfile,
  DIETARY_OPTIONS,
  ALLERGY_OPTIONS,
  APPLIANCE_OPTIONS,
} from "../stores/profile.js";
import { Icon } from "../components/Icon.jsx";

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      class={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
        active
          ? "btn-primary text-on-primary"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
      }`}
    >
      {label}
    </button>
  );
}

export function Profile() {
  const showKey = useSignal(false);
  const saved = useSignal(false);
  const customAllergy = useSignal("");
  const p = profile.value;

  const handleToggleDiet = (diet) => {
    const current = p.dietaryRestrictions || [];
    const next = current.includes(diet) ? current.filter((d) => d !== diet) : [...current, diet];
    updateProfile({ dietaryRestrictions: next });
  };

  const handleToggleAllergy = (allergy) => {
    const current = p.allergies || [];
    const next = current.includes(allergy)
      ? current.filter((a) => a !== allergy)
      : [...current, allergy];
    updateProfile({ allergies: next });
  };

  const handleToggleAppliance = (appliance) => {
    const current = p.appliances || [];
    const next = current.includes(appliance)
      ? current.filter((a) => a !== appliance)
      : [...current, appliance];
    updateProfile({ appliances: next });
  };

  const handleSave = () => {
    saved.value = true;
    setTimeout(() => (saved.value = false), 2000);
  };

  return (
    <div class="max-w-2xl mx-auto px-6 py-8">
      <h2 class="font-headline text-4xl md:text-5xl text-primary font-bold mb-2">Profile</h2>
      <p class="text-on-surface-variant mb-10">
        Customize your kitchen experience. Your preferences help AI Chef tailor recipes just for
        you.
      </p>

      <section class="bg-surface-container-low p-8 rounded-[2rem] mb-8">
        <h3 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="person" class="text-primary" />
          Personal Info
        </h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-on-surface-variant mb-1 block">Name</label>
            <input
              class="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Your name"
              value={p.name}
              onInput={(e) => updateProfile({ name: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-on-surface-variant mb-1 block">
              Default Serving Size
            </label>
            <div class="flex items-center gap-4">
              <button
                onClick={() => updateProfile({ servingSize: Math.max(1, (p.servingSize || 2) - 1) })}
                class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Icon name="remove" />
              </button>
              <span class="text-2xl font-bold w-8 text-center">{p.servingSize || 2}</span>
              <button
                onClick={() => updateProfile({ servingSize: (p.servingSize || 2) + 1 })}
                class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Icon name="add" />
              </button>
            </div>
          </div>
          <div>
            <label class="text-sm font-semibold text-on-surface-variant mb-1 block">
              Cooking Skill Level
            </label>
            <div class="flex gap-3">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <ToggleChip
                  key={level}
                  label={level.charAt(0).toUpperCase() + level.slice(1)}
                  active={p.skillLevel === level}
                  onClick={() => updateProfile({ skillLevel: level })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="bg-surface-container-low p-8 rounded-[2rem] mb-8">
        <h3 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="eco" class="text-primary" />
          Dietary Restrictions
        </h3>
        <div class="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((diet) => (
            <ToggleChip
              key={diet}
              label={diet}
              active={(p.dietaryRestrictions || []).includes(diet)}
              onClick={() => handleToggleDiet(diet)}
            />
          ))}
        </div>
      </section>

      <section class="bg-surface-container-low p-8 rounded-[2rem] mb-8">
        <h3 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="warning" class="text-tertiary" />
          Allergies
        </h3>
        <div class="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map((allergy) => (
            <ToggleChip
              key={allergy}
              label={allergy}
              active={(p.allergies || []).includes(allergy)}
              onClick={() => handleToggleAllergy(allergy)}
            />
          ))}
          {(p.allergies || []).filter((a) => !ALLERGY_OPTIONS.includes(a)).map((custom) => (
            <ToggleChip
              key={custom}
              label={custom}
              active={true}
              onClick={() => handleToggleAllergy(custom)}
            />
          ))}
        </div>
        <div class="flex items-center gap-2 mt-4">
          <input
            class="flex-grow bg-surface-container-lowest border-none rounded-xl px-4 py-2.5 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Add a custom allergy..."
            value={customAllergy.value}
            onInput={(e) => (customAllergy.value = e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = customAllergy.value.trim();
                if (val && !(p.allergies || []).includes(val)) {
                  updateProfile({ allergies: [...(p.allergies || []), val] });
                }
                customAllergy.value = "";
              }
            }}
          />
          <button
            onClick={() => {
              const val = customAllergy.value.trim();
              if (val && !(p.allergies || []).includes(val)) {
                updateProfile({ allergies: [...(p.allergies || []), val] });
              }
              customAllergy.value = "";
            }}
            class="px-4 py-2.5 rounded-xl bg-surface-container-high text-primary font-semibold text-sm hover:bg-surface-container-highest transition-colors"
          >
            Add
          </button>
        </div>
      </section>

      <section class="bg-surface-container-low p-8 rounded-[2rem] mb-8">
        <h3 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="kitchen" class="text-primary" />
          Kitchen Appliances
        </h3>
        <p class="text-sm text-on-surface-variant mb-4">
          Select the appliances you have so AI Chef can suggest recipes that use them.
        </p>
        <div class="flex flex-wrap gap-2">
          {APPLIANCE_OPTIONS.map((appliance) => (
            <ToggleChip
              key={appliance}
              label={appliance}
              active={(p.appliances || []).includes(appliance)}
              onClick={() => handleToggleAppliance(appliance)}
            />
          ))}
        </div>
      </section>

      <section class="bg-surface-container-low p-8 rounded-[2rem] mb-8">
        <h3 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="smart_toy" class="text-primary" />
          AI Configuration
        </h3>
        <div class="space-y-6">
          <div>
            <label class="text-sm font-semibold text-on-surface-variant mb-1 block">OpenAI API Key</label>
            <p class="text-xs text-on-surface-variant mb-3">
              Used for AI Chef chat and recipe image generation.
            </p>
            <div class="flex items-center gap-2">
              <div class="flex-grow relative">
                <input
                  class="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 pr-12 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                  placeholder="sk-..."
                  type={showKey.value ? "text" : "password"}
                  value={p.apiKey}
                  onInput={(e) => updateProfile({ apiKey: e.currentTarget.value })}
                />
                <button
                  onClick={() => (showKey.value = !showKey.value)}
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  <Icon name={showKey.value ? "visibility_off" : "visibility"} class="text-xl" />
                </button>
              </div>
            </div>
            <p class="text-xs text-on-surface-variant mt-2">
              Stored locally in your browser. Never sent to our servers.
            </p>
          </div>
        </div>
      </section>

      {saved.value && (
        <div class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce z-50">
          <Icon name="check_circle" filled />
          Settings saved!
        </div>
      )}
    </div>
  );
}
