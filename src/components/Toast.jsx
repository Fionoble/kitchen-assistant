import { toast } from "../stores/toast.js";
import { Icon } from "./Icon.jsx";

// Matches the "Settings saved!" feedback pill used on the Profile page.
export function Toast() {
  if (!toast.value) return null;
  return (
    <div class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce z-50 whitespace-nowrap">
      <Icon name="check_circle" filled />
      {toast.value}
    </div>
  );
}
