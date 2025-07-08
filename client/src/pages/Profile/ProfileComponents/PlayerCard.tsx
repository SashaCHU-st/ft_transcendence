import React from 'react';
//import React, { useState } from "react";
import UserHeader from './UserHeader';
import { UserInfo } from '../../../types/UserInfo';

interface Props {
  user: UserInfo;
  stats?: any;
}

const PlayerCard: React.FC<Props> = ({ user,stats }) => {
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
          justify-center
          flex-wrap
          pt-2
        "
      >
         <div className="w-32">
            {typeof user.onAdd === 'function' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  user.onAdd?.();
                }}
                className="
                  px-5
                  py-1
                  rounded-md
                  text-sm
                  font-semibold
                  text-green-400
                  border-2
                  border-green-500
                  hover:bg-green-800
                  hover:text-white
                  transition
                  duration-300
                  shadow-[0_0_12px_#00ff00]
                  hover:shadow-[0_0_18px_#00ff00]
                "
              >
                <span className="text-xl text-green-300 drop-shadow-[0_0_3px_#00ff00]">
                  <i className="fa-solid text-2xl fa-heart"></i>
                </span>
              </button>
            ) : typeof user.onRemove === 'function' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  user.onRemove?.()
                }}
                className="
                  px-5
                  py-1
                  rounded-md
                  text-sm
                  font-semibold
                  text-red-400
                  border-2
                  border-red-500
                  hover:bg-red-800
                  hover:text-white
                  transition
                  duration-300
                  shadow-[0_0_12px_#ff0000]
                  hover:shadow-[0_0_18px_#ff0000]
                "
              >
                <span className="text-xl text-red-300 drop-shadow-[0_0_3px_#ff0000]">
                  <i className="fa-solid text-2xl fa-heart-crack"></i>
                </span>
              </button>
            ) : null}
          </div>
              <div className="w-16">
                {user.onChallenge && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      user.onChallenge!();
                    }}
                    className="
                          px-4
                          py-1
                          rounded-md
                          text-sm
                          font-semibold
                          text-cyan-300
                          border-2
                          border-cyan-400
                          hover:bg-cyan-500
                          hover:text-black
                          transition
                          duration-300
                          shadow-[0_0_12px_#00ffff]
                          hover:shadow-[0_0_18px_#00ffff]
                "
                  >
                    <i className="fa-solid fa-gamepad text-2xl fa-1.5x"></i>
                  </button>
                )}
              </div>
      </div>
    </div>
  );
};

export default PlayerCard;
