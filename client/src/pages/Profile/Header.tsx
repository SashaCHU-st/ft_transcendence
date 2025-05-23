import React from "react";
import ProfileActions from "./ProfileActions";
import { UserInfo } from "./types/UserInfo";

interface HeaderProps {
  user: Pick<UserInfo, "username" | "online" | "email">;
  onProfileClick: () => void;
  onSearch?: (username: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick, onSearch }) => {
  return (
    <div
      className="
        flex
        justify-between
        items-center
        px-6
        py-4
      "
    >
      <div
        className="
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-red-400
          via-indigo-300
          to-green-300
          text-2xl
          sm:text-3xl
          font-bold
          transition-transform
          duration-300
          ease-in-out
          hover:scale-110
        "
        style={{
          textShadow:
            "0 0 20px rgba(255, 255, 255, 0.3), 0 0 32px rgba(255, 0, 255, 0.3)",
        }}
      >
        NEON PONG
      </div>
      <ProfileActions user={user} onProfileClick={onProfileClick} onSearch={onSearch} />
    </div>
  );
};

export default Header;