// src/components/settings/NotificationsForm.tsx
import React, { useState } from 'react';
import { Toggle } from '../ui/Toggle';
import { Button } from '../atoms/Button';
import { Save } from 'lucide-react';

interface NotificationSettings {
  emailOnProjectUpdate: boolean;
  emailOnNewTicket: boolean;
  pushChatMessages: boolean;
  emailOnInvoice: boolean;
  emailWeeklySummary: boolean;
}

interface NotificationsFormProps {
  onSuccess?: (message: string) => void;
}

export const NotificationsForm: React.FC<NotificationsFormProps> = ({ onSuccess }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailOnProjectUpdate: true,
    emailOnNewTicket: true,
    pushChatMessages: true,
    emailOnInvoice: true,
    emailWeeklySummary: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsDirty(false);
      onSuccess?.('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save notification preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">
          Notification Preferences
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          Choose how and when you want to be notified about updates.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
          Email Notifications
        </h3>
        
        <Toggle
          enabled={settings.emailOnProjectUpdate}
          onChange={handleToggle('emailOnProjectUpdate')}
          label="Project Updates"
          description="Receive emails when a project you're working on is updated"
        />

        <Toggle
          enabled={settings.emailOnNewTicket}
          onChange={handleToggle('emailOnNewTicket')}
          label="New Tickets"
          description="Get notified when new tickets are assigned to you"
        />

        <Toggle
          enabled={settings.emailOnInvoice}
          onChange={handleToggle('emailOnInvoice')}
          label="Invoices & Billing"
          description="Receive notifications about invoices and payment updates"
        />

        <Toggle
          enabled={settings.emailWeeklySummary}
          onChange={handleToggle('emailWeeklySummary')}
          label="Weekly Summary"
          description="Get a weekly digest of your activity and updates"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
          Push Notifications
        </h3>
        
        <Toggle
          enabled={settings.pushChatMessages}
          onChange={handleToggle('pushChatMessages')}
          label="Chat Messages"
          description="Receive push notifications for new chat messages"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <Button 
          type="submit" 
          disabled={!isDirty || isSubmitting}
          isLoading={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
        {isDirty && (
          <span className="text-xs text-neutral-500">
            You have unsaved changes
          </span>
        )}
      </div>
    </form>
  );
};
