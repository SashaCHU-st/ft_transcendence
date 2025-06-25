import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import Header from "./Header";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import BotSelector from "./BotSelector";
import { useProfile } from "./hooks/useProfile";
import { toast } from "react-hot-toast";
import { SpaceBackground } from "../../pong/components/SpaceBackground";
import ChatModal from "../../chat/components/ChatModal";
import { ChatProvider } from "../../chat/context/ChatContext";
//import { UserInfo } from "./types/UserInfo";
import NotificationModal from "./NotificationModal";
import StatsDashboardModal from "./StatsDashboardModal";
import DeclinedChallengeModal from "./DeclinedChallengeModal";
import FriendRequestList from "./FriendRequestsList"
import DeclinedFriendRequestModal from "./DeclinedFriendRequestModal";
import api from "./types/api";

// Profile component serves as the main page for user profile management
const Profile: React.FC = () => {
  const {
    user, // Current user's data
    friends, // List of friends
    players, // List of all players
    chatList,
    selectedBot, // Currently selected bot for gameplay
    isModalOpen, // State for profile modal visibility
   // isLoading, // Loading state for data fetching
    setSelectedBot, // Function to update selected bot
    setIsModalOpen, // Function to toggle profile modal
    handleSaveProfile, // Handler to save profile changes
    handlePlay, // Handler to start a game
    handleRemove,
    notifications,
    isNotificationModalOpen,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAdd,
    handleConfirm,
    handleDecline,
    setDeclinedChallenge,
    declinedChallenge, 
    friendRequests,
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
    console.log(`Handled declined request for ${username}`);
    // Remove only the acknowledged username from the array
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

  // Display loading state while fetching data
  // if (isLoading) {
  //   return (
  //     <SpaceBackground>
  //       <div
  //         className="h-screen
  //                     w-full 
  //                     flex 
  //                     items-center 
  //                     justify-center
  //                     text-white"
  //       >
  //         Loading data, please wait...
  //       </div>
  //     </SpaceBackground>
  //   );
  // }

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
          expandUsername={expandUsername}
          handleRemove={handleRemove}
          handleAdd={handleAdd}
          //handleConfirm={handleConfirm}
        />

        {/* Mobile-specific layout for smaller screens */}
        <MobileLayout
          user={user}
          friends={friends}
          players={players.filter((p) => p.id !== user.id)}
          selectedBot={selectedBot}
          handlePlay={handlePlay}
          expandUsername={expandUsername}
          handleRemove={handleRemove}
          handleAdd={handleAdd}
          //handleConfirm={handleConfirm}
        />

        {/* Bot selector for choosing game opponent */}
        <FriendRequestList
            requests={friendRequests}
            onConfirm={handleConfirm}
            onDecline={handleDecline}
           
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

      {/* {declinedFriendRequest && (
        <DeclinedFriendRequestModal
          declinedUsername={declinedFriendRequest}
          onClose={handleOkButtondeclineFriend }
        />
      )} */}

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
