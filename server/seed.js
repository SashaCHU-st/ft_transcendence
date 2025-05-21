// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `DELETE FROM users WHERE 5 < id < 8
  `
);
