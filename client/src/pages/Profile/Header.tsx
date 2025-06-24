import React from "react";
import ProfileActions from "./ProfileActions";
import { UserInfo } from "./types/UserInfo";

interface HeaderProps {
  user: Pick<UserInfo, "username" | "online" | "email">;
  onProfileClick: () => void;
  onSearch?: (username: string) => void;
  onOpenChat: () => void;
  onOpenStats: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onProfileClick, onSearch, onOpenChat, onOpenStats }) => {
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
          from-blue-500
          via-purple-500
          to-pink-600
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
    
      >
        SUPER PONG
      </div>
      <ProfileActions
        user={user}
        onProfileClick={onProfileClick}
        onSearch={onSearch}
        onOpenChat={onOpenChat}
        onOpenStats={onOpenStats}
      />
    </div>
  );
};

export default Header;