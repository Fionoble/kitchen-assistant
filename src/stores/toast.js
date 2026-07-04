import { signal } from "@preact/signals";

// Transient feedback message, rendered globally by <Toast /> in app.jsx.
export const toast = signal(null);

let timer;

export function showToast(message) {
  toast.value = message;
  clearTimeout(timer);
  timer = setTimeout(() => (toast.value = null), 2500);
}
