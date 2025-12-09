import React, { useState, useRef, useEffect } from 'react';
import { TicketComment, AddCommentInput } from '../../types/tickets';
import { USERS } from '../../services/mockData';
import { Send, Paperclip, X } from 'lucide-react';

interface Props {
  ticketId: string;
  comments: TicketComment[];
  onAddComment: (input: AddCommentInput) => void;
  currentUserId?: string;
}

export const TicketChat: React.FC<Props> = ({
  ticketId,
  comments,
  onAddComment,
  currentUserId = 'u1',
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onAddComment({
        ticketId,
        text: message,
        attachments,
      });
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCurrentUser = comment.authorId === currentUserId;
            return (
              <div
                key={comment.id}
                className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className={`flex-1 ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{comment.author.name}</span>
                    <span className="text-xs text-neutral-500">
                      {formatTimestamp(comment.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[80%] ${
                      isCurrentUser
                        ? 'bg-brand text-black'
                        : 'bg-neutral-800 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{comment.text}</p>
                    
                    {/* Comment Attachments */}
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {comment.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.url}
                            download={att.name}
                            className={`flex items-center gap-2 p-2 rounded text-xs ${
                              isCurrentUser
                                ? 'bg-black/20 hover:bg-black/30'
                                : 'bg-neutral-900 hover:bg-neutral-700'
                            } transition-colors`}
                          >
                            <Paperclip className="w-3 h-3" />
                            <span className="flex-1 truncate">{att.name}</span>
                            <span className="text-xs opacity-70">{formatFileSize(att.size)}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-neutral-800 p-4 bg-brand-surface">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full text-sm"
                >
                  <Paperclip className="w-3 h-3 text-neutral-400" />
                  <span className="text-neutral-300 truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-brand transition-colors"
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={!message.trim() && attachments.length === 0}
              className="px-4 py-2 bg-brand hover:bg-brand-dark text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
