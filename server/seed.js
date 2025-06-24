// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/database.db");

db.exec(
  `
<<<<<<< HEAD
   DELETE FROM friends WHERE  id < 100;
=======
  UPDATE friends SET confirmReq = 0 WHERE id = 5;
>>>>>>> 0a9277d0671e87d15aaa03547de553cfbdb8c676
  ` 
);

// DELETE FROM friends WHERE  id = 1;