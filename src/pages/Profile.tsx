import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { userService } from '../services/userService';

import { UserProfile, UserActivity } from '../types/user';
import { ProfileCard } from '../components/profile/ProfileCard';
import { RecentActivity } from '../components/profile/RecentActivity';
import { ProfileForm } from '../components/profile/ProfileForm';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ProfileContent: React.FC<{ 
  user: UserProfile; 
  activities: UserActivity[];
  onUpdate: (data: Partial<UserProfile>) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
}> = ({ user, activities, onUpdate, onAvatarUpload }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile Card + Recent Activity */}
      <div className="space-y-8">
        <ProfileCard 
          user={user} 
          onAvatarUpload={onAvatarUpload} 
        />
        <RecentActivity activities={activities} />
      </div>

      {/* Right Column: Personal Info Form */}
      <div className="lg:col-span-2 space-y-8">
        <ProfileForm user={user} onSubmit={onUpdate} />
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProfileContentWrapper />
    </ErrorBoundary>
  );
};

const ProfileContentWrapper: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Profile page mounting...');
    const loadData = async () => {
      try {
        // Get current user ID from auth session
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
            console.warn("No authenticated user found");
            setLoading(false);
            return;
        }

        const [userData, activityData] = await Promise.all([
          userService.getProfile(userId),
          userService.getRecentActivity(userId)
        ]);
        console.log('Profile data loaded:', userData);
        setUser(userData || null);
        setActivities(activityData || []);
      } catch (err) {
        console.error('Failed to load profile data', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user?.id) return;
    try {
      const updatedUser = await userService.updateProfile(user.id, data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user?.id) return;
    try {
      const newAvatarUrl = await userService.uploadAvatar(user.id, file);
      const updatedUser = await userService.updateProfile(user.id, { avatar: newAvatarUrl });
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to upload avatar', error);
      alert('Failed to upload avatar');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-400">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="p-8 text-center text-red-400">{error || 'Failed to load profile'}</div>;
  }

  return (
    <div className="p-6 w-full h-full space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
      </div>

      <ErrorBoundary>
        <ProfileContent 
          user={user} 
          activities={activities}
          onUpdate={handleUpdateProfile} 
          onAvatarUpload={handleAvatarUpload} 
        />
      </ErrorBoundary>
    </div>
  );
};

export default Profile;
