import React from 'react';
import PlayerItem from './PlayerItem';

type Player = {
  name: string;
  online: boolean;
  totalWins: number;
  totalLosses: number;
};

const PlayersList: React.FC<{ players: Player[] }> = ({ players }) => {
  const sorted = [...players].sort((a, b) => Number(b.online) - Number(a.online));

  return (
	<ul className="grid
					grid-cols-1
					sm:grid-cols-2
					gap-2
					max-h-[550px]
					overflow-y-auto
					pr-1
					scrollbar-thin
					scrollbar-thumb-white/60
					scrollbar-track-transparent">
	  {sorted.map((player, idx) => (
		<PlayerItem key={idx} player={player} />
	  ))}
	</ul>
  );
};

export default PlayersList;
