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
- **Language**: TypeScript ^5 (latest 5.x)
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS ^4 + PostCSS
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **API Mocking**: MSW (Mock Service Worker) ^2.11.6
- **Code Formatting**: Prettier ^3.6.2 with Tailwind plugin
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
│   ├── robots.ts                # Robots.txt generator
│   ├── sitemap.ts               # Sitemap generator
│   ├── styles/                  # Theme and typography
│   │   ├── colors.css          # Color theme variables
│   │   └── fonts.css           # Font definitions
│   ├── api/                     # API Routes
│   │   └── revalidate/         # On-demand revalidation
│   │       └── route.ts
│   ├── auth/                    # OAuth callback routes
│   │   └── [provider]/         # Dynamic provider (google, kakao)
│   │       └── callback/page.tsx
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
│   ├── change-password/         # Password change page
│   ├── delete-account/          # Account deletion page
│   ├── privacy/                 # Privacy policy page
│   ├── terms/                   # Terms and conditions
│   └── create-account-complete/ # Post-signup confirmation
│
├── components/                  # Reusable React components (69 total)
│   ├── common/                  # Shared UI components
│   │   ├── CTAButton.tsx        # CTA button with loading state
│   │   ├── ConfirmModal.tsx     # Confirmation dialog
│   │   ├── BaseModal.tsx        # Base modal wrapper for all modals
│   │   ├── CountryFlag.tsx      # Cross-platform country flags (SVG)
│   │   ├── SchoolLogoWithFallback.tsx  # Image fallback handling
│   │   ├── ProgressBar.tsx      # Step progress indicator
│   │   ├── Tabs.tsx             # Tab navigation
│   │   ├── FloatingActionButton.tsx  # Floating action button (share)
│   │   └── StructuredData.tsx   # SEO JSON-LD rendering
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
│   │   ├── HomePage.tsx         # Main home page client component
│   │   ├── HeroSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── InfoBox.tsx
│   │   ├── NavigationTab.tsx    # Top navigation tabs
│   │   ├── NavigationCard.tsx   # Navigation cards (community, etc.)
│   │   ├── StrategyRoomEntrances.tsx
│   │   ├── StrategyRoomCard.tsx
│   │   └── StrategyRoomCardSkeleton.tsx
│   ├── application/             # Application form components
│   │   ├── UniversitySelectionStep.tsx  # Main component with drag-drop
│   │   ├── UniversitySearchModal.tsx    # University search modal
│   │   ├── SortableChoiceCard.tsx       # Draggable university choice card
│   │   ├── ApplicationSubmitModal.tsx   # Submit confirmation modal
│   │   ├── GradeRegistrationStep.tsx    # GPA registration
│   │   ├── LanguageChart.tsx
│   │   ├── GradeProgressBar.tsx
│   │   └── UniversitySlotCard.tsx
│   ├── strategy-room/           # Strategy room features
│   │   ├── StrategyRoomClient.tsx       # Main client component
│   │   ├── ApplicantCard.tsx            # Display applicant info
│   │   ├── ApplicantCardSkeleton.tsx    # Loading state
│   │   ├── ShareGradeCTA.tsx            # Social share for grades
│   │   ├── UniversitySlotCard.tsx
│   │   ├── UniversitySlotCardSkeleton.tsx
│   │   ├── SlotDetailPageSkeleton.tsx
│   │   └── StrategyRoomPageSkeleton.tsx
│   ├── my-page/                 # Profile page components
│   │   └── ProfileField.tsx
│   ├── school-verification/     # Email verification components
│   │   ├── EmailStep.tsx
│   │   └── VerificationStep.tsx
│   ├── providers/               # React Context Providers
│   │   └── MSWProvider.tsx      # MSW initialization provider
│   └── icons/                   # SVG icon components (19 total)
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
│       ├── DefaultProfileIcon.tsx
│       ├── TrashIcon.tsx
│       ├── ShareIcon.tsx
│       ├── ExternalLinkIcon.tsx
│       ├── HomeIcon.tsx
│       └── CommunityIcon.tsx
│
├── lib/                         # Utility functions and helpers
│   ├── api/                     # API client layer (7 modules)
│   │   ├── auth.ts             # Auth endpoints
│   │   │   ├── checkEmailExists()
│   │   │   ├── loginWithGoogle()
│   │   │   ├── loginWithKakao()
│   │   │   ├── signupWithEmail()
│   │   │   ├── confirmEmailSignup()
│   │   │   ├── loginWithEmail()
│   │   │   └── logout()
│   │   ├── user.ts             # User profile endpoints
│   │   │   ├── getUserMe()
│   │   │   ├── sendSchoolEmailVerification()
│   │   │   ├── confirmSchoolEmailVerification()
│   │   │   ├── withdrawAccount()
│   │   │   └── changePassword()
│   │   ├── season.ts           # Exchange season endpoints
│   │   │   ├── getSeasons()
│   │   │   └── checkEligibility()
│   │   ├── slot.ts             # University slot endpoints
│   │   │   ├── getSeasonSlots()
│   │   │   ├── getMyApplication()
│   │   │   ├── getSlotDetail()
│   │   │   └── getApplicationDetail()
│   │   ├── application.ts      # Application submission/management
│   │   │   ├── submitApplication()
│   │   │   └── updateApplication()
│   │   ├── gpa.ts              # GPA registration endpoints
│   │   │   ├── getGpas()
│   │   │   └── createGpa()
│   │   └── language.ts         # Language score endpoints
│   │       ├── getLanguages()
│   │       └── createLanguage()
│   ├── oauth/                   # OAuth configuration
│   │   ├── config.ts           # OAuth provider setup
│   │   ├── google.ts           # Google OAuth flow
│   │   └── kakao.ts            # Kakao OAuth flow
│   └── utils/                   # Helper functions
│       ├── api.ts              # Base URL configuration
│       │   └── getBackendUrl()
│       ├── redirect.ts         # Redirect URL storage
│       │   ├── saveRedirectUrl()
│       │   ├── getRedirectUrl()
│       │   └── clearRedirectUrl()
│       ├── date.ts             # Date formatting utilities
│       │   ├── calculateDDay()
│       │   └── formatDate()
│       └── language.ts         # Language test type formatting
│           └── formatLanguageTest() # TOEFL_IBT → TOEFL IBT
│
├── stores/                      # Zustand state management
│   └── authStore.ts            # Authentication state and actions
│
├── hooks/                       # Custom React Hooks
│   └── useFormErrorHandler.ts  # Form error handling hook
│
├── types/                       # TypeScript type definitions (6 files)
│   ├── user.ts                 # User interface
│   ├── auth.ts                 # Auth types (OAuthConfig, etc.)
│   ├── application.ts          # Application types
│   │   ├── SubmitApplicationRequest
│   │   ├── UpdateApplicationRequest
│   │   └── ApplicationChoiceWithSlot
│   ├── season.ts               # Season types
│   │   ├── Season
│   │   └── EligibilityResponse
│   ├── slot.ts                 # Slot and Choice types
│   └── grade.ts                # GPA and Language types
│
├── mocks/                       # MSW (Mock Service Worker) setup
│   ├── browser.ts              # Browser MSW setup
│   ├── server.ts               # Server MSW setup (SSR)
│   ├── handlers/               # API request handlers
│   │   ├── index.ts           # Handler aggregation
│   │   ├── auth.ts            # Auth API mocking (7 endpoints)
│   │   ├── user.ts            # User API mocking (8 endpoints)
│   │   ├── season.ts          # Season API mocking (6 endpoints)
│   │   └── slot.ts            # Slot API mocking (2 endpoints)
│   └── data/                   # Mock data
│       ├── users.ts           # User, GPA, Language data
│       ├── seasons.ts         # Season data
│       ├── slots.ts           # University slot data
│       └── applications.ts    # Application data
│
├── public/                      # Static assets
│   ├── fonts/                  # Custom fonts (GmarketSans, Pretendard)
│   ├── logos/                  # Logo variants
│   ├── icons/                  # Static SVG icons
│   ├── images/                 # Feature and marketing images
│   ├── flags/                  # Country flag SVGs (cross-platform compatibility)
│   └── mockServiceWorker.js   # MSW service worker (auto-generated)
│
├── docs/                        # Documentation
│   └── zustand-react-rendering.md  # State management notes
│
├── design/                      # Design assets
│
├── API_RESPONSE_REFERENCE/      # API response format reference
│
├── .github/                     # GitHub configuration (workflows, etc.)
│
├── instrumentation.ts          # Next.js instrumentation (MSW server init)
├── tsconfig.json               # TypeScript configuration with path alias @/*
├── next.config.ts              # Next.js configuration (image optimization, etc.)
├── tailwind.config.ts          # (via Tailwind CSS v4)
├── postcss.config.mjs          # PostCSS configuration
├── package.json                # Dependencies (pnpm)
├── pnpm-lock.yaml              # pnpm lockfile
├── eslint.config.mjs           # ESLint configuration
├── .prettierrc                 # Prettier code formatting
├── vercel.json                 # Vercel deployment configuration
├── MSW_SETUP_COMPLETE.md       # MSW setup and usage guide
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

