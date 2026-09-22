import { SubjectId } from '../types';

export interface FlashcardItem {
  id: string;
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  pronunciation?: string;
  topic?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  hint?: string;
}

export interface MinigameDefinition {
  id: string;
  title: string;
  subject: SubjectId;
  gameType: 'flashcard' | 'matching';
  description: string;
  totalItems: number;
  timeLimitSeconds?: number;
}

// =========================================================================
// 1. FLASHCARDS TIẾNG ANH (TỪ VỰNG TRỌNG TÂM ÔN THI VÀO 10)
// =========================================================================
export const ENGLISH_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    word: 'achieve',
    partOfSpeech: 'verb (động từ)',
    meaning: 'đạt được, hoàn thành mục tiêu',
    example: 'She worked hard to achieve a high score in the entrance exam.',
    pronunciation: '/əˈtʃiːv/'
  },
  {
    id: 'fc-2',
    word: 'environment',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'môi trường sống',
    example: 'Protecting the environment is the responsibility of everyone.',
    pronunciation: '/ɪnˈvaɪrənmənt/'
  },
  {
    id: 'fc-3',
    word: 'environmental',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'thuộc về môi trường',
    example: 'Air pollution is one of the most serious environmental issues.',
    pronunciation: '/ɪnˌvaɪrənˈmentl/'
  },
  {
    id: 'fc-4',
    word: 'preserve',
    partOfSpeech: 'verb (động từ)',
    meaning: 'bảo tồn, gìn giữ nguyên vẹn',
    example: 'We must preserve historical sites for future generations.',
    pronunciation: '/prɪˈzɜːv/'
  },
  {
    id: 'fc-5',
    word: 'heritage',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'di sản văn hóa',
    example: 'Trang An is recognized as a world cultural and natural heritage.',
    pronunciation: '/ˈherɪtɪdʒ/'
  },
  {
    id: 'fc-6',
    word: 'indispensable',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'không thể thiếu được, thiết yếu',
    example: 'Smartphones have become indispensable in our modern life.',
    pronunciation: '/ˌɪndɪˈspensəbl/'
  },
  {
    id: 'fc-7',
    word: 'reduce',
    partOfSpeech: 'verb (động từ)',
    meaning: 'giảm bớt, cắt giảm',
    example: 'We should walk more often to reduce carbon emissions.',
    pronunciation: '/rɪˈdjuːs/'
  },
  {
    id: 'fc-8',
    word: 'convenient',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'tiện lợi, thuận tiện',
    example: 'Living near the metro line makes commuting very convenient.',
    pronunciation: '/kənˈviːniənt/'
  },
  {
    id: 'fc-9',
    word: 'disappointed',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'thất vọng, buồn lòng',
    example: 'He was disappointed that he could not join the field trip.',
    pronunciation: '/ˌdɪsəˈpɔɪntɪd/'
  },
  {
    id: 'fc-10',
    word: 'disappointment',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự thất vọng',
    example: 'To her disappointment, the concert was postponed.',
    pronunciation: '/ˌdɪsəˈpɔɪntmənt/'
  },
  {
    id: 'fc-11',
    word: 'independent',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'độc lập, tự chủ',
    example: 'High school students should learn to become more independent.',
    pronunciation: '/ˌɪndɪˈpendənt/'
  },
  {
    id: 'fc-12',
    word: 'independence',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự độc lập, nền độc lập',
    example: 'Vietnam declared independence on September 2nd, 1945.',
    pronunciation: '/ˌɪndɪˈpendəns/'
  },
  {
    id: 'fc-13',
    word: 'carefully',
    partOfSpeech: 'adverb (trạng từ)',
    meaning: 'một cách cẩn thận, kỹ lưỡng',
    example: 'Please check your answers carefully before submitting the paper.',
    pronunciation: '/ˈkeəfəli/'
  },
  {
    id: 'fc-14',
    word: 'careless',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'bất cẩn, cẩu thả',
    example: 'He made some careless mistakes in the algebra section.',
    pronunciation: '/ˈkeələs/'
  },
  {
    id: 'fc-15',
    word: 'succeed',
    partOfSpeech: 'verb (động từ)',
    meaning: 'thành công, đạt kết quả tốt',
    example: 'If you persist and study steadily, you will succeed.',
    pronunciation: '/səkˈsiːd/'
  },
  {
    id: 'fc-16',
    word: 'successful',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'thành công (tính từ)',
    example: 'Her presentation was a successful demonstration of team effort.',
    pronunciation: '/səkˈsesfl/'
  },
  {
    id: 'fc-17',
    word: 'pollution',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự ô nhiễm',
    example: 'Plastic pollution poses an enormous danger to marine life.',
    pronunciation: '/pəˈluːʃn/'
  },
  {
    id: 'fc-18',
    word: 'pollutant',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'chất gây ô nhiễm',
    example: 'Factories must filter harmful pollutants before release.',
    pronunciation: '/pəˈluːtənt/'
  },
  {
    id: 'fc-19',
    word: 'solution',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'giải pháp, lời giải',
    example: 'Planting more trees is a sustainable solution to heatwaves.',
    pronunciation: '/səˈluːʃn/'
  },
  {
    id: 'fc-20',
    word: 'communicate',
    partOfSpeech: 'verb (động từ)',
    meaning: 'giao tiếp, trao đổi thông tin',
    example: 'Learning English allows us to communicate with global friends.',
    pronunciation: '/kəˈmjuːnɪkeɪt/'
  },
  {
    id: 'fc-21',
    word: 'communication',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự giao tiếp, truyền thông',
    example: 'Effective communication is an essential life skill.',
    pronunciation: '/kəˌmjuːnɪˈkeɪʃn/'
  },
  {
    id: 'fc-22',
    word: 'celebrate',
    partOfSpeech: 'verb (động từ)',
    meaning: 'ăn mừng, tổ chức kỷ niệm',
    example: 'Families gather to celebrate Tet with traditional foods.',
    pronunciation: '/ˈselɪbreɪt/'
  },
  {
    id: 'fc-23',
    word: 'celebration',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'lễ kỷ niệm, dịp ăn mừng',
    example: 'The school celebration ended with cheerful music performances.',
    pronunciation: '/ˌselɪˈbreɪʃn/'
  },
  {
    id: 'fc-24',
    word: 'improve',
    partOfSpeech: 'verb (động từ)',
    meaning: 'cải thiện, nâng cao',
    example: 'Daily reading will significantly improve your vocabulary.',
    pronunciation: '/ɪmˈpruːv/'
  },
  {
    id: 'fc-25',
    word: 'improvement',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự tiến bộ, sự cải thiện',
    example: 'His teacher noted a remarkable improvement in essay writing.',
    pronunciation: '/ɪmˈpruːvmənt/'
  },
  {
    id: 'fc-26',
    word: 'encourage',
    partOfSpeech: 'verb (động từ)',
    meaning: 'khuyến khích, động viên',
    example: 'Parents should encourage children to develop their passions.',
    pronunciation: '/ɪnˈkʌrɪdʒ/'
  },
  {
    id: 'fc-27',
    word: 'encouragement',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự khích lệ, lời động viên',
    example: 'Words of encouragement can boost a student\'s confidence.',
    pronunciation: '/ɪnˈkʌrɪdʒmənt/'
  },
  {
    id: 'fc-28',
    word: 'exhausted',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'kiệt sức, mệt lả',
    example: 'After studying all evening, she felt completely exhausted.',
    pronunciation: '/ɪɡˈzɔːstɪd/'
  },
  {
    id: 'fc-29',
    word: 'tradition',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'truyền thống phong tục',
    example: 'Wearing Ao Dai on special occasions is a time-honored tradition.',
    pronunciation: '/trəˈdɪʃn/'
  },
  {
    id: 'fc-30',
    word: 'traditional',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'thuộc về truyền thống',
    example: 'Banh chung is a traditional Vietnamese cake for Lunar New Year.',
    pronunciation: '/trəˈdɪʃənl/'
  },
  {
    id: 'fc-31',
    word: 'attract',
    partOfSpeech: 'verb (động từ)',
    meaning: 'thu hút, hấp dẫn',
    example: 'The ancient town of Hoi An attracts thousands of tourists yearly.',
    pronunciation: '/əˈtrækt/'
  },
  {
    id: 'fc-32',
    word: 'attraction',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'điểm thu hút, điểm du lịch',
    example: 'The city\'s botanical garden is a popular tourist attraction.',
    pronunciation: '/əˈtrækʃn/'
  },
  {
    id: 'fc-33',
    word: 'variety',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự phong phú, đa dạng',
    example: 'The library offers a wide variety of science fiction novels.',
    pronunciation: '/vəˈraɪəti/'
  },
  {
    id: 'fc-34',
    word: 'various',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'nhiều loại khác nhau',
    example: 'There are various ways to solve this geometry problem.',
    pronunciation: '/ˈveəriəs/'
  },
  {
    id: 'fc-35',
    word: 'generous',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'hào phóng, rộng lượng',
    example: 'It was very generous of him to share his revision notes.',
    pronunciation: '/ˈdʒenərəs/'
  },
  {
    id: 'fc-36',
    word: 'generosity',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'lòng hào phóng, tính rộng rãi',
    example: 'The charity relies on the generosity of local citizens.',
    pronunciation: '/ˌdʒenəˈrɒsəti/'
  },
  {
    id: 'fc-37',
    word: 'compulsory',
    partOfSpeech: 'adjective (tính từ)',
    meaning: 'bắt buộc, theo quy định',
    example: 'Math, Literature, and English are compulsory subjects in the exam.',
    pronunciation: '/kəmˈpʌlsəri/'
  },
  {
    id: 'fc-38',
    word: 'convenience',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự thuận tiện, tiện nghi',
    example: 'For your convenience, online registration is now open.',
    pronunciation: '/kənˈviːniəns/'
  },
  {
    id: 'fc-39',
    word: 'participate',
    partOfSpeech: 'verb (động từ)',
    meaning: 'tham gia, dự phần (in)',
    example: 'All students are encouraged to participate in community activities.',
    pronunciation: '/pɑːˈtɪsɪpeɪt/'
  },
  {
    id: 'fc-40',
    word: 'participation',
    partOfSpeech: 'noun (danh từ)',
    meaning: 'sự tham gia',
    example: 'Active participation during class helps students retain knowledge.',
    pronunciation: '/pɑːˌtɪsɪˈpeɪʃn/'
  }
];

