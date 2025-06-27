import React, { useEffect, useMemo, useState } from "react";
import Avatar from "./Avatar";
import { OverlayWrapper } from "../../pong/components/Overlays/OverlayWrapper";
import {
  OverlayCard,
  OverlayHeading,
  overlayOutlineClass,
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
  const [page, setPage] = useState(0);
  const [opponentPage, setOpponentPage] = useState(0);

  const userSessions = useMemo(
    () =>
      sessions
        .filter(
          (s) =>
            s.win_user_id === Number(user.id) ||
            s.losses_user_id === Number(user.id)
        )
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [sessions, user.id]
  );
  const sessionsPerPage = 5;
  const totalPages = useMemo(
    () => Math.ceil(userSessions.length / sessionsPerPage),
    [userSessions]
  );
  const paginatedSessions = useMemo(
    () =>
      userSessions.slice(
        page * sessionsPerPage,
        (page + 1) * sessionsPerPage
      ),
    [userSessions, page]
  );

  const opponentsPerPage = 5;
  const opponentTotalPages = useMemo(
    () => Math.ceil(opponentStats.length / opponentsPerPage),
    [opponentStats]
  );
  const paginatedOpponents = useMemo(
    () =>
      opponentStats.slice(
        opponentPage * opponentsPerPage,
        (opponentPage + 1) * opponentsPerPage
      ),
    [opponentStats, opponentPage]
  );

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

  const userHistory = useMemo(() => {
    return sessions
      .filter(
        (s) =>
          s.win_user_id === Number(user.id) ||
          s.losses_user_id === Number(user.id)
      )
      .map((s) => ({
        date: s.date.split("T")[0],
        weekday: "",
        result:
          s.win_user_id === Number(user.id) ? ("win" as const) : ("loss" as const),
      }));
  }, [sessions, user.id]);

  const historyData = useMemo(() => aggregateHistory(userHistory), [userHistory]);

  const sessionChart = useMemo(() => {
    const map: Record<string, { date: string; matches: number }> = {};
    userSessions.forEach((s) => {
      const d = s.date.split("T")[0];
      if (!map[d]) map[d] = { date: d, matches: 0 };
      map[d].matches += 1;
    });
    return Object.values(map);
  }, [userSessions]);

  const totalMatches = user.wins + user.losses;
  const winRate = totalMatches
    ? Math.round((user.wins / totalMatches) * 100)
    : 0;
  const bestScore = useMemo(() => {
    let max = 0;
    userSessions.forEach((s) => {
      if (s.win_user_id === Number(user.id)) {
        max = Math.max(max, s.winner_score);
      } else if (s.losses_user_id === Number(user.id)) {
        max = Math.max(max, s.loser_score);
      }
    });
    return max;
  }, [userSessions, user.id]);

  const bestStreak = useMemo(() => {
    const sorted = [...userSessions].sort((a, b) => a.date.localeCompare(b.date));
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
  }, [userSessions, user.id]);

  const currentStreak = useMemo(() => {
    const sorted = [...userSessions].sort((a, b) => a.date.localeCompare(b.date));
    let streak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const s = sorted[i];
      if (s.win_user_id === Number(user.id)) {
        streak += 1;
      } else if (s.losses_user_id === Number(user.id)) {
        streak = 0;
        break;
      }
    }
    return streak;
  }, [userSessions, user.id]);

  const scoreDiff = useMemo(() => {
    if (!userSessions.length) return { avg: 0, max: 0 };
    let sum = 0;
    let max = 0;
    userSessions.forEach((s) => {
      const diff = Math.abs(s.winner_score - s.loser_score);
      sum += diff;
      max = Math.max(max, diff);
    });
    return { avg: Number((sum / userSessions.length).toFixed(1)), max };
  }, [userSessions]);

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

  // Neon palette used across the game UI
  const pieColors = ["#40BFFF", "#BD0E86", "#00ffaa"];

  const Panel: React.FC<{ title: React.ReactNode; className?: string }> = ({
    title,
    children,
    className = "",
  }) => (
    <div
      className={`backdrop-blur-lg p-4 rounded-xl bg-gradient-to-br from-indigo-950/70 to-slate-900/70 ${overlayOutlineClass("blue")} ${className}`}
    >
      <h3 className="text-lg font-orbitron text-cyan-300 mb-3 flex items-center drop-shadow-[0_0_5px_#40BFFF]">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <OverlayWrapper onBackdropClick={onClose}>
      <OverlayCard className="w-[95%] max-w-6xl text-white max-h-[95vh] overflow-hidden relative flex flex-col bg-gradient-to-br from-[#0a0e2a] to-black border-[#00a1ff] shadow-[0_0_20px_#00a1ff,0_0_40px_#00a1ff]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-4 text-blue-400 hover:text-pink-400 font-bold"
        >
          ✕
        </button>
        <OverlayHeading className="text-2xl mb-4 font-orbitron">
          {`${user.username}'s Stats Dashboard`}
        </OverlayHeading>
        <div className="flex items-center justify-around mb-4 text-center font-orbitron flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar
              user={{ avatar: user.avatar, username: user.username }}
              className="w-24 h-24 border-2 border-purple-500 shadow-[0_0_20px_#c084fc] transform scale-125"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-extrabold text-blue-400 drop-shadow-[0_0_10px_#40BFFF]">
              {totalMatches}
            </p>
            <p className="text-sm uppercase mt-1 text-cyan-300">Games</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-extrabold text-green-400 drop-shadow-[0_0_10px_#00ffaa]">
              {user.wins}
            </p>
            <p className="text-sm uppercase mt-1 text-cyan-300">Wins</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-5xl font-extrabold text-pink-400 drop-shadow-[0_0_10px_#ff00ff]">
              {bestStreak}
            </p>
            <p className="text-sm uppercase mt-1 text-cyan-300">Best Streak</p>
          </div>
        </div>
        <div className="mb-8 flex items-center font-orbitron w-full">
          <div className="flex-1 mr-4">
            <div className="w-full h-4 bg-gray-700 rounded border border-violet-400/70 overflow-hidden">
              <div
                className="h-full rounded bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_6px_#40BFFF]"
                style={{ width: `${Math.min(winRate, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-4xl font-extrabold text-blue-400 drop-shadow-[0_0_10px_#40BFFF]">
              {winRate}%
            </p>
            <p className="text-sm uppercase mt-1 text-cyan-300">Win Rate</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto p-2">
          <div className="space-y-8">
            <Panel
              title={
                <>
                  <i className="fa-solid fa-user-astronaut mr-2" />
                  User Stats
                </>
              }
            >
              {historyData.length > 0 ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Bar dataKey="wins" fill="#40BFFF" />
                      <Bar dataKey="losses" fill="#BD0E86" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No games played yet.
                </p>
              )}
            </Panel>
            <Panel
              title={
                <>
                  <i className="fa-solid fa-chart-line mr-2" />
                  Game Sessions
                </>
              }
            >
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
                        stroke="#00ffaa"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-400">
                  No session data available.
                </p>
              )}
              {userSessions.length > 0 && (
                <>
                  <table className="w-full text-sm mt-4 text-center">
                    <thead>
                      <tr className="text-cyan-300">
                        <th className="px-2">Date</th>
                        <th className="px-2">Winner</th>
                        <th className="px-2">Loser</th>
                        <th className="px-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSessions.map((s) => (
                        <tr key={s.game_id} className="odd:bg-gray-800">
                          <td className="px-2 py-1">{s.date.split("T")[0]}</td>
                          <td className="px-2 py-1">{s.winner_username}</td>
                          <td className="px-2 py-1">{s.loser_username}</td>
                          <td className="px-2 py-1">
                            {s.winner_score} : {s.loser_score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-2 text-sm font-orbitron">
                      <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="border border-blue-400 rounded px-2 py-1 text-blue-400 hover:text-blue-200 disabled:text-gray-500"
                      >
                        Prev
                      </button>
                      <span className="text-cyan-300">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(p + 1, totalPages - 1))
                        }
                        disabled={page >= totalPages - 1}
                        className="border border-blue-400 rounded px-2 py-1 text-blue-400 hover:text-blue-200 disabled:text-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </Panel>
          </div>
          <div className="space-y-8">
            <Panel
              title={
                <>
                  <i className="fa-solid fa-star mr-2" />
                  Highlights
                </>
              }
            >
              <div className="flex justify-around mb-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Best Score</p>
                  <p className="text-lg font-bold">{bestScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-lg font-bold">{Math.max(currentStreak, 0)}</p>
                </div>
              </div>
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-sm text-gray-400">Avg Diff</p>
                  <p className="text-lg font-bold">{scoreDiff.avg}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Max Diff</p>
                  <p className="text-lg font-bold">{scoreDiff.max}</p>
                </div>
              </div>
            </Panel>
            {opponentStats.length > 0 && (
              <Panel
                title={
                  <>
                    <i className="fa-solid fa-users mr-2" />
                    Opponents
                  </>
                }
              >
                <table className="w-full text-sm text-center">
                  <thead>
                    <tr className="text-cyan-300">
                      <th className="px-2">Opponent</th>
                      <th className="px-2">Wins</th>
                      <th className="px-2">Losses</th>
                      <th className="px-2">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOpponents.map((o) => {
                      const total = o.wins + o.losses;
                      const rate = total ? Math.round((o.wins / total) * 100) : 0;
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
                {opponentTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-2 text-sm font-orbitron">
                    <button
                      onClick={() => setOpponentPage((p) => Math.max(p - 1, 0))}
                      disabled={opponentPage === 0}
                      className="border border-blue-400 rounded px-2 py-1 text-blue-400 hover:text-blue-200 disabled:text-gray-500"
                    >
                      Prev
                    </button>
                    <span className="text-cyan-300">
                      Page {opponentPage + 1} of {opponentTotalPages}
                    </span>
                    <button
                      onClick={() =>
                        setOpponentPage((p) => Math.min(p + 1, opponentTotalPages - 1))
                      }
                      disabled={opponentPage >= opponentTotalPages - 1}
                      className="border border-blue-400 rounded px-2 py-1 text-blue-400 hover:text-blue-200 disabled:text-gray-500"
                    >
                      Next
                    </button>
                  </div>
                )}
              </Panel>
            )}
            {challengeStats && (
              <Panel
                title={
                  <>
                    <i className="fa-solid fa-gamepad mr-2" />
                    Challenges
                  </>
                }
              >
                <div className="flex justify-around mb-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Sent</p>
                    <p className="text-lg font-bold">{challengeStats.sent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Received</p>
                    <p className="text-lg font-bold">{challengeStats.received}</p>
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
                      Most Challenged: {challengeStats.topChallenged.username} ({
                        challengeStats.topChallenged.count
                      })
                    </p>
                  )}
                  {challengeStats.topChallenger && (
                    <p>
                      Most Frequent Challenger:{" "}
                      {challengeStats.topChallenger.username} ({
                        challengeStats.topChallenger.count
                      })
                    </p>
                  )}
                </div>
              </Panel>
            )}
          </div>
        </div>
      </OverlayCard>
    </OverlayWrapper>
  );
};

export default StatsDashboardModal;
