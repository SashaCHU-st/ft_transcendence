import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAuthHeaders} from "../types/api";
import { useUserData } from "./useUserData";
import { useNotifications } from "./useNotification";
import { useFriends } from "./useFriends";
import { useProfileModal } from "./useProfileModal";
import { useGame } from "./useGame";

export const useProfile = () => {
  const { user,
      friends,
      players, 
      chatList, 
      fetchAllUsers,
      setFriends, 
      setPlayers, 
      setChatList, 
      setUser,
      fetchFriendRequests,
      friendRequests,
      declinedFriendRequest,
      setDeclinedFriendRequest,
      setFriendRequests,
      
    } = useUserData();

  const userId = user?.id || null;
  const authHeaders = getAuthHeaders();
 

  // Notifications
  const {
    notifications,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    //checkNotifications,
    handleAcceptChallenge,
    handleDeclineChallenge,
    redirectToGame,
    setRedirectToGame,
    declinedChallenge,
    setDeclinedChallenge

  } = useNotifications(userId);


  //Friends
  const { handleAdd, handleRemove, handleConfirm, handleDecline } = useFriends(
  fetchAllUsers,
  fetchFriendRequests,
  friends,
  setFriends,
  setPlayers,
   setFriendRequests,
  // setDeclinedFriendRequest,

);

  // Profile modal
  const { isModalOpen, setIsModalOpen, handleSaveProfile } = useProfileModal(user, fetchAllUsers, authHeaders);

  // Game logic
  const navigate = useNavigate();
  const { selectedBot, setSelectedBot, handlePlay } = useGame(user, fetchAllUsers, authHeaders);

  useEffect(() => {
    fetchAllUsers();
    fetchFriendRequests();

    const interval = setInterval(() => {
    fetchFriendRequests();
    fetchAllUsers();
   
   }, 5000);
     return () => clearInterval(interval);

  }, [fetchAllUsers, fetchFriendRequests]);


//   useEffect(() => {
//   const init = async () => {
//     await fetchAllUsers();
//     await fetchFriendRequests();
//   };

//   init();

//   const interval = setInterval(() => {
//     fetchFriendRequests();
//     fetchAllUsers();
//   }, 10000);

//   return () => clearInterval(interval);
// }, [fetchAllUsers, fetchFriendRequests]);


  useEffect(() => {
    if (!redirectToGame || !userId) 
      return;

      setRedirectToGame(null);
  }, [redirectToGame, userId]);


  return {
    user,
    friends,
    players,
    chatList,
    
    notifications,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAdd,
    handleRemove,
    handleConfirm,
    handleDecline,
    isModalOpen,
    setIsModalOpen,
    handleSaveProfile,
    selectedBot,
      setChatList,
    setSelectedBot,
    handlePlay,
    navigate,
    setUser,
    declinedChallenge,
    setDeclinedChallenge,
    friendRequests,
    declinedFriendRequest,
    setDeclinedFriendRequest,
    //dismissDeclinedFriendRequest
  };
};



// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "../types/UserInfo";
// import { updateUserProfile, getAuthHeaders, saveGameResult} from "../types/api";
// import { bots } from "../types/botsData";
// import { deleteFromFavorites } from "../DeleteFavorites";
// import { addToFavorites } from "../AddFavorites";
// import api from "../types/api";
// //import { ColorSplitterBlock } from "@babylonjs/core";


// export const useProfile = () => {
//   const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [friends, setFriends] = useState<UserInfo[]>([]);
//   const [players, setPlayers] = useState<UserInfo[]>([]);
//   const navigate = useNavigate();
//   const isFetchingRef = useRef(false);
//   const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
//   const [notifications, setNotifications] = useState<{ user_id: string; username: string }[]>([]);

//   const authHeaders = useMemo(() => getAuthHeaders(), []);

//   const isValidBase64 = (str: string) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch {
//       return false;
//     }
//   };
 
//   const checkNotifications = useCallback(async () => {
//     const currentUserId = localStorage.getItem("id");
//     if (!currentUserId) return;

//     try {
//       const res = await api.post("/notification", { user_id: currentUserId });
//       const data = res.data;

