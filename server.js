import express from "express";
import cors from "cors";
import jurys from "./app/pages/api/jurys.js";
import groups from "./app/pages/api/groups.js";
import soutenance from "./app/pages/api/soutenance.js";


const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));

// Routes
app.use("/api/jurys", jurys);
app.use("/api/groups", groups);
app.use("/api/soutenance", soutenance);

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
