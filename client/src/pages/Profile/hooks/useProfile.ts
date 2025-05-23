import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "../types/UserInfo";
import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

// Custom hook to manage profile-related state and interactions
export const useProfile = () => {
  // Initialize state for user profile, bot selection, and UI controls
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);

  // Memoize authentication headers for API requests
  const authHeaders = useMemo(() => getAuthHeaders(), []);

  // Validate Base64 strings for avatar processing
  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  // Fetch and process all users, converting server data to UserInfo format
  const fetchAllUsers = useCallback(async () => {
    try {
      console.log("Fetching all users...");
      const response = await fetch(`https://localhost:3000/users?t=${Date.now()}`, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
      });
      const data = await response.json();
      console.log("Fetched users data:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      const mappedUsers: UserInfo[] = (data.users || []).map((u: any) => {
        let avatar = "/prof_img/avatar1.png"; // default avatar

        if (u.image) {
          if (typeof u.image === "string" && isValidBase64(u.image)) {
            avatar = `data:image/jpeg;base64,${u.image}`;
          } else if (
            typeof u.image === "object" &&
            Array.isArray((u.image as any).data)
          ) {
            const byteArray: number[] = (u.image as any).data;
            let binary = "";
            byteArray.forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
            const base64String = btoa(binary);
            avatar = `data:image/jpeg;base64,${base64String}`;
          } else {
            console.warn(
              `Invalid avatar data for user ${u.username || u.id}:`,
              u.image
            );
          }
        }

        const userInfo: UserInfo = {
          id: (u.id || "").toString(),
          username: u.username || u.name || "Unknown",
          avatar,
          email: u.email || "",
          name: u.name || "",
          password: "",
          wins: u.wins || 0,
          losses: u.losses || 0,
          online: !!u.online,
          history: [],
        };
        console.log(`Mapped user ${userInfo.username} avatar:`, userInfo.avatar);
        return userInfo;
      });

      const sortedUsers = mappedUsers.sort((a, b) =>
        a.online === b.online ? 0 : a.online ? -1 : 1
      );

      console.log("Sorted players (online first):", sortedUsers);
      setPlayers(sortedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load players list.");
    }
  }, [authHeaders]);

  // Load user data and players list with authentication checks
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
      const [userData] = await Promise.all([
        fetchUserData(authHeaders),
        fetchAllUsers(),
      ]);
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
  }, [navigate, authHeaders, fetchAllUsers]);

  // Update user profile data and refresh related state
  const saveUserData = useCallback(
    async (updatedUser: UserInfo) => {
      const profileUpdates: Partial<UserInfo> = {};
      if (updatedUser.name !== user?.name) profileUpdates.name = updatedUser.name;
      if (updatedUser.username !== user?.username)
        profileUpdates.username = updatedUser.username;
      if (updatedUser.password !== user?.password)
        profileUpdates.password = updatedUser.password;

      await updateUserProfile(
        profileUpdates,
        updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
        authHeaders
      );
      const updatedUserData = await fetchUserData(authHeaders);
      setUser(updatedUserData);
      console.log("Reloading all users after avatar update...");
      await fetchAllUsers(); // Reload players list after updating avatar
    },
    [user, authHeaders, fetchAllUsers]
  );

  // Handle profile updates and close the edit modal
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

  // Process game results and update user stats
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

  // Simulate a game with a random bot and outcome
  const handlePlay = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";

    handleGameEnd(result, opponent.name);

    if (!selectedBot) {
      setSelectedBot(null);
    }
  }, [selectedBot, handleGameEnd]);

  // Initialize data fetching on component mount
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

  // Expose state and handlers for use in components
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