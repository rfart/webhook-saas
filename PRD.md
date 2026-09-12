# Product Requirements Document (PRD)
## Webhook & API Payload Catcher (Lead Generation Edition)

### 1. Product Overview
The Webhook & API Payload Catcher is a lightweight, serverless developer utility designed to capture and inspect incoming HTTP requests. Commercially, it serves as a top-of-funnel lead generation magnet. By offering immediate, frictionless value (catching a payload), it builds trust before gating advanced features behind an email capture to build a targeted list of B2B developer leads.

### 2. Target Audience & Business Goal
*   **Engineering Leaders & Independent Developers:** Builders who need a reliable, zero-setup way to test webhooks from platforms like Stripe or GitHub.
*   **Business Goal:** Capture verified contact information from these developers to upsell API consulting, premium developer tools, or enterprise SaaS integrations.

### 3. Key Features
*   **Instant Payload Capture (The Bait):** Frictionless endpoint generation to receive requests. The user sees the *most recent* payload for free, anonymously.
*   **Contextual Feature Gating (The Hook):** To view the last 50 payloads or share a persistent link with a team, the user must sign in. Sign-in is Google OAuth only — no email input, no password, no magic link. The gate is triggered by clicking "View Full History" (shown to anonymous users as blurred placeholder rows) or "Share with Team".
*   **Automated Data Retention Policy:** A background cron job deletes payloads older than 24 hours to enforce free-tier limits.
*   **Real-Time Inspection UI:** A dashboard displaying headers, query parameters, and raw JSON bodies.

### 4. Technical Architecture
*   **Frontend (Vercel):** Next.js dashboard for rendering the UI.
*   **API Layer (Vercel Edge Functions):** Serverless endpoints to instantly catch incoming webhooks without cold starts.
*   **Database (Supabase PostgreSQL):** Stores the raw payloads and the captured lead data.
*   **CRM/Email Automation Layer:** Integration with a tool like Resend or HubSpot. Captured emails trigger automated marketing sequences.

### 5. Data Model (MVP)
*   **Leads Table:** `id` (UUID), `email` (String), `name` (Text), `captured_at` (Timestamp), `source_action` (String — e.g., "google_oauth").
*   **Webhooks Table:** `id` (UUID), `lead_id` (FK, nullable for anonymous users), `method`, `headers`, `payload`, `received_at`.
*   **Endpoints Table:** `id` (UUID), `lead_id` (FK → leads, nullable), `created_at` (Timestamp), `label` (Text).
*   **Endpoint Shares Table:** `id` (UUID), `endpoint_id` (FK → endpoints), `shared_by` (FK → leads), `share_token` (Text, UNIQUE), `created_at` (Timestamp).

### 6. Free Tier Optimization Strategy
*   **Storage:** Relies on the 24-hour aggressive retention policy via `pg_cron` to stay well under Supabase's 500MB free database limit.
*   **Compute:** Vercel Edge functions process the incoming webhook traffic to prevent backend bottlenecks and server costs.

### 7. MVP (Minimum Viable Product) Definition
*   A single "Generate Endpoint" button creating a unique URL.
*   A Next.js frontend displaying the *most recent* payload instantly without login.
*   A Google Sign-In modal (OAuth only) that triggers when the user clicks "View Full History" or "Share with Team".
*   A Vercel Edge function inserting payloads into Supabase.
*   A Supabase database trigger that routes captured emails directly to your mailing list.

### 8. Lead Generation Strategy (Concrete Actions)
*   **Frictionless First Value:** Do not ask for sign-in upfront. Let the user send a webhook and see the most recent payload appear on screen instantly.
*   **The "Team Share" Trigger:** Developers rarely work alone. The "Share with Team" button generates a secure link gated behind Google Sign-In, capturing a high-intent verified lead automatically.
*   **Automatic Lead Capture:** On first Google OAuth sign-in, the callback route upserts the user's verified email and display name into the `leads` table (source_action = "google_oauth") with no form interaction required.
*   **Automated Drip Campaign:** Once the lead row exists, trigger an automated 3-part email sequence.
    *   *Email 1 (Immediate):* "Here is your webhook history link."
    *   *Email 2 (Day 3):* "Best practices for handling webhook security."
    *   *Email 3 (Day 7):* The pitch for your paid consulting, primary application, or paid tier.

### 9. Out of Scope (Post-MVP)
*   Custom domains for individual users.
*   Advanced payload searching or filtering capabilities.

### 10. Domain & Infrastructure Strategy
*   **Registrar Procurement:** Purchase a lean domain (`.dev` or `.tools`) through Cloudflare at wholesale cost.
*   **Subdomain Routing:** Serve the Next.js landing page on the apex domain, and map the serverless catch endpoints to a dedicated subdomain (`api.webhookcatcher.dev`).

### 11. SEO & Discoverability
*   **Next.js Metadata API:** Leverage the native `generateMetadata` function for dynamic rendering. Delegating this specific Open Graph implementation is a perfect, contained ticket to assign to junior developers while you handle the database architecture.
*   **Search Intent Targeting:** Optimize landing page copy for queries like "free webhook inspector," or "test API payloads serverless."
*   **Technical SEO:** Include a dynamic `sitemap.xml` and `robots.txt` for immediate indexing.

### 12. Authentication Strategy
*   **Provider:** Google OAuth exclusively, via Supabase Auth. All other providers (email/password, magic link, OTP, phone) must be disabled in the Supabase dashboard.
*   **No email inputs:** There must be no `<input type="email">` or any manual credential form anywhere in the UI. Authentication is initiated solely by clicking "Continue with Google".
*   **Session management:** Cookies are managed by `@supabase/ssr`. `createServerClient` is used in Server Components and Route Handlers (with cookie access); `createBrowserClient` is used in Client Components. A `src/middleware.ts` refreshes the session on every request.
*   **Disabled permanently:** `signInWithPassword`, `signInWithOtp`, `signInWithMagicLink`, and any email `<input>` field.
*   **Lead capture:** The `/api/auth/callback` Route Handler exchanges the OAuth code for a session, then upserts the user's Google email + display name into the `leads` table using the service_role client (bypasses RLS). No user action beyond the Google consent screen is required.
*   **Supabase dashboard config:** Authentication → Providers: enable Google only. Authentication → Email: disable all.