### 8. **MSW (Mock Service Worker) Architecture**
- **Development-only API mocking**: Controlled by `NEXT_PUBLIC_ENABLE_MSW` environment variable
- **Dual-mode operation**: Browser (`mocks/browser.ts`) and Server (`mocks/server.ts`)
- **Instrumentation hook**: Next.js 15.5+ `instrumentation.ts` initializes MSW for SSR
- **Modular handlers**: Separated by domain (auth, user, season, slot) in `mocks/handlers/`
- **Realistic data**: Mock data in `mocks/data/` simulates production scenarios
- **Error testing**: 40+ error cases for comprehensive testing
- **Zero impact on production**: MSW code is tree-shaken out when `NEXT_PUBLIC_ENABLE_MSW=false`

### 9. **SEO & Performance Optimization**
- **Structured data**: JSON-LD via `StructuredData.tsx` component
- **Dynamic metadata**: Page-level metadata for better SEO
- **robots.txt & sitemap.xml**: Auto-generated for search engine crawlers
- **Image optimization**: `next/image` with CloudFront CDN (`d2kydfinz3830f.cloudfront.net`)
- **Skeleton loading**: Reduces layout shift and improves perceived performance
- **On-demand revalidation**: `/api/revalidate` for cache busting

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
- Replaced emoji flags with SVG flags stored in `/public/flags/`
- Maps Korean country names to ISO 3166-1 alpha-2 codes
- Ensures consistent flag display across all platforms (Windows, Mac, Linux)

### **MSW (Mock Service Worker) Integration**
- **Full API mocking** for development without backend dependency
- **23 API endpoints** mocked with realistic responses
- **40+ error cases** for comprehensive testing
- **Environment-based**: Toggle with `NEXT_PUBLIC_ENABLE_MSW`
- **SSR Support**: Initialized via `instrumentation.ts` for server-side rendering
- **Browser & Server**: Works in both environments seamlessly
- **Documentation**: See [MSW_SETUP_COMPLETE.md](MSW_SETUP_COMPLETE.md)

**Test Account**:
```
Email: test@example.com
Password: password123456
```

### **Skeleton Loading States**
- Comprehensive skeleton components for better perceived performance
- `StrategyRoomPageSkeleton`, `SlotDetailPageSkeleton`, `ApplicantCardSkeleton`, etc.
- Reduces layout shift and improves UX during data loading

### **Language Test Type Formatting**
- Automatic formatting of language test types
- Backend format: `TOEFL_IBT` → UI format: `TOEFL IBT`
- Null-safe handling throughout the application
- Utility: `lib/utils/language.ts` - `formatLanguageTest()`

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
```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=<backend-api-url>

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-oauth-client-id>
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=<redirect-url>
NEXT_PUBLIC_KAKAO_CLIENT_ID=<kakao-oauth-client-id>
NEXT_PUBLIC_KAKAO_REDIRECT_URI=<redirect-url>

# MSW (Mock Service Worker) - Development Only
NEXT_PUBLIC_ENABLE_MSW=true|false  # Enable/disable API mocking

# Analytics
NEXT_PUBLIC_GA_ID=<google-analytics-id>

# On-Demand Revalidation
REVALIDATE_SECRET=<secret-key>  # For /api/revalidate endpoint
```

---

