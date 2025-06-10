import { OverlayWrapper } from "./OverlayWrapper";
import { OverlayCard, OverlayHeading, OverlayText } from "./OverlayComponents";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface RemoteErrorOverlayProps {
  onExit: () => void;
}

export function RemoteErrorOverlay({ onExit }: RemoteErrorOverlayProps) {
  useEscapeKey(onExit);
  return (
    <OverlayWrapper>
      <OverlayCard>
        <OverlayHeading className="text-2xl">
          Active game detected
        </OverlayHeading>
        <OverlayText className="text-md">
          You already have an active remote match.
        </OverlayText>
        <OverlayText className="text-md">
          Press ESC to return to profile.
        </OverlayText>
      </OverlayCard>
    </OverlayWrapper>
  );
}
