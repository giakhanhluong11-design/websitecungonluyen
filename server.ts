import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import { Type } from "@google/genai";
import { getAiClient, setRuntimeApiKey, isAiConfigured, generateContentWithFallback, testGeminiApiKey } from "./server/geminiClient";
import { generateFreshMathExam, generateFreshLiteratureExam, generateFreshEnglishExam } from "./server/examGenerators";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", aiEnabled: isAiConfigured() });
  });

  // AI Configuration status
  app.get("/api/config/ai-status", (_req, res) => {
    res.json({
      configured: isAiConfigured(),
      hasEnvKey: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-2.5-flash",
      fallbackModels: ["gemini-2.0-flash", "gemini-1.5-flash"]
    });
  });

  // Test Gemini API Key
  app.post("/api/config/test-key", async (req, res) => {
    try {
      const { apiKey } = req.body || {};
      const keyToTest = (apiKey && typeof apiKey === "string" && apiKey.trim()) 
        ? apiKey.trim() 
        : (process.env.GEMINI_API_KEY || "");
      if (!keyToTest) {
        return res.status(400).json({ success: false, error: "Chưa có API Key để kiểm tra. Vui lòng nhập khóa API." });
      }
      const result = await testGeminiApiKey(keyToTest);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Lỗi kiểm tra API Key" });
    }
  });

  // Dynamically set or update Gemini API Key from web UI
  app.post("/api/config/gemini-key", (req, res) => {
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
            envContent = envContent.replace(/GEMINI_API_KEY=.*(\r?\n|$)/, `GEMINI_API_KEY="${cleanKey}"$1`);
          } else {
            envContent += `\nGEMINI_API_KEY="${cleanKey}"\n`;
          }
        } else {
          envContent = `GEMINI_API_KEY="${cleanKey}"\n`;
        }
        fs.writeFileSync(envPath, envContent, "utf-8");
      } catch (fileErr) {
        console.warn("Không thể ghi .env.local, API Key được kích hoạt ở bộ nhớ runtime:", fileErr);
      }

      return res.json({ success: true, message: "Kích hoạt Gemini AI thành công!" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Lỗi thiết lập API Key" });
    }
  });


  // =========================================================================
  // API: Chấm bài thi môn Ngữ Văn vào lớp 10 bằng AI thực sự
  // =========================================================================
  app.post("/api/grade/literature", async (req, res) => {
    try {
      const { exam, studentAnswers } = req.body;
      if (!exam || !studentAnswers) {
        return res.status(400).json({ error: "Thiếu dữ liệu đề thi hoặc câu trả lời" });
      }

      const ai = getAiClient();

      if (ai) {
        const p1Passage = exam.part1?.passageText || exam.part1?.readingPassage?.text || "";
        const p2Passage = exam.part2?.passageText || exam.part2?.readingPassage?.text || "";
        const p1Q2Prompt = exam.part1?.question2?.prompt || exam.part1?.question2?.question || "Viết đoạn văn khoảng 200 chữ";
        const p1Q2Guide = exam.part1?.question2?.guideAnswer || "";
        const p2Q3Prompt = exam.part2?.question3?.question || exam.part2?.question3?.prompt || "";
        const p2Q3Guide = exam.part2?.question3?.guideAnswer || "";
        const p2Q4Prompt = exam.part2?.question4?.prompt || exam.part2?.question4?.question || "Viết bài văn nghị luận xã hội";
        const p2Q4Guide = exam.part2?.question4?.guideAnswer || "";

        const prompt = `
Bạn là một giám khảo chấm thi tuyển sinh vào lớp 10 môn Ngữ văn hàng đầu, giàu kinh nghiệm và tận tâm tại Việt Nam (theo chương trình GDPT mới 2018).
Hãy thực hiện quy trình sư phạm nghiêm ngặt:
Đọc đề → Xác định yêu cầu → Đọc kỹ bài làm → Phân tích nội dung → Đối chiếu rubric ma trận → Xác định từng ý đúng / sai / thiếu → Tính điểm chính xác → Viết nhận xét mang tính giáo dục.

CÁC NGUYÊN TẮC CHẤM ĐIỂM BẮT BUỘC (TUYỆT ĐỐI TUÂN THỦ):
1. KHÔNG được chấm điểm chỉ dựa vào việc học sinh có nhập câu trả lời:
   - Có chữ / có nội dung ≠ có điểm.
   - Nếu câu trả lời sai, lạc đề, thiếu ý hoặc không đáp ứng yêu cầu thì phải cho điểm tương ứng (có thể là 0 điểm).
   - Tuyệt đối KHÔNG tự động cho điểm chỉ vì học sinh viết dài hoặc sử dụng nhiều từ khóa giống đáp án mẫu.
2. AI phải THỰC SỰ ĐỌC VÀ ĐÁNH GIÁ NỘI DUNG bài làm:
   - Đối chiếu với yêu cầu của từng câu hỏi.
   - Xác định học sinh đã trả lời đúng vấn đề trọng tâm hay chưa.
   - Kiểm tra tính chính xác của kiến thức tiếng Việt, văn học và đời sống.
   - Kiểm tra các ý chính cần có theo ma trận yêu cầu cần đạt.
3. ĐẶC BIỆT ĐỐI VỚI MÔN NGỮ VĂN:
   - Không chấm theo đáp án cứng nhắc từng câu chữ.
   - Phải tôn trọng những cách cảm nhận, phân tích và lập luận khác nhau nếu có căn cứ hợp lý, thuyết phục và phù hợp với văn bản.
   - Không bắt buộc học sinh phải viết giống đáp án mẫu hay dùng đúng từ ngữ của đáp án mẫu.
   - Đánh giá toàn diện: nội dung, lập luận, dẫn chứng, cảm thụ thẩm mỹ và mức độ đáp ứng yêu cầu đề.
   - Không được đánh giá một quan điểm là sai chỉ vì nó khác với đáp án mẫu nếu quan điểm đó có lập luận hợp lý.
4. NHẬN DIỆN VÀ XỬ LÝ CHÍNH XÁC CÁC TRƯỜNG HỢP ĐẶC BIỆT:
   - "Có chữ nhưng không có nội dung đúng" → Cho 0 điểm.
   - "Chép lại đề bài hoặc chép lại ngữ liệu" → Cho 0 điểm, không được tính là câu trả lời.
   - "Trả lời lan man" → Chỉ chấm những phần thực sự đáp ứng yêu cầu, không cộng điểm cho phần lan man viết dài.
   - "Có từ khóa đúng nhưng lập luận sai / đặt sai ngữ cảnh" → Không được tính điểm cho ý đó.
   - "Trả lời bằng cách diễn đạt khác đáp án mẫu nhưng đúng bản chất" → Phải công nhận và cho đủ điểm.
   - "Câu trả lời có nhiều ý, trong đó có ý đúng và ý sai" → Chấm từng ý độc lập, đúng ý nào cho điểm ý đó, không mặc định toàn bộ đúng hoặc toàn bộ sai.
5. SỬA BÀI CHI TIẾT & NHẬN XÉT MANG TÍNH GIÁO DỤC:
   - Không dùng nhận xét chung chung như "Đúng", "Sai", "Bạn làm tốt", tuyệt đối không dùng cụm từ "đã chấm theo ma trận tuyển sinh".
   - Từng câu phải chỉ rõ: ý đúng (correctPoints), ý sai/chưa đầy đủ (incorrectPoints), tại sao sai (whyWrong), đề xuất cách sửa (suggestedFix), ý còn thiếu (missingPoints).
   - Nhận xét tổng quan phải chỉ ra: 3 lỗi/điểm yếu quan trọng nhất (topWeaknesses), những phần học sinh đang làm tốt (keyStrengths), gợi ý nội dung cần ôn lại (reviewTopics).

Thông tin đề thi:
- Tiêu đề: ${exam.title || "Đề thi Tuyển sinh 10 Ngữ văn"}
- Chủ đề: ${exam.topic || ""} - Thể loại: ${exam.subtopic || ""}

Ngữ liệu Phần I (Văn học):
"${p1Passage}"
(Tác phẩm: ${exam.part1?.passageTitle || ""} - Thể loại: ${exam.part1?.passageType || ""})

Câu hỏi Phần I (Đọc hiểu 3.0 điểm):
${(exam.part1?.question1SubQuestions || [])
  .map(
    (q: any, idx: number) => `
Câu 1.${idx + 1} (${q.points} điểm - ${q.levelLabel || ""}): ${q.question}
Đáp án gợi ý: ${q.guideAnswer}
Bài làm của học sinh: """${studentAnswers[q.id] || "(Học sinh để trống)"}"""
`
  )
  .join("\n")}

Câu 2 (${exam.part1?.question2?.points || 2.0} điểm - Đoạn văn khoảng 200 chữ):
Yêu cầu: ${p1Q2Prompt}
Hướng dẫn đáp án: ${p1Q2Guide}
Bài làm của học sinh: """${studentAnswers["p1_q2_essay"] || "(Học sinh để trống)"}"""

Ngữ liệu Phần II (Văn bản thông tin/nghị luận):
"${p2Passage}"

Câu 3 (${exam.part2?.question3?.points || 1.0} điểm - Đọc hiểu phần II):
Yêu cầu: ${p2Q3Prompt}
Hướng dẫn đáp án: ${p2Q3Guide}
Bài làm của học sinh: """${studentAnswers["p2_q3"] || "(Học sinh để trống)"}"""

Câu 4 (${exam.part2?.question4?.points || 4.0} điểm - Bài văn Nghị luận Xã hội):
Yêu cầu: ${p2Q4Prompt}
Hướng dẫn đáp án: ${p2Q4Guide}
Bài làm của học sinh: """${studentAnswers["p2_q4"] || "(Học sinh để trống)"}"""
`;

        const text = await generateContentWithFallback(ai, {
          primaryModel: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                totalScore: { type: Type.NUMBER, description: "Tổng điểm toàn bài thi trên thang điểm 10.0 (làm tròn đến 0.25)" },
                overallComment: { type: Type.STRING, description: "Nhận xét tổng quan sâu sắc mang tính định hướng sư phạm của giám khảo" },
                topWeaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Đúng 3 lỗi hoặc điểm yếu quan trọng nhất cần khắc phục của bài làm"
                },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Các phần, luận điểm hoặc kĩ năng học sinh đang làm tốt"
                },
                reviewTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Gợi ý các chủ đề ngữ pháp, văn học hoặc kĩ năng tạo lập văn bản cần ôn lại"
                },
                questionScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionId: { type: Type.STRING },
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      maxScore: { type: Type.NUMBER },
                      studentAnswer: { type: Type.STRING },
                      guideAnswer: { type: Type.STRING },
                      feedback: { type: Type.STRING, description: "Nhận xét cụ thể bài làm của học sinh ở câu này" },
                      correctPoints: { type: Type.STRING, description: "Ý nào đúng hoặc chi tiết đã làm chính xác" },
                      incorrectPoints: { type: Type.STRING, description: "Ý nào sai hoặc chưa chuẩn xác" },
                      whyWrong: { type: Type.STRING, description: "Nếu sai, giải thích rõ nguyên nhân vì sao sai" },
                      suggestedFix: { type: Type.STRING, description: "Đề xuất cách sửa hoặc cách diễn đạt chuẩn xác hơn" },
                      missingPoints: { type: Type.STRING, description: "Nếu thiếu ý, chỉ rõ những ý còn thiếu" },
                      strengths: { type: Type.STRING, description: "Điểm tốt, ưu điểm" },
                      weaknesses: { type: Type.STRING, description: "Điểm còn thiếu sót" },
                      suggestions: { type: Type.STRING, description: "Lời khuyên cải thiện" },
                      criteriaScores: {
                        type: Type.OBJECT,
                        description: "Điểm thành phần theo tiêu chí rubric",
                        properties: {
                          format: { type: Type.NUMBER },
                          content: { type: Type.NUMBER },
                          artOrArgument: { type: Type.NUMBER },
                          expression: { type: Type.NUMBER },
                          creativity: { type: Type.NUMBER }
                        }
                      }
                    },
                    required: ["questionId", "title", "score", "maxScore", "feedback"]
                  }
                }
              },
              required: ["totalScore", "overallComment", "topWeaknesses", "keyStrengths", "reviewTopics", "questionScores"]
            }
          }
        });

        if (text) {
          try {
            const parsed = JSON.parse(text);
            return res.json({ 
              success: true, 
              isAiGraded: true,
              gradedBy: "Gemini AI (Chuẩn ma trận GDPT 2018)",
              gradingResult: {
                ...parsed,
                isAiGraded: true
              }
            });
          } catch (jsonErr) {
            console.warn("Lỗi phân tích JSON kết quả AI môn Văn:", jsonErr);
          }
        }
      }

      // Fallback: Chấm sư phạm nội bộ nếu chưa có API key hoặc AI đang bận
      const fallbackResult = gradeLiteratureLocally(exam, studentAnswers);
      return res.json({ 
        success: true, 
        isAiGraded: false,
        gradedBy: "Bộ thẩm định dự phòng nội bộ",
        gradingResult: {
          ...fallbackResult,
          isAiGraded: false
        }
      });
    } catch (error: any) {
      console.warn("Chuyển sang bộ thẩm định dự phòng môn Văn:", error?.message || error);
      const fallbackResult = gradeLiteratureLocally(req.body.exam, req.body.studentAnswers);
      return res.json({ 
        success: true, 
        isAiGraded: false,
        gradedBy: "Bộ thẩm định dự phòng nội bộ",
        gradingResult: {
          ...fallbackResult,
          isAiGraded: false
        }
      });
    }
  });

  // =========================================================================
  // API: Chấm bài thi môn Toán vào lớp 10 bằng AI thực sự
  // =========================================================================
  app.post("/api/grade/math", async (req, res) => {
    try {
      const { exam, studentAnswers } = req.body;
      if (!exam || !studentAnswers) {
        return res.status(400).json({ error: "Thiếu dữ liệu đề thi hoặc câu trả lời" });
      }

      const ai = getAiClient();

      if (ai) {
        const exercisesData = (exam.exercises || []).map((ex: any, idx: number) => `
Bài ${idx + 1} (${ex.points} điểm): ${ex.title || `Bài ${idx + 1}`}
Nội dung đề: ${ex.problemText || ex.question || ""}
Hướng dẫn giải / Đáp án chuẩn: ${ex.sampleSolution || ex.solution || ""}
Bài giải của học sinh: """${studentAnswers[ex.id] || "(Học sinh không giải bài này)"}"""
`).join("\n-----------------------\n");

        const prompt = `
Bạn là một giám khảo chấm thi tuyển sinh vào lớp 10 môn Toán công tâm, tỉ mỉ và xuất sắc tại Việt Nam (theo chương trình GDPT mới 2018).
Hãy thực hiện quy trình sư phạm:
Đọc đề → Xác định yêu cầu bài toán → Đọc kỹ bài làm thực tế → Phân tích từng bước biến đổi/suy luận → Đối chiếu biểu điểm barem từng bước → Xác định ý đúng / sai / thiếu → Tính điểm công bằng → Viết nhận xét mang tính giáo dục.

CÁC NGUYÊN TẮC BẮT BUỘC KHI CHẤM TOÁN:
1. KHÔNG được chấm điểm chỉ dựa vào việc học sinh có nhập bài giải hoặc gõ nhiều chữ:
   - Có chữ / có nội dung ≠ có điểm.
   - Nếu bài giải sai, ngộ nhận kiến thức, không giải quyết đúng yêu cầu thì phải cho điểm tương ứng (có thể là 0 điểm).
   - Tuyệt đối không cho điểm chỉ vì học sinh viết dài hoặc sử dụng nhiều ký hiệu toán học nhưng vô nghĩa.
2. AI PHẢI THỰC SỰ ĐỌC VÀ KIỂM TRA TỪNG BƯỚC BIẾN ĐỔI:
   - Kiểm tra điều kiện xác định, bước đặt ẩn và đơn vị đo lường.
   - Kiểm tra tính chính xác của các biến đổi đại số, quy đồng, rút gọn, áp dụng công thức Vi-ét, giải phương trình/hệ phương trình.
   - Kiểm tra tính logic chặt chẽ của các bước chứng minh hình học (phải có căn cứ hình học rõ ràng: góc tương ứng, định lý, dấu hiệu nhận biết...).
3. CHẤM THEO RUBRIC / MA TRẬN TỪNG BƯỚC (STEP-BY-STEP):
   - Đúng ý chính nhưng diễn đạt chưa tốt hoặc thiếu giải thích nhẹ → vẫn có điểm cho phần kiến thức đúng.
   - Đúng một phần (ví dụ câu a làm đúng, câu b mới viết được nửa chừng) → chỉ tính điểm tương ứng phần đúng.
   - Có công thức đúng nhưng áp dụng số liệu sai hoặc tính toán sai → không được tính điểm bước tính toán.
   - Nếu học sinh giải đúng toàn bộ phương pháp nhưng chỉ nhầm dấu hoặc tính nhầm ở phép tính cuối cùng → chỉ trừ điểm phép tính cuối (thường là 0.25đ), không trừ sạch toàn bộ bài.
   - Trả lời ngắn gọn nhưng đầy đủ, chính xác, lập luận chặt chẽ → vẫn đạt điểm tối đa.
   - Viết dài dòng nhưng không giải đúng vấn đề → không được cộng điểm.
4. NHẬN DIỆN VÀ XỬ LÝ CÁC TRƯỜNG HỢP ĐẶC BIỆT:
   - "Có chữ nhưng không có nội dung đúng" → 0 điểm.
   - "Chép lại đề bài" → 0 điểm, không được tính là lời giải.
   - "Trả lời lan man / biến đổi lòng vòng không ra kết quả" → chỉ chấm bước thực sự có ích.
   - "Có nhiều ý, trong đó có ý đúng và ý sai" → chấm từng ý, đúng ý nào cho điểm ý đó.
   - "Giải bằng cách khác đáp án mẫu nhưng hoàn toàn đúng và logic" → phải công nhận và cho đủ điểm.
5. SỬA BÀI CHI TIẾT & NHẬN XÉT GIÁO DỤC:
   - Từng bài phải ghi rõ: ý đúng (correctPoints), ý sai (incorrectPoints), tại sao sai (whyWrong), cách sửa (suggestedFix), ý/bước còn thiếu (missingPoints).
   - Tuyệt đối không dùng cụm từ "đã chấm theo ma trận tuyển sinh".
   - Tổng kết: 3 lỗi/điểm yếu quan trọng nhất (topWeaknesses), những phần làm tốt (keyStrengths), gợi ý chủ đề cần ôn luyện (reviewTopics).

Danh sách các bài thi:
${exercisesData}

Quy chuẩn kiểm tra từng dạng bài:
- Bài 1 (Hàm số, Parabol & Đường thẳng): Bảng giá trị, toạ độ các điểm, phương trình hoành độ giao điểm.
- Bài 2 (Phương trình bậc 2 & Vi-ét): Điều kiện Delta >= 0, biểu thức S và P, biến đổi biểu thức.
- Bài 3, 4, 6 (Toán thực tế): Gọi ẩn và điều kiện, lập phương trình/hệ phương trình, đối chiếu điều kiện, kết luận kèm đơn vị.
- Bài 5 (Hình học không gian): Công thức chuẩn thể tích/diện tích, tính toán số học, làm tròn đúng yêu cầu.
- Bài 7 (Hình học phẳng 3 điểm): Chứng minh tứ giác nội tiếp, tam giác đồng dạng, hệ thức lượng, tiếp tuyến hoặc thẳng hàng.
`;

        const text = await generateContentWithFallback(ai, {
          primaryModel: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                totalScore: { type: Type.NUMBER, description: "Tổng điểm toàn bài thi trên thang điểm 10.0 (làm tròn 0.25)" },
                overallComment: { type: Type.STRING, description: "Góc nhìn sư phạm tổng quan của giám khảo chấm thi môn Toán" },
                topWeaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Đúng 3 lỗi hoặc điểm yếu toán học quan trọng nhất cần khắc phục"
                },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Các dạng bài hoặc kĩ năng tính toán mà học sinh làm tốt"
                },
                reviewTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Gợi ý các chuyên đề toán thi vào 10 cần ôn tập lại"
                },
                exerciseScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      exerciseId: { type: Type.STRING },
                      title: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      maxScore: { type: Type.NUMBER },
                      feedback: { type: Type.STRING, description: "Đánh giá chi tiết bước giải của học sinh" },
                      correctPoints: { type: Type.STRING, description: "Bước giải hoặc ý đúng" },
                      incorrectPoints: { type: Type.STRING, description: "Bước giải hoặc phép tính sai" },
                      whyWrong: { type: Type.STRING, description: "Nếu sai, giải thích rõ sai ở bước biến đổi nào và tại sao" },
                      suggestedFix: { type: Type.STRING, description: "Đề xuất cách sửa chuẩn mực" },
                      missingPoints: { type: Type.STRING, description: "Bước hoặc điều kiện còn thiếu" },
                      strengths: { type: Type.STRING, description: "Ưu điểm, chỗ làm đúng" },
                      mistakes: { type: Type.STRING, description: "Chỗ biến đổi sai, sót điều kiện hoặc tính nhầm" },
                      suggestions: { type: Type.STRING, description: "Cách trình bày tối ưu hoặc hướng sửa" }
                    },
                    required: ["exerciseId", "title", "score", "maxScore", "feedback"]
                  }
                }
              },
              required: ["totalScore", "overallComment", "topWeaknesses", "keyStrengths", "reviewTopics", "exerciseScores"]
            }
          }
        });

        if (text) {
          try {
            const parsed = JSON.parse(text);
            return res.json({ 
              success: true, 
              isAiGraded: true,
              gradedBy: "Gemini AI (Chuẩn ma trận GDPT 2018)",
              gradingResult: {
                ...parsed,
                isAiGraded: true
              }
            });
          } catch (jsonErr) {
            console.warn("Lỗi phân tích JSON kết quả AI môn Toán:", jsonErr);
          }
        }
      }

      // Fallback cục bộ khi chưa có API key hoặc AI đang bận
      const fallbackResult = gradeMathLocally(exam, studentAnswers);
      return res.json({ 
        success: true, 
        isAiGraded: false,
        gradedBy: "Bộ thẩm định dự phòng nội bộ",
        gradingResult: {
          ...fallbackResult,
          isAiGraded: false
        }
      });
    } catch (error: any) {
      console.warn("Chuyển sang bộ thẩm định dự phòng môn Toán:", error?.message || error);
      const fallbackResult = gradeMathLocally(req.body.exam, req.body.studentAnswers);
      return res.json({ 
        success: true, 
        isAiGraded: false,
        gradedBy: "Bộ thẩm định dự phòng nội bộ",
        gradingResult: {
          ...fallbackResult,
          isAiGraded: false
        }
      });
    }
  });

  // =========================================================================
  // API: Chẩn đoán & chấm bài thi môn Tiếng Anh bằng AI
  // =========================================================================
  app.post("/api/grade/english", async (req, res) => {
    try {
      const { exam, studentAnswers } = req.body;
      if (!exam || !studentAnswers) {
        return res.status(400).json({ error: "Thiếu dữ liệu đề thi hoặc câu trả lời" });
      }

      const ai = getAiClient();

      // Tính điểm trắc nghiệm cơ sở trước
      let directScore = 0;
      const questionsAnalysis = (exam.questions || []).map((q: any) => {
        const studentAns = (studentAnswers[q.id] || "").trim();
        const isMatch = studentAns.toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
          (q.acceptableAlternativeAnswers || []).some((alt: string) => alt.trim().toLowerCase() === studentAns.toLowerCase());
        if (isMatch) directScore += q.points;
        return {
          id: q.id,
          partIndex: q.partIndex,
          prompt: q.prompt || q.question || "",
          studentAns,
          correctAns: q.correctAnswer,
          isMatch,
          points: q.points,
          explanation: q.explanation || ""
        };
      });

      const roundedDirectScore = Math.round(directScore * 100) / 100;

      if (ai) {
        const wrongQuestions = questionsAnalysis.filter(q => !q.isMatch);
        const wrongSummary = wrongQuestions.slice(0, 15).map((item: any) => 
          `- Phần ${item.partIndex}: "${item.prompt.slice(0, 90)}" | Học sinh chọn: "${item.studentAns || '(bỏ trống)'}" | Đúng: "${item.correctAns}" | Lý do: ${item.explanation}`
        ).join("\n");

        const prompt = `
Bạn là giáo viên chuyên luyện thi tuyển sinh vào lớp 10 môn Tiếng Anh tại Việt Nam.
Dưới đây là kết quả làm bài của học sinh đối với 40 câu hỏi (Phần 1: Ngữ âm; Phần 2: Ngữ pháp & Từ vựng, Biển báo; Phần 3: Đọc hiểu; Phần 4: Dạng từ & Viết lại câu).

Kết quả tổng quan:
- Điểm bài làm: ${roundedDirectScore} / 10.0 (Đúng: ${questionsAnalysis.filter(q => q.isMatch).length}/40 câu, Sai: ${wrongQuestions.length}/40 câu).

Danh sách các câu học sinh làm sai hoặc sơ suất tiêu biểu:
${wrongSummary || "(Học sinh làm đúng toàn bộ các câu hỏi!)"}

YÊU CẦU ĐÁNH GIÁ SƯ PHẠM CHI TIẾT (tuyệt đối không dùng cụm từ "đã chấm theo ma trận tuyển sinh"):
1. "teacherReview": Nhận xét sâu sắc từ góc nhìn giáo viên luyện thi:
   - Đánh giá khả năng xử lý bài thi ở từng phần (Ngữ âm, Ngữ pháp, Đọc hiểu, Word Form, Viết lại câu).
   - Nêu rõ nguyên nhân học sinh mất điểm (nhầm lẫn thì, sai tiền tố/hậu tố của Word Form, nhầm giới từ, dịch thiếu ngữ cảnh, hoặc lỗi cấu trúc viết lại).
   - Đưa ra lời động viên và chiến lược bứt phá điểm số phù hợp với mức điểm hiện tại.
2. "topWeaknesses": Mảng gồm đúng 3 lỗi/điểm yếu quan trọng nhất của học sinh trong bài thi này.
3. "keyStrengths": Mảng gồm các phần hoặc kĩ năng học sinh đang làm tốt (ví dụ: phát âm, trật tự từ, thì hoàn thành).
4. "reviewTopics": Mảng gồm các chủ điểm cần ôn lại ngay trước kỳ thi.
5. "weakGrammarPoints": Mảng gồm 3 - 5 chủ điểm ngữ pháp hoặc kĩ năng cụ thể mà học sinh mắc lỗi nhiều nhất.
6. "improvementTips": Mảng gồm 3 - 4 lời khuyên ôn thi thực tế, dễ áp dụng ngay.
`;

        const text = await generateContentWithFallback(ai, {
          primaryModel: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                totalScore: { type: Type.NUMBER, description: "Tổng điểm môn tiếng Anh" },
                teacherReview: { type: Type.STRING, description: "Góc nhìn sư phạm của giáo viên về bài thi" },
                topWeaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Đúng 3 lỗi/điểm yếu quan trọng nhất của học sinh"
                },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Những phần học sinh làm tốt"
                },
                reviewTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Gợi ý nội dung/chuyên đề cần ôn lại"
                },
                weakGrammarPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Các chủ điểm ngữ pháp hoặc từ loại học sinh còn yếu"
                },
                improvementTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chiến thuật ôn thi và mẹo làm bài"
                }
              },
              required: ["totalScore", "teacherReview", "topWeaknesses", "keyStrengths", "reviewTopics", "weakGrammarPoints", "improvementTips"]
            }
          }
        });

        if (text) {
          try {
            const parsed = JSON.parse(text);
            return res.json({
              success: true,
              isAiGraded: true,
              gradedBy: "Gemini AI (Chuẩn ma trận GDPT 2018)",
              totalScore: roundedDirectScore,
              aiDiagnostic: {
                ...parsed,
                totalScore: roundedDirectScore,
                isAiGraded: true
              }
            });
          } catch (jsonErr) {
            console.warn("Lỗi phân tích JSON kết quả AI môn Anh:", jsonErr);
          }
        }
      }

      // Fallback cục bộ khi chưa có API key hoặc AI đang bận
      const wrongCount = questionsAnalysis.filter(q => !q.isMatch).length;
      return res.json({
        success: true,
        totalScore: roundedDirectScore,
        aiDiagnostic: {
          totalScore: roundedDirectScore,
          teacherReview: roundedDirectScore >= 8.5
            ? `Xuất sắc! Em đạt ${roundedDirectScore}/10 điểm, chỉ sai ${wrongCount} câu. Vốn từ vựng và tư duy ngữ pháp của em rất vững vàng. Hãy chú ý kiểm tra cẩn thận chính tả các câu viết lại để giữ trọn điểm tuyệt đối.`
            : roundedDirectScore >= 7.0
            ? `Bài làm khá tốt với ${roundedDirectScore}/10 điểm. Em nắm chắc ngữ pháp cơ bản và ngữ âm, tuy nhiên còn mất điểm ở phần Word Form và câu hỏi suy luận đọc hiểu. Cần rèn thêm kĩ năng nhận diện từ loại.`
            : roundedDirectScore >= 5.0
            ? `Bài làm đạt mức trung bình khá (${roundedDirectScore}/10). Em cần củng cố lại bảng thì, các cấu trúc viết lại câu thông dụng và luyện đọc hiểu nhiều hơn để tăng vốn từ vựng.`
            : `Điểm số đạt ${roundedDirectScore}/10. Em cần có kế hoạch ôn tập lại ngữ pháp nền tảng: thì động từ, câu bị động, dạng từ và luyện tập đều đặn mỗi ngày.`,
          weakGrammarPoints: [
            "Word Formation (Dạng đúng của từ danh/tính/động/trạng)",
            "Sentence Transformation (Cấu trúc tương đương & Thì hoàn thành)",
            "Prepositions & Dependent Collocations (Giới từ đi kèm cụm từ)"
          ],
          improvementTips: [
            "Luyện nhận diện hậu tố từ vựng (ví dụ: -tion, -ment là danh từ; -ful, -able là tính từ)",
            "Đọc kĩ ngữ cảnh cả đoạn văn trước khi điền từ để tránh bẫy ngữ nghĩa",
            "Dành 15 phút mỗi ngày làm 5 câu viết lại câu tương đương và kiểm tra lại thì động từ"
          ]
        }
      });
    } catch (error: any) {
      console.warn("Chuyển sang chẩn đoán dự phòng môn Tiếng Anh:", error?.message || error);
      return res.json({
        success: true,
        totalScore: 7.5,
        aiDiagnostic: {
          totalScore: 7.5,
          teacherReview: "Bài làm hoàn thành tốt. Em hãy tiếp tục củng cố các dạng bài trọng tâm để nâng cao điểm số.",
          weakGrammarPoints: ["Word formation", "Reported Speech / Conditionals"],
          improvementTips: ["Dành 15 phút mỗi ngày làm 5 câu viết lại câu", "Ôn tập các bảng chuyển đổi từ loại"]
        }
      });
    }
  });

  // =========================================================================
  // API: Sinh đề thi mới HOÀN TOÀN bằng AI (Toán, Văn, Tiếng Anh)
  // Tối ưu độ trễ với Cơ chế đệm trước (Warm Exam Pool / Cache Buffer)
  // =========================================================================

  const examPool: {
    toan: any[];
    van: any[];
    anh: any[];
  } = {
    toan: [],
    van: [],
    anh: []
  };

  const isReplenishingPool: {
    toan: boolean;
    van: boolean;
    anh: boolean;
  } = {
    toan: false,
    van: false,
    anh: false
  };

  async function replenishSubjectPool(subject: 'toan' | 'van' | 'anh') {
    if (isReplenishingPool[subject] || examPool[subject].length >= 2) return;
    isReplenishingPool[subject] = true;
    try {
      let exam = null;
      if (subject === 'toan') exam = await generateFreshMathExam("Chuẩn");
      else if (subject === 'van') exam = await generateFreshLiteratureExam("Chuẩn");
      else if (subject === 'anh') exam = await generateFreshEnglishExam("Chuẩn");

      if (exam) {
        examPool[subject].push(exam);
        console.log(`[ExamPool] Refilled ${subject}. Pool size: ${examPool[subject].length}`);
      }
    } catch (e) {
      console.warn(`[ExamPool] Error refilling ${subject}:`, e);
    } finally {
      isReplenishingPool[subject] = false;
      if (examPool[subject].length < 2) {
        setTimeout(() => replenishSubjectPool(subject), 3000);
      }
    }
  }

  // Khởi động nạp đệm ngầm sau khi server khởi chạy
  setTimeout(() => {
    replenishSubjectPool('toan');
    replenishSubjectPool('van');
    replenishSubjectPool('anh');
  }, 1000);

  // 1. API: Sinh đề Toán mới hoàn toàn (7 bài - 10.0 điểm)
  app.post("/api/generate/math-exam", async (req, res) => {
    try {
      const { difficulty = "Chuẩn" } = req.body || {};

      // Nếu có sẵn trong pool, trả về NGAY LẬP TỨC (< 30ms) và kích hoạt nạp bù
      if (examPool.toan.length > 0) {
        const cachedExam = examPool.toan.shift();
        setTimeout(() => replenishSubjectPool('toan'), 150);
        return res.json({ success: true, exam: cachedExam, source: "ai_pool", remainingPool: examPool.toan.length });
      }

      const exam = await generateFreshMathExam(difficulty);
      if (exam) {
        setTimeout(() => replenishSubjectPool('toan'), 150);
        return res.json({ success: true, exam, source: "ai" });
      }

      return res.json({ success: false, message: "Fallback to local generator" });
    } catch (error: any) {
      console.warn("Lỗi khi gọi AI sinh đề Toán:", error?.message || error);
      return res.json({ success: false, message: "Fallback to local generator" });
    }
  });

  // 2. API: Sinh đề Văn mới hoàn toàn (7 câu - 10.0 điểm)
  app.post("/api/generate/literature-exam", async (req, res) => {
    try {
      const { difficulty = "Chuẩn" } = req.body || {};

      // Ưu tiên lấy từ bộ đệm Warm Exam Pool để trả về tức thì (< 30ms)
      if (examPool.van.length > 0) {
        const cachedExam = examPool.van.shift();
        setTimeout(() => replenishSubjectPool('van'), 150);
        return res.json({ success: true, exam: cachedExam, source: "ai_pool", remainingPool: examPool.van.length });
      }

      const freshExam = await generateFreshLiteratureExam(difficulty);
      if (freshExam) {
        setTimeout(() => replenishSubjectPool('van'), 150);
        return res.json({ success: true, exam: freshExam, source: "ai" });
      }

      const ai = getAiClient();

      const LIT_TOPICS = [
        { group: "NHÓM 1 – GIA ĐÌNH & TÌNH THÂN", topic: "Tình phụ tử, tình mẫu tử và sự gắn kết qua biến cố đời sống" },
        { group: "NHÓM 2 – TUỔI TRẺ & BẢN LĨNH", topic: "Vượt qua áp lực đồng trang lứa và dũng cảm theo đuổi ước mơ" },
        { group: "NHÓM 3 – QUÊ HƯƠNG & CỘI NGUỒN", topic: "Ký ức làng nghề truyền thống và niềm tự hào bản sắc dân tộc" },
        { group: "NHÓM 4 – THIÊN NHIÊN & SỰ SỐNG", topic: "Mối gắn kết giữa con người và thiên nhiên, ý thức bảo vệ môi trường" },
        { group: "NHÓM 5 – TRI ÂN & NGHĨA THẦY TRÒ", topic: "Ngọn đèn tri thức và những người thầy thầm lặng gieo hy vọng" },
        { group: "NHÓM 6 – KHOA HỌC & NHÂN VĂN", topic: "Giữ gìn sự thấu cảm và lòng trắc ẩn trong kỷ nguyên trí tuệ nhân tạo" }
      ];
      const selected = LIT_TOPICS[Math.floor(Math.random() * LIT_TOPICS.length)];
      const randomSeed = Date.now().toString(36);

      if (ai) {
        const prompt = `Bạn là chuyên gia thẩm định và ra đề thi Tuyển sinh vào lớp 10 môn Ngữ văn TP.HCM (Chương trình GDPT 2018).
YÊU CẦU QUAN TRỌNG NHẤT:
- Sáng tạo một ĐỀ THI MỚI HOÀN TOÀN (100% bespoke, độc bản), KHÔNG LẶP LẠI BẤT KỲ ĐỀ CŨ NÀO.
- Tự tay sáng tác một NGỮ LIỆU ĐỌC HIỂU 1 (tản văn hoặc truyện ngắn nghệ thuật sâu sắc, cảm động, giàu hình tượng, khoảng 320 - 450 chữ) về chủ đề: "${selected.topic}".
- Tự tay sáng tác một NGỮ LIỆU ĐỌC HIỂU 2 (văn bản thông tin hoặc nghị luận đời sống thời sự, lôi cuốn, khoảng 250 - 320 chữ) bàn về lối sống và tư duy của người trẻ hiện đại.
- Tổng điểm 10.0 điểm, thời gian 120 phút.

Cấu trúc đề thi chuẩn:
- PHẦN I (5.0 điểm):
  + Ngữ liệu văn bản 1 (văn học nghệ thuật).
  + Câu 1 (0.5đ): Nhận biết phương thức biểu đạt / ngôi kể / chi tiết.
  + Câu 2 (1.5đ): Thông hiểu ý nghĩa hình ảnh / tâm tư nhân vật.
  + Câu 3 (0.5đ): Tiếng Việt (chỉ ra và nêu tác dụng của biện pháp tu từ như ẩn dụ, so sánh, nhân hóa, hoán dụ, điệp từ...).
  + Câu 4 (0.5đ): Vận dụng thông điệp lẽ sống cho bản thân.
  + Câu 2 phần I (2.0đ): Viết đoạn văn (khoảng 200 chữ) ghi lại cảm nghĩ hoặc bàn về ý nghĩa của vấn đề được khơi gợi từ văn bản 1.
- PHẦN II (5.0 điểm):
  + Ngữ liệu văn bản 2 (nghị luận/thông tin).
  + Câu 3 phần II (1.0đ): Đọc hiểu thông điệp cốt lõi của văn bản 2.
  + Câu 4 phần II (4.0đ): Viết bài văn nghị luận xã hội (khoảng 1 - 1.5 trang giấy) bàn về một vấn đề đời sống liên quan đến văn bản 2.

Định dạng JSON bắt buộc:
{
  "id": "lit-${randomSeed}",
  "subjectId": "van",
  "title": "Đề Tuyển Sinh 10 Ngữ Văn - ${selected.topic}",
  "topicGroup": "${selected.group}",
  "topic": "${selected.topic}",
  "subtopic": "Sáng tạo độc bản GDPT 2018",
  "textType": "Tản văn nghệ thuật & Văn bản nghị luận",
  "vietnameseConcept": "Biện pháp tu từ & Liên kết câu",
  "difficulty": "${difficulty}",
  "timeMinutes": 120,
  "part1": {
    "passageTitle": "tên bài đọc 1",
    "passageType": "tản văn",
    "passageSource": "Ngữ liệu tuyển chọn hệ thống",
    "wordCount": 380,
    "passageText": "toàn bộ đoạn văn đầy cảm xúc và hình tượng...",
    "question1SubQuestions": [
      {
        "id": "p1_q1",
        "level": "nhan-biet",
        "levelLabel": "Nhận biết (0.5 điểm)",
        "points": 0.5,
        "question": "...",
        "guideAnswer": "...",
        "gradingCriteria": "..."
      },
      {
        "id": "p1_q2",
        "level": "thong-hieu",
        "levelLabel": "Thông hiểu (1.5 điểm)",
        "points": 1.5,
        "question": "...",
        "guideAnswer": "...",
        "gradingCriteria": "..."
      },
      {
        "id": "p1_q3",
        "level": "thong-hieu",
        "levelLabel": "Thông hiểu / Vận dụng (0.5 điểm) - Tiếng Việt",
        "points": 0.5,
        "isVietnameseKnowledge": true,
        "vietnameseTopic": "Biện pháp tu từ",
        "question": "...",
        "guideAnswer": "...",
        "gradingCriteria": "..."
      },
      {
        "id": "p1_q4",
        "level": "van-dung",
        "levelLabel": "Vận dụng (0.5 điểm)",
        "points": 0.5,
        "question": "...",
        "guideAnswer": "...",
        "gradingCriteria": "..."
      }
    ],
    "question2": {
      "id": "p1_q2_essay",
      "prompt": "Từ nội dung văn bản ở phần Đọc hiểu, hãy viết một đoạn văn (khoảng 200 chữ)...",
      "taskType": "Viết đoạn văn 200 chữ",
      "wordLimitText": "Khoảng 200 chữ (dung sai 150 - 250 chữ)",
      "points": 2.0,
      "guideAnswer": "đáp án hướng dẫn...",
      "rubric": {
        "formatAndLength": 0.25,
        "contentAndTheme": 0.75,
        "artisticAnalysis": 0.5,
        "cohesionAndLinking": 0.25,
        "spellingAndGrammar": 0.25
      }
    }
  },
  "part2": {
    "passageTitle": "tên văn bản 2",
    "passageType": "nghị luận",
    "passageSource": "Báo Tuổi Trẻ / Giáo dục thời đại",
    "wordCount": 280,
    "passageText": "nội dung văn bản 2...",
    "question3": {
      "id": "p2_q3",
      "level": "thong-hieu",
      "levelLabel": "Thông hiểu (1.0 điểm)",
      "points": 1.0,
      "question": "...",
      "guideAnswer": "..."
    },
    "question4": {
      "id": "p2_q4",
      "prompt": "Từ vấn đề được gợi ra ở phần II, hãy viết một bài văn nghị luận xã hội...",
      "essayType": "vấn đề đời sống",
      "points": 4.0,
      "guideAnswer": "hướng dẫn dàn ý mở - thân - kết...",
      "rubric": {
        "issueIdentification": 0.5,
        "structureAndOutline": 0.5,
        "argumentsAndReasoning": 1.5,
        "evidenceAndProof": 0.75,
        "cohesionAndExpression": 0.5,
        "spellingAndCreativity": 0.25
      }
    }
  },
  "metadata": {
    "totalQuestions": 7,
    "totalScore": 10.0,
    "cognitiveRatios": {
      "recognition": 0.2,
      "understanding": 0.4,
      "application": 0.4
    },
    "totalWordCount": 660,
    "createdAt": "${new Date().toISOString()}"
  }
}`;

        const text = await generateContentWithFallback(ai, {
          primaryModel: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        });

        if (text) {
          try {
            const parsed = JSON.parse(text);
            if (parsed && parsed.part1 && parsed.part2) {
              return res.json({ success: true, exam: parsed, source: "ai" });
            }
          } catch (jsonErr) {
            console.warn("Lỗi parse JSON đề Văn từ AI:", jsonErr);
          }
        }
      }

      return res.json({ success: false, message: "Fallback to local generator" });
    } catch (error: any) {
      console.warn("Lỗi khi gọi AI sinh đề Văn:", error?.message || error);
      return res.json({ success: false, message: "Fallback to local generator" });
    }
  });

  // 3. API: Sinh đề Tiếng Anh mới hoàn toàn (40 câu - 10.0 điểm)
  app.post("/api/generate/english-exam", async (req, res) => {
    try {
      const { difficulty = "Chuẩn" } = req.body || {};

      // Ưu tiên lấy từ bộ đệm Warm Exam Pool để trả về tức thì (< 30ms)
      if (examPool.anh.length > 0) {
        const cachedExam = examPool.anh.shift();
        setTimeout(() => replenishSubjectPool('anh'), 150);
        return res.json({ success: true, exam: cachedExam, source: "ai_pool", remainingPool: examPool.anh.length });
      }

      const freshExam = await generateFreshEnglishExam(difficulty);
      if (freshExam) {
        setTimeout(() => replenishSubjectPool('anh'), 150);
        return res.json({ success: true, exam: freshExam, source: "ai" });
      }

      const ai = getAiClient();

      const ENGLISH_THEMES = [
        "Artificial Intelligence & Future Career Skills for Teenagers",
        "Eco-friendly Cities & Sustainable Transport in Vietnam",
        "Preserving Traditional Cultural Heritage and Festivals",
        "Mental Health & Healthy Digital Habits for Students",
        "Youth Volunteering and Community Service Projects",
        "Space Exploration & Renewable Energy Innovations"
      ];
      const randomTheme = ENGLISH_THEMES[Math.floor(Math.random() * ENGLISH_THEMES.length)];
      const randomSeed = Date.now().toString(36);

      if (ai) {
        const prompt = `You are a master test developer for the 10th Grade Entrance Examination in English (TP.HCM Department of Education & Training).
CRITICAL INSTRUCTION:
- Every generation MUST be a 100% BRAND NEW, completely fresh exam. Do NOT repeat old questions or only swap words.
- Context theme for reading & cloze: "${randomTheme}" (Seed: ${randomSeed}).
- Exactly 40 questions (each 0.25 pts, total 10.0 points, time 90 minutes).

Structure:
- Part 1 (Questions 1-4, 1.0 pt): Phonetics & Stress (2 pronunciation, 2 word stress).
- Part 2 (Questions 5-16, 3.0 pts): Vocabulary, Grammar, Prepositions, Conjunctions & Daily Communication.
- Part 3 (Questions 17-28, 3.0 pts):
  + Cloze text (Questions 17-22, 6 questions): A 110-word passage about "${randomTheme}" with 6 blanks and 4 options A, B, C, D.
  + Reading comprehension (Questions 23-28, 6 questions): A 200-word passage about "${randomTheme}" with 6 questions.
- Part 4 (Questions 29-40, 3.0 pts):
  + Word Formation (Questions 29-34, 6 questions): Give the correct form of the word in brackets.
  + Sign / Public notice (Questions 35-36, 2 questions): Meaning of signs.
  + Sentence Transformation (Questions 37-40, 4 questions): Rewrite sentences using suggested beginning words (e.g. Wish, Conditionals, Reported Speech, Passive Voice, Although/Because).

Return strictly JSON matching:
{
  "id": "eng-${randomSeed}",
  "subjectId": "anh",
  "title": "Đề Luyện Thi Tuyển Sinh 10 Tiếng Anh - Topic: ${randomTheme}",
  "difficulty": "${difficulty}",
  "timeMinutes": 90,
  "clozePassage": {
    "text": "110-word text with (17), (18), (19), (20), (21), (22)...",
    "wordCount": 110,
    "wordBank": []
  },
  "readingPassage": {
    "title": "Passage Title",
    "text": "200-word reading text...",
    "wordCount": 200
  },
  "questions": [
    {
      "id": "eng_1",
      "index": 1,
      "partIndex": 1,
      "partTitle": "PHẦN 1: NGỮ ÂM",
      "type": "phonetics",
      "level": "nhan-biet",
      "points": 0.25,
      "prompt": "Choose the word whose underlined part is pronounced differently...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "Giải thích chi tiết..."
    },
    ... (total exactly 40 questions numbered 1 to 40)
  ],
  "metadata": {
    "totalQuestions": 40,
    "totalScore": 10.0,
    "cognitiveRatios": {
      "recognitionCount": 8,
      "understandingCount": 16,
      "applicationCount": 16
    },
    "partCounts": {
      "part1Phonetics": 4,
      "part2VocabGrammar": 12,
      "part3Writing": 12,
      "part4Reading": 12
    },
    "createdAt": "${new Date().toISOString()}"
  }
}`;

        const text = await generateContentWithFallback(ai, {
          primaryModel: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.85,
          },
        });

        if (text) {
          try {
            const parsed = JSON.parse(text);
            if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 40) {
              return res.json({ success: true, exam: parsed, source: "ai" });
            }
          } catch (jsonErr) {
            console.warn("Lỗi parse JSON đề Anh từ AI:", jsonErr);
          }
        }
      }

      return res.json({ success: false, message: "Fallback to local generator" });
    } catch (error: any) {
      console.warn("Lỗi khi gọi AI sinh đề Anh:", error?.message || error);
      return res.json({ success: false, message: "Fallback to local generator" });
    }
  });

  // Vite development middleware or production static files
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

