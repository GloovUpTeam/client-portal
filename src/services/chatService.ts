import { supabase } from "../config/supabaseClient";

export type Message = {
  id: string;
  channel_id: string;
  sender_id: string | null;
  body: string;
  metadata?: any;
  created_at: string;
};

export type Channel = {
  id: string;
  title: string;
  type?: string;
  created_at: string;
};

// Fetch messages for a channel
export async function fetchMessages(channelId: string, limit = 200): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, channel_id, sender_id, body, metadata, created_at")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) {
      console.error("[chat] fetchMessages error", error);
      throw error;
    }
    console.log(`[chat] fetchMessages returned ${data?.length ?? 0} messages`);
    return data || [];
  } catch (err) {
    console.error("[chat] fetchMessages error", err);
    throw err;
  }
}

// Realtime subscription management
let currentSubscription: any = null;

export function subscribeToChannel(channelId: string, onNewMessage: (msg: Message) => void) {
  try {
    if (currentSubscription) {
      try {
        currentSubscription.unsubscribe();
      } catch (e) {
        console.warn("[chat] unsubscribe previous error", e);
      }
      currentSubscription = null;
    }

    currentSubscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
        (payload: any) => {
          console.log("[chat] new message", payload.new);
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    console.log(`[chat] subscribed to messages:${channelId}`);
    return currentSubscription;
  } catch (err) {
    console.error("[chat] subscribeToChannel error", err);
    throw err;
  }
}

export function unsubscribeFromChannel() {
  try {
    if (currentSubscription) {
      currentSubscription.unsubscribe();
      currentSubscription = null;
      console.log("[chat] unsubscribed from previous channel");
    }
  } catch (err) {
    console.error("[chat] unsubscribeFromChannel error", err);
  }
}

// Send a message to a channel (returns inserted message)
export async function sendMessage(channelId: string, senderId: string, body: string): Promise<Message> {
  try {
    console.log('[chat] sending message', { channelId, senderId, body });
    const { data, error } = await supabase
      .from('messages')
      .insert([
        { channel_id: channelId, sender_id: senderId, body, metadata: {} }
      ])
      .select('*')
      .single();
    if (error) {
      console.error('[chat] sendMessage error', error);
      throw error;
    }
    console.log('[chat] message sent', data);
    return data as Message;
  } catch (err) {
    console.error('[chat] sendMessage error', err);
    throw err;
  }
}

// alias to keep naming requested in spec
export function subscribeToMessages(channelId: string, cb: (msg: Message) => void) {
  return subscribeToChannel(channelId, cb);
}

export function unsubscribeChannel(channelId?: string) {
  // current implementation tracks single subscription, so ignore channelId
  return unsubscribeFromChannel();
}
