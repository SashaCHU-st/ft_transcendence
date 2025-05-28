import { useEnterKey } from "../../hooks/useEnterKey";
import { OverlayWrapper } from "./OverlayWrapper";
import {
  OverlayCard,
  OverlayButton,
  OverlayHeading,
  OverlayText,
} from "./OverlayComponents";

interface ByeOverlayProps {
  winner: string;
  nextPair?: string;
  onContinue: () => void;
}

export function ByeOverlay({ winner, nextPair, onContinue }: ByeOverlayProps) {
  useEnterKey(onContinue);
  return (
    <OverlayWrapper>
      <OverlayCard>
        <OverlayHeading className="text-2xl">BYE Match</OverlayHeading>
        <OverlayText className="text-lg">
          Player <b className="text-[#74C0FC]">{winner}</b> gets a pass to next round!
        </OverlayText>
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
    </OverlayWrapper>
  );
}
