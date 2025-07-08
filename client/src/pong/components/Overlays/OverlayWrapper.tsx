import React from "react";
import { SpaceBackground } from "../SpaceBackground";

interface OverlayWrapperProps {
  children: React.ReactNode;
  /** Called when the dark background is clicked */
  onBackdropClick?: () => void;
}

/**
 * Provides a full screen backdrop with centered content.
 */
export function OverlayWrapper({ children, onBackdropClick }: OverlayWrapperProps) {
  return (
    <SpaceBackground>
      {/* transparent layer for capturing backdrop clicks */}
      {onBackdropClick && (
        <div
          className="absolute inset-0 z-0"
          onClick={onBackdropClick}
        />
      )}
      <div
        className="relative z-10 flex items-center justify-center h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </SpaceBackground>
  );
}
