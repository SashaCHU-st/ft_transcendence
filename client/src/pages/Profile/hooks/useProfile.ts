// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "../types/UserInfo";
// import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
// import { bots } from "../types/botsData";

// export const useProfile = () => {
//   /* Initialize state and hooks: Set up user data, bot selection, modal state, and navigation */
//   const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [friends, setFriends] = useState<UserInfo[]>([]);
//   const [players, setPlayers] = useState<UserInfo[]>([]);
//   const navigate = useNavigate();
//   const isFetchingRef = useRef(false);

//   /* Cache authentication headers: Memoize headers for API requests to avoid recalculation */
//   const authHeaders = useMemo(() => getAuthHeaders(), []);

//   /* Fetch all users: Load all registered users from the database */
//   const fetchAllUsers = useCallback(async () => {
//     try {
//       const response = await fetch("http://localhost:3000/users", {
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeaders,
//         },
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch users");
//       }

//       const mappedUsers: UserInfo[] = data.users.map((u: any) => ({
//         id: u.id.toString(),
//         username: u.username || u.name || "Unknown",
//         avatar: u.image ? `data:image/jpeg;base64,${u.image}` : "/prof_img/avatar1.png",
//         email: u.email || "",
//         name: u.name || "",
//         password: "",
//         wins: u.wins || 0,
//         losses: u.losses || 0,
//         online: !!u.online,
//         history: [],
//       }));

//       setPlayers(mappedUsers);
//     } catch (err: any) {
//       console.error("Failed to fetch users:", err);
//       toast.error("Failed to load players list.");
//     }
//   }, [authHeaders]);

//   /* Load user data: Fetch user profile, all users, and handle authentication errors */
//   const loadData = useCallback(async () => {
//     if (isFetchingRef.current) {
//       return;
//     }
//     isFetchingRef.current = true;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsLoading(false);
//       toast.error("No token found. Please log in.");
//       navigate("/login");
//       isFetchingRef.current = false;
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const [userData] = await Promise.all([
//         fetchUserData(authHeaders),
//         fetchAllUsers(),
//       ]);
//       setUser(userData);
//       setFriends([]); // Placeholder for friends (not implemented)
//     } catch (err: any) {
//       toast.error("Failed to load user data. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [navigate, authHeaders, fetchAllUsers]);

//   /* Save user profile: Update user data on the server and refresh local state */
//   const saveUserData = useCallback(
//     async (updatedUser: UserInfo) => {
//       const profileUpdates: Partial<UserInfo> = {};
//       if (updatedUser.name !== user?.name) profileUpdates.name = updatedUser.name;
//       if (updatedUser.username !== user?.username) profileUpdates.username = updatedUser.username;
//       if (updatedUser.password !== user?.password) profileUpdates.password = updatedUser.password;

//       await updateUserProfile(
//         profileUpdates,
//         updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
//         authHeaders
//       );
//       const updatedUserData = await fetchUserData(authHeaders);
//       setUser(updatedUserData);
//       toast.success("Profile updated successfully!");
//     },
//     [user, authHeaders]
//   );

//   /* Handle profile save: Merge updated data with existing user and save */
//   const handleSaveProfile = useCallback(
//     async (data: Partial<UserInfo>) => {
//       if (!user) return;
//       const updatedUser: UserInfo = {
//         ...user,
//         ...data,
//         password: data.password || user.password,
//       };
//       await saveUserData(updatedUser);
//       setIsModalOpen(false);
//     },
//     [user, saveUserData]
//   );

//   /* Handle game end: Save game result, update user data, and show result notification */
//   const handleGameEnd = useCallback(
//     async (result: "win" | "loss", opponent: string) => {
//       if (!user) return;

//       const today = new Date().toISOString().split("T")[0];
//       const weekday = new Intl.DateTimeFormat("en-US", {
//         weekday: "short",
//       }).format(new Date());

//       const matchResult: MatchResult = { date: today, weekday, result };

//       try {
//         await saveGameResult(matchResult, authHeaders);
//         const updatedUserData = await fetchUserData(authHeaders);
//         setUser(updatedUserData);
//         toast.success(`Game over! You ${result} against ${opponent}!`);
//       } catch (err: any) {
//         toast.error("Failed to save game result. Please try again.");
//       }
//     },
//     [user, authHeaders]
//   );

//   /* Handle game play: Simulate a game with a random or selected bot and process result */
//   const handlePlay = useCallback(() => {
//     const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
//     const result = Math.random() > 0.5 ? "win" : "loss";

//     handleGameEnd(result, opponent.name);

//     if (!selectedBot) {
//       setSelectedBot(null);
//     }
//   }, [selectedBot, handleGameEnd]);

//   /* Fetch initial data: Load user data and all users on component mount and clean up on unmount */
//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isMounted) {
//         await loadData();
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [loadData]);

//   /* Return hook API: Expose state and functions for use in components */
//   return {
//     user,
//     friends,
//     players,
//     selectedBot,
//     isModalOpen,
//     isLoading,
//     setSelectedBot,
//     setIsModalOpen,
//     setFriends,
//     setPlayers,
//     handleSaveProfile,
//     handlePlay,
//   };
// };


// // 07.05



import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "../types/UserInfo";
import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

export const useProfile = () => {
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);

  const authHeaders = useMemo(() => getAuthHeaders(), []);

  const fetchAllUsers = useCallback(async () => {
    try {
      console.log("Fetching all users...");
      const response = await fetch(`http://localhost:3000/users?t=${Date.now()}`, {
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

      const mappedUsers: UserInfo[] = data.users.map((u: any) => {
        // Проверяем, является ли u.image объектом или строкой
        const imageBase64 = typeof u.image === "object" && u.image?.data ? u.image.data : u.image;
        return {
          id: u.id.toString(),
          username: u.username || u.name || "Unknown",
          avatar: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : "/prof_img/avatar1.png",
          email: u.email || "",
          name: u.name || "",
          password: "",
          wins: u.wins || 0,
          losses: u.losses || 0,
          online: !!u.online,
          history: [],
        };
      });

      console.log("Mapped players:", mappedUsers);
      setPlayers(mappedUsers);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load players list.");
    }
  }, [authHeaders]);

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
      console.log("Reloading all users after avatar update...");
      await fetchAllUsers(); // Reload players list after updating avatar
    },
    [user, authHeaders, fetchAllUsers]
  );

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

  const handlePlay = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";

    handleGameEnd(result, opponent.name);

    if (!selectedBot) {
      setSelectedBot(null);
    }
  }, [selectedBot, handleGameEnd]);

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