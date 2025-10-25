# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Gyohwan (교환닷컴) - Codebase Architecture Guide

## Overview

**Gyohwan** is a Next.js 15 web application designed to help exchange students manage university exchange program applications. It features a modern React 19 frontend with TypeScript, Zustand state management, and Tailwind CSS styling.

**Key Application Purpose**: The app allows students to browse exchange opportunities, register their academic credentials (GPA and language scores), and submit applications to multiple university exchange program slots with a 5-choice ranking system.

---

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **Language**: TypeScript 5.9.3
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS 4 + PostCSS
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Package Manager**: pnpm
- **Build Tool**: Next.js with Turbopack enabled

---

## Directory Structure

```
gyohwan/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page (landing/dashboard)
│   ├── globals.css              # Global styles
│   ├── styles/                  # Theme and typography
│   │   ├── colors.css          # Color theme variables
│   │   └── fonts.css           # Font definitions
│   ├── auth/                    # OAuth callback routes
│   │   ├── google/callback/page.tsx
│   │   └── kakao/callback/page.tsx
│   ├── log-in/                  # Login flows
│   ├── log-in-or-create-account/
│   ├── create-account/          # Signup flows
│   ├── school-verification/     # School email verification
│   ├── strategy-room/           # Main application feature
│   │   └── [seasonId]/         # Dynamic season routes
│   │       ├── page.tsx         # Season overview
│   │       ├── applications/    # Application management
│   │       │   ├── new/         # Create new application
│   │       │   ├── [applicationId]/  # View/edit application
│   │       │   └── re-select-university/  # Change university choices
│   │       └── slots/           # Browse available slots
│   │           └── [slotId]/    # View slot details and applicants
│   ├── my-page/                 # User profile page
│   ├── terms/                   # Terms and conditions
│   └── create-account-complete/ # Post-signup confirmation
│
├── components/                  # Reusable React components
│   ├── common/                  # Shared UI components
│   │   ├── CTAButton.tsx        # CTA button with loading state
│   │   ├── ConfirmModal.tsx     # Confirmation dialog
│   │   ├── CountryFlag.tsx      # Cross-platform country flags (SVG)
│   │   ├── SchoolLogoWithFallback.tsx  # Image fallback handling
│   │   ├── ProgressBar.tsx      # Step progress indicator
│   │   └── Tabs.tsx             # Tab navigation
│   ├── auth/                    # Authentication UI
│   │   ├── LoginForm.tsx
│   │   ├── EmailLoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── GoogleLoginButton.tsx
│   │   ├── KakaoLoginButton.tsx
│   │   ├── PasswordInput.tsx
│   │   ├── RoundCheckbox.tsx
│   │   ├── TermsAgreement.tsx
│   │   └── signUpSteps/         # Multi-step signup flow
│   │       ├── TermsStep.tsx
│   │       ├── PasswordStep.tsx
│   │       └── VerificationStep.tsx
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Main header with search support
│   │   ├── HeaderAuthSection.tsx
│   │   ├── Footer.tsx
│   │   └── ProfileMenu.tsx      # Dropdown user menu
│   ├── home/                    # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── InfoBox.tsx
│   │   ├── StrategyRoomEntrances.tsx
│   │   ├── StrategyRoomCard.tsx
│   │   └── StrategyRoomCardSkeleton.tsx
│   ├── application/             # Application form components
│   │   ├── UniversitySelectionStep.tsx  # Main component with drag-drop
│   │   ├── UniversitySearchModal.tsx    # University search modal
│   │   ├── GradeRegistrationStep.tsx    # GPA registration
│   │   ├── LanguageChart.tsx
│   │   ├── GradeProgressBar.tsx
│   │   └── UniversitySlotCard.tsx
│   ├── strategy-room/           # Strategy room features
│   │   ├── ApplicantCard.tsx    # Display applicant info
│   │   ├── ShareGradeCTA.tsx    # Social share for grades
│   │   └── UniversitySlotCard.tsx
│   ├── my-page/                 # Profile page components
│   │   └── ProfileField.tsx
│   ├── school-verification/     # Email verification components
│   │   ├── EmailStep.tsx
│   │   └── VerificationStep.tsx
│   └── icons/                   # SVG icon components
│       ├── GoogleIcon.tsx
│       ├── KakaoIcon.tsx
│       ├── CheckIcon.tsx
│       ├── EyeOpenIcon.tsx
│       ├── EyeClosedIcon.tsx
│       ├── SearchIcon.tsx
│       ├── PrevIcon.tsx
│       ├── ProfileIcon.tsx
│       ├── PencilIcon.tsx
│       ├── DragHandleIcon.tsx
│       ├── ChevronRightIcon.tsx
│       └── DefaultProfileIcon.tsx
│
├── lib/                         # Utility functions and helpers
│   ├── api/                     # API client layer
│   │   ├── auth.ts             # Auth endpoints (login, signup, logout)
│   │   ├── user.ts             # User profile endpoints
│   │   ├── season.ts           # Exchange season endpoints
│   │   ├── slot.ts             # University slot endpoints
│   │   ├── application.ts      # Application submission/management
│   │   ├── gpa.ts              # GPA registration endpoints
│   │   └── language.ts         # Language score endpoints
│   ├── oauth/                   # OAuth configuration
│   │   ├── config.ts           # OAuth provider setup
│   │   ├── google.ts           # Google OAuth flow
│   │   └── kakao.ts            # Kakao OAuth flow
│   └── utils/                   # Helper functions
│       ├── api.ts              # Base URL configuration
│       ├── redirect.ts         # Redirect URL storage
│       ├── date.ts             # Date formatting utilities
│       └── countryFlags.ts     # Emoji flag lookup table
│
├── stores/                      # Zustand state management
│   └── authStore.ts            # Authentication state and actions
│
├── types/                       # TypeScript type definitions
│   ├── user.ts                 # User interface
│   ├── auth.ts                 # Auth types (OAuthConfig, etc.)
│   ├── application.ts          # Application types
│   ├── season.ts               # Season types
│   ├── slot.ts                 # Slot and Choice types
│   └── grade.ts                # GPA and Language types
│
├── public/                      # Static assets
│   ├── fonts/                  # Custom fonts (GmarketSans, Pretendard)
│   ├── logos/                  # Logo variants
│   ├── icons/                  # Static SVG icons
│   ├── images/                 # Feature and marketing images
│   └── flags/                  # Country flag SVGs (for cross-platform compatibility)
│
├── docs/                        # Documentation
│   └── zustand-react-rendering.md  # State management notes
│
├── design/                      # Design assets
│
├── .github/                     # GitHub configuration (workflows, etc.)
│
├── tsconfig.json               # TypeScript configuration with path alias @/*
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # (via Tailwind CSS v4)
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies (pnpm)
├── pnpm-lock.yaml              # pnpm lockfile
├── eslint.config.mjs           # ESLint configuration
├── .prettierrc                 # Prettier code formatting
└── README.md                   # Project README

```

