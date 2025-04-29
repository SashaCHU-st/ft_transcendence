
import React, { useState, useEffect } from "react";
import PlayersList from "./PlayersList";
import BotCard from "./BotCard";
import { bots } from "./types/botsData";
import PlayArena from "./PlayArena";
import ProfileActions from "./ProfileActions";
import EnhancedFriendsList from "./EnhancedFriendsList";
import ProfileModal from "./ProfileModal";
import { PrimaryButton } from "./types/ui";
import GameModeSelector from "./GameModelSelector";
import UserHeader from "./UserHeader";
import { UserInfo, MatchResult } from "./types/UserInfo";
import { toast } from "react-hot-toast";
import { defaultFriends, defaultPlayers } from "./types/fakeNames";

// *** Block: Axios Setup ***
let axios: any;
try {
	axios = require("axios");
} catch (error) {
	console.warn("I noticed axios is not installed, so I’ll use local data instead.");
	axios = null;
}

// *** Block: Default User Data ***
const defaultUser: UserInfo = {
	username: "Legend",
	avatar: "/prof_img/avatar.webp",
	email: "legend@example.com",
	firstName: "Legi",
	lastName: "Gnoman",
	password: "default",
	wins: 30,
	losses: 0,
	online: true,
	history: [
		{ date: "2025-04-21", weekday: "Mon", result: "win" },
		{ date: "2025-04-22", weekday: "Tue", result: "loss" },
		{ date: "2025-04-23", weekday: "Wed", result: "win" },
		{ date: "2025-04-23", weekday: "Wed", result: "win" },
		{ date: "2025-04-23", weekday: "Wed", result: "loss" },
		{ date: "2025-04-24", weekday: "Thu", result: "win" },
	],
};

// *** Block: Server Fetch Functions ***
const fetchUserFromServer = async (): Promise<UserInfo> => {
	if (!axios) throw new Error("I can’t fetch the user because axios is not available.");
	const response = await axios.get("/api/user");
	return response.data;
};

const saveUserToServer = async (user: UserInfo): Promise<void> => {
	if (!axios) throw new Error("I can’t save the user because axios is not available.");
	await axios.post("/api/user", user);
};

const fetchFriendsFromServer = async (): Promise<UserInfo[]> => {
	if (!axios) throw new Error("I can’t fetch friends because axios is not available.");
	const response = await axios.get("/api/friends");
	return response.data.map((friend: UserInfo) => ({
		...friend,
		onRemove: () => toast(`${friend.username} removed from friends 👋`),
		onChallenge: () => toast.success(`Challenge sent to ${friend.username}`),
	}));
};

const fetchPlayersFromServer = async (): Promise<UserInfo[]> => {
	if (!axios) throw new Error("I can’t fetch players because axios is not available.");
	const response = await axios.get("/api/players");
	return response.data.map((player: UserInfo) => ({
		...player,
		onChallenge: () => toast.success(`Challenged ${player.username}`),
	}));
};

// *** Block: Local Data Loader ***
const loadLocalData = () => ({
	user: defaultUser,
	friends: defaultFriends,
	players: defaultPlayers,
});

