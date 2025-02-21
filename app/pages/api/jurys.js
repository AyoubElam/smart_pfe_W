import express from "express";
import db from "../../../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT idJury, nom FROM jury";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching jurys data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(results);
  });
});

export default router;
