// Heuristic fallback chấm bài Toán khi Gemini AI không khả dụng.
// Quy tắc nghiêm ngặt: Có chữ ≠ có điểm. Không chấm điểm theo độ dài chuỗi.
export function gradeMathLocally(
  exam: any,
  studentAnswers: Record<string, string>
) {
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
      suggestions =
        "Hãy cố gắng viết ít nhất các công thức cơ bản hoặc vẽ hình để lấy điểm thành phần.";
    } else if (
      cleanAns.length > 20 &&
      cleanProblem.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))
    ) {
      earned = 0;
      feedback =
        "Phát hiện bài làm chỉ chép lại đề bài, không có bước biến đổi toán học nào.";
      mistakes = "Chép lại đề bài thay vì giải toán.";
      whyWrong = "Chép lại đề bài không được tính điểm.";
      suggestedFix =
        "Thực hiện biến đổi công thức hoặc tính toán theo yêu cầu.";
      missingPoints = "Toàn bộ quá trình giải toán.";
    } else {
      earned = 0;
      feedback =
        "Bài làm đã được ghi nhận. Để đảm bảo tính chính xác và không cho điểm bừa bãi theo độ dài, vui lòng kích hoạt Gemini AI để chấm từng bước giải theo đúng barem tuyển sinh.";
      mistakes = "Chưa qua thẩm định AI nội dung.";
      whyWrong =
        "Hệ thống tuân thủ quy tắc không tự động cho điểm chỉ vì học sinh có gõ chữ.";
      suggestedFix =
        "Kích hoạt Gemini AI hoặc đối chiếu trực tiếp với đáp án mẫu bên dưới.";
      suggestions =
        "Bấm 'Kích hoạt Gemini AI' để nhận phân tích chi tiết từng phép toán và điều kiện xác định.";
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
      sampleSolution: ex.sampleSolution,
    };
  });

  return {
    totalScore,
    maxScore: 10.0,
    exerciseScores,
    topWeaknesses: [
      "Chưa thể đối chiếu bước giải với barem khi chưa kích hoạt Gemini AI",
      "Cần kiểm tra kỹ điều kiện xác định và các bước biến đổi trung gian",
      "Đảm bảo trình bày rõ ràng từng bước suy luận hình học và đại số",
    ],
    keyStrengths: ["Đã nhập bài giải cho các bài toán"],
    reviewTopics: [
      "Kỹ năng giải hệ phương trình và định lý Vi-ét",
      "Phương pháp giải bài toán thực tế",
      "Kỹ năng chứng minh tứ giác nội tiếp và tam giác đồng dạng",
    ],
    overallComment:
      "Hệ thống áp dụng quy tắc nghiêm ngặt: KHÔNG tự động cho điểm chỉ vì học sinh viết dài hoặc có nhập chữ. Hãy kết nối Gemini AI để chấm từng bước giải theo chuẩn ma trận GDPT 2018.",
  };
}
