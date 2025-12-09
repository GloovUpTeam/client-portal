import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Profile: React.FC = () => {
  const { user, profile } = useAuth();

  if (!user) return <div>Please log in</div>;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-white">My Profile</h1>
        <ProfileSettings />
      </div>
    </ErrorBoundary>
  );
};

export default Profile;
