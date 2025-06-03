import Database from "better-sqlite3";

const db = new Database("./database/database.db");
//nickname uniqy and email
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    online BOOL, 
    image BLOB,
    wins INTEGER default 0,
    losses INTEGER default 0
  );
`);
console.log("Database initialized and users table is ready.");

// const db = new Database("./database/friends.db");
// db.exec(`
//   CREATE TABLE IF NOT EXISTS friends (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     friends_id INTEGER NOT NULL,
//     confirmReq BOOL default 0,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (friends_id) REFERENCES users(id)
//   );
// `);
db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (username) REFERENCES users(username)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS challenge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friends_id INTEGER NOT NULL,
    confirmReq BOOL default 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friends_id) REFERENCES users(id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
  );
`);

// Add indexes to optimize lookups by sender and receiver
db.exec("CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);");
db.exec("CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);");



console.log("Database initialized and favorites table is ready.");



export default db;

