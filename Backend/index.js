import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";
import { sentimentAnalysis } from "./controller.js";

config();


const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.get("/comments", sentimentAnalysis);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
