import React from "react";

interface StartScreenProps {
  onSingleAI: () => void;
  onLocal2P: () => void;
  onTournament: () => void;
}

export function StartScreen({
  onSingleAI,
  onLocal2P,
  onTournament,
}: StartScreenProps) {
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black">
      <div className="rounded-lg border-2 border-blue-500 p-8 text-center">
        <h1 className="glow mb-4 text-4xl font-bold text-blue-400 md:text-6xl">
          SPACE PONG
        </h1>
        <p className="mb-8 text-xl text-purple-300">
          Defeat the AI in this cosmic battle!
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onSingleAI}
            className="glow rounded-lg border-2 border-green-400 bg-transparent px-8 py-3 text-xl text-green-300 transition-all duration-300 hover:bg-green-900 hover:bg-opacity-30"
          >
            SINGLE PLAYER vs AI
          </button>
          <button
            onClick={onLocal2P}
            className="glow rounded-lg border-2 border-yellow-400 bg-transparent px-8 py-3 text-xl text-yellow-300 transition-all duration-300 hover:bg-yellow-900 hover:bg-opacity-30"
          >
            LOCAL 2P
          </button>
          <button
            onClick={onTournament}
            className="glow rounded-lg border-2 border-pink-400 bg-transparent px-8 py-3 text-xl text-pink-300 transition-all duration-300 hover:bg-pink-900 hover:bg-opacity-30"
          >
            TOURNAMENT
          </button>
        </div>
      </div>
    </div>
  );
}
