import React from "react";
import { SpaceBackground } from "../SpaceBackground";

interface OverlayWrapperProps {
  children: React.ReactNode;
}

/**
 * Provides a full screen backdrop with centered content.
 */
export function OverlayWrapper({ children }: OverlayWrapperProps) {
  return (
    <SpaceBackground>
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        {children}
      </div>
    </SpaceBackground>
  );
}
