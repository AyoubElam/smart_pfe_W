import express from "express";
import db from "../../../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM groupe";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching groups data:", err);
      return res.status(500).json({ error: "Failed to fetch groups" });
    }
    res.json(results);
  });
});

export default router;
