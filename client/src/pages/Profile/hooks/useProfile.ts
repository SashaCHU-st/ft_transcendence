//! rabochaja do refactoringa

// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "../types/UserInfo";
// import { fetchUserData, updateUserProfile, getAuthHeaders, saveGameResult } from "../types/api";
// import { bots } from "../types/botsData";


// export const useProfile = () => {
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [friends, setFriends] = useState<UserInfo[]>([]);
//   const [players, setPlayers] = useState<UserInfo[]>([]);
//   const [selectedBot, setSelectedBot] = useState<(typeof bots)[0] | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate();
//   const isFetchingRef = useRef(false);
//   const authHeaders = useMemo(() => getAuthHeaders(), []);

//   const handleAddFriend = useCallback(
//     async (toAdd: UserInfo) => {
//       if (!user || !user.id || !toAdd.username || toAdd.username.trim() === "") {
//         console.error("Cannot add friend: Invalid user data", {
//           userId: user?.id,
//           username: toAdd.username,
//         });
//         toast.error("Cannot add friend: Invalid user or username");
//         return;
//       }

//       try {
//         console.log("Sending to /addFriends:", {
//           user_id: parseInt(user.id),
//           username: toAdd.username,
//         });
//         const response = await fetch("http://localhost:3000/addFriends", {
//           method: "POST",
//           headers: { "Content-Type": "application/json", ...authHeaders },
//           body: JSON.stringify({ user_id: parseInt(user.id), username: toAdd.username }),
//         });

//         if (!response.ok) {
//           const data = await response.json();
//           console.error("Server error response:", {
//             message: data.message,
//             status: response.status,
//             fullResponse: data,
//             headers: Object.fromEntries(response.headers.entries()),
//           });
//           if (data.message === "Friendship already exists") {
//             console.log("Friendship already exists, reloading friends...");
//             await loadFriends();
//             toast(`${toAdd.username} is already your friend.`);
//             return;
//           }
//           throw new Error(data.message || "Failed to add friend");
//         }

//         const data = await response.json();
//         console.log("Add friend response:", data);

//         setFriends((prev) => {
//           const newFriends = [
//             ...prev.filter((f) => f.id.toString() !== toAdd.id.toString()),
//             { ...toAdd, id: toAdd.id.toString(), onRemove: () => handleRemoveFriend(toAdd) },
//           ];
//           console.log("Updated friends:", newFriends.map(f => ({ id: f.id, username: f.username })));
//           return newFriends;
//         });
//         setPlayers((prev) => {
//           const newPlayers = prev.filter((u) => u.id.toString() !== toAdd.id.toString());
//           console.log("Updated players:", newPlayers.map(p => ({ id: p.id, username: p.username })));
//           return newPlayers;
//         });
//         toast.success(`Added ${toAdd.username} to friends!`);
//       } catch (err: any) {
//         console.error("Error adding friend:", {
//           message: err.message,
//           error: err,
//           stack: err.stack,
//         });
//         toast.error(err.message || "Unable to add friend.");
//       }
//     },
//     [authHeaders, user]
//   );

//   const handleRemoveFriend = useCallback(
//     async (toRemove: UserInfo) => {
//       if (!user || !user.id || !toRemove.username || toRemove.username.trim() === "") {
//         console.error("Cannot remove friend: Invalid user data", {
//           userId: user?.id,
//           username: toRemove.username,
//         });
//         toast.error("Cannot remove friend: Invalid user or username");
//         return;
//       }

//       try {
//         console.log("Sending to /deletefriend:", {
//           user_id: parseInt(user.id),
//           username: toRemove.username,
//         });
//         const response = await fetch("http://localhost:3000/deletefriend", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json", ...authHeaders },
//           body: JSON.stringify({ user_id: parseInt(user.id), username: toRemove.username }),
//         });

//         if (!response.ok) {
//           const data = await response.json();
//           console.error("Server error response:", {
//             message: data.message,
//             status: response.status,
//             fullResponse: data,
//             headers: Object.fromEntries(response.headers.entries()),
//           });
//           throw new Error(data.message || "Failed to remove friend");
//         }

//         const data = await response.json();
//         console.log("Remove friend response:", data);

