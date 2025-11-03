# Gyohwan Architecture Guide

Complete architecture documentation for the Gyohwan (교환닷컴) codebase.

> 💡 **Quick Reference**: See [CLAUDE.md](../CLAUDE.md) for essential development rules.

---

## Tech Stack Details

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0  
- **Language**: TypeScript ^5 (strict mode)
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS v4 + PostCSS
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **API Mocking**: MSW (Mock Service Worker) ^2.11.6
- **Code Formatting**: Prettier ^3.6.2 with Tailwind plugin
- **Package Manager**: pnpm
- **Build Tool**: Next.js with Turbopack enabled

---

## Directory Structure

For complete directory tree, see CLAUDE.md. Key folders:

### `/app` - Next.js App Router
- File-based routing
- Dynamic routes: `[seasonId]`, `[applicationId]`, etc.
- Server Components by default

### `/components` - React Components (69 total)
**Organization by feature**:
- `common/` - Reusable UI (9 components)
- `auth/` - Authentication UI
- `application/` - Application forms
- `strategy-room/` - Strategy room features  
- `icons/` - SVG icons (19 components)

### `/lib` - Business Logic
- `/api` - API client layer (7 modules)
- `/oauth` - OAuth configuration
- `/utils` - Helper functions

### `/stores` - Zustand State
- `authStore.ts` - Global auth state

### `/types` - TypeScript Definitions (6 files)
- Type-safe interfaces for all entities

### `/mocks` - MSW Setup
- `/handlers` - API request handlers
- `/data` - Mock data for development

---

## Key Architectural Patterns

### 1. App Router (Next.js 15)
- Modern App Router with file-based routing
- Server Components by default
- Dynamic routes: `[paramName]`
- Root layout: `app/layout.tsx`

### 2. State Management (Zustand)
**Single store pattern**:
```typescript
// stores/authStore.ts
useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  fetchUser: async () => { ... },
  setUser: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}))
```

**Auto-initialization**: Store calls `fetchUser()` on app startup.

### 3. API Layer Architecture
**Modular by domain**:
- `lib/api/auth.ts` - Authentication
- `lib/api/user.ts` - User profile
- `lib/api/season.ts` - Exchange seasons
- `lib/api/slot.ts` - University slots
- `lib/api/application.ts` - Applications
- `lib/api/gpa.ts` - GPA management
- `lib/api/language.ts` - Language scores

**Pattern**:
```typescript
export const getUserMe = async (): Promise<User> => {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/v1/users/me`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error(...);
  return await response.json();
};
```

### 4. Component Organization
**Feature-based structure**:
- Components grouped by feature (auth, home, application)
- Shared components in `common/`
- Icons wrapped as React components
- One component per file

### 5. Type Safety
**Strict TypeScript**:
- All API responses typed
- Interfaces for component props
- Types align with backend contracts
- No `any` types allowed

### 6. Styling Strategy
**Tailwind CSS v4**:
- `@import` directives in `globals.css`
- CSS custom properties for theming
- Custom utility classes (`.btn-primary`, `.btn-secondary`)
- Mobile-first with max-width: 430px

### 7. Authentication Flow
**Multiple auth methods**:
- Email/password (BASIC)
- OAuth (Google, Kakao)

**Session-based**:
- Tokens in HTTP-only cookies
- `credentials: 'include'` in all API calls
- Auto-login via `authStore.fetchUser()`

### 8. MSW (Mock Service Worker)
**Development-only mocking**:
- Controlled by `NEXT_PUBLIC_ENABLE_MSW` env var
- Browser + Server modes
- 23 API endpoints mocked
- 40+ error test cases

### 9. SEO & Performance
- Structured data (JSON-LD)
- Dynamic metadata
- `robots.txt` & `sitemap.xml` auto-generated
- Image optimization via `next/image`
- Skeleton loading states
- On-demand revalidation

---

## Server/Client Component Pattern

**Core pattern**: Server fetches data, Client handles interactions.

**Example**:
```typescript
// app/strategy-room/[seasonId]/page.tsx (Server)
export default async function Page({ params }) {
  const data = await fetchData((await params).seasonId);
  return <ClientComponent data={data} />;
}

