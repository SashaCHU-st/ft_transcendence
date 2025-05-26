import React from "react";
import UserHeader from "./UserHeader";
import { UserInfo } from "./types/UserInfo";

interface Props {
  user: UserInfo;
}

const PlayerCard: React.FC<Props> = ({ user }) => {
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
          avatar: user.avatar,
          wins: user.wins,
          losses: user.losses,
          history: user.history,
        }}
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
        {user.onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              user.onAdd!();
            }}
            className="
              px-4
              py-2
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
                💚
            </span>
          </button>
        )}
        {user.onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              user.onRemove!();
            }}
            className="
              px-4
              py-2
              rounded-md
              text-sm
              font-semibold
              text-red-400
              border-2
              border-red-500
              hover:bg-red-600
              hover:text-white
              transition
              duration-300
              shadow-[0_0_12px_#ff4d4d]
              hover:shadow-[0_0_18px_#ff4d4d]
            "
          >
            Remove
          </button>
        )}
        {user.onChallenge && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              user.onChallenge!();
            }}
            className="
              px-4
              py-2
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
            Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