//       console.log("Check data.notif: ", data.notification);
//       console.log("THEY ACCEPPTED ", data.acceptedUsers);
//       console.log("THEY DID NOT ACCPTED", data.notAcceptedUsers);

//       /// DEBUG 
//       // console.log("Friends id =>>>> ", data.acceptedUsers[0].friends_id);
//       // console.log("Friends id =>>>> ", data.acceptedUsers[1].friends_id);
//       // console.log("kuku2 ", data.acceptedSeen);
      
//       ////DEBUGGGGG
//       //console.log("Username", data.usernames)
//       // console.log("Username 1 ", data.usernames[0].username);
//       // console.log("Username 2", data.usernames[1].username);
//       //console.log("USERNAME THAT DID  NT ACCEPT", data.usernamesNotAccepted[0].username);

//       // console.log("username 2", data.accptedFromPartner[1].username);
//       // console.log("kuku2 ", data.alreadySeenAccept[0].friends_id);
     
//       if (data.notification && Array.isArray(data.notification)) {
//         // Extract unique new notifications by friends_id
//         const newNotifications = data.notification.filter((notif: any) => {
//           return !notifications.some(n => n.user_id === notif.user_id);
//         }).map((notif: any) => ({
//           user_id: notif.user_id,
//           username: notif.username
//         }));
//         console.log("checkNotification");
//         if (newNotifications.length > 0) {
//           setNotifications(prev => [...prev, ...newNotifications]);
//           setIsNotificationModalOpen(true);
//         }
//       }
//     } catch (err) {
//       console.error("Notification check failed:", err);
//     }
//   }, [ notifications, setNotifications, setIsNotificationModalOpen]);

//   const fetchAllUsers = useCallback(async () => {
//     try {
//       const currentUserId = localStorage.getItem("id");
//       if (!currentUserId) return;

//       // const res = await fetch(`https://localhost:3000/users?t=${Date.now()}`, {
//       //   headers: { "Content-Type": "application/json", ...authHeaders },
//       // });
//       // const data = await res.json();
//       // if (!res.ok) throw new Error(data.message || "Failed to fetch users");
//       const { data } = await api.get(`/users?t=${Date.now()}`, {
//       headers: authHeaders,
//     });
       
//       let currentUser: UserInfo | null = null;
//       console.log("Fetch users");

//       const mappedUsers: UserInfo[] = data.users.map((u: any) => {
//         let avatar = "/prof_img/avatar1.png";
//         if (u.image) {
//           if (typeof u.image === "string" && isValidBase64(u.image)) {
//             avatar = `data:image/jpeg;base64,${u.image}`;
//           } else if (u.image?.data) {
//             const binary = String.fromCharCode(...u.image.data);
//             avatar = `data:image/jpeg;base64,${btoa(binary)}`;
//           }
//         }
//         console.log("After mappedUsers");
//         const userInfo: UserInfo = {
//           id: String(u.id),
//           username: u.username || "Unknown",
//           avatar,
//           email: u.email || "",
//           name: u.name || "",
//           password: "",
//           wins: u.wins || 0,
//           losses: u.losses || 0,
//           online: !!u.online,
//           history: [],
//         };

//         if (userInfo.id === currentUserId) 
//           currentUser = userInfo;

//         return userInfo;
//       });

//       // Fetch favorites
//       // const favRes = await fetch(`https://localhost:3000/favorites?user_id=${currentUserId}`, {
//       //   headers: { "Content-Type": "application/json" },
//       // });
//       // const favData = await favRes.json();
//       // if (!favRes.ok) 
//       //   throw new Error(favData.message || "Failed to fetch favorites");
//       const favRes = await api.get(`/favorites?user_id=${currentUserId}`);
//       console.log("Fetch favorities");
//       //const favoriteUsernames: string[] = favData.favoritesUser.map((f: any) => f.username);
//       const favoriteUsernames: string[] = favRes.data.favoritesUser.map(
//       (f: any) => f.username
//     );
//       const favoriteUsers: UserInfo[] = mappedUsers.filter(u => favoriteUsernames.includes(u.username));

