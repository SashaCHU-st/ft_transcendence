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
          Authorization: `Bearer ${token}`, // attach token if your api doesn't auto-add it
        },
      }
    );
    // const response = await fetch("https://localhost:3000/challenge", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ user_id, username: targetUsername }),
    // });

    // const result = await response.json();

    // if (!response.ok) {
    //   console.error("Server responded with:", result);
    //   throw new Error(result.message || "Failed to ask for challenge");
    // }

    console.log("You sent request for challenge:", response.data);
    // console.log("You sent request for challenge:", response.data.challenge_id);
    localStorage.setItem("challenge_id", response.data.challenge_id);
    }catch (err: any) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Backend error message:", err.response.data);
    }
    console.error("Axios error:", err.message);
    throw err;
  }
  // } catch (err:any) {
  //   console.error("Failed to ask for challenge:", err);
  //   throw err;
  // }
};

