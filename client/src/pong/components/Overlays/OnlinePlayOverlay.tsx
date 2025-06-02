import React, { useEffect, useRef, useState } from "react";
import { OverlayWrapper } from "./OverlayWrapper";
import { OverlayCard, OverlayHeading } from "./OverlayComponents";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import "./OnlinePlayOverlay.css";
import TabButton from "../../../components/TabButton";
import { QuickPlayTab } from "./QuickPlayTab";
import { TournamentsTab } from "./TournamentsTab";
import { PlayersTab } from "./PlayersTab";

interface OnlinePlayOverlayProps {
  onClose: () => void;
  /** Start a random remote duel */
  onRandomMatch: () => void;
}

type Tab = "quick" | "tournaments" | "players";

export function OnlinePlayOverlay({ onClose, onRandomMatch }: OnlinePlayOverlayProps) {
  const tabValues: Tab[] = ["quick", "tournaments", "players"];
  const [tab, setTab] = useState<Tab>("quick");
  const [index, setIndex] = useState(0);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEscapeKey(onClose);

  useEffect(() => {
    btnRefs.current[index]?.focus();
  }, [index]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const total = tabValues.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => (i - 1 + total) % total);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i + 1) % total);
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) setIndex((i) => (i - 1 + total) % total);
        else setIndex((i) => (i + 1) % total);
      } else if (e.key === "Enter") {
        e.preventDefault();
        setTab(tabValues[index]);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, tabValues]);

  return (
    <OverlayWrapper>
      <OverlayCard className="w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto border-[#00a1ff] bg-gradient-to-br from-[#0a0e2a] to-black shadow-[0_0_20px_#00a1ff,0_0_40px_#00a1ff] md:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-4 text-[#0A7FC9] hover:text-pink-500 text-lg font-bold"
        >
          ✕
        </button>
        <OverlayHeading className="text-3xl mb-6 text-center text-[#e9f4fb] drop-shadow-[0_0_10px_#00a1ff]">
          ONLINE PLAY
        </OverlayHeading>

        <div
          className="flex mb-6 border-b border-[rgba(0,162,255,0.3)]"
          role="tablist"
        >
          <TabButton
            ref={(el) => (btnRefs.current[0] = el)}
            tabIndex={0}
            onFocus={() => setIndex(0)}
            onMouseEnter={() => setIndex(0)}
            value="quick"
            active={tab === "quick"}
            onSelect={setTab}
          >
            Quick play
          </TabButton>
          <TabButton
            ref={(el) => (btnRefs.current[1] = el)}
            tabIndex={0}
            onFocus={() => setIndex(1)}
            onMouseEnter={() => setIndex(1)}
            value="tournaments"
            active={tab === "tournaments"}
            onSelect={setTab}
          >
            Tournaments
          </TabButton>
          <TabButton
            ref={(el) => (btnRefs.current[2] = el)}
            tabIndex={0}
            onFocus={() => setIndex(2)}
            onMouseEnter={() => setIndex(2)}
            value="players"
            active={tab === "players"}
            onSelect={setTab}
          >
            Players
          </TabButton>
        </div>

        {tab === "quick" && <QuickPlayTab onRandomMatch={onRandomMatch} />}
        {tab === "tournaments" && <TournamentsTab />}
        {tab === "players" && <PlayersTab onClose={onClose} />}
      </OverlayCard>
    </OverlayWrapper>
  );
}
