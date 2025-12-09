import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService, ProfileData } from '../../services/profileService';
import toast from 'react-hot-toast';

export const ProfileSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    email: '',
    company: '',
    phone: '',
    url: '',
    address: ''
  });
  const [availableColumns, setAvailableColumns] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      if (profile) {
        // hydrate from AuthContext profile when available
        setAvailableColumns(new Set(Object.keys(profile)));
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || user.email || '',
          company: profile.company || profile.company_name || '',
          phone: profile.phone || '',
          url: profile.url || profile.website || '',
          address: profile.address || '',
          avatar_url: profile.avatar_url
        });
      } else {
        loadProfile();
      }
    }
  }, [user, profile]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required';
    }


    if (formData.phone && !/^[\d\s()+-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileRow = await profileService.getProfile(user!.id);
      if (profileRow) {
        setAvailableColumns(new Set(Object.keys(profileRow)));
        setFormData({
          full_name: profileRow.full_name || '',
          email: user!.email || '', // Email from auth user
          company: profileRow.company || profileRow.company_name || '',
          phone: profileRow.phone || '',
          url: profileRow.url || profileRow.website || '',
          address: profileRow.address || '',
          avatar_url: profileRow.avatar_url
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // toast.error('Failed to load profile'); // Maybe suppress this if profile doesn't exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validate()) return;

    try {
      setLoading(true);
      // Use local variables for clarity when sending updates
      const fullName = formData.full_name;
      const companyName = formData.company;
      const websiteUrl = formData.url;
      const address = formData.address;
      const phone = formData.phone;

      // Build updates object only including columns that exist in the DB
      const updates: Partial<ProfileData> = {
        full_name: fullName,
        avatar_url: formData.avatar_url
      };

      // map company -> company or company_name based on availableColumns
      if (availableColumns.has('company')) updates.company = companyName;
      else if (availableColumns.has('company_name')) (updates as any).company_name = companyName;

      if (availableColumns.has('phone')) updates.phone = phone;
      if (availableColumns.has('email')) updates.email = user.email!;
      if (availableColumns.has('url')) updates.url = websiteUrl;
      else if (availableColumns.has('website')) (updates as any).website = websiteUrl;
      if (availableColumns.has('address')) updates.address = address;

      try {
        await profileService.updateProfile(user.id, updates);
      } catch (err: any) {
        // If update fails due to missing column, fall back to upsert with minimal fields
        console.warn('Update failed, falling back to upsert with minimal fields', err);
        const safeUpsert: Partial<ProfileData> = {
          id: user.id,
          full_name: fullName,
          email: user.email!,
          avatar_url: formData.avatar_url,
          company: companyName,
          phone: phone
        };
        await profileService.upsertProfile(safeUpsert as ProfileData);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setLoading(true);
      const publicUrl = await profileService.uploadAvatar(file, user!.id);
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

      // Use local variables from current formData for the upsert payload
      const fullName = formData.full_name;
      const companyName = formData.company;
      const websiteUrl = formData.url;
      const address = formData.address;
      const phone = formData.phone;

      // Update profile immediately with new avatar. Only include fields that exist to avoid PGRST errors.
      const upsertPayload: Partial<ProfileData> = { id: user!.id, avatar_url: publicUrl };
      if (availableColumns.has('full_name')) upsertPayload.full_name = fullName;
      if (availableColumns.has('email')) upsertPayload.email = user!.email!;
      if (availableColumns.has('company')) upsertPayload.company = companyName;
      else if (availableColumns.has('company_name')) (upsertPayload as any).company_name = companyName;
      if (availableColumns.has('phone')) upsertPayload.phone = phone;
      // url/address included only if the columns exist
      if (availableColumns.has('url')) upsertPayload.url = websiteUrl;
      else if (availableColumns.has('website')) (upsertPayload as any).website = websiteUrl;
      if (availableColumns.has('address')) upsertPayload.address = address;

      await profileService.upsertProfile(upsertPayload as ProfileData);
      
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative w-24 h-24">
          {formData.avatar_url ? (
            <img 
              src={formData.avatar_url} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Img
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium">{formData.full_name || 'User'}</h3>
          <p className="text-gray-500">{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={e => setFormData({...formData, full_name: e.target.value})}
            className={`mt-1 block w-full rounded-md shadow-sm bg-[#111418] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.full_name ? 'border-red-500' : 'border-[#333]'}`}
            required
          />
          {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
            className="mt-1 block w-full rounded-md shadow-sm bg-[#111418] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 border border-[#333] p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={e => setFormData({...formData, url: e.target.value})}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md shadow-sm bg-[#111418] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 border border-[#333] p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="mt-1 block w-full rounded-md shadow-sm bg-[#111418] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 border border-[#333] p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className={`mt-1 block w-full rounded-md shadow-sm bg-[#111418] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 p-2 ${errors.phone ? 'border-red-500' : 'border-[#333]'}`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
