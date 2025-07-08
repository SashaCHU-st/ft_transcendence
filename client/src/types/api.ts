import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "./UserInfo";

const BASE_URL = "https://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const backendMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      // toast.error(backendMessage); // disabled generic error toast
    }

    return Promise.reject(error);
  }
);

export const addFriend = async (targetUsername: string): Promise<void> => {
 try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    await api.post("/addFriends", { user_id, username: targetUsername }, {
    headers: { Authorization: `Bearer ${token}` }
  	});
  } catch (err:any) {
    console.error("Failed to add to friends:", err);
    throw err;
  }
};

export const confirmFriendRequest = async (username: string): Promise<void> => {
  try {
    const user_id = Number(localStorage.getItem("id"));
    if (!user_id) throw new Error("Not authenticated");

    await api.post("/confirmFriend", {
      user_id,
      username,
      confirmReq: 1,
    });
  } catch (err: any) {
    throw err;
  }
};

export const deleteFriend = async (targetUsername: string): Promise<void> => {
 try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }

	await api.delete("/deletefriend", {
    headers: { Authorization: `Bearer ${token}` },
    data: { user_id, username: targetUsername }
  });
  } catch (err:any) {
    console.error("Failed to delete friend:", err);
    throw err;
  }
};

export const addToFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    const response = await api.post(
      "/addfavorites",
      { user_id, username: targetUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err:any) {
    console.error("Failed to add to favorites:", err);
    throw err;
  }
};

export const deleteFromFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
     const response = await api.delete("/deletefavorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { user_id, username: targetUsername },
    });
  } catch (err:any) {
    console.error("Failed to delete from favorites:", err);
    throw err;
  }
};


export const askForChallenge = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    const response = await api.post(
      "/challenge",{ user_id, username: targetUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("challenge_id", response.data.challenge_id);
    }catch (err: any) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Backend error message:", err.response.data);
    }
    console.error("Axios error:", err.message);
    throw err;
  }
};


export const getAuthHeaders = ():
  | { Authorization: string }
  | Record<string, never> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const updateUserProfile = async (
  profileUpdates: Partial<UserInfo>,
  avatar?: string,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  try {
    const updates: Partial<UserInfo> = {};
    if (profileUpdates.name) updates.name = profileUpdates.name;
    if (profileUpdates.username) updates.username = profileUpdates.username;
    if (profileUpdates.password) updates.password = profileUpdates.password;

    if (Object.keys(updates).length > 0) {
      await api.patch("/updateProfile", updates, { headers });
    }

    if (avatar && avatar.startsWith("data:image")) {
      const base64Data = avatar.split(",")[1];
      const blob = await (
        await fetch(`data:image/jpeg;base64,${base64Data}`)
      ).blob();
      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");

      await api.post("/uploadPicture", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
    }
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      (error.response.data as { errors?: unknown }).errors
    ) {
      throw (error.response.data as { errors: unknown }).errors;
    }
    throw error;
  }
};

export const saveGameResult = async (
  matchResult: MatchResult,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  await api.post("/game/result", matchResult, { headers });
};

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;
    if (typeof id === "number") return id;
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
};

export const recordWin = async (
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  const id = getUserIdFromToken();
  if (id === null) throw new Error("No user id");
  const challenge_id = localStorage.getItem("challenge_id");
  await api.post("/winUser", { user_id: id, challenge_id }, { headers });
};

export const recordLoss = async (
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  const id = getUserIdFromToken();
  if (id === null) throw new Error("No user id");
  const challenge_id = localStorage.getItem("challenge_id");
  await api.post("/loseUser", { user_id: id, challenge_id }, { headers });
};

export const recordAiMatch = async (
  playerScore: number,
  aiScore: number,
  playerWon: boolean,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders(),
): Promise<void> => {
  const id = getUserIdFromToken();
  if (id === null) throw new Error("No user id");
  await api.post(
    "/aiResult",
    { user_id: id, player_score: playerScore, ai_score: aiScore, player_won: playerWon },
    { headers },
  );
};

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  /** 1 when sent while blocked, otherwise 0 */
  blocked: number;
  created_at: string;
}

export const sendChatMessage = async (
  fromId: number,
  toId: number,
  text: string,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  await api.post("/messages", { fromId, toId, text }, { headers });
};

export const fetchChatMessages = async (
  user1: number,
  user2: number,
  viewerId: number,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<ChatMessage[]> => {
  const response = await api.get(
    `/messages?user1=${user1}&user2=${user2}&viewerId=${viewerId}`,
    { headers }
  );
  return response.data.messages as ChatMessage[];
};

export const blockUserRequest = async (
  blockedId: number,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  await api.post("/block", { blockedId }, { headers });
};

export const unblockUserRequest = async (
  blockedId: number,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<void> => {
  await api.post("/unblock", { blockedId }, { headers });
};

export const fetchBlockedUsers = async (
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<number[]> => {
  const response = await api.get("/blocked", { headers });
  return response.data.blocked as number[];
};

export interface SessionStat {
  game_id: number;
  winner_username: string;
  winner_score: number;
  win_user_id: number;
  loser_username: string;
  loser_score: number;
  losses_user_id: number;
  date: string;
}

export const fetchStatistics = async (
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<SessionStat[]> => {
  const response = await api.get("/statistics", { headers });
  return response.data.stat as SessionStat[];
};

export interface ChallengeStats {
  sent: number;
  received: number;
  accepted: number;
  declined: number;
  games: number;
  topChallenged?: { username: string; count: number } | null;
  topChallenger?: { username: string; count: number } | null;
}

export const fetchChallengeStats = async (
  userId: number,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<ChallengeStats> => {
  const response = await api.get(`/challenge-stats/${userId}`, { headers });
  return response.data as ChallengeStats;
};

export interface OpponentStat {
  opponent_id: number;
  username: string;
  wins: number;
  losses: number;
  games: number;
}

export const fetchOpponentStats = async (
  userId: number,
  headers: { Authorization: string } | Record<string, never> = getAuthHeaders()
): Promise<OpponentStat[]> => {
  const response = await api.get(`/opponent-stats/${userId}`, { headers });
  return response.data.stats as OpponentStat[];
};

export default api;
