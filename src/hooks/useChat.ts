import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { formatSupabaseError } from '../utils/supabaseError';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Channel {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  attachments: any[];
  created_at: string;
  sender?: {
      full_name: string;
      avatar_url: string;
  }
}

export const useChat = () => {
  const { user, profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  // Fetch all channels
  const fetchChannels = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');
      if (error) throw error;
      setChannels(data as Channel[]);
    } catch (err: any) {
      console.error('Error fetching channels:', err);
    }
  }, []);

  // Fetch messages for a channel
  const fetchMessages = useCallback(async (channelId: string) => {
    setLoading(true);
    try {
      // Join with profiles to get sender info
      // Note: Supabase join syntax requires foreign key setup
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(full_name, avatar_url)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform data to match Message interface if needed
      const formattedMessages = data.map((msg: any) => ({
          ...msg,
          sender: msg.sender // sender is now an object or null
      }));

      setMessages(formattedMessages);
    } catch (err: any) {
      setError(formatSupabaseError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to new messages
  const subscribeMessages = useCallback((channelId: string) => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    const channel = supabase
      .channel(`public:messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          // Fetch the full message with sender info
          const { data } = await supabase
            .from('messages')
            .select('*, sender:profiles(full_name, avatar_url)')
            .eq('id', payload.new.id)
            .single();
            
          if (data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  }, []);

  // Send a message
  const sendMessage = async (channelId: string, body: string, attachments: any[] = []) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          sender_id: profile.id,
          body,
          attachments
        });

      if (error) throw error;
    } catch (err: any) {
      throw err;
    }
  };

  const createChannel = async (name: string) => {
      if (!profile) return;
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const { data, error } = await supabase
        .from('channels')
        .insert({ name, slug, created_by: profile.id })
        .select()
        .single();
      
      if (error) throw error;
      setChannels(prev => [...prev, data]);
      return data;
  };

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  return {
    channels,
    messages,
    loading,
    error,
    fetchChannels,
    fetchMessages,
    sendMessage,
    createChannel,
    subscribeMessages,
    setActiveChannelId,
    activeChannelId
  };
};
