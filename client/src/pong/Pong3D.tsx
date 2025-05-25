import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initGame, GameAPI, PongCallbacks, GameMode } from "./pong";
import { recordWin, recordLoss } from "../pages/Profile/types/api";
import BracketOverlay, { BracketRound } from "./BracketOverlay";
import { ByeOverlay } from "./components/Overlays/ByeOverlay";
import { MatchResultOverlay } from "./components/Overlays/MatchResultOverlay";
import { GameOverOverlay } from "./components/Overlays/GameOverOverlay";
import { TournamentWinnerOverlay } from "./components/Overlays/TournamentWinnerOverlay";
import { StartScreen } from "./components/StartScreen";
import { TournamentSetup } from "./components/TournamentSetup";
import { PauseOverlay } from "./components/Overlays/PauseOverlay";
import { Scoreboard } from "./components/Scoreboard";
import { EscMenu } from "./components/Overlays/EscMenu";

import { useTournament } from "./hooks/useTournament";
import "./pongGame.css";


const INVALID_NAME_REGEX = /[^a-zA-Z0-9 _-]/;

type MatchOverData = {
  mode: GameMode;
  winnerName: string;
  playerScore: number;
  aiScore: number;
};

export default function Pong3D() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const startMode = query.get("mode");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Score
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  // Pause / ESC
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [waitingStart, setWaitingStart] = useState(false);

  // Main menu / tournament
  const [showStartScreen, setShowStartScreen] = useState(!startMode);
  const [showSetup, setShowSetup] = useState(startMode === GameMode.Tournament);
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2"]);
  const [nameError, setNameError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [emptyError, setEmptyError] = useState(false);

  function validateNames(arr: string[]) {
    const invalid = arr.some((n) => INVALID_NAME_REGEX.test(n));
    const empty = arr.some((n) => n.trim() === "");
    const normalized = arr
      .map((n) => n.trim().toLowerCase())
      .filter((n) => n !== "");
    const dup = new Set(normalized).size !== normalized.length;
    setNameError(invalid);
    setEmptyError(empty);
    setDuplicateError(dup);
    return !(invalid || empty || dup);
  }

  // Babylon Game API
  const [gameApi, setGameApi] = useState<GameAPI | null>(null);

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
    acknowledgeWinner,
    resetTourney,
    tournamentEnded,
  } = useTournament(gameApi);

  // Ensure waiting overlay is shown when a new tournament match starts
  function handleContinueBye() {
    continueBye();
    setWaitingStart(true);
  }

  function handleContinueMatch() {
    continueMatch();
    setWaitingStart(true);
  }

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

        if (mode === GameMode.AI) {
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


  useEffect(() => {
    if (!gameApi) return;
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode");
    if (mode === GameMode.AI) {
      setShowStartScreen(false);
      gameApi.startSinglePlayerAI();
      setWaitingStart(true);
    } else if (mode === GameMode.Local2P) {
      setShowStartScreen(false);
      gameApi.startLocal2P();
      setWaitingStart(true);
    } else if (mode === GameMode.Tournament) {
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
    if (rounds.length > 0) {
      const arr = ["Resume"];
      if (!winner) {
        arr.push("Show bracket");
      }
      arr.push("Switch game mode", "Exit game");
      return arr;
    }
    return ["Resume", "Restart match", "Switch game mode", "Exit game"];
  }
  function menuAction(idx: number) {
    const arr = getMenuItems();
    const chosen = arr[idx];
    if (chosen === "Resume") {
      gameApi?.unpause?.();
    } else if (chosen === "Restart match") {
      gameApi?.restartCurrentMatch?.();
      setWaitingStart(true);
    } else if (chosen === "Show bracket") {
      setShowBracket(true);
    } else if (chosen === "Switch game mode") {
      resetAllToMainMenu();
    } else if (chosen === "Exit game") {
      navigate("/profile");
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
    setWaitingStart(false);
  }

  // --- MAIN SCREEN
  function startAI() {
    setShowStartScreen(false);
    gameApi?.startSinglePlayerAI();
    setLeftLabel("YOU");
    setRightLabel("AI");
    setWaitingStart(true);
  }
  function startLocal() {
    setShowStartScreen(false);
    gameApi?.startLocal2P();
    setLeftLabel("PLAYER 1");
    setRightLabel("PLAYER 2");
    setWaitingStart(true);
  }
  function openTournament() {
    const initial = ["Player 1", "Player 2"];
    setPlayers(initial);
    validateNames(initial);
    setShowStartScreen(false);
    setShowSetup(true);
  }
  function addPlayer() {
    const MAX_PLAYERS = 8;
    if (players.length < MAX_PLAYERS) {
      const arr = [...players, `Player ${players.length + 1}`];
      setPlayers(arr);
      validateNames(arr);
    }
  }

  function removePlayer(index: number) {
    const arr = players.filter((_, i) => i !== index);
    setPlayers(arr);
    validateNames(arr);
  }

  function cancelTournamentSetup() {
    setShowSetup(false);
    resetAllToMainMenu();
  }

  // --- START TOURNAMENT
  function beginTourney() {
    if (!validateNames(players)) return;
    setShowSetup(false);
    setShowStartScreen(false);
    startTourney(players);
    setWaitingStart(true);
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
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        setShowBracket(false);
        if (tournamentEnded) {
          resetAllToMainMenu();
        } else {
          setShowMenu(true);
        }
        return;
      }

      if (
        [
          " ",
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
  }, [showBracket, tournamentEnded]);

  // Unpause on any key when waiting to start
  useEffect(() => {
    if (!waitingStart) return;
    function handleStart() {
      setWaitingStart(false);
      gameApi?.unpause?.();
    }
    window.addEventListener("keydown", handleStart, { once: true });
    return () => window.removeEventListener("keydown", handleStart);
  }, [waitingStart, gameApi]);

  return (
    <div
      className="
      font-orbitron
      relative
      h-screen
      w-screen
      bg-black
      text-white"
    >
      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        className="
          h-full
          w-full
          rounded-lg
          border-4
          border-purple-600"
      />
      {/* SCORE */}
      <Scoreboard
        leftLabel={leftLabel}
        rightLabel={rightLabel}
        scoreLeft={scoreLeft}
        scoreRight={scoreRight}
      />
      {/* PAUSE overlay */}
      {isPaused && !showMenu && <PauseOverlay waitingStart={waitingStart} />}
      {/* ESC MENU */}
      {showMenu && (
        <EscMenu
          menuItems={getMenuItems()}
          menuIndex={menuIndex}
          setMenuIndex={setMenuIndex}
          onMenuAction={menuAction}
        />
      )}
      {/* BRACKET Overlay */}
      {showBracket && (
        <BracketOverlay
          rounds={rounds}
          onClose={() => {
            setShowBracket(false);
            if (tournamentEnded) {
              resetAllToMainMenu();
            }
          }}
        />
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
          onContinue={handleContinueBye}
        />
      )}
      {/* REAL MATCH overlay */}
      {matchInfo && (
        <MatchResultOverlay
          winner={matchInfo.winner}
          loser={matchInfo.loser}
          winnerScore={matchInfo.winnerScore}
          loserScore={matchInfo.loserScore}
          isFinal={matchInfo.isFinal}
          nextPair={matchInfo.nextPair}
          onContinue={handleContinueMatch}
        />
      )}
      {/* TOURNAMENT WINNER */}
      {winner && (
        <TournamentWinnerOverlay
          winner={winner}
          onClose={() => {
            acknowledgeWinner();
            setShowBracket(true);
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
          nameError={nameError}
          duplicateError={duplicateError}
          emptyError={emptyError}
          onChangePlayerName={(index, val) => {
            const arr = [...players];
            arr[index] = val;
            setPlayers(arr);
            validateNames(arr);
          }}
          onAddPlayer={addPlayer}
          onRemovePlayer={removePlayer}
          onStartTournament={beginTourney}
          onClose={cancelTournamentSetup}
        />
      )}
    </div>
  );
}
