import { Exam, TargetSchool } from '../types';

export const TARGET_SCHOOLS_HCM: TargetSchool[] = [
  { id: 'lhp', name: 'THPT Chuyên Lê Hồng Phong', district: 'Quận 5', cutoffScore2024: 25.5, cutoffScore2023: 25.0, tier: 'Chuyên' },
  { id: 'tdn', name: 'THPT Chuyên Trần Đại Nghĩa', district: 'Quận 1', cutoffScore2024: 25.0, cutoffScore2023: 24.75, tier: 'Chuyên' },
  { id: 'nth', name: 'THPT Nguyễn Thượng Hiền', district: 'Tân Bình', cutoffScore2024: 24.25, cutoffScore2023: 25.5, tier: 'Top 1' },
  { id: 'gd', name: 'THPT Gia Định', district: 'Bình Thạnh', cutoffScore2024: 23.75, cutoffScore2023: 24.5, tier: 'Top 1' },
  { id: 'ntmk', name: 'THPT Nguyễn Thị Minh Khai', district: 'Quận 3', cutoffScore2024: 23.5, cutoffScore2023: 24.25, tier: 'Top 1' },
  { id: 'btx', name: 'THPT Bùi Thị Xuân', district: 'Quận 1', cutoffScore2024: 22.75, cutoffScore2023: 23.5, tier: 'Top 1' },
  { id: 'pt', name: 'THPT Phú Nhuận', district: 'Phú Nhuận', cutoffScore2024: 22.25, cutoffScore2023: 23.0, tier: 'Top 2' },
  { id: 'tp', name: 'THPT Trần Phú', district: 'Tân Phú', cutoffScore2024: 22.0, cutoffScore2023: 22.75, tier: 'Top 2' },
  { id: 'tt', name: 'THPT Tây Thạnh', district: 'Tân Phú', cutoffScore2024: 21.0, cutoffScore2023: 21.5, tier: 'Top 2' },
  { id: 'hvt', name: 'THPT Hùng Vương', district: 'Quận 5', cutoffScore2024: 20.0, cutoffScore2023: 20.5, tier: 'Top 3' },
  { id: 'mdc', name: 'THPT Mạc Đĩnh Chi', district: 'Quận 6', cutoffScore2024: 22.5, cutoffScore2023: 23.25, tier: 'Top 1' },
  { id: 'nkh', name: 'THPT Nguyễn Khuyến', district: 'Quận 10', cutoffScore2024: 21.25, cutoffScore2023: 21.75, tier: 'Top 2' }
];

