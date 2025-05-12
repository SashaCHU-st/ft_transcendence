
// import axios, { AxiosInstance, AxiosError } from "axios";
// import { toast } from "react-hot-toast";
// import { UserInfo, MatchResult } from "./UserInfo";

// const BASE_URL = "http://localhost:3000";

// const api: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       toast.error("Session expired. Please log in again.");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export const getAuthHeaders = (): { Authorization: string } | {} => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const fetchUserData = async (
//   headers: { Authorization: string } | {} = getAuthHeaders()
// ): Promise<UserInfo> => {
//   const response = await api.get("/users/me", { headers });
//   const currentUser = response.data.user;

//   let avatarSrc = "/prof_img/avatar1.png";
//   if (currentUser.image && currentUser.image_type) {
//     avatarSrc = `data:${currentUser.image_type};base64,${currentUser.image}`;
//   }

//   return {
//     id: currentUser.id || "unknown",
//     username: currentUser.username || currentUser.name || "Unknown",
//     avatar: avatarSrc,
//     email: currentUser.email || "",
//     name: currentUser.name || "",
//     password: currentUser.password || "",
//     wins: currentUser.wins || 0,
//     losses: currentUser.losses || 0,
//     online: !!currentUser.online,
//     history: currentUser.history || [],
//   };
// };

// export const updateUserProfile = async (
//   profileUpdates: Partial<UserInfo>,
//   avatar?: string,
//   headers: { Authorization: string } | {} = getAuthHeaders()
// ): Promise<void> => {
//   const updates: Partial<UserInfo> = {};
//   if (profileUpdates.name) updates.name = profileUpdates.name;
//   if (profileUpdates.username) updates.username = profileUpdates.username;
//   if (profileUpdates.password) updates.password = profileUpdates.password;

//   if (Object.keys(updates).length > 0) {
//     await api.patch("/updateProfile", updates, { headers });
//   }

//   if (avatar && avatar.startsWith("data:image")) {
//     const mimeType = avatar.match(/data:(image\/[a-z]+);base64,/)?.[1];
//     if (!mimeType || !["image/jpeg", "image/png"].includes(mimeType)) {
//       throw new Error("Invalid image format");
//     }
//     const blob = await (await fetch(avatar)).blob();
//     const formData = new FormData();
//     formData.append("file", blob, `avatar.${mimeType.split("/")[1]}`);

//     await api.post("/uploadPicture", formData, {
//       headers: {
//         ...headers,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   }
// };

// export const saveGameResult = async (
//   matchResult: MatchResult,
//   headers: { Authorization: string } | {} = getAuthHeaders()
// ): Promise<void> => {
//   await api.post("/game/result", matchResult, { headers });
// };


import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "./UserInfo";

// Define the base URL for the API
const BASE_URL = "http://localhost:3000";

// Create an Axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle response errors, particularly 401 Unauthorized
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors (e.g., expired token)
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Function to get authorization headers with Bearer token if available
export const getAuthHeaders = (): { Authorization: string } | {} => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch current user data from the server
export const fetchUserData = async (
  headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<UserInfo> => {
  // Make a GET request to retrieve user data
  const response = await api.get("/users/me", { headers });
  const currentUser = response.data.user;

  // Set default avatar if image data is not available
  let avatarSrc = "/prof_img/avatar1.png";
  if (currentUser.image && currentUser.image_type) {
    avatarSrc = `data:${currentUser.image_type};base64,${currentUser.image}`;
  }

  // Construct and return a UserInfo object with fallback values
  return {
    id: currentUser.id || "unknown",
    username: currentUser.username || currentUser.name || "Unknown",
    avatar: avatarSrc,
    email: currentUser.email || "",
    name: currentUser.name || "",
    password: currentUser.password || "",
    wins: currentUser.wins || 0,
    losses: currentUser.losses || 0,
    online: !!currentUser.online,
    history: currentUser.history || [],
  };
};

// Update user profile with optional avatar upload
export const updateUserProfile = async (
  profileUpdates: Partial<UserInfo>,
  avatar?: string,
  headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<void> => {
  // Prepare profile updates (name, username, password) if provided
  const updates: Partial<UserInfo> = {};
  if (profileUpdates.name) updates.name = profileUpdates.name;
  if (profileUpdates.username) updates.username = profileUpdates.username;
  if (profileUpdates.password) updates.password = profileUpdates.password;

  // Send profile updates to the server if there are any
  if (Object.keys(updates).length > 0) {
    await api.patch("/updateProfile", updates, { headers });
  }

  // Handle avatar upload if provided
  if (avatar && avatar.startsWith("data:image")) {
    // Validate the image MIME type (only JPEG or PNG allowed)
    const mimeType = avatar.match(/data:(image\/[a-z]+);base64,/)?.[1];
    if (!mimeType || !["image/jpeg", "image/png"].includes(mimeType)) {
      throw new Error("Invalid image format");
    }

    // Convert the base64 string to a blob for upload
    const blob = await (await fetch(avatar)).blob();
    const formData = new FormData();
    formData.append("file", blob, `avatar.${mimeType.split("/")[1]}`);

    // Send the avatar file to the server
    await api.post("/uploadPicture", formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

// Save game result to the server
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