
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
  const [avatar, setAvatar] = useState(userData.avatar);
  const [username, setUsername] = useState(userData.username);
  const [name, setName] = useState(userData.name);
  const [password, setPassword] = useState("");

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB max

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too big! Max size: 10 MB.");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only PNG or JPEG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    console.log("Saving data:", { avatar, username, name, password });
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
    >
      {/* Modal container */}
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
      >
        {/* Modal title */}
        <h2
          className={`
            text-2xl
            font-bold
            text-center
          `}
        >
          Edit Profile
        </h2>

        {/* Avatar preview and upload */}
        <div
          className={`
            flex
            flex-col
            items-center
            gap-2
          `}
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
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className={`
              text-sm
              text-gray-300
            `}
          />
        </div>

        {/* Name input field */}
        <div
          className={`
            flex
            flex-col
            gap-1
          `}
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
          >
            Name
          </label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`
              w-full
              p-2
              rounded
              bg-gray-800
              border
              border-gray-600
            `}
          />
        </div>

        {/* Username input field */}
        <div
          className={`
            flex
            flex-col
            gap-1
          `}
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
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
            `}
          />
        </div>

        {/* Password input field */}
        <div
          className={`
            flex
            flex-col
            gap-1
          `}
        >
          <label
            className={`
              text-sm
              text-gray-400
            `}
          >
            New Password
          </label>
          <input
            type="password"
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
            `}
          />
        </div>

        {/* Action buttons */}
        <div
          className={`
            flex
            justify-end
            gap-3
            pt-4
          `}
        >
          <button
            onClick={onClose}
            className={`
              px-4
              py-2
              bg-gray-600
              hover:bg-gray-700
              rounded
            `}
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
            `}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;