
import React, {
	useState,
	useEffect
  } from "react";
  
  import Avatar from "./Avatar";
  import PlayersList from "./PlayersList";
  import BotCard from "./BotCard";
  import { bots } from "./types/botsData";
  import PlayArena from "./PlayArena";
  import ProfileActions from "./ProfileActions";
  import EnhancedFriendsList from "./EnhancedFriendsList";
  import WinLossChart from "./WinsLossChart";
  import ProfileModal from "./ProfileModal";
  import { EnhancedFriend } from "./types/EnhancedFriend";
  
  type UserType = {
	username: string;
	avatar: string;
	email: string;
	firstName: string;
	lastName: string;
	wins: number;
	losses: number;
	online: boolean;
  };
  
  const Profile: React.FC = () => {
	const [selectedBot, setSelectedBot] = useState<typeof bots[0] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
  
	const [user, setUser] = useState<UserType>(() => {
	  const stored = localStorage.getItem("userData");
	  return stored
		? JSON.parse(stored)
		: {
			username: "Legend",
			avatar: "/prof_img/avatar.webp",
			email: "legend@example.com",
			firstName: "Legi",
			lastName: "Gnoman",
			wins: 12,
			losses: 8,
			online: true,
		  };
	});
  
	useEffect(() => {
	  localStorage.setItem("userData", JSON.stringify(user));
	}, [user]);
  
	const friends: EnhancedFriend[] = [
	  { name: "Alice", online: true, totalWins: 34, totalLosses: 24 },
	  { name: "Bob", online: false, totalWins: 1, totalLosses: 4 },
	  { name: "Charlie", online: true, totalWins: 5, totalLosses: 1 },

	];
  
	const players = [
	  { name: "Zoe", online: true, totalWins: 11, totalLosses: 44 },
	  { name: "Mika", online: false, totalWins: 5, totalLosses: 6 },
	  { name: "Alex", online: true, totalWins: 9, totalLosses: 3 },
	  { name: "Tina", online: false, totalWins: 3, totalLosses: 5 },
	];
  
	return (
	  <>
		<div
		  className="
			min-h-screen
			w-full
			text-white
			flex
			flex-col
			overflow-y-auto
			justify-between
		  "
		>
		  <div
			className="
			  flex
			  justify-between
			  items-center
			  px-6
			  py-4
			"
		  >
			<div
			  className="
				text-xl
				font-bold
				flex
				items-center
				gap-2
			  "
			>
			  <div
				className="
				  w-6
				  h-6
				  bg-gray-400
				  rounded-full
				"
			  />
			  Super Puper Pong
			</div>
			<ProfileActions
			  username={user.username}
			  online={user.online}
			  onProfileClick={() => setIsModalOpen(true)}
			/>
		  </div>
  
		  <div className="flex-grow">
			<div
			  className="
				hidden
				xl:grid
				grid-cols-5
				gap-4
				px-4
			  "
			>
			  <div className="pt-4">
				<h2
				  className="
					text-lg
					font-semibold
					mb-2
					text-left
					drop-shadow-[0_0_8px_red]
				  "
				>
				  Friends
				</h2>
				<EnhancedFriendsList friends={friends} />
			  </div>
  
			  <div className="pt-6">
				{/* <WinLossChart /> */}
			  </div>
  
			  <div
				className="
				  flex
				  flex-col
				  items-center
				  justify-start
				  pt-8
				  gap-6
				"
			  >
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
				<h1 className="text-2xl font-bold">
				  {user.username}
				</h1>
				<p className="text-gray-300">
				  Wins: {user.wins} | Losses: {user.losses}
				</p>
				<button
				  className="
					bg-white
					text-black
					font-bold
					py-2
					px-8
					rounded
					text-xl
					shadow-md
					hover:bg-gray-300
				  "
				>
				  PLAY
				</button>
				<PlayArena
				  username={user.username}
				  opponentImage={selectedBot?.image ?? null}
				  opponentName={selectedBot?.name}
				  playerImage={user.avatar}
				/>
			  </div>
  
			  <div />
  
			  <div
				className="
				  pt-4
				  flex
				  flex-col
				  items-end
				  max-w-[220px]
				  ml-auto
				  col-start-5
				"
			  >
				<h2
				  className="
					text-lg
					font-semibold
					mb-2
					text-right
					drop-shadow-[0_0_8px_red]
				  "
				>
				  Players
				</h2>
				<PlayersList players={players} />
			  </div>
			</div>
  
			<div
			  className="
				flex
				xl:hidden
				flex-col
				items-center
				px-4
				gap-4
			  "
			>
			  <div className="w-full max-w-md">
				{/* <WinLossChart /> */}
			  </div>
			  <Avatar
				src={user.avatar}
				username={user.username}
				className="w-40 h-40 sm:w-48 sm:h-48"
			  />
			  <h1 className="text-2xl font-bold">
				{user.username}
			  </h1>
			  <p className="text-gray-300">
				Wins: {user.wins} | Losses: {user.losses}
			  </p>
			  <button
				className="
				  bg-white
				  text-black
				  font-bold
				  py-2
				  px-8
				  rounded
				  text-xl
				  shadow-md
				  hover:bg-gray-300
				"
			  >
				PLAY
			  </button>
			  <PlayArena
				username={user.username}
				opponentImage={selectedBot?.image ?? null}
				opponentName={selectedBot?.name}
				playerImage={user.avatar}
			  />
			  <div className="w-full flex justify-between gap-4">
				<div className="w-1/2">
				  <h2 className="text-lg font-semibold mb-2 text-left drop-shadow-[0_0_8px_red]">
					Friends
				  </h2>
				  <EnhancedFriendsList friends={friends} />
				</div>
				<div className="w-1/2">
				  <h2 className="text-lg font-semibold mb-2 text-right drop-shadow-[0_0_8px_red]">
					Players
				  </h2>
				  <PlayersList players={players} />
				</div>
			  </div>
			</div>
		  </div>
  
		  <div
			className="
			  bg-gray-900
			  bg-opacity-70
			  w-full
			  flex
			  flex-col
			  text-center
			  pt-2
			  px-4
			  pb-5
			  mt-4
			"
		  >
			<p
			  className="
				text-lg
				text-purple-400
				font-extrabold
				uppercase
				tracking-wide
				drop-shadow-[0_0_8px_white]
			  "
			>
			  Fighters — choose your rival!
			</p>
			<div className="pt-2">
			  <div
				className="
				  grid
				  grid-cols-1
				  sm:grid-cols-2
				  md:grid-cols-3
				  lg:grid-cols-4
				  xl:grid-cols-5
				  gap-3
				  w-full
				  px-2
				  sm:px-4
				"
			  >
				{bots.map((bot, idx) => (
				  <BotCard
					key={idx}
					{...bot}
					onSelect={() => setSelectedBot(bot)}
					selected={selectedBot?.image === bot.image}
				  />
				))}
			  </div>
			</div>
		  </div>
		</div>
  
		{isModalOpen && (
		  <ProfileModal
			onClose={() => setIsModalOpen(false)}
			userData={{
			  avatar: user.avatar,
			  nickname: user.username,
			  email: user.email,
			  firstName: user.firstName,
			  lastName: user.lastName,
			}}
			onSave={({ avatar, nickname, email }) => {
			  setUser((prev: UserType) => ({
				...prev,
				avatar,
				username: nickname,
				email,
			  }));
			  setIsModalOpen(false);
			}}
		  />
		)}
	  </>
	);
  };
  
  export default Profile;