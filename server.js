import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HALAMAN UTAMA (tampilkan index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// SUPABASE
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET SEMUA HEWAN
app.get("/hewan", async (req, res) => {
  const { data, error } = await supabase.from("hewan").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// SEARCH HEWAN
app.get("/hewan/search", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Parameter 'name' wajib" });

  const { data, error } = await supabase
    .from("hewan")
    .select("*")
    .ilike("name", `%${name}%`);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// MODE LOKAL
if (process.env.LOCAL === "true") {
  app.listen(4700, () => console.log("Local: http://localhost:4700"));
}
