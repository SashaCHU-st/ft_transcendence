import { useEffect, useRef, useState } from "react";
import { SpaceBackground } from "./SpaceBackground";
// icons replaced with Font Awesome classes

interface StartScreenProps {
  onSingleAI: () => void;
  onLocal2P: () => void;
  onTournament: () => void;
  onRemoteDuel: () => void;
  onClose: () => void;
}

export function StartScreen({
  onSingleAI,
  onLocal2P,
  onTournament,
  onRemoteDuel,
  onClose,
}: StartScreenProps) {
  const [index, setIndex] = useState(0);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    btnRefs.current[index]?.focus();
  }, [index]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const total = 4;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i - 1 + total) % total);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i + 1) % total);
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) setIndex((i) => (i - 1 + total) % total);
        else setIndex((i) => (i + 1) % total);
      } else if (e.key === "Enter") {
        e.preventDefault();
        [onSingleAI, onLocal2P, onTournament, onRemoteDuel][index]();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, onClose, onSingleAI, onLocal2P, onTournament, onRemoteDuel]);
  return (
    <SpaceBackground>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-[#0A7FC9] hover:text-red-400 text-lg font-bold"
      >
        ✕
      </button>
      {/* top-left corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 -translate-x-0 md:top-10 md:left-1/4 md:w-12 md:h-12 md:-translate-x-16 lg:top-20 lg:w-16 lg:h-16 lg:-translate-x-20">
        <div
          className="
            absolute top-0 left-0
            w-8 md:w-12 lg:w-16 h-1
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute top-0 left-0
            w-1 h-8 md:h-12 lg:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* top-right corner brackets */}
      <div className="absolute top-4 right-4 w-8 h-8 translate-x-0 md:top-10 md:right-1/4 md:w-12 md:h-12 md:translate-x-16 lg:top-20 lg:w-16 lg:h-16 lg:translate-x-20">
        <div
          className="
            absolute top-0 right-0
            w-8 md:w-12 lg:w-16 h-1
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute top-0 right-0
            w-1 h-8 md:h-12 lg:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* bottom-left corner brackets */}
      <div className="absolute bottom-4 left-4 w-8 h-8 -translate-x-0 md:bottom-10 md:left-1/4 md:w-12 md:h-12 md:-translate-x-16 lg:bottom-20 lg:w-16 lg:h-16 lg:-translate-x-20">
        <div
          className="
            absolute bottom-0 left-0
            w-8 md:w-12 lg:w-16 h-1
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute bottom-0 left-0
            w-1 h-8 md:h-12 lg:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* bottom-right corner brackets */}
      <div className="absolute bottom-4 right-4 w-8 h-8 translate-x-0 md:bottom-10 md:right-1/4 md:w-12 md:h-12 md:translate-x-16 lg:bottom-20 lg:w-16 lg:h-16 lg:translate-x-20">
        <div
          className="
            absolute bottom-0 right-0
            w-8 md:w-12 lg:w-16 h-1
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
        <div
          className="
            absolute bottom-0 right-0
            w-1 h-8 md:h-12 lg:h-16
            bg-[#0A7FC9]
            shadow-[0_0_12px_rgba(10,127,201,0.7),0_0_24px_rgba(10,127,201,0.4)]
          "
        />
      </div>

      {/* main title */}
      <h1
        className="
          mt-16
          absolute top-12 left-1/2 -translate-x-1/2
          text-center
          text-5xl sm:text-7xl md:text-8xl
          font-extrabold
          text-[#D3E0FB]
          drop-shadow-[0_0_20px_rgba(211,224,251,1)]
          px-4
        "
      >
        SUPER PONG
      </h1>

      {/* action buttons arranged vertically */}
      <div className="absolute inset-0 flex items-center justify-center mt-20 px-4">
        <div className="flex flex-col gap-4 sm:gap-8 w-full max-w-md">
          {/* Play vs AI */}
          <button
            ref={(el) => (btnRefs.current[0] = el)}
            tabIndex={0}
            onFocus={() => setIndex(0)}
            onMouseEnter={() => setIndex(0)}
            onClick={onSingleAI}
            className={`
              w-full flex items-center justify-center gap-4 whitespace-nowrap
              rounded-xl border-2 border-[#0A7FC9]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-xl sm:text-2xl font-semibold text-[#88c0e3]
              shadow-[0_0_15px_rgba(0,255,255,0.7),0_0_24px_rgba(0,255,255,0.4)]
              hover:scale-105 transition focus:outline-none
              ${index === 0 ? "scale-105 ring-2 ring-cyan-300" : ""}
            `}
          >
            <i className="fa-solid fa-robot text-xl sm:text-2xl" />
            AI VS PLAYER
          </button>

          {/* Local Duel */}
          <button
            ref={(el) => (btnRefs.current[1] = el)}
            tabIndex={0}
            onFocus={() => setIndex(1)}
            onMouseEnter={() => setIndex(1)}
            onClick={onLocal2P}
            className={`
              w-full flex items-center justify-center gap-4 whitespace-nowrap
              rounded-xl border-2 border-[#9010CE]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-xl sm:text-2xl font-semibold text-[#bc92d2]
              shadow-[0_0_15px_rgba(192,38,211,0.7),0_0_24px_rgba(192,38,211,0.4)]
              hover:scale-105 transition focus:outline-none
              ${index === 1 ? "scale-105 ring-2 ring-purple-300" : ""}
            `}
          >
            <i className="fa-solid fa-users text-xl sm:text-2xl" />
            LOCAL DUEL
          </button>

          {/* Local Tournament */}
          <button
            ref={(el) => (btnRefs.current[2] = el)}
            tabIndex={0}
            onFocus={() => setIndex(2)}
            onMouseEnter={() => setIndex(2)}
            onClick={onTournament}
            className={`
              w-full flex items-center justify-center gap-4 whitespace-nowrap
              rounded-xl border-2 border-[#BD0E86]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-xl sm:text-2xl font-semibold text-[#db76bb]
              shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
              hover:scale-105 transition focus:outline-none
              ${index === 2 ? "scale-105 ring-2 ring-pink-300" : ""}
            `}
          >
            <i className="fa-solid fa-trophy text-xl sm:text-2xl" />
            LOCAL TOURNAMENT
          </button>

          {/* Remote Duel */}
          <button
            ref={(el) => (btnRefs.current[3] = el)}
            tabIndex={0}
            onFocus={() => setIndex(3)}
            onMouseEnter={() => setIndex(3)}
            onClick={onRemoteDuel}
            className={`
              w-full flex items-center justify-center gap-4 whitespace-nowrap
              rounded-xl border-2 border-[#0AC9B7]
              bg-black bg-opacity-30
              px-6 py-4 sm:px-10 sm:py-6
              text-xl sm:text-2xl font-semibold text-[#84ddd3]
              shadow-[0_0_15px_rgba(10,201,183,0.7),0_0_24px_rgba(10,201,183,0.4)]
              hover:scale-105 transition focus:outline-none
              ${index === 3 ? "scale-105 ring-2 ring-teal-300" : ""}
            `}
          >
            <i className="fa-solid fa-globe text-xl sm:text-2xl" />
            PLAY ONLINE
          </button>
        </div>
      </div>
      <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-sm text-[#6b94c6]">
        Use ↑/↓ or Tab to select, Enter to confirm, Esc to close
      </p>
    </SpaceBackground>
  );
}
