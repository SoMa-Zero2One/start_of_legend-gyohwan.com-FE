# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 📚 **Detailed Documentation**: For architecture details, see [docs/architecture.md](docs/architecture.md). For development workflows, see [docs/development-guide.md](docs/development-guide.md).

---

## 🎯 Project Overview

**Gyohwan (교환닷컴)** is a Next.js 15 exchange student program management platform.

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **State**: Zustand 5.0.8
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm (NEVER npm/yarn!)
- **Build Tool**: Turbopack
- **Max Width**: 430px (mobile-first design)

---

## ⚡ Essential Rules

### 0. Communication & Decision Making (CRITICAL!)

**ALWAYS ask questions when uncertain:**
- ❓ **UI/Design**: Don't assume layouts, colors, or component styles
- ❓ **Architecture**: If multiple approaches exist, explain options and ask
- ❓ **Requirements**: If user intent is unclear, ask before implementing
- ❓ **Edge cases**: Confirm expected behavior for special cases

**ALWAYS explain your changes:**
- 🎯 **Usage**: Where and how will this code be used? What calls it?
- 📝 **What**: Clearly state what you're changing
- 🤔 **Why**: Explain the reasoning behind the change
- 💡 **Alternatives**: Mention other options considered (if any)

**Example:**
```
✅ GOOD: "I'll add transformData() helper function:
   USAGE: Called by CountryContent when processing API responses
   WHAT: Converts API fieldId to displayOrder
   WHY: Centralizes field mapping logic, easier to test, reusable
   ALTERNATIVES: Inline transformation (rejected: code duplication)"

❌ BAD: "I'll add a helper function transformData()."
```

### 1. Package Manager
```bash
# ✅ ALWAYS use pnpm
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm lint

# ❌ NEVER use npm or yarn
```

### 2. Before Committing
```bash
# MUST run build before every commit!
pnpm build  # ← REQUIRED - catches TypeScript/build errors
pnpm lint   # Check for linting errors

# Then commit
git add .
git commit -m "feat: 기능 설명"
```

### 3. Git Branch Flow
```
feat/* or fix/* → dev → test → main
```
- Work on `feat/*` or `fix/*` branches
- Merge to `dev` first (NOT `main`)
- `main` is for production only
- Hotfixes go directly to `main` then sync to `dev`

### 4. Component Rules
- **Default**: Server Components (faster, SEO-friendly)
- **Only use `'use client'` when**:
  - Using React hooks (useState, useEffect, useRef)
  - Event handlers (onClick, onChange)
  - Browser APIs (window, localStorage, document)
  - Third-party libraries that require client-side (drag-and-drop, etc.)

### 5. Button Styling (IMPORTANT!)
```tsx
// ✅ ALWAYS add cursor-pointer to buttons!
<button className="cursor-pointer ...">클릭</button>

// ❌ Missing cursor-pointer shows default cursor
<button className="...">클릭</button>
```
**Why**: Tailwind CSS resets remove default button cursor.

---

## 📂 Key Architecture Patterns

### 1. Server/Client Component Split Pattern

**Core Pattern**: Server fetches data, Client handles interactions.

**Server Component** (app/strategy-room/[seasonId]/page.tsx):
```typescript
export default async function Page({ params }: Props) {
  const seasonId = (await params).seasonId;  // ← Next.js 15: await params

  // ✅ Server-side data fetching (fast, SEO-friendly)
  const slots = await getSeasonSlots(seasonId);

  return <StrategyRoomClient slots={slots} />;
}
```

**Client Component** (components/strategy-room/StrategyRoomClient.tsx):
```typescript
"use client";

export default function StrategyRoomClient({ slots }: Props) {
  const [filter, setFilter] = useState("");

  // ✅ Client-side interactivity
  return <input onChange={(e) => setFilter(e.target.value)} />;
}
```

### 2. API Call Pattern

