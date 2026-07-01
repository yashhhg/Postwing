# Postwing

Full-stack implementation of the **Postwing** design (`Postwing.dc.html`) — a social-media
scheduling landing site with authentication and a "coming soon" gate.

- **Frontend** — Next.js (App Router, TypeScript). Renders the original design markup verbatim
  (pixel-identical) and is SEO / AEO / GEO friendly (metadata, JSON-LD, sitemap, robots).
- **Backend** — FastAPI + async SQLAlchemy.
- **Database** — PostgreSQL.
- **Auth** — email/password **and** Google OAuth, with DB-backed server sessions via an
  httpOnly cookie.

## Pages

| Route           | Description                                             |
| --------------- | ------------------------------------------------------- |
| `/`             | Landing page (indexable, structured data)               |
| `/login`        | Log in (email/password + Google)                        |
| `/register`     | Create account (email/password + Google)                |
| `/coming-soon`  | Shown after auth — **protected**, redirects to `/login` |

## Behaviour notes

- **Registering an already-registered email does not error.** The backend verifies the password
  and simply logs the user in instead. (A wrong password returns a clear message rather than
  silently signing someone into an existing account — that would be account takeover.)
- After a successful login or registration the user lands on `/coming-soon`.
- Google's buttons are fully wired; the flow activates as soon as you add credentials to
  `backend/.env`. Until then, clicking sends the user back with a friendly notice.

---

## 1. Start PostgreSQL

```bash
docker compose up -d db
```

(or point `DATABASE_URL` at any existing Postgres instance.)

## 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # then edit as needed
uvicorn app.main:app --reload --port 8000
```

Backend runs at http://localhost:8000 (docs at `/docs`). Tables are auto-created on startup.

## 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs at http://localhost:3000.

---

## Google OAuth setup (optional, add later)

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create an
   **OAuth 2.0 Client ID** (type: Web application).
2. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`.
3. Put the values in `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
   ```
4. Restart the backend. The "Continue with Google" buttons now work end-to-end.

---

## Regenerating the design

The three screens in `frontend/lib/screens/*.ts` are generated from the original
`_design_src/postwing-landing-page/project/Postwing.dc.html` export. To re-generate after a
design change:

```bash
cd frontend
npm run gen:design
```

## Environment variables

### `backend/.env`
| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | Async Postgres URL (`postgresql+asyncpg://...`) |
| `SECRET_KEY` | Signs session/OAuth state — set a long random value |
| `FRONTEND_ORIGIN` | Allowed CORS origin (the Next.js app) |
| `FRONTEND_POST_LOGIN_URL` | Where Google callback redirects on success |
| `COOKIE_SECURE` / `COOKIE_SAMESITE` / `COOKIE_DOMAIN` | Session cookie settings (set `COOKIE_SECURE=true` in production) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` | Google OAuth |

### `frontend/.env.local`
| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL used by the browser |
| `API_URL` | Backend base URL used by Next.js server (route guard) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO metadata |

## API

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register (or log in if email already exists + password matches) |
| `POST` | `/api/auth/login` | Log in |
| `GET`  | `/api/auth/me` | Current user (from session cookie) |
| `POST` | `/api/auth/logout` | Clear session |
| `GET`  | `/api/auth/google/login` | Start Google OAuth |
| `GET`  | `/api/auth/google/callback` | Google OAuth callback |
| `GET`  | `/api/config` | Whether Google login is configured |
