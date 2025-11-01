// server.cjs
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const routes = require("./routes.cjs");

const app = express();
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => res.json({ message: "Library Management API - running" }));

console.log("Loaded PORT:", process.env.PORT);
console.log("Loaded DB_URI:", process.env.DB_URI);

if (!process.env.DB_URI) {
  console.error("DB_URI is missing. Copy .env.example to .env and set DB_URI");
  process.exit(1);
}

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
