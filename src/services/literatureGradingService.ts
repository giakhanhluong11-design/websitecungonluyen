import { LiteratureExam, LiteratureGradingResult } from '../types/practiceExamTypes';

// Đánh giá bài thi Văn với AI thực sự theo barem tuyển sinh vào 10
export async function gradeLiteratureSubmission(
  exam: LiteratureExam,
  studentAnswers: Record<string, string>,
  onGradingProgress?: (msg: string) => void
): Promise<LiteratureGradingResult> {
  onGradingProgress?.('AI đang đọc đề, nhận diện yêu cầu và thẩm định câu trả lời Đọc hiểu...');

  try {
    const response = await fetch('/api/grade/literature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam, studentAnswers })
    });

    if (response.ok) {
      onGradingProgress?.('Đang phân tích lập luận, dẫn chứng, cảm thụ văn học và đối chiếu rubric...');
      const data = await response.json();
      if (data && data.success && data.gradingResult) {
        onGradingProgress?.('Đã hoàn tất đánh giá chi tiết bài thi môn Ngữ văn!');
        const res = data.gradingResult;
        return {
          totalScore: res.totalScore ?? 0,
          maxScore: 10.0,
          isAiGraded: data.isAiGraded ?? res.isAiGraded ?? false,
          gradedBy: data.gradedBy ?? (res.isAiGraded ? 'Gemini AI (Đọc & Thẩm định nội dung)' : 'Bộ thẩm định dự phòng'),
          overallComment: res.overallComment || 'Đã hoàn tất thẩm định bài thi.',
          topWeaknesses: Array.isArray(res.topWeaknesses) ? res.topWeaknesses : [],
          keyStrengths: Array.isArray(res.keyStrengths) ? res.keyStrengths : [],
          reviewTopics: Array.isArray(res.reviewTopics) ? res.reviewTopics : [],
          questionScores: (res.questionScores || []).map((qs: any) => ({
            questionId: qs.questionId,
            title: qs.title || '',
            score: qs.score ?? 0,
            maxScore: qs.maxScore ?? 1.0,
            criteriaScores: qs.criteriaScores,
            studentAnswer: qs.studentAnswer || studentAnswers[qs.questionId] || '(Chưa làm bài)',
            guideAnswer: qs.guideAnswer || '',
            feedback: qs.feedback || '',
            correctPoints: qs.correctPoints || '',
            incorrectPoints: qs.incorrectPoints || '',
            whyWrong: qs.whyWrong || '',
            suggestedFix: qs.suggestedFix || '',
            missingPoints: qs.missingPoints || '',
            strengths: qs.strengths || '',
            weaknesses: qs.weaknesses || '',
            suggestions: qs.suggestions || ''
          }))
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API chấm AI, chuyển sang bộ xử lý dự phòng:', err);
  }

  // Fallback ngoại tuyến: Tuyệt đối KHÔNG tự động cho điểm dựa vào số lượng từ hay có gõ chữ
  onGradingProgress?.('Đang đối chiếu dữ liệu bài làm...');
  await new Promise(r => setTimeout(r, 600));

  const p1Text = (exam.part1?.passageText || '').toLowerCase();

  // 1. Chấm 4 câu đọc hiểu phần I (Tổng 3.0 điểm)
  const part1Scores = exam.part1.question1SubQuestions.map((q) => {
    const ans = (studentAnswers[q.id] || '').trim();
    const cleanAns = ans.toLowerCase();

    let earned = 0;
    let feedback = '';
    let correctPoints = '';
    let incorrectPoints = '';
    let whyWrong = '';
    let suggestedFix = '';
    let missingPoints = '';
    let strengths = '';
    let weaknesses = '';
    let suggestions = '';

    if (!ans) {
      earned = 0;
      feedback = 'Học sinh chưa trả lời câu hỏi này.';
      weaknesses = 'Bỏ trống câu trả lời.';
      missingPoints = 'Toàn bộ nội dung yêu cầu của câu hỏi.';
      suggestions = 'Cần đọc kĩ câu hỏi trong đề để tìm ý trả lời từ ngữ liệu.';
    } else if (cleanAns.length > 25 && p1Text.includes(cleanAns.slice(0, Math.min(60, cleanAns.length)))) {
      // Chép lại ngữ liệu
      earned = 0;
      feedback = 'Học sinh chỉ sao chép lại một đoạn trong ngữ liệu mà không chọn lọc hay trả lời trực tiếp vào trọng tâm câu hỏi.';
      incorrectPoints = 'Sao chép nguyên văn ngữ liệu.';
      whyWrong = 'Chép lại ngữ liệu không thể hiện được năng lực đọc hiểu hay giải quyết câu hỏi.';
      suggestedFix = 'Cần trích lọc chi tiết cụ thể hoặc diễn đạt câu trả lời theo đúng yêu cầu đề bài.';
      missingPoints = 'Ý kiến giải thích hoặc câu trả lời trực tiếp.';
    } else {
      // Có bài làm nhưng không có AI
      // Quy tắc nghiêm ngặt: Có chữ ≠ có điểm. Không cho điểm bừa bãi.
      earned = 0;
      feedback = 'Câu trả lời đã được ghi nhận. Để đảm bảo tính công bằng (không tự động cho điểm theo số lượng từ), vui lòng kết nối Gemini AI để đọc hiểu và chấm điểm chính xác theo rubric.';
      whyWrong = 'Hệ thống tuân thủ nguyên tắc không chấm điểm tự động chỉ vì học sinh có nhập chữ.';
      suggestedFix = 'Kích hoạt Gemini AI hoặc đối chiếu với đáp án tham khảo bên dưới để tự đánh giá.';
      suggestions = 'Bấm "Kích hoạt Gemini AI" để nhận phản hồi phân tích chi tiết về ngữ nghĩa và dẫn chứng.';
    }

    return {
      questionId: q.id,
      title: `Phần I - ${q.levelLabel}`,
      score: earned,
      maxScore: q.points,
      studentAnswer: ans || '(Chưa làm bài)',
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

  // 2. Câu 2: Đoạn văn 200 chữ (2.0 điểm)
  const q2Ans = (studentAnswers['p1_q2_essay'] || '').trim();
  let q2Score = 0;
  let q2Feedback = '';
  let q2WhyWrong = '';
  let q2Missing = '';

  if (!q2Ans) {
    q2Score = 0;
    q2Feedback = 'Học sinh chưa viết đoạn văn cảm thụ.';
    q2Missing = 'Đoạn văn hoàn chỉnh khoảng 200 chữ.';
  } else {
    q2Score = 0;
    q2Feedback = 'Đoạn văn đã được ghi nhận. Theo quy chuẩn đổi mới GDPT 2018, môn Ngữ văn không chấm theo số từ mà phải đọc hiểu cảm xúc, hình tượng và nghệ thuật. Vui lòng kết nối Gemini AI để thẩm định chi tiết.';
    q2WhyWrong = 'Không áp dụng cơ chế tự động cho điểm theo độ dài bài viết.';
  }

  // 3. Câu 3: Đọc hiểu phần II (1.0 điểm)
  const q3Ans = (studentAnswers['p2_q3'] || '').trim();
  let q3Score = 0;
  let q3Feedback = '';
  if (!q3Ans) {
    q3Score = 0;
    q3Feedback = 'Chưa làm câu hỏi này.';
  } else {
    q3Score = 0;
    q3Feedback = 'Câu trả lời đã ghi nhận. Cần AI đọc hiểu để đánh giá tính xác thực của thông tin trích xuất từ văn bản.';
  }

  // 4. Câu 4: Bài văn NLXH (4.0 điểm)
  const q4Ans = (studentAnswers['p2_q4'] || '').trim();
  let q4Score = 0;
  let q4Feedback = '';
  if (!q4Ans) {
    q4Score = 0;
    q4Feedback = 'Chưa viết bài văn nghị luận xã hội.';
  } else {
    q4Score = 0;
    q4Feedback = 'Bài văn đã được ghi nhận. Để thẩm định hệ thống luận điểm, lí lẽ, dẫn chứng thực tế và tính sáng tạo, cần có Gemini AI đọc toàn bộ bài làm. Hệ thống không tự tiện chấm điểm theo dung lượng bài viết.';
  }

  const allScores = [
    ...part1Scores,
    {
      questionId: 'p1_q2_essay',
      title: 'Câu 2 (2.0 điểm) - Viết đoạn văn khoảng 200 chữ',
      score: q2Score,
      maxScore: 2.0,
      studentAnswer: q2Ans || '(Chưa làm bài)',
      guideAnswer: exam.part1.question2.guideAnswer,
      feedback: q2Feedback,
      whyWrong: q2WhyWrong,
      missingPoints: q2Missing,
      suggestions: 'Kích hoạt Gemini AI để nhận xét chi tiết cấu trúc đoạn văn, liên kết câu và hiệu quả thẩm mĩ.'
    },
    {
      questionId: 'p2_q3',
      title: 'Câu 3 (1.0 điểm) - Đọc hiểu văn bản phần II',
      score: q3Score,
      maxScore: 1.0,
      studentAnswer: q3Ans || '(Chưa làm bài)',
      guideAnswer: exam.part2.question3.guideAnswer,
      feedback: q3Feedback,
      suggestions: 'Đối chiếu câu trả lời với từ khóa then chốt trong ngữ liệu thông tin.'
    },
    {
      questionId: 'p2_q4',
      title: 'Câu 4 (4.0 điểm) - Bài văn nghị luận xã hội',
      score: q4Score,
      maxScore: 4.0,
      studentAnswer: q4Ans || '(Chưa làm bài)',
      guideAnswer: exam.part2.question4.guideAnswer,
      feedback: q4Feedback,
      suggestions: 'Kích hoạt Gemini AI để được nhận xét sâu sắc về tính thuyết phục của dẫn chứng và mạch lập luận.'
    }
  ];

  return {
    totalScore: 0,
    maxScore: 10.0,
    isAiGraded: false,
    gradedBy: 'Bộ thẩm định dự phòng (Chưa kết nối AI)',
    overallComment: 'Bài làm đã được tiếp nhận an toàn. Để bảo đảm tính sư phạm và chính xác tuyệt đối, hệ thống KHÔNG chấm điểm dựa vào số lượng từ hay việc có nhập chữ. Hãy kết nối Gemini AI để thẩm định đa chiều theo đúng tiêu chuẩn GDPT 2018.',
    topWeaknesses: [
      'Chưa thể đánh giá chiều sâu cảm thụ văn học khi chưa kích hoạt Gemini AI',
      'Cần kiểm tra lại bố cục đoạn văn và hệ thống dẫn chứng bài văn NLXH',
      'Cần đối chiếu các câu đọc hiểu với yêu cầu trọng tâm của đề'
    ],
    keyStrengths: [
      'Đã hoàn thành các phần thi trong bài làm'
    ],
    reviewTopics: [
      'Phương pháp trả lời câu hỏi đọc hiểu nhận biết và thông hiểu',
      'Kỹ năng viết đoạn văn cảm thụ khoảng 200 chữ',
      'Cấu trúc và cách đưa dẫn chứng thời sự vào bài văn NLXH'
    ],
    questionScores: allScores
  };
}