//         setFriends((prev) => {
//           const newFriends = prev.filter((u) => u.id.toString() !== toRemove.id.toString());
//           console.log("Updated friends:", newFriends.map(f => ({ id: f.id, username: f.username })));
//           return newFriends;
//         });
//         setPlayers((prev) => {
//           const newPlayers = [
//             ...prev.filter((u) => u.id.toString() !== toRemove.id.toString()),
//             { ...toRemove, id: toRemove.id.toString(), onAdd: () => handleAddFriend(toRemove) },
//           ];
//           console.log("Updated players:", newPlayers.map(p => ({ id: p.id, username: p.username })));
//           return newPlayers;
//         });
//         toast.success(`Removed ${toRemove.username} from friends.`);
//       } catch (err: any) {
//         console.error("Error removing friend:", {
//           message: err.message,
//           error: err,
//           stack: err.stack,
//         });
//         toast.error(err.message || "Unable to add friend.");
//       }
//     },
//     [authHeaders, user, handleAddFriend]
//   );

//   const loadFriends = useCallback(async () => {
//     if (!user || !user.id) {
//       console.warn("loadFriends: User data not yet available, skipping friend fetch", {
//         user: user,
//         userId: user?.id,
//       });
//       return [];
//     }

//     try {
//       console.log("Sending to /myfriends:", { user_id: parseInt(user.id) });
//       const response = await fetch("http://localhost:3000/myfriends", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders },
//         body: JSON.stringify({ user_id: parseInt(user.id) }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         console.error("Server error response:", {
//           message: data.message,
//           status: response.status,
//           fullResponse: data,
//           headers: Object.fromEntries(response.headers.entries()),
//         });
//         throw new Error(data.message || "Failed to fetch friends");
//       }

//       console.log("My friends response:", data);

//       const friendUsers: UserInfo[] = (data.myfriends || []).map((f: any) => {
//         const avatarSrc = f.image && f.image_type
//           ? `data:${f.image_type};base64,${f.image}`
//           : "/prof_img/avatar1.png";
//         return {
//           id: f.id.toString(),
//           username: f.username,
//           avatar: avatarSrc,
//           email: f.email || "",
//           name: f.name || "",
//           password: "",
//           wins: f.wins || 0,
//           losses: f.losses || 0,
//           online: !!f.online,
//           history: [],
//           onRemove: () => handleRemoveFriend({
//             id: f.id.toString(),
//             username: f.username,
//             avatar: avatarSrc,
//             email: f.email || "",
//             name: f.name || "",
//             password: "",
//             wins: f.wins || 0,
//             losses: f.losses || 0,
//             online: !!f.online,
//             history: [],
//           }),
//         };
//       });

//       setFriends(() => {
//         console.log("Updated friends from server:", friendUsers.map(f => ({ id: f.id, username: f.username })));
//         if (friendUsers.length === 0) {
//           console.log("No friends found, setting empty friends list");
//         }
//         return friendUsers;
//       });
//       return friendUsers;
//     } catch (err: any) {
//       console.error("Failed to load friends:", err);
//       toast.error("Failed to load friends list.");
//       return [];
//     }
//   }, [authHeaders, user, handleRemoveFriend]);

//   const fetchAllUsers = useCallback(async (currentFriends: UserInfo[]) => {
//     if (!user || !user.id) {
//       console.warn("fetchAllUsers: User data not yet available, skipping users fetch", {
//         user: user,
//         userId: user?.id,
//       });
//       return;
//     }

//     try {
//       console.log("Fetching all users...");
//       const response = await fetch(`http://localhost:3000/users?t=${Date.now()}`, {
//         headers: { "Content-Type": "application/json", ...authHeaders },
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to fetch users");

//       console.log("All users response:", data);

//       const friendIds = new Set(currentFriends.map(f => f.id.toString()));
//       console.log("Friend IDs for filtering:", Array.from(friendIds));

//       const mappedUsers: UserInfo[] = (data.users || [])
//         .filter((u: any) => u.id.toString() !== user.id.toString())
//         .map((u: any) => {
//           const avatarSrc = u.image && u.image_type
//             ? `data:${u.image_type};base64,${u.image}`
//             : "/prof_img/avatar1.png";
//           return {
//             id: u.id.toString(),
//             username: u.username || u.name || "Unknown",
//             avatar: avatarSrc,
//             email: u.email || "",
//             name: u.name || "",
//             password: "",
//             wins: u.wins || 0,
//             losses: u.losses || 0,
//             online: !!u.online,
//             history: [],
//             onAdd: () => handleAddFriend({
//               id: u.id.toString(),
//               username: u.username || u.name || "Unknown",
//               avatar: avatarSrc,
//               email: u.email || "",
//               name: u.name || "",
//               password: "",
//               wins: u.wins || 0,
//               losses: u.losses || 0,
//               online: !!u.online,
//               history: [],
//             }),
//           };
//         });

