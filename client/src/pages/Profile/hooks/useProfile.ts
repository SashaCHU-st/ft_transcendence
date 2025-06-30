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
    handleAcceptChallenge,
    handleDeclineChallenge,
    redirectToGame,
    setRedirectToGame,
    declinedChallenge,
    setDeclinedChallenge,
  } = useNotifications(userId);

  //Friends
  const { handleAdd, handleRemove, handleConfirm, handleDecline } = useFriends(
  fetchAllUsers,
  fetchFriendRequests,
  friends,
  setFriends,
  setPlayers,
  setFriendRequests,
);

  // Profile modal
  const { isModalOpen, setIsModalOpen, handleSaveProfile } = useProfileModal(
    user,
    fetchAllUsers,
    authHeaders
  );

  // Game logic
  const navigate = useNavigate();
  const { selectedBot, setSelectedBot, handlePlay, isRandomizing } = useGame();

  // useEffect(() => {
  //   fetchAllUsers();
  //   fetchFriendRequests();

  //   const interval = setInterval(() => {
  //   fetchFriendRequests();
  //   fetchAllUsers();
   
  //  }, 5000);
  //    return () => clearInterval(interval);

  // }, [fetchAllUsers, fetchFriendRequests]);


  useEffect(() => {
  const init = async () => {
    await fetchAllUsers();
    await fetchFriendRequests();
  };

  init();

  const interval = setInterval(() => {
    fetchFriendRequests();
    fetchAllUsers();
  }, 5000);

  return () => clearInterval(interval);
}, [fetchAllUsers, fetchFriendRequests]);


  useEffect(() => {
    const init = async () => {
      await fetchAllUsers();
      await fetchFriendRequests();
    };

    init();

    const interval = setInterval(() => {
      fetchFriendRequests();
      fetchAllUsers();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAllUsers, fetchFriendRequests]);

  useEffect(() => {
    if (!redirectToGame || !userId) return;

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
    isRandomizing,
    navigate,
    setUser,
    declinedChallenge,
    setDeclinedChallenge,
    friendRequests,
    declinedFriendRequest,
    setDeclinedFriendRequest,
  };
};
