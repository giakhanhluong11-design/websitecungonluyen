import express from "express";
import serverless from "serverless-http";
import configRoutes from "../../server/routes/configRoutes";
import gradingRoutes from "../../server/routes/gradingRoutes";
import generationRoutes from "../../server/routes/generationRoutes";

const app = express();
app.use(express.json({ limit: "15mb" }));

// Chuyển tiếp các route API
app.use("/api/config", configRoutes);
app.use("/api/grade", gradingRoutes);
app.use("/api/generate", generationRoutes);

export const handler = serverless(app);