//       const playersList = mappedUsers
//         .filter(u => u.id !== currentUserId)
//         .filter(u => !favoriteUsernames.includes(u.username))
//         .sort((a, b) => a.online === b.online ? 0 : a.online ? -1 : 1);
      
//       setUser(currentUser);
//       console.log("bbbbbbbbb");
//       setPlayers(playersList);
//       setFriends(favoriteUsers);
//     } catch (err: any) {
//       console.error("Error fetching users:", err);
//       toast.error(err.message || "Failed to load users.");
//     }
//   }, [authHeaders]);

//   const loadData = useCallback(async () => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;
//     console.log("LoadData function");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("No token found. Please log in.");
//       navigate("/login");
//       isFetchingRef.current = false;
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await fetchAllUsers();
//       console.log("I am in loading before check notification");
//       await checkNotifications();
//     } catch (err) {
//       toast.error("Error loading data. Please log in again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [fetchAllUsers, navigate, checkNotifications]);

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
//       console.log("UpdatedUserProfile");

//       await fetchAllUsers(); // Reload everything
//     },
//     [user, authHeaders, fetchAllUsers]
//   );

//     const handleAcceptChallenge = async (userId: string) => {
//       try {
//         await api.post("/acceptRequest", {
//         user_id: user?.id,
//         friends_id: userId,
//       });
//         toast.success("Challenge accepted!");
//         console.log("handleAccepChallenge");
//       } catch (err:any) {
//         //toast.error(err.message || "Failed to accept challenge.");
//         console.error(err);
//         throw err;
//       } finally {
//         // setIsNotificationModalOpen(false);
//         // setNotification(null);

//         setNotifications((prev) => prev.filter((n) => n.user_id !== userId));
//         if (notifications.length <= 1) setIsNotificationModalOpen(false);
//         }
//     };

//     const handleDeclineChallenge = async (userId: string) => {
//       try {
//          await api.post("/declineRequest", { 
//           user_id: user?.id,
//           friends_id: userId,
        
//       });

//         toast.success("Challenge declined.");
//       } catch (err:any) {
//         //toast.error(err.message || "Failed to decline challenge.");
//         console.error(err);
//         throw err;
//       } finally {
//         setNotifications((prev) => prev.filter((n) => n.user_id !== userId));
//         if (notifications.length <= 1) setIsNotificationModalOpen(false);
//       }
//     };


//   const handleAdd = async (username: string) => {
//       try {
//         await addToFavorites(username);
//         console.log(`Added ${username} to favorites`);
//         toast.success(`${username} added to favorites`);
//         await fetchAllUsers();
//       } catch (err:any) {
//         console.error("Failed to add favorite:", err);
//         //toast.error(err.message);
//         throw err;
//       }
//   };

//    const handleRemove = async (username: string) => {
//       try{
//         await deleteFromFavorites(username);
//         setFriends(prev => prev.filter(f => f.username !== username));
//         setPlayers(prev => [...prev, friends.find(f => f.username === username)!]);

//         toast.success(`${username} removed from favorites`);
//         console.log(`Remove ${username}`);
//         await fetchAllUsers();
//       }catch (err:any) {
//         console.error("Failed to delete from favorite:", err);
//         //toast.error(err.message || "Failed to remove from favorites");
//         throw err;
//       }
//   }

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
//       const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date());
//       const matchResult: MatchResult = { date: today, weekday, result };

//       try {
//         await saveGameResult(matchResult, authHeaders);
//         await fetchAllUsers(); // Update after game result
//         toast.success(`Game over! You ${result} against ${opponent}!`);
//       } catch {
//         toast.error("Failed to save game result. Please try again.");
//       }
//     },
//     [user, authHeaders, fetchAllUsers]
//   );

//   const handlePlay = useCallback(() => {
//     const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
//     const result = Math.random() > 0.5 ? "win" : "loss";

//     handleGameEnd(result, opponent.name);
//     if (!selectedBot) setSelectedBot(null);
//     navigate("/pong?mode=ai");
//   }, [selectedBot, handleGameEnd]);

//   useEffect(() => {
//     let isMounted = true;
//     if (isMounted) loadData();
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
//     handleRemove,
//     notifications,
//     isNotificationModalOpen,
//     handleAcceptChallenge,
//     handleDeclineChallenge,
//     setIsNotificationModalOpen,
//     handleAdd,
//   };
// };





