import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { isAiConfigured, setRuntimeApiKey, testGeminiApiKey } from "../geminiClient";
import fs from "fs";
import path from "path";

const router = Router();

// Rate limit: 20 yêu cầu/phút/IP cho các endpoint cấu hình
const configLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút." },
});

router.use(configLimiter);

// GET /api/health
router.get("/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: isAiConfigured() });
});

// GET /api/config/ai-status
router.get("/ai-status", (_req, res) => {
  res.json({
    configured: isAiConfigured(),
    hasEnvKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-2.5-flash",
    fallbackModels: ["gemini-2.0-flash", "gemini-1.5-flash"],
  });
});

// POST /api/config/test-key
router.post("/test-key", async (req, res) => {
  try {
    const { apiKey } = req.body || {};
    const keyToTest =
      apiKey && typeof apiKey === "string" && apiKey.trim()
        ? apiKey.trim()
        : process.env.GEMINI_API_KEY || "";
    if (!keyToTest) {
      return res.status(400).json({
        success: false,
        error: "Chưa có API Key để kiểm tra. Vui lòng nhập khóa API.",
      });
    }
    const result = await testGeminiApiKey(keyToTest);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Lỗi kiểm tra API Key",
    });
  }
});

// POST /api/config/gemini-key
router.post("/gemini-key", (req, res) => {
  try {
    const { apiKey } = req.body || {};
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return res.status(400).json({ success: false, error: "API Key không hợp lệ" });
    }
    const cleanKey = apiKey.trim();
    setRuntimeApiKey(cleanKey);
    process.env.GEMINI_API_KEY = cleanKey;

    try {
      const envPath = path.resolve(process.cwd(), ".env.local");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
        if (envContent.includes("GEMINI_API_KEY=")) {
          envContent = envContent.replace(
            /GEMINI_API_KEY=.*(\r?\n|$)/,
            `GEMINI_API_KEY="${cleanKey}"$1`
          );
        } else {
          envContent += `\nGEMINI_API_KEY="${cleanKey}"\n`;
        }
      } else {
        envContent = `GEMINI_API_KEY="${cleanKey}"\n`;
      }
      fs.writeFileSync(envPath, envContent, "utf-8");
    } catch (fileErr) {
      console.warn(
        "Không thể ghi .env.local, API Key được kích hoạt ở bộ nhớ runtime:",
        fileErr
      );
    }

    return res.json({ success: true, message: "Kích hoạt Gemini AI thành công!" });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Lỗi thiết lập API Key",
    });
  }
});

export default router;
