# Cooking Buddy

A PWA kitchen assistant that helps you create meals with AI, save recipes, build meal plans, and share your creations.

**Live:** [cooking-buddy.fio.dev](https://cooking-buddy.fio.dev)

## Features

- **AI Chef** — Chat with an AI sous chef to generate recipes from ingredients you have on hand, dietary needs, or whatever you're in the mood for
- **Recipe Library** — Save, favorite, search, and filter your recipe collection
- **Meal Plans** — Organize your week by assigning recipes to days and meals
- **Image Generation** — Recipes automatically get AI-generated food photography when saved
- **Profile** — Set dietary restrictions, allergies (including custom), kitchen appliances, and serving size preferences so AI Chef tailors suggestions to you
- **Sharing** — Share recipes via native share or clipboard

## Tech Stack

- [Preact](https://preactjs.com/) + [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [preact-iso](https://github.com/preactjs/preact-iso) for routing
- [OpenAI API](https://platform.openai.com/) for chat (GPT-4o-mini) and image generation (gpt-image-1)
- IndexedDB for image storage, localStorage for app state

## Getting Started

```bash
pnpm install
pnpm dev
```

Set your OpenAI API key in the Profile page to enable AI Chef and recipe image generation.

## Building

```bash
pnpm build
pnpm preview
```

## Design

The visual design follows the "Digital Epicurean" design system — an editorial, magazine-inspired aesthetic with a cream and forest green palette, Noto Serif + Plus Jakarta Sans typography, and organic component shapes. See `designs/` for reference mockups.
