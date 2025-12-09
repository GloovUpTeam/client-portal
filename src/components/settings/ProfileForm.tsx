// src/components/settings/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../atoms/Button';
import { CURRENT_USER, updateUserProfile, UserProfile } from '../../mocks/user.mock';
import { Save, Upload, User as UserIcon } from 'lucide-react';

interface ProfileFormProps {
  onSuccess?: (message: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: CURRENT_USER.name,
    email: CURRENT_USER.email,
    phone: CURRENT_USER.phone,
    company: CURRENT_USER.company,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Check if form has changes
    const hasChanges = 
      formData.name !== CURRENT_USER.name ||
      formData.email !== CURRENT_USER.email ||
      formData.phone !== CURRENT_USER.phone ||
      formData.company !== CURRENT_USER.company;
    setIsDirty(hasChanges);
  }, [formData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\d\s()+-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(formData);
      setIsDirty(false);
      onSuccess?.('Profile updated successfully!');
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: CURRENT_USER.name,
      email: CURRENT_USER.email,
      phone: CURRENT_USER.phone,
      company: CURRENT_USER.company,
    });
    setErrors({});
    setIsDirty(false);
  };

  const handleChange = (field: keyof UserProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">
          Profile Information
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          Update your personal details and contact information.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
            {CURRENT_USER.avatar ? (
              <img 
                src={CURRENT_USER.avatar} 
                alt={CURRENT_USER.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-12 h-12 text-neutral-500" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <Button 
            type="button" 
            variant="secondary" 
            size="sm"
            onClick={() => alert('Avatar upload functionality coming soon!')}
          >
            <Upload className="w-4 h-4 mr-2" />
            Change Avatar
          </Button>
          <p className="text-xs text-neutral-500 mt-2">
            JPG, GIF or PNG. Max size of 2MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          value={formData.name || ''}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Enter your full name"
          required
          autoComplete="name"
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.email || ''}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">Role</label>
          <div className="px-4 py-2.5 bg-neutral-800 border border-neutral-800 rounded-lg">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand/20 text-brand border border-brand/30">
              {CURRENT_USER.role}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Your role is assigned by your administrator
          </p>
        </div>

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone || ''}
          onChange={handleChange('phone')}
          error={errors.phone}
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          helpText="Optional: For account recovery"
        />

        <Input
          label="Company"
          type="text"
          value={formData.company || ''}
          onChange={handleChange('company')}
          placeholder="Your company name"
          autoComplete="organization"
          className="md:col-span-2"
        />
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <Button 
            type="submit" 
            disabled={!isDirty || isSubmitting}
            isLoading={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleCancel}
            disabled={!isDirty || isSubmitting}
          >
            Cancel
          </Button>
        </div>
        {isDirty && (
          <span className="text-xs text-neutral-500">
            You have unsaved changes
          </span>
        )}
      </div>
    </form>
  );
};