## Page Routes & Features

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home/landing page with season cards | No |
| `/log-in-or-create-account` | Auth entry point | No |
| `/log-in/password` | Email login form | No |
| `/create-account/password` | Email signup form | No |
| `/auth/[provider]/callback` | OAuth callback (google, kakao) | No |
| `/school-verification` | Email verification for school domain | Yes |
| `/strategy-room/[seasonId]` | Season overview with applicant count | Yes |
| `/strategy-room/[seasonId]/applications/new` | New application form | Yes |
| `/strategy-room/[seasonId]/applications/[applicationId]` | View submitted application | Yes |
| `/strategy-room/[seasonId]/applications/re-select-university` | Modify university choices | Yes |
| `/strategy-room/[seasonId]/slots/[slotId]` | View slot details and all applicants | Yes |
| `/my-page` | User profile page | Yes |
| `/change-password` | Password change page | Yes |
| `/delete-account` | Account deletion page | Yes |
| `/terms` | Terms of service | No |
| `/privacy` | Privacy policy | No |
| `/create-account-complete` | Post-signup confirmation | No |

**API Routes:**
| Route | Purpose | Method |
|-------|---------|--------|
| `/api/revalidate` | On-demand revalidation | POST |

**Generated Routes:**
- `/robots.txt` - Search engine crawler control
- `/sitemap.xml` - Site sitemap

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

## Git Workflow & Branches

**Main Branches**:
- `main` - Production branch
- `dev` - Development branch
- `test` - Testing branch

**To check recent activity**:
```bash
# Check current branch
git branch --show-current

# See recent commits
git log --oneline -10

# See what files changed recently
git diff --stat HEAD~5..HEAD
```

**Deployment**:
- `main` and `test` branches auto-deploy to Vercel (configured in vercel.json)

---

## Important Development Notes

- **Mobile-first design**: Container is max-width 430px - all UI is designed for mobile viewport
- **Korean language**: UI text and comments are primarily in Korean
- **API Pattern**: All API calls use `credentials: 'include'` for session cookies
- **Error handling**: API calls should handle errors gracefully with try-catch
- **Path aliases**: Use `@/` prefix for imports (configured in tsconfig.json)
- **Styling**: Prefer Tailwind classes; custom utilities in globals.css for repeated patterns

---

# Development Rules & Best Practices

## 🔧 Package Manager

### ALWAYS use pnpm (NEVER npm or yarn)
```bash
# ✅ GOOD
pnpm install
pnpm add <package>
pnpm dev
pnpm build

# ❌ BAD
npm install
yarn add <package>
```

**Why**: Project uses pnpm-lock.yaml and is configured for pnpm.

---

## 🚀 Git Workflow

### BEFORE pushing to remote, ALWAYS run build check
```bash
# 1. Run build to check for errors
pnpm build

# 2. If build succeeds, commit and push
git add .
git commit -m "feat: 기능 추가"
git push

# 3. If build fails, fix errors first
```

### Commit Message Convention
- **Use prefixes**: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`
- **Language**: Korean preferred (한글로 작성)
- **Examples**:
  - `feat: 대학 검색 모달 추가`
  - `fix: 로그인 시 에러 처리 개선`
  - `refactor: API 클라이언트 코드 정리`

**Why**: Prevents broken builds from being deployed.

---

## 🧩 Component Development

### BEFORE creating a new component:

#### 1. Check for existing components
```bash
# List all common components
ls components/common/

# Search for similar components
find components/ -name "*Button*.tsx"
find components/ -name "*Modal*.tsx"
```

#### 2. Find usage examples
```bash
# See where a component is used
grep -r "import.*CTAButton" app/ components/

# Read the component to understand props
cat components/common/CTAButton.tsx
```

#### 3. Available Common Components (Reuse First!)

**Buttons & Actions:**
- `CTAButton.tsx` - Primary/Secondary CTA with loading, shake animation
- `FloatingActionButton.tsx` - Fixed floating button (share, etc.)

**Modals:**
- `BaseModal.tsx` - Base modal wrapper (use as foundation for new modals)
- `ConfirmModal.tsx` - Confirmation dialog
- `ApplicationSubmitModal.tsx` - Application submission confirmation

**Navigation:**
- `Tabs.tsx` - Tab navigation
- `ProgressBar.tsx` - Multi-step progress indicator

**Data Display:**
- `CountryFlag.tsx` - SVG country flags (cross-platform)
- `SchoolLogoWithFallback.tsx` - Image with fallback handling

**SEO:**
- `StructuredData.tsx` - JSON-LD structured data

**Check all available components:**
```bash
ls components/common/
```

### Before Modifying a Component:

#### Understand the impact
```bash
# Step 1: Find all usages
grep -r "ComponentName" app/ components/

# Step 2: Read each usage file to understand context
cat path/to/file.tsx

# Step 3: Test all affected pages after modification
```

**Why**:
- ✅ Avoid duplicate components
- ✅ Maintain consistency across the app
- ✅ Understand breaking changes before they happen

---

## 📁 File Structure Guidelines

### Understand location before modifying:

**Pages** (`app/`)
- Server Components by default
- Dynamic routes: `[seasonId]/`, `[slotId]/`, `[applicationId]/`

**Components** (`components/`)
- Feature-based organization: `auth/`, `application/`, `strategy-room/`, `home/`
- Common: Reusable UI (`components/common/`)
- Icons: 19 SVG components (`components/icons/`)

**API Layer** (`lib/api/`)
- Modular by domain: `auth.ts`, `user.ts`, `season.ts`, `slot.ts`, `application.ts`, `gpa.ts`, `language.ts`
- All use `credentials: 'include'` for session cookies

**Types** (`types/`)
- Centralized type definitions: `user.ts`, `auth.ts`, `season.ts`, `slot.ts`, `application.ts`, `grade.ts`
- MUST update when API contracts change

**State** (`stores/`)
- Single Zustand store: `authStore.ts`

---

## 🧪 Mock Service Worker (MSW)

### Current Status
- ✅ **MSW is fully configured** with 23 API endpoints and 40+ error cases
- Environment: Controlled by `NEXT_PUBLIC_ENABLE_MSW` in `.env.local`

### Development with MSW

#### Check if MSW is enabled
```bash
# Browser console should show:
# "🔶 MSW is enabled for development"
```

#### Default test account
```
Email: test@example.com
Password: password123456
```

#### Switch between Mock and Real API
```bash
# .env.local
NEXT_PUBLIC_ENABLE_MSW=true   # Use mock data
NEXT_PUBLIC_ENABLE_MSW=false  # Use real backend
```

#### When adding new API endpoints:
1. Add mock handler in `mocks/handlers/`
2. Add test data in `mocks/data/`
3. Update `MSW_SETUP_COMPLETE.md` documentation

**Documentation**: See [MSW_SETUP_COMPLETE.md](MSW_SETUP_COMPLETE.md) for full mock data reference.

---

## 🎯 TypeScript Rules

### Strict Type Safety (NEVER use `any`)

```typescript
// ❌ BAD - Using any
const data: any = await fetch(...);
function handleData(input: any) { ... }