// =========================================================================
// 2. CÁC GÓI GHÉP & NỐI CHO 3 MÔN (TOÁN - NGỮ VĂN - TIẾNG ANH)
// =========================================================================

export const MATCHING_GAMES_DATA: Record<string, {
  title: string;
  subject: SubjectId;
  description: string;
  columnALabel?: string;
  columnBLabel?: string;
  pairs: MatchingPair[];
}> = {
  // -------------------------------------------------------------
  // TIẾNG ANH
  // -------------------------------------------------------------
  'anh-matching-vocab': {
    title: 'Từ ↔ Nghĩa tiếng Việt',
    subject: 'anh',
    description: 'Ghép từ vựng tiếng Anh với nghĩa tiếng Việt tương ứng',
    columnALabel: 'Từ vựng tiếng Anh',
    columnBLabel: 'Nghĩa tiếng Việt',
    pairs: [
      { id: 'av-1', left: 'achieve', right: 'đạt được mục tiêu' },
      { id: 'av-2', left: 'preserve', right: 'bảo tồn, gìn giữ' },
      { id: 'av-3', left: 'indispensable', right: 'không thể thiếu' },
      { id: 'av-4', left: 'pollutant', right: 'chất gây ô nhiễm' },
      { id: 'av-5', left: 'heritage', right: 'di sản văn hóa' },
      { id: 'av-6', left: 'convenient', right: 'tiện lợi, thuận tiện' },
      { id: 'av-7', left: 'disappointed', right: 'cảm thấy thất vọng' },
      { id: 'av-8', left: 'exhausted', right: 'kiệt sức, mệt lả' },
      { id: 'av-9', left: 'solution', right: 'giải pháp giải quyết' },
      { id: 'av-10', left: 'compulsory', right: 'bắt buộc theo quy định' }
    ]
  },
  'anh-matching-pos': {
    title: 'Từ ↔ Loại từ (Word Form)',
    subject: 'anh',
    description: 'Xác định từ loại danh từ, động từ, tính từ hay trạng từ',
    columnALabel: 'Từ cần phân loại',
    columnBLabel: 'Từ loại (Word Form)',
    pairs: [
      { id: 'ap-1', left: 'carefully', right: 'Trạng từ (Adverb)' },
      { id: 'ap-2', left: 'pollution', right: 'Danh từ (Noun)' },
      { id: 'ap-3', left: 'successful', right: 'Tính từ (Adjective)' },
      { id: 'ap-4', left: 'succeed', right: 'Động từ (Verb)' },
      { id: 'ap-5', left: 'environmental', right: 'Tính từ (Adjective)' },
      { id: 'ap-6', left: 'encourage', right: 'Động từ (Verb)' },
      { id: 'ap-7', left: 'disappointment', right: 'Danh từ (Noun)' },
      { id: 'ap-8', left: 'surprisingly', right: 'Trạng từ (Adverb)' }
    ]
  },
  'anh-matching-grammar': {
    title: 'Cấu trúc ↔ Ý nghĩa & Cách dùng',
    subject: 'anh',
    description: 'Ghép cấu trúc ngữ pháp thi vào 10 với cách dùng tương ứng',
    columnALabel: 'Cấu trúc ngữ pháp',
    columnBLabel: 'Ý nghĩa & Cách dùng',
    pairs: [
      { id: 'ag-1', left: 'Used to + V', right: 'Thói quen trong quá khứ nay không còn nữa' },
      { id: 'ag-2', left: 'Suggest + V-ing', right: 'Gợi ý cùng làm một hành động' },
      { id: 'ag-3', left: 'If + S + V2/ed, S + would + V', right: 'Câu điều kiện loại 2 (giả định trái hiện tại)' },
      { id: 'ag-4', left: 'Although + Clause', right: 'Chỉ sự tương phản, nhượng bộ (mặc dù)' },
      { id: 'ag-5', left: 'Because of + Noun/V-ing', right: 'Chỉ nguyên nhân, lý do (bởi vì)' },
      { id: 'ag-6', left: 'So that + S + can/could + V', right: 'Chỉ mục đích của hành động (để mà)' },
      { id: 'ag-7', left: 'Too + Adj + for sb to V', right: 'Quá ... đến mức ai đó không thể làm gì' },
      { id: 'ag-8', left: 'Wish + S + V2/ed', right: 'Ước muốn trái ngược với thực tế ở hiện tại' }
    ]
  },

  // -------------------------------------------------------------
  // TOÁN HỌC
  // -------------------------------------------------------------
  'toan-matching-hangdangthuc': {
    title: 'Hằng đẳng thức ↔ Khai triển',
    subject: 'toan',
    description: 'Ghép biểu thức đại số với dạng khai triển chính xác',
    columnALabel: 'Hằng đẳng thức',
    columnBLabel: 'Dạng khai triển đúng',
    pairs: [
      { id: 'th-1', left: '(A + B)²', right: 'A² + 2AB + B²' },
      { id: 'th-2', left: '(A - B)²', right: 'A² - 2AB + B²' },
      { id: 'th-3', left: 'A² - B²', right: '(A - B)(A + B)' },
      { id: 'th-4', left: '(A + B)³', right: 'A³ + 3A²B + 3AB² + B³' },
      { id: 'th-5', left: '(A - B)³', right: 'A³ - 3A²B + 3AB² - B³' },
      { id: 'th-6', left: 'A³ + B³', right: '(A + B)(A² - AB + B²)' },
      { id: 'th-7', left: 'A³ - B³', right: '(A - B)(A² + AB + B²)' },
      { id: 'th-8', left: '√(A²)', right: '|A|' }
    ]
  },
  'toan-matching-viet-pt': {
    title: 'Phương trình & Định lý Vi-ét',
    subject: 'toan',
    description: 'Ghép công thức nghiệm, biệt thức và hệ thức Vi-ét',
    columnALabel: 'Đại lượng / Biểu thức',
    columnBLabel: 'Công thức & Định lý',
    pairs: [
      { id: 'tv-1', left: 'Tổng hai nghiệm x₁ + x₂', right: '-b / a' },
      { id: 'tv-2', left: 'Tích hai nghiệm x₁.x₂', right: 'c / a' },
      { id: 'tv-3', left: 'Biệt thức Delta (Δ)', right: 'b² - 4ac' },
      { id: 'tv-4', left: 'Biệt thức Delta phẩy (Δ\')', right: 'b\'² - ac (với b = 2b\')' },
      { id: 'tv-5', left: 'ax² + bx + c = 0 có a + b + c = 0', right: 'x₁ = 1 và x₂ = c / a' },
      { id: 'tv-6', left: 'ax² + bx + c = 0 có a - b + c = 0', right: 'x₁ = -1 và x₂ = -c / a' },
      { id: 'tv-7', left: 'PT bậc 2 có 2 nghiệm phân biệt', right: 'a ≠ 0 và Δ > 0' },
      { id: 'tv-8', left: 'Hàm số y = ax² (a > 0)', right: 'Nghịch biến khi x < 0, đồng biến khi x > 0' }
    ]
  },
  'toan-matching-hinhkhonggian': {
    title: 'Hình học & Công thức tính',
    subject: 'toan',
    description: 'Ghép tên đại lượng hình học với công thức tính chuẩn xác',
    columnALabel: 'Tên đại lượng / Định lý',
    columnBLabel: 'Công thức hình học',
    pairs: [
      { id: 'thk-1', left: 'Thể tích hình trụ (V)', right: 'V = πr²h' },
      { id: 'thk-2', left: 'Diện tích xung quanh hình trụ (Sxq)', right: 'Sxq = 2πrh' },
      { id: 'thk-3', left: 'Thể tích hình nón (V)', right: 'V = (1/3)πr²h' },
      { id: 'thk-4', left: 'Diện tích xung quanh hình nón (Sxq)', right: 'Sxq = πrl' },
      { id: 'thk-5', left: 'Thể tích hình cầu (V)', right: 'V = (4/3)πR³' },
      { id: 'thk-6', left: 'Diện tích mặt cầu (S)', right: 'S = 4πR²' },
      { id: 'thk-7', left: 'Tỉ số sin α trong tam giác vuông', right: 'Cạnh đối / Cạnh huyền' },
      { id: 'thk-8', left: 'Tỉ số cos α trong tam giác vuông', right: 'Cạnh kề / Cạnh huyền' },
      { id: 'thk-9', left: 'Góc nội tiếp chắn nửa đường tròn', right: 'Bằng 90°' }
    ]
  },

  // -------------------------------------------------------------
  // NGỮ VĂN
  // -------------------------------------------------------------
  'van-matching-tacgia': {
    title: 'Tác phẩm ↔ Tác giả',
    subject: 'van',
    description: 'Ghép tác phẩm văn học lớp 9 với tác giả sáng tác',
    columnALabel: 'Tác phẩm văn học',
    columnBLabel: 'Tác giả sáng tác',
    pairs: [
      { id: 'vtg-1', left: 'Đồng chí', right: 'Chính Hữu' },
      { id: 'vtg-2', left: 'Bài thơ về tiểu đội xe không kính', right: 'Phạm Tiến Duật' },
      { id: 'vtg-3', left: 'Bếp lửa', right: 'Bằng Việt' },
      { id: 'vtg-4', left: 'Ánh trăng', right: 'Nguyễn Duy' },
      { id: 'vtg-5', left: 'Mùa xuân nho nhỏ', right: 'Thanh Hải' },
      { id: 'vtg-6', left: 'Viếng lăng Bác', right: 'Viễn Phương' },
      { id: 'vtg-7', left: 'Sang thu', right: 'Hữu Thỉnh' },
      { id: 'vtg-8', left: 'Làng', right: 'Kim Lân' },
      { id: 'vtg-9', left: 'Lặng lẽ Sa Pa', right: 'Nguyễn Thành Long' },
      { id: 'vtg-10', left: 'Chiếc lược ngà', right: 'Nguyễn Quang Sáng' }
    ]
  },
  'van-matching-nhanvat': {
    title: 'Tác phẩm ↔ Nhân vật & Chủ đề',
    subject: 'van',
    description: 'Ghép tác phẩm với nhân vật trung tâm hoặc nội dung cốt lõi',
    columnALabel: 'Tác phẩm văn học',
    columnBLabel: 'Nhân vật & Chủ đề cốt lõi',
    pairs: [
      { id: 'vnv-1', left: 'Làng (Kim Lân)', right: 'Ông Hai yêu làng chợ Dầu hòa trong tình yêu kháng chiến' },
      { id: 'vnv-2', left: 'Lặng lẽ Sa Pa (Nguyễn Thành Long)', right: 'Anh thanh niên 27 tuổi làm khí tượng trên đỉnh Yên Sơn' },
      { id: 'vnv-3', left: 'Chiếc lược ngà (Nguyễn Quang Sáng)', right: 'Tình cha con sâu nặng của bé Thu và ông Sáu' },
      { id: 'vnv-4', left: 'Chuyện người con gái Nam Xương (Nguyễn Dữ)', right: 'Vũ Nương – Người phụ nữ đức hạnh nhưng chịu oan khuất' },
      { id: 'vnv-5', left: 'Bếp lửa (Bằng Việt)', right: 'Tình bà cháu thiêng liêng và lòng biết ơn nguồn cội' },
      { id: 'vnv-6', left: 'Ánh trăng (Nguyễn Duy)', right: 'Lời nhắc nhở về đạo lý uống nước nhớ nguồn thủy chung' },
      { id: 'vnv-7', left: 'Mùa xuân nho nhỏ (Thanh Hải)', right: 'Ước nguyện cống hiến thầm lặng cho quê hương đất nước' },
      { id: 'vnv-8', left: 'Nói với con (Y Phương)', right: 'Tình cảm gia đình và niềm tự hào về truyền thống người đồng mình' }
    ]
  },
  'van-matching-bptt': {
    title: 'Biện pháp tu từ ↔ Bản chất & Đặc điểm',
    subject: 'van',
    description: 'Ghép biện pháp tu từ với dấu hiệu nhận biết chuẩn đề thi',
    columnALabel: 'Biện pháp tu từ',
    columnBLabel: 'Bản chất & Dấu hiệu nhận diện',
    pairs: [
      { id: 'vb-1', left: 'Ẩn dụ', right: 'Gọi tên sự vật này bằng sự vật khác dựa trên nét tương đồng' },
      { id: 'vb-2', left: 'Hoán dụ', right: 'Gọi tên sự vật này bằng sự vật khác dựa trên quan hệ tương cận' },
      { id: 'vb-3', left: 'Nhân hóa', right: 'Gán cho loài vật, đồ vật tình cảm và hành động của con người' },
      { id: 'vb-4', left: 'Điệp từ / Điệp ngữ', right: 'Lặp lại từ ngữ để nhấn mạnh ý và tạo nhạc điệu cảm xúc' },
      { id: 'vb-5', left: 'Nói giảm nói tránh', right: 'Diễn đạt tế nhị để tránh cảm giác ghê sợ, thô tục hay đau buồn' },
      { id: 'vb-6', left: 'Nói quá', right: 'Phóng đại quy mô, tính chất sự vật nhằm gây ấn tượng sâu sắc' },
      { id: 'vb-7', left: 'Liệt kê', right: 'Sắp xếp nối tiếp hàng loạt từ cùng loại để diễn tả đầy đủ' },
      { id: 'vb-8', left: 'Tương phản (Đối lập)', right: 'Đặt hai sự vật trái ngược cạnh nhau để làm nổi bật chủ đề' }
    ]
  }
};

