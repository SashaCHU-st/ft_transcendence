import React from 'react';
import Avatar from './Avatar';

interface UserHeaderProps {
  username: string;
  avatar: string;
  wins: number;
  losses: number;
  className?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  avatar,
  wins,
  losses,
  className
}) => {
  return (
    <div className={`flex flex-col items-center text-center gap-3 ${className ?? ''}`}>
      <Avatar
        src={avatar}
        username={username}
        className="
          w-32
          h-32
          sm:w-40
          sm:h-40
          md:w-44
          md:h-44
          xl:w-48
          xl:h-48
        "
      />
      <h1 className="text-xl sm:text-2xl font-bold">{username}</h1>
      <p className="text-gray-300 text-sm sm:text-base">
        Wins: {wins} | Losses: {losses}
      </p>
    </div>
  );
};

export default UserHeader;
