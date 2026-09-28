# Orẽva — source repository

Updated branding and five owner-supplied display photos are included. Images are inspiration, not products with invented stock or prices.

## Run locally
Requires Node.js 24.13 or newer. Run npm ci, copy .env.example to .env, then npm start. Checkout is disabled by default. Do not run the optional sample seed for a real catalogue.

## Git upload
Extract this ZIP and upload its contents to your repository. Never commit .env, database files, uploads containing private data, node_modules or deployment credentials. The included .gitignore excludes these.

## Deployment status — read before importing
The public frontend is hosted on Vercel. The first Vercel Function serves `/api/shop` from the Supabase `bagz_catalogue` RPC. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel and redeploy to enable that route. Owner tools, uploads, orders and checkout are not yet migrated. The original local Node server uses SQLite and is not suitable for ephemeral serverless storage.

Vercel Hobby is restricted to personal non-commercial use. A business storefront requires a commercial-eligible plan; Pro currently starts at USD 20/month plus additional usage/taxes. See https://vercel.com/docs/limits/fair-use-guidelines . No paid plan has been purchased and no live payments are enabled.

Vercel is not yet connected to the existing Supabase project until its environment variables are set. A Git push alone does not configure the database or enable checkout.

Supabase migrations are included for reference. Do not rerun the already-applied initial migration. Hosted branding still needs updating when the cloud adapter is connected.
