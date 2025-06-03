export const addToFavorites = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });
    const response = await fetch("https://localhost:3000/addfavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id, username: targetUsername }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Server responded with:", result);
      throw new Error(result.message || "Failed to add to favorites");
    }

    console.log("Added to favorites:", result);
  } catch (err) {
    console.error("Failed to add to favorites:", err);
    throw err;
  }
};
