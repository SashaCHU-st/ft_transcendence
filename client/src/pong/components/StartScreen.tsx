import { useEffect, useRef, useState } from "react";
import { StarryBackground } from "./StarryBackground";

interface StartScreenProps {
  onSingleAI: () => void;
  onLocal2P: () => void;
  onTournament: () => void;
}

export function StartScreen({
  onSingleAI,
  onLocal2P,
  onTournament,
}: StartScreenProps) {
  const [index, setIndex] = useState(0);
  const btnRefs = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => (i + 2) % 3);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i + 1) % 3);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (index === 0) onSingleAI();
        else if (index === 1) onLocal2P();
        else onTournament();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, onLocal2P, onSingleAI, onTournament]);

  useEffect(() => {
    btnRefs[index].current?.focus();
  }, [index]);

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-80">
      <StarryBackground />
      {/* Neon window */}
      <div
        className="
          relative
          bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
          rounded-3xl
          p-10
          border-4 border-blue-400
          shadow-neon-lg
          text-center
          max-w-md w-full
        "
      >
        {/* Title */}
        <h1
          className="
            text-5xl md:text-6xl
            font-extrabold
            text-transparent
            bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500
            glow
            mb-6
          "
        >
          SPACE PONG
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-purple-300 drop-shadow-md">
          Defeat the AI in this cosmic battle!
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <button
            ref={btnRefs[0]}
            onMouseEnter={() => setIndex(0)}
            onClick={onSingleAI}
            className={`
              glow
              neon-button
              border-2 border-green-400
              rounded-xl
              px-6 py-3
              text-xl text-green-300
              bg-black bg-opacity-20
              hover:bg-green-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
              focus:outline-none
              ${index === 0 ? "bg-green-900 bg-opacity-30 scale-105" : ""}
            `}
          >
            SINGLE PLAYER vs AI
          </button>

          <button
            ref={btnRefs[1]}
            onMouseEnter={() => setIndex(1)}
            onClick={onLocal2P}
            className={`
              glow
              neon-button
              border-2 border-yellow-400
              rounded-xl
              px-6 py-3
              text-xl text-yellow-300
              bg-black bg-opacity-20
              hover:bg-yellow-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
              focus:outline-none
              ${index === 1 ? "bg-yellow-900 bg-opacity-30 scale-105" : ""}
            `}
          >
            LOCAL 2P
          </button>

          <button
            ref={btnRefs[2]}
            onMouseEnter={() => setIndex(2)}
            onClick={onTournament}
            className={`
              glow
              neon-button
              border-2 border-pink-400
              rounded-xl
              px-6 py-3
              text-xl text-pink-300
              bg-black bg-opacity-20
              hover:bg-pink-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
              focus:outline-none
              ${index === 2 ? "bg-pink-900 bg-opacity-30 scale-105" : ""}
            `}
          >
            TOURNAMENT
          </button>
        </div>
      </div>
    </div>
  );
}
