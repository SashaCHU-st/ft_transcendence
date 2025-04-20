import React from 'react';

type Player = {
  name: string;
  online: boolean;
  totalWins: number;
  totalLosses: number;
};

const PlayerItem: React.FC<{ player: Player }> = ({ player }) => {
  return (
    // Player card container
    <li className="bg-gray-800
                   bg-opacity-70
                   p-3
                   rounded
                   shadow-sm
                   text-center
                   max-w-[180px]
                   mx-auto">

      {/* Name and online status */}
      <div className="flex
                      items-center
                      justify-center
                      gap-2
                      mb-1">
        <span className="font-semibold">{player.name}</span>
        <span className={`h-2.5 
                          w-2.5 
                          rounded-full 
                          ${player.online ? 'bg-green-400' : 'bg-gray-500'}`} />
      </div>

      {/* Win/Loss stats */}
      <div className="text-gray-400">
        Wins: {player.totalWins}  Losses: {player.totalLosses}
      </div>
    </li>
  );
};

export default PlayerItem;
