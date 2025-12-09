// src/services/authService.ts
import { supabase } from '../config/supabaseClient'

export async function signUp(email: string, password: string, fullName?: string, role?: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  // if user created, create profile row using returned user.id when available
  if (data?.user) {
    const userId = data.user.id
    await supabase.from('users').insert({
      auth_id: userId,
      email,
      full_name: fullName ?? null,
      role: role ?? 'client'
    })
  }
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  return true
}
