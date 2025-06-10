import { useState, useEffect } from "react";

export interface PlayerInfo {
  username: string;
  wins: number;
  losses: number;
}

export function usePlayers() {
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://localhost:3000/users?t=${Date.now()}`);
        const data = await res.json();
        interface RawUser {
          online: boolean;
          username?: string;
          name?: string;
          wins?: number;
          losses?: number;
        }
        const online: PlayerInfo[] = (data.users || ([] as RawUser[]))
          .filter((u: RawUser) => u.online)
          .map((u: RawUser) => ({
            username: u.username || u.name || "",
            wins: u.wins || 0,
            losses: u.losses || 0,
          }));
        if (isMounted) {
          setPlayers(online);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch players");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchPlayers();
    return () => {
      isMounted = false;
    };
  }, []);

  return { players, loading, error };
}