// ✅ GOOD - Define proper types
import type { Season } from "@/types/season";
const data: Season = await fetch(...);
function handleData(input: Season) { ... }
```

### When adding new API endpoints:

1. **Define types in `types/` directory**
   ```typescript
   // types/season.ts
   export interface Season {
     seasonId: number;
     name: string;
     // ...
   }
   ```

2. **Use types in `lib/api/` functions**
   ```typescript
   // lib/api/season.ts
   import type { Season } from "@/types/season";

   export const getSeasons = async (): Promise<Season[]> => {
     // ...
   };
   ```

3. **Use types in components**
   ```typescript
   // components/season/SeasonCard.tsx
   import type { Season } from "@/types/season";

   interface SeasonCardProps {
     season: Season;
   }
   ```

**Why**: TypeScript strict mode is enabled. Type safety prevents runtime errors.

---

## 🔌 API Calling Patterns

### Required Pattern (ALL API calls MUST follow):

```typescript
import { getBackendUrl } from "@/lib/utils/api";

export const myApiFunction = async (data: RequestType): Promise<ResponseType> => {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/v1/endpoint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ REQUIRED for session cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 호출 실패 (HTTP ${response.status})${errorText ? `: ${errorText}` : ""}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error; // Re-throw to let caller handle
  }
};
```

### API Rules Checklist:
- ✅ ALWAYS use `getBackendUrl()` from `@/lib/utils/api`
- ✅ ALWAYS include `credentials: 'include'` (for session cookies)
- ✅ ALWAYS handle errors with try-catch
- ✅ ALWAYS throw descriptive error messages
- ❌ NEVER hardcode backend URLs

---

## ⚠️ Error Handling

### API Errors (ALWAYS handle)

```typescript
// ✅ GOOD - Proper error handling
try {
  const data = await someApiCall();
  // Success handling
} catch (error) {
  console.error("Failed to fetch data:", error);
  // TODO: Show user-friendly error message (toast/modal)
  // Currently most errors only log to console
}
```

### User Feedback (IMPROVEMENT NEEDED)
- When API calls fail, inform the user
- Consider using `ConfirmModal` for critical errors
- Consider adding toast notifications library

**Current Pattern**: Most errors are only logged to console.

---

## 🗄️ State Management

### Global State: Zustand only
```typescript
// ✅ GOOD - Use Zustand for global state
import { useAuthStore } from "@/stores/authStore";

const { user, isLoggedIn, logout } = useAuthStore();
```

### Local State: useState
```typescript
// ✅ GOOD - Use useState for component-local state
const [searchQuery, setSearchQuery] = useState("");
const [isOpen, setIsOpen] = useState(false);
```

### Rules:
- ✅ **Global state** (user auth, app-wide data) → Zustand store in `stores/`
- ✅ **Local state** (form inputs, modal open/close) → `useState`
- ❌ **DO NOT** create multiple Zustand stores without discussion
- ❌ **DO NOT** use Context API for global state (Zustand is preferred)

**Current stores**: Only `authStore.ts` (keep it simple)

---

## 🎨 Styling Guidelines

### Tailwind First (ALWAYS prefer Tailwind)

```typescript
// ✅ GOOD - Use Tailwind classes
<button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  클릭
</button>

// ❌ BAD - Inline styles (avoid)
<button style={{ backgroundColor: 'blue', padding: '8px 16px' }}>
  클릭
</button>
```

### Custom CSS (Only when necessary)

**Use `globals.css` for**:
- Custom utility classes (`.btn-primary`, `.btn-secondary`)
- Animations (`@keyframes`)
- CSS variables (from `app/styles/colors.css`)

**Available Custom Utilities**:
```css
.btn-primary    /* Blue CTA button with hover/disabled states */
.btn-secondary  /* Black button with hover/disabled states */
.animate-shake  /* Shake animation */
```

### Custom CSS Variables:
```css
var(--color-primary-blue)
var(--color-black)
var(--color-white)
var(--color-gray-100) /* through --color-gray-900 */
```

### Prettier Auto-formatting
- Tailwind classes are **auto-sorted** by `prettier-plugin-tailwindcss`
- Run Prettier before committing (usually auto-runs in IDE)

### Button Styling (IMPORTANT!)

**ALWAYS add `cursor-pointer` to clickable elements!**

```typescript
// ✅ GOOD - Includes cursor-pointer
<button className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  클릭
</button>

// ❌ BAD - Missing cursor-pointer (shows default cursor)
<button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  클릭
</button>

// ✅ GOOD - For non-button clickable elements
<div onClick={handleClick} className="cursor-pointer">
  클릭 가능한 영역
</div>
```

**Why**: Tailwind CSS resets remove the default cursor:pointer from buttons. Without explicitly adding `cursor-pointer`, buttons will show the default arrow cursor instead of the pointer hand cursor, which confuses users.

**Rule**: Add `cursor-pointer` to:
- ✅ All `<button>` elements
- ✅ Elements with `onClick` handlers
- ✅ Elements that should indicate clickability

---

## 📱 Mobile-First Development

### Design Constraints
- **Max width**: 430px container
- **All UI is designed for mobile viewport**
- Test in mobile view FIRST, desktop second

### Touch Events
```typescript
// ✅ GOOD - Consider touch events
<button
  onClick={handleClick}
  className="min-h-[44px]" // Minimum touch target size
>
```

### Responsive Design
```typescript
// Mobile-first approach (default styles for mobile)
<div className="px-4 py-2 md:px-6 md:py-4">
  {/* Smaller padding on mobile, larger on desktop */}
</div>
```

---

## ♿ Accessibility

### Modals: Focus Management
```typescript
// When modal opens:
// - Focus should move to modal
// - Tab should stay within modal (focus trap)
// - ESC key should close modal

// ConfirmModal.tsx already handles this
// Use it as reference for new modals
```

### Images: Alt Text
```typescript
// ✅ GOOD - Always provide alt text
import Image from "next/image";

<Image
  src="/logo.png"
  alt="교환닷컴 로고"
  width={100}
  height={100}
/>
```

---

## ⚡ Performance

### Images: Use next/image
```typescript
// ✅ GOOD - Use Next.js Image component
import Image from "next/image";

<Image
  src={logoUrl}
  alt="대학 로고"
  width={60}
  height={60}
/>

