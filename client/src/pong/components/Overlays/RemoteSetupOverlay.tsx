import React from "react";
import { OverlayWrapper } from "./OverlayWrapper";
import {
  OverlayCard,
  OverlayHeading,
  OverlayButton,
  OverlayText,
} from "./OverlayComponents";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface RemoteSetupOverlayProps {
  defaultMode: boolean;
  powerUps: boolean;
  ballSpeed: number;
  ballSize: number;
  winningScore: number;
  sound: boolean;
  leftColor: string;
  rightColor: string;
  onDefaultModeChange: (v: boolean) => void;
  onPowerUpsChange: (v: boolean) => void;
  onBallSpeedChange: (v: number) => void;
  onBallSizeChange: (v: number) => void;
  onWinningScoreChange: (v: number) => void;
  onLeftColorChange: (v: string) => void;
  onRightColorChange: (v: string) => void;
  onSoundChange: (v: boolean) => void;
  onConfirm: () => void;
}

export function RemoteSetupOverlay({
  defaultMode,
  powerUps,
  ballSpeed,
  ballSize,
  winningScore,
  sound,
  leftColor,
  rightColor,
  onDefaultModeChange,
  onPowerUpsChange,
  onBallSpeedChange,
  onBallSizeChange,
  onWinningScoreChange,
  onLeftColorChange,
  onRightColorChange,
  onSoundChange,
  onConfirm,
}: RemoteSetupOverlayProps) {
  useEscapeKey(onConfirm);
  return (
    <OverlayWrapper>
      <OverlayCard>
        <OverlayHeading className="text-2xl">
          You are creating a match
        </OverlayHeading>
        <OverlayText>Choose the desired settings</OverlayText>
        <OverlayText>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={defaultMode}
              onChange={(e) => onDefaultModeChange(e.target.checked)}
            />
            Default mode
          </label>
        </OverlayText>
        {!defaultMode && (
          <>
            <OverlayText>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={powerUps}
                  onChange={(e) => onPowerUpsChange(e.target.checked)}
                />
                Power-ups
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                Ball speed
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={ballSpeed}
                  onChange={(e) => onBallSpeedChange(Number(e.target.value))}
                />
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                Ball size
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={ballSize}
                  onChange={(e) => onBallSizeChange(Number(e.target.value))}
                />
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                Winning score
                <input
                  className="text-blue-800 px-2"
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  value={winningScore}
                  onChange={(e) => onWinningScoreChange(Number(e.target.value))}
                  onKeyDown={(e) => {
                    const allowed = ["ArrowUp", "ArrowDown", "Tab"];
                    if (!allowed.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                Paddle color
                <input
                  type="color"
                  value={leftColor}
                  onChange={(e) => onLeftColorChange(e.target.value)}
                />
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                Opponent color
                <input
                  type="color"
                  value={rightColor}
                  onChange={(e) => onRightColorChange(e.target.value)}
                />
              </label>
            </OverlayText>
            <OverlayText>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!sound}
                  onChange={(e) => onSoundChange(!e.target.checked)}
                />
                Mute
              </label>
            </OverlayText>
          </>
        )}
        <OverlayButton onClick={onConfirm}>Start waiting</OverlayButton>
      </OverlayCard>
    </OverlayWrapper>
  );
}
