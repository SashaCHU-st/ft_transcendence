export const askForChallenge = async (targetUsername: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");

    if (!token || !user_id) {
      throw new Error("User not authenticated");
    }
    console.log("Sending to server:", { user_id, username: targetUsername });
    const response = await fetch("https://localhost:3000/challenge", {
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
      throw new Error(result.message || "Failed to ask for challenge");
    }

    console.log("You sent request for challenge:", result);
  } catch (err) {
    console.error("Failed to ask for challenge:", err);
    throw err;
  }
};


// export const notifyAboutChallenge = async (): Promise<void> => {
//   try {
//     const token = localStorage.getItem("token");
//     const user_id = localStorage.getItem("id");

//     if (!token || !user_id) {
//       throw new Error("User not authenticated");
//     }
//     console.log("Sending to server:", { user_id });
//     const response = await fetch("https://localhost:3000/notification", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ user_id }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       console.error("Server responded with:", result);
//       throw new Error(result.message || "Failed to notify about challenge request");
//     }

//     console.log("You got notification about challenge:", result);
//   } catch (err) {
//     console.error("Failed to notify about challenge request: ", err);
//     throw err;
//   }
// };


