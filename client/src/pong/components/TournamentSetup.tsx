import { useEffect, useRef, useState } from "react";
import { StarryBackground } from "./StarryBackground";

interface TournamentSetupProps {
  players: string[];
  nameError: boolean;
  duplicateError: boolean;
  emptyError: boolean;
  onChangePlayerName: (index: number, value: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (index: number) => void;
  onStartTournament: () => void;
  onClose: () => void;
}

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

export function TournamentSetup({
  players,
  nameError,
  duplicateError,
  emptyError,
  onChangePlayerName,
  onAddPlayer,
  onRemovePlayer,
  onStartTournament,
  onClose,
}: TournamentSetupProps) {
  const [index, setIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const addRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  const allFilled = players.every((p) => p.trim().length > 0);
  const validCount =
    allFilled && players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;

  useEffect(() => {
    if (index > players.length + 1) {
      setIndex(players.length + 1);
    }
  }, [players.length, index]);

  useEffect(() => {
    const el =
      index < players.length
        ? inputRefs.current[index]
        : index === players.length
          ? addRef.current
          : startRef.current;
    el?.focus();
  }, [index, players.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const total = players.length + 2;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => (i - 1 + total) % total);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => (i + 1) % total);
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) setIndex((i) => (i - 1 + total) % total);
        else setIndex((i) => (i + 1) % total);
      } else if (e.key === "Enter") {
        if (index === players.length) {
          e.preventDefault();
          onAddPlayer();
        } else if (index === players.length + 1) {
          e.preventDefault();
          if (validCount && !nameError && !duplicateError && !emptyError)
            onStartTournament();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    index,
    players.length,
    onAddPlayer,
    onStartTournament,
    validCount,
    nameError,
    duplicateError,
    emptyError,
  ]);
  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black">
      <StarryBackground />
      {/* Neon dialog */}
      <div
        className="
          relative
          bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
          rounded-3xl
          p-10
          border-4 border-pink-400
          shadow-neon-lg
          text-center
          max-w-md w-full
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-pink-300 hover:text-red-400 text-lg font-bold"
        >
          ✕
        </button>
        {/* Title */}
        <h2
          className="
            text-2xl md:text-3xl
            font-bold
            text-transparent
            bg-clip-text bg-gradient-to-r from-pink-300 via-red-400 to-purple-500
            glow
            mb-6
          "
        >
          Tournament setup
        </h2>

        {/* Input list */}
        <div className="flex flex-col space-y-3 mb-6">
          {players.map((alias, i) => (
            <div key={i} className="relative">
              <input
                ref={(el) => (inputRefs.current[i] = el)}
                tabIndex={0}
                onFocus={() => setIndex(i)}
                onMouseEnter={() => setIndex(i)}
                value={alias}
                onChange={(e) => onChangePlayerName(i, e.target.value)}
                className="
                  w-full
                  bg-black bg-opacity-20
                  border-2 border-pink-400
                  rounded-lg
                  px-4 py-2
                  pr-8
                  text-white
                  placeholder-pink-300
                  focus:outline-none focus:ring-2 focus:ring-pink-500
                  transition
                "
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-300 hover:text-red-400"
                onClick={() => onRemovePlayer(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {nameError && (
          <p className="text-red-400 text-sm mb-1">
            Allowed characters: letters, numbers, spaces, underscores and dashes
          </p>
        )}
        {duplicateError && (
          <p className="text-red-400 text-sm mb-1">Names must be unique</p>
        )}
        {emptyError && (
          <p className="text-red-400 text-sm mb-1">Name cannot be empty</p>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-6">
          <button
            ref={addRef}
            tabIndex={0}
            onFocus={() => setIndex(players.length)}
            onMouseEnter={() => setIndex(players.length)}
            onClick={onAddPlayer}
            disabled={players.length >= MAX_PLAYERS}
            className={`
              glow
              neon-button
              border-2 border-pink-300
              rounded-xl
              px-5 py-2
              text-pink-300
              bg-transparent
              hover:bg-pink-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
              focus:outline-none
              ${index === players.length ? 'bg-pink-900 bg-opacity-30 scale-105' : ''}
              ${players.length >= MAX_PLAYERS ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            + Add player
          </button>

          <button
            ref={startRef}
            tabIndex={0}
            onFocus={() => setIndex(players.length + 1)}
            onMouseEnter={() => setIndex(players.length + 1)}
            onClick={onStartTournament}
            disabled={!validCount || nameError || duplicateError || emptyError}
            className={`
              glow
              neon-button
              border-2 border-pink-400
              rounded-xl
              px-8 py-3
              text-xl text-pink-300
              bg-transparent
              hover:bg-pink-900 hover:bg-opacity-30
              transition-transform duration-200
              hover:scale-105
              focus:outline-none
              ${index === players.length + 1 ? 'bg-pink-900 bg-opacity-30 scale-105' : ''}
              ${
                !validCount || nameError || duplicateError || emptyError
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }
            `}
          >
            START
          </button>
        </div>
        {!validCount && (
          <p className="mt-4 text-pink-200 text-sm">
            Enter between {MIN_PLAYERS} and {MAX_PLAYERS} players
          </p>
        )}
      </div>
    </div>
  );
}
