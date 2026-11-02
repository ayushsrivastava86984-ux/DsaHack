# DsaHack Internal Admin Dashboard Architecture & Implementation Plan

A secure, internal-only Admin Dashboard for DsaHack allowing administrators to manage coding problems, perform bulk uploads (80–100 questions via JSON/CSV), configure sample and hidden test cases, manage topic/difficulty distributions, and toggle publish/unpublish status—without disrupting existing student authentication, profiles, bookmarks, or submissions.

---

## Inspection Report: Existing Codebase Architecture

### 1. Authentication Flow & Role Storage
- **Current Flow**:
  - Located in `src/views/AuthPage.tsx` and `src/App.tsx`.
  - Public registration (`handleSignupSubmit`) exclusively creates accounts with `role: 'student'` and initial progression stats (14-day streak, 50 XP, level 1).
  - Session state is held in React state (`const [user, setUser] = useState<UserProfile | null>(...)`) and persisted across reloads in `localStorage` under the key `'dsahack_user'`.
  - On login, the user profile is stored; on logout, `localStorage.removeItem('dsahack_user')` clears the session.
- **User Role Storage**:
  - Defined in `src/types.ts`:
    ```ts
    export interface UserProfile {
      id: string;
      name: string;
      username: string;
      email: string;
      role: 'student' | 'admin';
      ...
    }
    ```
  - The role is stored on the active `UserProfile` object.
  - The app already defines `'admin_dashboard' | 'admin_questions' | 'admin_users' | 'admin_contests'` in `ScreenId` in `src/types.ts`, and an initial placeholder `src/views/AdminDashboard.tsx` exists.

### 2. Supabase Client Configuration
- **Configuration File**: `src/lib/supabase.ts`
- **Environment Variables**:
  - `VITE_SUPABASE_URL` / `SUPABASE_URL`: `https://glptbmbodfvlafzwfyfm.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`: `sb_publishable_z6nfZYSWHWf3Qj4-Pw_c2w_N-Tq_1T9`
- **Client Instance**: Initialized with `@supabase/supabase-js` `createClient(supabaseUrl, supabaseAnonKey)`.
- **Security**: Only the publishable Anon key is used. No service role key is exposed in client code.
- **Current State**: Supabase connection probe (`testSupabaseConnection()`) is active and verified. No database tables have been created or modified yet, adhering to the requirement not to run DDL without showing SQL first.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **No database tables or backend code are altered in this step.** All question management is architected to operate with client-side reactive state + `localStorage` persistence first, with full compatibility for Supabase sync once you approve the SQL schema.

- **Admin Access Model**:
  - Direct route guard: Only accounts with `user.role === 'admin'` can access `admin_dashboard`.
  - For local development & admin access, an internal Admin Key / Passcode mechanism (or switching your user role to `'admin'` via an internal secure prompt) will allow you to access the dashboard without altering normal student signups.
- **Data Persistence Strategy**:
  - Questions are managed in a reactive state in `App.tsx` seeded with `INITIAL_PROBLEMS` and merged with custom questions in `localStorage` (`dsahack_questions_store`).
  - When Supabase tables are ready in a future step, this store seamlessly connects to `supabase.from('problems')`.

---

## 1. Overview & Core Concept

- **What It Delivers**: An internal administrative control center where DsaHack maintainers can curate the problem library, rapidly import large problem sets, set up test fixtures, and control what students see.
- **Target Audience**: Platform maintainers, educators, and content curators.
- **Key Value**: Eliminates manual hardcoding of questions. Enables 1-click bulk import of 80–100 questions from LeetCode/HackerRank JSON or CSV exports.

---

## 2. User Experience & Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DsaHack Admin Console                          │
├─────────────────┬──────────────────────┬───────────────┬───────────────┤
│ [📊 Overview]   │ [📝 Question Bank]  │ [👥 Users]    │ [🏆 Contests] │
└─────────────────┴──────────────────────┴───────────────┴───────────────┘
  │
  ├─► [➕ Add Question] ────────► Modal: Title, Topic, Difficulty, Starter Code,
  │                              Sample Test Cases & Hidden Test Cases
  │
  ├─► [📥 Bulk Upload] ────────► Drag & Drop JSON or CSV (80-100 questions)
  │                              Validation Preview Table -> 1-Click Commit
  │
  ├─► [🏷️ Topics & Level] ────► Bulk filter, re-categorize, and difficulty audit
  │
  ├─► [👁️ Publish / Hide] ─────► Instant toggle: 'Published' vs 'Draft'
  │
  └─► [🗑️ Delete / Edit] ──────► In-place editing and safe deletion confirmation
