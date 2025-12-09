-- Migration: Ensure invoices table exists with correct columns
CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no text,
    client_id uuid,
    issued_date date,
    due_date date,
    status text,
    subtotal numeric,
    discount numeric,
    total numeric,
    currency text DEFAULT 'INR',
    pdf_url text,
    created_at timestamptz DEFAULT now()
);
