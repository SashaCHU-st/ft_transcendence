import { useEffect, useRef, useState } from "react";
import { SpaceBackground } from "./SpaceBackground";

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
const MAX_NAME_LENGTH = 10;

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

  const lengthLimitReached = players.some((p) => p.length >= MAX_NAME_LENGTH);

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
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
    <SpaceBackground>
      {/* interactive panel (inputs & buttons) with higher z-index */}
      <SpaceBackground>
        {/* interactive panel (inputs & buttons) with higher z-index */}
        <div
          className="
          relative
          z-10
          pointer-events-auto
          rounded-lg
          border-2
          border-[#0A7FC9]
          bg-black
          bg-opacity-30
          p-12
          z-10
          pointer-events-auto
          rounded-lg
          border-2
          border-[#0A7FC9]
          bg-black
          bg-opacity-30
          p-12
          text-center
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
          w-[80%]
          max-w-[800px]
          shadow-[0_0_15px_rgba(0,255,255,0.7)]
          w-[80%]
          max-w-[800px]
        "
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-[#0A7FC9] hover:text-red-400 text-lg font-bold"
          >
            ✕
          </button>
          {/* Title */}
          <h2
            className="
            mb-6
            text-4xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
            text-4xl
            font-extrabold
            text-[#D3E0FB]
            drop-shadow-[0_0_10px_rgba(211,224,251,0.8)]
          "
          >
            Tournament setup
          </h2>

          {/* Input list */}
          <div className="flex flex-col space-y-4 items-center">
            {players.map((alias, i) => (
              <div key={i} className="relative w-96">
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  tabIndex={0}
                  onFocus={() => setIndex(i)}
                  onMouseEnter={() => setIndex(i)}
                  value={alias}
                  onChange={(e) => onChangePlayerName(i, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  maxLength={MAX_NAME_LENGTH}
                  className="
                  w-full
                  rounded-xl
                  border-2
                  border-[#297db1]
                  bg-black
                  bg-opacity-50
                  px-4
                  py-2
                  pr-8
                  text-center
                  text-[#D3E0FB]
                  shadow-[0_0_8px_rgba(0,255,255,0.5)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0A7FC9]
                  transition
                "
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#297db1] hover:text-red-400"
                  onClick={() => onRemovePlayer(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {nameError && (
            <p className="text-red-400 text-sm mb-1">
              Allowed characters: letters, numbers, spaces, underscores and
              dashes
            </p>
          )}
          {duplicateError && (
            <p className="text-red-400 text-sm mb-1">Names must be unique</p>
          )}
          {emptyError && (
            <p className="text-red-400 text-sm mb-1">Name cannot be empty</p>
          )}
          {lengthLimitReached && (
            <p className="text-yellow-300 text-sm mb-1">
              Maximum of {MAX_NAME_LENGTH} characters reached
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              ref={addRef}
              tabIndex={0}
              onFocus={() => setIndex(players.length)}
              onMouseEnter={() => setIndex(players.length)}
              onClick={onAddPlayer}
              disabled={players.length >= MAX_PLAYERS}
              className="
              rounded-xl
              border-2
              border-[#9010CE]
              bg-black
              bg-opacity-30
              px-6
              py-3
              text-xl
              font-semibold
              text-[#743b91]
              shadow-[0_0_12px_rgba(192,38,211,0.7)]
              border-2
              border-[#9010CE]
              bg-black
              bg-opacity-30
              px-6
              py-3
              text-xl
              font-semibold
              text-[#743b91]
              shadow-[0_0_12px_rgba(192,38,211,0.7)]
              hover:scale-105
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            >
              + Add player
            </button>
            <button
              ref={startRef}
              tabIndex={0}
              onFocus={() => setIndex(players.length + 1)}
              onMouseEnter={() => setIndex(players.length + 1)}
              onClick={onStartTournament}
              disabled={
                !validCount || nameError || duplicateError || emptyError
              }
              className="
              rounded-xl
              border-2
              border-[#BD0E86]
              bg-black
              bg-opacity-30
              px-10
              py-3
              text-2xl
              font-semibold
              text-[#832264]
              shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
              border-2
              border-[#BD0E86]
              bg-black
              bg-opacity-30
              px-10
              py-3
              text-2xl
              font-semibold
              text-[#832264]
              shadow-[0_0_15px_rgba(255,29,153,0.7),0_0_24px_rgba(255,29,153,0.4)]
              hover:scale-105
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
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
      </SpaceBackground>
    </SpaceBackground>
  );
}
