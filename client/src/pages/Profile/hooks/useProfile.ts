

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