import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../atoms/Button';
import { Lock } from 'lucide-react';

export const PasswordForm: React.FC = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setPasswords({ current: '', new: '', confirm: '' });
    alert('Password updated successfully');
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
        <Lock className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-semibold text-white">Security</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Current Password"
          name="current"
          type="password"
          value={passwords.current}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="New Password"
            name="new"
            type="password"
            value={passwords.new}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirm"
            type="password"
            value={passwords.confirm}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex justify-end pt-4 border-t border-white/5">
          <Button type="submit" disabled={isSubmitting} variant="secondary">
            <Lock className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};
