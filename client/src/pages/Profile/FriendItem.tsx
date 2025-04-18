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
		// Friend card container
		<li className="bg-gray-800
				bg-opacity-70
				p-3
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
                      text-sm
                      mb-2">
				Wins: {friend.totalWins} | Losses: {friend.totalLosses}
			</div>

			{/* Action buttons */}
			<div className="flex
                gap-2
                w-full
                justify-center
                flex-wrap">
				<button
					onClick={handleRemove}
					className="bg-red-600
					hover:bg-red-700
					text-white
					px-2
					py-1
					rounded
					text-xs
					flex-1
					min-w-[70px]">
					Remove
				</button>
				<button
					onClick={handleChallenge}
					className="bg-blue-600
					hover:bg-blue-700
					text-white
					px-2
					py-1
					rounded
					text-xs
					flex-1
					min-w-[70px]">
					Challenge
				</button>
			</div>

		</li>
	);
};

export default FriendItem;
