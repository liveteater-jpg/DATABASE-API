import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Folder data
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// SAVE JSON
app.post("/store", (req, res) => {
  const { filename, data } = req.body;

  if (!filename || data === undefined)
    return res.status(400).json({ error: "Missing filename or data" });

  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("[SAVE]", filename);
  res.json({ success: true, file: filename });
});

// READ JSON
app.get("/store", (req, res) => {
  const { filename } = req.query;

  if (!filename)
    return res.status(400).json({ error: "Missing filename" });

  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log("[READ]", filename);
  res.json({ success: true, data });
});

// EDIT JSON
app.post("/edit", (req, res) => {
  const { filename, data } = req.body;

  if (!filename || data === undefined)
    return res.status(400).json({ error: "Missing filename or data" });

  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("[EDIT]", filename);
  res.json({ success: true, edited: filename });
});

// DELETE JSON
app.delete("/store", (req, res) => {
  const { filename } = req.query;

  if (!filename)
    return res.status(400).json({ error: "Missing filename" });

  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: "File not found" });

  fs.unlinkSync(filePath);
  console.log("[DELETE]", filename);
  res.json({ success: true });
});

// LIST FILES
app.get("/list", (req, res) => {
  const files = fs.readdirSync(dataDir);
  console.log("[LIST]");
  res.json({ success: true, files });
});

// Render.com memberikan PORT otomatis
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 JSON Storage API running on port ${PORT}`);
});
