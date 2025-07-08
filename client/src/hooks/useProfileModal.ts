import { useState, useCallback } from "react";
import { UserInfo } from "../types/UserInfo";
import { updateUserProfile } from "../types/api";
import { toast } from "react-hot-toast";

export function useProfileModal(user: UserInfo | null, fetchAllUsers: () => Promise<void>, authHeaders: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveUserData = useCallback(async (updatedUser: UserInfo) => {
    if (!user) return;

    const profileUpdates: Partial<UserInfo> = {};
    if (updatedUser.name !== user.name) profileUpdates.name = updatedUser.name;
    if (updatedUser.username !== user.username) profileUpdates.username = updatedUser.username;
    if (updatedUser.password !== user.password) profileUpdates.password = updatedUser.password;

    try {
      await updateUserProfile(
        profileUpdates,
        updatedUser.avatar !== user.avatar ? updatedUser.avatar : undefined,
        authHeaders
      );
      await fetchAllUsers();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    }
  }, [user, authHeaders, fetchAllUsers]);

  const handleSaveProfile = useCallback(async (data: Partial<UserInfo>) => {
    if (!user) return;
    const updatedUser: UserInfo = {
      ...user,
      ...data,
      password: data.password || user.password,
    };
    await saveUserData(updatedUser);
    setIsModalOpen(false);
  }, [user, saveUserData]);

  return { isModalOpen, setIsModalOpen, handleSaveProfile };
}