// =========================================================================
// 3. DANH SÁCH TẤT CẢ MINIGAME ĐỂ HIỂN THỊ Ở TRANG CHỦ MINIGAME
// =========================================================================

export const ALL_MINIGAMES: MinigameDefinition[] = [
  // Flashcard
  {
    id: 'anh-flashcard-10',
    title: 'Flashcard Từ Vựng Trọng Tâm',
    subject: 'anh',
    gameType: 'flashcard',
    description: 'Lật thẻ ghi nhớ từ vựng, từ loại và ví dụ đề thi vào lớp 10',
    totalItems: ENGLISH_FLASHCARDS.length
  },
  // Ghép & nối Tiếng Anh
  {
    id: 'anh-matching-vocab',
    title: 'Ghép Từ vựng ↔ Nghĩa tiếng Việt',
    subject: 'anh',
    gameType: 'matching',
    description: 'Ghép nhanh từ vựng tiếng Anh với nghĩa tiếng Việt chuẩn xác',
    totalItems: MATCHING_GAMES_DATA['anh-matching-vocab'].pairs.length
  },
  {
    id: 'anh-matching-pos',
    title: 'Ghép Từ ↔ Loại từ (Word Form)',
    subject: 'anh',
    gameType: 'matching',
    description: 'Nhận diện nhanh Noun, Verb, Adjective hay Adverb',
    totalItems: MATCHING_GAMES_DATA['anh-matching-pos'].pairs.length
  },
  {
    id: 'anh-matching-grammar',
    title: 'Ghép Cấu trúc ↔ Ý nghĩa cách dùng',
    subject: 'anh',
    gameType: 'matching',
    description: 'Ghép các mẫu câu trọng tâm vào 10 (Used to, Suggest, If, Wish...)',
    totalItems: MATCHING_GAMES_DATA['anh-matching-grammar'].pairs.length
  },
  // Ghép & nối Toán
  {
    id: 'toan-matching-hangdangthuc',
    title: 'Ghép Hằng đẳng thức & Căn thức',
    subject: 'toan',
    gameType: 'matching',
    description: 'Ghép biểu thức với dạng khai triển và hằng đẳng thức đáng nhớ',
    totalItems: MATCHING_GAMES_DATA['toan-matching-hangdangthuc'].pairs.length
  },
  {
    id: 'toan-matching-viet-pt',
    title: 'Ghép Định lý Vi-ét & Phương trình',
    subject: 'toan',
    gameType: 'matching',
    description: 'Ghi nhớ công thức Vi-ét, biệt thức Delta và tính chất hàm số',
    totalItems: MATCHING_GAMES_DATA['toan-matching-viet-pt'].pairs.length
  },
  {
    id: 'toan-matching-hinhkhonggian',
    title: 'Ghép Hình không gian & Lượng giác',
    subject: 'toan',
    gameType: 'matching',
    description: 'Công thức thể tích trụ, nón, cầu và tỉ số lượng giác tam giác vuông',
    totalItems: MATCHING_GAMES_DATA['toan-matching-hinhkhonggian'].pairs.length
  },
  // Ghép & nối Ngữ văn
  {
    id: 'van-matching-tacgia',
    title: 'Ghép Tác phẩm ↔ Tác giả',
    subject: 'van',
    description: 'Ghép tác phẩm văn học lớp 9 trọng tâm với đúng tên tác giả',
    totalItems: MATCHING_GAMES_DATA['van-matching-tacgia'].pairs.length,
    gameType: 'matching'
  },
  {
    id: 'van-matching-nhanvat',
    title: 'Ghép Tác phẩm ↔ Nhân vật & Chủ đề',
    subject: 'van',
    description: 'Nhớ nhanh nhân vật trung tâm và thông điệp tư tưởng của tác phẩm',
    totalItems: MATCHING_GAMES_DATA['van-matching-nhanvat'].pairs.length,
    gameType: 'matching'
  },
  {
    id: 'van-matching-bptt',
    title: 'Ghép Biện pháp tu từ ↔ Đặc điểm',
    subject: 'van',
    description: 'Phân biệt ẩn dụ, hoán dụ, nhân hóa, điệp từ, nói giảm nói tránh',
    totalItems: MATCHING_GAMES_DATA['van-matching-bptt'].pairs.length,
    gameType: 'matching'
  }
];

