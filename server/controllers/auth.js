// import db from "../database/database.js"; // Using better-sqlite3

// export async function signup(req, reply) {
//   console.log("We are in SIGNUP middleware");

//   const { name, username, email, password } = req.body;

//   // Validate request body
//   if (!name || !password || !email || !username) {

//     return reply.code(400).send({ message: "No pass or name or email or username" });
//   }

//   try {
//     const hasUser = db
//       .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
//       .get(email, username);
//     console.log("Has user", hasUser);
//     if (!hasUser) {
//       const users = db.prepare(
//         "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)"
//       );
//       const result = users.run(name, username, email, password);
//       const token = req.jwt.sign({ 
//         id: result.lastInsertRowid });

//       console.log("TOKEN_ID", token);

//       console.log("USER_ID =>", result.lastInsertRowid);

//       // Set user online
//       const online = db
//         .prepare(`UPDATE users SET online = ? WHERE id = ?`)
//         .run(1, result.lastInsertRowid);

//       // Verify online status
//       const updated = db
//         .prepare(`SELECT id, online FROM users WHERE id = ?`)
//         .get(result.lastInsertRowid);

//       console.log("ONLINE? =>", updated);

//       return reply.code(201).send({ message: "USER created", users, accessToken: token });
//     } else {
//       console.log("User already exists");
//       return reply.code(400).send({ message: "User already exists" });
//     }
//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }

// export async function login(req, reply) {
//   const { email, password } = req.body;

//   if (!password || !email) {
//     return reply.code(400).send({ message: "No pass or email" });
//   }

//   try {
//     const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
//     console.log("Query result:", user); // Log the result

//     if (user) {
//       console.log("Email", user.email);
//       console.log("Pass", user.password);
//       // reply.code(200).send({ message: "There is such a user", user });
//       const kuku = db
//         .prepare(`SELECT * FROM users WHERE email = ? AND password = ?`)
//         .get(email, password);

//       // const token = jwt.sign(
//       //   { userId: user.id },
//       //   { expiresIn: "2h" }
//       // );
//       // console.log("kuku", kuku);

//       const token = req.jwt.sign({ 
//         id: user.id 
//       });
//       if (kuku) {
//         console.log("WE are logged in");
//         const userOnline = db
//           .prepare(`SELECT * FROM users WHERE id = ?`)
//           .get(user.id);

//         console.log("ID=>", user.id);
//         // Put Online
//         const online = db.prepare(`UPDATE users SET online = '1' WHERE id = ?`)
//           .run(user.id);

//         console.log("ONLINE =>", online.changes);

//         return reply.code(200).send({ accessToken: token });
//       } else {
//         console.log("Wrong pass");
//         return reply.code(401).send({ message: "Wrong pass" });
//       }
//     } else {
//       return reply.code(400).send({ message: "No such user" });
//     }
//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }

// export async function logout(req, reply) {
//   const { email } = req.body;
//   try {
//     const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

//     if (!user) {
//       return reply.code(400).send({ message: "No such user" });
//     }

//     console.log("ID=>", user.id);

//     const offline = db
//       .prepare("UPDATE users SET online = ? WHERE email = ?")
//       .run(0, email);
//     console.log("Offline =>", offline.changes);
//     return reply.code(200).send({ message: "We are logged out" });
//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }

// export async function getCurrentUser(req, reply) {
//   try {
//     const userId = req.user.id;
//     const user = db
//       .prepare("SELECT id, name, username, email, online, image FROM users WHERE id = ?")
//       .get(userId);

//     if (!user) {
//       return reply.code(404).send({ message: "User not found" });
//     }

//     return reply.code(200).send({
//       user: {
//         id: user.id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         online: user.online,
//         image: user.image ? Buffer.from(user.image).toString("base64") : null,
//       },
//     });
//   } catch (err) {
//     console.error("Database error:", err.message);
//     return reply.code(500).send({ message: "Something went wrong" });
//   }
// }



//  Добавил пути к аватару профиля, по умолцчанию


