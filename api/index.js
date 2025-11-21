// api/index.js
const express = require("express");
const serverless = require("serverless-http");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Default Route
app.get("/", (req, res) => {
  res.send("🐾 API Hewan is Running — Single File Version!");
});

// GET Semua Hewan + Search
app.get("/hewan", async (req, res) => {
  try {
    const { name, condition } = req.query;

    let query = supabase.from("hewan").select("*");

    if (name) query = query.ilike("name", `%${name}%`);
    if (condition) query = query.ilike("condition", `%${condition}%`);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Hewan Baru
app.post("/hewan", async (req, res) => {
  try {
    const {
      name,
      condition,
      origin,
      short_description,
      long_description,
      image_url
    } = req.body;

    const { data, error } = await supabase
      .from("hewan")
      .insert([
        {
          name,
          condition,
          origin,
          short_description,
          long_description,
          image_url
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT Update Hewan
app.put("/hewan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    const { data, error } = await supabase
      .from("hewan")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Hewan
app.delete("/hewan/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("hewan")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: `Hewan dengan ID ${id} berhasil dihapus.` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOCAL SERVER
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4700;
  app.listen(PORT, () => console.log("LOCAL: http://localhost:" + PORT));
}

// EXPORT FOR VERCEL
module.exports = app;
module.exports.handler = serverless(app);