// =========================================================================
// 4. DỮ LIỆU BẢNG XẾP HẠNG MẪU (PEER LEADERBOARD)
// =========================================================================

export interface LeaderboardItem {
  id: string;
  rank: number;
  playerName: string;
  subject: SubjectId;
  subjectLabel: string;
  gameTitle: string;
  score: number;
  isCurrentUser?: boolean;
}

export const INITIAL_PEER_LEADERBOARD: LeaderboardItem[] = [
  { id: 'lb-1', rank: 1, playerName: 'Lê Minh Khôi (9A2)', subject: 'anh', subjectLabel: 'Tiếng Anh', gameTitle: 'Flashcard Từ Vựng Trọng Tâm', score: 3850 },
  { id: 'lb-2', rank: 2, playerName: 'Trần Thảo Vy (9B)', subject: 'van', subjectLabel: 'Ngữ văn', gameTitle: 'Tác phẩm ↔ Tác giả', score: 3720 },
  { id: 'lb-3', rank: 3, playerName: 'Phạm Đức Anh (9C)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Hằng đẳng thức & Căn thức', score: 3600 },
  { id: 'lb-4', rank: 4, playerName: 'Đỗ Quỳnh Anh (9A1)', subject: 'anh', subjectLabel: 'Tiếng Anh', gameTitle: 'Từ ↔ Nghĩa tiếng Việt', score: 3540 },
  { id: 'lb-5', rank: 5, playerName: 'Vũ Gia Bảo (9A4)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Định lý Vi-ét & Phương trình', score: 3410 },
  { id: 'lb-6', rank: 6, playerName: 'Nguyễn Bích Ngọc (9E)', subject: 'van', subjectLabel: 'Ngữ văn', gameTitle: 'Tác phẩm ↔ Nhân vật & Chủ đề', score: 3380 },
  { id: 'lb-7', rank: 7, playerName: 'Hoàng Quốc Việt (9B3)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Hình không gian & Lượng giác', score: 3250 },
  { id: 'lb-8', rank: 8, playerName: 'Mai Phương Chi (9A1)', subject: 'van', subjectLabel: 'Ngữ văn', gameTitle: 'Biện pháp tu từ ↔ Đặc điểm', score: 3190 }
];
