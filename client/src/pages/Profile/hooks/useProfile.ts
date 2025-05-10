
// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "../types/UserInfo";
// import { fetchUserData, updateUserProfile, getAuthHeaders } from "../types/api";
// import { bots } from "../types/botsData";

// export const useProfile = () => {
// 	const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [user, setUser] = useState<UserInfo | null>(null);
// 	const [friends, setFriends] = useState<UserInfo[]>([]);
// 	const [players, setPlayers] = useState<UserInfo[]>([]);
// 	const navigate = useNavigate();
// 	const isFetchingRef = useRef(false); // Флаг для предотвращения дублирования

// 	const authHeaders = useMemo(() => getAuthHeaders(), []);

// 	const loadData = useCallback(async () => {
// 		if (isFetchingRef.current) {
// 			return;
// 		}
// 		isFetchingRef.current = true;

// 		const token = localStorage.getItem("token");
// 		if (!token) {
// 			setIsLoading(false);
// 			toast.error("No token found. Please log in.");
// 			navigate("/login");
// 			isFetchingRef.current = false;
// 			return;
// 		}

// 		setIsLoading(true);
// 		try {
// 			const userData = await fetchUserData(authHeaders);
// 			setUser(userData);
// 			// Временно откл. запрос /friends_list, чтобы избежать 404
// 			setFriends([]); // Заглушка для друзей
// 		} catch (err: any) {
// 			toast.error("Failed to load user data. Please log in again.");
// 			localStorage.removeItem("token");
// 			navigate("/login");
// 		} finally {
// 			setIsLoading(false);
// 			isFetchingRef.current = false;
// 		}
// 	}, [navigate, authHeaders]);

// 	const saveUserData = useCallback(
// 		async (updatedUser: UserInfo) => {
// 			const profileUpdates: Partial<UserInfo> = {};
// 			if (updatedUser.name !== user?.name)
// 				profileUpdates.name = updatedUser.name;
// 			if (updatedUser.username !== user?.username)
// 				profileUpdates.username = updatedUser.username;
// 			if (updatedUser.password !== user?.password)
// 				profileUpdates.password = updatedUser.password;

// 			await updateUserProfile(
// 				profileUpdates,
// 				updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
// 				authHeaders
// 			);
// 			const updatedUserData = await fetchUserData(authHeaders);
// 			setUser(updatedUserData);
// 			toast.success("Profile updated successfully!");
// 		},
// 		[user, authHeaders]
// 	);

// 	const handleSaveProfile = useCallback(
// 		async (data: Partial<UserInfo>) => {
// 			if (!user) return;
// 			const updatedUser: UserInfo = {
// 				...user,
// 				...data,
// 				password: data.password || user.password,
// 			};
// 			await saveUserData(updatedUser);
// 			setIsModalOpen(false);
// 		},
// 		[user, saveUserData]
// 	);

// 	const handleGameEnd = useCallback(
// 		async (result: "win" | "loss") => {
// 			if (!user) return;
// 			const today = new Date().toISOString().split("T")[0];
// 			const weekday = new Intl.DateTimeFormat("en-US", {
// 				weekday: "short",
// 			}).format(new Date());
// 			const updatedUser: UserInfo = {
// 				...user,
// 				history: [...user.history, { date: today, weekday, result }],
// 				wins: result === "win" ? user.wins + 1 : user.wins,
// 				losses: result === "loss" ? user.losses + 1 : user.losses,
// 			};
// 			setUser(updatedUser);
// 		},
// 		[user]
// 	);


// 	useEffect(() => {
// 		let isMounted = true;

// 		const fetchData = async () => {
// 			if (isMounted) {
// 				await loadData();
// 			}
// 		};

// 		fetchData();

// 		return () => {
// 			isMounted = false;
// 		};
// 	}, [loadData]);

// 	return {
// 		user,
// 		friends,
// 		players,
// 		selectedBot,
// 		isModalOpen,
// 		isLoading,
// 		setSelectedBot,
// 		setIsModalOpen,
// 		setFriends,
// 		setPlayers,
// 		handleSaveProfile,
// 	};
// };

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "../types/UserInfo";
import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

export const useProfile = () => {
  /* Initialize state and hooks: Set up user data, bot selection, modal state, and navigation */
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);

  /* Cache authentication headers: Memoize headers for API requests to avoid recalculation */
  const authHeaders = useMemo(() => getAuthHeaders(), []);

  /* Load user data: Fetch user profile and handle authentication errors */
  const loadData = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      toast.error("No token found. Please log in.");
      navigate("/login");
      isFetchingRef.current = false;
      return;
    }

    setIsLoading(true);
    try {
      const userData = await fetchUserData(authHeaders);
      setUser(userData);
      setFriends([]); // Placeholder for friends (not implemented)
    } catch (err: any) {
      toast.error("Failed to load user data. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [navigate, authHeaders]);

  /* Save user profile: Update user data on the server and refresh local state */
  const saveUserData = useCallback(
    async (updatedUser: UserInfo) => {
      const profileUpdates: Partial<UserInfo> = {};
      if (updatedUser.name !== user?.name) profileUpdates.name = updatedUser.name;
      if (updatedUser.username !== user?.username) profileUpdates.username = updatedUser.username;
      if (updatedUser.password !== user?.password) profileUpdates.password = updatedUser.password;

      await updateUserProfile(
        profileUpdates,
        updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
        authHeaders
      );
      const updatedUserData = await fetchUserData(authHeaders);
      setUser(updatedUserData);
      toast.success("Profile updated successfully!");
    },
    [user, authHeaders]
  );

  /* Handle profile save: Merge updated data with existing user and save */
  const handleSaveProfile = useCallback(
    async (data: Partial<UserInfo>) => {
      if (!user) return;
      const updatedUser: UserInfo = {
        ...user,
        ...data,
        password: data.password || user.password,
      };
      await saveUserData(updatedUser);
      setIsModalOpen(false);
    },
    [user, saveUserData]
  );

  /* Handle game end: Save game result, update user data, and show result notification */
  const handleGameEnd = useCallback(
    async (result: "win" | "loss", opponent: string) => {
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(new Date());

      const matchResult: MatchResult = { date: today, weekday, result };

      try {
        await saveGameResult(matchResult, authHeaders);
        const updatedUserData = await fetchUserData(authHeaders);
        setUser(updatedUserData);
        toast.success(`Game over! You ${result} against ${opponent}!`);
      } catch (err: any) {
        toast.error("Failed to save game result. Please try again.");
      }
    },
    [user, authHeaders]
  );

  /* Handle game play: Simulate a game with a random or selected bot and process result */
  const handlePlay = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";

    handleGameEnd(result, opponent.name);

    if (!selectedBot) {
      setSelectedBot(null);
    }
  }, [selectedBot, handleGameEnd]);

  /* Fetch initial data: Load user data on component mount and clean up on unmount */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadData();
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  /* Return hook API: Expose state and functions for use in components */
  return {
    user,
    friends,
    players,
    selectedBot,
    isModalOpen,
    isLoading,
    setSelectedBot,
    setIsModalOpen,
    setFriends,
    setPlayers,
    handleSaveProfile,
    handlePlay,
  };
};