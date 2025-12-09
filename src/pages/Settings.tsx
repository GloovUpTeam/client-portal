import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ProfileForm, NotificationsForm, AppearanceForm, SecurityForm } from '../components/settings';
import { User, Bell, Lock, Palette, CheckCircle } from 'lucide-react';

type TabId = 'profile' | 'notifications' | 'appearance' | 'security';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tabs: Tab[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm onSuccess={handleSuccess} />;
      case 'notifications':
        return <NotificationsForm onSuccess={handleSuccess} />;
      case 'appearance':
        return <AppearanceForm />;
      case 'security':
        return <SecurityForm onSuccess={handleSuccess} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account preferences and workspace settings.</p>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/20 rounded-lg shadow-lg backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-medium text-green-400">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Navigation - Tabs */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                    whitespace-nowrap transition-all flex-shrink-0
                    ${
                      activeTab === tab.id
                        ? 'bg-brand/10 text-brand border border-brand/20'
                        : 'text-neutral-400 bg-brand-surface border border-neutral-800 hover:text-white hover:border-neutral-700'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Vertical tabs */}
          <nav className="hidden lg:block space-y-1" aria-label="Settings navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium 
                  transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 
                  focus:ring-offset-black
                  ${
                    activeTab === tab.id
                      ? 'bg-brand/10 text-brand border border-brand/20'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white border border-transparent'
                  }
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <Card className="max-w-4xl">
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;