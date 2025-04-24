import React from 'react';
import { EnhancedFriend } from './types/EnhancedFriend';

interface FriendItemProps {
	friend: EnhancedFriend;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
	return (
		// Friend card container
		<li className="bg-gray-800
				bg-opacity-50
				p-1
				rounded
				shadow-sm
				flex
				flex-col
				items-center
				text-center
				w-full
				mx-auto">

			{/* Name and online indicator */}
			<div className="flex
                      items-center
                      justify-center
                      gap-2
                      mb-1">
				<span className="font-semibold">{friend.name}</span>
				<span className={`h-2.5
								w-2.5
								rounded-full
								${friend.online ? 'bg-green-400'
													: 'bg-gray-500'}`} />
			</div>

			{/* Win/Loss stats */}
			<div className="text-gray-300
                      mb-1">
				Wins: {friend.totalWins} | Losses: {friend.totalLosses}
			</div>
		</li>
	);
};

export default FriendItem;
