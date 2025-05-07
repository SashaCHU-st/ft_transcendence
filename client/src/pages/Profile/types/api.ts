
import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "./UserInfo";

const BASE_URL = "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getAuthHeaders = (): { Authorization: string } | {} => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchUserData = async (
  headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<UserInfo> => {
  const response = await api.get("/users/me", { headers });
  const currentUser = response.data.user;

  return {
    id: currentUser.id || "unknown",
    username: currentUser.username || currentUser.name || "Unknown",
    avatar: currentUser.image ? `data:image/jpeg;base64,${currentUser.image}` : "/prof_img/avatar1.png",
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
  headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<void> => {
  const updates: Partial<UserInfo> = {};
  if (profileUpdates.name) updates.name = profileUpdates.name;
  if (profileUpdates.username) updates.username = profileUpdates.username;
  if (profileUpdates.password) updates.password = profileUpdates.password;

  if (Object.keys(updates).length > 0) {
    await api.patch("/updateProfile", updates, { headers });
  }

  if (avatar && avatar.startsWith("data:image")) {
    const base64Data = avatar.split(",")[1];
    const blob = await (await fetch(`data:image/jpeg;base64,${base64Data}`)).blob();
    const formData = new FormData();
    formData.append("file", blob, "avatar.jpg");

    await api.post("/uploadPicture", formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

export const saveGameResult = async (
  matchResult: MatchResult,
  headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<void> => {
  await api.post("/game/result", matchResult, { headers });
};

// export const fetchAllUsers = async (
//   headers: { Authorization: string } | {} = getAuthHeaders()
// ): Promise<UserInfo[]> => {
//   try {
//     const response = await api.get("/users", { headers });
//     return response.data.users.map((user: any) => ({
//       id: user.id?.toString() || "unknown",
//       username: user.username || user.name || "Unknown",
//       avatar: user.image
//         ? `data:image/jpeg;base64,${user.image}`
//         : "/prof_img/avatar1.png",
//       email: user.email || "",
//       name: user.name || "",
//       password: "", // Не возвращаем пароль
//       wins: user.wins || 0,
//       losses: user.losses || 0,
//       online: !!user.online,
//       history: user.history || [],
//       onChallenge: () => toast.success(`Challenged ${user.username}`),
//     }));
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     toast.error("Failed to load players.");
//     return [];
//   }
// };