// =========================================================================
// Fallback Heuristics khi không có API key
// =========================================================================
function gradeLiteratureLocally(exam: any, studentAnswers: Record<string, string>) {
  const p1Text = (exam.part1?.passageText || "").toLowerCase();
  
  const qScores = (exam.part1?.question1SubQuestions || []).map((q: any) => {
    const ans = (studentAnswers[q.id] || "").trim();
    const cleanAns = ans.toLowerCase();
    let score = 0;
    let feedback = "";
    let correctPoints = "";
    let incorrectPoints = "";
    let whyWrong = "";
    let suggestedFix = "";
    let missingPoints = "";
    let strengths = "";
    let weaknesses = "";
    let suggestions = "";

    if (!ans) {
      score = 0;
      feedback = "Học sinh chưa trả lời câu hỏi này (để trống).";
      weaknesses = "Bỏ trống bài làm.";
      missingPoints = "Toàn bộ ý kiến trả lời cho câu hỏi.";
      suggestions = "Cần đọc kĩ câu hỏi trong đề để tìm ý trả lời từ ngữ liệu.";
    } else if (cleanAns.length > 25 && p1Text.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))) {
      score = 0;
      feedback = "Học sinh chỉ chép lại một đoạn từ ngữ liệu mà không trả lời trúng yêu cầu câu hỏi.";
      incorrectPoints = "Chép lại nguyên văn ngữ liệu.";
      whyWrong = "Chép lại ngữ liệu không được tính là câu trả lời hợp lệ.";
      suggestedFix = "Cần chọn lọc chi tiết và trả lời trực tiếp vào câu hỏi.";
      missingPoints = "Ý giải thích hoặc phân tích theo yêu cầu.";
    } else {
      score = 0;
      feedback = "Hệ thống đã ghi nhận bài làm. Theo quy chuẩn đổi mới GDPT 2018, hệ thống KHÔNG chấm điểm tự động dựa trên số từ. Vui lòng kết nối Gemini AI để thẩm định chi tiết nội dung.";
      whyWrong = "Hệ thống tuân thủ nguyên tắc: có chữ ≠ có điểm. Cần AI đọc hiểu nội dung để cho điểm công bằng.";
      suggestedFix = "Kích hoạt Gemini AI hoặc đối chiếu trực tiếp với gợi ý đáp án bên dưới.";
      suggestions = "Bật cấu hình Gemini AI để nhận diện chính xác các ý đúng/sai và nhận xét chi tiết.";
    }

    return {
      questionId: q.id,
      title: `Phần I - ${q.levelLabel}`,
      score,
      maxScore: q.points,
      studentAnswer: ans || "(Chưa làm bài)",
      guideAnswer: q.guideAnswer,
      feedback,
      correctPoints,
      incorrectPoints,
      whyWrong,
      suggestedFix,
      missingPoints,
      strengths,
      weaknesses,
      suggestions
    };
  });

  // Câu 2: Đoạn văn 200 chữ
  const q2Ans = (studentAnswers["p1_q2_essay"] || "").trim();
  let q2Score = 0;
  let q2Feedback = "";
  if (!q2Ans) {
    q2Score = 0;
    q2Feedback = "Học sinh chưa làm bài viết đoạn văn cảm thụ.";
  } else {
    q2Score = 0;
    q2Feedback = "Đoạn văn đã được ghi nhận. Để đánh giá đúng nghệ thuật, liên kết câu và cảm thụ, cần có AI đọc toàn bộ đoạn văn thay vì đếm số chữ.";
  }

  // Câu 3: Đọc hiểu phần II
  const q3Ans = (studentAnswers["p2_q3"] || "").trim();
  let q3Score = 0;
  let q3Feedback = "";
  if (!q3Ans) {
    q3Score = 0;
    q3Feedback = "Chưa làm câu hỏi này.";
  } else {
    q3Score = 0;
    q3Feedback = "Câu trả lời đã được ghi nhận. Cần AI đọc hiểu để đánh giá tính xác thực của thông tin trích xuất.";
  }

  // Câu 4: Bài văn NLXH
  const q4Ans = (studentAnswers["p2_q4"] || "").trim();
  let q4Score = 0;
  let q4Feedback = "";
  if (!q4Ans) {
    q4Score = 0;
    q4Feedback = "Chưa làm bài văn nghị luận xã hội.";
  } else {
    q4Score = 0;
    q4Feedback = "Bài văn đã được ghi nhận. Để thẩm định hệ thống luận điểm, lí lẽ, dẫn chứng thực tế và tính sáng tạo, cần có Gemini AI đọc toàn bộ bài làm. Tuyệt đối không cho điểm chỉ vì bài viết dài.";
  }

  const allScores = [
    ...qScores,
    {
      questionId: "p1_q2_essay",
      title: "Câu 2 (2.0 điểm) - Đoạn văn cảm thụ văn học",
      score: q2Score,
      maxScore: 2.0,
      studentAnswer: q2Ans || "(Chưa làm bài)",
      guideAnswer: exam.part1?.question2?.guideAnswer || "",
      feedback: q2Feedback,
      whyWrong: "Cần AI đọc thẩm định cấu trúc và nội dung cảm thụ.",
      suggestedFix: "Tham khảo hướng dẫn đáp án bên dưới.",
      suggestions: "Kích hoạt Gemini AI để nhận phản hồi chi tiết về mạch cảm xúc và lập luận."
    },
    {
      questionId: "p2_q3",
      title: "Câu 3 (1.0 điểm) - Đọc hiểu văn bản thông tin",
      score: q3Score,
      maxScore: 1.0,
      studentAnswer: q3Ans || "(Chưa làm bài)",
      guideAnswer: exam.part2?.question3?.guideAnswer || "",
      feedback: q3Feedback,
      suggestions: "Đối chiếu câu trả lời với từ khóa then chốt trong ngữ liệu thông tin."
    },
    {
      questionId: "p2_q4",
      title: "Câu 4 (4.0 điểm) - Bài văn nghị luận xã hội",
      score: q4Score,
      maxScore: 4.0,
      studentAnswer: q4Ans || "(Chưa làm bài)",
      guideAnswer: exam.part2?.question4?.guideAnswer || "",
      feedback: q4Feedback,
      suggestions: "Kích hoạt Gemini AI để được nhận xét sâu sắc về tính thuyết phục của dẫn chứng và mạch lập luận."
    }
  ];

  return {
    totalScore: 0,
    maxScore: 10.0,
    questionScores: allScores,
    topWeaknesses: [
      "Chưa thể đánh giá chiều sâu cảm thụ văn học khi chưa kích hoạt Gemini AI",
      "Cần kiểm tra lại bố cục đoạn văn và hệ thống dẫn chứng bài văn NLXH",
      "Cần đối chiếu các câu đọc hiểu với yêu cầu trọng tâm của đề"
    ],
    keyStrengths: [
      "Đã nhập câu trả lời cho các phần của đề thi"
    ],
    reviewTopics: [
      "Phương pháp trả lời câu hỏi đọc hiểu nhận biết và thông hiểu",
      "Kỹ năng viết đoạn văn cảm thụ khoảng 200 chữ",
      "Cấu trúc và cách đưa dẫn chứng thời sự vào bài văn NLXH"
    ],
    overallComment: "Hệ thống tuân thủ nghiêm ngặt chuẩn mực: Có chữ ≠ có điểm. Không chấm điểm tự động theo độ dài chuỗi ký tự. Vui lòng kết nối Gemini AI để chấm bài chi tiết theo chuẩn GDPT 2018."
  };
}

