import api from "./types/api";

export const askForChallenge = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });

    const response = await api.post(
      "/challenge",{ user_id, username: targetUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("You sent request for challenge:", response.data);
    }catch (err: any) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Backend error message:", err.response.data);
    }
    console.error("Axios error:", err.message);
    throw err;
  }
};

