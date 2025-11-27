
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Calendar, AlertCircle, Check } from 'lucide-react';
import { Button } from '../atoms/Button';
import { createProject } from '../../mocks/projectsApi';
import { Project, User } from '../../types';
import { USERS } from '../../services/mockData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    team: [] as string[], // User IDs
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Reset
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Focus first input
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
      // Reset form on close
      setFormData({
        name: '',
        client: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        team: [],
      });
      setError(null);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      
      // Simple focus trap logic
      if (e.key === 'Tab') {
        const focusableModalElements = modalRef.current?.querySelectorAll(
          'a[href], button, textarea, input, select'
        );
        if (!focusableModalElements) return;
        
        const firstElement = focusableModalElements[0] as HTMLElement;
        const lastElement = focusableModalElements[focusableModalElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
           if (document.activeElement === firstElement) {
             lastElement.focus();
             e.preventDefault();
           }
        } else {
           if (document.activeElement === lastElement) {
             firstElement.focus();
             e.preventDefault();
           }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTeamMember = (userId: string) => {
    setFormData(prev => {
      const isSelected = prev.team.includes(userId);
      return {
        ...prev,
        team: isSelected ? prev.team.filter(id => id !== userId) : [...prev.team, userId]
      };
    });
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Project name is required.';
    if (!formData.client.trim()) return 'Client name is required.';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      return 'End date cannot be earlier than start date.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map selected IDs back to User objects
      const selectedUsers = USERS.filter(u => formData.team.includes(u.id));

      const payload: Partial<Project> = {
        name: formData.name,
        client: formData.client,
        dueDate: formData.endDate || formData.startDate,
        team: selectedUsers,
        status: 'Active',
        progress: 0,
      };

      const newProject = await createProject(payload);
      onCreate(newProject);
      onClose();
    } catch (err) {
      setError('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-brand-surface border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-neutral-800 bg-brand-surface">
          <h2 id="modal-title" className="text-xl font-bold text-white font-display">Create New Project</h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-start gap-3" role="alert">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                placeholder="e.g. Website Redesign"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="client" className="block text-sm font-medium text-neutral-300">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all resize-none"
              placeholder="Brief overview of the project scope..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-neutral-300">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-neutral-300">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <label className="block text-sm font-medium text-neutral-300">Team Members</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto p-1">
               {USERS.map((user) => (
                 <label 
                   key={user.id} 
                   className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                     formData.team.includes(user.id) 
                       ? 'bg-brand/10 border-brand' 
                       : 'bg-neutral-900 border-neutral-800 hover:border-neutral-600'
                   }`}
                 >
                   <input 
                     type="checkbox" 
                     className="hidden"
                     checked={formData.team.includes(user.id)}
                     onChange={() => toggleTeamMember(user.id)}
                   />
                   <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                     formData.team.includes(user.id) ? 'bg-brand border-brand' : 'border-neutral-600'
                   }`}>
                      {formData.team.includes(user.id) && <Check className="w-3.5 h-3.5 text-black" />}
                   </div>
                   <img src={user.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                   <div>
                     <p className="text-sm font-medium text-white">{user.name}</p>
                     <p className="text-xs text-neutral-500">{user.role}</p>
                   </div>
                 </label>
               ))}
             </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
