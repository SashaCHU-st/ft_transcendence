
// import React, { useState, useEffect } from "react";
// import PlayersList from "./PlayersList";
// import BotCard from "./BotCard";
// import { bots } from "./types/botsData";
// import PlayArena from "./PlayArena";
// import ProfileActions from "./ProfileActions";
// import EnhancedFriendsList from "./EnhancedFriendsList";
// import ProfileModal from "./ProfileModal";
// import { PrimaryButton } from "./types/ui";
// import GameModeSelector from "./GameModeSelector";
// import UserHeader from "./UserHeader";
// import { UserInfo, MatchResult } from "./types/UserInfo";
// import { toast } from "react-hot-toast";
// import { defaultFriends, defaultPlayers } from "./types/fakeNames";

// // *** Block: Axios Setup ***
// let axios: any;
// try {
// 	axios = require("axios");
// } catch (error) {
// 	console.warn("I noticed axios is not installed, so I’ll use local data instead.");
// 	axios = null;
// }

// // *** Block: Default User Data ***
// const defaultUser: UserInfo = {
// 	username: "Legend",
// 	avatar: "/prof_img/avatar1.png",
// 	email: "legend@example.com",
// 	name: "Oleg",
// 	password: "default",
// 	wins: 30,
// 	losses: 0,
// 	online: true,
// 	history: [
// 		{ date: "2025-04-21", weekday: "Mon", result: "win" },
// 		{ date: "2025-04-22", weekday: "Tue", result: "loss" },
// 		{ date: "2025-04-23", weekday: "Wed", result: "win" },
// 		{ date: "2025-04-23", weekday: "Wed", result: "win" },
// 		{ date: "2025-04-23", weekday: "Wed", result: "loss" },
// 		{ date: "2025-04-24", weekday: "Thu", result: "win" },
// 	],
// };

// // *** Block: Server Fetch Functions ***
// const fetchUserFromServer = async (): Promise<UserInfo> => {
// 	if (!axios) throw new Error("I can’t fetch the user because axios is not available.");
// 	const response = await axios.get("/api/user");
// 	return response.data;
// };

// const saveUserToServer = async (user: UserInfo): Promise<void> => {
// 	if (!axios) throw new Error("I can’t save the user because axios is not available.");
// 	await axios.post("/api/user", user);
// };

// const fetchFriendsFromServer = async (): Promise<UserInfo[]> => {
// 	if (!axios) throw new Error("I can’t fetch friends because axios is not available.");
// 	const response = await axios.get("/api/friends");
// 	return response.data.map((friend: UserInfo) => ({
// 		...friend,
// 		onRemove: () => toast(`${friend.username} removed from friends 👋`),
// 		onChallenge: () => toast.success(`Challenge sent to ${friend.username}`),
// 	}));
// };

// const fetchPlayersFromServer = async (): Promise<UserInfo[]> => {
// 	if (!axios) throw new Error("I can’t fetch players because axios is not available.");
// 	const response = await axios.get("/api/players");
// 	return response.data.map((player: UserInfo) => ({
// 		...player,
// 		onChallenge: () => toast.success(`Challenged ${player.username}`),
// 	}));
// };

// // *** Block: Local Data Loader ***
// const loadLocalData = () => ({
// 	user: defaultUser,
// 	friends: defaultFriends,
// 	players: defaultPlayers,
// });

// // *** Block: Profile Component ***
// const Profile: React.FC = () => {
// 	const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [user, setUser] = useState<UserInfo | null>(null);
// 	const [friends, setFriends] = useState<UserInfo[]>([]);
// 	const [players, setPlayers] = useState<UserInfo[]>([]);
// 	const [error, setError] = useState<string | null>(null);

// 	// *** Block: Data Loading Logic ***
// 	useEffect(() => {
// 		const loadData = async () => {
// 			setIsLoading(true);
// 			try {
// 				if (axios) {
// 					const userData = await fetchUserFromServer();
// 					setUser(userData);

// 					const friendsData = await fetchFriendsFromServer();
// 					setFriends(friendsData);

