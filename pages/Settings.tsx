import React, { useState } from 'react';
import { Button } from '../components/atoms/Button';
import { User, Bell, Lock, Palette, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
         <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
         <p className="text-neutral-400 mt-1">Manage your account preferences and workspace settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand/10 text-brand'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-brand-surface border border-neutral-800 rounded-xl p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">Profile Information</h2>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10 text-neutral-500" />
                </div>
                <Button variant="secondary" size="sm">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Full Name</label>
                  <input type="text" defaultValue="Alice Freeman" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Email Address</label>
                  <input type="email" defaultValue="alice@company.com" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Role</label>
                  <input type="text" defaultValue="Project Manager" disabled className="w-full bg-neutral-800 border border-neutral-800 rounded-lg px-4 py-2 text-neutral-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-4">
                <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {['Email me when a project is updated', 'Email me about new tickets', 'Push notifications for chat messages'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                    <span className="text-neutral-300 font-medium">{item}</span>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-brand cursor-pointer">
                      <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
             <div className="text-center py-10 text-neutral-500">
               <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p>Theme customization coming soon.</p>
             </div>
          )}

          {activeTab === 'security' && (
             <div className="space-y-6">
               <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">Security</h2>
               <Button variant="secondary">Change Password</Button>
               <Button variant="danger">Enable Two-Factor Authentication</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;