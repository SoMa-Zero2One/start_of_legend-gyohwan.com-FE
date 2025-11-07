# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 📚 **Detailed Documentation**: For architecture details, see [docs/architecture.md](docs/architecture.md). For advanced guides, see [docs/development-guide.md](docs/development-guide.md).

---

## 🎯 Quick Overview

**Gyohwan (교환닷컴)** is a Next.js 15 web application for exchange student program management.

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **State**: Zustand
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm (NEVER npm/yarn!)
- **Max Width**: 430px (mobile-first)

---

## ⚡ Essential Rules (READ FIRST!)

### 0. Communication & Decision Making (MOST IMPORTANT!)

**ALWAYS ask questions when uncertain:**
- ❓ **UI/Design**: Don't assume layouts, colors, or component styles - ask for clarification
- ❓ **Architecture**: If multiple approaches exist, explain options and ask which to use
- ❓ **Requirements**: If user intent is unclear, ask before implementing
- ❓ **Edge cases**: When handling special cases, confirm expected behavior

**ALWAYS explain your changes:**
- 🎯 **Usage**: Where and how will this code be used? What calls it?
- 📝 **What**: Clearly state what you're changing
- 🤔 **Why**: Explain the reasoning behind the change
- 💡 **Alternatives**: Mention other options considered (if any)

**Examples:**
```
❌ BAD: "I'll add a helper function transformData()."
✅ GOOD: "I'll add transformData() helper function:
   USAGE: Called by CountryContent when processing API responses
   WHAT: Function that converts API fieldId to displayOrder
   WHY:
   - Centralizes field mapping logic (DRY principle)
   - Easier to test in isolation
   - Reusable for UniversityContent later
   ALTERNATIVES:
   - Inline transformation (rejected: duplicates code)
   - Use library like lodash (rejected: unnecessary dependency)"

❌ BAD: "Adding a new type interface."
✅ GOOD: "I'll add UniversityFieldMetadata interface:
   USAGE: Used by universityFields.ts metadata and UniversityTable props
   WHAT: TypeScript interface defining university field structure
   WHY:
   - Type safety for field configuration
   - IntelliSense support in IDE
   - Matches CountryFieldMetadata pattern for consistency
   ALTERNATIVES:
   - Use type alias (rejected: interface allows extension)
   - Reuse CountryFieldMetadata (rejected: different field sets)"
```

**Purpose of this rule:**
Prevents "where is this used?" and "why did we add this?" confusion later. Clear usage context helps maintainability and code review.

### 1. Package Manager
```bash
# ✅ ALWAYS use pnpm
pnpm install
pnpm dev
pnpm build

# ❌ NEVER use npm or yarn
```

### 2. Before Committing
```bash
# MUST run build before every commit!
pnpm build  # ← REQUIRED
pnpm lint   # Check for errors

# Then commit
git add .
git commit -m "feat: 기능 설명"
```

### 3. Git Branch Flow
- Work on `feat/*` or `fix/*` branches
- Merge to `dev` first (NOT `main`)
- `main` is for production only

### 4. Component Rules
- **Default**: Server Components (faster!)
- **Only use `'use client'` when**:
  - Using React hooks (useState, useEffect)
  - Event handlers (onClick, onChange)
  - Browser APIs (window, localStorage)

### 5. Button Styling (IMPORTANT!)
```tsx
// ✅ ALWAYS add cursor-pointer to buttons!
<button className="cursor-pointer ...">클릭</button>

// ❌ Missing cursor-pointer shows default cursor
<button className="...">클릭</button>
```
**Why**: Tailwind CSS resets remove default button cursor.

---

## 📂 Project Structure (Key Folders)

```
gyohwan/
├── app/                    # Next.js pages (App Router)
├── components/             # React components (69 total)
│   ├── common/            # Reusable UI (Tabs, Modal, etc.)
│   ├── auth/              # Auth components
│   └── icons/             # SVG icon components (19 total)
├── lib/
│   ├── api/               # API clients (auth, user, season, etc.)
│   └── utils/             # Helper functions
├── stores/                # Zustand state (authStore.ts)
├── types/                 # TypeScript type definitions
├── mocks/                 # MSW mock data (dev only)
└── public/                # Static assets
```

---

## 🔑 Core Patterns

