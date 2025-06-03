import React, { useState, useRef, useEffect } from "react";
import { UserInfo } from "./types/UserInfo";
import { useChatContext } from "../../context/ChatContext";
import ChatUserList from "./ChatUserList";
import { OverlayWrapper } from "../../pong/components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayHeading,
} from "../../pong/components/Overlays/OverlayComponents";
import "./ChatModal.css";

interface ChatModalProps {
  onClose: () => void;
  currentUserId: string;
  players: UserInfo[];
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, currentUserId, players }) => {
  const { state, selectUser, sendMessage } = useChatContext();
  const { conversations, selected } = state;
  const messages = selected ? conversations[Number(selected.id)] || [] : [];
  const [input, setInput] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_LENGTH = 500;
  const COOLDOWN_MS = 500;

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selected || cooldown) return;
    const text = input.trim();
    setInput("");
    setCooldown(true);
    cooldownRef.current = setTimeout(() => setCooldown(false), COOLDOWN_MS);
    sendMessage(text);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <OverlayWrapper>
      <OverlayCard className="w-[90%] max-w-[800px] h-[80vh] flex flex-col overflow-hidden border-[#00a1ff] bg-gradient-to-br from-[#0a0e2a] to-black shadow-[0_0_20px_#00a1ff,0_0_40px_#00a1ff]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-4 text-[#0A7FC9] hover:text-pink-500 text-lg font-bold"
        >
          ✕
        </button>
        <OverlayHeading className="text-2xl mb-4 text-[#e9f4fb] drop-shadow-[0_0_10px_#00a1ff]">
          Chat
        </OverlayHeading>
        <div className="flex flex-1 overflow-hidden rounded-lg bg-black bg-opacity-40">
          <ChatUserList players={players} onSelect={selectUser} />
          <div className="chat-area flex flex-col flex-1">
            <div
              className="chat-messages flex-1 p-2 overflow-y-auto flex flex-col"
              ref={messagesEndRef}
            >
              {selected ? (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message-bubble ${
                      m.sender_id === Number(currentUserId) ? "sent" : "received"
                    }`}
                  >
                    <p className="break-words">{m.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 mt-4">
                  Select a user to start chatting
                </div>
              )}
            </div>
            {selected && (
              <div className="chat-input-container p-2 border-t border-gray-700">
                <div className="flex items-end">
                  <input
                    className="search-input flex-grow mr-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message..."
                    maxLength={MAX_LENGTH}
                  />
                  <button
                    onClick={handleSend}
                    disabled={input.trim().length === 0 || cooldown}
                    className="bg-gray-900 border border-blue-400 text-white px-4 py-2 rounded-lg shadow-blue-500 hover:bg-gray-800 disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {MAX_LENGTH - input.length} left
                </div>
              </div>
            )}
          </div>
        </div>
      </OverlayCard>
    </OverlayWrapper>
  );
};

export default ChatModal;
