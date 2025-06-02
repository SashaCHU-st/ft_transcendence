import React from "react";
import ProfileActions from "./ProfileActions";
import { UserInfo } from "./types/UserInfo";

interface HeaderProps {
  user: Pick<UserInfo, "username" | "online" | "email">;
  onProfileClick: () => void;
  onSearch?: (username: string) => void;
  onOpenChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick, onSearch, onOpenChat }) => {
  return (
    <div
      className="
        flex
        bg-gray-900
        bg-opacity-70
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
          from-red-200
          via-indigo-200
          to-green-200
          text-sm
          sm:text-base
          md:text-xl
          lg:text-2xl
          font-bold
          font-orbitron
          transition-transform
          duration-300
          ease-in-out
          tracking-[.10em]
        "
        style={{
          textShadow:
            "0 0 20px rgba(255, 255, 255, 0.3), 0 0 32px rgba(255, 0, 255, 0.3)",
        }}
      >
        SUPER PONG
      </div>
      <ProfileActions
        user={user}
        onProfileClick={onProfileClick}
        onSearch={onSearch}
        onOpenChat={onOpenChat}
      />
    </div>
  );
};

export default Header;