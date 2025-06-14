import { PowerUpType } from "../../../pong/powerups";

export type BotInfo = {
  name: string;
  image: string;
  strengths: string;
  weaknesses: string;
  error: number;
  /** Difficulty rating represented as number of stars */
  stars: number;
  /** Optional z-target center bias when ball moves toward the bot */
  center?: number;
  /** Optional overshoot amount when predicting target */
  overshoot?: number;
  /** Preferred power-up type */
  favorite?: PowerUpType;
};

export const bots: BotInfo[] = [
  {
    name: "Steady Chef",
    image: "/boots_img/chef.png",
    strengths: "Never panics, always in the right place",
    weaknesses: "Too lazy to attack quickly",
    error: 0.01,
    stars: 3,
    center: 0.2,
    overshoot: 0.1,
    favorite: PowerUpType.MegaPaddle,
  },
  {
    name: "Speedy Ghost",
    image: "/boots_img/ghost.png",
    strengths: "Aggressive pressure and fast reactions",
    weaknesses: "Rushes so hard it leaves holes",
    error: 0.03,
    stars: 3,
    center: 0.15,
    overshoot: 0.5,
    favorite: PowerUpType.Speed,
  },
  {
    name: "Drama Bot",
    image: "/boots_img/robot.png",
    strengths: "Jumps everywhere, pure chaos",
    weaknesses: "Panics and misses when things get real",
    error: 0.08,
    stars: 2,
    overshoot: 0.2,
    favorite: PowerUpType.PowerShot,
  },
  {
    name: "Shadow Ninja",
    image: "/boots_img/ninja.png",
    strengths: "Reads every move with perfect precision",
    weaknesses: "None discovered so far",
    error: 0,
    stars: 4,
    center: 0.1,
    overshoot: 0.3,
    favorite: PowerUpType.PowerShot,
  },
];
