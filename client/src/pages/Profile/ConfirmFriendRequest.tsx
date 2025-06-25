import api from "./types/api";

export const confirmFriendRequest = async (username: string): Promise<void> => {
  try {
    const user_id = Number(localStorage.getItem("id"));
    if (!user_id) throw new Error("Not authenticated");

    await api.post("/confirmFriend", {
      user_id,
      username,
      confirmReq: 1, // optional, backend hardcodes it anyway
    });
  } catch (err: any) {
    console.error("Error confirming friend:", err);
    throw err;
  }
};