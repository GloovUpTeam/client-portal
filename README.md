## Supabase Setup for Tickets

To enable ticket creation and avoid PGRST204 errors, run the following SQL in your Supabase SQL editor:

* `supabase/migrations/20251205_add_tickets_columns.sql` — adds missing columns and dev RLS policies

**How to test:**
- Open the tickets page, try creating a ticket, and check the browser console for `[createTicket]` logs.
- If you see a toast error, check the console for error details and the request payload.

**Before production:**
- Remove or restrict the dev RLS policies in the migration file.
- Ensure only appropriate users can SELECT/INSERT tickets.
## Supabase Setup for Invoices

To enable invoice features, run the following SQL files in your Supabase SQL editor:


* `supabase_migration_invoices.sql` — creates the `invoices` table
* `supabase_rls_invoices_dev.sql` — sets up development RLS policies

**How to test:**
- Open the invoices page in your browser, open the browser console, and look for `[invoiceService]` logs for debugging.
- If you see a toast error, check the console for details.

**Before production:**
- Remove or restrict the dev RLS policies in `supabase_rls_invoices_dev.sql`.
- Ensure only appropriate users can SELECT/INSERT invoices.

> **Note:** Review and adjust RLS policies before production. For dev/testing, you may uncomment the public SELECT policy in the RLS file.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FbbXYnA2kGIIduv0Q_PlmPxZvdQq7pJ8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
