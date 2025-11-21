import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

// ============ ROUTE ROOT (FIX TIMEOUT VERCEL) ============
app.get("/", (req, res) => {
  res.json({
    status: "API Hewan Aktif",
    message: "Gunakan endpoint /hewan atau /hewan/search",
    uptime: process.uptime(),
  });
});
// ==========================================================

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ============ GET SEMUA HEWAN ============
app.get("/hewan", async (req, res) => {
  const { data, error } = await supabase.from("hewan").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

// ============ SEARCH HEWAN BERDASARKAN NAMA ============
app.get("/hewan/search", async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Parameter 'name' wajib diisi" });
  }

  const { data, error } = await supabase
    .from("hewan")
    .select("*")
    .ilike("name", `%${name}%`);

  if (error) return res.status(500).json({ error });

  res.json(data);
});

// ============ MODE LOKAL ============
if (process.env.LOCAL === "true") {
  app.listen(4700, () =>
    console.log("SERVER LOKAL JALAN di http://localhost:4700")
  );
}
