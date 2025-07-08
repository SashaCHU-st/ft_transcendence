import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "database.db");
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

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
    losses INTEGER default 0,
    twofa_enabled INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friends_id INTEGER NOT NULL,
    confirmReq INTEGER default 2,
    saw INTEGER default 2,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friends_id) REFERENCES users(id)
  );
 `);
 


db.exec(`
  CREATE TABLE IF NOT EXISTS challenge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friends_id INTEGER NOT NULL,
    confirmReq INTEGER default 2,
    ok BOOL default 0,
    sent_once BOOL default 0,
    game_end BOOL default 0,
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
    
    export default db;
    
    