export const EXAMS_DATA: Exam[] = [
  {
    id: 'exam-toan-hcm-2024',
    title: 'Đề thi tuyển sinh Lớp 10 Môn Toán TP.HCM - Năm 2024',
    subjectId: 'toan',
    year: 2024,
    province: 'TP.HCM',
    schoolOrDept: 'Sở GD&ĐT TP.HCM',
    examType: 'tuyen-sinh-10',
    examTypeLabel: 'Đề tuyển sinh lớp 10',
    difficulty: 'trung-binh',
    durationMinutes: 120,
    questionsCount: 8,
    tags: ['Chính thức', 'TP.HCM', 'Toán thực tế', 'Chuẩn cấu trúc Sở'],
    takesCount: 14280,
    hcmSpecific: true,
    questions: [
      {
        id: 'toan-2024-q1',
        number: 1,
        text: 'Cho parabol (P): y = -1/2 x² và đường thẳng (d): y = x - 4. Tọa độ các giao điểm của (P) và (d) là:',
        points: 1.5,
        options: [
          'A(2; -2) và B(-4; -8)',
          'A(-2; -2) và B(4; -8)',
          'A(1; -1/2) và B(4; 0)',
          'A(2; 2) và B(4; 8)'
        ],
        correctAnswer: 'A(2; -2) và B(-4; -8)',
        explanation: 'Phương trình hoành độ giao điểm: -1/2 x² = x - 4 ⇔ x² + 2x - 8 = 0. Nghiệm x₁ = 2 ⇒ y₁ = 2 - 4 = -2 (Điểm A(2; -2)); x₂ = -4 ⇒ y₂ = -4 - 4 = -8 (Điểm B(-4; -8)).',
        topicId: 'toan-ham-so-bac-hai',
        topicName: 'Hàm số y = ax²'
      },
      {
        id: 'toan-2024-q2',
        number: 2,
        text: 'Cho phương trình 2x² - 3x - 1 = 0 có 2 nghiệm x₁, x₂. Không giải phương trình, hãy tính giá trị biểu thức T = x₁/x₂ + x₂/x₁.',
        points: 1.0,
        options: [
          '-13/2',
          '13/2',
          '7/2',
          '-7/2'
        ],
        correctAnswer: '-13/2',
        explanation: 'Theo Vi-ét: S = x₁ + x₂ = 3/2, P = x₁.x₂ = -1/2. Biểu thức T = (x₁² + x₂²)/(x₁x₂) = (S² - 2P)/P = [(3/2)² - 2(-1/2)] / (-1/2) = (9/4 + 1)/(-1/2) = (13/4)/(-1/2) = -13/2.',
        topicId: 'toan-pt-bac-hai-viet',
        topicName: 'Phương trình bậc hai & Định lý Vi-ét'
      },
      {
        id: 'toan-2024-q3',
        number: 3,
        text: 'Theo quy định, một máy bay cất cánh từ sân bay Tân Sơn Nhất với góc nâng trung bình là 18°. Khi máy bay đạt độ cao 3.000m so với mặt đất thì máy bay đã bay được quãng đường bao nhiêu mét trên không? (Làm tròn đến hàng đơn vị, sin 18° ≈ 0.3090).',
        points: 0.75,
        options: [
          '9.709 m',
          '9.233 m',
          '10.200 m',
          '8.500 m'
        ],
        correctAnswer: '9.709 m',
        explanation: 'Tam giác vuông tạo bởi mặt đất, độ cao và đường bay: sin(18°) = Đối / Huyền = 3000 / Quãng_đường ⇒ Quãng đường = 3000 / sin(18°) ≈ 3000 / 0.3090 ≈ 9.708,7m ≈ 9.709 m.',
        topicId: 'toan-ti-so-luong-giac',
        topicName: 'Tỉ số lượng giác & Bài toán thực tế'
      },
      {
        id: 'toan-2024-q4',
        number: 4,
        text: 'Nhiệt độ sôi của nước T (°C) phụ thuộc vào độ cao h (mét) so với mực nước biển bởi công thức bậc nhất T = a.h + b. Ở mực nước biển (h = 0), nước sôi ở 100°C. Tại đỉnh Phan Xi Păng (h = 3143m), nước sôi ở khoảng 89.5°C. Nhiệt độ sôi của nước tại Đà Lạt (h = 1500m) là bao nhiêu?',
        points: 0.75,
        options: [
          '95.0°C',
          '94.2°C',
          '96.5°C',
          '93.0°C'
        ],
        correctAnswer: '95.0°C',
        explanation: 'Tại h = 0: b = 100. Tại h = 3143: 89.5 = a(3143) + 100 ⇒ a = (89.5 - 100)/3143 = -10.5/3143 ≈ -0.00334. Tại h = 1500: T = -0.00334 × 1500 + 100 = -5.01 + 100 = 94.99 ≈ 95.0°C.',
        topicId: 'toan-ham-so-bac-nhat',
        topicName: 'Hàm số y = ax + b'
      },
      {
        id: 'toan-2024-q5',
        number: 5,
        text: 'Nhà sách Fahasa giảm giá 15% cho một cuốn từ điển. Bạn Bình có thẻ học sinh nên được giảm thêm 10% trên giá đã giảm. Bình chỉ phải trả 153.000 đồng. Hỏi giá niêm yết ban đầu của cuốn từ điển là bao nhiêu?',
        points: 1.0,
        options: [
          '200.000 đồng',
          '190.000 đồng',
          '180.000 đồng',
          '220.000 đồng'
        ],
        correctAnswer: '200.000 đồng',
        explanation: 'Gọi giá ban đầu là P. Giá sau lần 1: P × 0.85. Giá sau lần 2: P × 0.85 × 0.90 = 153.000 ⇒ P × 0.765 = 153.000 ⇒ P = 153.000 / 0.765 = 200.000 đồng.',
        topicId: 'toan-toan-thuc-te-hcm',
        topicName: 'Bài toán thực tế (Đặc trưng TP.HCM)'
      },
      {
        id: 'toan-2024-q6',
        number: 6,
        text: 'Một ly nước hình trụ có bán kính đáy 4cm, chiều cao 12cm đang chứa lượng nước cao 8cm. Người ta thả 3 viên bi sắt hình cầu có bán kính 2cm vào ly (chìm hoàn toàn). Hỏi mực nước trong ly dâng lên thêm bao nhiêu cm? (Lấy π ≈ 3.14).',
        points: 1.0,
        options: [
          '2.0 cm',
          '1.5 cm',
          '2.5 cm',
          '1.0 cm'
        ],
        correctAnswer: '2.0 cm',
        explanation: 'Thể tích 1 viên bi: V₁ = 4/3 π r³ = 4/3 π (2)³ = 32/3 π cm³. Thể tích 3 viên bi: V = 3 × 32/3 π = 32π cm³. Mực nước dâng lên: h\' = V / (π R_ly²) = 32π / (π × 4²) = 32/16 = 2 cm.',
        topicId: 'toan-hinh-khong-gian',
        topicName: 'Hình học không gian'
      },
      {
        id: 'toan-2024-q7',
        number: 7,
        text: 'Một nhóm gồm 24 bạn học sinh góp tiền mua quà sinh nhật cho một bạn với dự định mỗi bạn đóng như nhau. Nhưng đến ngày mua có 4 bạn bận nên không tham gia, vì thế mỗi bạn còn lại phải đóng thêm 10.000 đồng. Tổng số tiền mua món quà là:',
        points: 1.0,
        options: [
          '1.200.000 đồng',
          '960.000 đồng',
          '1.440.000 đồng',
          '1.000.000 đồng'
        ],
        correctAnswer: '1.200.000 đồng',
        explanation: 'Gọi số tiền mỗi bạn dự định đóng là x (đồng, x > 0). Tổng tiền = 24x. Sau khi 4 bạn nghỉ, còn 20 bạn, mỗi bạn đóng (x + 10.000). Phương trình: 24x = 20(x + 10.000) ⇔ 4x = 200.000 ⇔ x = 50.000. Vậy tổng số tiền = 24 × 50.000 = 1.200.000 đồng.',
        topicId: 'toan-lap-phuong-trinh',
        topicName: 'Giải bài toán bằng cách lập phương trình'
      },
      {
        id: 'toan-2024-q8',
        number: 8,
        text: 'Cho tam giác ABC nhọn (AB < AC) nội tiếp đường tròn (O). Các đường cao AD, BE, CF cắt nhau tại H. Tứ giác nào sau đây CHẮC CHẮN NỘI TIẾP?',
        points: 3.0,
        options: [
          'Tứ giác BFEC và tứ giác DHEC',
          'Tứ giác ABDE',
          'Tứ giác OFEC',
          'Tứ giác AOBH'
        ],
        correctAnswer: 'Tứ giác BFEC và tứ giác DHEC',
        explanation: 'BFEC có ∠BFC = ∠BEC = 90° (hai đỉnh kề nhìn BC dưới góc 90° nên nội tiếp). DHEC có ∠HDC + ∠HEC = 90° + 90° = 180° (hai góc đối diện bù nhau nên nội tiếp).',
        topicId: 'toan-tu-giac-noi-tiep',
        topicName: 'Tứ giác nội tiếp'
      }
    ]
  },
  {
    id: 'exam-anh-hcm-2024',
    title: 'Đề thi tuyển sinh Lớp 10 Môn Tiếng Anh TP.HCM - Năm 2024',
    subjectId: 'anh',
    year: 2024,
    province: 'TP.HCM',
    schoolOrDept: 'Sở GD&ĐT TP.HCM',
    examType: 'tuyen-sinh-10',
    examTypeLabel: 'Đề tuyển sinh lớp 10',
    difficulty: 'trung-binh',
    durationMinutes: 90,
    questionsCount: 10,
    tags: ['Chính thức', 'TP.HCM', 'Word Form', 'Biển báo'],
    takesCount: 18950,
    hcmSpecific: true,
    questions: [
      {
        id: 'anh-2024-q1',
        number: 1,
        text: 'Choose the word whose underlined part is pronounced differently from the others: \nA. walk<u>ed</u>   B. laugh<u>ed</u>   C. wash<u>ed</u>   D. decid<u>ed</u>',
        points: 0.25,
        options: ['decided', 'walked', 'laughed', 'washed'],
        correctAnswer: 'decided',
        explanation: 'Đuôi -ed phát âm là /ɪd/ sau âm /t/ và /d/. Decided phát âm là /dɪˈsaɪdɪd/, các từ còn lại phát âm là /t/.',
        topicId: 'anh-phat-am',
        topicName: 'Phát âm'
      },
      {
        id: 'anh-2024-q2',
        number: 2,
        text: 'Choose the word that has a different stress pattern from the others: \nA. provide   B. reduce   C. cancel   D. deny',
        points: 0.25,
        options: ['cancel', 'provide', 'reduce', 'deny'],
        correctAnswer: 'cancel',
        explanation: '"Cancel" có trọng âm rơi vào âm tiết thứ 1 (/ˈkænsəl/), ba từ còn lại có trọng âm rơi vào âm tiết thứ 2 (pro\'vide, re\'duce, de\'ny).',
        topicId: 'anh-trong-am',
        topicName: 'Trọng âm'
      },
      {
        id: 'anh-2024-q3',
        number: 3,
        text: 'What does this road sign mean? (A blue circular sign showing a bicycle inside)',
        points: 0.5,
        options: [
          'Path for cyclists only',
          'Cycling is prohibited here',
          'Watch out for motorbikes',
          'Bicycles can be rented here'
        ],
        correctAnswer: 'Path for cyclists only',
        explanation: 'Biển tròn nền xanh là biển hiệu lệnh: Làn đường bắt buộc dành riêng cho người đi xe đạp (Path for cyclists only).',
        topicId: 'anh-sign-notice-hcm',
        topicName: 'Biển báo & Thông báo thực tế (Sign & Notice)'
      },
      {
        id: 'anh-2024-q4',
        number: 4,
        text: 'A notice on a metro train door says: "STAND CLEAR OF THE DOORS". What should passengers do?',
        points: 0.5,
        options: [
          'Stay away from the doors as they are opening or closing',
          'Lean against the doors during the trip',
          'Open the doors manually when the train stops',
          'Stand in front of the door to get off first'
        ],
        correctAnswer: 'Stay away from the doors as they are opening or closing',
        explanation: '"Stand clear of the doors" nghĩa là đứng tránh xa cửa tàu điện ngầm để đảm bảo an toàn khi cửa đóng mở tự động.',
        topicId: 'anh-sign-notice-hcm',
        topicName: 'Biển báo & Thông báo thực tế (Sign & Notice)'
      },
      {
        id: 'anh-2024-q5',
        number: 5,
        text: 'She hasn’t phoned me since she ________ to Singapore for her further education.',
        points: 0.5,
        options: ['moved', 'has moved', 'was moving', 'had moved'],
        correctAnswer: 'moved',
        explanation: 'Cấu trúc thì Hiện tại hoàn thành: S + have/has + V3/ed + SINCE + S + V(quá khứ đơn).',
        topicId: 'anh-cac-thi-tenses',
        topicName: 'Các thì trọng tâm'
      },
      {
        id: 'anh-2024-q6',
        number: 6,
        text: 'Word Form: Green spaces in modern cities can help ________ air quality and combat urban heat. (IMPROVEMENT)',
        points: 0.5,
        options: ['improve', 'improving', 'improved', 'improvable'],
        correctAnswer: 'improve',
        explanation: 'Cấu trúc "help (to) do something" (giúp làm điều gì đó). Sau help ta cần động từ nguyên mẫu: improve.',
        topicId: 'anh-word-form',
        topicName: 'Word Form'
      },
      {
        id: 'anh-2024-q7',
        number: 7,
        text: 'Word Form: The local residents showed great ________ when supporting families affected by the flood. (GENEROUS)',
        points: 0.5,
        options: ['generosity', 'generously', 'generousness', 'unreasonable'],
        correctAnswer: 'generosity',
        explanation: 'Sau tính từ "great" ta cần một danh từ (Noun) mang nghĩa "sự hào phóng, lòng hảo tâm": generosity.',
        topicId: 'anh-word-form',
        topicName: 'Word Form'
      },
      {
        id: 'anh-2024-q8',
        number: 8,
        text: 'If you want to save money on electricity bills, remember to turn ________ all lights before leaving the room.',
        points: 0.5,
        options: ['off', 'on', 'up', 'down'],
        correctAnswer: 'off',
        explanation: '"Turn off" = tắt thiết bị điện.',
        topicId: 'anh-phrasal-verbs',
        topicName: 'Phrasal Verbs'
      },
      {
        id: 'anh-2024-q9',
        number: 9,
        text: 'Sentence Transformation: "Why don\'t we organize a campaign to plant more trees around our school?" Peter suggested.\nWhich sentence has the closest meaning?',
        points: 0.75,
        options: [
          'Peter suggested organizing a campaign to plant more trees around their school.',
          'Peter suggested to organize a campaign to plant more trees around their school.',
          'Peter suggested that we plant trees without a campaign.',
          'Peter wanted to plant trees alone.'
        ],
        correctAnswer: 'Peter suggested organizing a campaign to plant more trees around their school.',
        explanation: 'Cấu trúc câu đề nghị: S + suggest + V-ing.',
        topicId: 'anh-cau-bi-dong-reported',
        topicName: 'Câu gián tiếp & Đề nghị'
      },
      {
        id: 'anh-2024-q10',
        number: 10,
        text: 'Sentence Transformation: "I haven\'t talked to my primary school teacher for three years."\nWhich sentence has the closest meaning?',
        points: 0.75,
        options: [
          'The last time I talked to my primary school teacher was three years ago.',
          'I last talked to my primary school teacher three years ago.',
          'It is three years since I talked to my primary school teacher.',
          'All A, B, C are correct.'
        ],
        correctAnswer: 'All A, B, C are correct.',
        explanation: 'Cả 3 cách biến đổi từ thì Hiện tại hoàn thành sang Quá khứ đơn đều hoàn toàn chính xác theo chuẩn ngữ pháp tuyển sinh 10.',
        topicId: 'anh-cac-thi-tenses',
        topicName: 'Các thì trọng tâm'
      }
    ]
  },
  {
    id: 'exam-van-hcm-2024',
    title: 'Đề thi tuyển sinh Lớp 10 Môn Ngữ Văn TP.HCM - Năm 2024',
    subjectId: 'van',
    year: 2024,
    province: 'TP.HCM',
    schoolOrDept: 'Sở GD&ĐT TP.HCM',
    examType: 'tuyen-sinh-10',
    examTypeLabel: 'Đề tuyển sinh lớp 10',
    difficulty: 'trung-binh',
    durationMinutes: 120,
    questionsCount: 6,
    tags: ['Chính thức', 'TP.HCM', 'Đọc hiểu nhân văn', 'Nghị luận xã hội'],
    takesCount: 16400,
    hcmSpecific: true,
    questions: [
      {
        id: 'van-2024-q1',
        number: 1,
        text: 'Đọc đoạn trích sau và xác định phương thức biểu đạt chính:\n"Biết ơn không chỉ là thái độ đón nhận những ân tình, mà còn là ý thức trách nhiệm gìn giữ và lan tỏa những giá trị tốt đẹp ấy đến với cuộc đời."',
        points: 0.5,
        options: ['Nghị luận', 'Tự sự', 'Miêu tả', 'Biểu cảm'],
        correctAnswer: 'Nghị luận',
        explanation: 'Đoạn trích bàn luận, khẳng định quan điểm về ý nghĩa và trách nhiệm của lòng biết ơn nên phương thức biểu đạt chính là Nghị luận.',
        topicId: 'van-doc-hieu-phuong-thuc',
        topicName: 'Phương thức biểu đạt & Thể loại'
      },
      {
        id: 'van-2024-q2',
        number: 2,
        text: 'Chỉ ra thành phần biệt lập trong câu: "Có lẽ, điều quan trọng nhất đối với một người trẻ là giữ vững niềm tin và lòng tử tế giữa muôn vàn thử thách."',
        points: 0.5,
        options: ['Có lẽ (Thành phần tình thái)', 'điều quan trọng nhất (Thành phần khởi ngữ)', 'giữa muôn vàn thử thách (Thành phần phụ chú)', 'người trẻ (Thành phần gọi đáp)'],
        correctAnswer: 'Có lẽ (Thành phần tình thái)',
        explanation: '"Có lẽ" là thành phần tình thái, dùng để thể hiện thái độ chưa chắc chắn nhưng tin tưởng của người nói đối với nhận định.',
        topicId: 'van-tieng-viet-thanh-phan',
        topicName: 'Thành phần biệt lập'
      },
      {
        id: 'van-2024-q3',
        number: 3,
        text: 'Từ "mặt trời" trong câu thơ sau của Viễn Phương được dùng theo biện pháp tu từ nào?\n"Ngày ngày mặt trời đi qua trên lăng\nThấy một mặt trời trong lăng rất đỏ"',
        points: 1.0,
        options: ['Ẩn dụ', 'Hoán dụ', 'So sánh', 'Nhân hóa'],
        correctAnswer: 'Ẩn dụ',
        explanation: 'Mặt trời thứ hai là hình ảnh ẩn dụ ca ngợi Bác Hồ - nguồn sáng chân lý, độc lập, ấm áp soi đường cho non sông Việt Nam.',
        topicId: 'van-bien-phap-tu-tu',
        topicName: 'Biện pháp tu từ & Tác dụng'
      },
      {
        id: 'van-2024-q4',
        number: 4,
        text: 'Về mặt cấu trúc, yêu cầu bắt buộc của đoạn văn Nghị luận xã hội 200 chữ trong đề thi tuyển sinh 10 TP.HCM là gì?',
        points: 1.0,
        options: [
          'Đoạn văn hoàn chỉnh, viết liền mạch không xuống dòng tùy tiện, đảm bảo dung lượng khoảng 200 chữ',
          'Bắt buộc phải chia thành 3 đoạn nhỏ có tiêu đề',
          'Chỉ được viết đúng 10 câu',
          'Không được trích dẫn dẫn chứng thực tế'
        ],
        correctAnswer: 'Đoạn văn hoàn chỉnh, viết liền mạch không xuống dòng tùy tiện, đảm bảo dung lượng khoảng 200 chữ',
        explanation: 'Quy chuẩn chấm thi của Sở GD&ĐT TP.HCM yêu cầu đoạn văn viết liền mạch, lùi đầu dòng, không xuống dòng giữa chừng và có dung lượng hợp lý (khoảng 2/3 đến 1 trang giấy thi).',
        topicId: 'van-nghi-luan-xa-hoi',
        topicName: 'Nghị luận xã hội'
      },
      {
        id: 'van-2024-q5',
        number: 5,
        text: 'Trong tác phẩm "Lặng lẽ Sa Pa" của Nguyễn Thành Long, chi tiết nào sau đây thể hiện rõ nét đức tính khiêm tốn của nhân vật anh thanh niên?',
        points: 1.0,
        options: [
          'Khi ông họa sĩ muốn vẽ chân dung, anh từ chối và nhiệt tình giới thiệu ông kĩ sư vườn rau, đồng chí cán bộ nghiên cứu bản đồ sét',
          'Anh sống một mình trên đỉnh Yên Sơn cao 2600m',
          'Anh trồng hoa và nuôi gà để cải thiện bữa ăn',
          'Anh tặng củ tam thất cho vợ bác lái xe'
        ],
        correctAnswer: 'Khi ông họa sĩ muốn vẽ chân dung, anh từ chối và nhiệt tình giới thiệu ông kĩ sư vườn rau, đồng chí cán bộ nghiên cứu bản đồ sét',
        explanation: 'Anh thanh niên cảm thấy đóng góp của mình còn nhỏ bé so với bao con người khác đang thầm lặng cống hiến ở Sa Pa nên từ chối để giới thiệu người khác.',
        topicId: 'van-tac-pham-trong-tam',
        topicName: 'Tác giả – Tác phẩm trọng tâm lớp 9'
      },
      {
        id: 'van-2024-q6',
        number: 6,
        text: 'Hình tượng "bếp lửa" trong bài thơ cùng tên của Bằng Việt mang ý nghĩa biểu tượng sâu sắc nào?',
        points: 1.0,
        options: [
          'Tượng trưng cho tình bà cháu thiêng liêng, nguồn sống bền bỉ và tình yêu quê hương đất nước',
          'Chỉ đơn thuần là ngọn lửa nấu cơm thời kháng chiến',
          'Biểu tượng cho mùa đông giá lạnh ở vùng quê miền Bắc',
          'Tượng trưng cho khói bom chiến tranh'
        ],
        correctAnswer: 'Tượng trưng cho tình bà cháu thiêng liêng, nguồn sống bền bỉ và tình yêu quê hương đất nước',
        explanation: 'Bếp lửa là biểu tượng đa nghĩa: vừa là hình ảnh thực gắn liền với bàn tay tảo tần của người bà, vừa là biểu tượng cho tình cảm gia đình, cội nguồn và sức sống bền bỉ của dân tộc.',
        topicId: 'van-tac-pham-trong-tam',
        topicName: 'Tác giả – Tác phẩm trọng tâm lớp 9'
      }
    ]
  },
  {
    id: 'exam-thi-thu-lhp-2025',
    title: 'Đề thi thử Lớp 10 Môn Toán - THPT Chuyên Lê Hồng Phong 2025',
    subjectId: 'toan',
    year: 2025,
    province: 'TP.HCM',
    schoolOrDept: 'THPT Chuyên Lê Hồng Phong',
    examType: 'thi-thu',
    examTypeLabel: 'Đề thi thử',
    difficulty: 'kho',
    durationMinutes: 120,
    questionsCount: 6,
    tags: ['Chuyên Lê Hồng Phong', 'Phân loại cao', 'Toán 10', '2025'],
    takesCount: 9800,
    hcmSpecific: true,
    questions: [
      {
        id: 'lhp-2025-q1',
        number: 1,
        text: 'Cho phương trình x² - 2(m + 1)x + m² + 2m = 0. Tìm tất cả giá trị của m để phương trình có 2 nghiệm phân biệt x₁, x₂ thỏa mãn x₁² + x₂² = 10.',
        points: 1.5,
        options: ['m = 1 hoặc m = -3', 'm = 2 hoặc m = -2', 'm = 3', 'Không có giá trị m thỏa mãn'],
        correctAnswer: 'm = 1 hoặc m = -3',
        explanation: 'Δ\' = (m + 1)² - (m² + 2m) = m² + 2m + 1 - m² - 2m = 1 > 0 với mọi m. S = 2(m + 1), P = m² + 2m. Ta có x₁² + x₂² = S² - 2P = 4(m + 1)² - 2(m² + 2m) = 4(m² + 2m + 1) - 2m² - 4m = 2m² + 4m + 4. Cho 2m² + 4m + 4 = 10 ⇔ 2m² + 4m - 6 = 0 ⇔ m² + 2m - 3 = 0 ⇒ m = 1 hoặc m = -3.',
        topicId: 'toan-pt-bac-hai-viet',
        topicName: 'Phương trình bậc hai & Định lý Vi-ét'
      },
      {
        id: 'lhp-2025-q2',
        number: 2,
        text: 'Một công ty sản xuất bao bì giấy hình trụ có thể tích 1.000 cm³. Để tiết kiệm chi phí, diện tích toàn phần của hình trụ phải nhỏ nhất. Bán kính đáy r xấp xỉ bằng:',
        points: 1.5,
        options: ['5.42 cm', '4.20 cm', '6.85 cm', '7.12 cm'],
        correctAnswer: '5.42 cm',
        explanation: 'V = π r² h = 1000 ⇒ h = 1000 / (π r²). S_tp = 2π r h + 2π r² = 2000/r + 2π r² = 1000/r + 1000/r + 2π r². Áp dụng BĐT Cô-si cho 3 số dương: S_tp ≥ 3 ∛(1000 . 1000 . 2π) = min khi 1000/r = 2π r² ⇔ r³ = 500 / π ≈ 159.15 ⇒ r ≈ 5.42 cm.',
        topicId: 'toan-hinh-khong-gian',
        topicName: 'Hình học không gian & Cực trị'
      },
      {
        id: 'lhp-2025-q3',
        number: 3,
        text: 'Giá trị nhỏ nhất của biểu thức A = x - 2√x + 5 với x ≥ 0 là:',
        points: 1.0,
        options: ['4', '5', '3', '0'],
        correctAnswer: '4',
        explanation: 'A = (√x - 1)² + 4. Vì (√x - 1)² ≥ 0 nên A ≥ 4. Đẳng thức xảy ra khi √x = 1 ⇔ x = 1.',
        topicId: 'toan-bien-doi-bieu-thuc',
        topicName: 'Biến đổi biểu thức'
      }
    ]
  },
  {
    id: 'exam-chuyen-de-toan-thuc-te',
    title: 'Bộ đề chuyên đề: Các bài toán thực tế TP.HCM hay gặp nhất',
    subjectId: 'toan',
    year: 2025,
    province: 'TP.HCM',
    schoolOrDept: 'Chuyên đề Trọng điểm TP.HCM',
    examType: 'chuyen-de',
    examTypeLabel: 'Đề theo từng chuyên đề',
    difficulty: 'trung-binh',
    durationMinutes: 60,
    questionsCount: 5,
    tags: ['Toán thực tế', 'TP.HCM', 'Lãi suất', 'Hóa đơn tiền điện', 'Khuyến mãi'],
    takesCount: 22100,
    hcmSpecific: true,
    questions: [
      {
        id: 'cdtt-q1',
        number: 1,
        text: 'Bác Ba gửi tiết kiệm ngân hàng 200 triệu đồng với kỳ hạn 1 năm, lãi suất 6%/năm. Hết năm thứ nhất bác không rút tiền ra mà để tiền lãi nhập vào vốn ban đầu để tính lãi cho năm tiếp theo. Hỏi sau 2 năm bác Ba nhận được cả gốc và lãi là bao nhiêu?',
        points: 2.0,
        options: [
          '224.720.000 đồng',
          '224.000.000 đồng',
          '212.000.000 đồng',
          '220.000.000 đồng'
        ],
        correctAnswer: '224.720.000 đồng',
        explanation: 'Năm 1: 200 × 1.06 = 212 triệu đồng. Năm 2: 212 × 1.06 = 224.72 triệu đồng = 224.720.000 đồng (Lãi kép).',
        topicId: 'toan-toan-thuc-te-hcm',
        topicName: 'Bài toán thực tế'
      },
      {
        id: 'cdtt-q2',
        number: 2,
        text: 'Giá bán một chiếc tivi là 12.000.000 đồng. Siêu thị điện máy áp dụng chương trình khuyến mãi giảm 10%. Nếu thanh toán qua thẻ ngân hàng VCB được giảm thêm 5% trên số tiền sau khi đã giảm. Khách hàng thanh toán qua thẻ VCB phải trả số tiền là:',
        points: 2.0,
        options: [
          '10.260.000 đồng',
          '10.200.000 đồng',
          '10.500.000 đồng',
          '10.800.000 đồng'
        ],
        correctAnswer: '10.260.000 đồng',
        explanation: 'Số tiền sau giảm đợt 1: 12.000.000 × 0.90 = 10.800.000đ. Số tiền sau giảm đợt 2: 10.800.000 × 0.95 = 10.260.000đ.',
        topicId: 'toan-toan-thuc-te-hcm',
        topicName: 'Bài toán thực tế'
      },
      {
        id: 'cdtt-q3',
        number: 3,
        text: 'Một chiếc lều cắm trại hình nón có đường kính đáy d = 3m (bán kính r = 1.5m) và chiều cao h = 2m. Người ta cần may bạt xung quanh lều (không may đáy). Diện tích bạt tối thiểu cần dùng là (lấy π ≈ 3.14):',
        points: 2.0,
        options: [
          '11.78 m²',
          '14.13 m²',
          '9.42 m²',
          '18.84 m²'
        ],
        correctAnswer: '11.78 m²',
        explanation: 'Độ dài đường sinh của hình nón: l = √(r² + h²) = √(1.5² + 2²) = √(2.25 + 4) = √6.25 = 2.5m. Diện tích xung quanh: S_xq = π . r . l = 3.14 × 1.5 × 2.5 = 11.775 m² ≈ 11.78 m².',
        topicId: 'toan-hinh-khong-gian',
        topicName: 'Hình học không gian'
      }
    ]
  },
  {
    id: 'exam-thi-thu-gia-dinh-2025',
    title: 'Đề thi thử Lớp 10 Môn Tiếng Anh - THPT Gia Định 2025',
    subjectId: 'anh',
    year: 2025,
    province: 'TP.HCM',
    schoolOrDept: 'THPT Gia Định',
    examType: 'thi-thu',
    examTypeLabel: 'Đề thi thử',
    difficulty: 'trung-binh',
    durationMinutes: 90,
    questionsCount: 6,
    tags: ['Gia Định', 'TP.HCM', 'Reading', 'Word Form'],
    takesCount: 11400,
    hcmSpecific: true,
    questions: [
      {
        id: 'gd-2025-q1',
        number: 1,
        text: 'She advised me ________ too much time playing video games before the entrance exam.',
        points: 0.5,
        options: ['not to spend', 'to not spend', 'don\'t spend', 'not spending'],
        correctAnswer: 'not to spend',
        explanation: 'Cấu trúc: advise someone (not) to do something.',
        topicId: 'anh-cau-bi-dong-reported',
        topicName: 'Câu gián tiếp & Đề nghị'
      },
      {
        id: 'gd-2025-q2',
        number: 2,
        text: 'Word Form: Many teenagers today feel a sense of ________ when faced with high expectations from family and society. (ANXIOUS)',
        points: 0.5,
        options: ['anxiety', 'anxiously', 'anxiousness', 'unrelaxed'],
        correctAnswer: 'anxiety',
        explanation: 'Cụm từ "a sense of anxiety" (cảm giác lo âu). Sau "a sense of" cần một Danh từ.',
        topicId: 'anh-word-form',
        topicName: 'Word Form'
      },
      {
        id: 'gd-2025-q3',
        number: 3,
        text: 'The book ________ you lent me last Monday is truly fascinating.',
        points: 0.5,
        options: ['which', 'who', 'whom', 'whose'],
        correctAnswer: 'which',
        explanation: 'Đại từ quan hệ thay thế cho danh từ chỉ vật "The book" làm tân ngữ là "which" (hoặc that).',
        topicId: 'anh-menh-de-quan-he',
        topicName: 'Mệnh đề quan hệ'
      }
    ]
  }
];

export const ALL_EXAMS = EXAMS_DATA;
export const HCM_SCHOOLS = TARGET_SCHOOLS_HCM;
