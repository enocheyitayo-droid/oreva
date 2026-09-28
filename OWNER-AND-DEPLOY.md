# Orẽva owner access and deployment

## Start using the owner dashboard locally

With the local server running, open http://127.0.0.1:3100/admin/setup on this computer. Choose your own email and a unique password of at least 14 characters. After account creation this setup route closes. Sign in at /admin. Four quick clicks/taps on the HEADER logo also open /admin; this shortcut does not bypass authentication.

Products: Add product, upload JPEG/PNG/WebP from your device, enter real name/description/category, price and supplier cost, colour/size variants and physical quantities, then save. Use Edit to change these later. Delete removes a product from the catalogue and preserves historical orders. Inventory supports audited quantity adjustments. Stock already reserved cannot be reduced below active reservations.

Settings: Homepage display pictures has separate bag and slip-on uploads. These replace the former illustrated sample panels once uploaded. Use photos you are entitled to publish. Display photos are style inspiration, not inventory; create a product separately to sell it. The requested Coach bag/slip-on photos are not included because they have not yet been supplied.

Samples have been removed from the active local catalogues. The release ZIP contains no database, owner credentials, customer records or sample seed data. A newly started database is empty.

## What this ZIP is

This is the full source package, NOT a one-step Netlify Drop package. A Netlify-only static upload cannot run this Node/SQLite backend. You still need a persistent backend hosting account. No backend has been deployed or paid service purchased. The older preview ZIP does not provide these owner tools.

## Deploy the backend first

Use a host supporting the included Dockerfile, one always-running instance and a persistent disk. Mount the disk at /app/data. Keep both database and uploads there. Set these variables on the backend host (never in frontend files):

NODE_ENV=production
HOST=0.0.0.0
PORT=3100
DATABASE_PATH=/app/data/store.sqlite
BASE_URL=https://YOUR-SITE.netlify.app
PAYMENT_ADAPTER=disabled
EMAIL_ADAPTER=development
OWNER_SETUP_CODE=<a private random value of at least 32 characters>

Generate the private code locally with: node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

The production setup form requires that code, and closes once an owner exists. Remove OWNER_SETUP_CODE after successful setup. Do not seed sample products. Checkout remains disabled while you upload real inventory. Production refuses the simulated payment adapter and live Paystack keys.

Use /health as the health check. Keep logs private and do not log private order URLs. Back up the persistent disk/database securely. Restart the backend and confirm a test product/photo survives before relying on it.

## Connect Netlify

After your backend has its HTTPS URL, run from this extracted source folder in PowerShell:

$env:BACKEND_ORIGIN='https://YOUR-BACKEND-HOST'
node build-netlify.mjs

Drag ONLY the generated netlify-site folder into Netlify Drop. It contains assets and proxy routes; never drag this entire source folder. Alternatively use Git/CLI deployment with the included netlify.toml and BACKEND_ORIGIN build variable. Netlify must proxy /api and /uploads to the backend; BASE_URL on the backend must exactly match your Netlify URL for CSRF checks and private order links.

Then open https://YOUR-SITE.netlify.app/admin/setup and create your owner account with your setup code. Check sign-in, uploads, edit/delete, stock persistence and sign-out on your phone. These hosted proxy/session checks cannot be completed until the backend exists.

## Payments are a separate activation step

To test checkout, configure Paystack TEST and Resend credentials according to README.md and switch PAYMENT_ADAPTER to paystack. Register the signed webhook at the Netlify origin /api/webhook/paystack. Live payment support remains deliberately disabled. Nothing in this package enables real charges.

## Verification

42 automated tests passed after owner setup, catalogue deletion and disabled-checkout changes. Tests cover access controls, image sanitisation, concurrent reservations, duplicate/late payments, refunds, notification failures and persistence. Browser check confirmed four logo clicks open the login page and the setup form is available locally. Hosted Netlify/backend integration is not yet tested.
