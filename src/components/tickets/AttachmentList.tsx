import React from 'react';
import { Attachment } from '../../types/tickets';
import { Download, X, FileText, Image as ImageIcon } from 'lucide-react';

interface Props {
  attachments: Attachment[];
  onRemove?: (attachmentId: string) => void;
  showRemove?: boolean;
}

export const AttachmentList: React.FC<Props> = ({ attachments, onRemove, showRemove = false }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (mime: string) => mime.startsWith('image/');

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-neutral-400">Attachments ({attachments.length})</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-brand transition-colors group"
          >
            {/* File Icon/Thumbnail */}
            <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center flex-shrink-0">
              {isImage(attachment.mime) ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <FileText className="w-5 h-5 text-neutral-500" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">{attachment.name}</p>
              <p className="text-xs text-neutral-500">
                {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <a
                href={attachment.url}
                download={attachment.name}
                className="p-1.5 text-neutral-400 hover:text-brand transition-colors"
                aria-label={`Download ${attachment.name}`}
              >
                <Download className="w-4 h-4" />
              </a>
              {showRemove && onRemove && (
                <button
                  onClick={() => onRemove(attachment.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${attachment.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