```typescript
import { getBackendUrl } from "@/lib/utils/api";

export const getUserMe = async (): Promise<User> => {
  const backendUrl = getBackendUrl();  // ← Never hardcode URLs

  const response = await fetch(`${backendUrl}/v1/users/me`, {
    credentials: "include",  // ← REQUIRED for session cookies
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return await response.json();
};
```

**Rules**:
- ✅ Use `getBackendUrl()` (handles dev/test/prod environments)
- ✅ Include `credentials: "include"` (for session cookies)
- ✅ Use TypeScript return types
- ✅ Export named functions (not default)

### 3. Component Props Pattern

```typescript
// ✅ ALWAYS use interface (NOT type)
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return <button onClick={onClick}>{title}</button>;
}
```

### 4. Import Path Pattern

```typescript
// ✅ ALWAYS use path alias @/*
import { User } from "@/types/user";
import CTAButton from "@/components/common/CTAButton";

// ❌ NEVER use relative imports
import { User } from "../../../types/user";
```

---

## 🎨 Common Styling Patterns

### Container (Mobile-First)
```tsx
<div className="mx-auto w-full max-w-[430px] px-[20px]">
  {/* All content here */}
</div>
```

### Button (Primary)
```tsx
<button className="btn-primary body-1 w-full cursor-pointer rounded-[4px] p-[12px]">
  클릭
</button>
```

### Button (Secondary)
```tsx
<button className="btn-secondary body-1 w-full cursor-pointer rounded-[4px] p-[12px]">
  취소
</button>
```

### Touch Targets (Mobile)
```tsx
<button className="min-h-[44px] min-w-[44px] cursor-pointer">
  Icon
</button>
```

### Typography
```tsx
<h1 className="heading-1">Main Title</h1>
<p className="body-1">Regular text</p>
<span className="caption-1">Small text</span>
```

---

## 🚨 Common Pitfalls

### ❌ Pitfall 1: Missing credentials in API calls
```typescript
// ❌ BAD - Session cookies won't be sent
fetch(`${backendUrl}/api`);

// ✅ GOOD
fetch(`${backendUrl}/api`, { credentials: "include" });
```

### ❌ Pitfall 2: Unnecessary 'use client'
```typescript
// ❌ BAD - Static component doesn't need 'use client'
"use client";
export default function StaticPage() {
  return <div>정적 컨텐츠</div>;
}

// ✅ GOOD - Server component (faster!)
export default function StaticPage() {
  return <div>정적 컨텐츠</div>;
}
```

### ❌ Pitfall 3: Next.js 15 Dynamic Params
```typescript
// ❌ BAD - Old Next.js pattern
export default function Page({ params }) {
  const id = params.id; // Error in Next.js 15!
}

// ✅ GOOD - Next.js 15 requires await
export default async function Page({ params }) {
  const id = (await params).id;
}
```

### ❌ Pitfall 4: Hardcoded backend URL
```typescript
// ❌ BAD
fetch("https://api.gyohwan.com/v1/users/me");

// ✅ GOOD
import { getBackendUrl } from "@/lib/utils/api";
const backendUrl = getBackendUrl();
fetch(`${backendUrl}/v1/users/me`);
```

### ❌ Pitfall 5: Relative import hell
```typescript
// ❌ BAD
import { User } from "../../../types/user";

// ✅ GOOD
import { User } from "@/types/user";
```

---

## 🔄 Development Workflow

### Daily Routine
```bash
# 1. Get latest changes
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feat/your-feature

# 3. Work... then before commit:
pnpm build  # ← MUST pass!
pnpm lint

# 4. Commit and push
git add .
git commit -m "feat: 기능 설명"
git push origin feat/your-feature

# 5. Create PR: feat/your-feature → dev
```

### Commit Message Format
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경
docs: 문서 수정
chore: 기타 작업
test: 테스트 추가/수정
```

### Hotfix Workflow (Critical Bugs Only)
```bash
# 1. Start from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix, test, commit
pnpm build
git commit -m "hotfix: 버그 설명"

