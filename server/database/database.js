import Database from "better-sqlite3";

const db = new Database("./database/database.db");
//nickname uniqy and email
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    online BOOL, 
    image BLOB
  );
`);
console.log("Database initialized and users table is ready.");

// const db = new Database("./database/friends.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId1 INTEGER NOT NULL,
    userId2 INTEGER NOT NULL,
    confirmReq BOOL,
    FOREIGN KEY (userId1) REFERENCES users(id),
    FOREIGN KEY (userId2) REFERENCES users(id)
  );
`);

console.log("Database initialized and friends table is ready.");


export default db;