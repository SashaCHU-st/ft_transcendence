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
  (error: AxiosError) => {
    toast.error(error.response?.data.message)/// need to fix
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getAuthHeaders = (): { Authorization: string } | {} => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUserData = async (
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<UserInfo> => {
  const response = await api.get("/users/me", { headers });
  const currentUser = response.data.user;

  return {
    id: String(currentUser.id || "unknown"),
    username: currentUser.username || currentUser.name || "Unknown",
    avatar: currentUser.image
      ? `data:image/jpeg;base64,${currentUser.image}`
      : "/prof_img/avatar1.png",
    email: currentUser.email || "",
    name: currentUser.name || "",
    password: currentUser.password || "",
    wins: currentUser.wins || 0,
    losses: currentUser.losses || 0,
    online: !!currentUser.online,
    history: currentUser.history || [],
  };
};

export const updateUserProfile = async (
  profileUpdates: Partial<UserInfo>,
  avatar?: string,
  headers: { Authorization: string } | {} = getAuthHeaders(),
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
      throw error.response.data.errors; 
    }
    throw error;
  }
};
export const saveGameResult = async (
  matchResult: MatchResult,
  headers: { Authorization: string } | {} = getAuthHeaders(),
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
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<void> => {
  const id = getUserIdFromToken();
  if (id === null) throw new Error("No user id");
  await api.post("/winUser", { user_id: id }, { headers });
};

export const recordLoss = async (
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<void> => {
  const id = getUserIdFromToken();
  if (id === null) throw new Error("No user id");
  await api.post("/loseUser", { user_id: id }, { headers });
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
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<void> => {
  await api.post(
    "/messages",
    { fromId, toId, text },
    { headers },
  );
};

export const fetchChatMessages = async (
  user1: number,
  user2: number,
  viewerId: number,
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<ChatMessage[]> => {
  const response = await api.get(
    `/messages?user1=${user1}&user2=${user2}&viewerId=${viewerId}`,
    { headers },
  );
  return response.data.messages as ChatMessage[];
};

export const blockUserRequest = async (
  blockedId: number,
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<void> => {
  await api.post('/block', { blockedId }, { headers });
};

export const unblockUserRequest = async (
  blockedId: number,
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<void> => {
  await api.post('/unblock', { blockedId }, { headers });
};

export const fetchBlockedUsers = async (
  headers: { Authorization: string } | {} = getAuthHeaders(),
): Promise<number[]> => {
  const response = await api.get('/blocked', { headers });
  return response.data.blocked as number[];
};
