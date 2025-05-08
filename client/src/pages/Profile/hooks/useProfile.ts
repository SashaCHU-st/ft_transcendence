// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "../types/UserInfo";
// import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
// import { bots } from "../types/botsData";

// export const useProfile = () => {
//   const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [friends, setFriends] = useState<UserInfo[]>([]);
//   const [players, setPlayers] = useState<UserInfo[]>([]);
//   const navigate = useNavigate();
//   const isFetchingRef = useRef(false);

//   const authHeaders = useMemo(() => getAuthHeaders(), []);

//   const fetchAllUsers = useCallback(async () => {
//     try {
//       console.log("Fetching all users...");
//       const response = await fetch(`http://localhost:3000/users?t=${Date.now()}`, {
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeaders,
//         },
//       });
//       const data = await response.json();
//       console.log("Fetched users data:", data);
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch users");
//       }

//       const mappedUsers: UserInfo[] = data.users.map((u: any) => {
//         let avatarSrc = "/prof_img/avatar1.png";
//         if (u.image && u.image_type) {
//           avatarSrc = `data:${u.image_type};base64,${u.image}`;
//         }
//         return {
//           id: u.id.toString(),
//           username: u.username || u.name || "Unknown",
//           avatar: avatarSrc,
//           email: u.email || "",
//           name: u.name || "",
//           password: "",
//           wins: u.wins || 0,
//           losses: u.losses || 0,
//           online: !!u.online,
//           history: [],
//         };
//       });

//       console.log("Mapped players:", mappedUsers);
//       setPlayers(mappedUsers);
//     } catch (err: any) {
//       console.error("Failed to fetch users:", err);
//       toast.error("Failed to load players list.");
//     }
//   }, [authHeaders]);

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
//       const userData = await fetchUserData(authHeaders);
//       setUser(userData);
//       await fetchAllUsers(); 
//       setFriends([]);
//     } catch (err: any) {
//       toast.error("Failed to load user data. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [navigate, authHeaders, fetchAllUsers]);

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
//       console.log("Reloading all users after avatar update...");
//       await fetchAllUsers();
//     },
//     [user, authHeaders, fetchAllUsers]
//   );

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

//   const handlePlay = useCallback(() => {
//     const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
//     const result = Math.random() > 0.5 ? "win" : "loss";

//     handleGameEnd(result, opponent.name);

//     if (!selectedBot) {
//       setSelectedBot(null);
//     }
//   }, [selectedBot, handleGameEnd]);

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


import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "../types/UserInfo";
import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
import { bots } from "../types/botsData";

// Custom hook for managing user profile and game-related state
export const useProfile = () => {
  // State for selected bot, modal visibility, loading status, user data, friends, and players
  const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [players, setPlayers] = useState<UserInfo[]>([]);
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);

  // Memoize auth headers to avoid recalculating on every render
  const authHeaders = useMemo(() => getAuthHeaders(), []);

  // Fetch all users from the server
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

      // Map fetched users to the UserInfo type
      const mappedUsers: UserInfo[] = data.users.map((u: any) => {
        let avatarSrc = "/prof_img/avatar1.png";
        if (u.image && u.image_type) {
          avatarSrc = `data:${u.image_type};base64,${u.image}`;
        }
        return {
          id: u.id.toString(),
          username: u.username || u.name || "Unknown",
          avatar: avatarSrc,
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

  // Load user data and related information
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
      await fetchAllUsers(); 
      setFriends([]);
    } catch (err: any) {
      toast.error("Failed to load user data. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [navigate, authHeaders, fetchAllUsers]);

  // Save updated user data to the server
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
      await fetchAllUsers();
    },
    [user, authHeaders, fetchAllUsers]
  );

  // Handle profile save action
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

  // Handle the end of a game and save the result
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

  // Handle the play action against a bot
  const handlePlay = useCallback(() => {
    const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
    const result = Math.random() > 0.5 ? "win" : "loss";

    handleGameEnd(result, opponent.name);

    if (!selectedBot) {
      setSelectedBot(null);
    }
  }, [selectedBot, handleGameEnd]);

  // Fetch data on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await loadData();
      }
    };

    fetchData();

    // Cleanup to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  // Return the state and functions for use in components
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