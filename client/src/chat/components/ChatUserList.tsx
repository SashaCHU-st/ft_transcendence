import React, { useState } from "react";
import { UserInfo } from "../../pages/Profile/types/UserInfo";
import "./ChatModal.css";

interface Props {
  players: UserInfo[];
  onSelect: (user: UserInfo) => void;
}

const ChatUserList: React.FC<Props> = ({ players, onSelect }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="conversations-list p-2 overflow-y-auto flex-1 font-ubuntu">
      <input
        className="search-input w-full mb-2 font-ubuntu"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search user..."
      />
      {players
        .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
        .map((u) => (
          <div
            key={u.id}
            className="conversation-item cursor-pointer hover:text-blue-300 font-ubuntu"
            onClick={() => {
              onSelect(u);
              setSearch("");
            }}
          >
            {u.username}
          </div>
        ))}
    </div>
  );
};

export default ChatUserList;
