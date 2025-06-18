// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
   UPDATE users
SET wins = 13, losses = 2
WHERE id = 2;
  ` 
);

// UPDATE challenge SET confirmReq = 2 WHERE id = 1;