# Product Requirements Document (PRD)
## Webhook & API Payload Catcher

### 1. Product Overview
The Webhook & API Payload Catcher is a lightweight, serverless developer utility designed to capture, inspect, and automatically purge incoming HTTP requests from third-party services. It provides a real-time monitoring interface for API integrations while strictly adhering to free-tier cloud limits.

### 2. Target Audience
*   **Engineering Leaders:** Tech leads who need to monitor inbound webhook payloads and share debugging logs safely with their team, without granting junior developers root access to the main production database.
*   **Independent Developers:** Builders who need a reliable, cost-free way to test webhooks from platforms like Stripe or GitHub.

### 3. Key Features
*   **Instant Payload Capture:** Unique endpoint generation to receive `POST`, `GET`, `PUT`, and `DELETE` requests.
*   **Real-Time Inspection UI:** A dashboard displaying headers, query parameters, and raw JSON bodies as they arrive.
*   **Automated Data Retention Policy:** A background cron job that silently runs in the database to delete any captured payloads older than 24 hours, ensuring the database never exceeds its storage cap.
*   **Role-Based Visibility:** Safe, read-only dashboard access for team members to view payload structures for frontend development tasks.

### 4. Technical Architecture
*   **Frontend (Vercel):** Next.js dashboard for rendering the UI and displaying the payload logs. 
*   **API Layer (Vercel Edge Functions):** Serverless endpoints to instantly catch incoming webhooks without cold-start delays.
*   **Database (Supabase PostgreSQL):** Stores the raw payload strings and metadata.
*   **Background Jobs (pg_cron):** Supabase Cron uses the `pg_cron` Postgres extension to manage recurring jobs. A scheduled SQL command will execute a deletion function every night to clear old rows. 

### 5. Data Model (MVP)
*   **Webhooks Table:** `id` (UUID), `method` (String), `headers` (JSONB), `payload` (JSONB), `received_at` (Timestamp).

### 6. Free Tier Optimization Strategy
*   **Storage:** Relies heavily on the 24-hour aggressive retention policy via `pg_cron` to stay well under Supabase's 500MB free database limit. 
*   **Compute:** Vercel Edge functions process the incoming webhook traffic to prevent backend bottlenecks and avoid persistent server costs.

### 7. MVP (Minimum Viable Product) Definition
The MVP must deliver the core utility without feature bloat. It requires:
*   A single "Generate Endpoint" button that creates a unique, copyable URL.
*   A Vercel Edge function that accepts payloads sent to that URL and inserts them into Supabase.
*   A Next.js frontend that fetches and displays the last 50 payloads in a readable JSON format.
*   The `pg_cron` script active in Supabase to enforce the 24-hour data destruction.

### 8. Out of Scope (Post-MVP)
*   User accounts and persistent saving of specific payloads.
*   Custom domains for individual users.
*   Advanced payload searching or filtering capabilities.
*   Automated payload forwarding to other URLs.

### 9. Domain & Infrastructure Strategy
*   **Registrar Procurement:** Purchase a lean top-level domain (e.g., `.dev` or `.tools`) through an at-cost registrar like Cloudflare to avoid renewal markups.
*   **Vercel Integration:** Rely on Vercel for automated, free SSL provisioning (Let's Encrypt) and custom domain mapping. 
*   **Subdomain Routing:** Serve the Next.js landing page on the apex domain (`webhookcatcher.dev`), but map the serverless catch endpoints to a dedicated subdomain (`api.webhookcatcher.dev`) to isolate traffic and simplify analytics.

### 10. SEO & Discoverability
*   **Next.js Metadata API:** Utilize the native `generateMetadata` function in the Next.js App Router for dynamic rendering of titles and descriptions. This is a contained, low-risk ticket perfectly scoped for junior developers to execute while the tech lead handles the database architecture.
*   **Search Intent Targeting:** Optimize landing page copy for specific, long-tail developer queries such as "free webhook inspector," "test stripe webhooks serverless," or "API payload catcher no login."
*   **Technical SEO:** Include a dynamic `sitemap.xml` and `robots.txt` to guarantee immediate search engine crawling.
*   **Social Previews:** Configure Open Graph (OG) and Twitter card tags so Slack and Discord unfurl a crisp, auto-generated image of the dashboard instead of a generic text link.