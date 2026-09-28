# Orẽva owner access and deployment

## Start using the owner dashboard locally

With the local server running, open http://127.0.0.1:3100/admin/setup on this computer. Choose your own email and a unique password of at least 14 characters. After account creation this setup route closes. Sign in at /admin. Four quick clicks/taps on the HEADER logo also open /admin; this shortcut does not bypass authentication.

Products: Add product, upload JPEG/PNG/WebP from your device, enter real name/description/category, price and supplier cost, colour/size variants and physical quantities, then save. Use Edit to change these later. Delete removes a product from the catalogue and preserves historical orders. Inventory supports audited quantity adjustments. Stock already reserved cannot be reduced below active reservations.

Settings: Homepage display pictures has separate bag and slip-on uploads. These replace the former illustrated sample panels once uploaded. Use photos you are entitled to publish. Display photos are style inspiration, not inventory; create a product separately to sell it. The requested Coach bag/slip-on photos are not included because they have not yet been supplied.

Samples have been removed from the active local catalogues. The release ZIP contains no database, owner credentials, customer records or sample seed data. A newly started database is empty.

## What is deployed

The public site is hosted at `https://oreva-ashy.vercel.app`. Vercel serves the frontend and proxies `/api/*` and `/uploads/*` to the backend. The Node/SQLite backend needs a persistent disk, so it is not provided by this static Vercel deployment. No backend has been deployed or paid service purchased.

## Deploy the backend first

Use a host supporting the included Dockerfile, one always-running instance and a persistent disk. Mount the disk at /app/data. Keep both database and uploads there. Set these variables on the backend host (never in frontend files):

NODE_ENV=production
HOST=0.0.0.0
PORT=3100
DATABASE_PATH=/app/data/store.sqlite
BASE_URL=https://oreva-ashy.vercel.app
PAYMENT_ADAPTER=disabled
EMAIL_ADAPTER=development
OWNER_SETUP_CODE=<a private random value of at least 32 characters>

Generate the private code locally with: node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

The production setup form requires that code, and closes once an owner exists. Remove OWNER_SETUP_CODE after successful setup. Do not seed sample products. Checkout remains disabled while you upload real inventory. Production refuses the simulated payment adapter and live Paystack keys.

Use /health as the health check. Keep logs private and do not log private order URLs. Back up the persistent disk/database securely. Restart the backend and confirm a test product/photo survives before relying on it.

## Connect the Vercel site

In Vercel, keep the project connected to this GitHub repository with the repository root as its Root Directory. Add `BACKEND_ORIGIN` as an environment variable for Production and Preview, using the backend's public HTTPS origin only (for example, `https://your-backend-host.example`, with no path or trailing slash). The included `vercel.json` proxies `/api/*` and `/uploads/*` through the Vercel site to that backend and serves the single-page app for other routes. Redeploy after adding or changing the variable.

The backend's `BASE_URL` must exactly equal `https://oreva-ashy.vercel.app` for origin checks, secure cookies, and private order links. Then open `https://oreva-ashy.vercel.app/admin/setup` and create your owner account with your setup code. Check sign-in, uploads, edit/delete, stock persistence and sign-out on your phone. These hosted proxy/session checks cannot be completed until the backend exists.

## Payments are a separate activation step

To test checkout, configure Paystack TEST and Resend credentials according to README.md and switch PAYMENT_ADAPTER to paystack. Register the signed webhook at `https://oreva-ashy.vercel.app/api/webhook/paystack`; Vercel forwards it to the backend. Live payment support remains deliberately disabled. Nothing in this package enables real charges.

## Verification

42 automated tests passed after owner setup, catalogue deletion and disabled-checkout changes. Tests cover access controls, image sanitisation, concurrent reservations, duplicate/late payments, refunds, notification failures and persistence. Browser check confirmed four logo clicks open the login page and the setup form is available locally. Hosted Vercel/backend integration is not yet tested.
