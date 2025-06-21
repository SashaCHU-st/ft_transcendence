import api from "./types/api";
 
export const addFriend = async (targetUsername: string): Promise<void> => {
 try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });

    await api.post("/addFriends", { user_id, username: targetUsername }, {
    headers: { Authorization: `Bearer ${token}` }
  	});
	console.log("Added to friend", user_id);
  } catch (err:any) {
    console.error("Failed to add to friends:", err);
    throw err;
  }
};