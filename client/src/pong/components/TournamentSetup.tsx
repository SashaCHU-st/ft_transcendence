import React from "react";

interface TournamentSetupProps {
  players: string[];
  onChangePlayerName: (index: number, value: string) => void;
  onAddPlayer: () => void;
  onStartTournament: () => void;
}

export function TournamentSetup({
  players,
  onChangePlayerName,
  onAddPlayer,
  onStartTournament,
}: TournamentSetupProps) {
  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
      <div className="rounded-lg border-2 border-pink-500 p-8 text-center">
        <h2 className="mb-4 text-2xl text-pink-300">Tournament setup</h2>
        <div className="flex flex-col space-y-2">
          {players.map((alias, i) => (
            <input
              key={i}
              className="w-72 rounded-md px-2 py-1 text-center text-black"
              value={alias}
              onChange={(e) => onChangePlayerName(i, e.target.value)}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onAddPlayer}
            className="rounded border-2 border-gray-400 px-4 py-2 text-gray-200 hover:bg-gray-700"
          >
            + Add player
          </button>
          <button
            onClick={onStartTournament}
            className="glow rounded-lg border-2 border-pink-400 bg-transparent px-8 py-2 text-xl text-pink-300 transition-all duration-300 hover:bg-pink-900 hover:bg-opacity-30"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
