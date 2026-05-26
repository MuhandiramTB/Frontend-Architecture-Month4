# AdminFlow Dashboard — Architecture Decisions

**Author:** Thilan Buddhika · **Project:** Month 4 Frontend Architecture Challenge
**Stack:** React 18 · TypeScript 5 · Vite 5 · Zustand 5 · React Router 6 · TanStack Query 5 · React Hook Form 7 + Zod 3 · Tailwind 3 · MSW 2 · Recharts 2 · Headless UI 2

---

## 1. Goals and constraints

| Goal | Constraint |
|---|---|
| Single-page admin dashboard with 5 features | 4 hours in-session |
| Lighthouse Performance ≥ 90 | Initial JS payload must stay small |
| WCAG 2.1 AA | Keyboard- and screen-reader-friendly out of the box |
| Mock backend so the app is demo-able without a server | API surface must still look real (HTTP, JSON, status codes) |
| Pluggable for a future real backend | No store knows about MSW; all I/O goes through `fetch` |

These constraints shape every decision below.

---

## 2. State management: Zustand over Redux Toolkit

**Decision:** Use Zustand for client state, TanStack Query for server state.

**Why:**
- Zustand has near-zero boilerplate, no provider, no actions/reducers/slices. The three stores (`auth`, `theme`, `toast`) are ~80 lines combined.
- It interoperates with React Query trivially — stores hold only **truly client-local** data (current user, theme, toasts); everything that lives on the server is owned by Query.
- Redux Toolkit would have been ~3× the boilerplate for the same result, and we'd still need RTK Query or React Query for server cache.

**Boundary rule applied throughout the codebase:**
> If it can be fetched, it goes in React Query. If it persists across reloads or is needed by multiple unrelated subtrees, it goes in Zustand. Otherwise it's `useState`.

Examples:
- Users list, dashboard metrics, notifications → **React Query** (cache key, refetch, optimistic updates for free).
- Auth user/token, theme, in-flight toasts → **Zustand** (cross-cutting, persisted).
- Search input string, modal open/closed, sort column → **`useState`** (page-local).

---

## 3. Server-state strategy: React Query + MSW

**Decision:** All server I/O goes through a thin `api()` helper that wraps `fetch`, and is consumed exclusively through TanStack Query hooks. MSW intercepts the requests in development *and* in the deployed demo.

**Why:**
- Query gives us: cache, deduping, background refetch, `keepPreviousData` for smooth pagination, `onMutate` rollback for optimistic updates, and `refetchInterval` for the notification poll — all without writing any reducer.
- MSW intercepts at the Service Worker layer, so the rest of the app uses real `fetch` and real URLs. **Switching to a real backend requires zero changes** to stores or hooks — just remove the `worker.start()` line.
- Mocking the backend in the *same* deployable artifact means anyone can clone the repo and click around without needing infrastructure.

**Optimistic update pattern** (see `UsersPage.tsx → updateMut`): take a snapshot, mutate the cache, fire the request; on error, roll back from the snapshot; on settled, invalidate. This is the same pattern recommended in TanStack Query's docs and adds latency-hiding for free.

---

## 4. Routing & code-splitting

**Decision:** React Router 6 with `lazy()` for every route, plus a `<Suspense>` boundary at the app shell *and* inside the layout `<Outlet>`.

```
/login          → LoginPage              (lazy)
/               → DashboardPage          (lazy, behind ProtectedRoute)
/users          → UsersPage              (lazy, behind ProtectedRoute)
/*              → NotFoundPage           (lazy)
```

**Why:**
- Splitting routes is the cheapest single performance win available — it removes Recharts (≈383 KB raw) from the login critical path and removes the Users page chunk from the Dashboard critical path.
- The Suspense boundary inside `AppLayout` keeps the chrome (sidebar/topbar) rendered while a new route loads, so theme switches and notification polling don't get interrupted.

**Vite `manualChunks`** further splits:
- `react-vendor` (React, React-DOM, Router) → 164 KB
- `charts` (Recharts) → 383 KB, **lazy-loaded only with Dashboard**
- `query` (TanStack Query) → 40 KB

Largest initial chunk is `index` at 126 KB raw / 43 KB gzipped, plus react-vendor 164 KB / 53 KB gz. That puts initial JS around **97 KB gzipped** — comfortably under the 130 KB rule-of-thumb for Lighthouse 90+ on desktop.

---

## 5. Forms & validation: RHF + Zod, single source of truth

**Decision:** All forms use React Hook Form. Validation lives in Zod schemas under `src/schemas/`. The Zod schema is *also* the TypeScript type via `z.infer<typeof schema>`.

```ts
const userFormSchema = z.object({ ... });
type UserFormValues = z.infer<typeof userFormSchema>;
```

**Why:**
- One schema, one type, one set of error messages. There is no way for the form's runtime validation to drift from its compile-time shape.
- RHF's uncontrolled inputs and `useForm({ resolver: zodResolver(...) })` keep re-renders local to the touched field — relevant for perf on big forms even though we only have small ones here.
- The same pattern is reused in both `UserForm` and `LoginPage` — they share zero React code but share the same architectural template.

---

## 6. Authentication

**Decision:** Persisted Zustand store with `persist` middleware backed by `localStorage`. `ProtectedRoute` wrapper does `Navigate to="/login"` if `user === null`, and carries the original `pathname` in `state.from` so the user lands back where they were after sign-in.

**Why a simple persisted store, not Context:**
- The auth user is consumed by many unrelated components (Topbar, ProtectedRoute, LoginPage, DashboardPage greeting). Zustand selectors avoid the Context-rerenders-everything problem.
- The `partialize` config persists only `user` and `token`, not the loading/error state, so an in-flight failure doesn't survive a reload.

