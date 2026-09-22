import { EnglishExam, EnglishQuestion } from '../types/practiceExamTypes';

// Sinh ngẫu nhiên đề Tiếng Anh đúng chuẩn 40 câu - 10.0 điểm: Ưu tiên gọi AI Gemini tạo đề mới 100%
export async function generateRandomEnglishExam(
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa' = 'Chuẩn',
  onProgressStep?: (msg: string) => void
): Promise<EnglishExam> {
  onProgressStep?.('AI Gemini đang sáng tạo đề Tiếng Anh 40 câu và bài đọc mới...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max wait

    const res = await fetch('/api/generate/english-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.exam && Array.isArray(data.exam.questions) && data.exam.questions.length === 40) {
        onProgressStep?.('Đề thi Tiếng Anh độc bản từ AI đã sẵn sàng!');
        await new Promise(r => setTimeout(r, 300));
        return data.exam as EnglishExam;
      }
    }
  } catch (err) {
    console.warn('Không thể tạo đề Tiếng Anh từ AI trực tiếp, chuyển sang ngân hàng đề chuẩn:', err);
  }

  onProgressStep?.('Đang chuẩn hóa 40 câu hỏi trắc nghiệm & viết lại câu...');
  await new Promise(r => setTimeout(r, 400));
  return generateLocalEnglishExam(difficulty, onProgressStep);
}

