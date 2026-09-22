import { getAiClient, generateContentWithFallback } from "./geminiClient";

export async function generateFreshMathExam(difficulty: string = "Chuẩn") {
  const ai = getAiClient();
  if (!ai) return null;

  const MATH_THEMES = [
    "Nông nghiệp công nghệ cao & Nhà kính thông minh tưới tự động",
    "Năng lượng xanh: Điện mặt trời mái nhà và trạm sạc xe điện",
    "Đô thị thông minh TP.HCM: Tuyến Metro Bến Thành - Suối Tiên",
    "Bảo vệ môi trường: Tái chế rác thải nhựa và làm sạch kênh rạch",
    "Kinh tế tiêu dùng: Khuyến mãi mùa tựu trường và dịch vụ xe công nghệ",
    "Hàng hải & Cứu hộ biển: Ngọn hải đăng và tàu tuần tra kiểm ngư",
    "Kiến trúc cảnh quan: Thiết kế công viên sinh thái và cầu vượt bộ hành",
    "Y tế & Sức khỏe cộng đồng: Pha chế dung dịch sát khuẩn và dinh dưỡng học đường",
    "Logistics & Vận tải thông minh: Giao hàng chặng cuối và kho chứa thông minh"
  ];
  const randomTheme = MATH_THEMES[Math.floor(Math.random() * MATH_THEMES.length)];
  const randomSeed = Date.now().toString(36);

  const prompt = `Bạn là chuyên gia khảo thí biên soạn đề thi Tuyển sinh vào lớp 10 môn Toán của Sở GD&ĐT TP.HCM (Chương trình GDPT 2018).
YÊU CẦU ĐẶC BIỆT QUAN TRỌNG:
- Mỗi lần sinh đề PHẢI LÀ MỘT BỘ ĐỀ MỚI HOÀN TOÀN (100% brand-new, unique and bespoke).
- TUYỆT ĐỐI KHÔNG CHỈ THAY ĐỔI SỐ LIỆU của các bài toán cũ! Hãy sáng tạo cốt truyện thực tế mới, ngữ cảnh mới, các con số tròn đẹp và tính toán hợp lý.
- Chủ đề truyền cảm hứng cho đề thi lần này: "${randomTheme}" (Mã sinh đề ngẫu nhiên: ${randomSeed}, độ khó: ${difficulty}).

Cấu trúc đề thi chuẩn đúng 7 bài (Tổng điểm: 10.0 điểm, thời gian: 120 phút):
1. Bài 1 (1.5 điểm): Hàm số và đồ thị parabol (P): y = ax^2 (a khác 0) và đường thẳng (d): y = mx + n. Câu a (1.0đ): Lập bảng giá trị, vẽ đồ thị và xác định tọa độ các điểm đặc biệt (gồm đỉnh parabol O(0; 0) cùng 4 điểm phân biệt thuộc đồ thị, hoặc 2 giao điểm của đường thẳng với các trục tọa độ); Câu b (0.5đ): Tìm tọa độ giao điểm bằng phép tính hoặc xác định toạ độ thoả mãn điều kiện hình học.
2. Bài 2 (1.0 điểm): Phương trình bậc hai một ẩn chứa tham số hoặc phương trình cụ thể có hai nghiệm x1, x2. Vận dụng định lí Viète để tính giá trị biểu thức đối xứng hoặc phi đối xứng sáng tạo (hoặc tìm tham số để biểu thức đạt giá trị thỏa mãn).
3. Bài 3 (1.0 điểm): Bài toán thực tế về Thống kê & Xác suất thực nghiệm dựa trên dữ liệu thực tế gắn với chủ đề "${randomTheme}". Câu a (0.5đ): Lập bảng tần số / bảng tỷ lệ phần trăm; Câu b (0.5đ): Tính xác suất thực nghiệm của biến cố ngẫu nhiên.
4. Bài 4 (1.0 điểm): Mô hình hóa toán học hàm số bậc nhất y = ax + b hoặc phương trình thực tế (ví dụ: cước phí dịch vụ, hóa đơn tiêu dùng, mức tiêu thụ năng lượng theo bậc thang, chiết khấu khuyến mãi...).
5. Bài 5 (1.0 điểm): Hình học không gian & đo lường thực tế (vật thể hình trụ, hình nón hoặc hình cầu trong đời sống như bồn nước, ống cống thoát nước, lều bạt, tháp nước, nắp vòm...). Có công thức diện tích/thể tích rõ ràng.
6. Bài 6 (1.0 điểm): Bài toán thực tế liên môn hoặc kinh tế / chuyển động / dung dịch nồng độ / năng suất công việc thực tế, yêu cầu lập phương trình hoặc hệ phương trình để giải.
7. Bài 7 (3.0 điểm): Bài toán hình học phẳng (tam giác nhọn nội tiếp đường tròn (O), các đường cao, tiếp tuyến...). Gồm 3 câu: Câu a (1.0đ) chứng minh tứ giác nội tiếp; Câu b (1.0đ) chứng minh hệ thức hình học / tích đoạn thẳng; Câu c (1.0đ) chứng minh ba điểm thẳng hàng hoặc đường thẳng đồng quy hoặc tiếp tuyến hoặc cực trị hình học.

Yêu cầu định dạng: Trả về duy nhất một đối tượng JSON hợp lệ theo cấu trúc:
{
  "id": "math-${randomSeed}",
  "subjectId": "toan",
  "title": "Đề Thi Tuyển Sinh 10 Môn Toán - Chủ đề: ${randomTheme}",
  "difficulty": "${difficulty}",
  "timeMinutes": 120,
  "exercises": [
    {
      "id": "bai1",
      "baiNumber": 1,
      "title": "Bài 1 (1.5 điểm) - Hàm số và Đồ thị parabol",
      "points": 1.5,
      "topicCategory": "Số và Đại số",
      "problemText": "nội dung chi tiết bài 1...",
      "subQuestions": [
        { "id": "b1_a", "label": "a", "points": 1.0, "content": "..." },
        { "id": "b1_b", "label": "b", "points": 0.5, "content": "..." }
      ],
      "sampleSolution": "bước giải chi tiết và đáp số...",
      "guideSteps": [
        { "step": "ý 1", "points": 0.5 },
        { "step": "ý 2", "points": 0.5 },
        { "step": "ý 3", "points": 0.5 }
      ]
    },
    ... (tiếp tục đúng 7 bài, tổng điểm đúng 10.0)
  ],
  "metadata": {
    "totalScore": 10.0,
    "totalExercises": 7,
    "categoriesCovered": ["Số và Đại số", "Thống kê và Xác suất", "Hình học và Đo lường"],
    "createdAt": "${new Date().toISOString()}"
  }
}`;

  try {
    const text = await generateContentWithFallback(ai, {
      primaryModel: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    });

    if (text) {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.exercises) && parsed.exercises.length === 7) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Lỗi sinh đề Toán AI:", err);
  }
  return null;
}

