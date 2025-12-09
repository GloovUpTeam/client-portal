
## Supabase Table Checks

Run these SQL queries in your Supabase SQL Editor to confirm your schema matches the code expectations.

**CRITICAL:** You must run the contents of `supabase_schema_updates.sql` in your Supabase SQL Editor to create the `renewals`, `payments`, and `profiles` tables. The 404 error for renewals is because that table does not exist yet.

```sql
-- Check tickets table
select column_name, data_type 
from information_schema.columns 
where table_name = 'tickets';

-- Check invoices table
select column_name, data_type 
from information_schema.columns 
where table_name = 'invoices';

-- Check renewals table (Fixes 404)
select column_name, data_type 
from information_schema.columns 
where table_name = 'renewals';

-- Create invoices table if missing (example)
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  client_id uuid references profiles(id),
  issued_date date,
  due_date date,
  amount numeric,
  status text,
  items jsonb
);
```

## Testing Steps

1. **Run Dev Server**: `npm run dev`
2. **Check Console**: Open browser dev tools. Verify that "Error fetching tickets" or "Error fetching invoices" messages appear if the tables are missing or RLS blocks access, but the UI **does not crash**.
3. **Verify Fallbacks**:
   - Tickets summary card should show 0/Empty if fetch fails.
   - Invoice list should show "No invoices found" instead of crashing.
4. **Verify Error Boundary**: If a component throws a render error, you should see the "Something went wrong" UI box instead of a white screen.