// ❌ BAD - Regular img tag (avoid)
<img src={logoUrl} alt="대학 로고" />
```

**Why**: Next.js Image provides automatic optimization, lazy loading, and responsive images.

### Large Lists: Consider Virtualization
- For lists with 100+ items, consider virtualization libraries
- Examples: `react-window`, `react-virtualized`
- **Current status**: Not implemented yet (add if needed)

---

## ⚛️ React Server/Client Components

### Default: Server Components (Faster)
- All components are **Server Components by default** in Next.js 15
- **DO NOT add `'use client'`** unless necessary

### When to use 'use client':
- ✅ React hooks (useState, useEffect, useRef, etc.)
- ✅ Event handlers (onClick, onChange, etc.)
- ✅ Browser APIs (window, localStorage, etc.)
- ✅ Client-side libraries (@dnd-kit, zustand, etc.)

### Why minimize 'use client'?
- ❌ Increases JavaScript bundle size
- ❌ Slower initial page load
- ✅ Server Components = Faster, smaller bundle

### Examples:

```typescript
// ❌ BAD - Unnecessary 'use client'
"use client";
export default function StaticInfo() {
  return <div>교환 프로그램 안내</div>;
}

// ✅ GOOD - Server Component (default, faster)
export default function StaticInfo() {
  return <div>교환 프로그램 안내</div>;
}

// ✅ GOOD - 'use client' is necessary here
"use client";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState(""); // ← Needs 'use client'
  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

### Current Project Stats:
- 69 components total
- 29 use 'use client' (42%)
- 40 are Server Components (58%) ✅ Good balance!

---

## 📝 Code Quality

### Before Committing:
1. ✅ Run `pnpm build` - Ensure no build errors
2. ✅ Run `pnpm lint` - Fix all ESLint errors
3. ✅ Format with Prettier (auto-runs in most IDEs)
4. ✅ Check TypeScript errors in IDE

### No TODO/FIXME in Production
- Current status: ✅ **0 TODO/FIXME comments** (Keep it clean!)
- Resolve TODOs before merging to main

### Language Conventions
- **UI text**: Korean (한글)
- **Code comments**: Korean preferred (maintain current pattern)
- **Git commits**: Korean preferred
- **Variable/function names**: English (standard practice)

### Prettier Configuration
```json
{
  "semi": true,                    // Use semicolons
  "singleQuote": false,           // Use double quotes
  "tabWidth": 2,                  // 2 spaces
  "printWidth": 120,              // Max line length
  "trailingComma": "es5"
}
```

---

## 🧱 Component Props Convention

### ALWAYS use `interface` (NOT `type`) for Props

```typescript
// ✅ GOOD
interface MyComponentProps {
  title: string;
  onClick: () => void;
  isActive?: boolean;
}

export default function MyComponent({ title, onClick, isActive = false }: MyComponentProps) {
  return <button onClick={onClick}>{title}</button>;
}

// ❌ BAD - Don't use type for props
type MyComponentProps = {
  title: string;
};
```

### Destructure Props in Parameters
```typescript
// ✅ GOOD
export default function Card({ title, description }: CardProps) {
  return <div>{title}</div>;
}

// ❌ BAD
export default function Card(props: CardProps) {
  return <div>{props.title}</div>;
}
```

**Why**: Maintains consistency with existing codebase patterns.

---

## 📚 Quick Reference

### Find Component Usage
```bash
grep -r "import.*ComponentName" app/ components/
```

### Find API Function Usage
```bash
grep -r "functionName" components/ app/
```

### List Common Components
```bash
ls components/common/
```

### Check Component Props
```bash
cat components/common/ComponentName.tsx | grep "interface.*Props" -A 10
```

### Check Git Status
```bash
git status
git diff
```

### Build and Test
```bash
pnpm build     # Check for build errors
pnpm lint      # Check for ESLint errors
pnpm dev       # Start dev server
```

---

# Advanced Development Guidelines

## 📛 Naming Conventions

### Components
- **Page Components**: `[Feature]Page.tsx`
  - Examples: `HomePage.tsx`, `StrategyRoomPage.tsx`
- **Client Wrappers**: `[Feature]Client.tsx`
  - Examples: `StrategyRoomClient.tsx`
  - Used when Server Component needs to pass data to Client Component
- **Modals**: `[Feature]Modal.tsx`
  - Examples: `UniversitySearchModal.tsx`, `ConfirmModal.tsx`, `ApplicationSubmitModal.tsx`
- **Skeleton States**: `[Component]Skeleton.tsx`
  - Examples: `ApplicantCardSkeleton.tsx`, `StrategyRoomPageSkeleton.tsx`
  - Loading states that match the component's layout
- **Form Steps**: `[Feature]Step.tsx`
  - Examples: `TermsStep.tsx`, `PasswordStep.tsx`, `VerificationStep.tsx`
  - Multi-step form components
- **Icons**: `[Name]Icon.tsx`
  - Examples: `GoogleIcon.tsx`, `TrashIcon.tsx`, `SearchIcon.tsx`
  - SVG components for icons

### Files & Folders
- **API clients**: lowercase with domain name
  - Examples: `auth.ts`, `user.ts`, `season.ts`, `slot.ts`
- **Types**: lowercase with entity name
  - Examples: `user.ts`, `season.ts`, `application.ts`, `grade.ts`
- **Utils**: lowercase with function purpose
  - Examples: `date.ts`, `language.ts`, `redirect.ts`, `api.ts`
- **Components**: PascalCase matching component name
  - File: `CTAButton.tsx` → Component: `export default function CTAButton()`

### Variables & Functions
- **Components**: PascalCase
  - Examples: `CTAButton`, `ConfirmModal`, `StrategyRoomClient`
- **Functions**: camelCase
  - Examples: `getUserMe()`, `formatLanguageTest()`, `calculateDDay()`
- **Constants**: UPPER_SNAKE_CASE
  - Examples: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_ENABLE_MSW`
- **Interfaces**: PascalCase with descriptive suffix
  - **Props**: `[Component]Props`
    - Examples: `CTAButtonProps`, `ConfirmModalProps`
  - **Request**: `[Feature]Request`
    - Examples: `SubmitApplicationRequest`, `UpdateApplicationRequest`
  - **Response**: `[Feature]Response`
    - Examples: `EligibilityResponse`, `AuthSuccessResponse`

### Why These Conventions?
- ✅ Easy to find files (predictable names)
- ✅ Clear component purpose at a glance
- ✅ Consistent across the entire codebase
- ✅ Matches Next.js and React best practices

---

## 🔄 Server/Client Component Separation Pattern

### The Pattern: Server fetches, Client interacts

This is a **core architectural pattern** in this codebase for optimal performance.

### Example: Strategy Room Page

**Server Component** (fetches data):
```typescript
// app/strategy-room/[seasonId]/page.tsx
export default async function StrategyRoomPage({ params }: Props) {
  const seasonId = (await params).seasonId;

  // ✅ Server-side data fetching (fast, SEO-friendly)
  const slots = await getSeasonSlots(seasonId);
  const season = await getSeason(seasonId);

  // Pass data to Client Component
  return <StrategyRoomClient slots={slots} season={season} />;
}
```

**Client Component** (handles interactions):
```typescript
// components/strategy-room/StrategyRoomClient.tsx
"use client";

