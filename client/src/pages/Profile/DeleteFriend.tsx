import api from "./types/api";
 
export const deleteFriend = async (targetUsername: string): Promise<void> => {
 try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });

	await api.delete("/deletefriend", {
    headers: { Authorization: `Bearer ${token}` },
    data: { user_id, username: targetUsername }
  });
	console.log("Deleted from friends", user_id);
  } catch (err:any) {
    console.error("Failed to delete friend:", err);
    throw err;
  }
};