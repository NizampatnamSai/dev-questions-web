require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./db"); // initializes + seeds the SQLite database on first run

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const statsRoutes = require("./routes/stats");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`DevQuiz API running on http://localhost:${PORT}`);
});
