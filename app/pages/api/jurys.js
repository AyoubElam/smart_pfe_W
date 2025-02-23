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

// Add a new jury
router.post("/", (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: "Nom is required" });
  }

  const query = "INSERT INTO jury (nom, valideDeliberation) VALUES (?, 0)";
  db.query(query, [nom], (err, result) => {
    if (err) {
      console.error("Error inserting jury:", err);
      return res.status(500).json({ error: "Failed to add jury" });
    }
    res.status(201).json({ idJury: result.insertId, nom });
  });
});

router.delete("/:idJury", (req, res) => {
  const { idJury } = req.params;

  if (!idJury) {
    return res.status(400).json({ error: "idJury is required" });
  }

  const query = "DELETE FROM jury WHERE idJury = ?";
  db.query(query, [idJury], (err, result) => {
    if (err) {
      console.error("Error deleting jury:", err);
      return res.status(500).json({ error: "Failed to delete jury" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jury not found" });
    }

    res.status(200).json({ message: "Jury deleted successfully" });
  });
});


// Edit a jury
router.put("/:idJury", (req, res) => {
  const { idJury } = req.params;
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: "Nom is required" });
  }

  const query = "UPDATE jury SET nom = ? WHERE idJury = ?";
  db.query(query, [nom, idJury], (err, result) => {
    if (err) {
      console.error("Error updating jury:", err);
      return res.status(500).json({ error: "Failed to update jury" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jury not found" });
    }

    res.status(200).json({ message: "Jury updated successfully" });
  });
});

export default router;
