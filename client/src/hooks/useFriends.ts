import { useCallback } from "react";
import { confirmFriendRequest, deleteFriend, addFriend } from "../types/api";
import { toast } from "react-hot-toast";
import api from "../types/api";
import { FriendRequest } from "./useUserData";


export function useFriends(
	fetchAllUsers: () => Promise<void>, 
	fetchFriendRequests: () => Promise<FriendRequest[]>, 
	friends: any[], 
	setFriends: any, 
	setPlayers: any,
  setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>,
) {

  const handleAdd = useCallback(async (username: string) => {
    try {
      await addFriend(username);
      toast.success(`Friend request sent to ${username}`);
      await fetchAllUsers();
    } catch (err: any) {
      console.error("Failed to add friend:", err);
      toast.error(err.message || "Could not send friend request");
    }
  }, [fetchAllUsers]);

  const handleConfirm = useCallback( async (username: string) => {
  	try {
      await confirmFriendRequest(username);
      await fetchAllUsers();
      await fetchFriendRequests();
	} catch (err) {
		toast.error("Failed to accept request");
	}
  }, [fetchAllUsers, fetchFriendRequests]);

  const handleDecline = useCallback(async (username: string) => {
  try {
    const user_id = localStorage.getItem("id");
    await api.post('/declineFriend', { 
      user_id,
      username,
      confirmReq: 0
    });
    setFriendRequests(prev => prev.filter(req => req.username !== username));
    toast.success(`You declined a friend request from ${username}`);
  } catch (err: any) {
    toast.error("Failed to decline request");
  }
}, [setFriendRequests]);

  const handleRemove = useCallback(async (username: string) => {
    try {
      await deleteFriend(username);
      setFriends((prev: any[]) => prev.filter(f => f.username !== username));
      setPlayers((prev: any[]) => [...prev, friends.find(f => f.username === username)!]);
      toast.success(`${username} removed from friends`);
      await fetchAllUsers();
    } catch (err: any) {
      console.error("Failed to delete friend:", err);
      toast.error(err.message || "Could not remove friend");
    }
  }, [friends, setFriends, setPlayers, fetchAllUsers]);

  return { handleAdd, handleRemove, handleConfirm, handleDecline };
}
