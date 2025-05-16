import { useState, useCallback } from "react";
import { UserInfo } from "../types/UserInfo";
import { fetchUserData, updateUserProfile } from "../types/api";

/**
 * User data hook – loads the current user, exposes the save helper
 * to update profile and reload fresh data afterwards.
 */
export const useUser = (headers: Record<string, string>) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetch `/users/me` */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const me = await fetchUserData(headers);
      if (!me || !me.id) {
        throw new Error("Invalid user data received");
      }
      console.log("User data loaded:", { id: me.id, username: me.username });
      setUser(me);
    } catch (err: any) {
      console.error("Failed to load data:", err);
      throw err; // Let caller handle the error
    } finally {
      setLoading(false);
    }
  }, [headers]);

  /** PATCH `/updateProfile` & reload */
  const save = useCallback(
    async (updatedUser: UserInfo) => {
      const profileUpdates: Partial<UserInfo> = {};
      if (updatedUser.name !== user?.name) profileUpdates.name = updatedUser.name;
      if (updatedUser.username !== user?.username) profileUpdates.username = updatedUser.username;
      if (updatedUser.password !== user?.password) profileUpdates.password = updatedUser.password;

      await updateUserProfile(
        profileUpdates,
        updatedUser.avatar !== user?.avatar ? updatedUser.avatar : undefined,
        headers
      );
      await load();
    },
    [headers, load, user]
  );

  return { user, loading, load, save, setUser };
};