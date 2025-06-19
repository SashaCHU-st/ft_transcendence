import Database from "better-sqlite3";

const db = new Database("./database/database.db");
// Ensure SQLite enforces foreign key constraints
db.pragma('foreign_keys = ON');
//nickname uniqy and email

//time for game
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

//const db = new Database("./database/friends.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friends_id INTEGER NOT NULL,
    confirmReq BOOL default 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friends_id) REFERENCES users(id)
  );
 `);
 
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
    confirmReq INTEGER default 2,
    ok BOOL default 0,
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
    blocked BOOLEAN NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
    );
    `);
    
    // If the messages table existed before the blocked column was introduced,
    // add it so newer queries don't fail.
    const messageColumns = db.prepare('PRAGMA table_info(messages);').all();
    const hasBlockedColumn = messageColumns.some((c) => c.name === 'blocked');
    if (!hasBlockedColumn) {
      db.exec('ALTER TABLE messages ADD COLUMN blocked BOOLEAN NOT NULL DEFAULT 0;');
    }
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS blocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blocker_id INTEGER NOT NULL,
        blocked_id INTEGER NOT NULL,
        UNIQUE(blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(id),
    FOREIGN KEY (blocked_id) REFERENCES users(id)
    );
    `);
    
    // Add indexes to optimize lookups by sender and receiver
    db.exec("CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);");
    db.exec("CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);");
    db.exec("CREATE INDEX IF NOT EXISTS idx_blocks_blocker_id ON blocks(blocker_id);");
    db.exec("CREATE INDEX IF NOT EXISTS idx_blocks_blocked_id ON blocks(blocked_id);");
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS game (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id INTEGER,
        win_user_id INTEGER DEFAULT 0,
        losses_user_id INTEGER DEFAULT 0,
        win_score INTEGER DEFAULT 0,
        lose_score INTEGER DEFAULT 0,
        date DATE,
        FOREIGN KEY (challenge_id) REFERENCES challenge(id)
      );
    `);

    const gameColumns = db.prepare('PRAGMA table_info(game);').all();
    const hasWinScore = gameColumns.some((c) => c.name === 'win_score');
    if (!hasWinScore) {
      db.exec('ALTER TABLE game ADD COLUMN win_score INTEGER DEFAULT 0;');
    }
    const hasLoseScore = gameColumns.some((c) => c.name === 'lose_score');
    if (!hasLoseScore) {
      db.exec('ALTER TABLE game ADD COLUMN lose_score INTEGER DEFAULT 0;');
    }
    
    
    console.log("Database initialized and favorites table is ready.");
    
    
    
    export default db;
    
    