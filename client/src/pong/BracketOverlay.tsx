// client/src/pong/BracketOverlay.tsx

import React from "react";

/** Single bracket match */
export interface BracketMatch {
  p1: string; // 'Player X' or '(pred) Player X'
  p2: string;
  winner: string | null; // name of winner if match played
}

/** Round: array of matches */
export type BracketRound = BracketMatch[];

interface BracketOverlayProps {
  rounds: BracketRound[];
  onClose: () => void;
}

export default function BracketOverlay({
  rounds,
  onClose,
}: BracketOverlayProps) {
  function parsePredName(name: string) {
    const prefix = "(pred) ";
    if (name.startsWith(prefix)) {
      return {
        isPred: true,
        display: name.slice(prefix.length),
      };
    }
    return {
      isPred: false,
      display: name,
    };
  }

  /**
   * Simplified labels:
   * - if rounds.length=1 => Final
   * - if rounds.length=2 => R1=Semifinals, R2=Final
   * - if rounds.length=3 => R1=Quarterfinals, R2=Semifinals, R3=Final
   */
  function getRoundLabel(rIndex: number, totalRounds: number): string {
    if (totalRounds === 1) {
      return "Final";
    } else if (totalRounds === 2) {
      if (rIndex === 0) return "Semifinals";
      return "Final";
    } else if (totalRounds === 3) {
      if (rIndex === 0) return "Quarterfinals";
      if (rIndex === 1) return "Semifinals";
      return "Final";
    } else {
      return `Round ${rIndex + 1}`;
    }
  }

  const totalRounds = rounds.length;

  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative h-[90%] w-[90%] overflow-auto rounded border-2 border-blue-500 p-4 text-white">
        <h2 className="mb-4 text-center text-2xl text-blue-300">
          Single-Elimination Bracket
        </h2>

        <div className="flex justify-center gap-8">
          {rounds.map((round, rIndex) => {
            const label = getRoundLabel(rIndex, totalRounds);

            return (
              <div key={rIndex} className="flex flex-col items-center">
                <h3 className="mb-2 text-lg">{label}</h3>

                {round.map((match, mIndex) => {
                  const p1 = parsePredName(match.p1);
                  const p2 = parsePredName(match.p2);

                  return (
                    <div
                      key={mIndex}
                      className="mb-4 flex min-w-[130px] flex-col items-center rounded border border-gray-300 bg-gray-700 p-2"
                    >
                      <div
                        className={p1.isPred ? "italic text-orange-300" : ""}
                      >
                        {p1.display}
                      </div>
                      <div className="text-sm text-gray-300">vs</div>
                      <div
                        className={p2.isPred ? "italic text-orange-300" : ""}
                      >
                        {p2.display}
                      </div>

                      {match.winner && (
                        <div className="mt-2 text-sm text-green-300">
                          Winner: {match.winner}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded border border-white px-4 py-2 hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