// *** Block: Profile Component ***
const Profile: React.FC = () => {
	const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<UserInfo | null>(null);
	const [friends, setFriends] = useState<UserInfo[]>([]);
	const [players, setPlayers] = useState<UserInfo[]>([]);
	const [error, setError] = useState<string | null>(null);

	// *** Block: Data Loading Logic ***
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			try {
				if (axios) {
					const userData = await fetchUserFromServer();
					setUser(userData);

					const friendsData = await fetchFriendsFromServer();
					setFriends(friendsData);

					const playersData = await fetchPlayersFromServer();
					setPlayers(playersData);
				} else {
					const localData = loadLocalData();
					setUser(localData.user);
					setFriends(localData.friends);
					setPlayers(localData.players);
				}
			} catch (err) {
				console.error("I encountered an error while loading data:", err);
				const localData = loadLocalData();
				setUser(localData.user);
				setFriends(localData.friends);
				setPlayers(localData.players);
				setError("I couldn’t load data from the server, so I’m using local data instead.");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	// *** Block: Save User Data Function ***
	const saveUserData = async (updatedUser: UserInfo) => {
		try {
			if (axios) {
				await saveUserToServer(updatedUser);
			} else {
				console.warn("I can’t save to the server because axios is not available, so I’ll save locally.");
			}
			setUser(updatedUser);
		} catch (err) {
			console.error("I encountered an error while saving data:", err);
			setError("I couldn’t save the data. Please try again.");
		}
	};

	// *** Block: Handle Profile Save ***
	const handleSaveProfile = async (data: {
		avatar: string;
		username: string;
		email: string;
		password: string;
	}) => {
		if (!user) return;

		const updatedUser = {
			...user,
			avatar: data.avatar,
			username: data.username,
			email: data.email,
			password: data.password || user.password,
		};
		await saveUserData(updatedUser);
		setIsModalOpen(false);
	};

	// *** Block: Handle Game End ***
	const handleGameEnd = async (result: "win" | "loss") => {
		if (!user) return;

		const today = new Date().toISOString().split("T")[0];
		const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());

		const updatedUser = {
			...user,
			history: [...user.history, { date: today, weekday, result }],
			wins: result === "win" ? user.wins + 1 : user.wins,
			losses: result === "loss" ? user.losses + 1 : user.losses,
		};

		await saveUserData(updatedUser);
	};

	// *** Block: Handle Play Click ***
	const handlePlayClick = () => {
		if (!selectedBot) {
			toast.error("I need you to select a bot to play with first!");
			return;
		}

		const result = Math.random() > 0.5 ? "win" : "loss";
		handleGameEnd(result);
		toast.success(`Game over! You ${result === "win" ? "won" : "lost"} against ${selectedBot.name}!`);
	};

	// *** Block: Loading and Error States ***
	if (isLoading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center text-white">
				I’m loading the data, please wait...
			</div>
		);
	}

	if (error && !user) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center text-white">
				{error}
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center text-white">
				I couldn’t find the user data.
			</div>
		);
	}

	// *** Block: Main Render ***
	return (
		<>
			{/* *** Block: Main Container *** */}
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
				{/* *** Block: Header and Profile Actions *** */}
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
              text-transparent
              bg-clip-text
              bg-gradient-to-r
              from-red-400
              via-indigo-300
              to-green-300
              text-2xl
              sm:text-3xl
              font-bold
              transition-transform
              duration-300
              ease-in-out
              hover:scale-110
            "
						style={{
							textShadow: `0 0 20px rgba(255, 255, 255, 0.3), 
										0 0 32px rgba(255, 0, 255, 0.3)`,
						}}
					>
						NEON PONG
					</div>
					<ProfileActions
						user={{ username: user.username, online: user.online }}
						onProfileClick={() => setIsModalOpen(true)}
					/>
				</div>

				{/* *** Block: Large Screen Layout *** */}
				<div
					className="
            hidden
            xl:grid
            xl:grid-cols-6
            gap-4
            px-4
            flex-grow
          "
				>
					{/* *** Block: Friends List (Large Screens) *** */}
					<div
						className="
              pt-4
              flex
              flex-col
              items-start
              col-span-1
              max-w-[220px]
            "
					>
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

					{/* *** Block: Fight Video (Large Screens) *** */}
					<div
						className="
              pt-6
              col-span-1 
              mx-auto
            "
					>
						<div
							className="
                w-full
                max-w-[750px]
                bg-gray-800
                bg-opacity-40
                rounded-lg
                p-1
                shadow-lg
                ml-14
                mt-32
              "
						>
							<video
								src="/videos/fight_gif.mp4"
								autoPlay
								loop
								muted
								playsInline
								className="w-full h-auto rounded-lg"
							/>
						</div>
					</div>

					{/* *** Block: Central Section (Large Screens) *** */}
					<div
						className="
              pt-8
              flex
              flex-col
              items-center
              justify-start
              gap-6
              col-span-2
            "
					>
						<UserHeader
							user={{ username: user.username,
									avatar: user.avatar,
									wins: user.wins,
									losses: user.losses,
									history: user.history }}
						/>
						<PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>
						<PlayArena
							user={{ username: user.username, avatar: user.avatar }}
							opponentImage={selectedBot ? selectedBot.image : null}
							opponentName={selectedBot ? selectedBot.name : undefined}
						/>
					</div>

					{/* *** Block: Game Mode Selector (Large Screens) *** */}
					<div
						className="
              pt-8
              flex
              justify-center
              col-span-1
            "
					>
						<div
							className="
                flex
                flex-col
                items-center
                justify-start
                pt-5
                px-2
                xl:px-5
                w-full
                max-w-[320px]
                xl:max-w-full
              "
						>
							<GameModeSelector />
						</div>
					</div>

					{/* *** Block: Players List (Large Screens) *** */}
					<div
						className="
              pt-4
              flex
              flex-col
              items-end
              col-span-1
              max-w-[220px]
              ml-auto
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

				{/* *** Block: Small Screen Layout *** */}
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
					{/* *** Block: User Header (Small Screens) *** */}
					<UserHeader
						user={{ username: user.username,
								avatar: user.avatar,
								wins: user.wins,
								losses: user.losses,
								history: user.history }}
					/>
					<PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>

					{/* *** Block: Play Arena (Small Screens) *** */}
					<PlayArena
						user={{ username: user.username, avatar: user.avatar }}
						opponentImage={selectedBot ? selectedBot.image : null}
						opponentName={selectedBot ? selectedBot.name : undefined}
					/>

					{/* *** Block: Game Mode Selector (Small Screens) *** */}
					<div
						className="
              w-full
              max-w-xs
              mt-4
            "
					>
						<GameModeSelector />
					</div>

					{/* *** Block: Friends and Players Lists (Small Screens) *** */}
					<div
						className="
              w-full
              flex
              flex-col
              sm:flex-row
              sm:justify-between
              gap-4
            "
					>
						{/* *** Block: Friends List (Small Screens) *** */}
						<div
							className="
                w-full
                sm:w-1/2
                min-w-0
              "
						>
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

						{/* *** Block: Players List (Small Screens) *** */}
						<div
							className="
                w-full
                sm:w-1/2
                min-w-0
                flex
                flex-col
                items-end
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

					{/* *** Block: Fight Video (Small Screens) *** */}
					<div
						className="
              w-full
              mt-8
            "
					>
						<div
							className="
                w-full
                max-w-[600px]
                bg-gray-800
                bg-opacity-50
                rounded-2xl
                p-4
                shadow-lg
                mx-auto
              "
						>
							<video
								src="/videos/fight_gif.mp4"
								autoPlay
								loop
								muted
								playsInline
								className="w-full h-auto rounded-lg"
							/>
						</div>
					</div>
				</div>

				{/* *** Block: Bots Selection Section *** */}
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

			{/* *** Block: Profile Modal *** */}
			{isModalOpen && (
				<ProfileModal
					onClose={() => setIsModalOpen(false)}
					userData={{
						avatar: user.avatar,
						username: user.username,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
					}}
					onSave={handleSaveProfile}
				/>
			)}
		</>
	);
};

export default Profile;