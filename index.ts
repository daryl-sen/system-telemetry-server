import { Request, Response } from "express";
import express from "express";
import getTelemetryService from "./services/getTelemetryService";

const app = express();
const port = 8080;

app.get("/telemetry", async (req: Request, res: Response) => {
  res.json(await getTelemetryService(req.query.omitGpu === "true"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
