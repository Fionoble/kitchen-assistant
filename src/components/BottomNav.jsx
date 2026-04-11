import { useLocation } from "preact-iso";
import { Icon } from "./Icon.jsx";

const tabs = [
  { href: "/", icon: "explore", label: "Discover" },
  { href: "/library", icon: "menu_book", label: "Library" },
  { href: "/chef", icon: "auto_awesome", label: "AI Chef" },
  { href: "/meal-plans", icon: "calendar_month", label: "Plans" },
  { href: "/profile", icon: "person", label: "Profile" },
];

export function BottomNav() {
  const { path } = useLocation();

  return (
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md rounded-t-3xl shadow-[0px_-4px_20px_rgba(21,66,18,0.05)]">
      <div class="flex justify-around items-center px-4 pb-6 pt-3">
        {tabs.map((tab) => {
          const active = path === tab.href;
          return (
            <a
              key={tab.href}
              href={tab.href}
              class={`flex flex-col items-center justify-center px-4 py-2 no-underline transition-all active:scale-90 duration-200 ${
                active
                  ? "bg-primary/10 text-primary rounded-xl"
                  : "text-on-surface-variant"
              }`}
            >
              <Icon name={tab.icon} filled={active} />
              <span class="text-[11px] font-semibold mt-0.5">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
