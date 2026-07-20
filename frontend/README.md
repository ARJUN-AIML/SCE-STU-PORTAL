# SIH Campus Fresher Portal — Frontend

A real, working React + TypeScript rebuild of the Campus Fresher Portal dashboard, built with:

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-variable theming: Classic / Carbon / Forest)
- **Framer Motion** for entrance/chat animations
- **shadcn/ui**-style primitives (Button, Card, Tabs, Dropdown, Dialog, Badge, Avatar, Input) on **Radix UI**
- **TanStack Query** — powers the AI Campus Assistant's chat mutation
- **React Hook Form + Zod** — validated event/club registration form

## What's implemented

- **Sidebar** navigation (Dashboard, Events, Clubs, Faculty, Map, Settings)
- **Top bar**: live search, Support button, working **Multilanguage** dropdown (EN/ES/FR/HI/ZH — re-labels the UI) and **Themes** dropdown (Classic Light / Carbon Dark / Forest Green — re-skins the whole app via CSS variables, persisted to localStorage)
- **Your Schedule & Notices**: weekly grid rebuilt from the screenshot's Mon–Sat layout with color-coded class/meeting badges
- **AI Campus Assistant**: real chat UI wired to `@tanstack/react-query`'s `useMutation`, with quick-prompt chips, typing indicator, and a small mock reply engine (swap `fakeAiRequest` in `src/lib/ai-mock.ts` for a real Gemini/Claude API call)
- **Clubs & Events**: tabbed list with a working **Register** flow — opens a Zod-validated form (name, email, roll number, notes) and flips the row to "Registered" on submit
- **Resources & Uploads**: drag-and-drop + click-to-upload file list, newly added files render immediately

## Run it

```bash
npm install
npm run dev       # https://sce-stu-portal.vercel.app
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Wiring in a real AI backend

Replace the body of `fakeAiRequest` in `src/lib/ai-mock.ts` with a fetch to your actual endpoint (e.g. Gemini API) — the `useMutation` call in `src/components/ai-assistant-card.tsx` doesn't need to change.

## Project structure

```
src/
  components/ui/       shadcn-style primitives
  components/          feature components (sidebar, topbar, schedule, ai chat, clubs/events, resources)
  context/              theme + language provider
  data/                 mock schedule/clubs/events/resources + i18n dictionaries
  lib/                  cn() helper, mock AI client
  types/                shared TS types
```
