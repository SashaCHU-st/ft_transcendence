// client/src/pong/Pong3D.tsx

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { initGame, GameAPI, PongCallbacks } from "./pong";
import { recordWin, recordLoss } from "../pages/Profile/types/api";
import BracketOverlay, { BracketRound } from "./BracketOverlay";
import { ByeOverlay } from "./components/Overlays/ByeOverlay";
import { MatchResultOverlay } from "./components/Overlays/MatchResultOverlay";
import { GameOverOverlay } from "./components/Overlays/GameOverOverlay";
import { TournamentWinnerOverlay } from "./components/Overlays/TournamentWinnerOverlay";
import { StartScreen } from "./components/StartScreen";
import { TournamentSetup } from "./components/TournamentSetup";

import { stripPredTag } from "./utils/utils";
import { useTournament } from "./hooks/useTournament";
import "./PongGame.css";

import type { BetweenMatchesData, ByeOverlayData } from "./hooks/useTournament";

type MatchOverData = {
  mode: "ai" | "local2p" | "tournament";
  winnerName: string;
  playerScore: number;
  aiScore: number;
};

export default function Pong3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Score
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  // Pause / ESC
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);

  // Main menu / tournament
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2"]);

  // Babylon Game API
  const [gameApi, setGameApi] = useState<GameAPI | null>(null);
  const location = useLocation();

  // Single mode
  const [matchOver, setMatchOver] = useState<MatchOverData | null>(null);

  // Scoreboard names
  const [leftLabel, setLeftLabel] = useState("PLAYER");
  const [rightLabel, setRightLabel] = useState("AI");

  // Tournament overlays
  const {
    rounds,
    winner,
    showBracket,
    setShowBracket,
    byeInfo,
    matchInfo,
    startTourney,
    continueBye,
    continueMatch,
    resetTourney,
  } = useTournament(gameApi);

  // --- Babylon init
  useEffect(() => {
    if (!canvasRef.current) return;

    const callbacks: PongCallbacks = {
      onScoreUpdate: (pl, ai) => {
        setScoreLeft(pl);
        setScoreRight(ai);
      },
      onPauseChange: (paused) => {
        setIsPaused(paused);
      },
      onEscMenuChange: (show) => {
        setShowMenu(show);
        if (show) setMenuIndex(0);
      },
      onMatchOver: (mode, winner, plScore, aiScore) => {
        setMatchOver({
          mode,
          winnerName: winner,
          playerScore: plScore,
          aiScore,
        });

        if (mode === "ai") {
          const isPlayerWinner =
            winner.toLowerCase() === "you" || winner.toLowerCase() === "player";
          (isPlayerWinner ? recordWin : recordLoss)().catch((err) => {
            console.error("Failed to update stats", err);
          });
        }
      },
      onPlayersUpdate: (l, r) => {
        setLeftLabel(l);
        setRightLabel(r);
      },
    };
    const game = initGame(canvasRef.current, callbacks);
    setGameApi(game);
    return () => {
      game.dispose();
    };
  }, []);

  // Start specific mode if query parameter provided
  useEffect(() => {
    if (!gameApi) return;
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode");
    if (mode === "ai") {
      setShowStartScreen(false);
      gameApi.startSinglePlayerAI();
    } else if (mode === "local2p") {
      setShowStartScreen(false);
      gameApi.startLocal2P();
    } else if (mode === "tournament") {
      setShowStartScreen(false);
      setShowSetup(true);
    }
  }, [gameApi, location.search]);

  // --- ESC MENU
  useEffect(() => {
    if (!showMenu) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMenuIndex(
          (i) => (i - 1 + getMenuItems().length) % getMenuItems().length,
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setMenuIndex((i) => (i + 1) % getMenuItems().length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        menuAction(menuIndex);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showMenu, menuIndex]);

  function getMenuItems() {
    const base = ["Resume", "Restart match", "Quit to main menu"];
    // Add "Show bracket" if tournament is active
    if (rounds.length > 0 && !winner) {
      return ["Resume", "Restart match", "Show bracket", "Quit to main menu"];
    }
    return base;
  }
  function menuAction(idx: number) {
    const arr = getMenuItems();
    const chosen = arr[idx];
    if (chosen === "Resume") {
      gameApi?.unpause?.();
    } else if (chosen === "Restart match") {
      gameApi?.restartCurrentMatch?.();
    } else if (chosen === "Show bracket") {
      setShowBracket(true);
    } else if (chosen === "Quit to main menu") {
      resetAllToMainMenu();
    }
  }

  function resetAllToMainMenu() {
    setShowStartScreen(true);
    setScoreLeft(0);
    setScoreRight(0);
    setLeftLabel("PLAYER");
    setRightLabel("AI");
    resetTourney();
    gameApi?.backToMenu();
  }

  // --- MAIN SCREEN
  function startAI() {
    setShowStartScreen(false);
    gameApi?.startSinglePlayerAI();
  }
  function startLocal() {
    setShowStartScreen(false);
    gameApi?.startLocal2P();
  }
  function openTournament() {
    setShowStartScreen(false);
    setShowSetup(true);
  }
  function addPlayer() {
    if (players.length < 16) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    }
  }

  // --- START TOURNAMENT
  function beginTourney() {
    setShowSetup(false);
    setShowStartScreen(false);
    startTourney(players);
  }

  // --- Solo matchOver (non-tournament)
  function closeMatchOver() {
    setMatchOver(null);
    resetAllToMainMenu();
  }

  // Block input while bracket overlay is visible
  useEffect(() => {
    if (!showBracket) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setShowBracket(false);
        setShowMenu(true);
        return;
      }

      if (
        [
          " ",
          "Enter",
          "Tab",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    window.addEventListener("keydown", handleKey, true);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
    };
  }, [showBracket]);

  return (
    <div className="font-orbitron relative h-screen w-screen bg-black text-white">
      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        className="h-full w-full rounded-lg border-4 border-purple-600"
      />
      {/* SCORE */}
      <div className="absolute left-0 right-0 top-4 flex justify-between px-8">
        <div className="score-container rounded-lg px-6 py-3">
          <h2 className="text-xl text-blue-300">{leftLabel}</h2>
          <div className="score-glow text-4xl font-bold text-blue-400">
            {scoreLeft}
          </div>
        </div>
        <div className="score-container rounded-lg px-6 py-3">
          <h2 className="text-xl text-purple-300">{rightLabel}</h2>
          <div className="score-glow text-4xl font-bold text-purple-400">
            {scoreRight}
          </div>
        </div>
      </div>
      {/* PAUSE overlay */}
      {isPaused && !showMenu && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-4xl font-bold text-white">PAUSED</div>
        </div>
      )}
      {/* ESC MENU */}
      {showMenu && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center space-y-6 text-center">
            {getMenuItems().map((text, idx) => {
              const active = idx === menuIndex;
              return (
                <button
                  key={idx}
                  onClick={() => menuAction(idx)}
                  className={"menu-btn " + (active ? " bg-gray-600" : "")}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* BRACKET Overlay */}
      {showBracket && (
        <BracketOverlay rounds={rounds} onClose={() => setShowBracket(false)} />
      )}
      {/* Single matchOver */}

      {matchOver && (
        <GameOverOverlay
          winnerName={matchOver.winnerName}
          playerScore={matchOver.playerScore}
          aiScore={matchOver.aiScore}
          onOk={closeMatchOver}
        />
      )}
      {/* BYE overlay */}
      {byeInfo && (
        <ByeOverlay
          winner={byeInfo.winner}
          nextPair={byeInfo.nextPair}
          onContinue={continueBye}
        />
      )}
      {/* REAL MATCH overlay */}
      {matchInfo && (
        <MatchResultOverlay
          winner={matchInfo.winner}
          loser={matchInfo.loser}
          isFinal={matchInfo.isFinal}
          nextPair={matchInfo.nextPair}
          onContinue={continueMatch}
        />
      )}
      {/* TOURNAMENT WINNER */}
      {winner && (
        <TournamentWinnerOverlay
          winner={winner}
          onClose={() => {
            resetTourney();
            resetAllToMainMenu();
          }}
        />
      )}
      {/* START SCREEN */}
      {showStartScreen && (
        <StartScreen
          onSingleAI={startAI}
          onLocal2P={startLocal}
          onTournament={openTournament}
        />
      )}
      {/* TOURNAMENT SETUP */}
      {showSetup && (
        <TournamentSetup
          players={players}
          onChangePlayerName={(index, val) => {
            const arr = [...players];
            arr[index] = val;
            setPlayers(arr);
          }}
          onAddPlayer={addPlayer}
          onStartTournament={beginTourney}
        />
      )}
    </div>
  );
}
