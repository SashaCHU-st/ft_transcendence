import React from 'react';
import { EnhancedFriend } from './types/EnhancedFriend';
import { toast } from 'react-hot-toast';

interface FriendItemProps {
  friend: EnhancedFriend;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const handleRemove = () => toast(`${friend.name} removed from friends 👋`);
  const handleChallenge = () => toast.success(`Challenge sent to ${friend.name}`);

  return (
    <li className="bg-gray-800 bg-opacity-70 p-1 rounded shadow-sm flex flex-col sm:flex-row justify-between items-center text-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{friend.name}</span>
        <span className={`h-2.5 w-2.5 rounded-full ${friend.online ? 'bg-green-400' : 'bg-gray-500'}`} />
      </div>
      <div className="text-gray-400 text-xs sm:text-sm">
        Wins: {friend.totalWins} | Losses: {friend.totalLosses}
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button onClick={handleRemove} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">
          Remove
        </button>
        <button onClick={handleChallenge} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs">
          Challenge
        </button>
      </div>
    </li>
  );
};

export default FriendItem;