//       setPlayers(() => {
//         const newPlayers = mappedUsers.filter((p) => !friendIds.has(p.id.toString()));
//         console.log("Filtered players:", newPlayers.map(p => ({ id: p.id, username: p.username })));
//         console.log("Current friends during filter:", currentFriends.map(f => ({ id: f.id, username: f.username })));
//         return newPlayers;
//       });
//     } catch (err: any) {
//       console.error("Failed to fetch users:", err);
//       toast.error("Failed to load players list.");
//     }
//   }, [authHeaders, handleAddFriend, user]);

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
//       const refreshed = await fetchUserData(authHeaders);
//       setUser(refreshed);
//       const newFriends = await loadFriends();
//       await fetchAllUsers(newFriends);
//     },
//     [user, authHeaders, fetchAllUsers, loadFriends]
//   );

//   const handleSaveProfile = useCallback(
//     async (data: Partial<UserInfo>) => {
//       if (!user) return;
//       const merged: UserInfo = { ...user, ...data, password: data.password || user.password };
//       await saveUserData(merged);
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
//         const refreshed = await fetchUserData(authHeaders);
//         setUser(refreshed);
//         toast.success(`Game over! You ${result} against ${opponent}!`);
//       } catch (err) {
//         toast.error("Failed to save game result.");
//       }
//     },
//     [user, authHeaders]
//   );

//   const handlePlay = useCallback(() => {
//     const opponent = selectedBot || bots[Math.floor(Math.random() * bots.length)];
//     const result = Math.random() > 0.5 ? "win" : "loss";
//     handleGameEnd(result, opponent.name);
//   }, [selectedBot, handleGameEnd]);

//   const loadData = useCallback(async () => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsLoading(false);
//       toast.error("No token found. Redirecting to login.");
//       navigate("/login");
//       isFetchingRef.current = false;
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const userData = await fetchUserData(authHeaders);
//       if (!userData || !userData.id) {
//         throw new Error("Invalid user data received");
//       }
//       console.log("User data loaded:", { id: userData.id, username: userData.username });
//       setUser(userData);
//       const newFriends = await loadFriends();
//       await fetchAllUsers(newFriends);
//     } catch (err: any) {
//       console.error("Failed to load data:", err);
//       toast.error("Failed to load data. Please re-login.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [authHeaders, navigate, fetchAllUsers, loadFriends]);

//   useEffect(() => {
//     loadData();
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
//     handleSaveProfile,
//     handlePlay,
//   };
// };




import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserInfo } from "../types/UserInfo";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { useFriends } from "./useFriends";
import { useBots } from "./useBots";
import { useGame } from "./useGame";

export const useProfile = () => {
  /* Auth */
  const { headers } = useAuth();
  const navigate = useNavigate();
  const bootRef = useRef(false);

  /* User */
  const { user, loading, load, save } = useUser(headers);

  /* Friends */
  const { friends, players, syncAll } = useFriends(user, headers);

  /* Bots */
  const { selectedBot, setSelectedBot } = useBots();

  /* Game */
  const { play } = useGame(user, headers, selectedBot, load);

  /* UI state */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Save profile with sync and modal close */
  const handleSaveProfile = useCallback(
    async (data: Partial<UserInfo>) => {
      if (!user) return;
      const merged: UserInfo = { ...user, ...data, password: data.password || user.password };
      await save(merged);
      await syncAll();
      setIsModalOpen(false);
    },
    [user, save, syncAll]
  );

  /* Bootstrap */
  const bootstrap = useCallback(async () => {
    if (bootRef.current) return;
    bootRef.current = true;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }
    try {
      await load();
      await syncAll();
    } catch {
      toast.error("Failed to load data. Please re-login.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      bootRef.current = false;
    }
  }, [load, syncAll, navigate]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  /* Public API (identical to original) */
  return {
    user,
    friends,
    players,
    selectedBot,
    isModalOpen,
    isLoading: loading,
    setSelectedBot,
    setIsModalOpen,
    handleSaveProfile,
    handlePlay: play,
  };
};