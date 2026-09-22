import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { getAiClient, generateContentWithFallback } from "../geminiClient";
import {
  generateFreshMathExam,
  generateFreshLiteratureExam,
  generateFreshEnglishExam,
} from "../examGenerators";

const router = Router();

// Rate limit: 5 yêu cầu/phút/IP — sinh đề tốn nhiều token AI nhất
const generationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Đã vượt giới hạn sinh đề. Vui lòng đợi 1 phút rồi thử lại.",
  },
});

router.use(generationLimiter);

// =========================================================================
// Warm Exam Pool — đệm sẵn đề để giảm thời gian chờ (<30ms khi có cache)
// =========================================================================
const examPool: { toan: any[]; van: any[]; anh: any[] } = {
  toan: [],
  van: [],
  anh: [],
};

const isReplenishingPool: { toan: boolean; van: boolean; anh: boolean } = {
  toan: false,
  van: false,
  anh: false,
};

export async function replenishSubjectPool(subject: "toan" | "van" | "anh") {
  if (isReplenishingPool[subject] || examPool[subject].length >= 2) return;
  isReplenishingPool[subject] = true;
  try {
    let exam = null;
    if (subject === "toan") exam = await generateFreshMathExam("Chuẩn");
    else if (subject === "van") exam = await generateFreshLiteratureExam("Chuẩn");
    else if (subject === "anh") exam = await generateFreshEnglishExam("Chuẩn");

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

// =========================================================================
// POST /api/generate/math-exam
// =========================================================================
router.post("/math-exam", async (req, res) => {
  try {
    const { difficulty = "Chuẩn" } = req.body || {};

    if (examPool.toan.length > 0) {
      const cachedExam = examPool.toan.shift();
      setTimeout(() => replenishSubjectPool("toan"), 150);
      return res.json({
        success: true,
        exam: cachedExam,
        source: "ai_pool",
        remainingPool: examPool.toan.length,
      });
    }

    const exam = await generateFreshMathExam(difficulty);
    if (exam) {
      setTimeout(() => replenishSubjectPool("toan"), 150);
      return res.json({ success: true, exam, source: "ai" });
    }

    return res.json({ success: false, message: "Fallback to local generator" });
  } catch (error: any) {
    console.warn("Lỗi khi gọi AI sinh đề Toán:", error?.message || error);
    return res.json({ success: false, message: "Fallback to local generator" });
  }
});

// =========================================================================
// POST /api/generate/literature-exam
// =========================================================================
router.post("/literature-exam", async (req, res) => {
  try {
    const { difficulty = "Chuẩn" } = req.body || {};

    if (examPool.van.length > 0) {
      const cachedExam = examPool.van.shift();
      setTimeout(() => replenishSubjectPool("van"), 150);
      return res.json({
        success: true,
        exam: cachedExam,
        source: "ai_pool",
        remainingPool: examPool.van.length,
      });
    }

    const freshExam = await generateFreshLiteratureExam(difficulty);
    if (freshExam) {
      setTimeout(() => replenishSubjectPool("van"), 150);
      return res.json({ success: true, exam: freshExam, source: "ai" });
    }

    const ai = getAiClient();

    const LIT_TOPICS = [
      { group: "NHÓM 1 – GIA ĐÌNH & TÌNH THÂN", topic: "Tình phụ tử, tình mẫu tử và sự gắn kết qua biến cố đời sống" },
      { group: "NHÓM 2 – TUỔI TRẺ & BẢN LĨNH", topic: "Vượt qua áp lực đồng trang lứa và dũng cảm theo đuổi ước mơ" },
      { group: "NHÓM 3 – QUÊ HƯƠNG & CỘI NGUỒN", topic: "Ký ức làng nghề truyền thống và niềm tự hào bản sắc dân tộc" },
      { group: "NHÓM 4 – THIÊN NHIÊN & SỰ SỐNG", topic: "Mối gắn kết giữa con người và thiên nhiên, ý thức bảo vệ môi trường" },
      { group: "NHÓM 5 – TRI ÂN & NGHĨA THẦY TRÒ", topic: "Ngọn đèn tri thức và những người thầy thầm lặng gieo hy vọng" },
      { group: "NHÓM 6 – KHOA HỌC & NHÂN VĂN", topic: "Giữ gìn sự thấu cảm và lòng trắc ẩn trong kỷ nguyên trí tuệ nhân tạo" },
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
      {"id":"p1_q1","level":"nhan-biet","levelLabel":"Nhận biết (0.5 điểm)","points":0.5,"question":"...","guideAnswer":"...","gradingCriteria":"..."},
      {"id":"p1_q2","level":"thong-hieu","levelLabel":"Thông hiểu (1.5 điểm)","points":1.5,"question":"...","guideAnswer":"...","gradingCriteria":"..."},
      {"id":"p1_q3","level":"thong-hieu","levelLabel":"Thông hiểu / Vận dụng (0.5 điểm) - Tiếng Việt","points":0.5,"isVietnameseKnowledge":true,"vietnameseTopic":"Biện pháp tu từ","question":"...","guideAnswer":"...","gradingCriteria":"..."},
      {"id":"p1_q4","level":"van-dung","levelLabel":"Vận dụng (0.5 điểm)","points":0.5,"question":"...","guideAnswer":"...","gradingCriteria":"..."}
    ],
    "question2": {"id":"p1_q2_essay","prompt":"Từ nội dung văn bản ở phần Đọc hiểu, hãy viết một đoạn văn (khoảng 200 chữ)...","taskType":"Viết đoạn văn 200 chữ","wordLimitText":"Khoảng 200 chữ (dung sai 150 - 250 chữ)","points":2.0,"guideAnswer":"đáp án hướng dẫn...","rubric":{"formatAndLength":0.25,"contentAndTheme":0.75,"artisticAnalysis":0.5,"cohesionAndLinking":0.25,"spellingAndGrammar":0.25}}
  },
  "part2": {
    "passageTitle": "tên văn bản 2",
    "passageType": "nghị luận",
    "passageSource": "Báo Tuổi Trẻ / Giáo dục thời đại",
    "wordCount": 280,
    "passageText": "nội dung văn bản 2...",
    "question3": {"id":"p2_q3","level":"thong-hieu","levelLabel":"Thông hiểu (1.0 điểm)","points":1.0,"question":"...","guideAnswer":"..."},
    "question4": {"id":"p2_q4","prompt":"Từ vấn đề được gợi ra ở phần II, hãy viết một bài văn nghị luận xã hội...","essayType":"vấn đề đời sống","points":4.0,"guideAnswer":"hướng dẫn dàn ý mở - thân - kết...","rubric":{"issueIdentification":0.5,"structureAndOutline":0.5,"argumentsAndReasoning":1.5,"evidenceAndProof":0.75,"cohesionAndExpression":0.5,"spellingAndCreativity":0.25}}
  },
  "metadata": {"totalQuestions":7,"totalScore":10.0,"cognitiveRatios":{"recognition":0.2,"understanding":0.4,"application":0.4},"totalWordCount":660,"createdAt":"${new Date().toISOString()}"}
}`;

      const text = await generateContentWithFallback(ai, {
        primaryModel: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.9 },
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

// =========================================================================
// POST /api/generate/english-exam
// =========================================================================
router.post("/english-exam", async (req, res) => {
  try {
    const { difficulty = "Chuẩn" } = req.body || {};

    if (examPool.anh.length > 0) {
      const cachedExam = examPool.anh.shift();
      setTimeout(() => replenishSubjectPool("anh"), 150);
      return res.json({
        success: true,
        exam: cachedExam,
        source: "ai_pool",
        remainingPool: examPool.anh.length,
      });
    }

    const freshExam = await generateFreshEnglishExam(difficulty);
    if (freshExam) {
      setTimeout(() => replenishSubjectPool("anh"), 150);
      return res.json({ success: true, exam: freshExam, source: "ai" });
    }

    const ai = getAiClient();

    const ENGLISH_THEMES = [
      "Artificial Intelligence & Future Career Skills for Teenagers",
      "Eco-friendly Cities & Sustainable Transport in Vietnam",
      "Preserving Traditional Cultural Heritage and Festivals",
      "Mental Health & Healthy Digital Habits for Students",
      "Youth Volunteering and Community Service Projects",
      "Space Exploration & Renewable Energy Innovations",
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
{"id":"eng-${randomSeed}","subjectId":"anh","title":"Đề Luyện Thi Tuyển Sinh 10 Tiếng Anh - Topic: ${randomTheme}","difficulty":"${difficulty}","timeMinutes":90,"clozePassage":{"text":"110-word text with (17), (18), (19), (20), (21), (22)...","wordCount":110,"wordBank":[]},"readingPassage":{"title":"Passage Title","text":"200-word reading text...","wordCount":200},"questions":[{"id":"eng_1","index":1,"partIndex":1,"partTitle":"PHẦN 1: NGỮ ÂM","type":"phonetics","level":"nhan-biet","points":0.25,"prompt":"Choose the word whose underlined part is pronounced differently...","options":["A. ...","B. ...","C. ...","D. ..."],"correctAnswer":"A","explanation":"Giải thích chi tiết..."},...(total exactly 40 questions numbered 1 to 40)],"metadata":{"totalQuestions":40,"totalScore":10.0,"cognitiveRatios":{"recognitionCount":8,"understandingCount":16,"applicationCount":16},"partCounts":{"part1Phonetics":4,"part2VocabGrammar":12,"part3Writing":12,"part4Reading":12},"createdAt":"${new Date().toISOString()}"}}`;

      const text = await generateContentWithFallback(ai, {
        primaryModel: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.85 },
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

export default router;