export default function StrategyRoomClient({ slots, season }: Props) {
  // ✅ Client-side state for filtering/sorting
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredSlots = slots.filter(slot =>
    slot.name.includes(filter)
  );

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {/* ... */}
    </div>
  );
}
```

### Why This Pattern?

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **Data Fetching** | ✅ Yes (async/await) | ❌ No (use props) |
| **SEO** | ✅ Indexed by search engines | ❌ Not indexed |
| **JavaScript Bundle** | ✅ 0 KB sent to browser | ❌ Sent to browser |
| **User Interaction** | ❌ No state/events | ✅ useState, onClick, etc. |
| **Performance** | ✅ Fast initial load | ⚠️ Slower initial load |

### When to Use This Pattern:
- ✅ Pages with initial data + user filters/sorting
- ✅ Forms with pre-loaded dropdown options
- ✅ Lists that need client-side search
- ✅ Any page with data fetching + interactivity

### Anti-Pattern (Don't Do This):
```typescript
// ❌ BAD - Client Component fetching data
"use client";
export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);

  // Slow, not SEO-friendly, unnecessary JavaScript
}
```

---

## 🎨 Common Tailwind Patterns

### Container (Mobile-First)
```tsx
<div className="mx-auto w-full max-w-[430px] px-[20px]">
  {/* All content should be in this container */}
  {/* max-w-[430px] = Mobile viewport width */}
  {/* px-[20px] = 20px horizontal padding */}
</div>
```

### Card
```tsx
<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
  {/* Standard card with border, shadow, padding */}
</div>
```

### Button (Primary CTA)
```tsx
<button className="btn-primary body-1 w-full rounded-[4px] p-[12px]">
  클릭
</button>
{/* .btn-primary = Custom utility class from globals.css */}
{/* .body-1 = Typography class from fonts.css */}
```

### Button (Secondary)
```tsx
<button className="btn-secondary body-1 w-full rounded-[4px] p-[12px]">
  취소
</button>
{/* .btn-secondary = Black button style */}
```

### Spacing Guidelines
- **Padding**: Use bracket notation for exact pixels
  - Examples: `px-[20px]`, `py-[12px]`, `p-[16px]`
  - Why: Tailwind's default scale doesn't always match design
- **Gap**: Use Tailwind units for flex/grid spacing
  - Examples: `gap-3` (12px), `gap-4` (16px), `gap-6` (24px)
- **Margin**: **Prefer `gap` over `margin`** for flex/grid children
  ```tsx
  // ✅ GOOD - Use gap
  <div className="flex flex-col gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>

  // ❌ BAD - Margin on children
  <div className="flex flex-col">
    <div className="mb-4">Item 1</div>
    <div>Item 2</div>
  </div>
  ```

### Touch Targets (Mobile Accessibility)
```tsx
<button className="min-h-[44px] min-w-[44px]">
  {/* 44px = iOS/Android recommended minimum touch target size */}
  {/* Prevents accidental taps */}
</button>
```

### Typography
```tsx
{/* Use custom typography classes from fonts.css */}
<h1 className="heading-1">Main Title</h1>
<h2 className="heading-2">Section Title</h2>
<p className="body-1">Regular text</p>
<span className="caption-1">Small text</span>
```

### Layout (Flex)
```tsx
{/* Horizontal center */}
<div className="flex items-center justify-center">

{/* Vertical stack */}
<div className="flex flex-col gap-4">

{/* Space between */}
<div className="flex items-center justify-between">
```

### Colors
```tsx
{/* Use CSS custom properties from colors.css */}
<div className="bg-[var(--color-primary-blue)]">
<div className="text-[var(--color-gray-700)]">
<div className="border-[var(--color-gray-300)]">
```

---

## ⚠️ Error Handling - Current State & Improvements

### Current Pattern (Console Only) ❌

Most API calls in the codebase currently do this:
```typescript
try {
  const data = await someApiCall();
  // Success - data is used
} catch (error) {
  console.error("Failed to fetch data:", error);
  // ❌ Problem: User doesn't see the error
  // They just see empty/broken UI
}
```

### Recommended Pattern (User Feedback) ✅

```typescript
try {
  const data = await someApiCall();
  // Success handling
} catch (error) {
  console.error("Failed to fetch data:", error);

  // ✅ Option 1: Use ConfirmModal for critical errors
  setErrorModal({
    isOpen: true,
    title: "오류",
    message: "데이터를 불러오는데 실패했습니다.\n다시 시도해주세요.",
    onConfirm: () => setErrorModal({ isOpen: false }),
  });

  // ✅ Option 2: Add toast library (recommended)
  // Install: pnpm add react-hot-toast or sonner
  // toast.error("데이터를 불러오는데 실패했습니다.");
}
```

### Common Error Scenarios & Handling

| HTTP Status | Scenario | User Action |
|-------------|----------|-------------|
| **401 Unauthorized** | Session expired | Redirect to `/log-in-or-create-account` |
| **400 Bad Request** | Invalid form data | Show validation error message |
| **403 Forbidden** | No permission | Show "권한이 없습니다" message |
| **404 Not Found** | Resource doesn't exist | Show "찾을 수 없습니다" message |
| **500 Server Error** | Backend issue | Show "서버 오류가 발생했습니다" |
| **Network Error** | No internet | Show "인터넷 연결을 확인해주세요" |

### Error Messages (Korean, User-Friendly)

```typescript
// ✅ GOOD - User-friendly Korean messages
const ERROR_MESSAGES = {
  NETWORK: "인터넷 연결을 확인해주세요.",
  UNAUTHORIZED: "로그인이 필요합니다.",
  FORBIDDEN: "권한이 없습니다.",
  NOT_FOUND: "요청하신 정보를 찾을 수 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  VALIDATION: "입력하신 정보를 확인해주세요.",
};

