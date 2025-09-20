# QuickTechPro API (Auth-first)

NestJS-style API scaffolding focused on authentication & RBAC per "Authentication Must‑Haves".

## Stack
- NestJS 10, Passport-JWT, JWT access tokens
- Prisma ORM (PostgreSQL) — schema for Auth only
- Bcrypt password hashing, TOTP 2FA (speakeasy)

## Run (after deps installed)
- `cp .env.example .env` and set `DATABASE_URL`, JWT secrets
- `npm install` (workspace root) — then:
- `npm run prisma:generate --workspace @quicktechpro/api`
- `npm run prisma:migrate --workspace @quicktechpro/api` (or `prisma db push` for dev)
- `npm run start:dev --workspace @quicktechpro/api`

## Database Schema (Auth)
Key models in `prisma/schema.prisma`:
- `User`: email, phone, passwordHash, verification, marketing opt-ins, privacy acceptance, active flag
- `Role` + `UserRole`: RBAC (customer, admin, technician, etc.)
- `RefreshToken`: hashed refresh tokens, expiry, userAgent/IP, revoke support
- `VerificationToken`, `PasswordResetToken`
- `TotpSecret` + `TotpRecoveryCode`
- `AuthAttempt`: login audit + rate-limit support

Seed roles suggested: `customer`, `admin`, `manager`, `technician`, `content_moderator`.

## Endpoints (JSON)
- `POST /auth/register` { email, password, name?, phone?, acceptPrivacy, marketingEmailOptIn?, marketingSmsOptIn? }
- `POST /auth/login` { email, password, remember?, captcha? } → { accessToken, refreshToken, tfaEnabled }
- `POST /auth/refresh` { refreshToken }
- `POST /auth/logout` { refreshToken? }
- `POST /auth/logout-all` (use `Authorization` bearer and call `/auth/logout` without token to revoke all)
- `POST /auth/password/request-reset` { email }
- `POST /auth/password/reset` { token, newPassword }
- `POST /auth/password/change` (auth) { currentPassword, newPassword }
- `POST /auth/verify-email` { token }
- `POST /auth/resend-verification` { email }
- `POST /auth/2fa/setup` (auth) → { otpauthUrl, base32 }
- `POST /auth/2fa/verify` (auth) { token } → enables 2FA
- `POST /auth/2fa/disable` (auth)
- `POST /auth/2fa/recovery-codes` (auth) → { codes[] }
- `POST /auth/2fa/verify-recovery` (auth) { token }
- `POST /auth/history` (auth) → recent login attempts

RBAC example:
- `GET /users/me` (auth) → current user payload
- `GET /users/admin/ping` (auth + RolesGuard) → requires role `admin` AND 2FA enabled

## Security Notes
- Access tokens (15m); refresh tokens (30d) hashed in DB; revoke on logout/password change
- Basic account lock / captcha gate: after 5 failed attempts in 15m, `captcha` is required
- Admin endpoints require 2FA (guard checks `tfa` claim in access token)
- Email/SMS delivery is stubbed in `MailService` (integrate SendGrid / MSG91 later)

## Next Steps
- Choose provider(s): email (SendGrid), SMS/WhatsApp (MSG91/Twilio), Redis for session invalidation
- Add Google login via `passport-google-oauth20` (optional per must‑haves)
- Add rate limiting middleware, CAPTCHA verification (hCaptcha/ReCAPTCHA) integration
- Hook to the web app (Next.js) with a typed client and auth context