// components/StrategyRoomClient.tsx (Client)
"use client";
export default function ClientComponent({ data }) {
  const [filter, setFilter] = useState("");
  // Interactive UI logic
}
```

**Benefits**:
- ✅ Fast initial load (server-side)
- ✅ SEO-friendly
- ✅ Smaller JS bundle
- ✅ Interactivity where needed

---

## Data Types & API Contracts

### Core Entities

**User**:
```typescript
interface User {
  userId: number;
  email: string | null;
  schoolEmail: string | null;
  nickname: string;
  domesticUniversity: string | null;
  schoolVerified: boolean;
  loginType: 'BASIC' | 'SOCIAL';
  socialType: string | null;
  profileUrl?: string | null;
}
```

**Season**:
```typescript
interface Season {
  seasonId: number;
  domesticUniversity: string;
  domesticUniversityLogoUri: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  hasApplied: boolean;
}
```

**Slot**:
```typescript
interface Slot {
  slotId: number;
  name: string;
  country: string;
  choiceCount: number;
  slotCount: string;
  duration: string;
  logoImageUrl?: string | null;
}
```

**Application**:
```typescript
interface SubmitApplicationRequest {
  extraScore: number;
  gpaId: number;
  languageId: number;
  choices: ApplicationChoice[]; // Up to 5 ranked choices
}
```

For complete type definitions, see `types/` directory.

---

## Important Features

### Drag & Drop (@dnd-kit)
- Accessible drag-and-drop for university ranking
- Mouse, touch, and keyboard support
- Used in `UniversitySelectionStep.tsx`

### Multi-Step Forms
- Progressive disclosure pattern
- Auth: email → password → verification → terms
- Applications: grade → language → university selection

### Modal Patterns
- `BaseModal`: Base modal wrapper
- `ConfirmModal`: Generic confirmation dialog
- `UniversitySearchModal`: Searchable university list

### Image Handling
- `SchoolLogoWithFallback`: Graceful fallback
- `CountryFlag`: Cross-platform SVG flags (Windows-compatible)

### OAuth State Management
- CSRF protection via state parameter
- State stored in sessionStorage
- Separate config per provider

### MSW Integration
**Full API mocking for development**:
- 23 endpoints mocked
- Realistic error scenarios
- Browser + SSR support
- Test account: `test@example.com` / `password123456`

---

## Page Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/` | Home/landing | No |
| `/community` | Community page | No |
| `/log-in/password` | Email login | No |
| `/create-account/password` | Email signup | No |
| `/auth/[provider]/callback` | OAuth callback | No |
| `/school-verification` | Email verification | Yes |
| `/strategy-room/[seasonId]` | Season overview | Yes |
| `/strategy-room/[seasonId]/applications/new` | New application | Yes |
| `/strategy-room/[seasonId]/slots/[slotId]` | Slot details | Yes |
| `/my-page` | User profile | Yes |

**API Routes**:
- `/api/revalidate` - On-demand revalidation (POST)

---

## Build & Development

```bash
pnpm dev           # Start dev server (localhost:3000)
pnpm build         # Production build with Turbopack
pnpm start         # Run production server
pnpm lint          # Run ESLint
```

**Features**:
- Turbopack for faster builds
- Fast Refresh (HMR)
- Strict TypeScript mode
- ESLint with Next.js config

---

## Git Workflow

**Branches**:
- `main` - Production
- `dev` - Development
- `test` - Testing
- `feat/*` - Feature branches

**Deployment**:
- `main` and `test` auto-deploy to Vercel

---

## Environment Variables

```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=<url>

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<id>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=<url>
NEXT_PUBLIC_KAKAO_CLIENT_ID=<id>
NEXT_PUBLIC_KAKAO_REDIRECT_URI=<url>

# MSW (Dev only)
NEXT_PUBLIC_ENABLE_MSW=true|false

# Analytics
NEXT_PUBLIC_GA_ID=<id>

# Revalidation
REVALIDATE_SECRET=<secret>
```

---

**For detailed development guides and best practices, see [development-guide.md](development-guide.md).**
