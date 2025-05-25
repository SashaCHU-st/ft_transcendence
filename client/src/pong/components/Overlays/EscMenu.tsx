import React, { useEffect } from "react";
import { StarryBackground } from "../StarryBackground";

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

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70">
      <StarryBackground />
      <div className="flex flex-col items-center space-y-6 text-center">
        {menuItems.map((text, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setMenuIndex(idx)}
            onClick={() => onMenuAction(idx)}
            className={`menu-btn w-64 px-6 py-3 text-lg font-bold text-cyan-300 text-shadow-[0_0_4px_rgba(0,255,255,0.6)] border-2 border-cyan-400 rounded-xl bg-black-600 bg-opacity-80 shadow-[0_0_10px_rgba(0,255,255,0.6)] hover:bg-cyan-800 hover:bg-opacity-35 transition-transform duration-200 hover:scale-105 ${menuIndex === idx ? 'bg-cyan-800 bg-opacity-35 scale-105' : ''}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
