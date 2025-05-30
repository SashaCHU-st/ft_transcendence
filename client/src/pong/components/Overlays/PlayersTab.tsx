import React, { useState, useMemo } from "react";
import { OverlayButton } from "./OverlayComponents";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { usePlayers } from "../../hooks/usePlayers";

interface PlayersTabProps {
  onClose: () => void;
}

const SEARCH_INVALID_REGEX = /[^a-zA-Z0-9 _-]/g;
const MAX_SEARCH_LENGTH = 20;

export function PlayersTab({ onClose }: PlayersTabProps) {
  const { players, loading, error } = usePlayers();
  const [search, setSearch] = useState("");
  const [tooLong, setTooLong] = useState(false);

  useEscapeKey(onClose);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(SEARCH_INVALID_REGEX, "");
    if (value.length > MAX_SEARCH_LENGTH) {
      value = value.slice(0, MAX_SEARCH_LENGTH);
      setTooLong(true);
    } else {
      setTooLong(false);
    }
    setSearch(value);
  }

  const normalized = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) {
      return players;
    }

    const priority = (name: string) => {
      if (name === normalized) return 0;
      if (name.startsWith(normalized)) return 1;
      return 2;
    };

    return players
      .filter((p) => p.username.toLowerCase().includes(normalized))
      .sort((a, b) => {
        const aName = a.username.toLowerCase();
        const bName = b.username.toLowerCase();
        const diff = priority(aName) - priority(bName);
        return diff !== 0 ? diff : aName.localeCompare(bName);
      });
  }, [players, normalized]);

  return (
    <div>
      <h3 className="text-xl mb-4 text-center text-cyan-400">ONLINE PLAYERS</h3>
      <input
        type="text"
        placeholder="Search for players..."
        className="search-bar"
        value={search}
        onChange={handleSearchChange}
        maxLength={MAX_SEARCH_LENGTH}
      />
      {tooLong && (
        <p className="text-yellow-300 text-sm mb-1 text-center">
          Query too long (max {MAX_SEARCH_LENGTH} characters)
        </p>
      )}
      {loading && <p className="text-center text-cyan-300">Loading players...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="player-list">
          {filtered.length === 0 && search.trim() !== "" ? (
            <li className="text-center text-red-500">Nobody online with that name</li>
          ) : (
            filtered.map((p) => {
              const games = p.wins + p.losses;
              const winRate = games ? Math.round((p.wins / games) * 100) : 0;
              return (
                <li key={p.username} className="player-item">
                  <div>
                    <span className="player-name">{p.username}</span>
                    <span className="player-rating ml-2">
                      {games} games • {winRate}% win rate
                    </span>
                  </div>
                  <OverlayButton color="green" className="mt-0 px-3 py-1 text-xs">
                    CHALLENGE
                  </OverlayButton>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
