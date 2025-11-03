# Development Guide

Advanced development patterns, best practices, and detailed workflows for the Gyohwan project.

---

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
<button className="btn-primary body-1 w-full cursor-pointer rounded-[4px] p-[12px]">
  클릭
</button>
{/* .btn-primary = Custom utility class from globals.css */}
{/* .body-1 = Typography class from fonts.css */}
{/* cursor-pointer = Required due to Tailwind CSS reset */}
```

### Button (Secondary)
```tsx
<button className="btn-secondary body-1 w-full cursor-pointer rounded-[4px] p-[12px]">
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
<button className="min-h-[44px] min-w-[44px] cursor-pointer">
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
  - **Feature** (`auth/`, `home/`, `application/`, `strategy-room/`, `community/`)
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
  - `community.ts` - CommunityCountry, CommunityUniversity
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
  - `data/` - Mock data (users, seasons, slots, applications, community)
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

### ❌ Pitfall 6: Missing cursor-pointer on buttons
```typescript
// ❌ BAD - Button without cursor styling
<button className="btn-primary body-1 w-full rounded-[4px] p-[12px]">
  클릭
</button>

// ✅ GOOD - Include cursor-pointer
<button className="btn-primary body-1 w-full cursor-pointer rounded-[4px] p-[12px]">
  클릭
</button>
```

**Why**: Tailwind CSS reset removes default cursor:pointer from buttons. Always add it manually.

**Rule**: ALL interactive elements (buttons, links disguised as buttons, clickable divs) must have `cursor-pointer` class.

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

### ⚠️ Gotcha: Fixed positioning ignores parent constraints
```typescript
// ❌ BAD - fixed element ignores parent max-width
<div className="mx-auto max-w-[430px]">
  <div className="fixed bottom-0 w-full"> {/* Uses viewport width! */}
    Modal content
  </div>
</div>

// ✅ GOOD - Manually center and constrain fixed element
<div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2">
  Modal content
</div>
```

**Why**: `position: fixed` uses viewport as reference, not parent element. Must manually apply max-width and centering.

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
#   feat/community-page
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

## 📚 Additional Resources

- **Architecture Overview**: See `docs/architecture.md`
- **Essential Rules**: See root `CLAUDE.md`
- **MSW Setup**: See `MSW_SETUP_COMPLETE.md`
- **Zustand Best Practices**: See `docs/zustand-react-rendering.md`
