import React, { useState, useRef, useEffect } from "react";
import { useEscapeKey } from "../../pong/hooks/useEscapeKey";
import { UserInfo } from "../../pages/Profile/types/UserInfo";
import { useChatContext } from "../context/ChatContext";
import ChatUserList from "./ChatUserList";
import SystemNotification from "./SystemNotification";
import { OverlayWrapper } from "../../pong/components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayHeading,
  overlayOutlineClass,
} from "../../pong/components/Overlays/OverlayComponents";
import "./ChatModal.css";
import { MAX_MESSAGE_LENGTH } from "../../../../shared/chatConstants.js";
import ChatProfileModal from "./ChatProfileModal";
import { askForChallenge } from "../../pages/Profile/types/api";
import { toast } from "react-hot-toast";

interface ChatModalProps {
  onClose: () => void;
  currentUserId: string;
  players: UserInfo[];
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, currentUserId, players }) => {
  const { state, selectUser, sendMessage, blockUser, unblockUser } = useChatContext();
  const { conversations, selected, blockedByMe } = state;
  const messages = selected ? conversations[Number(selected.id)] || [] : [];
  const blockedByYou = selected ? blockedByMe.includes(Number(selected.id)) : false;
  const isBlocked = blockedByYou;
  const [input, setInput] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const COOLDOWN_MS = 500;

  useEscapeKey(onClose);

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
    if (!input.trim() || !selected || cooldown || isBlocked) return;
    const text = input.trim();
    setInput("");
    setCooldown(true);
    cooldownRef.current = setTimeout(() => setCooldown(false), COOLDOWN_MS);
    sendMessage(text);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleBlockToggle = () => {
    if (!selected) return;
    if (blockedByYou) {
      unblockUser(Number(selected.id));
    } else {
      setInput("");
      blockUser(Number(selected.id));
    }
  };

  const handleChallenge = async () => {
    if (!selected) return;
    try {
      await askForChallenge(selected.username);
      toast.success(`Challenge sent to ${selected.username}`);
    } catch {
      toast.error("Failed to send challenge");
    }
  };

  return (
    <>
    <OverlayWrapper>
      <OverlayCard className="w-[90%] max-w-[800px] h-[80vh] flex flex-col overflow-hidden border-[#00a1ff] bg-gradient-to-br from-[#0a0e2a] to-black shadow-[0_0_20px_#00a1ff,0_0_40px_#00a1ff]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-4 text-[#0A7FC9] hover:text-pink-500 text-lg font-bold font-orbitron"
        >
          ✕
        </button>
        <OverlayHeading className="text-2xl mb-4 text-[#e9f4fb] drop-shadow-[0_0_10px_#00a1ff] font-orbitron">
          Chat
        </OverlayHeading>
        <div className="flex flex-1 overflow-hidden rounded-lg bg-black bg-opacity-40">
          <div className="flex flex-col w-56 border-r border-gray-700">
            <ChatUserList players={players} onSelect={selectUser} />
            {state.systemMessages.size > 0 && (
              <div
                className={`system-messages p-2 overflow-y-auto text-xs text-blue-300 font-orbitron bg-black bg-opacity-30 rounded-md mt-2 ${overlayOutlineClass("blue")}`}
              >
                {Array.from(state.systemMessages.values()).map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <SystemNotification id={msg.id} type={msg.type} text={msg.text} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="chat-area flex flex-col flex-1">
            {selected && (
              <div className="p-2 border-b border-gray-700 flex justify-between items-center">
                <span className="font-orbitron">
                  <img className="rounded-full w-16 h-10 object-cover" src={selected.avatar}/>
                  {selected.username}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="text-sm text-blue-400 hover:text-blue-200 font-orbitron flex items-center border border-blue-400 rounded px-2 py-1"
                  >
                    <i className="fa-solid fa-user mr-1" />
                    Profile
                  </button>
                  <button
                    onClick={handleChallenge}
                    className="text-sm text-blue-400 hover:text-blue-200 font-orbitron flex items-center border border-blue-400 rounded px-2 py-1"
                  >
                    <i className="fa-solid fa-gamepad mr-1" />
                    Invite
                  </button>
                  <button
                    onClick={handleBlockToggle}
                    className="text-sm text-blue-400 hover:text-blue-200 font-orbitron flex items-center border border-blue-400 rounded px-2 py-1"
                  >
                    <i className={`fa-solid ${blockedByYou ? 'fa-unlock' : 'fa-ban'} mr-1`} />
                    {blockedByYou ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            )}
            <div
              className="chat-messages flex-1 p-2 overflow-y-auto flex flex-col font-ubuntu"
              ref={messagesEndRef}
            >
              {selected ? (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message-bubble px-6 ${
                      m.sender_id === Number(currentUserId) ? "sent" : "received"
                    }`}
                  >
                    <p className="flex break-words font-ubuntu justify-start">{m.text}</p>
                    <p className="text-xs text-end text-gray-600">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                {blockedByYou && (
                  <div className="text-center text-gray-400 mb-1">You've blocked this user. You can no longer send messages.</div>
                )}
                <div className="flex items-end">
                  <input
                    className="search-input flex-grow mr-2 font-ubuntu focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message..."
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={isBlocked}
                  />
                  <button
                    onClick={handleSend}
                    disabled={input.trim().length === 0 || cooldown || isBlocked}
                    className="bg-gray-900 border border-blue-400 text-white px-4 py-2 rounded-lg shadow-blue-500 hover:bg-gray-800 disabled:opacity-50 font-orbitron"
                    aria-label="Send message"
                  >
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </div>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {MAX_MESSAGE_LENGTH - input.length} left
                </div>
              </div>
            )}
          </div>
        </div>
      </OverlayCard>
    </OverlayWrapper>
    {showProfile && selected && (
      <ChatProfileModal
        user={selected}
        onClose={() => setShowProfile(false)}
        blocked={blockedByYou}
        onToggleBlock={handleBlockToggle}
      />
    )}
    </>
  );
};

export default ChatModal;
