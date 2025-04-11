// import sqlite3 from "sqlite3";

// const db = new sqlite3.Database("./database/users.db", (err) => {
//   if (err) {
//     console.log("Something went wrong with the database:", err.message);
//   } else {
//     console.log("All good with db");

//     // Ensure the 'users' table exists
//     db.run(
//       `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         email TEXT NOT NULL,
//         name TEXT NOT NULL,
//         password TEXT NOT NULL
//       );`,
//       (err) => {
//         if (err) {
//           console.error("Error creating users table:", err.message);
//         } else {
//           console.log("Users table is ready.");
//         }
//       }
//     );
//   }
// });

// export default db;

import Database from "better-sqlite3";

const db = new Database("./database/users.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL
  );
`);

console.log("Database initialized and users table is ready.");

export default db;