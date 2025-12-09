import React, { useState } from 'react';
import { CreateTicketInput } from '../../types/tickets';
import { USERS } from '../../services/mockData';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';

interface Props {
  onSubmit: (data: CreateTicketInput) => void;
  onCancel: () => void;
  initialValues?: Partial<CreateTicketInput>;
}

export const TicketForm: React.FC<Props> = ({ onSubmit, onCancel, initialValues }) => {
  const [formData, setFormData] = useState<CreateTicketInput>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    priority: initialValues?.priority || 'Medium',
    assigneeId: initialValues?.assigneeId || '',
    assigneeRole: initialValues?.assigneeRole,
    attachments: initialValues?.attachments || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, attachments: selectedFiles });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-surface border border-neutral-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-brand-surface z-10">
          <h2 className="text-xl font-bold text-white">Create New Ticket</h2>
          <button onClick={onCancel} className="text-neutral-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="ticket-title" className="block text-sm font-medium text-neutral-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="ticket-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-brand transition-colors"
              placeholder="Brief description of the issue"
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="ticket-description" className="block text-sm font-medium text-neutral-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ticket-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-brand transition-colors resize-none"
              placeholder="Provide detailed information about the issue..."
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.description}
              </p>
            )}
          </div>

          {/* Priority and Assignee Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label htmlFor="ticket-priority" className="block text-sm font-medium text-neutral-300 mb-2">
                Priority
              </label>
              <select
                id="ticket-priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTicketInput['priority'] })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label htmlFor="ticket-assignee" className="block text-sm font-medium text-neutral-300 mb-2">
                Assign to
              </label>
              <select
                id="ticket-assignee"
                value={formData.assigneeRole || ''}
                onChange={(e) => setFormData({ ...formData, assigneeRole: e.target.value as any, assigneeId: undefined })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-brand transition-colors"
              >
                <option value="">Select Department</option>
                <option value="Management">Management</option>
                <option value="Developer">Developer</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-neutral-800 rounded-lg p-4 text-center hover:border-brand transition-colors">
              <input
                type="file"
                id="ticket-attachments"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="ticket-attachments" className="cursor-pointer">
                <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Images, PDFs, Documents (max 10MB each)
                </p>
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-900 rounded border border-neutral-800">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-neutral-400">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-neutral-400 hover:text-red-500 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
