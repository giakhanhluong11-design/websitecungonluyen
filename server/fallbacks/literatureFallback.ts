// Heuristic fallback chấm bài Văn khi Gemini AI không khả dụng.
// Quy tắc nghiêm ngặt: Có chữ ≠ có điểm. Không chấm điểm theo số lượng từ.
export function gradeLiteratureLocally(
  exam: any,
  studentAnswers: Record<string, string>
) {
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
    } else if (
      cleanAns.length > 25 &&
      p1Text.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))
    ) {
      score = 0;
      feedback =
        "Học sinh chỉ chép lại một đoạn từ ngữ liệu mà không trả lời trúng yêu cầu câu hỏi.";
      incorrectPoints = "Chép lại nguyên văn ngữ liệu.";
      whyWrong = "Chép lại ngữ liệu không được tính là câu trả lời hợp lệ.";
      suggestedFix =
        "Cần chọn lọc chi tiết và trả lời trực tiếp vào câu hỏi.";
      missingPoints = "Ý giải thích hoặc phân tích theo yêu cầu.";
    } else {
      // Có bài làm nhưng không có AI
      // Quy tắc nghiêm ngặt: Có chữ ≠ có điểm. Bắt buộc AI chấm.
      score = 0;
      feedback = 'Hệ thống BẮT BUỘC phải dùng AI để quét và nhận xét bài làm. Vui lòng kết nối Gemini API Key để được chấm điểm.';
      whyWrong = 'Chưa có kết nối AI để đọc hiểu nội dung.';
      suggestedFix = 'Kích hoạt Gemini AI để hệ thống phân tích bài làm.';
      missingPoints = 'Cần AI quét và đối chiếu rubric.';
      suggestions = 'Bấm "Kích hoạt Gemini AI" ở góc màn hình.';
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
      suggestions,
    };
  });

  // Câu 2: Đoạn văn 200 chữ
  const q2Ans = (studentAnswers["p1_q2_essay"] || "").trim();
  let q2Score = 0;
  let q2Feedback = "Học sinh chưa làm bài viết đoạn văn cảm thụ.";
  if (q2Ans.length > 0) {
    q2Feedback = 'Bài văn đã được ghi nhận. Hệ thống BẮT BUỘC AI quét văn bản để phân tích lập luận. Vui lòng kết nối Gemini AI.';
  }

  // Câu 3: Đọc hiểu phần II
  const q3Ans = (studentAnswers["p2_q3"] || "").trim();
  let q3Score = 0;
  let q3Feedback = "Chưa làm câu hỏi này.";
  if (q3Ans.length > 0) {
    q3Feedback = 'Câu trả lời đã ghi nhận. BẮT BUỘC có AI để đánh giá tính chính xác của thông tin.';
  }

  // Câu 4: Bài văn NLXH
  const q4Ans = (studentAnswers["p2_q4"] || "").trim();
  let q4Score = 0;
  let q4Feedback = "Chưa làm bài văn nghị luận xã hội.";
  if (q4Ans.length > 0) {
    q4Feedback = 'BẮT BUỘC sử dụng Gemini AI để quét và nhận xét bài văn NLXH (không chấm mặc định).';
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
      suggestions:
        "Kích hoạt Gemini AI để nhận phản hồi chi tiết về mạch cảm xúc và lập luận.",
    },
    {
      questionId: "p2_q3",
      title: "Câu 3 (1.0 điểm) - Đọc hiểu văn bản thông tin",
      score: q3Score,
      maxScore: 1.0,
      studentAnswer: q3Ans || "(Chưa làm bài)",
      guideAnswer: exam.part2?.question3?.guideAnswer || "",
      feedback: q3Feedback,
      suggestions:
        "Đối chiếu câu trả lời với từ khóa then chốt trong ngữ liệu thông tin.",
    },
    {
      questionId: "p2_q4",
      title: "Câu 4 (4.0 điểm) - Bài văn nghị luận xã hội",
      score: q4Score,
      maxScore: 4.0,
      studentAnswer: q4Ans || "(Chưa làm bài)",
      guideAnswer: exam.part2?.question4?.guideAnswer || "",
      feedback: q4Feedback,
      suggestions:
        "Kích hoạt Gemini AI để được nhận xét sâu sắc về tính thuyết phục của dẫn chứng và mạch lập luận.",
    },
  ];

  return {
    totalScore: 0,
    maxScore: 10.0,
    questionScores: allScores,
    topWeaknesses: [
      "Chưa thể đánh giá chiều sâu cảm thụ văn học khi chưa kích hoạt Gemini AI",
      "Cần kiểm tra lại bố cục đoạn văn và hệ thống dẫn chứng bài văn NLXH",
      "Cần đối chiếu các câu đọc hiểu với yêu cầu trọng tâm của đề",
    ],
    keyStrengths: ["Đã nhập câu trả lời cho các phần của đề thi"],
    reviewTopics: [
      "Phương pháp trả lời câu hỏi đọc hiểu nhận biết và thông hiểu",
      "Kỹ năng viết đoạn văn cảm thụ khoảng 200 chữ",
      "Cấu trúc và cách đưa dẫn chứng thời sự vào bài văn NLXH",
    ],
    overallComment:
      "Hệ thống tuân thủ nghiêm ngặt chuẩn mực: Có chữ ≠ có điểm. Không chấm điểm tự động theo độ dài chuỗi ký tự. Vui lòng kết nối Gemini AI để chấm bài chi tiết theo chuẩn GDPT 2018.",
  };
}
