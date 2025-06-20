// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
   UPDATE game
SET win_user_id = 3, losses_user_id = 1
WHERE id = 2;
  ` 
);

// UPDATE challenge SET confirmReq = 2 WHERE id = 1;