function generateLocalEnglishExam(
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa',
  onProgressStep?: (msg: string) => void
): EnglishExam {
  onProgressStep?.('Đang chọn ngân hàng Ngữ âm (Nguyên âm, phụ âm, trọng âm)...');

  // 1. PHẦN 1: NGỮ ÂM (4 câu - 1.0 điểm) - Nhận biết 2 câu, Thông hiểu 2 câu
  const PHONETICS_BANK = [
    {
      q: 'Choose the word whose underlined part is pronounced differently from that of the others:',
      options: ['A. inv<u>i</u>te', 'B. dec<u>i</u>de', 'C. pr<u>i</u>de', 'D. ch<u>i</u>ldren'],
      correct: 'D',
      exp: 'Đáp án D phát âm là /ɪ/, các từ còn lại phát âm là /aɪ/.'
    },
    {
      q: 'Choose the word whose underlined part is pronounced differently from that of the others:',
      options: ['A. walk<u>ed</u>', 'B. stopp<u>ed</u>', 'C. want<u>ed</u>', 'D. laugh<u>ed</u>'],
      correct: 'C',
      exp: 'Đáp án C tận cùng là /t/ nên phát âm là /ɪd/, các từ còn lại phát âm là /t/.'
    },
    {
      q: 'Choose the word that has a different stress pattern from the others:',
      options: ['A. \'promise', 'B. de\'sign', 'C. pro\'tect', 'D. pre\'fer'],
      correct: 'A',
      exp: 'Đáp án A có trọng âm rơi vào âm tiết thứ nhất, các từ còn lại rơi vào âm tiết thứ hai.'
    },
    {
      q: 'Choose the word that has a different stress pattern from the others:',
      options: ['A. pol\'lution', 'B. \'difficult', 'C. \'energy', 'D. \'natural'],
      correct: 'A',
      exp: 'Đáp án A có trọng âm rơi vào âm tiết thứ hai (/pəˈluːʃn/), các từ còn lại rơi vào âm tiết thứ nhất.'
    }
  ];

  // 2. PHẦN 2: TỪ VỰNG, NGỮ PHÁP, GIAO TIẾP (12 câu: Câu 5-16, 3.0 điểm)
  const VOCAB_GRAMMAR_BANK = [
    {
      q: 'If we continue to waste water, there _______ a severe shortage in the near future.',
      options: ['A. will be', 'B. is', 'C. was', 'D. would be'],
      correct: 'A',
      exp: 'Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở tương lai: If + S + V(hiện tại đơn), S + will + V-inf.'
    },
    {
      q: 'The boy _______ won the first prize in the national English contest is my neighbor.',
      options: ['A. which', 'B. who', 'C. whom', 'D. whose'],
      correct: 'B',
      exp: 'Đại từ quan hệ "who" thay thế cho danh từ chỉ người ("The boy") làm chủ ngữ trong mệnh đề quan hệ.'
    },
    {
      q: 'We should encourage students to use public transport to reduce air _______.',
      options: ['A. polluted', 'B. polluter', 'C. pollution', 'D. pollute'],
      correct: 'C',
      exp: 'Cần một danh từ sau tính từ "air" để tạo thành cụm danh từ "air pollution" (sự ô nhiễm không khí).'
    },
    {
      q: 'Mai suggested _______ old textbooks and uniforms to help children in mountain areas.',
      options: ['A. collecting', 'B. to collect', 'C. collected', 'D. collect'],
      correct: 'A',
      exp: 'Cấu trúc "suggest + V-ing" dùng để đưa ra lời gợi ý, đề xuất.'
    },
    {
      q: 'She hasn\'t seen her grandparents _______ they moved to Da Lat five years ago.',
      options: ['A. since', 'B. for', 'C. when', 'D. while'],
      correct: 'A',
      exp: 'Thì hiện tại hoàn thành đi kèm với "since + mốc thời gian/mệnh đề quá khứ đơn".'
    },
    {
      q: 'Students must _______ attention to the safety rules in the school laboratory.',
      options: ['A. take', 'B. make', 'C. pay', 'D. give'],
      correct: 'C',
      exp: 'Collocation: "pay attention to sth" nghĩa là chú ý, tập trung vào điều gì.'
    },
    {
      q: 'David: "Would you like to join our environmental campaign this weekend?" - Peter: "_______"',
      options: ['A. Yes, I\'d love to.', 'B. Not at all.', 'C. You\'re welcome.', 'D. No problem.'],
      correct: 'A',
      exp: 'Đáp lại lời mời lịch sự "Would you like...", dùng "Yes, I\'d love to" (Vâng, mình rất muốn tham gia).'
    },
    {
      q: 'Because of heavy rain, the football match between the two schools had to be _______.',
      options: ['A. put on', 'B. put off', 'C. turned on', 'D. turned off'],
      correct: 'B',
      exp: 'Cụm động từ "put off" có nghĩa là hoãn lại.'
    },
    {
      q: 'The teacher asked Nam why he _______ late for class that morning.',
      options: ['A. is', 'B. was', 'C. has been', 'D. had been'],
      correct: 'B',
      exp: 'Câu tường thuật câu hỏi: lùi thì từ hiện tại đơn sang quá khứ đơn (was).'
    },
    {
      q: 'Green spaces in urban cities can help improve citizens\' mental and physical _______.',
      options: ['A. wealth', 'B. well-being', 'C. illness', 'D. weakness'],
      correct: 'B',
      exp: '"well-being" nghĩa là tình trạng khỏe mạnh, hạnh phúc, an lành.'
    },
    {
      q: 'Lan: "Congratulations on winning the gold medal in swimming!" - Hoa: "_______"',
      options: ['A. That\'s very kind of you to say so.', 'B. Good luck!', 'C. Never mind.', 'D. It doesn\'t matter.'],
      correct: 'A',
      exp: 'Lời cảm ơn lịch sự khi nhận được lời chúc mừng thành tích.'
    },
    {
      q: 'Although he was tired after a long journey, he _______ finished all his homework.',
      options: ['A. but', 'B. so', 'C. still', 'D. however'],
      correct: 'C',
      exp: 'Mệnh đề đã có "Although", không dùng "but"; dùng trạng từ "still" (vẫn) để nhấn mạnh sự nỗ lực.'
    }
  ];

  // 3. PHẦN 4: ĐỌC HIỂU (12 câu: Câu 17-28, 3.0 điểm)
  // Câu 17-22: Bài điền khuyết (Cloze Passage, 80-100 từ)
  const clozeWordBank = ['environment', 'save', 'habits', 'because', 'protect', 'recycle', 'waste', 'energy'];
  const clozePassageText = `Every individual can take small daily actions to help protect our planet. First, we should turn off electric devices when leaving the room in order to (17)______ energy and lower electricity bills. Second, separating household rubbish allows factories to (18)______ plastic bottles and paper easily. Moreover, forming eco-friendly (19)______ such as using canvas tote bags instead of plastic ones is crucial (20)______ plastic bags take hundreds of years to decompose. By working together, we can preserve a clean (21)______ for future generations and make our community a healthier place to (22)______.`;
  
  const clozeQuestions = [
    { num: 17, correct: 'save', options: ['save', 'waste', 'spend', 'lose'], exp: 'Dùng "save energy" nghĩa là tiết kiệm năng lượng.' },
    { num: 18, correct: 'recycle', options: ['recycle', 'destroy', 'burn', 'throw'], exp: '"recycle" (tái chế) chai nhựa và giấy.' },
    { num: 19, correct: 'habits', options: ['habits', 'customs', 'rules', 'fashions'], exp: 'Cụm từ "forming eco-friendly habits" (hình thành các thói quen thân thiện môi trường).' },
    { num: 20, correct: 'because', options: ['because', 'although', 'despite', 'however'], exp: 'Liên từ chỉ nguyên nhân "because" (bởi vì túi nylon mất hàng trăm năm để phân hủy).' },
    { num: 21, correct: 'environment', options: ['environment', 'atmosphere', 'weather', 'climate'], exp: 'Cụm "clean environment" (môi trường trong sạch).' },
    { num: 22, correct: 'protect', options: ['live', 'protect', 'work', 'visit'], exp: '"a healthier place to live" (nơi sống lành mạnh hơn).' }
  ];

  // Câu 23-28: Đọc hiểu văn bản (Reading Comprehension, 180-200 từ)
  const readingPassageText = `Self-study is one of the most essential skills that students need to develop during their secondary school years. Unlike learning passively in class where teachers guide every single step, self-directed learners take full responsibility for their own education. They actively set specific study goals, search for relevant references from books or the Internet, and organize their study timetable effectively.
Research has shown that students with good autonomous study habits often achieve higher academic performance and feel less stressed before major exams. When encountering difficult exercises, instead of giving up immediately, they try different approaches and analyze their mistakes. Furthermore, the ability to study independently prepares young teenagers for higher education and adult life, where continuous adaptation and lifelong learning are vital for career success. In conclusion, practicing self-study every day not only improves knowledge but also builds confidence and perseverance.`;

  const readingQuestions = [
    {
      num: 23,
      q: 'What is the main topic of the passage?',
      options: ['A. The history of modern secondary schools', 'B. The importance and benefits of self-study', 'C. How to prepare for university exams', 'D. The role of teachers in classrooms'],
      correct: 'B',
      exp: 'Ý chính của toàn đoạn là phân tích tầm quan trọng và những lợi ích của việc tự học.'
    },
    {
      num: 24,
      q: 'According to the passage, self-directed learners _______',
      options: ['A. depend entirely on their teachers', 'B. never make any mistakes in exams', 'C. take responsibility for their own learning', 'D. only study before big tests'],
      correct: 'C',
      exp: 'Thông tin trong đoạn 1: "...self-directed learners take full responsibility for their own education".'
    },
    {
      num: 25,
      q: 'The word "autonomous" in the second paragraph is closest in meaning to _______',
      options: ['A. independent', 'B. careless', 'C. passive', 'D. stressful'],
      correct: 'A',
      exp: '"autonomous" nghĩa là tự chủ, độc lập, đồng nghĩa với "independent".'
    },
    {
      num: 26,
      q: 'What do students with good self-study habits do when facing difficult exercises?',
      options: ['A. They stop doing homework immediately.', 'B. They ask others to do it for them.', 'C. They try various methods and learn from errors.', 'D. They ignore the mistakes.'],
      correct: 'C',
      exp: 'Thông tin ở đoạn 2: "...instead of giving up immediately, they try different approaches and analyze their mistakes".'
    },
    {
      num: 27,
      q: 'The word "They" in the first paragraph refers to _______',
      options: ['A. teachers', 'B. major exams', 'C. study goals', 'D. self-directed learners'],
      correct: 'D',
      exp: '"They" ở câu tiếp theo thay thế cho danh từ số nhiều "self-directed learners".'
    },
    {
      num: 28,
      q: 'Which of the following is NOT true according to the passage?',
      options: ['A. Self-study prepares young teenagers for future life.', 'B. Learning by oneself causes more stress before exams.', 'C. Lifelong learning is crucial for career success.', 'D. Self-study helps build confidence and perseverance.'],
      correct: 'B',
      exp: 'Đoạn văn nêu rõ học sinh tự học tốt "feel less stressed before major exams" chứ không phải gây thêm căng thẳng.'
    }
  ];

  // 4. PHẦN 3: VIẾT (12 câu: Câu 29-40, 3.0 điểm)
  // Câu 29-34: Dạng đúng của từ (Word Form - 6 câu)
  const wordFormQuestions = [
    {
      num: 29,
      prompt: 'Solar energy is an abundant and _______ source of clean power. (RENEW)',
      correct: 'renewable',
      acceptable: ['renewable'],
      exp: 'Cần một tính từ trước danh từ "source": renewable (có thể tái tạo).'
    },
    {
      num: 30,
      prompt: 'The local government is working to improve the _______ of public transportation. (EFFICIENT)',
      correct: 'efficiency',
      acceptable: ['efficiency'],
      exp: 'Sau mạo từ "the" cần một danh từ: efficiency (hiệu quả, hiệu suất).'
    },
    {
      num: 31,
      prompt: 'She answered all the interview questions _______ and got the scholarship. (CONFIDENCE)',
      correct: 'confidently',
      acceptable: ['confidently'],
      exp: 'Bổ nghĩa cho động từ "answered" cần một trạng từ: confidently (một cách tự tin).'
    },
    {
      num: 32,
      prompt: 'Deforestation causes severe damage to natural _______ around the world. (HABITAT)',
      correct: 'habitats',
      acceptable: ['habitats', 'habitat'],
      exp: 'Cần danh từ số nhiều "habitats" (môi trường sống tự nhiên).'
    },
    {
      num: 33,
      prompt: 'It is _______ to cross the busy street without looking both ways carefully. (DANGER)',
      correct: 'dangerous',
      acceptable: ['dangerous'],
      exp: 'Cấu trúc "It is + adj + to V": dangerous (nguy hiểm).'
    },
    {
      num: 34,
      prompt: 'Reading books regularly helps broaden our general _______. (KNOW)',
      correct: 'knowledge',
      acceptable: ['knowledge'],
      exp: 'Sau tính từ "general" cần danh từ không đếm được: knowledge (kiến thức).'
    }
  ];

  // Câu 35-36: Viết cụm từ dựa trên từ điển / ghi chú ngữ cảnh (2 câu)
  const phraseQuestions = [
    {
      num: 35,
      prompt: 'Dictionary note: [LOOK UP TO: to admire and respect someone]. Rewrite with 3 words: "Minh always respects and admires his elder brother." -> Minh always _______ his elder brother.',
      correct: 'looks up to',
      acceptable: ['looks up to'],
      exp: 'Cụm động từ "looks up to" tương đương với "respects and admires".'
    },
    {
      num: 36,
      prompt: 'Context hint: [CATCH UP WITH: to reach the same standard as someone]. Fill in the blank: "If you miss school for a week, you will have to study hard to _______ your classmates."',
      correct: 'catch up with',
      acceptable: ['catch up with', 'keep up with'],
      exp: '"catch up with" nghĩa là đuổi kịp, theo kịp tiến độ của bạn cùng lớp.'
    }
  ];

  // Câu 37-40: Viết lại câu không đổi nghĩa (Sentence Transformation - 4 câu)
  const sentenceTransformQuestions = [
    {
      num: 37,
      prompt: '"I will visit the historical museum with my class tomorrow," Nam said. -> Nam said that _______ the historical museum with his class the next day.',
      correct: 'he would visit',
      acceptable: ['he would visit', 'he\'d visit'],
      exp: 'Tường thuật câu trực tiếp: đổi "I" -> "he", lùi thì "will visit" -> "would visit".'
    },
    {
      num: 38,
      prompt: 'People believe that eating more fresh vegetables is good for health. -> Eating more fresh vegetables _______ good for health.',
      correct: 'is believed to be',
      acceptable: ['is believed to be'],
      exp: 'Cấu trúc bị động khách quan: S + is/are believed to + V-inf.'
    },
    {
      num: 39,
      prompt: 'Because the traffic was extremely heavy, we arrived at the concert thirty minutes late. -> Because of _______, we arrived at the concert thirty minutes late.',
      correct: 'the heavy traffic',
      acceptable: ['the heavy traffic', 'the extremely heavy traffic', 'extremely heavy traffic'],
      exp: '"Because + clause" chuyển thành "Because of + noun phrase" (the extremely heavy traffic).'
    },
    {
      num: 40,
      prompt: 'It has been more than three years since she last traveled to Hanoi. -> She hasn\'t _______ for more than three years.',
      correct: 'traveled to Hanoi',
      acceptable: ['traveled to Hanoi', 'travelled to Hanoi', 'visited Hanoi'],
      exp: 'Chuyển đổi thì quá khứ đơn sang hiện tại hoàn thành phủ định: S + hasn\'t + V3/ed + for...'
    }
  ];

  // Ghép toàn bộ 40 câu theo đúng số thứ tự
  const allQuestions: EnglishQuestion[] = [];

  // Câu 1 - 4 (Phonetics)
  PHONETICS_BANK.forEach((item, idx) => {
    allQuestions.push({
      id: `en_q_${idx + 1}`,
      index: idx + 1,
      partIndex: 1,
      partTitle: 'PHẦN 1: NGỮ ÂM (1.0 điểm)',
      type: 'phonetics',
      level: idx < 2 ? 'nhan-biet' : 'thong-hieu',
      points: 0.25,
      prompt: item.q,
      options: item.options,
      correctAnswer: item.correct,
      explanation: item.exp
    });
  });

  // Câu 5 - 16 (Vocab, Grammar, Comm)
  VOCAB_GRAMMAR_BANK.forEach((item, idx) => {
    const qIndex = idx + 5;
    allQuestions.push({
      id: `en_q_${qIndex}`,
      index: qIndex,
      partIndex: 2,
      partTitle: 'PHẦN 2: TỪ VỰNG, NGỮ PHÁP & GIAO TIẾP (3.0 điểm)',
      type: 'vocab_grammar_comm',
      level: idx < 2 ? 'nhan-biet' : idx < 8 ? 'thong-hieu' : 'van-dung',
      points: 0.25,
      prompt: item.q,
      options: item.options,
      correctAnswer: item.correct,
      explanation: item.exp
    });
  });

  // Câu 17 - 22 (Cloze passage)
  clozeQuestions.forEach((item) => {
    allQuestions.push({
      id: `en_q_${item.num}`,
      index: item.num,
      partIndex: 4,
      partTitle: 'PHẦN 4: ĐỌC HIỂU (3.0 điểm) - Điền khuyết văn bản',
      type: 'cloze_passage',
      level: 'thong-hieu',
      points: 0.25,
      prompt: `Chỗ trống (${item.num}): Chọn từ thích hợp để hoàn thành đoạn văn`,
      options: item.options.map((opt, i) => `${['A', 'B', 'C', 'D'][i]}. ${opt}`),
      wordBank: clozeWordBank,
      contextPassage: clozePassageText,
      correctAnswer: item.correct,
      explanation: item.exp
    });
  });

  // Câu 23 - 28 (Reading comprehension)
  readingQuestions.forEach((item) => {
    allQuestions.push({
      id: `en_q_${item.num}`,
      index: item.num,
      partIndex: 4,
      partTitle: 'PHẦN 4: ĐỌC HIỂU (3.0 điểm) - Đọc hiểu văn bản',
      type: 'reading_comp',
      level: item.num <= 25 ? 'thong-hieu' : 'van-dung',
      points: 0.25,
      prompt: item.q,
      options: item.options,
      contextPassage: readingPassageText,
      correctAnswer: item.correct,
      explanation: item.exp
    });
  });

  // Câu 29 - 34 (Word Form)
  wordFormQuestions.forEach((item) => {
    allQuestions.push({
      id: `en_q_${item.num}`,
      index: item.num,
      partIndex: 3,
      partTitle: 'PHẦN 3: KĨ NĂNG VIẾT (3.0 điểm) - Dạng đúng của từ',
      type: 'word_form',
      level: item.num <= 31 ? 'thong-hieu' : 'van-dung',
      points: 0.25,
      prompt: item.prompt,
      correctAnswer: item.correct,
      acceptableAlternativeAnswers: item.acceptable,
      explanation: item.exp
    });
  });

  // Câu 35 - 36 (Phrase matching)
  phraseQuestions.forEach((item) => {
    allQuestions.push({
      id: `en_q_${item.num}`,
      index: item.num,
      partIndex: 3,
      partTitle: 'PHẦN 3: KĨ NĂNG VIẾT (3.0 điểm) - Khai thác từ điển & cụm từ',
      type: 'phrase_matching',
      level: 'van-dung',
      points: 0.25,
      prompt: item.prompt,
      correctAnswer: item.correct,
      acceptableAlternativeAnswers: item.acceptable,
      explanation: item.exp
    });
  });

  // Câu 37 - 40 (Sentence transformation)
  sentenceTransformQuestions.forEach((item) => {
    allQuestions.push({
      id: `en_q_${item.num}`,
      index: item.num,
      partIndex: 3,
      partTitle: 'PHẦN 3: KĨ NĂNG VIẾT (3.0 điểm) - Viết lại câu không đổi nghĩa',
      type: 'sentence_transformation',
      level: 'van-dung',
      points: 0.25,
      prompt: item.prompt,
      correctAnswer: item.correct,
      acceptableAlternativeAnswers: item.acceptable,
      explanation: item.exp
    });
  });

  // Sắp xếp lại danh sách câu hỏi theo đúng index 1 -> 40
  allQuestions.sort((a, b) => a.index - b.index);

  onProgressStep?.('Đang chuẩn bị 40 câu hỏi và bài đọc...');

  return {
    id: `en-${Date.now()}`,
    subjectId: 'anh',
    title: `Đề Luyện Tập Tiếng Anh 9 Chuẩn Tuyển Sinh 10 (Mã đề: E${Math.floor(Math.random() * 900 + 100)})`,
    difficulty,
    timeMinutes: 90,
    questions: allQuestions,
    clozePassage: {
      text: clozePassageText,
      wordCount: 88,
      wordBank: clozeWordBank
    },
    readingPassage: {
      text: readingPassageText,
      wordCount: 188,
      title: 'The Essential Role of Autonomous Self-Study in Secondary Education'
    },
    metadata: {
      totalQuestions: 40,
      totalScore: 10.0,
      cognitiveRatios: {
        recognitionCount: 8, // 20%
        understandingCount: 16, // 40%
        applicationCount: 16 // 40%
      },
      partCounts: {
        part1Phonetics: 4,
        part2VocabGrammar: 12,
        part3Writing: 12,
        part4Reading: 12
      },
      createdAt: new Date().toISOString()
    }
  };
}
