import React, { useEffect, useMemo, useState } from "react";
import { OverlayWrapper } from "../../pong/components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayHeading,
} from "../../pong/components/Overlays/OverlayComponents";
import { UserInfo } from "./types/UserInfo";
import {
  fetchStatistics,
  SessionStat,
  fetchChallengeStats,
  ChallengeStats,
  fetchOpponentStats,
  OpponentStat,
} from "./types/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface StatsDashboardModalProps {
  user: UserInfo;
  onClose: () => void;
}

const aggregateHistory = (history: UserInfo["history"]) => {
  const map: Record<string, { date: string; wins: number; losses: number }> =
    {};
  history.forEach((h) => {
    if (!map[h.date]) map[h.date] = { date: h.date, wins: 0, losses: 0 };
    if (h.result === "win") map[h.date].wins += 1;
    else map[h.date].losses += 1;
  });
  return Object.values(map);
};

const StatsDashboardModal: React.FC<StatsDashboardModalProps> = ({
  user,
  onClose,
}) => {
  const [sessions, setSessions] = useState<SessionStat[]>([]);
  const [challengeStats, setChallengeStats] = useState<ChallengeStats | null>(
    null
  );
  const [opponentStats, setOpponentStats] = useState<OpponentStat[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStatistics();
        setSessions(data);
      } catch {
        // ignore errors
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stats = await fetchChallengeStats(Number(user.id));
        setChallengeStats(stats);
      } catch {
        // ignore errors
      }
    })();
  }, [user.id]);

  useEffect(() => {
    (async () => {
      try {
        const stats = await fetchOpponentStats(Number(user.id));
        setOpponentStats(stats);
      } catch {
        // ignore errors
      }
    })();
  }, [user.id]);

  const historyData = useMemo(
    () => aggregateHistory(user.history),
    [user.history]
  );

  const sessionChart = useMemo(() => {
    const map: Record<string, { date: string; matches: number }> = {};
    sessions.forEach((s) => {
      const d = s.date.split("T")[0];
      if (!map[d]) map[d] = { date: d, matches: 0 };
      map[d].matches += 1;
    });
    return Object.values(map);
  }, [sessions]);

  const totalMatches = user.wins + user.losses;
  const winRate = totalMatches
    ? Math.round((user.wins / totalMatches) * 100)
    : 0;
  const bestScore = useMemo(() => {
    let max = 0;
    sessions.forEach((s) => {
      if (s.win_user_id === Number(user.id)) {
        max = Math.max(max, s.winner_score);
      } else if (s.losses_user_id === Number(user.id)) {
        max = Math.max(max, s.loser_score);
      }
    });
    return max;
  }, [sessions, user.id]);

  const bestStreak = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    let longest = 0;
    let current = 0;
    sorted.forEach((s) => {
      if (s.win_user_id === Number(user.id)) {
        current += 1;
        longest = Math.max(longest, current);
      } else if (s.losses_user_id === Number(user.id)) {
        current = 0;
      }
    });
    return longest;
  }, [sessions, user.id]);

  const currentStreak = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    let streak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const s = sorted[i];
      if (s.win_user_id === Number(user.id)) {
        streak += 1;
      } else if (s.losses_user_id === Number(user.id)) {
        streak = streak > 0 ? 0 : streak - 1;
        break;
      }
    }
    return streak;
  }, [sessions, user.id]);

  const scoreDiff = useMemo(() => {
    if (!sessions.length) return { avg: 0, max: 0 };
    let sum = 0;
    let max = 0;
    sessions.forEach((s) => {
      const diff = Math.abs(s.winner_score - s.loser_score);
      sum += diff;
      max = Math.max(max, diff);
    });
    return { avg: Number((sum / sessions.length).toFixed(1)), max };
  }, [sessions]);

  const challengePieData = useMemo(() => {
    if (!challengeStats) return [];
    const pending =
      challengeStats.sent +
      challengeStats.received -
      challengeStats.accepted -
      challengeStats.declined;
    return [
      { name: "Accepted", value: challengeStats.accepted },
      { name: "Declined", value: challengeStats.declined },
      { name: "Pending", value: pending },
    ];
  }, [challengeStats]);

  const pieColors = ["#4ade80", "#f87171", "#facc15"];

  const Panel: React.FC<{ title: React.ReactNode; className?: string }> = ({
    title,
    children,
    className = "",
  }) => (
    <div
      className={`bg-gray-700/30 p-4 rounded-lg border border-gray-600 ${className}`}
    >
      <h3 className="text-lg font-orbitron text-blue-300 mb-3 flex items-center">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <OverlayWrapper onBackdropClick={onClose}>
      <OverlayCard className="w-[95%] max-w-6xl bg-gray-900/80 text-white max-h-[95vh] overflow-hidden relative flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-4 text-blue-400 hover:text-pink-400 font-bold"
        >
          ✕
        </button>
        <OverlayHeading className="text-2xl mb-4 font-orbitron">
          Stats Dashboard
        </OverlayHeading>
        <div className="flex flex-wrap justify-around mb-6 text-center gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Matches</p>
            <p className="text-lg font-bold">{totalMatches}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Win Rate</p>
            <p className="text-lg font-bold">{winRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Best Score</p>
            <p className="text-lg font-bold">{bestScore}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Best Streak</p>
            <p className="text-lg font-bold">{bestStreak}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Streak</p>
            <p className="text-lg font-bold">{currentStreak}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Avg Diff</p>
            <p className="text-lg font-bold">{scoreDiff.avg}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Max Diff</p>
            <p className="text-lg font-bold">{scoreDiff.max}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto p-2">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-orbitron text-blue-300 mb-2 flex items-center">
                <i className="fa-solid fa-user-astronaut mr-2" />
                User Stats
              </h3>
              {historyData.length > 0 ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Bar dataKey="wins" fill="#4ade80" />
                      <Bar dataKey="losses" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No games played yet.
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-orbitron text-blue-300 mb-2 flex items-center">
                <i className="fa-solid fa-chart-line mr-2" />
                Game Sessions
              </h3>
              {sessionChart.length > 0 ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sessionChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="matches"
                        stroke="#38bdf8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No session data available.
                </p>
              )}
              {sessions.length > 0 && (
                <table className="w-full text-sm mt-4 text-center">
                  <thead>
                    <tr className="text-blue-300">
                      <th className="px-2">Date</th>
                      <th className="px-2">Winner</th>
                      <th className="px-2">Loser</th>
                      <th className="px-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice(0, 5).map((s) => (
                      <tr key={s.game_id} className="odd:bg-gray-800">
                        <td className="px-2 py-1">{s.date.split("T")[0]}</td>
                        <td className="px-2 py-1">{s.winner_name}</td>
                        <td className="px-2 py-1">{s.loser_name}</td>
                        <td className="px-2 py-1">
                          {s.winner_score}-{s.loser_score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="space-y-8">
            {opponentStats.length > 0 && (
              <div>
                <h3 className="text-lg font-orbitron text-blue-300 mb-2 flex items-center">
                  <i className="fa-solid fa-users mr-2" />
                  Opponents
                </h3>
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="text-blue-300">
                      <th className="px-2">Opponent</th>
                      <th className="px-2">Wins</th>
                      <th className="px-2">Losses</th>
                      <th className="px-2">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opponentStats.slice(0, 5).map((o) => {
                      const total = o.wins + o.losses;
                      const rate = total
                        ? Math.round((o.wins / total) * 100)
                        : 0;
                      return (
                        <tr key={o.opponent_id} className="odd:bg-gray-800">
                          <td className="px-2 py-1">{o.username}</td>
                          <td className="px-2 py-1">{o.wins}</td>
                          <td className="px-2 py-1">{o.losses}</td>
                          <td className="px-2 py-1">{rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {challengeStats && (
              <div>
                <h3 className="text-lg font-orbitron text-blue-300 mb-2 flex items-center">
                  <i className="fa-solid fa-handshake mr-2" />
                  Challenges
                </h3>
                <div className="flex justify-around mb-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Sent</p>
                    <p className="text-lg font-bold">{challengeStats.sent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Received</p>
                    <p className="text-lg font-bold">
                      {challengeStats.received}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Games Played</p>
                    <p className="text-lg font-bold">{challengeStats.games}</p>
                  </div>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={challengePieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {challengePieData.map((entry, index) => (
                          <Cell
                            key={`c-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-300 space-y-1">
                  {challengeStats.topChallenged && (
                    <p>
                      Most Challenged: {challengeStats.topChallenged.username} (
                      {challengeStats.topChallenged.count})
                    </p>
                  )}
                  {challengeStats.topChallenger && (
                    <p>
                      Most Frequent Challenger:{" "}
                      {challengeStats.topChallenger.username} (
                      {challengeStats.topChallenger.count})
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </OverlayCard>
    </OverlayWrapper>
  );
};

export default StatsDashboardModal;