export async function generateFreshLiteratureExam(difficulty: string = "Chuẩn") {
  const ai = getAiClient();
  if (!ai) return null;

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
    "passageTitle": "tên bài đọc 2",
    "passageType": "văn bản thông tin / nghị luận",
    "passageSource": "Báo Tuổi Trẻ / Giáo dục thời đại",
    "wordCount": 290,
    "passageText": "toàn văn đoạn văn bản thông tin sắc bén...",
    "question3": {
      "id": "p2_q3",
      "prompt": "Theo tác giả đoạn trích, vấn đề được nêu có ý nghĩa như thế nào đối với người trẻ?",
      "points": 1.0,
      "guideAnswer": "hướng dẫn trả lời...",
      "gradingCriteria": "Đúng thông điệp cốt lõi được 1.0đ"
    },
    "question4": {
      "id": "p2_q4",
      "prompt": "Từ vấn đề gợi mở ở văn bản 2, hãy viết bài văn nghị luận xã hội...",
      "taskType": "Bài văn nghị luận xã hội",
      "points": 4.0,
      "guideAnswer": "dàn ý chi tiết mở bài, thân bài (giải thích, phân tích, chứng minh, phản biện), kết bài...",
      "rubric": {
        "structure": 0.5,
        "problemIdentification": 0.5,
        "argumentation": 2.0,
        "creativity": 0.5,
        "spellingAndExpression": 0.5
      }
    }
  }
}`;

  try {
    const text = await generateContentWithFallback(ai, {
      primaryModel: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    });

    if (text) {
      const parsed = JSON.parse(text);
      if (parsed && parsed.part1 && parsed.part2) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Lỗi sinh đề Văn AI:", err);
  }
  return null;
}

export async function generateFreshEnglishExam(difficulty: string = "Chuẩn") {
  const ai = getAiClient();
  if (!ai) return null;

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

  try {
    const text = await generateContentWithFallback(ai, {
      primaryModel: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    if (text) {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length === 40) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Lỗi sinh đề Anh AI:", err);
  }
  return null;
}
