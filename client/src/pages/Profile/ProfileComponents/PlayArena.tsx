
import React from 'react';
import { UserInfo } from '../../../types/UserInfo';

interface ArenaProps {
  user: Pick<UserInfo, "username" | "avatar">;
  opponentImage?: string | null;
  opponentName?: string;
  isRandomizing?: boolean;
}

const Arena: React.FC<ArenaProps> = ({
  user,
  opponentImage,
  opponentName,
  isRandomizing,
}) => {
  return (
    <div className="
      flex
      flex-col
      items-center
      justify-center
      gap-4
      mt-8
      px-4
      sm:flex-row
      sm:gap-10
      sm:mt-10">
      {/* Player 1 */}
      <div className="
        h-32
        w-32
        sm:w-36
        sm:h-36
        md:w-40
        md:h-40
        lg:w-44
        lg:h-44
        xl:w-52
        xl:h-52
        2xl:w-72
        2xl:h-72
        rounded-full
        bg-gray-700
        bg-opacity-60
       
        overflow-hidden
        flex
        items-center
        shadow-[0_0_15px_#c084fc]
        drop-shadow-[0_0_8px_white]
        justify-center">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Player 1"
            className="
              w-full
              h-full
              object-cover
              rounded-full"/>
        ) : (
          <div className="flex flex-col items-center text-xs">
            <span className="font-semibold">Player 1</span>
            <span className="text-gray-300 mt-1">{user.username}</span>
          </div>
        )}
      </div>

      {/* VS */}
      <span className="text-xl font-bold text-emerald-200">VS</span>

      {/* Player 2 */}
      <div className="
        w-32
        h-32
        sm:w-36
        sm:h-36
        md:w-40
        md:h-40
        lg:w-44
        lg:h-44
        xl:w-52
        xl:h-52
        2xl:w-72
        2xl:h-72
        rounded-full
        bg-opacity-60
        overflow-hidden
        flex
        items-center
        justify-center
        drop-shadow-[0_0_8px_white]
        shadow-[0_0_15px_#60a5fa]
        relative
        ${isRandomizing ? 'animate-pulse' : ''}">
        {opponentImage ? (
          <>
            <img
              src={opponentImage}
              alt="Bot"
              className="
                w-full
                h-full
                object-cover
                rounded-full"/>
            {opponentName && (
              <span className="
                absolute
                bottom-[-1.5rem]
                text-xs
                font-medium
                text-blue-400
              ">
                {opponentName}
              </span>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-xs">
            <i className="fa-solid fa-question text-6xl xl:text-7xl text-blue-300"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arena;