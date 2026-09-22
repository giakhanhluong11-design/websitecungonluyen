// Type definitions cho 3 chế độ sinh đề ngẫu nhiên: Văn, Toán, Tiếng Anh

// ==================== MÔN VĂN ====================
export interface LiteratureExamPart1Q {
  id: string; // 'q1_1', 'q1_2', 'q1_3', 'q1_4'
  level: 'nhan-biet' | 'thong-hieu' | 'van-dung';
  levelLabel: string;
  points: number;
  question: string;
  isVietnameseKnowledge?: boolean;
  vietnameseTopic?: string;
  guideAnswer: string;
  gradingCriteria: string;
}

export interface LiteratureExam {
  id: string;
  subjectId: 'van';
  title: string;
  topicGroup: string;
  topic: string;
  subtopic: string;
  textType: string;
  vietnameseConcept: string;
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa';
  timeMinutes: number; // 120
  
  // Phần I: Đọc hiểu văn học + Đoạn văn = 5.0 đ
  part1: {
    passageTitle: string;
    passageType: 'thơ' | 'truyện' | 'tản văn' | 'tùy bút';
    passageSource: string; // "Ngữ liệu do hệ thống biên soạn"
    passageText: string;
    wordCount: number;
    question1SubQuestions: LiteratureExamPart1Q[]; // 4 câu = 3.0đ
    question2: { // Viết đoạn văn ~200 chữ = 2.0đ
      id: string;
      prompt: string;
      taskType: string;
      wordLimitText: string;
      points: number; // 2.0
      guideAnswer: string;
      rubric: {
        formatAndLength: number; // 0.25
        contentAndTheme: number; // 0.75
        artisticAnalysis: number; // 0.50
        cohesionAndLinking: number; // 0.25
        spellingAndGrammar: number; // 0.25
      };
    };
  };

  // Phần II: Đọc hiểu nghị luận / thông tin + Bài văn NLXH = 5.0 đ
  part2: {
    passageTitle: string;
    passageType: 'nghị luận' | 'thông tin';
    passageSource: string; // "Ngữ liệu do hệ thống biên soạn"
    passageText: string;
    wordCount: number;
    question3: { // Đọc hiểu = 1.0đ
      id: string;
      level: 'thong-hieu' | 'van-dung';
      levelLabel: string;
      points: number; // 1.0
      question: string;
      guideAnswer: string;
    };
    question4: { // Bài văn NLXH = 4.0đ
      id: string;
      prompt: string;
      essayType: 'vấn đề đời sống' | 'vấn đề cần giải quyết';
      points: number; // 4.0
      guideAnswer: string;
      rubric: {
        issueIdentification: number; // 0.5
        structureAndOutline: number; // 0.5
        argumentsAndReasoning: number; // 1.5
        evidenceAndProof: number; // 0.75
        cohesionAndExpression: number; // 0.5
        spellingAndCreativity: number; // 0.25
      };
    };
  };

  metadata: {
    totalQuestions: number; // 7
    totalScore: number; // 10.0
    cognitiveRatios: {
      recognition: number; // 20%
      understanding: number; // 40%
      application: number; // 40%
    };
    totalWordCount: number; // <= 1300
    createdAt: string;
  };
}

export interface LiteratureGradingResult {
  totalScore: number;
  maxScore: number;
  isAiGraded?: boolean;
  gradedBy?: string;
  topWeaknesses?: string[]; // 3 lỗi/điểm yếu quan trọng nhất
  keyStrengths?: string[]; // Những phần học sinh làm tốt
  reviewTopics?: string[]; // Gợi ý nội dung cần ôn lại
  questionScores: {
    questionId: string;
    title: string;
    score: number;
    maxScore: number;
    criteriaScores?: Record<string, number>;
    studentAnswer: string;
    guideAnswer: string;
    feedback: string;
    correctPoints?: string; // Ý nào đúng
    incorrectPoints?: string; // Ý nào sai hoặc chưa đầy đủ
    whyWrong?: string; // Nếu sai, giải thích tại sao sai
    suggestedFix?: string; // Đề xuất cách sửa
    missingPoints?: string; // Nếu thiếu ý, chỉ rõ ý còn thiếu
    strengths?: string;
    weaknesses?: string;
    suggestions?: string;
  }[];
  overallComment: string;
}

