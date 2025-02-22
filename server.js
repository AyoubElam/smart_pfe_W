/* eslint-disable @typescript-eslint/no-require-imports */
import express from "express";
import cors from "cors";
import jurys from "./app/pages/api/jurys.js";
import groups from "./app/pages/api/groups.js";
import soutenance from "./app/pages/api/soutenance.js";

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend requests
  methods: ["GET", "POST", "PUT", "DELETE"], // Ensure PUT is included
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // ✅ Add this to handle JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Handle form data

// ✅ Handle Preflight (OPTIONS) Requests
app.options("/api/soutenance/:id", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.sendStatus(200);
});

// Routes
app.use("/api/jurys", jurys);
app.use("/api/groups", groups);
app.use("/api/soutenance", soutenance);

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
