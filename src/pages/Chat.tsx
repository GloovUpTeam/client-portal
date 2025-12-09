import React, { useState, useEffect, useRef } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';
import { Channel } from '../services/chatService';
import { supabase } from '../config/supabaseClient';
import { fetchMessages, unsubscribeFromChannel } from '../services/chatService';

export const Chat: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const chatRoomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoadingChannels(true);
    (async () => {
      try {
        const { data, error } = await supabase.from('channels').select('*').order('created_at');
        if (error) console.error('[chat] fetchChannels error', error);
        setChannels(data || []);
      } catch (err) {
        console.error('[chat] fetchChannels error', err);
      } finally {
        setLoadingChannels(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) {
          // not authenticated - redirect to signin
          window.location.href = '/signin';
          return;
        }
        setCurrentUser(data.user);
      } catch (err) {
        console.error('[chat] auth.getUser error', err);
      }
    })();
  }, []);

  const openChannel = async (channelId: string) => {
    try {
      console.log('[chat] openChannel channelId:', channelId);
      try {
        unsubscribeFromChannel();
      } catch (e) {
        console.warn('[chat] unsubscribe error', e);
      }
      setActiveChannelId(channelId);
      // prefetch messages for responsiveness
      try {
        const msgs = await fetchMessages(channelId);
        console.log(`[chat] prefetch fetched ${msgs.length} messages`);
      } catch (err) {
        console.error('[chat] prefetch fetchMessages error', err);
      }
      if (chatRoomRef.current) chatRoomRef.current.focus();
    } catch (err) {
      console.error('[chat] openChannel failed', err);
    }
  };

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-black rounded-xl border border-[#222] overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-[#222] hidden md:flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-neutral-900 border border-[#222] rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
          />
        </div>
        {loadingChannels ? (
          <div className="p-4">Loading channels...</div>
        ) : (
          <ChatList channels={channels} activeChannelId={activeChannelId} openChannel={openChannel} />
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - only show when a channel is selected */}
        {activeChannelId && (
          <div className="h-16 border-b border-[#222] flex items-center justify-between px-6 bg-black">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-white">{`# ${channels.find(c => c.id === activeChannelId)?.title ?? 'Channel'}`}</h2>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-neutral-400">3 online</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 h-full flex flex-col">
          <div ref={chatRoomRef} className="flex-1 overflow-hidden">
            <ChatRoom channelId={activeChannelId} currentUserId={currentUser?.id} />
          </div>
        </div>

      </div>
    </div>
  );
};