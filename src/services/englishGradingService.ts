import { EnglishExam } from '../types/practiceExamTypes';

export interface EnglishGradingSubmissionResult {
  totalScore: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  teacherReview: string;
  topWeaknesses: string[]; // 3 lỗi/điểm yếu quan trọng nhất
  keyStrengths: string[]; // Những phần học sinh làm tốt
  reviewTopics: string[]; // Gợi ý nội dung cần ôn lại
  weakGrammarPoints: string[];
  improvementTips: string[];
  isAiGraded?: boolean;
  gradedBy?: string;
}

export async function gradeEnglishSubmission(
  exam: EnglishExam,
  studentAnswers: Record<string, string>,
  onProgress?: (msg: string) => void
): Promise<EnglishGradingSubmissionResult> {
  onProgress?.('Đang thẩm định đáp án 40 câu hỏi, đối chiếu đáp án chuẩn và phân tích sư phạm...');

  let directScore = 0;
  let correctCount = 0;
  let wrongCount = 0;

  // Trắc nghiệm: Đúng được điểm, Sai = 0 điểm. Không bao giờ cho điểm chỉ vì có chọn đáp án.
  (exam.questions || []).forEach(q => {
    const rawStudentAns = (studentAnswers[q.id] || '').trim();
    if (!rawStudentAns) {
      wrongCount++;
      return;
    }

    const studentAns = rawStudentAns.toLowerCase();
    const correctAns = q.correctAnswer.trim().toLowerCase();
    const alternatives = (q.acceptableAlternativeAnswers || []).map(a => a.trim().toLowerCase());

    if (studentAns === correctAns || alternatives.includes(studentAns)) {
      directScore += q.points;
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const roundedScore = Math.round(directScore * 100) / 100;

  try {
    const response = await fetch('/api/grade/english', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam, studentAnswers })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.aiDiagnostic) {
        onProgress?.('Đã tổng hợp chẩn đoán năng lực Tiếng Anh!');
        const diag = data.aiDiagnostic;
        return {
          totalScore: roundedScore,
          maxScore: 10.0,
          correctCount,
          wrongCount,
          teacherReview: diag.teacherReview || 'Đã hoàn tất đánh giá bài thi.',
          topWeaknesses: Array.isArray(diag.topWeaknesses) && diag.topWeaknesses.length > 0 
            ? diag.topWeaknesses 
            : (diag.weakGrammarPoints?.slice(0, 3) || ['Word Formation', 'Giới từ & Cụm từ', 'Cấu trúc viết lại câu']),
          keyStrengths: Array.isArray(diag.keyStrengths) && diag.keyStrengths.length > 0
            ? diag.keyStrengths
            : (roundedScore >= 7.0 ? ['Ngữ pháp cơ bản và ngữ âm phát âm', 'Kỹ năng đọc lướt tìm thông tin'] : ['Tinh thần hoàn thành đầy đủ bài thi']),
          reviewTopics: Array.isArray(diag.reviewTopics) && diag.reviewTopics.length > 0
            ? diag.reviewTopics
            : (diag.improvementTips || ['Ôn tập họ từ (Word family)', 'Rà soát cấu trúc câu đảo ngữ và câu điều kiện']),
          weakGrammarPoints: diag.weakGrammarPoints || [],
          improvementTips: diag.improvementTips || [],
          isAiGraded: data.isAiGraded ?? diag.isAiGraded ?? false,
          gradedBy: data.gradedBy ?? (data.isAiGraded ? 'Gemini AI (Đọc & Phân tích chuyên sâu)' : 'Bộ thẩm định dự phòng')
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API chấm Tiếng Anh, dùng chẩn đoán sư phạm tiêu chuẩn:', err);
  }

  return {
    totalScore: roundedScore,
    maxScore: 10.0,
    correctCount,
    wrongCount,
    teacherReview: roundedScore >= 8.0
      ? 'Góc nhìn giám khảo: Nền tảng từ vựng và ngữ pháp của em rất vững vàng! Các câu hỏi phân hóa ở phần đọc hiểu và viết lại câu được giải quyết tương đối xuất sắc.'
      : roundedScore >= 6.5
      ? 'Góc nhìn giám khảo: Bài làm đạt mức khá. Em nắm chắc các cấu trúc thông dụng, nhưng còn dễ mất điểm ở phần biến đổi từ loại (Word Form) và một số giới từ/liên từ.'
      : 'Góc nhìn giám khảo: Em cần ôn tập kỹ lại các thì động từ, trật tự từ và luyện thêm kĩ năng làm bài đọc hiểu để cải thiện tốc độ và độ chính xác.',
    topWeaknesses: [
      'Word Formation (Chia loại từ danh/tính/động/trạng)',
      'Sentence Transformation (Cấu trúc tương đương & Thì hoàn thành)',
      'Prepositions & Dependent Collocations (Giới từ đi kèm)'
    ],
    keyStrengths: roundedScore >= 7.0 
      ? ['Nắm chắc trật tự từ trong câu đơn', 'Phát âm - trọng âm các từ quen thuộc'] 
      : ['Đã hoàn thành làm các câu hỏi trong đề'],
    reviewTopics: [
      'Bảng chuyển đổi họ từ (Danh - Tính - Động - Trạng)',
      'Cấu trúc biến đổi thì Quá khứ đơn <-> Hiện tại hoàn thành',
      'Kỹ năng gạch chân từ khóa trong bài đọc hiểu'
    ],
    weakGrammarPoints: [
      'Word Formation (Chia loại từ danh/tính/động/trạng)',
      'Sentence Transformation (Cấu trúc tương đương & Thì hoàn thành)',
      'Prepositions & Dependent Collocations'
    ],
    improvementTips: [
      'Luyện tập nhận diện tiền tố và hậu tố của từ vựng mỗi ngày',
      'Đọc kĩ ngữ cảnh đoạn văn trước khi chọn đáp án bài đọc hiểu',
      'Kiểm tra lại chính tả từng chữ cái khi làm câu viết lại'
    ]
  };
}
