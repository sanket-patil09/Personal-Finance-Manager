// create express app and the routes/endpoints
import express from "express";
import cors from "cors";
import clerkRouter from "./routes/clerk.routes";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use("/api/clerk", clerkRouter);

export default app;
