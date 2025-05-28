import React, { useEffect } from "react";
import { OverlayWrapper } from "./OverlayWrapper";

interface EscMenuProps {
  menuItems: string[];
  menuIndex: number;
  setMenuIndex: React.Dispatch<React.SetStateAction<number>>;
  onMenuAction: (index: number) => void;
}

export function EscMenu({ menuItems, menuIndex, setMenuIndex, onMenuAction }: EscMenuProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMenuIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenuIndex((i) => (i + 1) % menuItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onMenuAction(menuIndex);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuIndex, menuItems, onMenuAction, setMenuIndex]);

  const styles: { base: string; active: string }[] = [
    {
      base:
        "border-[#0A7FC9] text-[#D3E0FB] shadow-[0_0_15px_rgba(0,255,255,0.7)] hover:bg-cyan-900 hover:bg-opacity-30",
      active: "bg-cyan-900 bg-opacity-30",
    },
    {
      base:
        "border-[#BD0E86] text-[#832264] shadow-[0_0_15px_rgba(255,29,153,0.7)] hover:bg-pink-900 hover:bg-opacity-30",
      active: "bg-pink-900 bg-opacity-30",
    },
    {
      base:
        "border-[#9010CE] text-[#743b91] shadow-[0_0_12px_rgba(192,38,211,0.7)] hover:bg-purple-900 hover:bg-opacity-30",
      active: "bg-purple-900 bg-opacity-30",
    },
    {
      base:
        "border-[#74C0FC] text-[#297db1] shadow-[0_0_15px_rgba(74,192,252,0.7)] hover:bg-blue-900 hover:bg-opacity-30",
      active: "bg-blue-900 bg-opacity-30",
    },
    {
      base:
        "border-[#74C0FC] text-[#297db1] shadow-[0_0_15px_rgba(74,192,252,0.7)] hover:bg-blue-900 hover:bg-opacity-30",
      active: "bg-blue-900 bg-opacity-30",
    },
    {
      base:
        "border-[#BD0E86] text-[#832264] shadow-[0_0_15px_rgba(255,29,153,0.7)] hover:bg-pink-900 hover:bg-opacity-30",
      active: "bg-pink-900 bg-opacity-30",
    },
  ];

  return (
    <OverlayWrapper>
      <div className="flex flex-col items-center space-y-6 text-center">
        {menuItems.map((text, idx) => {
          const style = styles[idx] ?? styles[0];
          return (
            <button
              key={idx}
              onMouseEnter={() => setMenuIndex(idx)}
              onClick={() => onMenuAction(idx)}
              className={`menu-btn w-[400px] py-4 text-lg font-bold border-2 rounded-xl bg-black bg-opacity-10 transition-transform duration-200 hover:scale-105 ${style.base} ${menuIndex === idx ? style.active + ' scale-105' : ''}`}
            >
              {text}
            </button>
          );
        })}
      </div>
    </OverlayWrapper>
  );
}