// ❌ BAD - Technical English messages
throw new Error("Failed to fetch user data (HTTP 401)");
```

### Action Items (TODO)
- [ ] Add toast notification library (`react-hot-toast` or `sonner`)
- [ ] Create `ErrorBoundary` component for unexpected errors
- [ ] Standardize error messages in a constants file
- [ ] Add retry mechanism for failed requests
- [ ] Log errors to monitoring service (Sentry, LogRocket, etc.)

---

## 📁 Folder Responsibilities

Understanding where files belong prevents confusion and maintains organization.

### `app/` - Routing & Server Logic
- **Responsibility**: Pages, layouts, route handlers, metadata
- **Can do**:
  - Server-side data fetching (`async/await`)
  - Generate metadata (SEO)
  - API routes (`route.ts`)
- **Cannot do**:
  - Client-side state (`useState`, `useEffect`)
  - Browser APIs (`window`, `localStorage`)
- **Rule**: **Keep minimal logic** - delegate to components

**Example**:
```typescript
// ✅ GOOD - Minimal page, delegates to component
export default async function Page({ params }) {
  const data = await fetchData(params.id);
  return <PageClient data={data} />;
}

// ❌ BAD - Too much logic in page
export default async function Page({ params }) {
  const data = await fetchData(params.id);
  const filtered = data.filter(/* complex logic */);
  const sorted = filtered.sort(/* complex logic */);
  // ... 50 lines of logic
}
```

---

### `components/` - UI Components
- **Responsibility**: Reusable UI elements
- **Organize by**:
  - **Feature** (`auth/`, `home/`, `application/`, `strategy-room/`)
  - **Type** (`common/`, `icons/`, `providers/`)
- **Rule**:
  - One component per file
  - Named exports for utility functions only
  - Component name = filename

**Example**:
```typescript
// ✅ GOOD
// File: components/common/CTAButton.tsx
export default function CTAButton({ message, onClick }: CTAButtonProps) {
  // ...
}