---

## Key Architectural Patterns

### 1. **App Router (Next.js 15)**
- Uses the modern **App Router** with file-based routing in the `app/` directory
- Dynamic routes use `[paramName]` convention (e.g., `[seasonId]`, `[applicationId]`)
- Root layout in `app/layout.tsx` wraps all pages with metadata and base HTML structure
- No Pages Router usage

### 2. **State Management (Zustand)**
- **Single store**: `useAuthStore` in `/stores/authStore.ts`
- Manages global auth state: `user`, `isLoading`, `isLoggedIn`
- Actions: `fetchUser()`, `setUser()`, `logout()`
- **Auto-initialization**: Store automatically calls `fetchUser()` on app startup
- **Pattern**: State + Actions combined in single Zustand hook

```typescript
// Usage pattern across components
const { user, isLoggedIn, logout } = useAuthStore();
```

### 3. **API Layer Architecture**
- **Modular API clients** in `lib/api/` - separated by domain (auth, user, season, slot, application, gpa, language)
- **Consistent fetch pattern**: All API calls use native `fetch` with credentials: 'include'
- **Error handling**: Try-catch with descriptive error messages
- **Base URL**: Centralized in `lib/utils/api.ts` via environment variable `NEXT_PUBLIC_BACKEND_URL`
- **Backend communication**: HTTP REST API with JSON payloads

### 4. **Component Organization**
- **Feature-based organization**: Components grouped by feature area (auth, home, application, strategy-room)
- **Shared components**: Common UI elements in `components/common/`
- **Icons as components**: SVG icons wrapped as React components for type safety
- **Compound components**: Complex features like UniversitySelectionStep handle their own sub-components

### 5. **Type Safety**
- Strict TypeScript with `tsconfig.json` set to strict mode
- Dedicated `types/` directory for all interfaces and types
- Request/response types align with backend API contracts
- Generic types for API responses

### 6. **Styling Strategy**
- **Tailwind CSS v4** with @import directives in `globals.css`
- **CSS custom properties** for color theming in `app/styles/colors.css`
- **Custom utility classes** for buttons (.btn-primary, .btn-secondary)
- **Animations**: Custom @keyframes (e.g., shake animation)
- **Font management**: Custom fonts via `app/styles/fonts.css`
- **Responsive design**: Mobile-first approach with max-width: 430px container

### 7. **Authentication Flow**
- **Multiple auth methods**: Email/password (BASIC) and OAuth (Google, Kakao)
- **OAuth flow**: Frontend generates state, redirects to provider, receives code in callback, exchanges code for tokens
- **Session-based**: Tokens stored in HTTP-only cookies (credentials: 'include')
- **Auto-login**: Store fetches user on app load, enabling persistent sessions
- **Protected routes**: Implicit - redirected on API 401 responses

