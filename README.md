# DevSync — AI-Powered Code Review Platform

![DevSync](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)

**Live Demo → [devsync-ashy.vercel.app](https://devsync-ashy.vercel.app)**

DevSync is a full-stack, real-time collaborative code editor with AI-powered code review. Write code in a VS Code-like editor, get instant feedback from Claude AI on bugs, complexity, and improvements — and collaborate live with your team.

---

## Features

- **AI Code Review** — Powered by Claude. Detects bugs, suggests improvements, and analyzes time/space complexity in seconds
- **Real-Time Collaboration** — Multiple users can join the same session and see live presence indicators via Liveblocks
- **Monaco Editor** — The same engine that powers VS Code, embedded in the browser with full syntax highlighting
- **10+ Languages** — JavaScript, TypeScript, Python, Java, C++, Rust, Go, HTML, CSS, JSON
- **Auto-Save** — Code saves automatically after 2 seconds of inactivity, with manual save and Ctrl+S support
- **Session Management** — Create, organize, and revisit coding sessions from your personal dashboard
- **Shareable Links** — Share any session via URL — guests can view without an account
- **Fully Responsive** — Tab-based mobile layout with full desktop side-by-side view
- **Authentication** — Secure email/password auth with Supabase, protected routes via proxy middleware

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Anthropic Claude API |
| Real-time | Liveblocks |
| Editor | Monaco Editor (@monaco-editor/react) |
| Deployment | Vercel |

---

## Architecture

devsync/
├── app/
│   ├── (auth)/              # Login & signup pages
│   ├── dashboard/           # Session management
│   ├── session/[id]/        # Live editor page
│   └── api/
│       ├── review/          # AI code review endpoint
│       ├── session/         # Session CRUD
│       ├── liveblocks-auth/ # Real-time auth
│       └── auth/signout/    # Sign out
├── components/
│   ├── Editor.tsx           # Monaco editor wrapper
│   ├── AIPanel.tsx          # AI review results sidebar
│   ├── Toolbar.tsx          # Language switcher + actions
│   ├── Presence.tsx         # Live user avatars
│   └── Room.tsx             # Liveblocks room provider
├── lib/
│   ├── supabase.ts          # Browser Supabase client
│   ├── supabase-server.ts   # Server Supabase client
│   ├── claude.ts            # AI review function
│   └── liveblocks.ts        # Real-time config
└── types/
└── index.ts             # Shared TypeScript types

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- An [Anthropic](https://console.anthropic.com) API key
- A [Liveblocks](https://liveblocks.io) account

### 1. Clone the repository

```bash
git clone https://github.com/AK-Michael/devsync.git
cd devsync
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up the database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create the required tables, policies, and triggers.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Implementation Details

### Server vs Client Components
The dashboard uses Next.js Server Components to fetch data directly from Supabase on the server — no loading spinners, no useEffect, data arrives pre-rendered. Client Components are used only where interactivity is needed.

### Row Level Security
All database tables have Supabase RLS policies enabled. Users can only read/write their own sessions. Public sessions are readable by anyone without authentication.

### Debounced Auto-Save
The editor debounces saves with a 2-second delay — each keystroke resets the timer, and the database write only happens when the user stops typing. This prevents hundreds of unnecessary DB writes per session.

### AI Structured Output
Claude is prompted to return strict JSON matching our `AIReview` type. The prompt includes the exact schema, field constraints, and severity levels — ensuring consistent, parseable responses every time.

### Real-Time Presence
Liveblocks manages WebSocket connections for live presence. Each user gets a unique color assigned at auth time. The `Presence` component renders avatar bubbles that appear/disappear as users join and leave sessions.

---

## Screenshots

> Add screenshots here after recording your demo

---

## Roadmap

- [ ] Real-time collaborative editing (shared cursor + code sync)
- [ ] AI chat sidebar for follow-up questions
- [ ] Code execution in sandboxed environment
- [ ] Export AI review as PDF report
- [ ] GitHub Gist import/export
- [ ] Team workspaces

---

## 👨Author

**Michael Korshie Agbomadzi** — [@AK-Michael](https://github.com/AK-Michael)

Built with Next.js, Supabase, Claude AI, and Liveblocks.

---

## License

MIT License — feel free to use this project as a reference or starting point.