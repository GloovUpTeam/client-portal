import React from "react";
import { Channel } from "../../services/chatService";

type Props = {
  channels: Channel[];
  activeChannelId: string | null;
  openChannel: (id: string) => void;
};

const ChatList: React.FC<Props> = ({ channels, activeChannelId, openChannel }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-black">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`p-4 cursor-pointer hover:bg-neutral-800 transition-colors ${
            activeChannelId === channel.id ? "bg-[#111] border-l-2 border-brand" : ""
          }`}
          onClick={() => {
            console.log("[chat] openChannel channelId:", channel.id);
            openChannel(channel.id);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openChannel(channel.id)}
        >
          <div className="flex justify-between mb-1">
            <span className={`font-medium ${activeChannelId === channel.id ? "text-white" : "text-neutral-400"}`}>
              # {channel.title}
            </span>
            <span className="text-xs text-neutral-500"> </span>
          </div>
          <p className="text-xs text-neutral-500 truncate"> </p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
