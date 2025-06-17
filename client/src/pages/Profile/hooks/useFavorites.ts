import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { addToFavorites } from "../AddFavorites";
import { deleteFromFavorites } from "../DeleteFavorites";

export function useFavorites(fetchAllUsers: () => Promise<void>, friends: any[], setFriends: any, setPlayers: any) {
  const handleAdd = useCallback(async (username: string) => {
    try {
      await addToFavorites(username);
      toast.success(`${username} added to favorites`);
      await fetchAllUsers();
    } catch (err: any) {
      console.error("Failed to add favorite:", err);
      throw err;
    }
  }, [fetchAllUsers]);

  const handleRemove = useCallback(async (username: string) => {
    try {
      await deleteFromFavorites(username);
      setFriends((prev: any[]) => prev.filter(f => f.username !== username));
      setPlayers((prev: any[]) => [...prev, friends.find(f => f.username === username)!]);
      toast.success(`${username} removed from favorites`);
      await fetchAllUsers();
    } catch (err: any) {
      console.error("Failed to remove favorite:", err);
      throw err;
    }
  }, [friends, setFriends, setPlayers, fetchAllUsers]);

  return { handleAdd, handleRemove };
}