// 					const playersData = await fetchPlayersFromServer();
// 					setPlayers(playersData);
// 				} else {
// 					const localData = loadLocalData();
// 					setUser(localData.user);
// 					setFriends(localData.friends);
// 					setPlayers(localData.players);
// 				}
// 			} catch (err) {
// 				console.error("I encountered an error while loading data:", err);
// 				const localData = loadLocalData();
// 				setUser(localData.user);
// 				setFriends(localData.friends);
// 				setPlayers(localData.players);
// 				setError("I couldn’t load data from the server, so I’m using local data instead.");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		};

// 		loadData();
// 	}, []);

// 	// *** Block: Save User Data Function ***
// 	const saveUserData = async (updatedUser: UserInfo) => {
// 		try {
// 			if (axios) {
// 				await saveUserToServer(updatedUser);
// 			} else {
// 				console.warn("I can’t save to the server because axios is not available, so I’ll save locally.");
// 			}
// 			setUser(updatedUser);
// 		} catch (err) {
// 			console.error("I encountered an error while saving data:", err);
// 			setError("I couldn’t save the data. Please try again.");
// 		}
// 	};

// 	// *** Block: Handle Profile Save ***
// 	const handleSaveProfile = async (data: {
// 		avatar: string;
// 		username: string;
// 		password: string;
// 	}) => {
// 		if (!user) return;

// 		const updatedUser = {
// 			...user,
// 			avatar: data.avatar,
// 			username: data.username,
// 			password: data.password || user.password,
// 		};
// 		await saveUserData(updatedUser);
// 		setIsModalOpen(false);
// 	};

// 	// *** Block: Handle Game End ***
// 	const handleGameEnd = async (result: "win" | "loss") => {
// 		if (!user) return;

// 		const today = new Date().toISOString().split("T")[0];
// 		const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());

// 		const updatedUser = {
// 			...user,
// 			history: [...user.history, { date: today, weekday, result }],
// 			wins: result === "win" ? user.wins + 1 : user.wins,
// 			losses: result === "loss" ? user.losses + 1 : user.losses,
// 		};

// 		await saveUserData(updatedUser);
// 	};

// 	// *** Block: Handle Play Click ***
// 	const handlePlayClick = () => {
// 		if (!selectedBot) {
// 			toast.error("I need you to select a bot to play with first!");
// 			return;
// 		}

// 		const result = Math.random() > 0.5 ? "win" : "loss";
// 		handleGameEnd(result);
// 		toast.success(`Game over! You ${result === "win" ? "won" : "lost"} against ${selectedBot.name}!`);
// 	};

// 	// *** Block: Loading and Error States ***
// 	if (isLoading) {
// 		return (
// 			<div className="min-h-screen w-full flex items-center justify-center text-white">
// 				I’m loading the data, please wait...
// 			</div>
// 		);
// 	}

// 	if (error && !user) {
// 		return (
// 			<div className="min-h-screen w-full flex items-center justify-center text-white">
// 				{error}
// 			</div>
// 		);
// 	}

// 	if (!user) {
// 		return (
// 			<div className="min-h-screen w-full flex items-center justify-center text-white">
// 				I couldn’t find the user data.
// 			</div>
// 		);
// 	}

// 	// *** Block: Main Render ***
// 	return (
// 		<>
// 			{/* *** Block: Main Container *** */}
// 			<div
// 				className="
//           min-h-screen
//           w-full
//           text-white
//           flex
//           flex-col
//           overflow-y-auto
//           justify-between
//         "
// 			>
// 				{/* *** Block: Header and Profile Actions *** */}
// 				<div
// 					className="
//             flex
//             justify-between
//             items-center
//             px-6
//             py-4
//           "
// 				>
// 					<div
// 						className="
//               text-transparent
//               bg-clip-text
//               bg-gradient-to-r
//               from-red-400
//               via-indigo-300
//               to-green-300
//               text-2xl
//               sm:text-3xl
//               font-bold
//               transition-transform
//               duration-300
//               ease-in-out
//               hover:scale-110
//             "
// 						style={{
// 							textShadow: `0 0 20px rgba(255, 255, 255, 0.3), 
// 										0 0 32px rgba(255, 0, 255, 0.3)`,
// 						}}
// 					>
// 						NEON PONG
// 					</div>
// 					<ProfileActions
// 						user={{ username: user.username, online: user.online }}
// 						onProfileClick={() => setIsModalOpen(true)}
// 					/>
// 				</div>

