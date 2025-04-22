import React from 'react';
import { EnhancedFriend } from './types/EnhancedFriend';
import FriendItem from './FriendItem';

interface EnhancedFriendsListProps {
  friends: EnhancedFriend[];
}

const EnhancedFriendsList: React.FC<EnhancedFriendsListProps> = ({ friends }) => {
  const sortedFriends = [...friends].sort((a, b) => Number(b.online) - Number(a.online));

  return (
    <ul className="space-y-3">
      {sortedFriends.map((friend, index) => (
        <FriendItem key={index} friend={friend} />
      ))}
    </ul>
  );
};

export default EnhancedFriendsList;
