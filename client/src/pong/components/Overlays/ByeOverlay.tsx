import { useEnterKey } from "../../hooks/useEnterKey";
import { SpaceBackground } from "../SpaceBackground";
import { OverlayCard, OverlayButton } from "./OverlayComponents";

interface ByeOverlayProps {
  winner: string;
  nextPair?: string;
  onContinue: () => void;
}

export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
  useEnterKey(onContinue);
  return (
    <SpaceBackground>
      <OverlayCard>
        <h2
          className="
            mb-4
            text-2xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
        >
          BYE Match
        </h2>
        <p
          className="
            mb-4
            text-lg
            text-[#D3E0FB]
          "
        >
          Player <b className="text-[#74C0FC]">{winner}</b> gets a pass to next round!
        </p>
        {nextPair && (
          <p
            className="
              mb-4
              text-md
              text-[#743b91]
              drop-shadow-[0_0_5px_rgba(147,51,234,0.6)]
            "
          >
            Next match: {nextPair}
          </p>
        )}
        <OverlayButton onClick={onContinue}>Continue</OverlayButton>
      </OverlayCard>
    </SpaceBackground>
  );
}
