import { useMemo } from "react";
import { OverlayWrapper } from "./components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayButton,
} from "./components/Overlays/OverlayComponents";
import { useEnterKey } from "./hooks/useEnterKey";

/**
 * Centralised style definitions for easier tuning
 */
const textStyles = {
  playerName: {
    base: "text-[#D3E0FB] text-[20px] md:text-[18px] text-shadow-[0_0_4px_rgba(211,224,251,0.6)]",
    predicted:
      "italic text-orange-300 text-[20px] md:text-[18px] text-shadow-[0_0_4px_rgba(255,147,0,0.6)]",
  },
  vs: "text-[16px] md:text-[18px] text-[#743b91] text-shadow-[0_0_4px_rgba(147,51,234,0.6)]",
  winner:
    "mt-3 text-[16px] md:text-[18px] text-[#74C0FC] text-shadow-[0_0_4px_rgba(74,222,128,0.6)]",
  roundLabel:
    "mb-2 text-lg font-semibold text-[#D3E0FB] drop-shadow-[0_0_5px_rgba(211,224,251,0.6)]",
  heading:
    "mb-4 text-center text-2xl font-extrabold text-[#D3E0FB] drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]",
};

export interface PlayerSlot {
  name: string;
  isPredicted?: boolean;
}

/** Single bracket match */
export interface BracketMatch {
  p1: PlayerSlot;
  p2: PlayerSlot;
  winner: PlayerSlot | null; // name of winner if match played
  /** reference to the match in the next round */
  nextMatch?: BracketMatch;
  /** which slot of the next match this winner fills */
  nextSlot?: "p1" | "p2";
}

/** Round: array of matches */
export type BracketRound = BracketMatch[];

interface BracketOverlayProps {
  rounds: BracketRound[];
  onClose: () => void;
}

function PlayerName({ name, isPredicted }: PlayerSlot) {
  const classes = isPredicted
    ? textStyles.playerName.predicted
    : textStyles.playerName.base;
  return <div className={classes}>{name || "TBD"}</div>;
}

export default function BracketOverlay({
  rounds,
  onClose,
}: BracketOverlayProps) {
  const currentMatch = useMemo(() => {
    for (let r = 0; r < rounds.length; r++) {
      for (let m = 0; m < rounds[r].length; m++) {
        const match = rounds[r][m];
        if (
          !match.winner &&
          match.p1.name !== "BYE" &&
          match.p2.name !== "BYE"
        ) {
          return { rIndex: r, mIndex: m };
        }
      }
    }
    return null;
  }, [rounds]);

  function getRoundLabel(rIndex: number, totalRounds: number): string {
    const roundStages: Record<number, string[]> = {
      1: ["Final"],
      2: ["Semifinals", "Final"],
      3: ["Quarterfinals", "Semifinals", "Final"],
    };

    const stages = roundStages[totalRounds];

    if (stages && rIndex < stages.length) {
      return stages[rIndex];
    }

    return `Round ${rIndex + 1}`;
  }

  const totalRounds = rounds.length;
  useEnterKey(onClose);

  const matchStyles: Record<string, string> = {
    Quarterfinals: `
                  border-2 border-[#BD0E86]
                  bg-black bg-opacity-30
                  shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
                  hover:scale-105 transition`,
    Semifinals: `
                  border-2 border-[#9010CE]
                  bg-black bg-opacity-30
                  shadow-[0_0_12px_rgba(192,38,211,0.7)]
                  hover:scale-105 transition`,
    Final: `
                  border-2 border-[#0A7FC9]
                  bg-black bg-opacity-30
                  shadow-[0_0_15px_rgba(0,255,255,0.7),0_0_24px_rgba(0,255,255,0.4)]
                  hover:scale-105 transition`,
  };

  const highlightStyles: Record<string, string> = {
    Quarterfinals: `
                            border-[#FF4CB5] border-4
                            ring-4 ring-[#FF4CB5]
                            shadow-[0_0_20px_rgba(255,76,181,0.9),0_0_32px_rgba(255,76,181,0.6)]`,
    Semifinals: `
                            border-[#B94CFF] border-4
                            ring-4 ring-[#B94CFF]
                            shadow-[0_0_20px_rgba(185,76,255,0.9),0_0_32px_rgba(185,76,255,0.6)]`,
    Final: `
                            border-[#40BFFF] border-4
                            ring-4 ring-[#40BFFF]
                            shadow-[0_0_20px_rgba(64,191,255,0.9),0_0_32px_rgba(64,191,255,0.6)]`,
  };

  return (
    <OverlayWrapper>
      <OverlayCard className="relative h-[90%] w-[90%] overflow-auto flex flex-col items-center">
        <h2 className={textStyles.heading}>COSMIC TOURNAMENT</h2>

        <div
          className="
            flex flex-col md:flex-row
            justify-center items-center
            gap-8 md:gap-20
            w-full h-full"
        >
          {rounds.map((round, rIndex) => {
            const label = getRoundLabel(rIndex, totalRounds);
            const matchStyle = matchStyles[label] ?? matchStyles.Final;

            return (
              <div
                key={rIndex}
                className="
                  flex flex-col items-center justify-center
                  w-full sm:w-[150px]"
              >
                <h3 className={textStyles.roundLabel}>{label}</h3>

                <div className="flex flex-col items-center justify-center gap-10">
                  {round.map((match, mIndex) => {
                    const { p1, p2 } = match;
                    const isCurrent =
                      currentMatch &&
                      currentMatch.rIndex === rIndex &&
                      currentMatch.mIndex === mIndex;

                    const highlightStyle =
                      highlightStyles[label] ?? highlightStyles.Final;

                    return (
                      <div
                        key={mIndex}
                        className={`
                          flex flex-col items-center
                          w-full sm:w-[198px]
                          rounded-xl p-4
                          ${matchStyle}
                          ${isCurrent ? highlightStyle : ""}
                        `}
                      >
                        <PlayerName {...p1} />
                        <div className={textStyles.vs}>vs</div>
                        <PlayerName {...p2} />
                        {match.winner && (
                          <div className={textStyles.winner}>
                            Winner: {match.winner.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <OverlayButton
          color="blue"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          Close
        </OverlayButton>
      </OverlayCard>
    </OverlayWrapper>
  );
}
