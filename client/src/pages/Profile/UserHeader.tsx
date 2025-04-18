import React from 'react';
import Avatar from './Avatar';

interface UserHeaderProps {
  username: string;
  avatar: string;
  wins: number;
  losses: number;
}

const UserHeader = ({ username, avatar, wins, losses }: UserHeaderProps) => {
  return (
    <div className="flex
                    items-center
                    gap-6">
      <Avatar
        src={avatar}
        username={username}
      />

      <div className="text-left">
        <h1 className="text-4xl
                       font-bold">
          {username}
        </h1>

        <p className="text-gray-400
                      text-lg">
          Wins: {wins} | Losses: {losses}
        </p>
      </div>
    </div>
  );
};

export default UserHeader;
