// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
  DELETE FROM friends WHERE  id < 100;
  ` 
);

// UPDATE challenge SET game_end = 1 WHERE id = 3;
// DELETE FROM challenge WHERE  id < 100;
// UPDATE game SET losses_user_id = 1, win_user_id = 2, lose_score = 2, win_score = 30, lose_score = 15 WHERE id = 8;
// DELETE FROM challenge WHERE  id <100;