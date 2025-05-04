import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { UserInfo, MatchResult } from "./UserInfo";

const BASE_URL = "http://localhost:3000";

/* Configure Axios instance: Set up base URL and default headers for API requests */
const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

/* Set up response interceptor: Handle 401 errors by clearing token and redirecting to login */
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

/* Get authentication headers: Retrieve token from local storage and format as Bearer token */
export const getAuthHeaders = (): { Authorization: string } | {} => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

/* Fetch user data: Retrieve current user’s profile from the server and format response */
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

/* Update user profile: Send updated profile data and optional avatar to the server */
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

/* Save game result: Send match result to the server to update user stats */
export const saveGameResult = async (
	matchResult: MatchResult,
	headers: { Authorization: string } | {} = getAuthHeaders()
): Promise<void> => {
	await api.post("/game/result", matchResult, { headers });
};