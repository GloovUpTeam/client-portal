import React, { useEffect, useRef, useState } from "react";
import { Message, fetchMessages, subscribeToMessages, unsubscribeChannel } from "../../services/chatService";
import ChatInput from "./ChatInput";

type Props = {
  channelId: string | null;
  currentUserId: string;
};

const ChatRoom: React.FC<Props> = ({ channelId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!channelId) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const msgs = await fetchMessages(channelId);
        setMessages(msgs);
        setLoading(false);
      } catch (err) {
        console.error("[chat] fetchMessages error", err);
        setError("Failed to load messages — check console");
        setLoading(false);
      }
    })();

    // unsubscribe previous and subscribe to new
    try {
      unsubscribeChannel();
    } catch (e) {
      console.warn("[chat] unsubscribe error", e);
    }
    subscribeToMessages(channelId, (msg) => {
      console.log('[chat] new message received via realtime', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      try {
        unsubscribeChannel();
      } catch (e) {
        console.warn("[chat] cleanup unsubscribe error", e);
      }
    };
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!channelId) return <div className="p-6">Select a channel to start chatting.</div>;
  if (loading) return <div className="p-6">Loading messages...</div>;
  if (error) {
    if (typeof window !== "undefined" && (window as any).toast) {
      (window as any).toast(error, { type: "error" });
    }
    return <div className="p-6 text-red-400">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black/20 h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div>No messages yet. Say hi!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            const pending = typeof msg.id === 'string' && msg.id.startsWith('temp-');
            return (
              <div key={msg.id} className={`flex gap-4 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className={`max-w-[70%] ${pending ? 'opacity-70' : ''}`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm font-bold text-white">{msg.sender_id ?? 'Unknown'}</span>
                    <span className="text-xs text-neutral-500">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`p-3 rounded-2xl ${isMe ? 'bg-brand text-black rounded-br-none' : 'bg-neutral-800 text-neutral-200 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div>
        <ChatInput
          channelId={channelId}
          currentUserId={currentUserId}
          onMessageSent={(msg: Message, tempId?: string) => {
            // If tempId provided, replace temp message
            setMessages((prev) => {
              if (tempId) {
                const idx = prev.findIndex((m) => m.id === tempId);
                if (idx >= 0) {
                  const copy = [...prev];
                  copy[idx] = msg;
                  return copy;
                }
              }
              // If message is optimistic (temp), push
              if (msg.id && (msg.id as string).startsWith('temp-')) {
                return [...prev, msg];
              }
              // otherwise append if not present
              if (!prev.find((m) => m.id === msg.id)) return [...prev, msg];
              return prev;
            });
          }}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