```

### Key Workflows:
1. **Manual Question Creator / Editor**:
   - Comprehensive form with title, slug, topic (from 18 Core DSA topics), difficulty (`Easy`, `Medium`, `Hard`), description (Markdown support), constraints, and starter code templates for Java, Python, C++, C, and JavaScript.
   - Separate tabs/sections for **Sample Test Cases** (visible in problem description) and **Hidden Test Cases** (used for automated solution evaluation).
2. **Bulk Upload Modal (JSON & CSV)**:
   - **JSON Format**: Direct support for array of standard Problem objects.
   - **CSV Format**: Supports columns: `title, topic, difficulty, acceptance, description, sample_input, sample_output, hidden_input, hidden_output, company_tags`.
   - **Validation Engine**: Real-time syntax check, preview grid displaying detected rows, and count of valid vs invalid entries prior to committing.
3. **Publish / Unpublish Status**:
   - Adds an `isPublished: boolean` flag (default `true`).
   - Unpublished problems show a "Draft" badge in the admin table and are filtered out from the public student listing.
4. **Export & Backup**:
   - Download the entire problem set as JSON for backup and migration.

---

## 3. Technical Architecture & Component Flow

```
┌──────────────────────────────────────────────────────────────┐
│                           App.tsx                            │
│  State:                                                      │
│  - user: UserProfile | null (role: 'student' | 'admin')      │
│  - problems: Problem[] (initialized from INITIAL_PROBLEMS    │
│    + localStorage custom store)                              │
└──────────────┬───────────────────────────────┬───────────────┘
               │                               │
       (role === 'admin')             (isPublished !== false)
               │                               │
               ▼                               ▼
┌──────────────────────────────┐  ┌────────────────────────────┐
│      AdminDashboard.tsx      │  │   Student-Facing Views     │
│  - CRUD Handlers             │  │   - DsaQuestionListingPage │
│  - Bulk JSON/CSV Parser      │  │   - LanguagePracticePage   │
│  - Test Cases Editor         │  │   - CodingWorkspace        │
│  - Publish Toggle            │  │   - DailyChallengePage     │
└──────────────────────────────┘  └────────────────────────────┘
```

### Zero-Breakage Guarantee:
- **No changes to authentication logic**: Public signup and login flows continue to register and authenticate students normally.
- **No changes to profile stats, streaks, bookmarks, or submissions**: All existing `UserProfile` structures and `localStorage` keys remain untouched.
- **Backward Compatible Types**: All new fields (`isPublished?: boolean`, `hiddenTestCases?: TestCase[]`) are optional with sensible defaults.

---

## 4. Files Requiring Modification (When Approved)

| File | Proposed Change |
|---|---|
| `src/types.ts` | Add optional `isPublished?: boolean` and `hiddenTestCases?: TestCase[]` to `Problem`. Ensure `AdminDashboard` is recognized in `ScreenId`. |
| `src/App.tsx` | Elevate problems state so mutations in `AdminDashboard` reflect across the student views; add admin route guarding and admin dashboard rendering. |
| `src/views/AdminDashboard.tsx` | Upgrade existing placeholder with complete implementation: CRUD, JSON/CSV bulk importer, sample/hidden test cases manager, publish toggles, and filters. |
| `src/components/Navbar.tsx` | Conditionally display an "Admin Console" badge/link in the navigation bar when `user?.role === 'admin'`. |
| `src/views/DsaQuestionListingPage.tsx` | Receive dynamic `problems` prop (or default to existing list) and filter out drafts (`p.isPublished !== false`). |
| `src/views/LanguagePracticePage.tsx` | Receive dynamic `problems` prop and filter out drafts. |

---

## 5. Preview of Supabase Database SQL (For Your Inspection Only)

*(Note: As requested, this will NOT be executed until you review and confirm)*

```sql
-- DsaHack Problems Table Schema
CREATE TABLE IF NOT EXISTS public.problems (
  id TEXT PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
  topic TEXT NOT NULL,
  language_tags TEXT[] DEFAULT ARRAY['java', 'python', 'javascript', 'cpp', 'c'],
  acceptance TEXT DEFAULT '50.0%',
  description TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  constraints TEXT[] DEFAULT ARRAY[]::text[],
  hints TEXT[] DEFAULT ARRAY[]::text[],
  starter_code JSONB NOT NULL DEFAULT '{}'::jsonb,
  test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  hidden_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  company_tags TEXT[] DEFAULT ARRAY[]::text[],
  is_published BOOLEAN DEFAULT true,
  is_daily BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Public students can only read published questions
CREATE POLICY "Public students can read published questions"
  ON public.problems FOR SELECT
  USING (is_published = true);
```

---

## Next Steps

1. Click **Proceed** to approve this plan.
2. I will implement the Admin Dashboard in `src/views/AdminDashboard.tsx` and wire it safely through `src/types.ts`, `src/App.tsx`, and `src/components/Navbar.tsx`.
3. All existing features, authentication, and user data will remain completely intact.
