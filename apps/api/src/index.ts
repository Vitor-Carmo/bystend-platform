import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { config } from "dotenv";
import { router } from "./routes/index.js";

config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const port = parseInt(process.env.API_PORT ?? "4000", 10);

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api", router);

app.listen(port, () => {
  console.log(`Byst.end API running on http://localhost:${port}`);
});
