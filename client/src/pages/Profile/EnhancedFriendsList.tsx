import React, { useState } from "react";
import PlayerCard from "./PlayerCard";
import Avatar from "./Avatar";
import { CardWrapper } from "./types/ui";
import { UserInfo } from "./types/UserInfo";

interface Props {
  friends: UserInfo[];
}

const EnhancedFriendsList: React.FC<Props> = ({ friends }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <div
      className="
        flex
        flex-col
        gap-2
        overflow-y-auto
        max-h-[500px]
        pr-1
        scrollbar-thin
        scrollbar-thumb-white/60
        scrollbar-track-transparent
      "
    >
      {friends.map((friend, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <CardWrapper key={friend.id ?? index} onClick={() => toggleExpand(index)}>
            {/* Header: avatar, username, status */}
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Avatar
                  user={{ username: friend.username, avatar: friend.avatar }}
                  className="
                    w-8
                    h-8
                  "
                />
                <span
                  className="
                    font-bold
                    text-base
                  "
                >
                  {friend.username}
                </span>
              </div>
              <span
                className={`
                  text-sm
                  ${friend.online ? "text-green-400" : "text-gray-400"}
                `}
              >
                {friend.online ? "Online" : "Offline"}
              </span>
            </div>

            {/* Expandable PlayerCard */}
            <div
              className={`
                transition-all
                duration-300
                overflow-hidden
                ${isExpanded ? "max-h-[600px] mt-3" : "max-h-0"}
              `}
            >
              <PlayerCard user={friend} />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default EnhancedFriendsList;