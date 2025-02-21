  import mysql from "mysql2";

  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "smart",
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.stack);
      return;
    }
    console.log("Connected to the MySQL database");
  });

  export default db;
