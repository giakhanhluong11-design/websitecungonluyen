import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import configRoutes from "./server/routes/configRoutes";
import gradingRoutes from "./server/routes/gradingRoutes";
import generationRoutes, { replenishSubjectPool } from "./server/routes/generationRoutes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // ── Routes ──────────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    // health check delegated; re-export for simplicity via configRoutes
    res.redirect(307, "/api/config/health");
  });
  app.use("/api/config", configRoutes);
  app.use("/api/grade", gradingRoutes);
  app.use("/api/generate", generationRoutes);

  // ── Warm Exam Pool — nạp đệm ngầm sau khi server khởi chạy ─────────────
  setTimeout(() => {
    replenishSubjectPool("toan");
    replenishSubjectPool("van");
    replenishSubjectPool("anh");
  }, 1000);

  // ── Vite dev middleware hoặc static production build ────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
