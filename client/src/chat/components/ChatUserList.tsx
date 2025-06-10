import React, { useState } from "react";
import { UserInfo } from "../../pages/Profile/types/UserInfo";
import "./ChatModal.css";

interface Props {
  players: UserInfo[];
  onSelect: (user: UserInfo) => void;
}

const ChatUserList: React.FC<Props> = ({ players, onSelect }) => {
  const [search, setSearch] = useState("");

  const highlightName = (name: string) => {
    if (!search) return name;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return name.split(regex).map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="search-highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="conversations-list p-2 overflow-y-auto flex-1 font-ubuntu">
      <div className="relative mb-2">
        <i className="fa-solid fa-search absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          className="search-input w-full pr-8 font-ubuntu focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user..."
        />
      </div>
      {players
        .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
        .map((u) => (
          <div className="columns-3xs" key={u.id}>
            <div
              className="conversation-item cursor-pointer hover:text-blue-300 font-ubuntu aspect-3/2 flex items-center space-x-2"
              onClick={() => {
                onSelect(u);
                setSearch("");
              }}
            >
              <img className="rounded-full w-10 h-10 object-cover" src={u.avatar}  />  
              <h2>     </h2>
                  {highlightName(u.username)}
          </div>
          </div>
        ))}
    </div>
  );
};

export default ChatUserList;
