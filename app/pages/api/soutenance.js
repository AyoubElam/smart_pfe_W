/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import db from "../../../config/db.js";





const router = express.Router();

// Fetch all soutenances
router.get("/", (req, res) => {
  const query = `
SELECT s.idSoutenance, s.date, s.time, s.location, s.status, 
       g.nomGroupe, GROUP_CONCAT(DISTINCT j.nom ORDER BY j.nom ASC SEPARATOR ' | ') AS juryNames
FROM soutenance s
JOIN groupe g ON s.idGroupe = g.idGroupe
JOIN soutenance_jury sj ON sj.idSoutenance = s.idSoutenance
JOIN jury j ON sj.idJury = j.idJury
GROUP BY s.idSoutenance;


  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching soutenance data:", err);
      return res.status(500).json({ error: "Failed to fetch soutenance" });
    }

    // Send the fetched data as a response
    res.json(results);
  });
});

// Insert a new soutenance
router.post("/", (req, res) => {
  const { date, time, location, juryIds, group, status } = req.body;
  console.log("Received data:", req.body);

  if (!date || !time || !location || !juryIds || !group || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Insert soutenance first
  const querySoutenance = `
    INSERT INTO soutenance (date, time, location, status, idGroupe)
    VALUES (?, ?, ?, ?, ?)`;
  const valuesSoutenance = [date, time, location, status, group];

  db.query(querySoutenance, valuesSoutenance, (err, result) => {
    if (err) {
      console.error("❌ Error inserting soutenance:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const soutenanceId = result.insertId;

    // Insert jury members for the soutenance
    const juryInsertQuery = `
      INSERT INTO soutenance_jury (idSoutenance, idJury) VALUES ?`;
    const juryValues = juryIds.map((idJury) => [soutenanceId, idJury]);

    db.query(juryInsertQuery, [juryValues], (err) => {
      if (err) {
        console.error("❌ Error inserting jury members:", err);
        return res.status(500).json({ error: "Failed to assign jury members" });
      }

      console.log("Jury inserted successfully.");

      // Now, fetch the full soutenance data (including jury names and group name)
      const queryWithDetails = `
SELECT s.idSoutenance, s.date, s.time, s.location, s.status, 
       g.nomGroupe, GROUP_CONCAT(DISTINCT j.nom ORDER BY j.nom ASC SEPARATOR ' | ') AS juryNames
FROM soutenance s
JOIN groupe g ON s.idGroupe = g.idGroupe
JOIN soutenance_jury sj ON sj.idSoutenance = s.idSoutenance
JOIN jury j ON sj.idJury = j.idJury
WHERE s.idSoutenance = ?
GROUP BY s.idSoutenance;
`;

      db.query(queryWithDetails, [soutenanceId], (err, results) => {
        if (err) {
          console.error("❌ Error fetching detailed soutenance data:", err);
          return res.status(500).json({ error: "Failed to fetch detailed soutenance data" });
        }

        const soutenanceData = results[0];

        // Send the full data as the response
        res.status(201).json({
          idSoutenance: soutenanceData.idSoutenance,
          date: soutenanceData.date,
          time: soutenanceData.time,
          location: soutenanceData.location,
          status: soutenanceData.status,
          idGroupe: group,
          nomGroupe: soutenanceData.nomGroupe,
          juryNames: soutenanceData.juryNames,
        });
      });
    });
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT s.idSoutenance, s.date, s.time, s.location, s.status, 
           g.nomGroupe, GROUP_CONCAT(DISTINCT j.nom ORDER BY j.nom ASC SEPARATOR ' | ') AS juryNames
    FROM soutenance s
    JOIN groupe g ON s.idGroupe = g.idGroupe
    JOIN soutenance_jury sj ON sj.idSoutenance = s.idSoutenance
    JOIN jury j ON sj.idJury = j.idJury
    WHERE s.idSoutenance = ?
    GROUP BY s.idSoutenance
  `;

  try {
    db.query(query, [id], (error, rows) => {
      if (error) {
        console.error("Error fetching soutenance:", error.message);
        return res.status(500).json({ message: "Error fetching soutenance" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ message: "Soutenance not found" });
      }

      res.json(rows[0]);
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).json({ message: "Error fetching soutenance" });
  }
});


export default router;
