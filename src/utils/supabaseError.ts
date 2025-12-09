import { PostgrestError } from '@supabase/supabase-js';

export interface AppError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function formatSupabaseError(error: PostgrestError | Error | unknown): AppError {
  console.error('Supabase Error:', error);

  if (!error) {
    return { message: 'An unknown error occurred.' };
  }

  // Handle PostgrestError
  if (typeof error === 'object' && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    return {
      message: pgError.message,
      details: pgError.details,
      hint: pgError.hint,
      code: pgError.code,
    };
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred.',
    details: JSON.stringify(error),
  };
}
