import express from "express";
import db from "../../../config/db.js";

const router = express.Router();
router.get("/", (req, res) => {
  const query = `SELECT s.*, g.nomGroupe, GROUP_CONCAT(j.nom ORDER BY j.nom ASC SEPARATOR ' | ') AS juryNames
FROM soutenance s
JOIN groupe g ON s.idGroupe = g.idGroupe
JOIN soutenance_jury sj ON sj.idSoutenance = s.idSoutenance
JOIN jury j ON sj.idJury = j.idJury
GROUP BY s.idSoutenance;



;
`; 

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching soutenance data:", err);
      return res.status(500).json({ error: "Failed to fetch soutenance" });
    }
    console.log("✅ Fetched soutenance data:", results);
    res.json(results);
  });
});
  

export default router;


