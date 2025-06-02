// import React, { useState } from "react";
// import ProfileModal from "./ProfileModal";
// import Header from "./Header";
// import DesktopLayout from "./DesktopLayout";
// import MobileLayout from "./MobileLayout";
// import BotSelector from "./BotSelector";
// import { useProfile } from "./hooks/useProfile";
// import { toast } from "react-hot-toast";

// // Profile component serves as the main page for user profile management
// const Profile: React.FC = () => {
//   // Destructure user data, state, and handlers from custom useProfile hook
//   const {
//     user, // Current user's data
//     friends, // List of friends
//     players, // List of all players
//     selectedBot, // Currently selected bot for gameplay
//     isModalOpen, // State for profile modal visibility
//     isLoading, // Loading state for data fetching
//     setSelectedBot, // Function to update selected bot
//     setIsModalOpen, // Function to toggle profile modal
//     handleSaveProfile, // Handler to save profile changes
//     handlePlay, // Handler to start a game
//   } = useProfile();

//   // State to store username for auto-expanding a user card
//   const [expandUsername, setExpandUsername] = useState<string | undefined>(undefined);

//   // Handle search for a user by username (case-insensitive)
//   const handleSearch = (username: string) => {
//     // Check if the username exists in players or friends lists
//     const foundInPlayers = players.find(
//       (p) => p.username.toLowerCase() === username.toLowerCase()
//     );
//     const foundInFriends = friends.find(
//       (f) => f.username.toLowerCase() === username.toLowerCase()
//     );

//     // If found, set expandUsername to trigger card expansion and show success toast
//     if (foundInPlayers || foundInFriends) {
//       setExpandUsername(username);
//       toast.success(`Found user: ${username}`);
//     } else {
//       // If not found, clear expandUsername and show error toast
//       setExpandUsername(undefined);
//       toast.error(`User ${username} not found`);
//     }
//   };

//   // Display loading state while fetching data
//   if (isLoading) {
//     return (
//       <div
//         className="
//           min-h-screen
//           w-full
//           flex
//           items-center
//           justify-center
//           text-white
//         "
//       >
//         Loading data, please wait...
//       </div>
//     );
//   }

//   // Display error if user data failed to load
//   if (!user) {
//     return (
//       <div
//         className="
//           min-h-screen
//           w-full
//           flex
//           items-center
//           justify-center
//           text-white
//         "
//       >
//         Failed to load user data.
//       </div>
//     );
//   }

//   // Render the main profile page layout
//   return (
//     <>
//       <div
//         className="
//           min-h-screen
//           w-full
//           text-white
//           flex
//           flex-col
//           overflow-y-auto
//           justify-between
//         "
//       >
//         {/* Header with user info, profile toggle, and search functionality */}
//         <Header
//           user={{
//             username: user.username,
//             online: user.online,
//             email: user.email,
//           }}
//           onProfileClick={() => setIsModalOpen(true)} // Open profile modal on click
//           onSearch={handleSearch} // Pass search handler
//         />
//         {/* Desktop-specific layout for large screens */}
//         <DesktopLayout
//           user={user}
//           friends={friends}
//           players={players.filter((p) => p.id !== user.id)} // Exclude current user from players list
//           selectedBot={selectedBot}
//           handlePlay={handlePlay}
//           expandUsername={expandUsername} // Pass username for card expansion
//         />
//         {/* Mobile-specific layout for smaller screens */}
//         <MobileLayout
//           user={user}
//           friends={friends}
//           players={players.filter((p) => p.id !== user.id)} // Exclude current user from players list
//           selectedBot={selectedBot}
//           handlePlay={handlePlay}
//           expandUsername={expandUsername} // Pass username for card expansion
//         />
//         {/* Bot selector for choosing game opponent */}
//         <BotSelector
//           selectedBot={selectedBot}
//           setSelectedBot={setSelectedBot}
//         />
//       </div>

//       {/* Conditionally render profile modal for editing user data */}
//       {isModalOpen && (
//         <ProfileModal
//           onClose={() => setIsModalOpen(false)} // Close modal on dismiss
//           userData={{
//             avatar: user.avatar,
//             username: user.username,
//             name: user.name,
//           }}
//           onSave={handleSaveProfile} // Save profile changes
//         />
//       )}
//     </>
//   );
// };

// export default Profile;


//! dlja preznego fona, zakomentirujte niz i otkrojte verh

import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import Header from "./Header";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import BotSelector from "./BotSelector";
import { useProfile } from "./hooks/useProfile";
import { toast } from "react-hot-toast";
import { SpaceBackground } from "../../pong/components/SpaceBackground";
//import { UserInfo } from "./types/UserInfo";

// Profile component serves as the main page for user profile management
const Profile: React.FC = () => {
  // Destructure user data, state, and handlers from custom useProfile hook
  const {
    user, // Current user's data

    friends, // List of friends
    players, // List of all players

    selectedBot, // Currently selected bot for gameplay
    isModalOpen, // State for profile modal visibility
    isLoading, // Loading state for data fetching
    setSelectedBot, // Function to update selected bot
    setIsModalOpen, // Function to toggle profile modal
    handleSaveProfile, // Handler to save profile changes
    handlePlay, // Handler to start a game
    handleRemove,
    notification,
    isNotificationModalOpen,
    handleAcceptChallenge,
    handleDeclineChallenge,
   
  } = useProfile();

  

  // State to store username for auto-expanding a user card
  const [expandUsername, setExpandUsername] = useState<string | undefined>(
    undefined
  );

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

  // Display loading state while fetching data
  if (isLoading) {
    return (
      <SpaceBackground>
        <div className="h-screen
                      w-full 
                      flex 
                      items-center 
                      justify-center
                      text-white">
          Loading data, please wait...
        </div>
      </SpaceBackground>
    );
  }

  // Display error if user data failed to load
  if (!user) {
    return (
      <SpaceBackground>
        <div className="h-screen 
        w-full 
        flex 
        items-center 
        justify-center
         text-white">
          Failed to load user data.
        </div>
      </SpaceBackground>
    );
  }

  // Render the main profile page layout
  return (
    <SpaceBackground>
      <div className="h-screen 
       w-full
       text-white 
       flex 
       flex-col 
       overflow-y-auto">
        {/* Header with user info, profile toggle, and search functionality */}
        <Header
          user={{
            username: user.username,
            online: user.online,
            email: user.email,
          }}
          onProfileClick={() => setIsModalOpen(true)}
          onSearch={handleSearch}
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
        />

        {/* Bot selector for choosing game opponent */}
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

        {isNotificationModalOpen && notification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 text-center text-black w-full max-w-sm">
                <h2 className="text-lg text-indigo-950 font-orbitron font-bold mb-4">CHALLENGE REQUEST</h2>
                <p className="mb-6 font-orbitron">{notification.username} ({notification.user_id}) has challenged you to a game!</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleDeclineChallenge}
                    className="px-4 py-2 font-orbitron bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    DECLINE
                  </button>
                  <button
                    onClick={handleAcceptChallenge}
                    className="px-4 py-2 font-orbitron bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ACCEPT
                  </button>
                </div>
              </div>
            </div>
          )}
        
    </SpaceBackground>
  );
};


export default Profile;
