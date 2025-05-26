import { describe, it, expect, beforeEach, vi } from "vitest";
import { initGame, GameMode } from "../pong";
import type { GameAPI } from "../pong";

// Mock scene helpers
vi.mock("../scene", () => {
  function mesh() {
    return {
      position: {
        x: 0,
        y: 0,
        z: 0,
        set(x: number, y: number, z: number) {
          this.x = x;
          this.y = y;
          this.z = z;
        },
      },
    };
  }
  return {
    createScene: vi.fn(() => ({
      scene: {},
      camera: {},
      leftPaddle: mesh(),
      rightPaddle: mesh(),
      ball: mesh(),
    })),
    fitFieldToCamera: vi.fn(),
  };
});

// Minimal Babylon engine mock
vi.mock("@babylonjs/core", () => {
  return {
    Engine: class {
      scenes = [{}];
      runRenderLoop() {}
      stopRenderLoop() {}
      dispose() {}
      resize() {}
      getDeltaTime() {
        return 16;
      }
    },
  };
});

let api: GameAPI & { __state: any };

beforeEach(() => {
  const canvas = document.createElement("canvas");
  api = initGame(canvas) as any;
});

describe("start modes", () => {
  it("starts games paused", () => {
    api.startSinglePlayerAI();
    expect(api.__state.paused).toBe(true);
    api.startLocal2P();
    expect(api.__state.paused).toBe(true);
    api.startTournamentMatch("A", "B", false, vi.fn());
    expect(api.__state.paused).toBe(true);
  });
});

describe("pause behaviour", () => {
  beforeEach(() => {
    api.startSinglePlayerAI();
    api.__state.match.playerScore = 1;
  });

  it("toggles only on space", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(api.__state.paused).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    expect(api.__state.paused).toBe(false);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    expect(api.__state.paused).toBe(true);
    expect(api.__state.match.playerScore).toBe(1);
  });
});

describe("esc menu", () => {
  beforeEach(() => {
    api.startSinglePlayerAI();
    api.__state.match.aiScore = 2;
  });

  it("opens and closes only with esc and keeps score", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(api.__state.escMenuOpen).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(api.__state.escMenuOpen).toBe(true);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(api.__state.escMenuOpen).toBe(false);
    expect(api.__state.aiScore).toBeUndefined();
    expect(api.__state.match.aiScore).toBe(2);
  });
});

describe("unpause api", () => {
  it("does not reset scores", () => {
    api.startSinglePlayerAI();
    api.__state.match.playerScore = 3;
    api.unpause?.();
    expect(api.__state.paused).toBe(false);
    expect(api.__state.match.playerScore).toBe(3);
  });
});
