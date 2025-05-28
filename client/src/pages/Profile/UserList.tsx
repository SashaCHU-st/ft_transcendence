
import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import { CardWrapper } from "./types/ui";
import { UserInfo } from "./types/UserInfo";
import { addToFavorites } from "./AddFavorites";
//import { deleteFromFavorites } from "./DeleteFavorites";

// Props definition for UserList component
// - users: array of UserInfo objects to display
// - variant: determines if this list is "players" or "friends"
// - expandUsername: optional username to auto-expand on render
interface Props {
  users: UserInfo[];
  variant: "players" | "friends";
  expandUsername?: string;
  onAdd?: (username: string) => void;
  onRemove?: (username: string)=> void;
}

const UserList: React.FC<Props> = ({ users, variant, expandUsername, onRemove}) => {
  // State for tracking which card index is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
 
  // When expandUsername changes, find matching user and auto-expand
  useEffect(() => {
    if (expandUsername) {
      const idx = users.findIndex(
        (u) => u.username.toLowerCase() === expandUsername.toLowerCase()
      );
      if (idx !== -1) {
        setExpandedIndex(idx);
      }
    }
  }, [expandUsername, users]);

  // Toggle expand/collapse state for a given index
  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Stub handlers for friend/player actions
 // const handleAdd = (username: string) => console.log(`Add ${username}`);
   const handleAdd = async (username: string) => {
    try {
       await addToFavorites(username);
      console.log(`Added ${username} to favorites`);
      
    } catch (err) {
      console.error("Failed to add favorite:", err);
    }
  };
  // const handleRemove = async (username: string) => {
  //   try{
  //     await deleteFromFavorites(username);
     
  //     console.log(`Remove ${username}`);
  //   }catch (err) {
  //     console.error("Failed to delete from favorite:", err);
  //   }

  // }
  const handleChallenge = (username: string) => console.log(`Challenge ${username}`);

  // If no users, render nothing
  if (users.length === 0) {
    return null;
  }

  return (
    <div
      className={
        `
        flex
        flex-col
        gap-2
        overflow-y-auto
        max-h-[500px]
        pr-1
        scrollbar-hidden
      `
      }
    >
      {users.map((user, idx) => {
        const isExpanded = expandedIndex === idx;
        const expandedStyle = {
          transition: "all 0.3s ease",
          overflow: "hidden",
          maxHeight: isExpanded ? "600px" : "0",
          marginTop: isExpanded ? "0.75rem" : "0",
        };

        // Determine avatar source, fallback to default if not base64 data
        const avatarSrc =
          user.avatar.startsWith("data:image")
            ? user.avatar
            : "/prof_img/avatar1.png";

            // Attach action callbacks based on list variant
        const userWithActions: UserInfo = {
          ...user,
          avatar: avatarSrc,
          onRemove:
            variant === "friends" && onRemove
              ? () => onRemove(user.username)
              : undefined,
          onChallenge: () => handleChallenge(user.username),
          onAdd:
            variant === "players"
              ? () => handleAdd(user.username)
              : undefined,
        };

        return (
          <CardWrapper key={user.id} onClick={() => toggleExpand(idx)}>
            {/* Header row: avatar, username, online status */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={avatarSrc}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/prof_img/avatar1.png";
                  }}
                />
                <span className="font-bold text-base">{user.username}</span>
              </div>
              <span
                className={
                  `text-sm ${
                    user.online ? "text-green-400" : "text-gray-400"
                  }`
                }
              >
                {user.online ? "Online" : "Offline"}
              </span>
            </div>

            {/* Expandable content container */}
            <div style={expandedStyle}>
              <PlayerCard user={userWithActions} />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default UserList;
