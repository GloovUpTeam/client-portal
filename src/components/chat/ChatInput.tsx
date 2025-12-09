import React, { useEffect, useRef, useState } from 'react';
import { sendMessage as sendMessageService } from '../../services/chatService';
import { Message } from '../../services/chatService';

type ChatInputProps = {
  channelId?: string | null;
  currentUserId: string;
  onMessageSent?: (msg: Message, tempId?: string) => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ channelId, currentUserId, onMessageSent }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (channelId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [channelId]);

  const handleSend = async () => {
    if (!channelId || !currentUserId) return;
    const body = text.trim();
    if (!body) return;
    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      channel_id: channelId,
      sender_id: currentUserId,
      body,
      metadata: { pending: true },
      created_at: new Date().toISOString(),
    };
    try {
      // optimistic update
      onMessageSent && onMessageSent(tempMsg);
      setText('');
      setSending(true);
      console.log('[chat] sending message', { channelId, senderId: currentUserId });
      const dbMsg = await sendMessageService(channelId, currentUserId, body);
      console.log('[chat] message sent', dbMsg);
      // inform parent to replace temp with real
      onMessageSent && onMessageSent(dbMsg, tempId);
    } catch (err) {
      console.error('[chat] sendMessage error', err);
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast('Failed to send message', { type: 'error' });
      }
      // restore text for retry
      setText(body);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const disabled = !channelId || !currentUserId;

  return (
    <div className="p-4 bg-black border-t border-[#222]">
      <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-2 border border-[#222] w-full">
        <textarea
          ref={textareaRef}
          aria-label="Type your message"
          placeholder={disabled ? 'Select a channel to start chatting...' : 'Type your message...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 resize-none w-full rounded-md"
          disabled={disabled || sending}
        />
        <button
          aria-label="Send message"
          onClick={handleSend}
          disabled={disabled || sending || !text.trim()}
          className={`p-2 bg-brand text-black rounded-md ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
