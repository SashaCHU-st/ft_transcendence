// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
   DELETE FROM friends WHERE  id = 1;
  ` 
);

// UPDATE challenge SET confirmReq = 2 WHERE id = 1;