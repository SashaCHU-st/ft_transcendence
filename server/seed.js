// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `UPDATE users
SET losses = 4
WHERE id = 2;`
);
