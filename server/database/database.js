import Database from "better-sqlite3";

const db = new Database("./database/users.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    online BOOL
  );
`);

console.log("Database initialized and users table is ready.");

export default db;