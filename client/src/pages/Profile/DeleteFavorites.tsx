export const deleteFromFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    
    const response = await fetch("https://localhost:3000/deletefavorites", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id, username: targetUsername }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Server responded with:", result);
      throw new Error(result.message || "Failed to delete from favorites");
    }

    console.log("Deleted from favorites:", result);
  } catch (err) {
    console.error("Failed to delete from favorites:", err);
    throw err;
  }
};
