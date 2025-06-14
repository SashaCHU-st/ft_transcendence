import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initGame, GameAPI, PongCallbacks, GameMode, type GameState } from "./pong";
import { recordWin, recordLoss } from "../pages/Profile/types/api";
import BracketOverlay from "./BracketOverlay";
import { ByeOverlay } from "./components/Overlays/ByeOverlay";
import { MatchResultOverlay } from "./components/Overlays/MatchResultOverlay";
import { GameOverOverlay } from "./components/Overlays/GameOverOverlay";
import { TournamentWinnerOverlay } from "./components/Overlays/TournamentWinnerOverlay";
import { StartScreen } from "./components/StartScreen";
import { TournamentSetup } from "./components/TournamentSetup";
import { PauseOverlay } from "./components/Overlays/PauseOverlay";
import { RemoteStatusOverlay } from "./components/Overlays/RemoteStatusOverlay";
import { RemoteErrorOverlay } from "./components/Overlays/RemoteErrorOverlay";
import { Scoreboard } from "./components/Scoreboard";
import { GoalBanner } from "./components/GoalBanner";
import { EscMenu } from "./components/Overlays/EscMenu";
import { SettingsOverlay } from "./components/Overlays/SettingsOverlay";
import { PowerUpBar } from "./components/PowerUpBar";
import { PowerUpType } from "./powerups";
import { BALL_SPEED, BALL_SIZE, WINNING_SCORE } from "../../../shared/constants.js";

import { useTournament } from "./hooks/useTournament";
import "./pongGame.css";

type GameApiWithState = GameAPI & { __state?: GameState };


const INVALID_NAME_REGEX = /[^a-zA-Z0-9 _-]/;