---

## Important Features & Patterns

### **Drag & Drop Implementation**
- Uses `@dnd-kit` library for accessible drag-and-drop
- Implemented in `UniversitySelectionStep.tsx` for reordering university preferences
- Supports mouse, touch, and keyboard sensors
- Drag handle icon for UX clarity

### **Multi-Step Forms**
- Auth signups use progressive disclosure with steps (email → password → verification → terms)
- Applications have step-based flows (grade selection → language → university selection)
- Components in `signUpSteps/` and `application/` folders

### **Modal & Search Patterns**
- `UniversitySearchModal.tsx`: Searchable list of universities (reusable)
- `ConfirmModal.tsx`: Generic confirmation dialog
- Modals control their own open/close state

### **Image Handling**
- `SchoolLogoWithFallback.tsx`: Graceful fallback for missing logos
- `CountryFlag.tsx`: Cross-platform country flags using SVG (Windows-compatible alternative to emoji)
- Maps country names (Korean) to ISO codes for flag SVG retrieval

### **OAuth State Management**
- CSRF protection via state parameter
- State stored in sessionStorage
- Separate OAuth config for each provider (Google, Kakao)

### **Cross-Platform Compatibility**
- Recent branch: `feat/cross-platform-country-flags`
- Replaced emoji flags with SVG flags stored in `/public/flags/`
- Maps Korean country names to ISO 3166-1 alpha-2 codes

---

## Data Types & API Contracts

### **Core Entities**

**User**
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

**Season** (Exchange Program Period)
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

**Slot** (Individual University Exchange Opportunity)
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

**GPA & Language** (Credentials)
```typescript
interface Gpa {
  gpaId: number;
  score: number;
  criteria: string;
  verifyStatus: string;
}

interface Language {
  languageId: number;
  testType: string;
  score: string | null;
  grade: string | null;
  verifyStatus: string;
}
```

**Application**
```typescript
interface SubmitApplicationRequest {
  extraScore: number;
  gpaId: number;
  languageId: number;
  choices: ApplicationChoice[]; // Up to 5 choices with ranking
}
```

---

## Environment Variables

Required `.env.local` variables:
```
NEXT_PUBLIC_BACKEND_URL=<backend-api-url>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=<redirect-url>
NEXT_PUBLIC_KAKAO_CLIENT_ID=<kakao-oauth-client-id>
NEXT_PUBLIC_KAKAO_REDIRECT_URI=<redirect-url>
```

---

## Page Routes & Features

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home/landing page with season cards | No |
| `/log-in-or-create-account` | Auth entry point | No |
| `/log-in/password` | Email login form | No |
| `/create-account/password` | Email signup form | No |
| `/auth/google/callback` | Google OAuth callback | No |
| `/auth/kakao/callback` | Kakao OAuth callback | No |
| `/school-verification` | Email verification for school domain | Yes |
| `/strategy-room/[seasonId]` | Season overview with applicant count | Yes |
| `/strategy-room/[seasonId]/applications/new` | New application form | Yes |
| `/strategy-room/[seasonId]/applications/[applicationId]` | View submitted application | Yes |
| `/strategy-room/[seasonId]/applications/re-select-university` | Modify university choices | Yes |
| `/strategy-room/[seasonId]/slots/[slotId]` | View slot details and all applicants | Yes |
| `/my-page` | User profile page | Yes |
| `/terms` | Terms of service | No |

---

## Build & Development

**Scripts** (in package.json):
```bash
pnpm dev           # Start dev server with Turbopack (default on localhost:3000)
pnpm build         # Production build with Turbopack
pnpm start         # Run production server
pnpm lint          # Run ESLint
```

**Development Notes**:
- Turbopack enabled for faster builds
- Fast Refresh enabled for HMR
- Strict TypeScript mode enforced
- ESLint with Next.js config

---

## Recent Development Activity

**Current Branch**: `feat/cross-platform-country-flags`

**Recent Commits**:
1. `c7a3ac7` - dnd-kit drag-and-drop enhancement
2. `dc98c23` - Cross-platform country flags (SVG instead of emoji)
3. `11fc5ce` - Type structure refactoring
4. `9f2a7a4` - White background on body
5. `353ae78` - Image fallback for logos

**Modified Files** (in current branch):
- `components/application/UniversitySelectionStep.tsx`
- `package.json`
- `pnpm-lock.yaml`

---

## Important Development Notes

- **Mobile-first design**: Container is max-width 430px - all UI is designed for mobile viewport
- **Korean language**: UI text and comments are primarily in Korean
- **API Pattern**: All API calls use `credentials: 'include'` for session cookies
- **Error handling**: API calls should handle errors gracefully with try-catch
- **Path aliases**: Use `@/` prefix for imports (configured in tsconfig.json)
- **Styling**: Prefer Tailwind classes; custom utilities in globals.css for repeated patterns

