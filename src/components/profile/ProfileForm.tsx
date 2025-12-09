import React, { useState } from 'react';
import { UserProfile } from '../../types/user';
import { Input } from '../ui/Input';
import { Button } from '../atoms/Button';
import { Save, User, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfileFormProps {
  user: UserProfile;
  onSubmit: (data: Partial<UserProfile>) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    company: user.company || '',
    bio: user.bio || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-xl p-6 relative">
      {showSuccess && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-lg border border-green-500/20 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Profile saved successfully</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
        <User className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-semibold text-white">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email}
              </p>
            )}
          </div>

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#181818] border border-white/5 rounded-lg text-white placeholder-neutral-500 focus:border-white/10 focus:ring-1 focus:ring-white/10 outline-none transition-colors resize-none"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