### API Calls
```typescript
import { getBackendUrl } from "@/lib/utils/api";

export const myApi = async (): Promise<ResponseType> => {
  const backendUrl = getBackendUrl();

  const response = await fetch(`${backendUrl}/v1/endpoint`, {
    credentials: "include",  // ✅ REQUIRED for cookies
  });

  return await response.json();
};
```

**Rules**:
- ✅ Use `getBackendUrl()` (never hardcode URLs)
- ✅ Include `credentials: "include"` (for session cookies)
- ✅ Handle errors with try-catch

### Component Props
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

### Styling
```tsx
// ✅ Tailwind first
<div className="flex items-center gap-4 px-[20px]">

// ✅ Use custom utilities when needed
<button className="btn-primary">Submit</button>

// ❌ Avoid inline styles
<div style={{ padding: '20px' }}>
```

**Available Custom Classes**:
- `.btn-primary` - Blue CTA button
- `.btn-secondary` - Black button
- `.animate-shake` - Shake animation

---

## 🎨 Styling Guidelines

### Button Pattern
```tsx
// ✅ Complete button example
<button
  className="btn-primary cursor-pointer body-1 w-full rounded-[4px] py-[12px]"
  onClick={handleClick}
>
  클릭
</button>
```

### Touch Targets (Mobile)
```tsx
// ✅ Minimum 44px for touch targets
<button className="min-h-[44px] min-w-[44px] cursor-pointer">
  Icon
</button>
```

### Container Pattern
```tsx
// ✅ Standard container
<div className="mx-auto w-full max-w-[430px] px-[20px]">
  {/* All content here */}
</div>
```

---

## 🚨 Common Pitfalls

### ❌ Pitfall 1: Import Paths
```typescript
// ❌ BAD - Relative import hell
import { User } from "../../../types/user";

// ✅ GOOD - Use path alias
import { User } from "@/types/user";
```

### ❌ Pitfall 2: Missing credentials
```typescript
// ❌ BAD - Session cookies won't be sent
fetch(`${backendUrl}/api`);

// ✅ GOOD - Include credentials
fetch(`${backendUrl}/api`, { credentials: "include" });
```

### ❌ Pitfall 3: Unnecessary 'use client'
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

### ❌ Pitfall 4: Next.js 15 Dynamic Params
```typescript
// ❌ OLD Next.js pattern
export default function Page({ params }) {
  const id = params.id; // Error in Next.js 15!
}

// ✅ GOOD - Next.js 15 requires await
export default async function Page({ params }) {
  const id = (await params).id;
}
```

---

## 🔄 Development Workflow

### Daily Routine
```bash
# Morning: Get latest changes
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feat/your-feature

# Work... then before commit:
pnpm build  # ← MUST pass!
git add .
git commit -m "feat: 기능 설명"
git push origin feat/your-feature

# Create PR: feat/your-feature → dev
```

### Commit Message Format
```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경
docs: 문서 수정
chore: 기타 작업
```

---

## 🛠️ Debugging Tips

### TypeScript Errors
```bash
pnpm build  # Check all errors
```

### API Not Working
```bash
# 1. Check if MSW is enabled
cat .env.local | grep ENABLE_MSW

# 2. Check browser console for "[MSW] Mocking enabled"

# 3. Check if endpoint is mocked
grep -r "your-endpoint" mocks/handlers/
```

### Build Failing
```bash
# Clear cache and rebuild
rm -rf .next
pnpm install
pnpm build
```

---

## 📚 Detailed Documentation

For more detailed information, see:
- **[Architecture Guide](docs/architecture.md)** - Tech stack, directory structure, patterns
- **[Development Guide](docs/development-guide.md)** - Advanced patterns, examples, best practices

---

## 🔗 Quick Reference

| Topic | Location |
|-------|----------|
| API Clients | `lib/api/` |
| Components | `components/` |
| Types | `types/` |
| State | `stores/authStore.ts` |
| Mock Data | `mocks/data/` |
| Icons | `components/icons/` |
| Common UI | `components/common/` |

---

## ⚙️ Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=<backend-api-url>
NEXT_PUBLIC_ENABLE_MSW=true  # Enable mock API
NEXT_PUBLIC_GA_ID=<google-analytics-id>
```

---

**Last Updated**: 2025-01-03

**Note**: This is a condensed version. For comprehensive documentation, refer to the docs folder.
