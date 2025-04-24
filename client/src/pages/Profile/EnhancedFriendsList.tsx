
import React, { useState } from "react";
import { EnhancedFriend } from "./types/EnhancedFriend";
import PlayerCard from "./PlayerCard";
import { CardWrapper } from "./types/ui";
import { toast } from 'react-hot-toast';

interface Props {
  friends: EnhancedFriend[];
}

const EnhancedFriendsList: React.FC<Props> = ({ friends }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="
      flex 
      flex-col 
      gap-2 
      overflow-y-auto 
      max-h-[500px] 
      pr-1 
      scrollbar-thin 
      scrollbar-thumb-white/60 
      scrollbar-track-transparent
    ">
      {friends.map((friend, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <CardWrapper key={index} onClick={() => toggleExpand(index)}>
            <div className="flex justify-between items-center">
              <div className="font-bold text-base">{friend.name}</div>
              <div className={`text-sm ${friend.online ? "text-green-400" : "text-gray-400"}`}>
                {friend.online ? "Online" : "Offline"}
              </div>
            </div>

            {/* Expanded content */}
            <div className={`
              transition-all 
              duration-300 
              overflow-hidden 
              ${isExpanded ? "max-h-[600px] mt-3" : "max-h-0"}
            `}>
              <PlayerCard
                name={friend.name}
                online={friend.online}
                wins={friend.totalWins}
                losses={friend.totalLosses}
                onRemove={() => toast(`${friend.name} removed from friends 👋`)}
                onChallenge={() => toast.success(`Challenge sent to ${friend.name}`)}
              />
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export default EnhancedFriendsList;
