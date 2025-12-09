import { supabase } from '../config/supabaseClient';
import { UserProfile, UserActivity } from '../types/user';

export const userService = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // Suppress 404 errors if table doesn't exist yet
        const isTableMissing = 
          error.code === 'PGRST200' || 
          error.code === '404' || 
          error.code === '42P01' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist');

        if (!isTableMissing) {
            console.warn('Error fetching profile:', error.message);
        }
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  },

  updateProfile: async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  },

  getRecentActivity: async (userId: string): Promise<UserActivity[]> => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          // Suppress 404s for missing tables during dev
          const isTableMissing = 
            error.code === 'PGRST200' || 
            error.code === '404' || 
            error.code === '42P01' ||
            error.message?.includes('schema cache') ||
            error.message?.includes('does not exist');

          if (!isTableMissing) {
             console.warn('Error fetching activity:', error.message);
          }
          return [];
        }
        return data as UserActivity[];
      } catch (err) {
        return [];
      }
  },
  
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${userId}/${file.name}`, file, { upsert: true });
      
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
        
      // Update profile
      await supabase.from('profiles').update({ avatar_url: publicUrlData.publicUrl }).eq('id', userId);
      
      return publicUrlData.publicUrl;
  }
};
