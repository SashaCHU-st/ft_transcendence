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
  },
  {
    name: "Speedy Ghost",
    image: "/boots_img/ghost.png",
    strengths: "Aggressive pressure and fast reactions",
    weaknesses: "Rushes so hard it leaves holes",
    error: 0.03,
    stars: 3,
    overshoot: 0.5,
  },
  {
    name: "Drama Bot",
    image: "/boots_img/robot.png",
    strengths: "Jumps everywhere, pure chaos",
    weaknesses: "Panics and misses when things get real",
    error: 0.08,
    stars: 2,
  },
  {
    name: "Shadow Ninja",
    image: "/boots_img/ninja.png",
    strengths: "Reads every move with perfect precision",
    weaknesses: "None discovered so far",
    error: 0,
    stars: 4,
  },
];
