import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAuthHeaders} from "../types/api";
import { useUserData } from "./useUserData";
import { useNotifications } from "./useNotification";
import { useFavorites } from "./useFavorites";
import { useProfileModal } from "./useProfileModal";
import { useGame } from "./useGame";


export const useProfile = () => {
  const { user, friends, players, chatList,matches, fetchAllUsers, setFriends, setPlayers, setChatList, setUser } = useUserData();
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
  } = useNotifications(userId);

  // Favorites
  const { handleAdd, handleRemove } = useFavorites(fetchAllUsers, friends, setFriends, setPlayers);

  // Profile modal
  const { isModalOpen, setIsModalOpen, handleSaveProfile } = useProfileModal(user, fetchAllUsers, authHeaders);

  // Game logic
  const navigate = useNavigate();
  const { selectedBot, setSelectedBot, handlePlay } = useGame();

  // Refresh user data and notifications periodically
  useEffect(() => {
 
  fetchAllUsers();
}, [fetchAllUsers]);
  
 
  return {
    user,
    friends,
    players,
    chatList,
    matches,
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
    setChatList,
    setSelectedBot,
    handlePlay,
    navigate,
    setUser,
   
  };
};