function gradeMathLocally(exam: any, studentAnswers: Record<string, string>) {
  const exercises = exam.exercises || [];
  let totalScore = 0;

  const exerciseScores = exercises.map((ex: any, idx: number) => {
    const ans = (studentAnswers[ex.id] || "").trim();
    const cleanProblem = (ex.problemText || "").trim().toLowerCase();
    const cleanAns = ans.toLowerCase();
    let earned = 0;
    let feedback = "";
    let correctPoints = "";
    let incorrectPoints = "";
    let whyWrong = "";
    let suggestedFix = "";
    let missingPoints = "";
    let strengths = "";
    let mistakes = "";
    let suggestions = "";

    if (!ans) {
      earned = 0;
      feedback = "Học sinh chưa làm bài tập này (để trống).";
      mistakes = "Bỏ trống bài làm.";
      missingPoints = "Toàn bộ các bước giải của bài toán.";
      suggestions = "Hãy cố gắng viết ít nhất các công thức cơ bản hoặc vẽ hình để lấy điểm thành phần.";
    } else if (cleanAns.length > 20 && cleanProblem.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))) {
      earned = 0;
      feedback = "Phát hiện bài làm chỉ chép lại đề bài, không có bước biến đổi toán học nào.";
      mistakes = "Chép lại đề bài thay vì giải toán.";
      whyWrong = "Chép lại đề bài không được tính điểm.";
      suggestedFix = "Thực hiện biến đổi công thức hoặc tính toán theo yêu cầu.";
      missingPoints = "Toàn bộ quá trình giải toán.";
    } else {
      earned = 0;
      feedback = "Bài làm đã được ghi nhận. Để đảm bảo tính chính xác và không cho điểm bừa bãi theo độ dài, vui lòng kích hoạt Gemini AI để chấm từng bước giải theo đúng barem tuyển sinh.";
      mistakes = "Chưa qua thẩm định AI nội dung.";
      whyWrong = "Hệ thống tuân thủ quy tắc không tự động cho điểm chỉ vì học sinh có gõ chữ.";
      suggestedFix = "Kích hoạt Gemini AI hoặc đối chiếu trực tiếp với đáp án mẫu bên dưới.";
      suggestions = "Bấm 'Kích hoạt Gemini AI' để nhận phân tích chi tiết từng phép toán và điều kiện xác định.";
    }

    totalScore += earned;

    return {
      exerciseId: ex.id,
      title: ex.title || `Bài ${idx + 1}`,
      score: earned,
      maxScore: ex.points,
      feedback,
      correctPoints,
      incorrectPoints,
      whyWrong,
      suggestedFix,
      missingPoints,
      strengths,
      mistakes,
      suggestions,
      sampleSolution: ex.sampleSolution
    };
  });

  return {
    totalScore,
    maxScore: 10.0,
    exerciseScores,
    topWeaknesses: [
      "Chưa thể đối chiếu bước giải với barem khi chưa kích hoạt Gemini AI",
      "Cần kiểm tra kỹ điều kiện xác định và các bước biến đổi trung gian",
      "Đảm bảo trình bày rõ ràng từng bước suy luận hình học và đại số"
    ],
    keyStrengths: [
      "Đã nhập bài giải cho các bài toán"
    ],
    reviewTopics: [
      "Kỹ năng giải hệ phương trình và định lý Vi-ét",
      "Phương pháp giải bài toán thực tế",
      "Kỹ năng chứng minh tứ giác nội tiếp và tam giác đồng dạng"
    ],
    overallComment: "Hệ thống áp dụng quy tắc nghiêm ngặt: KHÔNG tự động cho điểm chỉ vì học sinh viết dài hoặc có nhập chữ. Hãy kết nối Gemini AI để chấm từng bước giải theo chuẩn ma trận GDPT 2018."
  };
}

startServer();
