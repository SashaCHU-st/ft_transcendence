import React from 'react';
//import React, { useState } from "react";
import UserHeader from './UserHeader';
import { UserInfo } from './types/UserInfo';

interface Props {
  user: UserInfo;
  stats?: any;
}

const PlayerCard: React.FC<Props> = ({ user,stats }) => {
  console.log("UUUUUUU=>", stats)
  return (
    <div
      className="
        bg-gray-900
        rounded-xl
        p-4
        shadow-md
        space-y-4
        w-full
        flex
        flex-col
        items-center
      "
    >
      <UserHeader
        user={{
          username: user.username,
          avatar:user.avatar,
          wins: user.wins,
          losses: user.losses,
          online:user.online
        }}
        stats={stats}
      />
      <div
        className="
          flex
          gap-3
          justify-center
          flex-wrap
          pt-2
        "
      >
      </div>
    </div>
  );
};

export default PlayerCard;
