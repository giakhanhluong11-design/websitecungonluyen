import { testGeminiApiKey } from "./server/geminiClient.ts";
import "dotenv/config";

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("No key found in .env");
    return;
  }
  console.log("Testing key...");
  const res = await testGeminiApiKey(key);
  console.log(res);
}

main().catch(console.error);
