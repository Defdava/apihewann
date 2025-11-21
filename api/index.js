// api/index.js
import serverless from "serverless-http";
import { app } from "../server.js";

// Hapus config atau gunakan runtime yang valid
export const config = { 
  runtime: "nodejs"  // Gunakan "nodejs" saja, bukan "nodejs20.x"
};

export default serverless(app);