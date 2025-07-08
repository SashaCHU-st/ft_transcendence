import React from "react";

interface GoalBannerProps {
  visible: boolean;
}

export function GoalBanner({ visible }: GoalBannerProps) {
  if (!visible) return null;
  return (
    <div className="absolute left-0 right-0 top-24 flex justify-center pointer-events-none z-20">
      <div className="goal-banner text-6xl font-bold text-yellow-300 drop-shadow-[0_0_4px_rgba(255,255,0,0.8)]">
        Goal!
      </div>
    </div>
  );
}
