import { Request, Response } from "express";
import express from "express";

const app = express();
const port = 8080;

app.get("/health", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