// ==================== MÔN TOÁN ====================
export interface MathExerciseItem {
  id: string; // 'bai1', 'bai2', ... 'bai7'
  baiNumber: number; // 1 to 7
  title: string;
  points: number; // 1.5, 1.0, 1.5, 1.0, 1.0, 1.0, 3.0
  topicCategory: 'Số và Đại số' | 'Hình học và Đo lường' | 'Thống kê và Xác suất';
  problemText: string;
  subQuestions?: {
    id: string;
    label: string; // 'a', 'b', 'c'
    points: number;
    content: string;
  }[];
  svgIllustration?: {
    type: 'parabola' | 'circle_geometry' | 'statistics_chart' | 'measurement_shape';
    svgContent: string; // SVG rendered code
    caption: string;
  };
  sampleSolution: string;
  guideSteps: {
    step: string;
    points: number;
  }[];
}

export interface MathExam {
  id: string;
  subjectId: 'toan';
  title: string;
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa';
  timeMinutes: number; // 120
  exercises: MathExerciseItem[]; // Exactly 7 bài, total 10.0đ
  metadata: {
    totalScore: number; // 10.0
    totalExercises: number; // 7
    categoriesCovered: string[];
    createdAt: string;
  };
}

export interface MathGradingResult {
  totalScore: number;
  maxScore: number; // 10.0
  itemScores: {
    itemId: string;
    baiNumber: number;
    score: number;
    maxScore: number;
    methodComment: string;
    detailedFeedback: string;
    sampleSolution: string;
    studentAnswer: string;
  }[];
  overallComment: string;
}

// ==================== MÔN TIẾNG ANH ====================
export type EnglishQuestionType = 
  | 'phonetics' // 4 câu (1-4)
  | 'vocab_grammar_comm' // 12 câu (5-16)
  | 'cloze_passage' // 6 câu (17-22) - điền khuyết
  | 'reading_comp' // 6 câu (23-28) - đọc hiểu
  | 'word_form' // 6 câu (29-34) - dạng từ
  | 'phrase_matching' // 2 câu (35-36) - cụm từ theo chú thích
  | 'sentence_transformation'; // 4 câu (37-40) - viết câu

export interface EnglishQuestion {
  id: string;
  index: number; // 1 to 40
  partIndex: 1 | 2 | 3 | 4;
  partTitle: string;
  type: EnglishQuestionType;
  level: 'nhan-biet' | 'thong-hieu' | 'van-dung';
  points: number; // 0.25đ per question (total 40 * 0.25 = 10đ)
  prompt: string;
  options?: string[]; // Trắc nghiệm: A, B, C, D
  wordBank?: string[]; // Dùng cho cloze
  contextPassage?: string;
  correctAnswer: string;
  acceptableAlternativeAnswers?: string[];
  explanation: string;
}

export interface EnglishExam {
  id: string;
  subjectId: 'anh';
  title: string;
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa';
  timeMinutes: number; // 90
  questions: EnglishQuestion[]; // 40 questions
  clozePassage: {
    text: string;
    wordCount: number; // 80 - 100 words
    wordBank: string[];
  };
  readingPassage: {
    text: string;
    wordCount: number; // 180 - 200 words
    title: string;
  };
  metadata: {
    totalQuestions: number; // 40
    totalScore: number; // 10.0
    cognitiveRatios: {
      recognitionCount: number; // 8 (20%)
      understandingCount: number; // 16 (40%)
      applicationCount: number; // 16 (40%)
    };
    partCounts: {
      part1Phonetics: number; // 4
      part2VocabGrammar: number; // 12
      part3Writing: number; // 12
      part4Reading: number; // 12
    };
    createdAt: string;
  };
}

export interface EnglishGradingResult {
  totalScore: number;
  maxScore: number; // 10.0
  correctCount: number;
  wrongCount: number;
  partBreakdown: {
    part1Score: number;
    part2Score: number;
    part3Score: number;
    part4Score: number;
  };
  questionEvaluations: {
    questionIndex: number;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    earnedScore: number;
    explanation: string;
    aiFeedback?: string;
  }[];
}
