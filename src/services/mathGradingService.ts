import { MathExam } from '../types/practiceExamTypes';

export interface MathGradingItemScore {
  exerciseId: string;
  baiNumber: number;
  title: string;
  score: number;
  maxScore: number;
  feedback: string;
  correctPoints?: string; // Ý/bước nào đúng
  incorrectPoints?: string; // Ý/bước nào sai hoặc ngộ nhận
  whyWrong?: string; // Nếu sai, giải thích tại sao sai
  suggestedFix?: string; // Đề xuất cách sửa
  missingPoints?: string; // Nếu thiếu bước, chỉ rõ bước còn thiếu
  strengths?: string;
  mistakes?: string;
  suggestions?: string;
  sampleSolution?: string;
  studentAnswer?: string;
}

export interface MathGradingResultDetailed {
  totalScore: number;
  maxScore: number;
  overallComment: string;
  topWeaknesses?: string[]; // 3 lỗi/điểm yếu quan trọng nhất
  keyStrengths?: string[]; // Những phần học sinh làm tốt
  reviewTopics?: string[]; // Gợi ý nội dung cần ôn lại
  isAiGraded?: boolean;
  gradedBy?: string;
  exerciseScores: MathGradingItemScore[];
}

export async function gradeMathSubmission(
  exam: MathExam,
  studentAnswers: Record<string, string>,
  onGradingProgress?: (msg: string) => void
): Promise<MathGradingResultDetailed> {
  onGradingProgress?.('AI đang đọc đề, xác định yêu cầu và kiểm tra từng bước giải của học sinh...');

  try {
    const response = await fetch('/api/grade/math', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam, studentAnswers })
    });

    if (response.ok) {
      onGradingProgress?.('Đang thẩm định bài toán thực tế, chứng minh hình học và đối chiếu barem...');
      const data = await response.json();
      if (data && data.success && data.gradingResult) {
        onGradingProgress?.('Đã hoàn tất đánh giá chi tiết bài thi môn Toán!');
        const res = data.gradingResult;
        return {
          totalScore: res.totalScore ?? 0,
          maxScore: 10.0,
          isAiGraded: data.isAiGraded ?? res.isAiGraded ?? false,
          gradedBy: data.gradedBy ?? (res.isAiGraded ? 'Gemini AI (Đọc & Thẩm định nội dung)' : 'Bộ thẩm định dự phòng'),
          overallComment: res.overallComment || 'Đã hoàn thành đánh giá bài làm.',
          topWeaknesses: Array.isArray(res.topWeaknesses) ? res.topWeaknesses : [],
          keyStrengths: Array.isArray(res.keyStrengths) ? res.keyStrengths : [],
          reviewTopics: Array.isArray(res.reviewTopics) ? res.reviewTopics : [],
          exerciseScores: (res.exerciseScores || []).map((ex: any, idx: number) => ({
            exerciseId: ex.exerciseId || `bai${idx + 1}`,
            baiNumber: idx + 1,
            title: ex.title || `Bài ${idx + 1}`,
            score: ex.score ?? 0,
            maxScore: ex.maxScore ?? exam.exercises[idx]?.points ?? 1.0,
            feedback: ex.feedback || '',
            correctPoints: ex.correctPoints || '',
            incorrectPoints: ex.incorrectPoints || '',
            whyWrong: ex.whyWrong || '',
            suggestedFix: ex.suggestedFix || '',
            missingPoints: ex.missingPoints || '',
            strengths: ex.strengths || '',
            mistakes: ex.mistakes || '',
            suggestions: ex.suggestions || '',
            sampleSolution: exam.exercises[idx]?.sampleSolution || '',
            studentAnswer: studentAnswers[ex.exerciseId || `bai${idx + 1}`] || ''
          }))
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API chấm Toán, chuyển sang bộ xử lý dự phòng:', err);
  }

  // Fallback ngoại tuyến: Tuyệt đối KHÔNG tự động cho điểm dựa vào độ dài chuỗi
  onGradingProgress?.('Đang đối chiếu dữ liệu bài làm...');
  await new Promise(r => setTimeout(r, 600));

  let totalScore = 0;
  const exerciseScores: MathGradingItemScore[] = exam.exercises.map((ex, idx) => {
    const ans = (studentAnswers[ex.id] || '').trim();
    const cleanProblem = (ex.problemText || '').trim().toLowerCase();
    const cleanAns = ans.toLowerCase();

    let earned = 0;
    let feedback = '';
    let correctPoints = '';
    let incorrectPoints = '';
    let whyWrong = '';
    let suggestedFix = '';
    let missingPoints = '';
    let strengths = '';
    let mistakes = '';
    let suggestions = '';

    if (!ans) {
      earned = 0;
      feedback = 'Học sinh bỏ trống, chưa làm bài tập này.';
      mistakes = 'Bỏ trống bài làm hoàn toàn.';
      suggestions = 'Cần ghi lại công thức cơ bản, vẽ hình hoặc đặt ẩn số để có thể nhận điểm thành phần.';
      missingPoints = 'Toàn bộ các bước giải của bài toán.';
    } else if (cleanAns.length > 20 && cleanProblem.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))) {
      // Trường hợp chép lại đề bài
      earned = 0;
      feedback = 'Phát hiện bài làm chỉ chép lại đề bài, không có bất kỳ bước lập luận hoặc tính toán nào.';
      mistakes = 'Chép lại đề bài thay vì giải toán.';
      whyWrong = 'Chép lại đề bài không được tính là câu trả lời hợp lệ.';
      suggestedFix = 'Cần thực hiện các bước biến đổi toán học hoặc lập luận để tìm ra kết quả.';
      missingPoints = 'Các bước biến đổi đại số, giải phương trình hoặc chứng minh hình học.';
    } else {
      // Có nhập nội dung nhưng không có AI thẩm định trực tiếp
      // Theo nguyên tắc: Có chữ ≠ có điểm. Không cho điểm bừa bãi.
      earned = 0;
      feedback = 'Bài làm đã được ghi nhận. Để đảm bảo tính công bằng (không chấm điểm theo độ dài gõ chữ), vui lòng kích hoạt Gemini AI để đọc và chấm điểm từng bước giải theo đúng barem tuyển sinh.';
      mistakes = 'Chưa qua thẩm định AI nội dung.';
      whyWrong = 'Hệ thống tuân thủ nguyên tắc không chấm điểm tự động chỉ vì học sinh có nhập chữ.';
      suggestedFix = 'Kích hoạt Gemini AI hoặc đối chiếu trực tiếp với đáp án mẫu và biểu điểm từng bước ở bên dưới.';
      suggestions = 'Hãy bấm "Kích hoạt Gemini AI" để nhận phân tích chi tiết từng phép toán, biểu thức và điều kiện xác định.';
    }

    totalScore += earned;

    return {
      exerciseId: ex.id,
      baiNumber: ex.baiNumber || (idx + 1),
      title: ex.title,
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
      studentAnswer: ans
    };
  });

  return {
    totalScore,
    maxScore: 10.0,
    isAiGraded: false,
    gradedBy: 'Bộ thẩm định dự phòng (Chưa kết nối AI)',
    overallComment: 'Bài thi đã được ghi nhận. Hệ thống áp dụng quy tắc nghiêm ngặt: KHÔNG tự động cho điểm chỉ vì học sinh viết dài hoặc có nhập chữ. Hãy kết nối Gemini AI để chấm từng bước giải theo chuẩn ma trận GDPT 2018.',
    topWeaknesses: [
      'Chưa thể đối chiếu bước giải với barem khi chưa kích hoạt Gemini AI',
      'Cần kiểm tra kỹ điều kiện xác định và các bước biến đổi trung gian',
      'Đảm bảo trình bày rõ ràng từng bước suy luận hình học và đại số'
    ],
    keyStrengths: [
      'Đã hoàn thành nhập liệu bài làm cho các câu hỏi'
    ],
    reviewTopics: [
      'Kỹ năng giải hệ phương trình và định lý Vi-ét',
      'Phương pháp giải bài toán thực tế',
      'Kỹ năng chứng minh tứ giác nội tiếp và tam giác đồng dạng'
    ],
    exerciseScores
  };
}
