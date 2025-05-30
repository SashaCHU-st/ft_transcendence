import React from "react";
import { OverlayButton } from "./OverlayComponents";

interface TournamentInfo {
  title: string;
  info: string;
  status: "JOINING" | "IN PROGRESS" | "FINISHED";
  button: string;
  color: "magenta" | "blue" | "green";
  disabled?: boolean;
}

const tournaments: TournamentInfo[] = [
  {
    title: "Git push origin pong",
    info: "2/8 • Single Elimination • Prize: +150 Rating",
    status: "JOINING",
    button: "JOIN",
    color: "green",
  },
  {
    title: "The Void Cup",
    info: "3/8 • Single Elimination • Prize: +150 Rating",
    status: "JOINING",
    button: "JOIN",
    color: "green",
  },
  {
    title: "Shlöp Cup 3000",
    info: "1/8 • Single Elimination • Prize: +150 Rating",
    status: "IN PROGRESS",
    button: "WATCH",
    color: "blue",
    disabled: true,
  },
  {
    title: "No mercy, just pong",
    info: "6/8 • Single Elimination • Prize: +150 Rating",
    status: "FINISHED",
    button: "VIEW RESULTS",
    color: "magenta",
    disabled: true,
  },
];

export function TournamentsTab() {
  return (
    <div>
      <div className="online-option mb-4">
        <h3>Create tournament</h3>
        <p>Organize your own competition</p>
      </div>
      <h3 className="text-xl mb-4 text-center text-purple-400">ACTIVE TOURNAMENTS</h3>
      <div className="tournament-list">
        {tournaments.map((t) => (
          <div className="tournament-item" key={t.title}>
            <div className="tournament-info">
              <h4>{t.title}</h4>
              <p>{t.info}</p>
              <span className={`tournament-status status-${t.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {t.status}
              </span>
            </div>
            <OverlayButton color={t.color} className="mt-0 px-4 py-1 text-sm" disabled={t.disabled}>
              {t.button}
            </OverlayButton>
          </div>
        ))}
      </div>
    </div>
  );
}
