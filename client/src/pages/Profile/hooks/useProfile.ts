import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAuthHeaders} from "../types/api";
import { useUserData } from "./useUserData";
import { useNotifications } from "./useNotification";
import { useFavorites } from "./useFavorites";
import { useProfileModal } from "./useProfileModal";
import { useGame } from "./useGame";
//import api from "../types/api";

export const useProfile = () => {
  const { user, friends, players, fetchAllUsers, setFriends, setPlayers, setUser } = useUserData();
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
    setRedirectToGame
  } = useNotifications(userId);

  // Favorites
  const { handleAdd, handleRemove } = useFavorites(fetchAllUsers, friends, setFriends, setPlayers);

  // Profile modal
  const { isModalOpen, setIsModalOpen, handleSaveProfile } = useProfileModal(user, fetchAllUsers, authHeaders);

  // Game logic
  const navigate = useNavigate();
  const { selectedBot, setSelectedBot, handlePlay } = useGame(user, fetchAllUsers, authHeaders);

  useEffect(() => {
  fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    if (!redirectToGame || !userId) 
      return;

      setRedirectToGame(null);
  }, [redirectToGame, userId]);


  return {
    user,
    friends,
    players,
    notifications,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAdd,
    handleRemove,
    isModalOpen,
    setIsModalOpen,
    handleSaveProfile,
    selectedBot,
    setSelectedBot,
    handlePlay,
    navigate,
    setUser,
  };
};