type MatchOverData = {
  mode: GameMode;
  winnerName: string;
  playerScore: number;
  aiScore: number;
  message?: string;
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
  const [showGoal, setShowGoal] = useState(false);
  const goalTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScore = useRef({ left: 0, right: 0 });

  // Pause / ESC
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [waitingStart, setWaitingStart] = useState(false);
  const [remoteWaiting, setRemoteWaiting] = useState(false);
  const [remoteCountdown, setRemoteCountdown] = useState<number | null>(null);
  const [remoteError, setRemoteError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [powerUpsEnabled, setPowerUpsEnabled] = useState(false);
  const [ballSpeed, setBallSpeed] = useState(BALL_SPEED);
  const [ballSize, setBallSize] = useState(BALL_SIZE);
  const [winningScore, setWinningScore] = useState(WINNING_SCORE);
  const [soundOn, setSoundOn] = useState(true);
  const [leftColor, setLeftColor] = useState("#cc33cc");
  const [rightColor, setRightColor] = useState("#33ccaa");
  const [activeLeft, setActiveLeft] = useState<PowerUpType | null>(null);
  const [activeRight, setActiveRight] = useState<PowerUpType | null>(null);

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
  const [gameApi, setGameApi] = useState<GameApiWithState | null>(null);

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
        const changed =
          pl !== prevScore.current.left || ai !== prevScore.current.right;
        prevScore.current = { left: pl, right: ai };
        if (changed) {
          setShowGoal(true);
          if (goalTimeout.current) clearTimeout(goalTimeout.current);
          goalTimeout.current = setTimeout(() => setShowGoal(false), 1000);
        }
      },
      onPauseChange: (paused) => {
        setIsPaused(paused);
      },
      onEscMenuChange: (show) => {
        setShowMenu(show);
        if (show) setMenuIndex(0);
      },
      onMatchOver: (mode, winner, plScore, aiScore, message) => {
        setMatchOver({
          mode,
          winnerName: winner,
          playerScore: plScore,
          aiScore,
          message,
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
      onPowerUpUpdate: (l, r) => {
        setActiveLeft(l);
        setActiveRight(r);
      },
      onRemoteWaitingChange: (w) => {
        setRemoteWaiting(w);
      },
      onRemoteCountdown: (sec) => {
        if (sec <= 0) setRemoteCountdown(null);
        else setRemoteCountdown(sec);
      },
      onRemoteError: () => {
        setRemoteError(true);
      },
    };
    const game = initGame(canvasRef.current, callbacks, powerUpsEnabled);
    game.setBallSpeed?.(ballSpeed);
    game.setBallSize?.(ballSize);
    game.setWinningScore?.(winningScore);
    game.setPaddleColor?.('left', leftColor);
    game.setPaddleColor?.('right', rightColor);
    game.setSoundEnabled?.(soundOn);
    setGameApi(game);
    return () => {
      game.dispose();
    };
  }, []);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setBallSpeed?.(ballSpeed);
  }, [gameApi, ballSpeed]);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setBallSize?.(ballSize);
  }, [gameApi, ballSize]);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setWinningScore?.(winningScore);
  }, [gameApi, winningScore]);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setPaddleColor?.('left', leftColor);
  }, [gameApi, leftColor]);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setPaddleColor?.('right', rightColor);
  }, [gameApi, rightColor]);

  useEffect(() => {
    if (!gameApi) return;
    gameApi.setSoundEnabled?.(soundOn);
  }, [gameApi, soundOn]);


  useEffect(() => {
    if (!gameApi) return;
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode");
    if (mode === GameMode.AI) {
      setShowStartScreen(false);
      const bot = getStoredBot();
      gameApi.startSinglePlayerAI(bot || undefined);
      setWaitingStart(true);
      setLeftLabel('YOU');
      setRightLabel(bot?.name ?? 'AI');
    } else if (mode === GameMode.Local2P) {
      setShowStartScreen(false);
      gameApi.startLocal2P();
      setWaitingStart(true);
    } else if (mode === GameMode.Tournament) {
      setShowStartScreen(false);
      setShowSetup(true);
    } else if (mode === GameMode.Remote2P) {
      setShowStartScreen(false);
      prevScore.current = { left: 0, right: 0 };
      gameApi.startRemote2P();
      setScoreLeft(0);
      setScoreRight(0);
      setLeftLabel("YOU");
      setRightLabel("OPPONENT");
      setRemoteWaiting(true);
      setRemoteCountdown(null);
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
      const state = gameApi?.__state;
    const active = state?.gameStarted;
    const mode = state?.currentMode;
    if (active) {
      if (mode === GameMode.Remote2P) {
        return ["Back to match", "Settings", "Quit match"];
      }
      if (rounds.length > 0) {
        const arr = ["Resume"];
        if (!winner) {
          arr.push("Show bracket");
        }
        arr.push("Settings", "Switch game mode", "Quit to profile");
        return arr;
      }
      return [
        "Resume",
        "Restart match",
        "Settings",
        "Switch game mode",
        "Quit to profile",
      ];
    }
    return ["Settings", "Switch game mode", "Quit to profile"];
  }
  function menuAction(idx: number) {
    const arr = getMenuItems();
    const chosen = arr[idx];
    if (chosen === "Resume" || chosen === "Back to match") {
      gameApi?.unpause?.();
    } else if (chosen === "Restart match") {
      // Clear previous score to avoid spurious goal banners
      prevScore.current = { left: 0, right: 0 };
      gameApi?.restartCurrentMatch?.();
      setWaitingStart(true);
    } else if (chosen === "Show bracket") {
      setShowBracket(true);
    } else if (chosen === "Settings") {
      setShowSettings(true);
      setShowMenu(false);
    } else if (chosen === "Switch game mode") {
      resetAllToMainMenu();
    } else if (chosen === "Quit match") {
      resetAllToMainMenu();
    } else if (chosen === "Quit to profile") {
      navigate("/profile");
    }
  }

  function resetAllToMainMenu() {
    setShowStartScreen(true);
    setScoreLeft(0);
    setScoreRight(0);
    prevScore.current = { left: 0, right: 0 };
    setLeftLabel("PLAYER");
    setRightLabel("AI");
    resetTourney();
    gameApi?.backToMenu();
    setWaitingStart(false);
    setRemoteWaiting(false);
    setRemoteCountdown(null);
  }

  // --- MAIN SCREEN
  function getStoredBot() {
    const raw = localStorage.getItem('selectedBot');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  }

  function startAI() {
    setShowStartScreen(false);
    const bot = getStoredBot();
    gameApi?.startSinglePlayerAI(bot || undefined);
    prevScore.current = { left: 0, right: 0 };
    setLeftLabel('YOU');
    setRightLabel(bot?.name ?? 'AI');
    setWaitingStart(true);
  }
  function startLocal() {
    setShowStartScreen(false);
    gameApi?.startLocal2P();
    prevScore.current = { left: 0, right: 0 };
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

  function startRandomMatch() {
    startRemoteDuel();
  }

  function startRemoteDuel() {
    setShowStartScreen(false);
    // Reset score tracking before starting a new remote game
    prevScore.current = { left: 0, right: 0 };
    gameApi?.startRemote2P();
    // Reset UI scores before the server sends the initial state
    setScoreLeft(0);
    setScoreRight(0);
    setLeftLabel("YOU");
    setRightLabel("OPPONENT");
    setRemoteWaiting(true);
    setRemoteCountdown(null);
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
    prevScore.current = { left: 0, right: 0 };
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
      if (gameApi?.__state?.currentMode === GameMode.Remote2P) return;
    function handleStart() {
      setWaitingStart(false);
      gameApi?.unpause?.();
    }
    window.addEventListener("keydown", handleStart, { once: true });
    return () => window.removeEventListener("keydown", handleStart);
  }, [waitingStart, gameApi]);

  useEffect(() => {
    return () => {
      if (goalTimeout.current) clearTimeout(goalTimeout.current);
    };
  }, []);

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
        leftPowerUp={activeLeft}
        rightPowerUp={activeRight}
      />
      {powerUpsEnabled && (
        <PowerUpBar
          onSelect={(t) => gameApi?.usePowerUp?.('left', { type: t })}
          active={activeLeft}
        />
      )}
      <GoalBanner visible={showGoal} />
      {/* PAUSE overlay */}
      {isPaused && !showMenu && (
        <PauseOverlay
          waitingStart={waitingStart}
          onSettings={() => setShowSettings(true)}
        />
      )}
      {/* Remote status overlay */}
      {(remoteWaiting || remoteCountdown !== null) && (
        <RemoteStatusOverlay waiting={remoteWaiting} countdown={remoteCountdown} />
      )}
      {remoteError && (
        <RemoteErrorOverlay
          onExit={() => {
            setRemoteError(false);
            navigate('/profile');
          }}
        />
      )}
      {/* ESC MENU */}
      {showMenu && (
        <EscMenu
          menuItems={getMenuItems()}
          menuIndex={menuIndex}
          setMenuIndex={setMenuIndex}
          onMenuAction={menuAction}
        />
      )}
      {showSettings && (
        <SettingsOverlay
          powerUps={powerUpsEnabled}
          ballSpeed={ballSpeed}
          ballSize={ballSize}
          winningScore={winningScore}
          sound={soundOn}
          leftColor={leftColor}
          rightColor={rightColor}
          onPowerUpsChange={(v) => {
            setPowerUpsEnabled(v);
            gameApi?.setPowerUpsEnabled?.(v);
          }}
          onBallSpeedChange={(v) => setBallSpeed(v)}
          onBallSizeChange={(v) => setBallSize(v)}
          onWinningScoreChange={(v) => setWinningScore(v)}
          onLeftColorChange={(c) => setLeftColor(c)}
          onRightColorChange={
            gameApi?.__state?.currentMode === GameMode.Local2P ||
            gameApi?.__state?.currentMode === GameMode.Tournament
              ? (c) => setRightColor(c)
              : undefined
          }
          onSoundChange={(v) => setSoundOn(v)}
          onClose={() => setShowSettings(false)}
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
          message={matchOver.message}
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
          onRandomMatch={startRandomMatch}
          onClose={() => {
            navigate('/profile');
          }}
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