// 				{/* *** Block: Large Screen Layout *** */}
// 				<div
// 					className="
//             hidden
//             xl:grid
//             xl:grid-cols-6
//             gap-4
//             px-4
//             flex-grow
//           "
// 				>
// 					{/* *** Block: Friends List (Large Screens) *** */}
// 					<div
// 						className="
//               pt-4
//               flex
//               flex-col
//               items-start
//               col-span-1
//               max-w-[220px]
//             "
// 					>
// 						<h2
// 							className="
//                 text-lg
//                 font-semibold
//                 mb-2
//                 text-left
//                 drop-shadow-[0_0_8px_red]
//               "
// 						>
// 							Friends
// 						</h2>
// 						<EnhancedFriendsList friends={friends} />
// 					</div>

// 					{/* *** Block: Fight Video (Large Screens) *** */}
// 					<div
// 						className="
//               pt-6
//               col-span-1 
//               mx-auto
//             "
// 					>
// 						<div
// 							className="
//                 w-full
//                 max-w-[750px]
//                 bg-gray-800
//                 bg-opacity-40
//                 rounded-lg
//                 p-1
//                 shadow-lg
//                 ml-14
//                 mt-32
//               "
// 						>
// 							<video
// 								src="/videos/fight_gif.mp4"
// 								autoPlay
// 								loop
// 								muted
// 								playsInline
// 								className="w-full h-auto rounded-lg"
// 							/>
// 						</div>
// 					</div>

// 					{/* *** Block: Central Section (Large Screens) *** */}
// 					<div
// 						className="
//               pt-8
//               flex
//               flex-col
//               items-center
//               justify-start
//               gap-6
//               col-span-2
//             "
// 					>
// 						<UserHeader
// 							user={{ username: user.username,
// 									avatar: user.avatar,
// 									wins: user.wins,
// 									losses: user.losses,
// 									history: user.history }}
// 						/>
// 						<PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>
// 						<PlayArena
// 							user={{ username: user.username, avatar: user.avatar }}
// 							opponentImage={selectedBot ? selectedBot.image : null}
// 							opponentName={selectedBot ? selectedBot.name : undefined}
// 						/>
// 					</div>

// 					{/* *** Block: Game Mode Selector (Large Screens) *** */}
// 					<div
// 						className="
//               pt-8
//               flex
//               justify-center
//               col-span-1
//             "
// 					>
// 						<div
// 							className="
//                 flex
//                 flex-col
//                 items-center
//                 justify-start
//                 pt-5
//                 px-2
//                 xl:px-5
//                 w-full
//                 max-w-[320px]
//                 xl:max-w-full
//               "
// 						>
// 							<GameModeSelector />
// 						</div>
// 					</div>

// 					{/* *** Block: Players List (Large Screens) *** */}
// 					<div
// 						className="
//               pt-4
//               flex
//               flex-col
//               items-end
//               col-span-1
//               max-w-[220px]
//               ml-auto
//             "
// 					>
// 						<h2
// 							className="
//                 text-lg
//                 font-semibold
//                 mb-2
//                 text-right
//                 drop-shadow-[0_0_8px_red]
//               "
// 						>
// 							Players
// 						</h2>
// 						<PlayersList players={players} />
// 					</div>
// 				</div>

// 				{/* *** Block: Small Screen Layout *** */}
// 				<div
// 					className="
//             flex
//             xl:hidden
//             flex-col
//             items-center
//             px-4
//             gap-4
//           "
// 				>
// 					{/* *** Block: User Header (Small Screens) *** */}
// 					<UserHeader
// 						user={{ username: user.username,
// 								avatar: user.avatar,
// 								wins: user.wins,
// 								losses: user.losses,
// 								history: user.history }}
// 					/>
// 					<PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>

// 					{/* *** Block: Play Arena (Small Screens) *** */}
// 					<PlayArena
// 						user={{ username: user.username, avatar: user.avatar }}
// 						opponentImage={selectedBot ? selectedBot.image : null}
// 						opponentName={selectedBot ? selectedBot.name : undefined}
// 					/>

