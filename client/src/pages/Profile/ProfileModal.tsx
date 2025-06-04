import React, { useState } from "react";
import { UserInfo } from "./types/UserInfo";
import { toast } from "react-hot-toast";

interface ProfileModalProps {
  onClose: () => void;
  onSave: (data: Partial<UserInfo>) => void;
  userData: Pick<UserInfo, "avatar" | "username" | "name">;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  onSave,
  userData,
}) => {
  // State for form fields
  const [avatar, setAvatar] = useState(userData.avatar);
  const [username, setUsername] = useState(userData.username);
  const [name, setName] = useState(userData.name);
  const [password, setPassword] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // Maximum file size: 2 MB
  const [showPassword, setShowPassword] = useState(false);

  // Handler for avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large! Maximum size is 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handler for saving changes
  const handleSave = () => {
    if (name.length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }
    if (username.length < 2) {
      toast.error("Username must be at least 2 characters long.");
      return;
    }
    console.log("Saving data:", { avatar, username, name, password }); // Debugging
    onSave({ avatar, username, name, password });
  };

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black
        bg-opacity-60
      `}
      // Modal overlay: darkens the screen and centers the content
    >
      <div
        className={`
          bg-gray-900
          text-white
          rounded-xl
          p-6
          w-full
          max-w-md
          space-y-4
          shadow-2xl
        `}
        // Modal container: dark background with rounded corners
      >
        <h2
          className={`
            text-2xl
            font-bold
            text-center
            font-orbitron
          `}
          // Header: centered "Edit Profile" text
        >
          Edit Profile
        </h2>

        <div
          className={`
            flex
            flex-col
            items-center
            gap-2
          `}
          // Avatar section: centers the image and file input
        >
          <img
            src={avatar}
            alt="Avatar"
            className={`
              w-24
              h-24
              rounded-full
              object-cover
              border-2
              border-white
            `}
            // Avatar image: circular with a white border
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className={`
              text-sm
              text-gray-300
            `}
            // File input: for selecting a new avatar
          />
        </div>

        <div
          className={`
            flex
            flex-col
            gap-1
          `}
          // Name field: contains label and text input
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
            // Label for the name field
          >
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-800
            `}
            // Text input for editing the name
          />
        </div>

        <div
          className={`
            flex
            flex-col
            gap-1
          `}
          // Username field: contains label and text input
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
            // Label for the username field
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
              text-white
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-800
            `}
            // Text input for editing the username
          />
        </div>

        <div
          className={`
            flex
            flex-col
            gap-1
          `}
          // Password field: contains label and password input
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
            // Label for the new password field
          >
            New Password
          </label>
          <div className="relative">
            <input
              //type="password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`
                w-full
                p-2
                rounded
                bg-gray-800
                border
                border-gray-600
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-800
              `}
              // Input for entering a new password
            />
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div
          className={`
            flex
            justify-end
            gap-3
            pt-4
          `}
          // Button container: aligns buttons to the right
        >
          <button
            onClick={onClose}
            className={`
              px-4
              py-2
              bg-gray-600
              hover:bg-gray-700
              rounded
              font-orbitron
            `}
            // Cancel button: closes the modal
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`
              px-4
              py-2
              bg-green-500
              hover:bg-green-600
              text-white
              rounded
              font-orbitron
            `}
            // Save button: saves changes
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
