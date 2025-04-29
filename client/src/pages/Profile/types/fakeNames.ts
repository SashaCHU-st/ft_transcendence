
import { UserInfo } from "./UserInfo";
import { toast } from "react-hot-toast";

export const defaultFriends: UserInfo[] = [
  {
    username: "Zoe",
    avatar: "/boots_img/ghost.png",
    email: "zoe@example.com",
    name: "Zoe",
    password: "secret",
    online: true,
    wins: 100,
    losses: 10,
    history: [
      { date: "2025-04-24", weekday: "Thu", result: "win" },
      { date: "2025-04-24", weekday: "Thu", result: "loss" },
    ],
    onRemove: () => toast("Zoe removed from friends 👋"),
    onChallenge: () => toast.success("Challenge sent to Zoe"),
  },
  {
    username: "Mika",
    avatar: "/boots_img/ninja.png",
    email: "mika@example.com",
    name: "Mika",
    password: "secret",
    online: false,
    wins: 5,
    losses: 6,
    history: [
      { date: "2025-04-24", weekday: "Thu", result: "win" },
      { date: "2025-04-24", weekday: "Thu", result: "loss" },
    ],
    onRemove: () => toast("Mika removed from friends 👋"),
    onChallenge: () => toast.success("Challenge sent to Mika"),
  },
  {
    username: "Alex",
    avatar: "/boots_img/chef.png",
    email: "alex@example.com",
    name: "Alex",
    password: "secret",
    online: true,
    wins: 9,
    losses: 3,
    history: [
      { date: "2025-04-24", weekday: "Thu", result: "win" },
      { date: "2025-04-24", weekday: "Thu", result: "loss" },
    ],
    onRemove: () => toast("Alex removed from friends 👋"),
    onChallenge: () => toast.success("Challenge sent to Alex"),
  },
  {
    username: "Tina",
    avatar: "/boots_img/mermaid.png",
    email: "tina@example.com",
    name: "Tina",
    password: "secret",
    online: false,
    wins: 3,
    losses: 5,
    history: [
      { date: "2025-04-24", weekday: "Thu", result: "win" },
      { date: "2025-04-24", weekday: "Thu", result: "loss" },
    ],
    onRemove: () => toast("Tina removed from friends 👋"),
    onChallenge: () => toast.success("Challenge sent to Tina"),
  },
];

export const defaultPlayers: UserInfo[] = defaultFriends.map((player) => ({
  ...player,
  onRemove: undefined, // У игроков нет кнопки "Remove"
  onChallenge: () => toast.success(`Challenged ${player.username}`),
}));