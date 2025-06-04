import api from "./types/api";

export const deleteFromFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    
    // const response = await fetch("https://localhost:3000/deletefavorites", {
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ user_id, username: targetUsername }),
    // });

    // const result = await response.json();

    // if (!response.ok) {
    //   console.error("Server responded with:", result);
    //   throw new Error(result.message || "Failed to delete from favorites");
    // }
     const response = await api.delete("/deletefavorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { user_id, username: targetUsername }, // DELETE body goes in `data`
    });
    console.log("Deleted from favorites:", response.data);
  } catch (err:any) {
    console.error("Failed to delete from favorites:", err);
    throw err;
  }
};
