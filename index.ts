import express, { Request, Response } from "express";
import cors from "cors";
import { Readable } from "stream";
import getTelemetryService from "./services/getTelemetryService";

const app = express();
const port = 8080;

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.get("/telemetry", async (req: Request, res: Response) => {
  res.json(await getTelemetryService(req.query.omitGpu === "true"));
});

// TODO: refactor
app.get("/stream", (req: Request, res: Response) => {
  const readable = new Readable({
    async read() {},
  });

  res.setHeader("Content-Type", "application/json");

  const intervalId = setInterval(async () => {
    const telemetryData = await getTelemetryService(
      req.query.omitGpu === "true"
    );
    readable.push(JSON.stringify(telemetryData));
  }, 1000); // Adjust the interval as needed

  readable.pipe(res);

  req.on("close", () => {
    clearInterval(intervalId);
    readable.push(null); // End the stream
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
