import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/hewan", async (req, res) => {
  const { data, error } = await supabase.from("hewan").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data);
});

if (process.env.LOCAL === "true") {
  app.listen(4700, () => console.log("LOCAL: http://localhost:4700"));
}