# 3. PR to main, then sync to dev
git push origin hotfix/critical-bug
# After merge to main:
git checkout dev
git merge main
```

---

## 🧪 Testing

### Run Tests
```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
pnpm test:run      # Run once (CI mode)
```

### Test Strategy
- **Unit tests**: Utilities (`lib/utils/*`)
- **Integration tests**: API clients with MSW
- **E2E tests**: Playwright (planned)

See [docs/testing-strategy.md](docs/testing-strategy.md) for details.

---

## 🛠️ MSW (Mock Service Worker)

### Enable MSW
```bash
# .env.local
NEXT_PUBLIC_ENABLE_MSW=true
```

### Test Accounts
- Email: `test@example.com`
- Password: `password123456`
- Verification code: `123456`

### Debug MSW
```bash
# Check if enabled
cat .env.local | grep ENABLE_MSW

# Browser console should show:
# "[MSW] Mocking enabled"

# Check if endpoint is mocked
grep -r "your-endpoint" mocks/handlers/
```

See `mocks/README.md` for error test cases.

---

## 📂 Directory Structure

```
gyohwan/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components (69 total)
│   ├── common/           # Reusable UI (Tabs, Modal, etc.)
│   ├── auth/             # Auth components
│   ├── strategy-room/    # Strategy room features
│   ├── community/        # Community features
│   └── icons/            # SVG icons (39 total)
├── lib/
│   ├── api/              # API clients (auth, user, season, slot, etc.)
│   ├── utils/            # Helper functions
│   ├── oauth/            # OAuth configs (Google, Kakao)
│   └── constants/        # Constants
├── stores/               # Zustand state (authStore.ts)
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
├── mocks/                # MSW setup
│   ├── handlers/         # API request handlers
│   └── data/             # Mock data
├── docs/                 # Documentation
└── public/               # Static assets
```

---

## 🔑 Environment Variables

Required in `.env.local`:
```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=<backend-url>

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<id>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=<url>
NEXT_PUBLIC_KAKAO_CLIENT_ID=<id>
NEXT_PUBLIC_KAKAO_REDIRECT_URI=<url>

# MSW (dev only)
NEXT_PUBLIC_ENABLE_MSW=true

# Analytics
NEXT_PUBLIC_GA_ID=<id>

# Revalidation
REVALIDATE_SECRET=<secret>
```

---

## 📝 Naming Conventions

### Components
- Page components: `[Feature]Page.tsx`
- Client wrappers: `[Feature]Client.tsx`
- Modals: `[Feature]Modal.tsx`
- Skeletons: `[Component]Skeleton.tsx`
- Icons: `[Name]Icon.tsx`

### Files
- API clients: lowercase (e.g., `auth.ts`, `user.ts`)
- Types: lowercase (e.g., `user.ts`, `season.ts`)
- Utils: lowercase (e.g., `date.ts`, `api.ts`)

### Variables
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with suffix
  - Props: `[Component]Props`
  - Request: `[Feature]Request`
  - Response: `[Feature]Response`

---

## 🔗 Quick Reference

| Task | Location |
|------|----------|
| API Clients | `lib/api/` |
| Components | `components/` |
| Types | `types/` |
| State | `stores/authStore.ts` |
| Utils | `lib/utils/` |
| Mock Data | `mocks/data/` |
| Icons | `components/icons/` |

---

## 📚 Documentation

- **[Architecture Guide](docs/architecture.md)** - Detailed tech stack and patterns
- **[Development Guide](docs/development-guide.md)** - Advanced workflows and best practices
- **[Testing Strategy](docs/testing-strategy.md)** - Testing approach and roadmap
- **[Zustand Guide](docs/zustand-react-rendering.md)** - State management patterns

---

**Last Updated**: 2025-01-03