// 					{/* *** Block: Game Mode Selector (Small Screens) *** */}
// 					<div
// 						className="
//               w-full
//               max-w-xs
//               mt-4
//             "
// 					>
// 						<GameModeSelector />
// 					</div>

// 					{/* *** Block: Friends and Players Lists (Small Screens) *** */}
// 					<div
// 						className="
//               w-full
//               flex
//               flex-col
//               sm:flex-row
//               sm:justify-between
//               gap-4
//             "
// 					>
// 						{/* *** Block: Friends List (Small Screens) *** */}
// 						<div
// 							className="
//                 w-full
//                 sm:w-1/2
//                 min-w-0
//               "
// 						>
// 							<h2
// 								className="
//                   text-lg
//                   font-semibold
//                   mb-2
//                   text-left
//                   drop-shadow-[0_0_8px_red]
//                 "
// 							>
// 								Friends
// 							</h2>
// 							<EnhancedFriendsList friends={friends} />
// 						</div>

// 						{/* *** Block: Players List (Small Screens) *** */}
// 						<div
// 							className="
//                 w-full
//                 sm:w-1/2
//                 min-w-0
//                 flex
//                 flex-col
//                 items-end
//               "
// 						>
// 							<h2
// 								className="
//                   text-lg
//                   font-semibold
//                   mb-2
//                   text-right
//                   drop-shadow-[0_0_8px_red]
//                 "
// 							>
// 								Players
// 							</h2>
// 							<PlayersList players={players} />
// 						</div>
// 					</div>

// 					{/* *** Block: Fight Video (Small Screens) *** */}
// 					<div
// 						className="
//               w-full
//               mt-8
//             "
// 					>
// 						<div
// 							className="
//                 w-full
//                 max-w-[600px]
//                 bg-gray-800
//                 bg-opacity-50
//                 rounded-2xl
//                 p-4
//                 shadow-lg
//                 mx-auto
//               "
// 						>
// 							<video
// 								src="/videos/fight_gif.mp4"
// 								autoPlay
// 								loop
// 								muted
// 								playsInline
// 								className="w-full h-auto rounded-lg"
// 							/>
// 						</div>
// 					</div>
// 				</div>

// 				{/* *** Block: Bots Selection Section *** */}
// 				<div
// 					className="
//             bg-gray-900
//             bg-opacity-70
//             w-full
//             flex
//             flex-col
//             text-center
//             pt-2
//             px-4
//             pb-5
//             mt-4
//           "
// 				>
// 					<p
// 						className="
//               text-lg
//               text-purple-400
//               font-extrabold
//               uppercase
//               tracking-wide
//               drop-shadow-[0_0_8px_white]
//             "
// 					>
// 						Fighters — choose your rival!
// 					</p>

// 					<div className="pt-2">
// 						<div
// 							className="
//                 grid
//                 grid-cols-1
//                 sm:grid-cols-2
//                 md:grid-cols-3
//                 lg:grid-cols-4
//                 xl:grid-cols-5
//                 gap-3
//                 w-full
//                 px-2
//                 sm:px-4
//               "
// 						>
// 							{bots.map((bot, idx) => (
// 								<BotCard
// 									key={idx}
// 									{...bot}
// 									onSelect={() => setSelectedBot(bot)}
// 									selected={selectedBot?.image === bot.image}
// 								/>
// 							))}
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* *** Block: Profile Modal *** */}
// 			{isModalOpen && (
// 				<ProfileModal
// 					onClose={() => setIsModalOpen(false)}
// 					userData={{
// 						avatar: user.avatar,
// 						username: user.username,
// 						name: user.name,
// 					}}
// 					onSave={handleSaveProfile}
// 				/>
// 			)}
// 		</>
// 	);
// };

// export default Profile;


