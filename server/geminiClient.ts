import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
let runtimeApiKey: string = "";
let quotaCooldownUntil = 0;

// Auto-init ngay khi module load — dùng GEMINI_API_KEY trong .env
// User không cần nhập key thủ công qua modal
if (process.env.GEMINI_API_KEY) {
  runtimeApiKey = process.env.GEMINI_API_KEY.trim();
  aiClient = new GoogleGenAI({
    apiKey: runtimeApiKey,
    httpOptions: { headers: { "User-Agent": "cung-on-luyen" } },
  });
  console.log("[GeminiClient] ✅ AI client khởi tạo tự động từ GEMINI_API_KEY");
}

export function setRuntimeApiKey(key: string) {
  runtimeApiKey = key.trim();
  if (runtimeApiKey) {
    aiClient = new GoogleGenAI({
      apiKey: runtimeApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    quotaCooldownUntil = 0;
  } else {
    aiClient = null;
  }
}

export function getAiClient(): GoogleGenAI | null {
  const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function isAiConfigured(): boolean {
  return Boolean(runtimeApiKey || process.env.GEMINI_API_KEY);
}

/**
 * Kiểm tra tính hợp lệ và kết nối của Gemini API Key
 */
export async function testGeminiApiKey(apiKey: string): Promise<{ success: boolean; model?: string; error?: string }> {
  try {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      return { success: false, error: "Khóa API không được để trống" };
    }
    const testClient = new GoogleGenAI({
      apiKey: cleanKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const response = await testClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Chào bạn! Hãy trả lời đúng chữ 'SẴN SÀNG'.",
    });

    if (response?.text) {
      return { success: true, model: "gemini-2.5-flash" };
    }
    return { success: false, error: "Không nhận được phản hồi từ mô hình Gemini." };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes("API_KEY_INVALID") || msg.includes("400")) {
      return { success: false, error: "API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại trên Google AI Studio." };
    }
    if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
      return { success: false, error: "API Key hợp lệ nhưng đã chạm giới hạn lượt gọi (Quota limit 429). Vui lòng thử lại sau ít phút." };
    }
    return { success: false, error: msg };
  }
}

/**
 * Thẩm định nội dung với Gemini cùng cơ chế tự động thử lại và dự phòng model,
 * sử dụng model Google GenAI chuẩn: gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash.
 */
export async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: string;
    config?: any;
    primaryModel?: string;
  }
): Promise<string | null> {
  // Nếu đang trong thời gian tạm hoãn quota, chuyển sang bộ dự phòng
  if (Date.now() < quotaCooldownUntil) {
    return null;
  }

  const candidateModels = [
    params.primaryModel || "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
  ];

  for (const model of candidateModels) {
    try {
      const configForModel: any = { ...(params.config || {}) };
      // Chỉ áp dụng thinkingConfig cho các model hỗ trợ (gemini-2.5 trở lên)
      if (model.includes("2.5") && !configForModel.thinkingConfig) {
        configForModel.thinkingConfig = { thinkingBudget: 0 };
      } else if (!model.includes("2.5")) {
        delete configForModel.thinkingConfig;
      }

      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: configForModel,
      });

      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      const errMsg = String(err?.message || err || "");
      if (
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("429") ||
        errMsg.includes("quota")
      ) {
        console.warn("[Gemini API] Quota tạm thời đầy hoặc giới hạn lượt, kích hoạt ngay fallback không độ trễ.");
        quotaCooldownUntil = Date.now() + 60_000;
        return null;
      }
      console.warn(`[Gemini Fallback] Model ${model} gặp lỗi: ${errMsg.slice(0, 100)}`);
    }
  }

  return null;
}

