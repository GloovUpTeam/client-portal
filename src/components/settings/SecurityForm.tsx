// src/components/settings/SecurityForm.tsx
import React from 'react';
import { Button } from '../atoms/Button';
import { Lock, Shield, Key } from 'lucide-react';

interface SecurityFormProps {
  onSuccess?: (message: string) => void;
}

export const SecurityForm: React.FC<SecurityFormProps> = ({ onSuccess }) => {
  const handleChangePassword = () => {
    // TODO: Implement password change modal
    alert('Password change functionality coming soon!');
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup flow
    alert('Two-factor authentication setup coming soon!');
  };

  const handleViewSessions = () => {
    // TODO: Implement active sessions view
    alert('Active sessions view coming soon!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">
          Security Settings
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          Manage your account security and authentication methods.
        </p>
      </div>

      {/* Password Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="p-3 bg-neutral-800 rounded-lg text-brand">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1">Password</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Last changed 45 days ago. We recommend changing your password every 90 days.
            </p>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="p-3 bg-neutral-800 rounded-lg text-yellow-500">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-white">Two-Factor Authentication</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-500 rounded-full border border-yellow-500/30">
                Not Enabled
              </span>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              Add an extra layer of security to your account by enabling 2FA. 
              You'll need to enter a code from your phone in addition to your password.
            </p>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={handleEnable2FA}
            >
              <Shield className="w-4 h-4 mr-2" />
              Enable Two-Factor Authentication
            </Button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-6 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="p-3 bg-neutral-800 rounded-lg text-blue-500">
            <Key className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1">Active Sessions</h3>
            <p className="text-sm text-neutral-400 mb-4">
              View and manage devices where you're currently logged in. 
              You have 2 active sessions.
            </p>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm"
              onClick={handleViewSessions}
            >
              Manage Sessions
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">
          Danger Zone
        </h3>
        <div className="flex items-start gap-4 p-6 bg-red-500/5 rounded-lg border border-red-500/20">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1">Delete Account</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              type="button" 
              variant="danger" 
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion functionality coming soon!');
                }
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
