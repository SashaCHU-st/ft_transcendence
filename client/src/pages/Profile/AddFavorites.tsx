import api from "./types/api";

export const addToFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });
    const response = await api.post(
      "/addfavorites",
      { user_id, username: targetUsername },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Added to favorites:", response.data);
  } catch (err:any) {
    console.error("Failed to add to favorites:", err);
    throw err;
  }
};
