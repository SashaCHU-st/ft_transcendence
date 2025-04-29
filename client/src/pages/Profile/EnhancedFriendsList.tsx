
import React from 'react';
import { EnhancedFriend } from './types/EnhancedFriend';
import FriendItem from './FriendItem';

interface EnhancedFriendsListProps {
  friends: EnhancedFriend[];
}

const EnhancedFriendsList: React.FC<EnhancedFriendsListProps> = ({ friends }) => {
  const sortedFriends = [...friends].sort((a, b) => Number(b.online) - Number(a.online));

  return (
    <ul className="grid
			grid-cols-1
			sm:grid-cols-2
			gap-1
			max-h-[550px]
			overflow-y-auto
			pr-1
			scrollbar-thin
			scrollbar-thumb-white/60
			scrollbar-track-transparent">
      {sortedFriends.map((friend, index) => (
        <FriendItem key={index} friend={friend} />
      ))}
    </ul>
  );
};

export default EnhancedFriendsList;
