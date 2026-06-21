# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server at http://localhost:3000 (runs via CRACO).
- `npm run build` — production build to `build/`.
- `npm test` — Jest in watch mode. Run a single test: `npm test -- --testPathPattern=App.test.js` (or pass `-t "<test name>"`).
- No lint script is wired up; ESLint runs via `react-scripts` during `start`/`build` (config in `package.json` → `eslintConfig`).

## Environment variables (CRA — must be `REACT_APP_*`)

- `REACT_APP_PROTACC_API_BASE_URL` — backend root; client prepends `/api/v1` (see `src/services/api.js`).
- `REACT_APP_SITE_URL` — canonical site URL used for SEO/JSON-LD (`src/config/seo.js`).
- `REACT_APP_RAZORPAY_KEY_ID` — Razorpay checkout key.
- `REACT_APP_GA_MEASUREMENT_ID` — Google Analytics ID (`src/components/GoogleAnalytics.js`).
- `REACT_APP_ENABLE_LOGS` — when `'true'`, turns on axios request/response logging.

`.env.*` files are gitignored.

## Architecture

Create React App + CRACO (CRACO only exists to wire up Tailwind/PostCSS and enable SPA history fallback — see `craco.config.js`). Styling is Tailwind v4 with a custom `primary` color scale in `tailwind.config.js`.

### Routing (`src/App.js`)

Two top-level route trees, intentionally separate:

1. `admin/*` — rendered **outside** `Layout` so it has no public header/footer. Gated by `<ProtectedRoute roles={['admin']}>`. The actual admin sub-routes (`/users`, `/orders`, `/services`, `/leads`, `/contacts`, `/settings`, `/priority`, `/reports`) are declared inside `src/pages/admin/Dashboard.js`, not `App.js`.
2. `/` — wrapped in `Layout` (header + footer). Public pages plus protected user pages (`profile`, `cart`, `orders`, `orders/:orderNumber`). Auth pages use `<RedirectIfAuthenticated>` to bounce already-signed-in users.

`ScrollToTop` and `GoogleAnalytics` are mounted inside `<Router>` so they can hook into route changes.

### Auth & token lifecycle

- `src/context/AuthContext.js` is the single source of truth for `user`/`token`, persisted to `localStorage` under `protacc_auth_token` and `protacc_user`. `login()` writes to `localStorage` **before** setting React state so subsequent API calls (e.g. cart fetch) see the token synchronously.
- `src/services/api.js` is the centralized axios client:
  - Request interceptor reads `protacc_auth_token` from localStorage on every call.
  - Response interceptor on 401 clears the token and hard-redirects to `/login` — **except** for auth endpoints in `AUTH_ENDPOINTS_NO_REDIRECT` (login/signup/forgot/reset/verify), where a 401 means "wrong credentials" and must surface to the form.
  - All API functions follow the pattern `throw error.response?.data?.error || '<fallback msg>'`; callers should `try/catch` and toast the thrown string.
- `withCredentials: true` — backend may set cookies in addition to the bearer token.

### Cart state (`src/context/CartContext.js`)

Non-trivial — read before changing. Uses refs (`fetchingRef`, `pendingRefreshRef`, `lastFetchTimeRef`, `fetchIdRef`) to:
- de-duplicate concurrent fetches,
- throttle to one fetch per second (unless `force=true`),
- coalesce a `force` refresh that arrives mid-fetch into a single trailing refresh,
- discard stale responses via `fetchId` comparison.

`addToCartState` inserts a `isPlaceholder: true` row immediately for optimistic UX; `addToCartSmart` does the optimistic insert *then* refetches authoritative cart from server. The provider clears items when `isAuthenticated` flips false.

### API surface

All backend calls live in `src/services/api.js` (single file, ~800 lines). Group naming convention: `getX/createX/updateX/deleteX`. Admin endpoints are prefixed `/admin/*`; same resource often has both a user-scoped and admin-scoped function (e.g. `addOrderDocument` vs `addAdminOrderDocument`, `getOrderDocuments(orderId, isAdmin)`).

### SEO

- `src/components/Seo.js` imperatively upserts `<meta>`, `<link rel="canonical">`, and JSON-LD `<script>` tags on `document.head` — no `react-helmet`. Mount it once per page.
- Page metadata in `src/config/seo.js` (`PAGE_SEO` map); JSON-LD builders in `src/utils/structuredData.js`.
- Static SEO assets: `public/sitemap.xml`, `public/robots.txt`, `public/_redirects` (SPA fallback for Netlify-style hosts).

### Payments

Razorpay integration in `src/utils/orderPayment.js` and payment APIs in `api.js` (`createPaymentOrder`, `verifyPayment`, `getPaymentStatus`). Order state helpers — `isOrderFullyPaid`, `isOrderPendingBookingPayment` — encode the booking-then-final two-stage payment flow; reuse them rather than re-checking `order.status` strings ad hoc.

### Google Drive documents

`src/utils/googleDrive.js` parses share URLs (file, folder, doc, sheet, `?id=` forms) into `{ embedUrl, downloadUrl, viewUrl }`. Files must be shared "Anyone with the link" for embeds to render. Used by `OrderDocumentsSection`.

## Conventions

- JS only (no TS). `.js` for both components and modules.
- Path aliases are not configured — use relative imports.
- Toasts via `react-hot-toast` (single `<Toaster>` mounted in `App.js`).
- Forms use Formik + Yup.
- Icons via `react-icons`.
