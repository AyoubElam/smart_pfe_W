/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import cors from "cors";
import db from "./config/db.js"; // Adjust path to match your structure
import jurys from "./app/pages/api/jurys.js";
import groups from "./app/pages/api/groups.js";
import soutenance from "./app/pages/api/soutenance.js";
import etu_sout from "./app/pages/api/etu_sout.js";
import livrable from "./app/pages/api/livrable.js";

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle Preflight (OPTIONS) Requests
app.options("/api/soutenance/:id", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.sendStatus(200);
});

// Routes
app.use("/api/jurys", jurys); // Assuming jurys accepts db implicitly or doesn’t need it
app.use("/api/groups", groups);
app.use("/api/soutenance", soutenance);
app.use("/api/etu_sout", etu_sout);
app.use("/api/livrable", livrable); // No need to pass db since it’s imported in livrable.js

// Start the server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});