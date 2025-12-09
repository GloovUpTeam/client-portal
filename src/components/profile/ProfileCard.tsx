import React from 'react';
import { UserProfile } from '../../types/user';
import { AvatarUploader } from './AvatarUploader';
import { Activity } from 'lucide-react';

interface ProfileCardProps {
  user: UserProfile;
  onAvatarUpload: (file: File) => Promise<void>;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onAvatarUpload }) => {
  console.log('Rendering ProfileCard', { user });
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg h-fit">
      {/* Header / Avatar Section */}
      <div className="p-8 flex flex-col items-center text-center">
        <div className="mb-4">
          <AvatarUploader 
            currentAvatar={user.avatar} 
            onUpload={onAvatarUpload} 
          />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
        <div className="flex flex-col items-center gap-3 mt-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs font-medium uppercase tracking-wider border border-white/5">
              {user.role || 'User'}
            </span>
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold uppercase tracking-wide border border-green-500/20">
              <Activity className="w-3 h-3" />
              {user.status || 'Active'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono bg-neutral-900/50 px-3 py-1.5 rounded-full border border-white/5">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