import db from "../database/database.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function signup(req, reply) {
  console.log("We are in SIGNUP middleware");

  const { name, username, email, password } = req.body;

    // Validate request body
  if (!name || !password || !email || !username) {
    return reply.code(400).send({ message: "No pass or name or email or username" });
  }

  try {
    const hasUser = db
      .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
      .get(email, username);
    console.log("Has user", hasUser);
    if (!hasUser) {
      // path to avatar
      const defaultAvatarPath = path.join(__dirname, "..", "public", "prof_img", "avatar1.png");
      console.log("Attempting to load default avatar from:", defaultAvatarPath);
      let defaultAvatarBuffer = null;

      try {
        defaultAvatarBuffer = await fs.readFile(defaultAvatarPath);
        console.log("Default avatar loaded successfully, size:", defaultAvatarBuffer.length, "bytes");
      } catch (err) {
        console.error("Failed to read default avatar:", err.message);
        console.warn("Using null avatar as fallback");
        return reply.code(500).send({ message: "Failed to load default avatar" });
      }

      const users = db.prepare(
        "INSERT INTO users (name, username, email, password, image, image_type) VALUES (?, ?, ?, ?, ?, ?)"
      );
      const result = users.run(name, username, email, password, defaultAvatarBuffer, "image/png");
      console.log("User inserted into database, ID:", result.lastInsertRowid);

      const token = req.jwt.sign({ 
        id: result.lastInsertRowid 
      });

      console.log("TOKEN_ID", token);

	  // Set user online
      const online = db
        .prepare(`UPDATE users SET online = ? WHERE id = ?`)
        .run(1, result.lastInsertRowid);

	  // Verify online status
      const updated = db
        .prepare(`SELECT id, online, image, image_type FROM users WHERE id = ?`)
        .get(result.lastInsertRowid);

      console.log("ONLINE? =>", updated);

      return reply.code(201).send({ message: "USER created", users, accessToken: token });
    } else {
      console.log("User already exists");
      return reply.code(400).send({ message: "User already exists" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function login(req, reply) {
  const { email, password } = req.body;

  if (!password || !email) {
    return reply.code(400).send({ message: "No pass or email" });
  }

  try {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
    console.log("Query result:", user);  // Log the result

    if (user) {
      console.log("Email", user.email);
      console.log("Pass", user.password);
	  // reply.code(200).send({ message: "There is such a user", user });
      const kuku = db
        .prepare(`SELECT * FROM users WHERE email = ? AND password = ?`)
        .get(email, password);

	  // const token = jwt.sign(
      //   { userId: user.id },
      //   { expiresIn: "2h" }
      // );
      // console.log("kuku", kuku);

      const token = req.jwt.sign({ 
        id: user.id 
      });
      if (kuku) {
        console.log("WE are logged in");
        const userOnline = db
          .prepare(`SELECT * FROM users WHERE id = ?`)
          .get(user.id);

        console.log("ID=>", user.id);
		// Put Online
        const online = db.prepare(`UPDATE users SET online = '1' WHERE id = ?`)
          .run(user.id);

        console.log("ONLINE =>", online.changes);

        return reply.code(200).send({ accessToken: token });
      } else {
        console.log("Wrong pass");
        return reply.code(401).send({ message: "Wrong pass" });
      }
    } else {
      return reply.code(400).send({ message: "No such user" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function logout(req, reply) {
  const { email } = req.body;
  try {
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

    if (!user) {
      return reply.code(400).send({ message: "No such user" });
    }

    console.log("ID=>", user.id);

    const offline = db
      .prepare("UPDATE users SET online = ? WHERE email = ?")
      .run(0, email);
    console.log("Offline =>", offline.changes);
    return reply.code(200).send({ message: "We are logged out" });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}

export async function getCurrentUser(req, reply) {
  try {
    const userId = req.user.id;
    const user = db
      .prepare("SELECT id, name, username, email, online, image, image_type FROM users WHERE id = ?")
      .get(userId);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    return reply.code(200).send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        online: user.online,
        image: user.image ? Buffer.from(user.image).toString("base64") : null,
        image_type: user.image_type || "image/png"
      },
    });
  } catch (err) {
    console.error("Database error:", err.message);
    return reply.code(500).send({ message: "Something went wrong" });
  }
}



// Теперь сервер сам загружает аватар по умолчанию и сохраняет его в базе (в поле image), 
// а клиент получает его через API

// Аватар хранится на сервере (server/public/prof_img/avatar1.png),
// что делает серверную логику независимой от клиентской структуры.

// Иначе у меня не выходит отображатъ аватар в Players и окне Avatar, сразу при регестрации. Твой код не тронут и не изменен,
// только добавил пути к аватару. // Твой код сверху для проверки изминений.