// Re-exports createBrowserSupabaseClient for use in Client Components.
// Kept separate from ssr-server.ts to make the server/client boundary explicit.
export { createBrowserSupabaseClient } from './client'