// Custom hook to manage profile-related state and interactions
// export const useProfile = () => {
//   // Initialize state for user profile, bot selection, and UI controls
//   const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [friends, setFriends] = useState<UserInfo[]>([]);
//   const [players, setPlayers] = useState<UserInfo[]>([]);
//   const navigate = useNavigate();
//   const isFetchingRef = useRef(false);

//   // Memoize authentication headers for API requests
//   const authHeaders = useMemo(() => getAuthHeaders(), []);

//   // Validate Base64 strings for avatar processing
//   const isValidBase64 = (str: string) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch {
//       return false;
//     }
//   };

//   // Fetch and process all users, converting server data to UserInfo format
//   const fetchAllUsers = useCallback(async () => {
//     try {
//       console.log("Fetching all users...");
//       const response = await fetch(`https://localhost:3000/users?t=${Date.now()}`, {
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

//       const mappedUsers: UserInfo[] = (data.users || []).map((u: any) => {
//         let avatar = "/prof_img/avatar1.png"; // default avatar

//         if (u.image) {
//           if (typeof u.image === "string" && isValidBase64(u.image)) {
//             avatar = `data:image/jpeg;base64,${u.image}`;
//           } else if (
//             typeof u.image === "object" &&
//             Array.isArray((u.image as any).data)
//           ) {
//             const byteArray: number[] = (u.image as any).data;
//             let binary = "";
//             byteArray.forEach((byte) => {
//               binary += String.fromCharCode(byte);
//             });
//             const base64String = btoa(binary);
//             avatar = `data:image/jpeg;base64,${base64String}`;
//           } else {
//             console.warn(
//               `Invalid avatar data for user ${u.username || u.id}:`,
//               u.image
//             );
//           }
//         }

//         const userInfo: UserInfo = {
//           id: (u.id || "").toString(),
//           username: u.username || u.name || "Unknown",
//           avatar,
//           email: u.email || "",
//           name: u.name || "",
//           password: "",
//           wins: u.wins || 0,
//           losses: u.losses || 0,
//           online: !!u.online,
//           history: [],
//         };
//         console.log(`Mapped user ${userInfo.username} avatar:`, userInfo.avatar);
//         return userInfo;
//       });

//       const sortedUsers = mappedUsers.sort((a, b) =>
//         a.online === b.online ? 0 : a.online ? -1 : 1
//       );

//       console.log("Sorted players (online first):", sortedUsers);
//       setPlayers(sortedUsers);
//     } catch (err: any) {
//       console.error("Failed to fetch users:", err);
//       toast.error("Failed to load players list.");
//     }
//   }, [authHeaders]);

//   // Load user data and players list with authentication checks
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

//   // Update user profile data and refresh related state
//   const saveUserData = useCallback(
//     async (updatedUser: UserInfo) => {
//       const profileUpdates: Partial<UserInfo> = {};
//       if (updatedUser.name !== user?.name) profileUpdates.name = updatedUser.name;
//       if (updatedUser.username !== user?.username)
//         profileUpdates.username = updatedUser.username;
//       if (updatedUser.password !== user?.password)
//         profileUpdates.password = updatedUser.password;

//       await updateUserProfile(
//         profileUpdates,
//         updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
//         authHeaders
//       );
//       const updatedUserData = await fetchUserData(authHeaders);
//       setUser(updatedUserData);
//       console.log("Reloading all users after avatar update...");
//       await fetchAllUsers(); // Reload players list after updating avatar
//     },
//     [user, authHeaders, fetchAllUsers]
//   );

//   // Handle profile updates and close the edit modal
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

//   // Process game results and update user stats
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

//   // Simulate a game with a random bot and outcome
//   const handlePlay = useCallback(() => {
//     const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
//     const result = Math.random() > 0.5 ? "win" : "loss";

//     handleGameEnd(result, opponent.name);

//     if (!selectedBot) {
//       setSelectedBot(null);
//     }
//   }, [selectedBot, handleGameEnd]);

//   // Initialize data fetching on component mount
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

//   // Expose state and handlers for use in components
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
