# EM Admin

Nuxt 4 / Vue 3 JavaScript frontend for online game administration. The Go API is in `../em-admin-backend`.

## Run

```bash
npm ci
cp .env.example .env
npm run dev
```

`NUXT_PUBLIC_API_BASE` includes `/api/v1`, for example `http://localhost:8080/api/v1`. Allow the frontend origin and Authorization header in backend CORS. For production, set this variable to the public API address. Public runtime config must contain no secrets.

## Project pattern

Use one flow for each feature: **page/component → Pinia store → controller → service → API client → Go API**.

- `app/features/<feature>/service.js`: endpoint paths and request payloads only; services receive an API client.
- `app/features/<feature>/controller.js`: testable feature logic with injected services, using `useApiAction` for loading, errors, duplicate-request protection, and reset behavior.
- `app/features/<feature>/store.js`: shared reactive state and feature actions. Users owns filters, pagination, and view preferences; Auth owns login/logout.
- `app/features/<feature>/components/`: feature-specific UI. User display helpers live alongside the feature in `display.js`.
- `app/stores/session.js`: shared cookie-backed authentication token.
- `app/pages/`: Nuxt routes. `app/components/ui/` holds shared UI.
- `app/composables/useApiClient.js`: configured API transport. `utils/apiClient.js` applies Bearer headers and handles current-session HTTP 401 responses.
- `app/utils/apiResponse.js`: normalize success payloads and errors. List totals remain on the response envelope.
- `app/composables/useAuth.js` and `useUsers.js`: optional adapters returning reactive refs and store actions through `storeBindings`.
- Pages own temporary form values and dialog visibility. Components receive props and emit events. Backend permissions remain authoritative.

## Add a feature

Create `app/features/<feature>/` and start with its service and API contract, then add a controller and Pinia store as needed. Keep route pages in `app/pages/<feature>/`. Register its component directory in `nuxt.config.js` with a feature prefix (for example `Roles`). Import feature stores explicitly. Roles currently contains service/controller placeholders; Permissions is an empty scaffold. Use `storeToRefs` when destructuring state; destructure actions directly. Avoid copying store loading/error state into extra refs.

```js
import { useUsersStore } from '~/features/users/store.js'

const users = useUsersStore()
const { users: rows, createPending, createError } = storeToRefs(users)

async function save(form) {
  try {
    await users.createUser(form)
  } catch {
    // Display createError in the form; close the dialog only after success.
  }
}
```

Use `useApi` for independent setup-time queries that do not need shared feature state. Keep feature lists and mutations in their store. Call actions during setup/onMounted or UI events; don't create stores at module scope. Shared state persists across navigation within the current app/session, not in localStorage.

## Authentication

Login sends `{ auth: { username, password } }` to the Go API. `useAuthToken` returns the session store's single cookie-backed token ref. The `em-auth-token` cookie preserves login on refresh, uses SameSite=Lax and Secure on HTTPS, and is readable by JavaScript for direct Bearer requests. Protected pages use `definePageMeta({ middleware: 'auth' })`; middleware reads the session store without creating authentication actions.

Logout clears the token after backend success or an HTTP 401 indicating an expired/revoked session. Other failures keep the token and expose `logoutError`. Password changes clear the session and redirect to login. Token changes reset authentication actions and user state; delayed responses cannot restore old account data. A stale HTTP 401 for an earlier token cannot clear a newer login. Screens handle API errors; protected-route checks apply on navigation.

## Validation

Run `npm test` for controller, store, API transport, and authentication tests. Run `npm run build` for production compilation. Verify live login/logout and user operations against your configured development backend; automated tests use injected services and don't change live accounts.

Never edit generated `.nuxt/`, `.output/`, or `node_modules/` files.
