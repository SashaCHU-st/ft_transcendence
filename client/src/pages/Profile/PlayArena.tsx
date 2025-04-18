import React from 'react';

interface ArenaProps {
  username: string;
  opponentImage?: string | null;
}

const Arena: React.FC<ArenaProps> = ({ username, opponentImage }) => {
  return (
    <div className="flex
                    items-center
                    justify-center
                    gap-6
                    mt-6">
      {/* Player 1 */}
      <div className="w-24
                      h-24
                      rounded-full
                      bg-gray-700
                      bg-opacity-60
                      flex
                      flex-col
                      items-center
                      justify-center
                      shadow-inner
                      text-xs
                      overflow-hidden">
        <span className="font-semibold">Player 1</span>
        <span className="text-gray-300 mt-1">{username}</span>
      </div>

      <span className="text-xl
                      font-bold
                      text-red-400">
        VS
      </span>

      {/* Player 2 */}
      <div className="w-24
                      h-24
                      rounded-full
                      bg-gray-700
                      bg-opacity-60
                      shadow-inner
                      overflow-hidden
                      flex
                      items-center
                      justify-center">
        {opponentImage ? (
          <img
            src={opponentImage}
            alt="Bot"
            className="w-full
                       h-full
                       object-cover
                       rounded-full"
          />
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