// ❌ BAD - Multiple components in one file
export function CTAButton() { /* ... */ }
export function SecondaryButton() { /* ... */ }
export function IconButton() { /* ... */ }
```

---

### `lib/api/` - Backend Communication
- **Responsibility**: All API calls to backend
- **Pattern**: One file per domain
  - `auth.ts` - Authentication (login, signup, logout)
  - `user.ts` - User profile, settings
  - `season.ts` - Exchange seasons
  - `slot.ts` - University slots
  - `application.ts` - Application submission
  - `gpa.ts` - GPA registration
  - `language.ts` - Language scores
- **Rule**:
  - Export named functions (not default)
  - Use TypeScript return types
  - Always include `credentials: 'include'`

**Example**:
```typescript
// ✅ GOOD - Named exports with types
export const getUserMe = async (): Promise<User> => {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/v1/users/me`, {
    credentials: 'include',
  });
  return await response.json();
};

// ❌ BAD - Default export, no types
export default async function() {
  return await fetch('/api/user').then(r => r.json());
}
```

---

### `lib/utils/` - Helper Functions
- **Responsibility**: Pure utility functions
- **Examples**:
  - Date formatting (`date.ts`)
  - String manipulation (`language.ts`)
  - Data transformation
- **Rule**:
  - **No side effects** (pure functions)
  - **Testable** (input → output)
  - **No API calls** (use `lib/api/` for that)

**Example**:
```typescript
// ✅ GOOD - Pure utility function
export function formatLanguageTest(testType: string | null): string {
  if (!testType) return "-";
  return testType.replace(/_/g, " ");
}

// ❌ BAD - Side effect (API call in utility)
export function getFormattedLanguageTest(id: number) {
  const test = await fetchLanguageTest(id); // ❌ API call
  return formatTest(test);
}
```

---

### `types/` - Type Definitions
- **Responsibility**: TypeScript interfaces and types
- **Organize by**: Domain (matches backend entities)
  - `user.ts` - User, Profile
  - `auth.ts` - OAuthConfig, AuthResponse
  - `season.ts` - Season, EligibilityResponse
  - `slot.ts` - Slot, Choice
  - `application.ts` - Application, SubmitRequest
  - `grade.ts` - Gpa, Language
- **Rule**:
  - Export interfaces (not types for main entities)
  - Align with backend API contracts
  - One file per domain

---

### `stores/` - Global State (Zustand)
- **Responsibility**: Zustand stores for **global** application state
- **Current**: Only `authStore.ts` (user authentication state)
- **Rule**:
  - **Only add new stores when absolutely necessary**
  - Ask: "Does this need to be global?" (most state doesn't)
  - Prefer local state (`useState`) when possible

**When to add a new store**:
- ✅ User authentication (current: `authStore`)
- ✅ Theme/language preferences (if added)
- ❌ Form state (use local `useState`)
- ❌ Page-specific data (pass as props)

---

### `mocks/` - API Mocking (MSW)
- **Responsibility**: Mock API responses for development
- **Structure**:
  - `handlers/` - Request handlers (auth, user, season, slot)
  - `data/` - Mock data (users, seasons, slots, applications)
  - `browser.ts` - Browser MSW setup
  - `server.ts` - Server MSW setup (SSR)
- **Rule**:
  - Only active when `NEXT_PUBLIC_ENABLE_MSW=true`
  - Keep mock data realistic
  - Update when API contracts change

---

### `hooks/` - Custom React Hooks
- **Responsibility**: Reusable React hooks
- **Current**: `useFormErrorHandler.ts`
- **Rule**:
  - Name with `use` prefix
  - Extract repeated hook logic
  - Keep hooks simple and composable

---

## 🚨 Common Pitfalls & Gotchas

### ❌ Pitfall 1: Import Path Hell
```typescript
// ❌ BAD - Relative import spaghetti
import { User } from "../../../types/user";
import { CTAButton } from "../../../components/common/CTAButton";

// ✅ GOOD - Use path alias @/*
import { User } from "@/types/user";
import CTAButton from "@/components/common/CTAButton";
```

**Why**: Configured in `tsconfig.json` with `"@/*": ["./*"]`

---

### ❌ Pitfall 2: Missing credentials in API calls
```typescript
// ❌ BAD - Session cookies won't be sent
fetch(`${backendUrl}/v1/users/me`);

// ✅ GOOD - Always include credentials
fetch(`${backendUrl}/v1/users/me`, {
  credentials: "include", // ← Required for session cookies
});
```

**Why**: Backend uses HTTP-only cookies for authentication

---

### ❌ Pitfall 3: Unnecessary 'use client'
```typescript
// ❌ BAD - Server component doesn't need 'use client'
"use client";
export default function StaticPage() {
  return <div>정적 컨텐츠</div>;
}

// ✅ GOOD - Default is server component (faster)
export default function StaticPage() {
  return <div>정적 컨텐츠</div>;
}
```

**Why**: Server components are faster and better for SEO

---

### ❌ Pitfall 4: Hardcoded backend URL
```typescript
// ❌ BAD - Hardcoded URL breaks in different environments
fetch("https://api.gyohwan.com/v1/users/me");

// ✅ GOOD - Use getBackendUrl()
import { getBackendUrl } from "@/lib/utils/api";
const backendUrl = getBackendUrl();
fetch(`${backendUrl}/v1/users/me`);
```

**Why**: Different URLs for dev/test/production

---

### ❌ Pitfall 5: Ignoring MSW in development
When API calls fail mysteriously in development:

**Checklist**:
1. ✅ Is MSW enabled? Check `.env.local`: `NEXT_PUBLIC_ENABLE_MSW=true`
2. ✅ Is the endpoint mocked? Check `mocks/handlers/`
3. ✅ Console shows `[MSW] Mocking enabled`?
4. ✅ Is the mock data correct? Check `mocks/data/`

```bash
# Quick debug
echo $NEXT_PUBLIC_ENABLE_MSW  # Should print "true"

# Check if handler exists
grep -r "GET /v1/users/me" mocks/handlers/
```

---

### ⚠️ Gotcha: Language test type null handling
```typescript
// Backend sometimes returns null for testType
// ❌ BAD - Will crash on null
const formatted = testType.replace("_", " ");

// ✅ GOOD - Use formatLanguageTest utility (null-safe)
import { formatLanguageTest } from "@/lib/utils/language";
const formatted = formatLanguageTest(testType);
// Returns "-" for null, "TOEFL IBT" for "TOEFL_IBT"
```

**Why**: Added in recent commits to handle backend inconsistency

---

### ⚠️ Gotcha: Dynamic route params in Next.js 15
```typescript
// Next.js 15 changed params to be async
// ❌ BAD - Old Next.js pattern
export default function Page({ params }) {
  const id = params.id; // ❌ Error in Next.js 15
}

// ✅ GOOD - Next.js 15 pattern
export default async function Page({ params }) {
  const id = (await params).id; // ← await params
}
```

**Why**: Next.js 15 made `params` async for performance

---

### ⚠️ Gotcha: CSS class ordering (Prettier)
```typescript
// Prettier with tailwind plugin auto-sorts classes
// Don't worry about order - Prettier handles it

// Before Prettier:
<div className="p-4 bg-white text-black rounded-lg">

// After Prettier (auto-formatted):
<div className="rounded-lg bg-white p-4 text-black">
```

**Why**: `prettier-plugin-tailwindcss` ensures consistent ordering

---

## 🔄 Development Workflow

### Step 0: Determine Your Work Type

**Ask yourself FIRST**:
```
Am I fixing a critical production bug?
  → YES: Use Hotfix Workflow (below)
  → NO: Use Feature Development Workflow (below)
```

---

### 🚨 Hotfix Workflow (Critical Production Bugs)

Use this when production is broken and needs immediate fix.

```bash
# 1. Start from main branch
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/critical-bug-description

# 3. Make minimal fix
# - Fix ONLY the critical bug
# - Don't add features or refactor
# - Test thoroughly

# 4. Test the fix
pnpm build  # Must succeed
pnpm lint   # Must pass

# 5. Commit with clear message
git add .
git commit -m "hotfix: 프로덕션 버그 설명"

# 6. Push and create PR to main
git push origin hotfix/critical-bug-description
# Create PR: hotfix/critical-bug-description → main

# 7. After merge to main
# Also merge to dev to keep in sync
git checkout dev
git merge main
git push origin dev
```

**Hotfix Rules**:
- ✅ Only for **critical production bugs**
- ✅ Minimal changes (just the fix)
- ✅ Merge to `main` first, then sync to `dev`
- ❌ No new features
- ❌ No refactoring

---

### ⭐ Feature Development Workflow (Normal Development)

Use this for new features, improvements, and non-critical bugs.

```bash
# 1. Start from dev branch
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feat/your-feature-name
# Examples:
#   feat/university-search-filter
#   fix/login-error-handling
#   refactor/api-client-cleanup

# 3. Develop your feature
# - Write code
# - Test in browser (localhost:3000)
# - Check TypeScript errors in IDE
# - Verify MSW is working (console: "[MSW] Mocking enabled")

# 4. Before committing - Run quality checks
pnpm build  # ← MUST succeed (catches TypeScript/build errors)
pnpm lint   # ← MUST pass (catches linting errors)

# 5. If checks pass, commit
git add .
git commit -m "feat: 기능 설명"
# Commit message format: feat|fix|refactor|style|docs|chore: 설명

# 6. Push feature branch
git push origin feat/your-feature-name

# 7. Create Pull Request
# PR target: feat/your-feature-name → dev (NOT main)
# Fill out PR template
# Request review

# 8. After PR approval
# Merge to dev → Team lead handles dev → test → main flow
```

---

### Development Environment Setup

```bash
# First time setup
git clone <repo-url>
cd gyohwan
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Start development
pnpm dev
# Open http://localhost:3000
```

---

### Daily Development Routine

```bash
# Morning: Get latest changes
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feat/your-feature

# Work on feature...
# Save frequently, commit often

# Before lunch/EOD: Push your work
git add .
git commit -m "feat: work in progress"
git push origin feat/your-feature
```

---

### Debugging Tips

**TypeScript errors**:
```bash
# Check errors
pnpm build

# Or use your IDE's TypeScript integration
# VSCode: Cmd+Shift+M (View Problems)
```

**API not working**:
```bash
# 1. Check if MSW is enabled
cat .env.local | grep ENABLE_MSW

# 2. Check browser console for:
#    "[MSW] Mocking enabled"

# 3. Check if endpoint is mocked
grep -r "your-endpoint" mocks/handlers/
```

**Build failing**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Try build again
pnpm build
```

---

### Branch Flow (Managed by Team)

```
Developer branches (you)
    ↓
  dev (development)
    ↓
  test (staging)
    ↓
  main (production)
```

**Your responsibility**: Get PR merged to `dev`
**Team lead responsibility**: Promote `dev` → `test` → `main`

---

