import React, { useState } from "react";
import { UserInfo } from "./types/UserInfo";
import { toast } from "react-hot-toast";
//import { useNavigate } from "react-router-dom";
//import { getAuthHeaders } from "./types/api";
import { useAuth } from "../../context/AuthContext";



// Define the props accepted by the ProfileActions component
interface ProfileActionsProps {
  user: Pick<UserInfo, "username" | "online" | "email">; // Basic user info for display and API calls
  onProfileClick: () => void;                           // Callback to open profile modal
  onSearch?: (username: string) => void;                // Optional callback for search action
  onOpenChat: () => void;                               // Callback to open chat
  onOpenStats: () => void;                              // Callback to open stats dashboard
}

// Main component rendering search, user info, and action buttons
const ProfileActions: React.FC<ProfileActionsProps> = ({
  user,
  onProfileClick,
  onSearch,
  onOpenChat,
  onOpenStats,
}) => {
  //const navigate = useNavigate();               // Hook for navigation after logout
  const [searchQuery, setSearchQuery] = useState("");  // Local state for search input

  /**
   * Search handler
   * Validates input and calls parent onSearch callback
   */
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a username to search.");
      return;
    }
    onSearch?.(searchQuery.trim());             // Trigger search in parent component
  };

  /** Clear the current search input */
  const handleClear = () => {
    setSearchQuery("");
  };

  /**
   * Keyboard handler for search
   * Triggers search on Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const { logout } = useAuth();
  return (
    // Container: switches layout from column (mobile) to row (desktop)
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">

      {/*
        Search Group:
        - Input field for username
        - Search and Clear buttons
      */}
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <div className="relative w-32 sm:w-40">
        <input
          type="text"
          placeholder="Search user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="
            px-4
            py-1
            rounded-2xl
            text-xs
            sm:text-xs
            md:text-sm
            bg-gray-800
            border
            border-purple-200
            shadow-[0_0_15px_#c084fc]
            text-white
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-800
            transition-all
            duration-300
            ease-in-out
            hover:scale-105
            w-32
            sm:w-40
          "
          style={{
            textShadow: `
              0 0 4px rgba(102, 0, 255, 0.9),
              0 0 8px rgba(102, 0, 255, 0.7),
              0 0 16px rgba(102, 0, 255, 0.5),
              0 0 32px rgba(102, 0, 255, 0.3)
            `,
          }}
          
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="
              absolute
              right-2
              top-1/2
              transform
              -translate-y-1/2
              text-white
              text-sm
              hover:text-red-400
              transition
            "
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
          >
             <i className="fas fa-magnifying-glass text-blue-300 hover:text-blue-400 text-md xl:text-xl w-8 h-8"></i>
          </button>
        </div>
      </div>

      {/*
        User Info & Actions:
        - Display username with online status color
        - Buttons for opening profile modal and logging out
      */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <span
          className={`
            text-base
            sm:text-base
            md:text-xl
            xl:text-2xl
            font-bold
            ${user.online ? "text-purple-200" : "text-gray-400"}
            truncate
            max-w-[150px]
            sm:max-w-[200px]
            sm:order-1
          `}
        >
          {user.username}
        </span>
        <div className="flex gap-3 sm:order-2">
          <button
            onClick={onOpenChat}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
            aria-label="Open chat"
          >
            <i className="fas fa-comments text-blue-300 w-6 h-6" />
          </button>

          <button
            onClick={onOpenStats}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
            aria-label="Open statistics"
          >
            <i className="fas fa-chart-simple text-blue-300 w-6 h-6" />
          </button>
         

          <button
              onClick={onProfileClick}
                className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
                aria-label="Open settings"
              >
               <img
                  src="/button_img/user-settings.png" 
                  alt="Settings"
                  className="w-6 h-6 lg:w-7 lg:h-7 drop-shadow-[0_0_25px_rgba(255,215,0,1)] 
                            animate-crown-spin hover:animate-none"
              />
          </button>

          <button
            onClick={logout}
            className="
              px-1
              py-1
              rounded-full
              bg-gray-800
              hover:bg-gray-700
              focus:outline-none
              focus:ring-2
            focus:ring-indigo-800
              text-white
              transition-all
              duration-300
              ease-in-out
              hover:scale-110
            "
          >
           
            <i className="fas fa-right-from-bracket text-blue-500 hover:text-blue-400 text-xl xl:text-2xl w-8 h-8"></i>
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProfileActions;
