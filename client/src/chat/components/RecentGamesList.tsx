import React from "react";
import { MatchResult } from "../../types/UserInfo";

interface RecentGamesListProps {
  history: MatchResult[];
}

const RecentGamesList: React.FC<RecentGamesListProps> = ({ history }) => {
  if (history.length === 0) return null;
  return (
    <div className="relative z-10 px-6 pb-6 text-left text-sm text-gray-300">
      <p className="font-semibold mb-1 font-orbitron">Recent games:</p>
      <ul className="space-y-0.5">
        {history.map((h) => (
          <li key={h.date + h.result}>
            {h.date} - {h.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentGamesList;
