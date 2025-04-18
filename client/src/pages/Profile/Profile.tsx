import React, {
	useState
  } from 'react';
  
  import Avatar from './Avatar';
  import PlayersList from './PlayersList';
  import BotCard from './BotCard';
  import { bots } from './types/botsData';
  import PlayArena from './PlayArena';
  import ProfileActions from './ProfileActions';
  import EnhancedFriendsList from './EnhancedFriendsList';
  import { EnhancedFriend } from './types/EnhancedFriend';
  
  const Profile: React.FC = () => {
	const [selectedBotImage, setSelectedBotImage] = useState<string | null>(null);
  
	const user = {
	  username: 'Legend',
	  avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Legend',
	  wins: 12,
	  losses: 8,
	  online: true
	};
  
	const friends: EnhancedFriend[] = [
	  { name: 'Alice',   online: true,  totalWins: 3,  totalLosses: 2 },
	  { name: 'Bob',     online: false, totalWins: 1,  totalLosses: 4 },
	  { name: 'Charlie', online: true,  totalWins: 5,  totalLosses: 1 },
	  { name: 'David',   online: true,  totalWins: 2,  totalLosses: 3 },
	  { name: 'Eve',     online: false, totalWins: 4,  totalLosses: 4 }
	];
  
	const players = [
	  { name: 'Zoe',  online: true,  totalWins: 11, totalLosses: 4 },
	  { name: 'Mika', online: false, totalWins: 5,  totalLosses: 6 },
	  { name: 'Alex', online: true,  totalWins: 9,  totalLosses: 3 },
	  { name: 'Tina', online: false, totalWins: 3,  totalLosses: 5 }
	];
  
	return (
	  <div className="
		min-h-screen
		w-full
		text-white
		flex
		flex-col
	  ">
		{/* Header */}
		<div className="
		  flex
		  justify-between
		  items-center
		  px-6
		  py-4
		">
		  <div className="
			text-xl
			font-bold
			flex
			items-center
			gap-2
		  ">
			<div className="
			  w-6
			  h-6
			  bg-gray-400
			  rounded-full
			" />
			Super Pong
		  </div>
  
		  <ProfileActions
			username={user.username}
			online={user.online}
		  />
		</div>
  
		{/* Main Layout */}
		<div className="
		  flex
		  flex-1
		  overflow-hidden
		">
		  {/* Friends Sidebar */}
		  <div className="
			flex
			flex-col
			items-start
			w-1/5
			min-w-[120px]
			px-4
			pt-4
		  ">
			<h2 className="
			  text-lg
			  font-semibold
			  mb-2
			  text-left
			">
			  Friends
			</h2>
			<EnhancedFriendsList friends={friends} />
		  </div>
  
		  {/* Center Content */}
		  <main className="
			flex-1
			flex
			flex-col
			items-center
			justify-start
			pt-8
			gap-6
		  ">
			<Avatar
			  src={user.avatar}
			  username={user.username}
			  className="
				w-40
				h-40
				sm:w-48
				sm:h-48
			  "
			/>
			<h1 className="
			  text-2xl
			  font-bold
			">
			  {user.username}
			</h1>
			<p className="text-gray-300">
			  Wins: {user.wins} | Losses: {user.losses}
			</p>
			<button className="
			  bg-white
			  text-black
			  font-bold
			  py-2
			  px-8
			  rounded
			  text-xl
			  shadow-md
			  hover:bg-gray-300
			">
			  PLAY
			</button>
			<PlayArena
			  username={user.username}
			  opponentImage={selectedBotImage}
			/>
		  </main>
  
		  {/* Players Sidebar */}
		  <div className="
			flex
			flex-col
			items-end
			w-1/5
			min-w-[120px]
			px-4
			pt-4
		  ">
			<h2 className="
			  text-lg
			  font-semibold
			  mb-2
			  text-right
			">
			  Players
			</h2>
			<PlayersList players={players} />
		  </div>
		</div>
  
		{/* Footer with Bots */}
		<div className="
		  bg-gray-900
		  bg-opacity-60
		  py-6
		  px-4
		  text-center
		">
		  <p className="
			text-sm
			text-gray-300
			mb-4
		  ">
			Bots to play
		  </p>
  
		  <div className="
			flex
			flex-wrap
			justify-center
			gap-4
			max-w-6xl
			mx-auto
		  ">
			{bots.map((bot, idx) => (
			  <BotCard
				key={idx}
				{...bot}
				onSelect={() => setSelectedBotImage(bot.image)}
			  />
			))}
		  </div>
		</div>
	  </div>
	);
  };
  
  export default Profile;
  