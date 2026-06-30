# Logging Middleware + React Frontend

## Structure

```
logging-app/
├── logger-package/        # reusable Log(stack, level, package, message) package
│   ├── src/
│   │   ├── types.ts       # allowed stack/level/package values + request/response types
│   │   ├── logger.ts      # Log() + configureLogger()
│   │   └── index.ts       # public exports
│   ├── package.json
│   └── tsconfig.json
└── frontend-app/          # React (Vite) app that consumes log-middleware
    ├── src/
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── .env.example
```

## How it works

`Log(stack, level, package, message)` builds the request body exactly as the
test server expects:

```json
{ "stack": "frontend", "level": "error", "package": "component", "message": "..." }
```

and POSTs it to `http://4.224.186.213/evaluation-service/logs`. It validates
nothing client-side beyond TypeScript types — the `Stack`, `Level`, and
`Package` unions in `types.ts` already restrict callers to the exact allowed
values from the spec, so a bad call fails at compile time rather than runtime.

The React app (`App.tsx`) calls `Log(...)` at meaningful points: on mount,
on a validation warning, on successful state changes, and on errors — instead
of one generic "did something" message, each call describes the specific
event and any relevant data (e.g. the item's id).

## ⚠️ One assumption I made

The spec says the Log API is a **protected route**, but the screenshots
don't show the auth mechanism (token format, header name, login endpoint,
etc). I wired up `Authorization: Bearer <token>` via `configureLogger()`,
reading the token from `VITE_API_AUTH_TOKEN` in `.env`. If your actual auth
scheme is different (e.g. an `X-API-Key` header, or a token obtained from a
`/login` endpoint), tell me and I'll update `logger.ts` accordingly.

## Running it

```bash
# 1. Build the logger package
cd logger-package
npm install
npm run build

# 2. Set up and run the frontend
cd ../frontend-app
cp .env.example .env   # then fill in your real token
npm install
npm run dev
```

Open the printed local URL — you'll see a simple item list where every
add/remove/validation action also fires a `Log()` call you can verify against
the test server's response (`logID` + "log created successfully").
