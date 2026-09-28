# Orẽva — source repository

Updated branding and five owner-supplied display photos are included. Images are inspiration, not products with invented stock or prices.

## Run locally
Requires Node.js 24.13 or newer. Run npm ci, copy .env.example to .env, then npm start. Checkout is disabled by default. Do not run the optional sample seed for a real catalogue.

## Git upload
Extract this ZIP and upload its contents to your repository. Never commit .env, database files, uploads containing private data, node_modules or deployment credentials. The included .gitignore excludes these.

## Deployment status — read before importing
This is the full source, not a finished Vercel serverless deployment. The current server uses local SQLite and a persistent Node process. Supabase catalogue rules and both owner assignments have been applied, but the website is not connected to Supabase yet. Cloud authentication, image handling, orders and payment adapters still need integration and tests. Do not deploy the existing SQLite server to ephemeral serverless storage.

Vercel Hobby is restricted to personal non-commercial use. A business storefront requires a commercial-eligible plan; Pro currently starts at USD 20/month plus additional usage/taxes. See https://vercel.com/docs/limits/fair-use-guidelines . No paid plan has been purchased and no live payments are enabled.

Existing Netlify build requires BACKEND_ORIGIN pointing to a persistent HTTPS backend. A Git push alone does not connect Supabase or Paystack.

Supabase migrations are included for reference. Do not rerun the already-applied initial migration. Hosted branding still needs updating when the cloud adapter is connected.
