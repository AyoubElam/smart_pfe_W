import express from "express";
import db from "../../../config/db.js";

const router = express.Router();

const queryPromise = (query, params) => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Failed to reconnect to database:", err);
        return reject(err);
      }
      db.query(query, params, (error, results) => {
        if (error) {
          console.error("Query error:", error);
          return reject(error);
        }
        resolve(results);
      });
    });
  });
};

router.get("/group-only/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const query = `
      SELECT 
        s.idSoutenance,
        s.date,
        s.time,
        s.location,
        s.status,
        s.idGroupe,
        g.nomGroupe,
        sj.idJury,
        j.nom AS juryNom
      FROM soutenance s
      INNER JOIN groupe g ON s.idGroupe = g.idGroupe
      LEFT JOIN soutenance_jury sj ON s.idSoutenance = sj.idSoutenance
      LEFT JOIN jury j ON sj.idJury = j.idJury
      WHERE s.idGroupe = ?;
    `;
    const results = await queryPromise(query, [groupId]);

    const soutenances = results.reduce((acc, row) => {
      const existingSoutenance = acc.find(
        (s) => s.idSoutenance === row.idSoutenance
      );

      if (existingSoutenance) {
        if (row.juryNom) existingSoutenance.juryNames.push(row.juryNom);
      } else {
        acc.push({
          idSoutenance: row.idSoutenance,
          date: row.date,
          time: row.time,
          location: row.location,
          status: row.status,
          idGroupe: row.idGroupe,
          nomGroupe: row.nomGroupe,
          juryNames: row.juryNom ? [row.juryNom] : [],
        });
      }
      return acc;
    }, []);

    res.json(soutenances);
  } catch (error) {
    console.error("Error fetching soutenances:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;