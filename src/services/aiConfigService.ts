export interface AiConfigStatus {
  configured: boolean;
  hasEnvKey: boolean;
  model: string;
  fallbackModels: string[];
}

export async function fetchAiStatus(): Promise<AiConfigStatus> {
  try {
    const res = await fetch('/api/config/ai-status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Lỗi lấy trạng thái AI:', e);
  }
  return {
    configured: false,
    hasEnvKey: false,
    model: 'gemini-2.5-flash',
    fallbackModels: ['gemini-2.0-flash', 'gemini-1.5-flash']
  };
}

export async function saveGeminiKey(apiKey: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/config/gemini-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: apiKey.trim() })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e?.message || 'Không thể kết nối máy chủ' };
  }
}

export async function testGeminiKey(apiKey?: string): Promise<{ success: boolean; model?: string; error?: string }> {
  try {
    const res = await fetch('/api/config/test-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: apiKey ? apiKey.trim() : undefined })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e?.message || 'Không thể kết nối máy chủ' };
  }
}
