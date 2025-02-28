/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import multer from "multer";
import db from "../../../config/db.js"; // Single import at the top

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // File upload config


router.get("/documents", (req, res) => {
    const { idEtudiant } = req.query
    if (!idEtudiant) {
      return res.status(400).send("Missing idEtudiant")
    }
  
    db.query(
      "SELECT pl.idPFE, pl.idLivrable, pl.fichier " +
        "FROM pfe_livrable pl " +
        "JOIN pfe_groupe pg ON pl.idPFE = pg.idPFE " +
        "JOIN etudiantgroupe eg ON pg.idGroupe = eg.idGroupe " +
        "WHERE eg.idEtudiant = ? AND pl.fichier IS NOT NULL",
      [idEtudiant],
      (err, rows) => {
        if (err) {
          console.error("Error fetching documents:", err)
          return res.status(500).send("Server error")
        }
        res.json(rows)
      }
    )
  })
// Export the router directly (no need for a function wrapper if db is imported)
router.post("/submit-documents", upload.array("files"), (req, res) => {
    const { idEtudiant, idGroupe, livrables } = req.body;
    const files = req.files;

    // Validate input
    if (!idEtudiant || !idGroupe || !livrables || !files || files.length === 0) {
        return res.status(400).send("Missing required fields or files");
    }

    let livrablesArray;
    try {
        livrablesArray = Array.isArray(livrables) ? livrables : JSON.parse(livrables);
    } catch (err) {
        return res.status(400).send("Invalid livrables format");
    }
    if (livrablesArray.length !== files.length) {
        return res.status(400).send("Number of files must match number of livrables");
    }

    // Verify student membership
    db.query(
        "SELECT 1 FROM etudiantgroupe WHERE idEtudiant = ? AND idGroupe = ?",
        [idEtudiant, idGroupe],
        (err, authRows) => {
            if (err) {
                console.error("Error checking authorization:", err);
                return res.status(500).send(`Server error: ${err.message}`);
            }
            if (authRows.length === 0) {
                return res.status(403).send("Unauthorized");
            }

            // Get idPFE
            db.query(
                "SELECT idPFE FROM pfe_groupe WHERE idGroupe = ?",
                [idGroupe],
                (err, pfeRows) => {
                    if (err) {
                        console.error("Error fetching idPFE:", err);
                        return res.status(500).send(`Server error: ${err.message}`);
                    }
                    if (pfeRows.length === 0) {
                        return res.status(404).send("PFE not found for this group");
                    }
                    const idPFE = pfeRows[0].idPFE;

                    // Update pfe_livrable with file paths
                    let updatesCompleted = 0;
                    const totalUpdates = files.length;

                    files.forEach((file, index) => {
                        const idLivrable = livrablesArray[index];
                        const filePath = `/uploads/${file.filename}`;

                        db.query(
                            "UPDATE pfe_livrable SET fichier = ? WHERE idPFE = ? AND idLivrable = ?",
                            [filePath, idPFE, idLivrable],
                            (err, result) => {
                                if (err) {
                                    console.error("Error updating pfe_livrable:", err);
                                    return res.status(500).send(`Server error: ${err.message}`);
                                }
                                if (result.affectedRows === 0) {
                                    console.warn(`No row updated for idPFE=${idPFE}, idLivrable=${idLivrable}`);
                                }

                                updatesCompleted++;
                                if (updatesCompleted === totalUpdates) {
                                    res.send("Documents submitted successfully.");
                                }
                            }
                        );
                    });
                }
            );
        }
    );
});

export default router; // Export the router directly