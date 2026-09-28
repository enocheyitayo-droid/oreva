# Orẽva owner access and deployment

## Start using the owner dashboard locally

With the local server running, open http://127.0.0.1:3100/admin/setup on this computer. Choose your own email and a unique password of at least 14 characters. After account creation this setup route closes. Sign in at /admin. Four quick clicks/taps on the HEADER logo also open /admin; this shortcut does not bypass authentication.

Products: Add product, upload JPEG/PNG/WebP from your device, enter real name/description/category, price and supplier cost, colour/size variants and physical quantities, then save. Use Edit to change these later. Delete removes a product from the catalogue and preserves historical orders. Inventory supports audited quantity adjustments. Stock already reserved cannot be reduced below active reservations.

Settings: Homepage display pictures has separate bag and slip-on uploads. These replace the former illustrated sample panels once uploaded. Use photos you are entitled to publish. Display photos are style inspiration, not inventory; create a product separately to sell it. The requested Coach bag/slip-on photos are not included because they have not yet been supplied.

Samples have been removed from the active local catalogues. The release ZIP contains no database, owner credentials, customer records or sample seed data. A newly started database is empty.

## What is deployed

The public site is hosted at `https://oreva-ashy.vercel.app`. The frontend and the first serverless API route run on Vercel. The catalogue route reads the public catalogue RPC from Supabase. Owner tools, uploads, order management and checkout have not yet been migrated from the local Node/SQLite backend, so those features are not functional on the hosted site yet.

## Vercel and Supabase setup

The current serverless slice requires these Vercel Production environment variables:

`SUPABASE_URL` — the HTTPS project URL, for example `https://PROJECT.supabase.co`.

`SUPABASE_ANON_KEY` — the project's public anon/publishable key. This is not the service-role key.

Set them in Vercel Project Settings → Environment Variables, then redeploy. The `/api/shop` function reads the `bagz_catalogue` RPC. Its Supabase migrations must already be applied and the public catalogue RPC must be available.

The site currently returns JSON for unimplemented API routes rather than pretending they work. Owner login/dashboard, product writes, image uploads, persistent orders, stock reservations, notifications, and checkout still need to be migrated to Vercel Functions and Supabase before the store is operational. Do not add a service-role key to frontend code or expose it in the browser. Checkout remains closed until the transaction and payment-verification paths are implemented and tested.

## Payments are a separate activation step

Paystack and email activation are not part of the current serverless slice. Do not configure live payments. The webhook endpoint and transactional order workflow must be migrated and validated before enabling any checkout.

## Verification

The existing SQLite backend tests remain in place. `test/vercel-api.test.mjs` covers the Vercel catalogue function and its missing-configuration response. Hosted Supabase/Vercel integration and all commerce APIs remain untested until the remaining migration is complete.
