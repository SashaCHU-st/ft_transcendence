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
    image BLOB,
    wins INTEGER default 3,
    losses INTEGER default 0
  );
`);
console.log("Database initialized and users table is ready.");

// const db = new Database("./database/friends.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friends_id INTEGER NOT NULL,
    confirmReq BOOL NOT NULL default 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friends_id) REFERENCES users(id)
  );
`);

console.log("Database initialized and friends table is ready.");

db.exec(`
  CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    wins INTEGER NOT NULL default 0,
    losses INTEGER NOT NULL default 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log("Database initialized and friends table is ready.");


export default db;