// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
  UPDATE friends SET confirmReq = 0 WHERE id = 5;
  ` 
);

// DELETE FROM friends WHERE  id = 1;