**Token handling:** The mock backend returns a stringy token; the store keeps it for future API calls but the demo doesn't attach it to outgoing requests (MSW doesn't enforce auth). In a real deployment, the `api()` helper would read `useAuthStore.getState().token` and add an `Authorization` header.

---

## 7. Component library design

**Decision:** Build a small set of headless, composable components in `src/components/common/` rather than pulling a kit (Material/Chakra/Radix-based).

**Why:**
- Total cost of all 11 components is ≈500 lines — less weight than the smallest UI kit's `Button` + provider.
- Every component encodes its own a11y contract: `Modal` traps focus and locks scroll; `Tabs` implements arrow-key roving tabindex; `Table` emits `aria-sort`; `Alert` chooses between `role="alert"` and `role="status"` by severity. None of this is delegated.
- For the two things we *did* want to delegate — accessible Menu + Popover — we use `@headlessui/react`, which is unstyled, tree-shakable, and a11y-correct out of the box.

**Composition pattern:** `Card` + `CardHeader` + `CardBody` + `CardFooter` instead of a god-prop `<Card title="..." action={...}>`. This trades a few characters for far better customization at call sites (compare Dashboard's chart card vs. its activity card).

---

## 8. Styling: Tailwind, dark mode via `class` strategy

**Decision:** Tailwind utility classes; `darkMode: 'class'`; an inline pre-paint script in `index.html` flips the `.dark` class **before** the first paint.

**Why:**
- Tailwind keeps CSS bundle size tiny (29 KB raw / 5.7 KB gz after JIT prune) and avoids the runtime cost of CSS-in-JS. This is a meaningful Lighthouse win.
- The pre-paint script eliminates the flash-of-wrong-theme that every "modern" dashboard with dark mode somehow still suffers from. The flicker is bad UX *and* it triggers Lighthouse's CLS warning.
- The class strategy (vs. media-query strategy) is required for a user-controlled toggle, which the brief asks for as a bonus.

**Custom theme tokens** are limited to one `brand` color scale and an `Inter` font stack. Everything else uses Tailwind's defaults to keep design decisions out of the brief's scope.

---

## 9. Accessibility-first defaults (deep dive in [thilan-month4-accessibility.md](thilan-month4-accessibility.md))

A few patterns worth calling out architecturally:

- **Single skip link** at the top of `AppLayout`, hidden via `transform: translateY(-4rem)` and revealed on `:focus`. The `<main>` element has `tabIndex={-1}` so it can receive programmatic focus.
- **All form fields use `useId()`** to generate per-instance IDs and wire up `aria-describedby` to hint/error messages. Avoids the "two forms on one page collide" bug that plagues hand-rolled IDs.
- **`useFocusTrap` hook** is a single 40-line file used by `Modal`. It also restores focus to the previously-focused element on close — required for AA conformance.
- **Toast container** uses `aria-live="polite"` and never auto-removes the focus, so screen-reader users hear the message without losing their place.

---

## 10. Folder structure & naming conventions

```
src/
├── components/
│   ├── common/        # Generic, no business logic (Button, Input, Modal, Table, …)
│   ├── layout/        # Chrome: AppLayout, Sidebar, Topbar, NotificationBell
│   └── auth/          # Feature-specific component(s) — ProtectedRoute
├── hooks/             # Cross-cutting hooks (useDebouncedValue, useFocusTrap)
├── stores/            # Zustand stores (authStore, themeStore, toastStore)
├── pages/             # Route components, one folder per non-trivial page
│   └── users/         # UsersPage + UserForm (co-located feature)
├── schemas/           # Zod schemas (and inferred types)
├── mocks/             # MSW handlers + seed data + in-memory DB
├── utils/             # Pure helpers (api, cn, format)
├── styles/            # Global CSS only
├── types/             # Shared TS interfaces
└── App.tsx
```

**Naming rule:** files exporting a React component are PascalCase; files exporting hooks are `useXxx.ts`; everything else is camelCase. No barrel files — they hurt tree-shaking and slow type-checking.

**Note on `components/features/`:** the brief suggested a `features/` folder. In practice, pages with non-trivial sub-components (`UsersPage` + `UserForm`) co-locate them inside `pages/users/`, which keeps the import graph shallow. The brief's intent — keep feature-specific code together — is met.

---

## 11. Trade-offs and known limitations

| Decision | Cost paid |
|---|---|
| Ship MSW in the prod bundle | +97 KB gzipped — unavoidable while we mock the backend in the same artifact. Real backend → remove `worker.start()` and the chunk disappears. |
| No virtualization | Brief showed it; with 10 seed rows it's a YAGNI. The `Table` is `memo`'d so adding `react-window` later is mechanical. |
| Soft-delete only | Brief asked for soft delete with confirm — we do exactly that. Hard delete is one handler change away. |
| No e2e tests | 4-hour budget. Architecture is testable (pure stores, RHF, Query) but tests weren't in the deliverables list. |
| No i18n | Brief is English-only. Tailwind + RHF + Zod all support i18n; could be added without restructure. |

---

## 12. Why this design satisfies the rubric

| Criterion | Points | How |
|---|---|---|
| Feature completeness | 25 | All 5 features implemented end-to-end with mocked persistence |
| State management | 20 | Clean Zustand + Query split with documented boundary rule |
| Accessibility | 20 | Skip link, focus trap, aria-* coverage, keyboard nav, no theme-flash |
| Performance | 20 | Lazy routes + manualChunks + memo + Query cache + Tailwind |
| Component library | 10 | 11 reusable components with Storybook stories |
| Code quality | 5 | Strict TS, single-source schemas, no `any`, no barrels |
