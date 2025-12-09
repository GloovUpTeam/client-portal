import { supabase } from '../config/supabaseClient'

export interface DashboardData {
  tickets: any[]
  invoices: any[]
  renewals: any[]
  projects: any[]
}

function isTableNotFound(error: any): boolean {
  const msg = error?.message?.toLowerCase?.() || ''
  return msg.includes('relation') && msg.includes('does not exist') || msg.includes('table') && msg.includes('not found')
}

export async function loadDashboard(userId: string): Promise<DashboardData> {
  const result: DashboardData = { tickets: [], invoices: [], renewals: [], projects: [] }

  const logError = (label: string, error: any) => {
    if (isTableNotFound(error)) {
      console.warn(`[dashboard] Table ${label} not found, skipping…`)
    } else if (error) {
      console.error(`[dashboard] ${label} fetch error:`, error)
    }
  }

  const ticketsReq = supabase
    .from('tickets')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) return logError('tickets', error)
      result.tickets = data || []
    })

  const invoicesReq = supabase
    .from('invoices')
    .select('*')
    .eq('client_id', userId)
    .order('due_date', { ascending: true })
    .then(({ data, error }) => {
      if (error) return logError('invoices', error)
      result.invoices = data || []
    })

  const renewalsReq = supabase
    .from('renewals')
    .select('*')
    .eq('client_id', userId)
    .order('next_renewal_date', { ascending: true })
    .then(({ data, error }) => {
      if (error) return logError('renewals', error)
      result.renewals = data || []
    })

  const projectsReq = supabase
    .from('projects')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) return logError('projects', error)
      result.projects = data || []
    })

  await Promise.all([ticketsReq, invoicesReq, renewalsReq, projectsReq])
  return result
}