import React, { useState, useEffect } from "react";
import PlayersList from "./PlayersList";
import BotCard from "./BotCard";
import { bots } from "./types/botsData";
import PlayArena from "./PlayArena";
import ProfileActions from "./ProfileActions";
import EnhancedFriendsList from "./EnhancedFriendsList";
import ProfileModal from "./ProfileModal";
import { PrimaryButton } from "./types/ui";
import GameModeSelector from "./GameModeSelector";
import UserHeader from "./UserHeader";
import { UserInfo, MatchResult } from "./types/UserInfo";
import { toast } from "react-hot-toast";
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded token:", decoded);
      return decoded;
    } catch (e) {
      console.error("Failed to decode token:", e);
      return null; // Возвращаем null вместо ошибки
    }
  };

  const fetchDataFromServer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      throw new Error("No token found, please log in.");
    }

    console.log("Fetching data with token:", token);
    const response = await fetch("http://localhost:3000/users", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Server responded with status ${response.status}: ${response.statusText}`);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response:", data);

    if (!data.users || !Array.isArray(data.users)) {
      console.error("Invalid server response: 'users' field is missing or not an array");
      throw new Error("Invalid server response");
    }

    // Поскольку id в токене отсутствует, будем считать последнего зарегистрированного пользователя текущим
    const currentUser = data.users[data.users.length - 1]; // Временное решение: берём последнего пользователя
    if (!currentUser) {
      console.error("No users found in response:", data.users);
      throw new Error("Current user not found");
    }

    const userData: UserInfo = {
      id: currentUser.id || 'unknown',
      username: currentUser.nickname || currentUser.name || "Unknown",
      avatar: currentUser.image ? `data:image/jpeg;base64,${Buffer.from(currentUser.image).toString('base64')}` : "/prof_img/avatar1.png",
      email: currentUser.email || "",
      name: currentUser.name || "",
      password: "",
      wins: 0,
      losses: 0,
      online: !!currentUser.online,
      history: [],
    };

    // Оставляем friends и players пустыми
    const friendsData: UserInfo[] = [];
    const playersData: UserInfo[] = [];

    return { userData, friendsData, playersData };
  };

  const saveUserData = async (updatedUser: UserInfo) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        throw new Error("No token found, please log in.");
      }

      await fetch("http://localhost:3000/updateProfile", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedUser.id,
          name: updatedUser.name,
          nickname: updatedUser.username,
          password: updatedUser.password || undefined,
        }),
      });

      if (updatedUser.avatar && updatedUser.avatar.startsWith("data:image")) {
        const base64Data = updatedUser.avatar.split(',')[1];
        const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
        const formData = new FormData();
        formData.append("id", updatedUser.id);
        formData.append("file", blob, "avatar.jpg");

        await fetch("http://localhost:3000/uploadPicture", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
      }

      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Couldn’t save the data. Please try again.");
      toast.error("Couldn’t save the data. Please try again.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { userData, friendsData, playersData } = await fetchDataFromServer();
        setUser(userData);
        setFriends(friendsData);
        setPlayers(playersData);
      } catch (err: any) {
        console.error("Detailed error:", err.message, err.stack);
        setError(`Couldn’t load data from the server: ${err.message}`);
        toast.error(`Couldn’t load data: ${err.message}`);
        if (err.message.includes("No token found") || err.message.includes("Current user not found")) {
          localStorage.removeItem("token");
          navigate("/signup");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleSaveProfile = async (data: {
    avatar: string;
    username: string;
    password: string;
  }) => {
    if (!user) return;

    const updatedUser: UserInfo = {
      ...user,
      avatar: data.avatar,
      username: data.username,
      password: data.password || user.password,
    };
    await saveUserData(updatedUser);
    setIsModalOpen(false);
  };

  const handleGameEnd = async (result: "win" | "loss") => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());

    const updatedUser: UserInfo = {
      ...user,
      history: [...user.history, { date: today, weekday, result }],
      wins: result === "win" ? user.wins + 1 : user.wins,
      losses: result === "loss" ? user.losses + 1 : user.losses,
    };

    setUser(updatedUser);
  };

  const handlePlayClick = () => {
    if (!user) {
      toast.error("User data not loaded!");
      return;
    }

    if (!selectedBot) {
      toast.error("Please select a bot to play with first!");
      return;
    }

    const result = Math.random() > 0.5 ? "win" : "loss";
    handleGameEnd(result);
    toast.success(`Game over! You ${result === "win" ? "won" : "lost"} against ${selectedBot.name}!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-white">
        Loading data, please wait...
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
        Couldn’t find user data.
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full text-white flex flex-col overflow-y-auto justify-between">
        <div className="flex justify-between items-center px-6 py-4">
          <div
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-indigo-300 to-green-300 text-2xl sm:text-3xl font-bold transition-transform duration-300 ease-in-out hover:scale-110"
            style={{ textShadow: `0 0 20px rgba(255, 255, 255, 0.3), 0 0 32px rgba(255, 0, 255, 0.3)` }}
          >
            NEON PONG
          </div>
          <ProfileActions
            user={{ username: user.username, online: user.online}}
            onProfileClick={() => setIsModalOpen(true)}
          />
        </div>

        <div className="hidden xl:grid xl:grid-cols-6 gap-4 px-4 flex-grow">
          <div className="pt-4 flex flex-col items-start col-span-1 max-w-[220px]">
            <h2 className="text-lg font-semibold mb-2 text-left drop-shadow-[0_0_8px_red]">Friends</h2>
            <EnhancedFriendsList friends={friends} />
          </div>
          <div className="pt-6 col-span-1 mx-auto">
            <div className="w-full max-w-[750px] bg-gray-800 bg-opacity-40 rounded-lg p-1 shadow-lg ml-14 mt-32">
              <video src="/videos/fight_gif.mp4" autoPlay loop muted playsInline className="w-full h-auto rounded-lg" />
            </div>
          </div>
          <div className="pt-8 flex flex-col items-center justify-start gap-6 col-span-2">
            <UserHeader
              user={{ username: user.username, avatar: user.avatar, wins: user.wins, losses: user.losses, history: user.history }}
            />
            <PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>
            <PlayArena
              user={{ username: user.username, avatar: user.avatar }}
              opponentImage={selectedBot ? selectedBot.image : null}
              opponentName={selectedBot ? selectedBot.name : undefined}
            />
          </div>
          <div className="pt-8 flex justify-center col-span-1">
            <div className="flex flex-col items-center justify-start pt-5 px-2 xl:px-5 w-full max-w-[320px] xl:max-w-full">
              <GameModeSelector />
            </div>
          </div>
          <div className="pt-4 flex flex-col items-end col-span-1 max-w-[220px] ml-auto">
            <h2 className="text-lg font-semibold mb-2 text-right drop-shadow-[0_0_8px_red]">Players</h2>
            <PlayersList players={players} />
          </div>
        </div>

        <div className="flex xl:hidden flex-col items-center px-4 gap-4">
          <UserHeader
            user={{ username: user.username, avatar: user.avatar, wins: user.wins, losses: user.losses, history: user.history }}
          />
          <PrimaryButton onClick={handlePlayClick}>PLAY</PrimaryButton>
          <PlayArena
            user={{ username: user.username, avatar: user.avatar }}
            opponentImage={selectedBot ? selectedBot.image : null}
            opponentName={selectedBot ? selectedBot.name : undefined}
          />
          <div className="w-full max-w-xs mt-4">
            <GameModeSelector />
          </div>
          <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="w-full sm:w-1/2 min-w-0">
              <h2 className="text-lg font-semibold mb-2 text-left drop-shadow-[0_0_8px_red]">Friends</h2>
              <EnhancedFriendsList friends={friends} />
            </div>
            <div className="w-full sm:w-1/2 min-w-0 flex flex-col items-end">
              <h2 className="text-lg font-semibold mb-2 text-right drop-shadow-[0_0_8px_red]">Players</h2>
              <PlayersList players={players} />
            </div>
          </div>
          <div className="w-full mt-8">
            <div className="w-full max-w-[600px] bg-gray-800 bg-opacity-50 rounded-2xl p-4 shadow-lg mx-auto">
              <video src="/videos/fight_gif.mp4" autoPlay loop muted playsInline className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 bg-opacity-70 w-full flex flex-col text-center pt-2 px-4 pb-5 mt-4">
          <p className="text-lg text-purple-400 font-extrabold uppercase tracking-wide drop-shadow-[0_0_8px_white]">
            Fighters — choose your rival!
          </p>
          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full px-2 sm:px-4">
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
          userData={{ avatar: user.avatar, username: user.username, name: user.name }}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
};

export default Profile;