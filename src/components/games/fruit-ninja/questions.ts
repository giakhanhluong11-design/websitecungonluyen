export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  category: string;
}

export const questionBank: Question[] = [
  {
    id: "q1",
    text: "He usually _____ up early in the morning.",
    correctAnswer: "gets",
    wrongAnswers: ["getting", "get", "got"],
    explanation: "Dùng thì hiện tại đơn với 'usually', chủ ngữ 'He' ngôi thứ 3 số ít nên động từ thêm 's'.",
    category: "Tenses"
  },
  {
    id: "q2",
    text: "The book _____ by my mother last year.",
    correctAnswer: "was bought",
    wrongAnswers: ["buys", "bought", "is bought"],
    explanation: "Câu bị động ở quá khứ đơn (last year). Cấu trúc: S + was/were + V3/ed.",
    category: "Passive Voice"
  },
  {
    id: "q3",
    text: "If I _____ you, I wouldn't do that.",
    correctAnswer: "were",
    wrongAnswers: ["am", "was", "will be"],
    explanation: "Câu điều kiện loại 2 (giả định không có thật ở hiện tại), to be dùng 'were' cho mọi ngôi.",
    category: "Conditional Sentences"
  },
  {
    id: "q4",
    text: "She asked me where I _____ from.",
    correctAnswer: "came",
    wrongAnswers: ["come", "coming", "to come"],
    explanation: "Câu tường thuật lùi thì (hiện tại đơn -> quá khứ đơn).",
    category: "Reported Speech"
  },
  {
    id: "q5",
    text: "I am looking forward to _____ you soon.",
    correctAnswer: "seeing",
    wrongAnswers: ["see", "saw", "be seen"],
    explanation: "Cấu trúc: look forward to + V-ing (mong đợi làm gì).",
    category: "Gerunds / infinitives"
  },
  {
    id: "q6",
    text: "The girl _____ is wearing a red dress is my sister.",
    correctAnswer: "who",
    wrongAnswers: ["which", "whom", "whose"],
    explanation: "Đại từ quan hệ 'who' thay thế cho danh từ chỉ người làm chủ ngữ.",
    category: "Relative Clauses"
  },
  {
    id: "q7",
    text: "It is _____ cold to go out today.",
    correctAnswer: "too",
    wrongAnswers: ["so", "such", "enough"],
    explanation: "Cấu trúc: too + adj + to V (quá... đến nỗi không thể làm gì).",
    category: "Common structures"
  },
  {
    id: "q8",
    text: "I wish I _____ a lot of money now.",
    correctAnswer: "had",
    wrongAnswers: ["have", "will have", "has"],
    explanation: "Câu ước ở hiện tại (now) lùi 1 thì về quá khứ đơn.",
    category: "Wish"
  },
  {
    id: "q9",
    text: "She is good _____ playing the piano.",
    correctAnswer: "at",
    wrongAnswers: ["in", "on", "for"],
    explanation: "Tính từ 'good' đi với giới từ 'at' (giỏi về việc gì).",
    category: "Prepositions"
  },
  {
    id: "q10",
    text: "You should give _____ smoking because it is bad for your health.",
    correctAnswer: "up",
    wrongAnswers: ["in", "on", "off"],
    explanation: "Phrasal verb 'give up' nghĩa là từ bỏ.",
    category: "Phrasal verbs"
  }
];

// Hàm trộn (shuffle) mảng ngẫu nhiên
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
