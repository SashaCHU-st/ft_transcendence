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
}

// Main component rendering search, user info, and action buttons
const ProfileActions: React.FC<ProfileActionsProps> = ({
  user,
  onProfileClick,
  onSearch,
}) => {
  //const navigate = useNavigate();               // Hook for navigation after logout
  const [searchQuery, setSearchQuery] = useState("");  // Local state for search input

  /**
   * Logout handler
   * Sends POST to /logout, clears token, and navigates to login on success
   */
  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...getAuthHeaders(),                    // Attach authorization header
  //       },
  //       body: JSON.stringify({ email: user.email }),
  //     });
  //     if (!response.ok) throw new Error("Failed to logout");
  //     toast.success("Logged out successfully!");
  //     localStorage.removeItem("token");          // Remove JWT to prevent unauthorized access
  //     //navigate("/login");                       // Redirect to login page
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //     toast.error("Failed to logout. Please try again.");
  //   }
  // };

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
        <input
          type="text"
          placeholder="Search user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="
            px-3
            py-1
            rounded-2xl
            text-sm
            bg-gray-800
            border
            border-emerald-200
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
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="
              px-3
              rounded-2xl
              text-sm
              font-bold
              bg-transparent
              outline-3
              outline-offset-2
              outline-double
              border
              border-emerald-200
              text-white
              transition-all
              duration-300
              ease-in-out
              hover:scale-110
            "
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="
              px-3
              rounded-2xl
              text-sm
              font-bold
              bg-transparent
              outline-3
              outline-offset-2
              outline-double
              border
              border-red-400
              text-white
              transition-all
              duration-300
              ease-in-out
              hover:scale-110
            "
          >
            Clear
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
            text-xl
            sm:text-2xl
            font-bold
            ${user.online ? "text-green-400" : "text-gray-400"}
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
            onClick={onProfileClick}
            className="
              px-3
              py-2
              rounded-2xl
              text-sm
              font-bold
              bg-transparent
              outline-3
              outline-offset-2
              outline-double
              border
              border-emerald-200
              text-white
              transition-all
              duration-300
              ease-in-out
              hover:scale-110
            "
          >
            Profile
          </button>
          <button
            onClick={logout}
            className="
              px-3
              py-1
              rounded-2xl
              text-sm
              font-bold
              bg-transparent
              outline-3
              outline-offset-2
              outline-double
              border
              border-emerald-200
              text-white
              transition-all
              duration-300
              ease-in-out
              hover:scale-110
            "
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;
