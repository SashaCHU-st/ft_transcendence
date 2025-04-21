
import React from 'react';

interface ArenaProps {
  username: string;
  opponentImage?: string | null;
  playerImage?: string | null;
  opponentName?: string;
}

const Arena: React.FC<ArenaProps> = ({
  username,
  opponentImage,
  playerImage,
  opponentName
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
				xl:w-48
				xl:h-48
				rounded-full
				bg-gray-700
				bg-opacity-60
				shadow-inner
				overflow-hidden
				flex
				items-center
        drop-shadow-[0_0_8px_white]
				justify-center">
        {playerImage ? (
          <img
            src={playerImage}
            alt="Player 1"
            className="
              w-full
              h-full
              object-cover
              rounded-full"/>
        ) : (
          <div className="flex 
		  				flex-col 
						items-center 
						text-xs">
            <span className="font-semibold">Player 1</span>
            <span className="text-gray-300 mt-1">{username}</span>
          </div>
        )}
      </div>

      {/* VS */}
      <span className="text-xl font-bold text-red-400">VS</span>

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
				xl:w-48
				xl:h-48
				rounded-full
				bg-gray-700
				bg-opacity-60
				shadow-inner
				overflow-hidden
				flex
				items-center
				justify-center
        drop-shadow-[0_0_8px_white]
				relative">
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
                text-gray-300
              ">
                {opponentName}
              </span>
            )}
          </>
        ) : (
          <div className="flex
		  				flex-col 
						items-center 
						text-xs">
            <span className="font-semibold">Player 2</span>
            <span className="text-gray-300 mt-1">Waiting...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arena;
