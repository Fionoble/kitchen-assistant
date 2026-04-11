import { useLocation } from "preact-iso";
import { Icon } from "./Icon.jsx";

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/library", label: "Library" },
  { href: "/chef", label: "AI Chef" },
  { href: "/meal-plans", label: "Meal Plans" },
];

export function Header() {
  const { path } = useLocation();

  return (
    <header class="w-full top-0 sticky z-50 bg-surface">
      <div class="flex justify-between items-center px-6 py-4 max-w-screen-xl mx-auto">
        <a href="/" class="flex items-center gap-3 no-underline">
          <Icon name="restaurant_menu" class="text-primary" />
          <h1 class="font-headline text-2xl font-bold italic text-primary">
            Kitchen Assistant
          </h1>
        </a>
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class={`font-semibold transition-opacity hover:opacity-80 no-underline ${
                  path === link.href
                    ? "text-primary font-bold"
                    : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="/profile"
            class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center"
          >
            <Icon name="person" class="text-on-primary-container" />
          </a>
        </div>
      </div>
    </header>
  );
}
