import React from "react";
import { OverlayWrapper } from "./OverlayWrapper";
import { OverlayCard, OverlayHeading, OverlayText } from "./OverlayComponents";

interface RemoteStatusOverlayProps {
  waiting: boolean;
  countdown: number | null;
}

export function RemoteStatusOverlay({ waiting, countdown }: RemoteStatusOverlayProps) {
  let heading: React.ReactNode = null;
  if (waiting) {
    heading = (
      <OverlayHeading className="text-2xl">Waiting for opponent...</OverlayHeading>
    );
  } else if (countdown !== null) {
    heading = (
      <OverlayHeading className="text-2xl">Game starts in {countdown}...</OverlayHeading>
    );
  }

  return heading ? (
    <OverlayWrapper>
      <OverlayCard>
        {heading}
        <OverlayText className="text-md">
          Use ↑ and ↓ to move. ESC to exit.
        </OverlayText>
      </OverlayCard>
    </OverlayWrapper>
  ) : null;
}
