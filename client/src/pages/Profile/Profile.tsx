import React, { useState } from "react";
import ProfileModal from "../EditProfile/ProfileModal";
import Header from "./ProfileComponents/Header";
import DesktopLayout from "../../components/Layouts/DesktopLayout";
import MobileLayout from "../../components/Layouts/MobileLayout";
import BotSelector from "./ProfileComponents/BotSelector";
import { useProfile } from "../../hooks/useProfile";
import { toast } from "react-hot-toast";
import { SpaceBackground } from "../../pong/components/SpaceBackground";
import ChatModal from "../../chat/components/ChatModal";
import { ChatProvider } from "../../chat/context/ChatContext";
import NotificationModal from "./ProfileComponents/NotificationModal";
import StatsDashboardModal from "../Dashbord/StatsDashboardModal";
import DeclinedChallengeModal from "./ProfileComponents/DeclinedChallengeModal";
import DeclinedFriendRequestModal from "./ProfileComponents/DeclinedFriendRequestModal";
import api from "../../types/api";


// Profile component serves as the main page for user profile management
const Profile: React.FC = () => {
  const {
    user, // Current user's data
    friends, // List of friends
    players, // List of all players
    chatList,
    selectedBot, // Currently selected bot for gameplay
    isModalOpen, // State for profile modal visibility
    setSelectedBot, // Function to update selected bot
    setIsModalOpen, // Function to toggle profile modal
    handleSaveProfile, // Handler to save profile changes
    handlePlay, // Handler to start a game
    isRandomizing,
    handleRemove,
    notifications,
    isNotificationModalOpen,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAdd,
    setDeclinedChallenge,
    declinedChallenge, 
    //friendRequests,
    declinedFriendRequest,
    setDeclinedFriendRequest,
    //dismissDeclinedFriendRequest
  } = useProfile();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
 

  // State to store username for auto-expanding a user card
  const [expandUsername, setExpandUsername] = useState<string | undefined>(
    undefined
  );

const handleOkButtondeclineFriend = async (username: string) => {
  const user_id1 = localStorage.getItem("id");
  if (!user_id1) return;

  const user_id = Number(user_id1);
  try {
    await api.post("/sawAccept", { user_id, username });
    setDeclinedFriendRequest((prev) =>
      prev ? prev.filter((u) => u !== username) : null
    );
  } catch (err) {
    console.error(`Failed to acknowledge declined request for ${username}:`, err);
  }
};

  // Handle search for a user by username (case-insensitive)
  const handleSearch = (username: string) => {
    // Check if the username exists in players or friends lists
    const foundInPlayers = players.find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );
    const foundInFriends = friends.find(
      (f) => f.username.toLowerCase() === username.toLowerCase()
    );

    //If found, set expandUsername to trigger card expansion and show success toast
    if (foundInPlayers || foundInFriends) {
      setExpandUsername(username);
      toast.success(`Found user: ${username}`);
    } else {
      // If not found, clear expandUsername and show error toast
      setExpandUsername(undefined);
      toast.error(`User ${username} not found`);
    }
  };

  const handleClearSearch = () => {
  setExpandUsername(undefined); // Clear search result so the card won't reopen
};

  // Display error if user data failed to load
  if (!user) {
    return (
      <SpaceBackground>
        <div
          className="h-screen 
        w-full 
        flex 
        items-center 
        justify-center
         text-white"
        >
          Failed to load user data.
        </div>
      </SpaceBackground>
    );
  }

  // Render the main profile page layout
  return (
    <SpaceBackground>
      <div
        className="h-screen 
       w-full
       text-white 
       flex 
       flex-col 
       overflow-y-auto
       font-ubuntu"
      >
        {/* Header with user info, profile toggle, and search functionality */}
        <Header
          user={{
            username: user.username,
            online: user.online,
            email: user.email,
          }}
          onProfileClick={() => setIsModalOpen(true)}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}

        />

        {/* Desktop-specific layout for large screens */}
        <DesktopLayout
          user={user}
          friends={friends}
          players={players.filter((p) => p.id !== user.id)}
          selectedBot={selectedBot}
          handlePlay={handlePlay}
          isRandomizing={isRandomizing}
          expandUsername={expandUsername}
          handleRemove={handleRemove}
          handleAdd={handleAdd}
        />

        {/* Mobile-specific layout for smaller screens */}
        <MobileLayout
          user={user}
          friends={friends}
          players={players.filter((p) => p.id !== user.id)}
          selectedBot={selectedBot}
          handlePlay={handlePlay}
          isRandomizing={isRandomizing}
          expandUsername={expandUsername}
          handleRemove={handleRemove}
          handleAdd={handleAdd}
        />
        <BotSelector
          selectedBot={selectedBot}
          setSelectedBot={setSelectedBot}
        />

      </div>

      {/* Conditionally render profile modal for editing user data */}
      {isModalOpen && (
        <ProfileModal
          onClose={() => setIsModalOpen(false)}
          userData={{
            avatar: user.avatar,
            username: user.username,
            name: user.name,
          }}
          onSave={handleSaveProfile}
        />
      )}
      {isNotificationModalOpen && notifications.length > 0 && (
        <NotificationModal
          notifications={notifications}
          onAccept={handleAcceptChallenge}
          onDecline={handleDeclineChallenge}
        />
      )}
      {declinedChallenge && (
       <DeclinedChallengeModal
        declinedUsername={declinedChallenge}
        onClose={() => setDeclinedChallenge(null)}
      />
      )}
      {declinedFriendRequest &&
        declinedFriendRequest.map((username) => (
          <DeclinedFriendRequestModal
            key={username}
            declinedUsername={username}
            onClose={() => handleOkButtondeclineFriend(username)}
          />
      ))}

      {isStatsOpen && (
        <StatsDashboardModal user={user} onClose={() => setIsStatsOpen(false)} />
      )}

      {isChatOpen && (
        <ChatProvider currentUserId={user.id}>
          <ChatModal
            onClose={() => setIsChatOpen(false)}
            currentUserId={user.id}
            players={chatList.filter((p) => p.id !== user.id)}
          />
        </ChatProvider>
      )}
    </SpaceBackground>
  );
};

export default Profile;
