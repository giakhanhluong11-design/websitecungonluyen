import { Topic } from '../types';

export const TOPICS_DATA: Topic[] = [
  // ========================== TOÁN HỌC ==========================
  {
    id: 'toan-can-bac-hai',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Căn bậc hai và căn thức',
    description: 'Điều kiện xác định của căn thức, hằng đẳng thức √(A²) = |A|, trục căn thức ở mẫu.',
    weightInExam: 'Thường xuất hiện ở Câu 1 (Rút gọn biểu thức) - 0.75 đến 1.0 điểm',
    theorySummary: '• Căn bậc hai số học của số thực a không âm là số x ≥ 0 sao cho x² = a (ký hiệu √a).\n• Căn thức bậc hai √(A) có nghĩa (xác định) khi và chỉ khi biểu thức dưới căn A ≥ 0.\n• Hằng đẳng thức căn bản: √(A²) = |A| = A (nếu A ≥ 0) hoặc -A (nếu A < 0).\n• Quy tắc nhân và chia: √(A.B) = √A.√B (với A, B ≥ 0) và √(A/B) = √A / √B (với A ≥ 0, B > 0).\n• Trục căn thức ở mẫu: Nhân cả tử và mẫu với lượng liên hợp thích hợp.',
    keyFormulas: [
      '√(A²) = |A|',
      '√(A) xác định ⇔ A ≥ 0',
      'm/(√A ± √B) = m(√A ∓ √B) / (A - B)',
      '√(A²B) = |A|√B (với B ≥ 0)'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính giá trị biểu thức chứa căn',
        problem: 'Rút gọn biểu thức A = √(9 - 4√5) + √5',
        solution: 'Ta có 9 - 4√5 = (√5)² - 2.(2).(√5) + 2² = (√5 - 2)². \nDo đó √(9 - 4√5) = √((√5 - 2)²) = |√5 - 2|. \nVì √5 > √4 = 2 nên |√5 - 2| = √5 - 2.\nSuy ra: A = (√5 - 2) + √5 = 2√5 - 2.',
        tip: 'Phân tích số dưới căn thành dạng a² - 2ab + b² để đưa về bình phương một hiệu.'
      }
    ],
    exercises: [
      {
        id: 'cbh-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Điều kiện xác định của biểu thức √(3x - 6) là:',
        options: ['x ≥ 2', 'x ≤ 2', 'x > 2', 'x ≥ -2'],
        correctAnswer: 'x ≥ 2',
        explanation: 'Biểu thức xác định khi 3x - 6 ≥ 0 ⇔ 3x ≥ 6 ⇔ x ≥ 2.'
      },
      {
        id: 'cbh-2',
        level: 'trung-binh',
        levelLabel: 'Vận dụng',
        question: 'Giá trị của biểu thức P = √((2 - √5)²) - √5 là:',
        options: ['2', '-2', '2√5', '2 - 2√5'],
        correctAnswer: '-2',
        explanation: '√((2 - √5)²) = |2 - √5|. Vì 2 = √4 < √5 nên |2 - √5| = √5 - 2. Vậy P = (√5 - 2) - √5 = -2.'
      },
      {
        id: 'cbh-3',
        level: 'kho',
        levelLabel: 'Nâng cao',
        question: 'Rút gọn biểu thức M = 1/(√3 + √2) + 1/(√4 + √3) + ... + 1/(√100 + √99):',
        options: ['8', '9 - √2', '10 - √2', '√100 - √3'],
        correctAnswer: '9 - √2',
        explanation: 'Nhân lượng liên hợp: 1/(√(k+1) + √k) = √(k+1) - √k. Tổng triệt tiêu liên tiếp = √100 - √2 = 10 - √2 (Lưu ý bắt đầu từ √2, √100 - √2 là 10 - √2).'
      }
    ],
    isTrending: true
  },
  {
    id: 'toan-bien-doi-bieu-thuc',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Biến đổi biểu thức',
    description: 'Quy đồng mẫu số, phân tích nhân tử, rút gọn phân thức chứa căn và tìm giá trị của x để biểu thức thỏa mãn điều kiện.',
    weightInExam: 'Chiếm 1.0 - 1.5 điểm trong đề thi vào lớp 10',
    theorySummary: '• Luôn tìm điều kiện xác định (ĐKXĐ) trước khi rút gọn.\n• Phân tích tử và mẫu thành nhân tử để tìm mẫu thức chung nhỏ nhất.\n• Quy đồng mẫu số và rút gọn các phân thức đồng dạng.\n• Sau khi rút gọn, kiểm tra lại với ĐKXĐ khi giải phương trình hoặc bất phương trình phụ.',
    keyFormulas: [
      'A/B ± C/D = (A.D ± B.C)/(B.D)',
      'a - b = (√a - √b)(√a + √b) với a, b ≥ 0',
      'a√a ± b√b = (√a ± √b)(a ∓ √ab + b)'
    ],
    examples: [
      {
        title: 'Ví dụ: Rút gọn biểu thức chứa căn',
        problem: 'Rút gọn P = (√x / (√x + 2) + 2 / (√x - 2)) : ((x + 4) / (x - 4)) với x ≥ 0, x ≠ 4.',
        solution: 'MTC trong ngoặc là x - 4 = (√x + 2)(√x - 2).\nTử số: √x(√x - 2) + 2(√x + 2) = x - 2√x + 2√x + 4 = x + 4.\nVậy biểu thức trong ngoặc = (x + 4)/(x - 4).\nDo đó P = ((x + 4)/(x - 4)) : ((x + 4)/(x - 4)) = 1.',
        tip: 'Chú ý đặt nhân tử chung và khai triển cẩn thận tránh nhầm dấu.'
      }
    ],
    exercises: [
      {
        id: 'bdbt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Rút gọn biểu thức (x - 4)/(√x - 2) với x ≥ 0, x ≠ 4 bằng:',
        options: ['√x - 2', '√x + 2', 'x + 2', 'x - 2'],
        correctAnswer: '√x + 2',
        explanation: 'Ta có x - 4 = (√x - 2)(√x + 2). Triệt tiêu (√x - 2) còn √x + 2.'
      }
    ]
  },
  {
    id: 'toan-ham-so-bac-nhat',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Hàm số y = ax + b',
    description: 'Tính chất đồng biến, nghịch biến, đồ thị đường thẳng, vị trí tương đối giữa hai đường thẳng (song song, cắt nhau, trùng nhau, vuông góc).',
    weightInExam: 'Chiếm 1.0 điểm (Bài 1 hoặc 2 trong đề thi TP.HCM)',
    theorySummary: '• Hàm số y = ax + b (a ≠ 0) đồng biến trên R khi a > 0; nghịch biến trên R khi a < 0.\n• Đồ thị là đường thẳng cắt trục Oy tại điểm (0; b) và trục Ox tại (-b/a; 0).\n• Vị trí tương đối của (d): y = ax + b và (d\'): y = a\'x + b\':\n  - (d) // (d\') ⇔ a = a\' và b ≠ b\'\n  - (d) cắt (d\') ⇔ a ≠ a\'\n  - (d) ≡ (d\') ⇔ a = a\' và b = b\'\n  - (d) ⊥ (d\') ⇔ a . a\' = -1',
    keyFormulas: [
      'a > 0: Hàm số đồng biến; a < 0: Hàm số nghịch biến',
      '(d) // (d\') ⇔ a = a\' và b ≠ b\'',
      '(d) ⊥ (d\') ⇔ a . a\' = -1'
    ],
    examples: [
      {
        title: 'Ví dụ: Tìm tham số m để hai đường thẳng song song',
        problem: 'Tìm m để đường thẳng (d): y = (2m - 1)x + 3 song song với đường thẳng (d\'): y = 3x - 1.',
        solution: 'Để (d) // (d\') thì:\n2m - 1 = 3 và 3 ≠ -1 (luôn đúng).\n⇔ 2m = 4 ⇔ m = 2.\nVậy m = 2 thỏa mãn yêu cầu.',
        tip: 'Nhớ kiểm tra điều kiện tung độ gốc b ≠ b\' để tránh trường hợp hai đường thẳng trùng nhau.'
      }
    ],
    exercises: [
      {
        id: 'hsbn-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Đường thẳng y = -2x + 5 cắt trục tung Oy tại điểm có tọa độ là:',
        options: ['(0; 5)', '(5; 0)', '(0; -2)', '(2.5; 0)'],
        correctAnswer: '(0; 5)',
        explanation: 'Điểm cắt trục tung có hoành độ x = 0, suy ra y = -2(0) + 5 = 5. Tọa độ là (0; 5).'
      }
    ]
  },
  {
    id: 'toan-ham-so-bac-hai',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Hàm số y = ax²',
    description: 'Tính chất và đồ thị Parabol (P): y = ax² (a ≠ 0), tương giao giữa Parabol và đường thẳng (d): y = mx + n.',
    weightInExam: 'Trọng tâm Câu 1 đề thi TP.HCM (Vẽ đồ thị (P) và (d), tìm tọa độ giao điểm) - 1.5 điểm',
    theorySummary: '• Hàm số y = ax² (a ≠ 0) có đỉnh là gốc tọa độ O(0; 0), nhận Oy làm trục đối xứng.\n  - Nếu a > 0: đồ thị nằm phía trên Ox, O là điểm thấp nhất, hàm số nghịch biến khi x < 0 và đồng biến khi x > 0.\n  - Nếu a < 0: đồ thị nằm phía dưới Ox, O là điểm cao nhất, hàm số đồng biến khi x < 0 và nghịch biến khi x > 0.\n• Tương giao (P) và (d):\n  Phương trình hoành độ giao điểm: ax² = mx + n ⇔ ax² - mx - n = 0.\n  - Δ > 0: (d) cắt (P) tại 2 điểm phân biệt.\n  - Δ = 0: (d) tiếp xúc với (P).\n  - Δ < 0: (d) không cắt (P).',
    keyFormulas: [
      'Đỉnh Parabol: O(0; 0), trục đối xứng Oy (x = 0)',
      'Phương trình hoành độ giao điểm: ax² - mx - n = 0',
      'Tọa độ giao điểm tìm bằng cách thay nghiệm x vào công thức (d) hoặc (P)'
    ],
    examples: [
      {
        title: 'Ví dụ: Đề thi TP.HCM - Tìm tọa độ giao điểm',
        problem: 'Cho (P): y = 1/2 x² và (d): y = x + 4. Tìm tọa độ giao điểm của (P) và (d) bằng phép tính.',
        solution: 'Phương trình hoành độ giao điểm của (P) và (d):\n1/2 x² = x + 4 ⇔ x² - 2x - 8 = 0.\nΔ\' = (-1)² - 1.(-8) = 1 + 8 = 9 > 0, √Δ\' = 3.\nNghiệm: x₁ = 1 + 3 = 4; x₂ = 1 - 3 = -2.\n• Với x = 4 ⇒ y = 4 + 4 = 8 ⇒ Giao điểm A(4; 8).\n• Với x = -2 ⇒ y = -2 + 4 = 2 ⇒ Giao điểm B(-2; 2).\nVậy tọa độ hai giao điểm là (4; 8) và (-2; 2).',
        tip: 'Luôn lập bảng giá trị ít nhất 5 điểm cho Parabol: {-2, -1, 0, 1, 2} để vẽ chính xác.'
      }
    ],
    exercises: [
      {
        id: 'hsbh-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Cho Parabol (P): y = 2x². Điểm nào sau đây thuộc (P)?',
        options: ['A(1; 2)', 'B(2; 4)', 'C(-1; -2)', 'D(0; 2)'],
        correctAnswer: 'A(1; 2)',
        explanation: 'Thay x = 1 vào (P): y = 2(1)² = 2. Vậy A(1; 2) thuộc đồ thị.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'toan-pt-bac-hai-viet',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Phương trình bậc hai & Định lý Vi-ét',
    description: 'Công thức nghiệm, hệ thức Vi-ét và các ứng dụng: tính giá trị biểu thức đối xứng, tìm hai số biết tổng và tích, biện luận dấu nghiệm.',
    weightInExam: 'Trọng tâm Câu 2 đề thi TP.HCM - 1.0 điểm',
    theorySummary: '• Phương trình ax² + bx + c = 0 (a ≠ 0), biệt thức Δ = b² - 4ac (hoặc Δ\' = b\'² - ac với b = 2b\').\n  - Δ > 0: có 2 nghiệm phân biệt x₁,₂ = (-b ± √Δ)/(2a).\n  - Δ = 0: có nghiệm kép x₁ = x₂ = -b/(2a).\n  - Δ < 0: phương trình vô nghiệm.\n• Hệ thức Vi-ét: S = x₁ + x₂ = -b/a, P = x₁.x₂ = c/a.\n• Các biểu thức đối xứng quen thuộc:\n  - x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂ = S² - 2P\n  - x₁³ + x₂³ = (x₁ + x₂)³ - 3x₁x₂(x₁ + x₂) = S³ - 3SP\n  - 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = S/P\n  - |x₁ - x₂| = √( (x₁ + x₂)² - 4x₁x₂ ) = √(S² - 4P)',
    keyFormulas: [
      'Δ = b² - 4ac, Δ\' = b\'² - ac',
      'x₁ + x₂ = -b/a, x₁.x₂ = c/a',
      'x₁² + x₂² = S² - 2P',
      '1/x₁ + 1/x₂ = S/P'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính giá trị biểu thức Vi-ét không giải phương trình',
        problem: 'Cho phương trình x² - 5x + 3 = 0 có hai nghiệm x₁, x₂. Tính giá trị của biểu thức A = x₁² + x₂² - 3x₁x₂.',
        solution: 'Vì a = 1, c = 3 ⇒ a.c = 3 > 0, Δ = (-5)² - 4.1.3 = 13 > 0 nên pt luôn có 2 nghiệm phân biệt.\nTheo định lý Vi-ét:\nS = x₁ + x₂ = 5\nP = x₁.x₂ = 3\nTa có: A = (x₁ + x₂)² - 2x₁x₂ - 3x₁x₂ = S² - 5P = 5² - 5(3) = 25 - 15 = 10.',
        tip: 'Nhớ chứng minh phương trình có nghiệm (Δ ≥ 0 hoặc a.c < 0) trước khi áp dụng hệ thức Vi-ét.'
      }
    ],
    exercises: [
      {
        id: 'ptbh-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Cho phương trình 2x² - 7x + 3 = 0. Tổng và tích hai nghiệm của phương trình lần lượt là:',
        options: ['S = 7/2; P = 3/2', 'S = -7/2; P = 3/2', 'S = 7/2; P = -3/2', 'S = 7; P = 3'],
        correctAnswer: 'S = 7/2; P = 3/2',
        explanation: 'S = -b/a = -(-7)/2 = 7/2; P = c/a = 3/2.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'toan-he-phuong-trinh',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Đại số',
    title: 'Hệ phương trình bậc nhất hai ẩn',
    description: 'Phương pháp thế, phương pháp cộng đại số, phương pháp đặt ẩn phụ và giải bài toán có chứa tham số m.',
    weightInExam: 'Chiếm 0.75 - 1.0 điểm trong đề thi',
    theorySummary: '• Hệ phương trình bậc nhất hai ẩn có dạng: ax + by = c và a\'x + b\'y = c\'.\n• Phương pháp giải cơ bản:\n  - Phương pháp thế: Biểu diễn một ẩn theo ẩn kia từ một phương trình rồi thế vào phương trình còn lại.\n  - Phương pháp cộng đại số: Nhân hai vế với hệ số thích hợp để hệ số của một ẩn bằng nhau hoặc đối nhau, rồi cộng/trừ hai vế.\n  - Phương pháp đặt ẩn phụ: Áp dụng khi phương trình chứa các biểu thức lặp lại phức tạp như 1/(x-1), √(y+2)...',
    keyFormulas: [
      'Hệ có nghiệm duy nhất ⇔ a/a\' ≠ b/b\'',
      'Hệ vô nghiệm ⇔ a/a\' = b/b\' ≠ c/c\'',
      'Hệ vô số nghiệm ⇔ a/a\' = b/b\' = c/c\''
    ],
    examples: [
      {
        title: 'Ví dụ: Giải hệ bằng phương pháp cộng đại số',
        problem: 'Giải hệ phương trình: { 2x + 3y = 7; 3x - y = 5 }',
        solution: 'Nhân cả 2 vế của phương trình thứ hai với 3:\n{ 2x + 3y = 7; 9x - 3y = 15 }\nCộng hai vế ta được: 11x = 22 ⇔ x = 2.\nThay x = 2 vào 3x - y = 5 ⇒ 3(2) - y = 5 ⇔ y = 1.\nVậy nghiệm của hệ là (x; y) = (2; 1).',
        tip: 'Khi làm bài, nhớ kết luận nghiệm rõ ràng dưới dạng cặp số (x; y).'
      }
    ],
    exercises: [
      {
        id: 'hpt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Nghiệm của hệ phương trình { x + y = 5; x - y = 1 } là:',
        options: ['(3; 2)', '(2; 3)', '(4; 1)', '(3; 1)'],
        correctAnswer: '(3; 2)',
        explanation: 'Cộng 2 phương trình: 2x = 6 ⇒ x = 3. Thay vào pt 1: 3 + y = 5 ⇒ y = 2. Nghiệm là (3; 2).'
      }
    ]
  },
  {
    id: 'toan-toan-thuc-te-hcm',
    subjectId: 'toan',
    category: 'thuc-te',
    categoryLabel: 'Toán thực tế (Đặc trưng TP.HCM)',
    title: 'Bài toán thực tế',
    description: 'Đặc trưng đề thi tuyển sinh 10 TP.HCM: giảm giá khuyến mãi, lãi suất ngân hàng, nồng độ dung dịch, hóa đơn tiền điện/nước lũy tiến, khoảng cách và góc ngắm.',
    weightInExam: 'Cực kỳ quan trọng: Chiếm 4.0 - 4.5 điểm (Bài 3, 4, 5, 6, 7 trong đề thi TP.HCM)',
    theorySummary: '• Đề thi TP.HCM luôn có 5 bài toán thực tế áp dụng kiến thức toán học vào đời sống:\n  1. Bài toán kinh tế / Siêu thị giảm giá: Giá sau giảm = Giá gốc × (100% - %giảm). Nếu giảm 2 lần liên tiếp: P = P₀(1 - r₁)(1 - r₂).\n  2. Hóa đơn tiền điện / nước bậc thang: Chia thành các định mức, tính tiền từng bậc rồi cộng thuế VAT (8% hoặc 10%).\n  3. Lãi suất ngân hàng: Lãi đơn / lãi kép sau 1 năm hoặc nhiều năm.\n  4. Bài toán nồng độ dung dịch: C% = (m_chất_tan / m_dung_dịch) × 100%.\n  5. Bài toán hình học thực tế: Thể tích lon nước hình trụ (V = πr²h), bồn cầu hình nón/cầu, tính chiều cao cây/tòa nhà nhờ bóng nắng hoặc giác kế (hệ thức lượng / tỉ số lượng giác).',
    keyFormulas: [
      'Giá sau giảm: P_mới = P_cũ × (1 - r%)',
      'Thể tích hình trụ: V = πr²h; S_xq = 2πrh',
      'Thể tích hình nón: V = 1/3 πr²h; S_xq = πrl',
      'Thể tích hình cầu: V = 4/3 πR³; Diện tích mặt cầu: S = 4πR²',
      'Tiền điện = Tổng tiền từng bậc + Tiền từng bậc × VAT%'
    ],
    examples: [
      {
        title: 'Ví dụ: Bài toán khuyến mãi siêu thị (Đề TP.HCM)',
        problem: 'Nhân dịp khai giảng, nhà sách giảm giá 10% cho tất cả các loại sách. Khách hàng có thẻ thành viên được giảm thêm 5% trên giá đã giảm. Bạn An có thẻ thành viên mua một bộ sách giáo khoa có giá niêm yết là 300.000 đồng. Hỏi An phải trả bao nhiêu tiền?',
        solution: '• Giá bộ sách sau khi giảm đợt 1 (10%):\n  300.000 × (1 - 0.10) = 270.000 (đồng).\n• Giá An phải trả khi có thẻ thành viên (giảm tiếp 5% trên giá đã giảm):\n  270.000 × (1 - 0.05) = 256.500 (đồng).\nĐáp số: 256.500 đồng.',
        tip: 'Lưu ý: Giảm 10% rồi giảm thêm 5% trên giá đã giảm KHÔNG ĐỒNG NGHĨA với giảm 15% trên giá ban đầu!'
      },
      {
        title: 'Ví dụ: Tính chiều cao tòa nhà Landmark 81 bằng bóng nắng',
        problem: 'Một người đứng cách chân tòa nhà 150m, dùng giác kế cao 1.6m ngắm lên đỉnh tòa nhà với góc nâng 70°. Tính chiều cao tòa nhà (làm tròn đến hàng đơn vị).',
        solution: 'Gọi h là chiều cao tòa nhà, h = 1.6 + x (với x là khoảng cách từ đỉnh giác kế lên đỉnh tòa nhà).\nTrong tam giác vuông: tan(70°) = x / 150 ⇒ x = 150 . tan(70°) ≈ 150 . 2.7475 ≈ 412.1m.\nChiều cao của tòa nhà là: h ≈ 412.1 + 1.6 = 413.7 ≈ 414 mét.',
        tip: 'Đừng quên cộng chiều cao của giác kế / mắt người ngắm.'
      }
    ],
    exercises: [
      {
        id: 'ttt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Một đôi giày giá niêm yết 600.000đ được giảm giá 20%. Giá sau khi giảm là:',
        options: ['480.000đ', '500.000đ', '520.000đ', '450.000đ'],
        correctAnswer: '480.000đ',
        explanation: 'Số tiền phải trả = 600.000 × (1 - 0.20) = 480.000đ.'
      },
      {
        id: 'ttt-2',
        level: 'trung-binh',
        levelLabel: 'Vận dụng',
        question: 'Một lon sữa đặc có dạng hình trụ có bán kính đáy r = 3.5 cm và chiều cao h = 8 cm. Thể tích lon sữa đặc xấp xỉ bằng (lấy π ≈ 3.14):',
        options: ['307.72 cm³', '153.86 cm³', '615.44 cm³', '87.92 cm³'],
        correctAnswer: '307.72 cm³',
        explanation: 'V = π . r² . h = 3.14 × 3.5² × 8 = 3.14 × 12.25 × 8 = 307.72 cm³.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'toan-lap-phuong-trinh',
    subjectId: 'toan',
    category: 'thuc-te',
    categoryLabel: 'Đại số & Thực tế',
    title: 'Giải bài toán bằng cách lập phương trình/hệ phương trình',
    description: 'Các dạng toán chuyển động (vận tốc, quãng đường, thời gian), toán năng suất, toán làm chung làm riêng, toán phần trăm hình chữ nhật.',
    weightInExam: 'Chiếm 1.0 điểm trong đề tuyển sinh lớp 10',
    theorySummary: '• Các bước giải:\n  1. Chọn ẩn số và đặt điều kiện thích hợp cho ẩn (kèm đơn vị).\n  2. Biểu diễn các đại lượng chưa biết theo ẩn và các đại lượng đã biết.\n  3. Lập phương trình hoặc hệ phương trình biểu thị mối quan hệ giữa các đại lượng.\n  4. Giải phương trình / hệ phương trình.\n  5. Đối chiếu nghiệm với điều kiện và kết luận.\n• Ba công thức cốt lõi:\n  - Toán chuyển động: S = v . t\n  - Toán năng suất: Khối lượng công việc = Năng suất × Thời gian\n  - Làm chung - riêng: 1/t₁ + 1/t₂ = 1/t_chung',
    keyFormulas: [
      'S = v . t (Quãng đường = Vận tốc × Thời gian)',
      '1/x + 1/y = 1/T (Toán làm chung công việc)',
      'Vận tốc xuôi dòng = v_thực + v_nước; Vận tốc ngược dòng = v_thực - v_nước'
    ],
    examples: [
      {
        title: 'Ví dụ: Toán chuyển động',
        problem: 'Một xe ô tô đi từ A đến B dài 120km. Lúc về ô tô tăng vận tốc thêm 10 km/h nên thời gian về ít hơn thời gian đi 24 phút (2/5 giờ). Tính vận tốc lúc đi.',
        solution: 'Gọi vận tốc lúc đi là x (km/h, x > 0).\nVận tốc lúc về là x + 10 (km/h).\nThời gian đi: 120/x (giờ). Thời gian về: 120/(x + 10) (giờ).\nĐổi 24 phút = 2/5 giờ. Ta có phương trình:\n120/x - 120/(x + 10) = 2/5 ⇔ 60/x - 60/(x + 10) = 1/5\n⇔ 300(x + 10) - 300x = x(x + 10) ⇔ x² + 10x - 3000 = 0.\nΔ\' = 25 + 3000 = 3025 > 0, √Δ\' = 55.\nx₁ = -5 + 55 = 50 (nhận), x₂ = -5 - 55 = -60 (loại).\nVậy vận tốc lúc đi của xe là 50 km/h.',
        tip: 'Nhớ đổi đơn vị thời gian từ phút sang giờ trước khi lập phương trình.'
      }
    ],
    exercises: [
      {
        id: 'lpt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Hai vòi nước cùng chảy vào bể cạn thì sau 6 giờ đầy bể. Nếu vòi 1 chảy riêng mất x giờ (x > 6) thì trong 1 giờ vòi 1 chảy được bao nhiêu phần bể?',
        options: ['1/x bể', 'x/6 bể', '6/x bể', '1/6 bể'],
        correctAnswer: '1/x bể',
        explanation: 'Nếu vòi 1 làm một mình mất x giờ để xong 1 công việc (1 bể) thì mỗi giờ làm được 1/x công việc.'
      }
    ]
  },
  {
    id: 'toan-he-thuc-luong',
    subjectId: 'toan',
    category: 'hinh-hoc',
    categoryLabel: 'Hình học',
    title: 'Hệ thức lượng trong tam giác vuông',
    description: '5 hệ thức lượng cơ bản trong tam giác vuông giữa cạnh góc vuông, cạnh huyền, đường cao và hình chiếu.',
    weightInExam: 'Thường áp dụng trong Bài 4 (thực tế) hoặc Câu a bài hình học - 0.75 điểm',
    theorySummary: 'Cho tam giác ABC vuông tại A, đường cao AH (BC = a, AC = b, AB = c, AH = h, BH = c\', CH = b\'):\n1. b² = a . b\' và c² = a . c\' (Bình phương cạnh góc vuông bằng tích cạnh huyền và hình chiếu).\n2. h² = b\' . c\' (Bình phương đường cao bằng tích hai hình chiếu).\n3. a . h = b . c (Tích cạnh huyền và đường cao bằng tích hai cạnh góc vuông).\n4. 1/h² = 1/b² + 1/c² (Nghịch đảo bình phương đường cao).\n5. Định lý Pytago: a² = b² + c².',
    keyFormulas: [
      'b² = a . b\', c² = a . c\'',
      'h² = b\' . c\'',
      'a . h = b . c',
      '1/h² = 1/b² + 1/c²',
      'a² = b² + c²'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính đường cao và cạnh huyền',
        problem: 'Cho tam giác ABC vuông tại A, đường cao AH. Biết BH = 4 cm, CH = 9 cm. Tính độ dài AH và AB.',
        solution: '• Áp dụng hệ thức: h² = b\' . c\' ⇒ AH² = BH . CH = 4 . 9 = 36 ⇒ AH = 6 cm.\n• BC = BH + CH = 4 + 9 = 13 cm.\n• Áp dụng hệ thức: c² = a . c\' ⇒ AB² = BC . BH = 13 . 4 = 52 ⇒ AB = √52 = 2√13 cm.',
        tip: 'Vẽ hình chính xác và ghi chú rõ các đoạn thẳng đã biết lên hình.'
      }
    ],
    exercises: [
      {
        id: 'htl-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Độ dài đường cao AH là:',
        options: ['2.4 cm', '2.5 cm', '5 cm', '1.2 cm'],
        correctAnswer: '2.4 cm',
        explanation: 'BC = √(3² + 4²) = 5 cm. Ta có AH . BC = AB . AC ⇒ AH = (3 × 4)/5 = 12/5 = 2.4 cm.'
      }
    ]
  },
  {
    id: 'toan-ti-so-luong-giac',
    subjectId: 'toan',
    category: 'hinh-hoc',
    categoryLabel: 'Hình học',
    title: 'Tỉ số lượng giác',
    description: 'Định nghĩa sin, cos, tan, cot trong tam giác vuông và ứng dụng đo đạc thực tế (góc nâng, góc hạ).',
    weightInExam: 'Thường gặp trong các bài toán thực tế tính khoảng cách, chiều cao',
    theorySummary: '• Cho góc nhọn α: sin α = Đối / Huyền; cos α = Kề / Huyền; tan α = Đối / Kề; cot α = Kề / Đối.\n• Tính chất: 0 < sin α < 1; 0 < cos α < 1.\n• sin²α + cos²α = 1; tan α . cot α = 1; tan α = sin α / cos α.\n• Hai góc phụ nhau (α + β = 90°): sin α = cos β; tan α = cot β.',
    keyFormulas: [
      'sin = Đối / Huyền, cos = Kề / Huyền, tan = Đối / Kề',
      'sin²α + cos²α = 1',
      'sin α = cos(90° - α), tan α = cot(90° - α)'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính tỉ số lượng giác',
        problem: 'Cho tam giác ABC vuông tại A có AB = 6cm, BC = 10cm. Tính sin B và tan C.',
        solution: 'AC = √(BC² - AB²) = √(10² - 6²) = 8 cm.\n• sin B = AC / BC = 8 / 10 = 0.8.\n• tan C = AB / AC = 6 / 8 = 0.75.',
        tip: 'Nhớ câu thần chú: "Sao Đi Học, Cứ Khóc Hoài, Thôi Đừng Khóc, Có Kẹo Đây".'
      }
    ],
    exercises: [
      {
        id: 'tslg-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Nếu góc α = 30° thì giá trị của sin α bằng:',
        options: ['1/2', '√3/2', '√2/2', '1'],
        correctAnswer: '1/2',
        explanation: 'sin(30°) = 1/2.'
      }
    ]
  },
  {
    id: 'toan-tu-giac-noi-tiep',
    subjectId: 'toan',
    category: 'hinh-hoc',
    categoryLabel: 'Hình học',
    title: 'Tứ giác nội tiếp',
    description: 'Dấu hiệu nhận biết tứ giác nội tiếp đường tròn, góc nội tiếp, góc tạo bởi tiếp tuyến và dây cung.',
    weightInExam: 'Chiếm 1.5 - 2.0 điểm (Bài 8 - Câu hình học bắt buộc trong mọi đề thi)',
    theorySummary: '• Tứ giác có 4 đỉnh cùng nằm trên một đường tròn gọi là tứ giác nội tiếp.\n• Dấu hiệu nhận biết (4 dấu hiệu vàng):\n  1. Tứ giác có tổng hai góc đối diện bằng 180°.\n  2. Tứ giác có góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện.\n  3. Tứ giác có hai đỉnh kề nhau cùng nhìn cạnh chứa hai đỉnh còn lại dưới một góc bằng nhau α.\n  4. Tứ giác có 4 đỉnh cách đều một điểm cố định (thường là trung điểm cạnh huyền của hai tam giác vuông chung cạnh huyền).',
    keyFormulas: [
      '∠A + ∠C = 180° hoặc ∠B + ∠D = 180°',
      'Hai đỉnh kề nhìn một đoạn thẳng dưới góc vuông ⇒ 4 điểm cùng thuộc đường tròn đường kính đoạn đó',
      'Góc nội tiếp chắn nửa đường tròn = 90°'
    ],
    examples: [
      {
        title: 'Ví dụ: Chứng minh tứ giác nội tiếp đường tròn (Đề thi tuyển sinh)',
        problem: 'Cho tam giác ABC có 3 góc nhọn nội tiếp (O). Vẽ hai đường cao BD và CE cắt nhau tại H. Chứng minh tứ giác BEDC nội tiếp.',
        solution: 'Vì BD và CE là đường cao nên ∠BDC = 90° và ∠BEC = 90°.\nXét tứ giác BEDC có hai đỉnh kề nhau E và D cùng nhìn đoạn thẳng BC dưới một góc bằng 90° (∠BEC = ∠BDC = 90°).\nDo đó tứ giác BEDC nội tiếp đường tròn đường kính BC.',
        tip: 'Ghi rõ hai đỉnh kề nhau cùng nhìn một cạnh dưới góc không đổi để được trọn vẹn điểm trình bày.'
      }
    ],
    exercises: [
      {
        id: 'tgnt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Tứ giác ABCD nội tiếp đường tròn biết ∠A = 70°. Số đo của góc C đối diện là:',
        options: ['110°', '70°', '90°', '120°'],
        correctAnswer: '110°',
        explanation: 'Trong tứ giác nội tiếp, tổng hai góc đối diện bằng 180°. Do đó ∠C = 180° - 70° = 110°.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'toan-duong-tron-tiep-tuyen',
    subjectId: 'toan',
    category: 'hinh-hoc',
    categoryLabel: 'Hình học',
    title: 'Đường tròn & Tiếp tuyến',
    description: 'Tính chất tiếp tuyến, hai tiếp tuyến cắt nhau, góc giữa tiếp tuyến và dây cung, liên hệ giữa cung và dây.',
    weightInExam: 'Trọng tâm Bài 8 câu b (Tiếp tuyến và chứng minh tích đoạn thẳng)',
    theorySummary: '• Tiếp tuyến vuông góc với bán kính tại tiếp điểm.\n• Tính chất hai tiếp tuyến cắt nhau tại M:\n  - MA = MB\n  - MO là tia phân giác của góc AMB\n  - OM là tia phân giác của góc AOB, MO ⊥ AB tại trung điểm I của AB.\n• Góc tạo bởi tia tiếp tuyến và dây cung bằng góc nội tiếp cùng chắn cung đó.',
    keyFormulas: [
      'MA = MB (M là giao điểm 2 tiếp tuyến)',
      'MO là đường trung trực của đoạn thẳng AB',
      'Góc (tiếp tuyến, dây cung) = Góc nội tiếp cùng chắn một cung'
    ],
    examples: [
      {
        title: 'Ví dụ: Chứng minh tích MA . MB = MC . MD',
        problem: 'Từ điểm M nằm ngoài (O), vẽ tiếp tuyến MA và cát tuyến MCD. Chứng minh MA² = MC . MD.',
        solution: 'Xét ΔMAC và ΔMDA có:\n• ∠M chung.\n• ∠MAC = ∠MDA (góc tạo bởi tiếp tuyến và dây cung bằng góc nội tiếp cùng chắn cung AC).\nSuy ra ΔMAC ~ ΔMDA (g-g).\n⇒ MA / MD = MC / MA ⇒ MA² = MC . MD.',
        tip: 'Dạng bài tiếp tuyến và cát tuyến luôn đưa về hai tam giác đồng dạng quen thuộc ΔMAC ~ ΔMDA.'
      }
    ],
    exercises: [
      {
        id: 'dttt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Cho (O; 5cm) và điểm M cách O một khoảng OM = 13cm. Kẻ tiếp tuyến MA với (O) (A là tiếp điểm). Độ dài đoạn MA là:',
        options: ['12 cm', '8 cm', '10 cm', '√194 cm'],
        correctAnswer: '12 cm',
        explanation: 'Tam giác OAM vuông tại A. Áp dụng Pytago: MA = √(OM² - OA²) = √(13² - 5²) = 12 cm.'
      }
    ]
  },
  {
    id: 'toan-hinh-khong-gian',
    subjectId: 'toan',
    category: 'hinh-hoc',
    categoryLabel: 'Hình học & Thực tế',
    title: 'Hình học không gian',
    description: 'Hình trụ, hình nón, hình cầu: diện tích xung quanh, diện tích toàn phần, thể tích và ứng dụng giải bài toán đồ vật thực tế.',
    weightInExam: 'Chiếm 0.75 - 1.0 điểm (Bài toán thực tế hình không gian TP.HCM)',
    theorySummary: '1. Hình trụ (bán kính r, chiều cao h):\n   - S_xq = 2πrh, S_tp = 2πrh + 2πr²\n   - V = πr²h\n2. Hình nón (bán kính r, đường sinh l = √(h² + r²), chiều cao h):\n   - S_xq = πrl, S_tp = πrl + πr²\n   - V = 1/3 πr²h\n3. Hình cầu (bán kính R):\n   - S_mặt_cầu = 4πR²\n   - V = 4/3 πR³',
    keyFormulas: [
      'V_trụ = πr²h',
      'V_nón = 1/3 πr²h',
      'V_cầu = 4/3 πR³',
      'S_cầu = 4πR²'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính dung tích thùng nước hình trụ',
        problem: 'Một bồn nước inox hình trụ có đường kính đáy d = 1.2m và chiều cao h = 1.8m. Bồn đó chứa được tối đa bao nhiêu lít nước? (Lấy π ≈ 3.14, 1m³ = 1000 lít).',
        solution: 'Bán kính đáy: r = d / 2 = 1.2 / 2 = 0.6 m.\nThể tích bồn nước:\nV = π . r² . h = 3.14 × (0.6)² × 1.8 = 3.14 × 0.36 × 1.8 ≈ 2.035 m³.\nDung tích tối đa: 2.035 × 1000 ≈ 2035 lít.',
        tip: 'Lưu ý đề bài cho đường kính hay bán kính đáy để không bị nhầm lẫn chia đôi.'
      }
    ],
    exercises: [
      {
        id: 'hhkg-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Diện tích mặt cầu bán kính R = 3cm (lấy π ≈ 3.14) bằng:',
        options: ['113.04 cm²', '37.68 cm²', '28.26 cm²', '339.12 cm²'],
        correctAnswer: '113.04 cm²',
        explanation: 'S = 4πR² = 4 × 3.14 × 3² = 4 × 3.14 × 9 = 113.04 cm².'
      }
    ],
    hcmFocus: true
  },
  {
    id: 'toan-xac-suat-thong-ke',
    subjectId: 'toan',
    category: 'dai-so',
    categoryLabel: 'Xác suất & Thống kê',
    title: 'Thống kê và Xác suất',
    description: 'Bảng tần số, biểu đồ hình quạt, xác suất thực nghiệm và xác suất cổ điển của biến cố đơn giản.',
    weightInExam: 'Chương trình mới GDPT 2018 - thường chiếm 0.5 - 0.75 điểm',
    theorySummary: '• Thống kê: Bảng số liệu, tần số, tần số tương đối, số trung bình cộng, mốt, tứ phân vị.\n• Xác suất: P(A) = n(A) / n(Ω) trong đó n(A) là số kết quả thuận lợi cho biến cố A, n(Ω) là tổng số kết quả có thể xảy ra trong không gian mẫu (các kết quả đồng khả năng).\n• Tính chất: 0 ≤ P(A) ≤ 1. P(Biến cố chắc chắn) = 1; P(Biến cố không thể) = 0.',
    keyFormulas: [
      'P(A) = Số kết quả thuận lợi cho A / Tổng số kết quả có thể',
      'P(Biến cố đối Ā) = 1 - P(A)'
    ],
    examples: [
      {
        title: 'Ví dụ: Tung xúc xắc',
        problem: 'Gieo ngẫu nhiên một con xúc xắc 6 mặt cân đối. Tính xác suất để xuất hiện mặt có số chấm là số nguyên tố.',
        solution: 'Không gian mẫu Ω = {1, 2, 3, 4, 5, 6} ⇒ n(Ω) = 6.\nCác mặt có số chấm là số nguyên tố: A = {2, 3, 5} ⇒ n(A) = 3.\nXác suất biến cố là: P(A) = 3 / 6 = 1/2 = 0.5 (50%).',
        tip: 'Số 1 không phải là số nguyên tố.'
      }
    ],
    exercises: [
      {
        id: 'xs-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Một hộp có 3 viên bi đỏ, 4 viên bi xanh và 5 viên bi vàng. Rút ngẫu nhiên 1 viên, xác suất rút được viên bi đỏ là:',
        options: ['1/4', '1/3', '3/7', '5/12'],
        correctAnswer: '1/4',
        explanation: 'Tổng số viên bi = 3 + 4 + 5 = 12. Số kết quả thuận lợi là 3. Xác suất = 3/12 = 1/4.'
      }
    ]
  },

  // ========================== NGỮ VĂN ==========================
  {
    id: 'van-doc-hieu-phuong-thuc',
    subjectId: 'van',
    category: 'doc-hieu',
    categoryLabel: 'Đọc hiểu',
    title: 'Phương thức biểu đạt & Thể loại',
    description: '6 phương thức biểu đạt (Tự sự, Miêu tả, Biểu cảm, Thuyết minh, Nghị luận, Hành chính công vụ) và nhận diện thể loại văn bản.',
    weightInExam: 'Câu 1 phần Đọc hiểu (chiếm 0.5 - 1.0 điểm)',
    theorySummary: '• Tự sự: Kể lại diễn biến sự việc, có nhân vật, cốt truyện, chuỗi hành động.\n• Miêu tả: Tái hiện sinh động diện mạo, cảnh sắc, trạng thái, đường nét, màu sắc.\n• Biểu cảm: Bộc lộ trực tiếp cảm xúc, tình cảm, rung động của người viết (thường dùng trong thơ trữ tình, tùy bút).\n• Thuyết minh: Cung cấp tri thức khách quan, chính xác về đặc điểm, công dụng của đối tượng.\n• Nghị luận: Bàn bạc, thuyết phục người đọc về một quan điểm, ý kiến thông qua luận điểm, luận cứ, dẫn chứng.\n• Hành chính - công vụ: Dùng trong các văn bản giao tiếp hành chính, đơn từ, công văn.',
    keyFormulas: [
      'Nghị luận: Luận điểm + Luận cứ + Lập luận',
      'Biểu cảm: Cảm xúc chủ quan + Từ ngữ gợi cảm',
      'Đề TP.HCM thường dùng văn bản nghị luận hoặc tản văn thời sự mang tính giáo dục nhân văn'
    ],
    examples: [
      {
        title: 'Ví dụ: Nhận diện phương thức biểu đạt chính',
        problem: 'Xác định phương thức biểu đạt chính của đoạn trích: "Lòng biết ơn không chỉ là lời nói nơi đầu môi, mà là ngọn lửa sưởi ấm tâm hồn, thúc đẩy chúng ta sống trách nhiệm và sẻ chia với cộng đồng."',
        solution: 'Phương thức biểu đạt chính là: Nghị luận (vì đoạn văn đưa ra nhận định, bày tỏ quan điểm và bàn luận về ý nghĩa của lòng biết ơn trong cuộc sống).',
        tip: 'Khi đề hỏi phương thức biểu đạt CHÍNH, chỉ trả lời duy nhất 1 phương thức có vai trò chủ đạo.'
      }
    ],
    exercises: [
      {
        id: 'vdh-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Phương thức biểu đạt chính thường thấy trong các bài thơ trữ tình (như Bếp lửa, Ánh trăng) là:',
        options: ['Biểu cảm', 'Tự sự', 'Thuyết minh', 'Hành chính'],
        correctAnswer: 'Biểu cảm',
        explanation: 'Thơ ca trữ tình có phương thức biểu đạt chính là Biểu cảm nhằm bộc lộ cảm xúc, tình cảm của tác giả.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'van-bien-phap-tu-tu',
    subjectId: 'van',
    category: 'tieng-viet',
    categoryLabel: 'Tiếng Việt',
    title: 'Biện pháp tu từ & Tác dụng',
    description: 'So sánh, ẩn dụ, hoán dụ, nhân hóa, điệp từ/ngữ, nói quá, nói giảm nói tránh, chơi chữ, liệt kê, tương phản. Công thức chỉ ra tác dụng chuẩn điểm thi vào 10.',
    weightInExam: 'Trọng tâm Câu 2 phần Đọc hiểu - Tiếng Việt (1.0 điểm)',
    theorySummary: '• Công thức 3 bước nêu tác dụng của biện pháp tu từ:\n  1. Gọi tên chính xác biện pháp tu từ và trích dẫn từ ngữ/hình ảnh minh chứng.\n  2. Tác dụng về mặt nội dung: Nhấn mạnh, khắc họa sinh động hình ảnh/tính chất gì; gợi cảm xúc gì ở người đọc.\n  3. Tác dụng về mặt nghệ thuật: Làm cho câu văn/thơ giàu hình ảnh, nhịp điệu sinh động, tăng tính thuyết phục.\n• Phân biệt Ẩn dụ và Hoán dụ:\n  - Ẩn dụ: Dựa trên mối quan hệ tương đồng (giống nhau về hình thức, cách thức, phẩm chất hoặc cảm giác).\n  - Hoán dụ: Dựa trên mối quan hệ tương cận (gần gũi: vật chứa - vật bị chứa, bộ phận - toàn thể, dấu hiệu - sự vật).',
    keyFormulas: [
      'Công thức tác dụng: Gọi tên & chỉ ra từ ngữ → Gợi tả hình ảnh / nội dung → Bộc lộ cảm xúc tác giả → Tăng sức gợi hình, gợi cảm'
    ],
    examples: [
      {
        title: 'Ví dụ: Nêu tác dụng của biện pháp điệp từ trong câu thơ',
        problem: 'Chỉ ra và nêu tác dụng của biện pháp tu từ trong câu: "Nhóm bếp lửa ấp iu nồng đượm / Nhóm niềm yêu thương, khoai sắn ngọt bùi / Nhóm nồi xôi gạo mới sẻ chung vui..." (Bằng Việt)',
        solution: '• Biện pháp tu từ: Điệp từ "Nhóm" kết hợp với phép liệt kê.\n• Tác dụng:\n  - Tái hiện hành động nhóm lửa kiên nhẫn, quen thuộc mỗi sớm của người bà.\n  - Từ nghĩa thực (nhóm ngọn lửa rơm củi), từ "nhóm" chuyển sang nghĩa ẩn dụ sâu sắc: bà nhen nhóm trong lòng cháu tình yêu thương gia đình, tình làng nghĩa xóm và khát vọng sống cao đẹp.\n  - Giúp câu thơ giàu nhạc điệu tha thiết, bộc lộ lòng biết ơn vô hạn của người cháu.',
        tip: 'Khi nêu tác dụng, nhất định phải trả lời cả 2 vế: Nghĩa tả thực và Nghĩa biểu tượng cảm xúc.'
      }
    ],
    exercises: [
      {
        id: 'bptt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Câu thơ "Ngày ngày mặt trời đi qua trên lăng / Thấy một mặt trời trong lăng rất đỏ" sử dụng biện pháp tu từ nào ở từ "mặt trời" thứ hai?',
        options: ['Ẩn dụ', 'Hoán dụ', 'So sánh', 'Nói quá'],
        correctAnswer: 'Ẩn dụ',
        explanation: 'Mặt trời thứ hai là hình ảnh ẩn dụ ngợi ca Bác Hồ - người mang lại ánh sáng tự do, ấm no và độc lập vĩ đại cho dân tộc Việt Nam.'
      }
    ],
    isTrending: true
  },
  {
    id: 'van-nghi-luan-xa-hoi',
    subjectId: 'van',
    category: 'nghi-luan',
    categoryLabel: 'Làm văn nghị luận',
    title: 'Nghị luận xã hội (200 chữ)',
    description: 'Kỹ năng viết đoạn văn NLXH về tư tưởng đạo lý, hiện tượng đời sống, vấn đề giới trẻ TP.HCM (áp lực đồng trang lứa, bản lĩnh sống, lòng thấu cảm, văn hóa mạng xã hội).',
    weightInExam: 'Câu 2 đề thi Tuyển sinh 10 TP.HCM - 3.0 điểm',
    theorySummary: '• Cấu trúc đoạn văn 200 chữ chuẩn điểm 10:\n  1. Mở đoạn (1-2 câu): Dẫn dắt và nêu trực tiếp vấn đề cần nghị luận.\n  2. Giải thích (2-3 câu): Cắt nghĩa ngắn gọn từ khóa trọng tâm, rút ra thông điệp cốt lõi.\n  3. Bàn luận & Phân tích (6-8 câu): Vì sao vấn đề lại quan trọng? Biểu hiện thực tế? Mang lại giá trị gì cho cá nhân và cộng đồng?\n  4. Dẫn chứng xác thực (2-3 câu): Dẫn chứng từ người thật việc thật, mang tính truyền cảm hứng (tiêu biểu, tích cực, không lấy dẫn chứng chung chung).\n  5. Phản đề & Mở rộng (2 câu): Phê phán những người có suy nghĩ/hành vi ngược lại; nhìn nhận vấn đề đa chiều.\n  6. Bài học nhận thức & hành động (2 câu): Bản thân học sinh cần thay đổi nhận thức như thế nào và hành động cụ thể ra sao.',
    keyFormulas: [
      'Công thức NLXH: Nêu vấn đề → Giải thích ngắn → Tại sao (Ý nghĩa) → Dẫn chứng tiêu biểu → Phản đề → Bài học bản thân',
      'Đề TP.HCM chú trọng suy nghĩ độc lập, cách nhìn văn minh và dẫn chứng thực tế'
    ],
    examples: [
      {
        title: 'Ví dụ: Dàn ý đoạn văn NLXH về "Sự tự tin của tuổi trẻ"',
        problem: 'Viết đoạn văn khoảng 200 chữ bàn về ý nghĩa của sự tự tin đối với học sinh chuẩn bị bước vào kỳ thi tuyển sinh lớp 10.',
        solution: '• Mở đoạn: Tự tin là chiếc chìa khóa vàng giúp mỗi người khai mở tiềm năng vô hạn của chính mình.\n• Giải thích: Tự tin là sự tin tưởng vào năng lực, phẩm chất và giá trị của bản thân, không tự ti hay hoang mang trước thử thách.\n• Bàn luận: Tự tin giúp ta bình tĩnh trước phòng thi, dám ước mơ vào những ngôi trường THPT mong muốn, biến áp lực thành động lực cố gắng.\n• Dẫn chứng: Các tấm gương vượt khó học tập, dám kiên trì theo đuổi mục tiêu.\n• Phản đề: Tránh nhầm lẫn tự tin với tự phụ, kiêu ngạo chủ quan.\n• Bài học: Trau dồi kiến thức vững vàng, rèn luyện tâm lý vững vàng để tự tin chinh phục cánh cửa lớp 10.',
        tip: 'Đoạn văn không được ngắt xuống dòng giữa chừng để đảm bảo đúng quy cách hình thức đoạn văn 200 chữ.'
      }
    ],
    exercises: [
      {
        id: 'nlxh-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Một đoạn văn nghị luận xã hội chuẩn hình thức khi đi thi phải đảm bảo yêu cầu nào sau đây?',
        options: [
          'Viết liền mạch từ chữ cái đầu lùi vào đến dấu chấm kết, không xuống dòng tách đoạn',
          'Tách thành 3 đoạn nhỏ: Mở đoạn, thân đoạn, kết đoạn',
          'Phải có ít nhất 10 dẫn chứng lịch sử',
          'Viết dài trên 5 trang giấy thi'
        ],
        correctAnswer: 'Viết liền mạch từ chữ cái đầu lùi vào đến dấu chấm kết, không xuống dòng tách đoạn',
        explanation: 'Quy chuẩn đoạn văn là viết liền mạch, lùi đầu dòng chữ đầu tiên và kết thúc bằng dấu chấm ngắt đoạn. Nếu xuống dòng sẽ bị trừ điểm cấu trúc đoạn văn.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'van-tac-pham-trong-tam',
    subjectId: 'van',
    category: 'van-hoc',
    categoryLabel: 'Văn học',
    title: 'Tác giả – Tác phẩm trọng tâm lớp 9',
    description: 'Các tác phẩm văn học then chốt: Đồng chí, Bài thơ về tiểu đội xe không kính, Ánh trăng, Bếp lửa, Làng, Lặng lẽ Sa Pa, Chiếc lược ngà, Mùa xuân nho nhỏ, Viếng lăng Bác, Sang thu, Nói với con.',
    weightInExam: 'Câu 3 Đề thi Tuyển sinh 10 (Nghị luận văn học) - 4.0 điểm',
    theorySummary: '• Thơ hiện đại:\n  - Đồng chí (Chính Hữu): Tình đồng chí keo sơn của những người lính nông dân trong kháng chiến chống Pháp.\n  - Bài thơ về tiểu đội xe không kính (Phạm Tiến Duật): Tinh thần lạc quan, dũng cảm, ngang tàng của người lính lái xe Trường Sơn thời chống Mỹ.\n  - Bếp lửa (Bằng Việt): Tình bà cháu thiêng liêng và lòng biết ơn nguồn cội.\n  - Ánh trăng (Nguyễn Duy): Lời nhắc nhở về đạo lý "uống nước nhớ nguồn", nghĩa tình thủy chung với quá khứ gian lao.\n  - Mùa xuân nho nhỏ (Thanh Hải): Khát vọng cống hiến thầm lặng, dâng hiến một mùa xuân nho nhỏ cho đất nước.\n  - Viếng lăng Bác (Viễn Phương): Tấm lòng thành kính, tiếc thương và biết ơn vô hạn của người con miền Nam khi về thăm lăng Bác.\n  - Sang thu (Hữu Thỉnh): Sự cảm nhận tinh tế trước những chuyển biến dịu dàng của thiên nhiên từ hạ sang thu.\n• Truyện hiện đại:\n  - Làng (Kim Lân): Tình yêu làng chợ Dầu thống nhất và hòa quyện trong tình yêu kháng chiến, yêu nước của ông Hai.\n  - Lặng lẽ Sa Pa (Nguyễn Thành Long): Vẻ đẹp của những con người lao động thầm lặng cống hiến tuổi xuân cho Tổ quốc (anh thanh niên làm khí tượng).\n  - Chiếc lược ngà (Nguyễn Quang Sáng): Tình cha con thiêng liêng, bất diệt của ông Sáu và bé Thu trong hoàn cảnh éo le của chiến tranh.',
    keyFormulas: [
      'Cấu trúc bài văn NLVH: Mở bài (Tác giả, tác phẩm, vấn đề nghị luận) → Thân bài (Phân tích theo luận điểm + nghệ thuật) → Đánh giá chung → Kết bài'
    ],
    examples: [
      {
        title: 'Ví dụ: Phân tích 3 câu thơ cuối bài thơ "Đồng chí"',
        problem: 'Nêu ý nghĩa biểu tượng của câu thơ "Đầu súng trăng treo" trong bài thơ Đồng chí của Chính Hữu.',
        solution: '• "Đầu súng trăng treo" là một hình ảnh thơ độc đáo, mang vẻ đẹp lãng mạn cách mạng.\n• "Súng" tượng trưng cho hiện thực khốc liệt của chiến tranh, cho nhiệm vụ chiến đấu bảo vệ Tổ quốc.\n• "Trăng" tượng trưng cho vẻ đẹp thanh bình của thiên nhiên, của thi ca và khát vọng hòa bình.\n• Sự kết hợp "Súng" và "Trăng" tạo nên sự hòa quyện giữa hiện thực và lãng mạn, giữa người chiến sĩ kiên cường và tâm hồn thi sĩ bay bổng của anh bộ đội Cụ Hồ.',
        tip: 'Khi phân tích thơ, luôn gắn liền hình ảnh cụ thể với cảm hứng lãng mạn cách mạng.'
      }
    ],
    exercises: [
      {
        id: 'tptt-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Tác giả của truyện ngắn "Lặng lẽ Sa Pa" là ai?',
        options: ['Nguyễn Thành Long', 'Kim Lân', 'Nguyễn Quang Sáng', 'Chính Hữu'],
        correctAnswer: 'Nguyễn Thành Long',
        explanation: 'Truyện ngắn "Lặng lẽ Sa Pa" được nhà văn Nguyễn Thành Long sáng tác năm 1970 sau chuyến đi thực tế Lào Cai.'
      }
    ],
    isTrending: true
  },

  // ========================== TIẾNG ANH ==========================
  {
    id: 'anh-word-form',
    subjectId: 'anh',
    category: 'vocabulary',
    categoryLabel: 'Từ vựng & Ngữ pháp',
    title: 'Word Form (Đặc trưng đề TP.HCM)',
    description: 'Dạng bài biến đổi loại từ (Noun, Verb, Adjective, Adverb) - phần thi bắt buộc 6 câu trong đề tuyển sinh lớp 10 TP.HCM.',
    weightInExam: 'Cực kỳ đặc trưng: Chiếm 1.5 điểm (6 câu word form trong đề TP.HCM)',
    theorySummary: '• Quy tắc nhận diện vị trí của từ loại:\n  1. NOUN (Danh từ):\n     - Sau tính từ: Adj + Noun (VD: beautiful scenery).\n     - Sau mạo từ/chỉ định từ: a, an, the, this, that, my, your, some, many + Noun.\n     - Sau giới từ: Prep + Noun/V-ing (VD: interested in pollution).\n     - Làm chủ ngữ hoặc tân ngữ trong câu.\n  2. ADJECTIVE (Tính từ):\n     - Đứng trước danh từ để bổ nghĩa: Adj + Noun.\n     - Đứng sau động từ to be và linking verbs (seem, look, feel, taste, become, sound).\n     - Cấu trúc: keep/make/find + O + Adj (VD: make me happy).\n  3. ADVERB (Trạng từ):\n     - Bổ nghĩa cho động từ thường: V + Adv hoặc Adv + V (VD: drive carefully).\n     - Bổ nghĩa cho tính từ: Adv + Adj (VD: extremely important).\n     - Đứng đầu câu ngăn cách bởi dấu phẩy: Adv, S + V (VD: Fortunately, we passed).\n  4. VERB (Động từ):\n     - Đứng sau chủ ngữ (chia theo thì và sự hòa hợp S-V).\n     - Sau modal verbs (can, could, will, must, should) là V nguyên mẫu.',
    keyFormulas: [
      'Be / Linking verb + ADJECTIVE',
      'Verb + ADVERB',
      'ADJECTIVE + NOUN',
      'Adv, S + V + O'
    ],
    examples: [
      {
        title: 'Ví dụ: Đề thi TP.HCM - Chia dạng đúng của từ trong ngoặc',
        problem: 'Solar energy is not only plentiful and renewable but also _________. (ENVIRONMENT)',
        solution: '• Phân tích: Sau "is not only plentiful (adj) and renewable (adj) but also...", ta cần một Tính từ song song với plentiful và renewable.\n• Từ gốc: ENVIRONMENT (danh từ: môi trường).\n• Tính từ tương ứng: ENVIRONMENTAL (thuộc về môi trường).\n• Nghĩa câu: environmentally-friendly hoặc environmental.\nỞ đây xét cấu trúc thông dụng: "environmentally friendly" hoặc nếu 1 từ: "ENVIRONMENTAL".\nVí dụ khác: "He drove _________ and caused an accident." (CARE) → Cần trạng từ bổ nghĩa cho "drove", gây tai nạn nên mang nghĩa tiêu cực: "CARELESSLY".',
        tip: 'Luôn xác định 2 bước: 1) Cần từ loại gì (N, V, Adj, Adv)? 2) Nghĩa tích cực hay tiêu cực (có cần thêm tiền tố un-, in-, im-, dis- không)?'
      }
    ],
    exercises: [
      {
        id: 'wf-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'The Internet has ________ developed and become indispensable in our daily life. (SURPRISE)',
        options: ['surprisingly', 'surprising', 'surprised', 'surprises'],
        correctAnswer: 'surprisingly',
        explanation: 'Vị trí giữa trợ động từ "has" và động từ chính "developed" cần một TRẠNG TỪ (Adverb) để bổ nghĩa: surprisingly.'
      },
      {
        id: 'wf-2',
        level: 'trung-binh',
        levelLabel: 'Vận dụng',
        question: 'We should use public transport to reduce air ________. (POLLUTE)',
        options: ['pollution', 'pollutant', 'polluted', 'polluting'],
        correctAnswer: 'pollution',
        explanation: 'Cụm danh từ: "air pollution" (ô nhiễm không khí). Sau tính từ "air" là danh từ "pollution".'
      }
    ],
    isTrending: true,
    hcmFocus: true
  },
  {
    id: 'anh-cac-thi-tenses',
    subjectId: 'anh',
    category: 'grammar',
    categoryLabel: 'Ngữ pháp',
    title: 'Các thì trọng tâm (Tenses)',
    description: 'Hiện tại đơn, hiện tại tiếp diễn, hiện tại hoàn thành, quá khứ đơn, quá khứ tiếp diễn, tương lai đơn và thì quá khứ hoàn thành.',
    weightInExam: 'Xuất hiện trong các câu trắc nghiệm ngữ pháp và viết lại câu',
    theorySummary: '• Hiện tại hoàn thành (Present Perfect): S + have/has + V3/ed.\n  - Dấu hiệu: since, for, already, yet, just, ever, never, so far, recently.\n  - Biến đổi kinh điển: "I haven\'t seen him for 2 years" = "It is 2 years since I last saw him" = "The last time I saw him was 2 years ago".\n• Quá khứ tiếp diễn kết hợp quá khứ đơn: Hành động đang diễn ra (was/were + V-ing) thì hành động khác xen vào (V2/ed). Dùng với While/When.\n• Quá khứ hoàn thành (Past Perfect): Hành động xảy ra trước một hành động khác trong quá khứ: S + had + V3/ed (Before + quá khứ đơn, After + quá khứ hoàn thành).',
    keyFormulas: [
      'Since + mốc thời gian, For + khoảng thời gian',
      'The last time S + V2/ed was ... ago ⇔ S + have/has not + V3/ed for ...',
      'When + S + V2/ed, S + was/were + V-ing'
    ],
    examples: [
      {
        title: 'Ví dụ: Viết lại câu thì hiện tại hoàn thành sang quá khứ đơn',
        problem: 'Rewrite: "We started living in this city five years ago." (Use: have)',
        solution: 'Ta chuyển hành động bắt đầu trong quá khứ sang thì Hiện tại hoàn thành kéo dài:\n"We have lived in this city for five years."',
        tip: 'Nhớ đổi "five years ago" thành "for five years".'
      }
    ],
    exercises: [
      {
        id: 'tns-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'When I came to see her yesterday, she ________ dinner with her family.',
        options: ['was having', 'has', 'had', 'is having'],
        correctAnswer: 'was having',
        explanation: 'Hành động đang diễn ra trong quá khứ ("was having dinner") thì hành động khác xen vào ở quá khứ đơn ("When I came").'
      }
    ]
  },
  {
    id: 'anh-cau-dieu-kien',
    subjectId: 'anh',
    category: 'grammar',
    categoryLabel: 'Ngữ pháp',
    title: 'Câu điều kiện (Conditionals) & Wish',
    description: 'Câu điều kiện loại 1 (có thể xảy ra ở hiện tại/tương lai), loại 2 (trái với hiện tại), Unless (= If not) và cấu trúc Wish.',
    weightInExam: 'Chiếm 0.5 - 1.0 điểm trong phần trắc nghiệm và viết lại câu',
    theorySummary: '• Điều kiện loại 1: If + S + V(hiện tại đơn), S + will/can/must + V(nguyên mẫu).\n• Điều kiện loại 2: If + S + V2/ed (to be dùng were cho mọi ngôi), S + would/could + V(nguyên mẫu).\n• Cấu trúc Unless: Unless = If ... not (Trừ khi / Nếu không).\n• Cấu trúc Wish:\n  - Ước ở hiện tại: S + wish(es) + S + V2/ed (were).\n  - Ước ở tương lai: S + wish(es) + S + would/could + V(nguyên mẫu).',
    keyFormulas: [
      'Type 1: If + S + V(s/es), S + will + V_inf',
      'Type 2: If + S + V2/ed (were), S + would + V_inf',
      'Unless = If ... not',
      'S + wish + S + were / V2/ed'
    ],
    examples: [
      {
        title: 'Ví dụ: Viết lại câu dùng câu điều kiện',
        problem: 'Rewrite: "I don\'t have enough money, so I can\'t buy that smartphone." (Use: If)',
        solution: 'Tình huống ở hiện tại trái với thực tế, dùng câu điều kiện loại 2:\n"If I had enough money, I could buy that smartphone."',
        tip: 'Khẳng định đổi thành phủ định hoặc ngược lại khi chuyển từ tình huống thực tế sang If.'
      }
    ],
    exercises: [
      {
        id: 'cnd-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'If it ________ tomorrow, we will cancel the picnic.',
        options: ['rains', 'rained', 'will rain', 'would rain'],
        correctAnswer: 'rains',
        explanation: 'Mệnh đề If của câu điều kiện loại 1 dùng thì hiện tại đơn (chủ ngữ "it" chia "rains").'
      }
    ],
    isTrending: true
  },
  {
    id: 'anh-cau-bi-dong-reported',
    subjectId: 'anh',
    category: 'grammar',
    categoryLabel: 'Ngữ pháp',
    title: 'Câu bị động & Câu gián tiếp',
    description: 'Chuyển đổi câu chủ động sang bị động với các thì, động từ khuyết thiếu và chuyển đổi câu trực tiếp sang gián tiếp (tường thuật).',
    weightInExam: 'Trọng tâm phần Sentence Transformation (Viết lại câu 4 câu cuối đề TP.HCM)',
    theorySummary: '• Câu bị động (Passive Voice):\n  S + V + O → S(mới) + be (chia theo thì) + V3/ed + (by O).\n• Câu gián tiếp (Reported Speech):\n  - Lùi thì: Hiện tại đơn → Quá khứ đơn; Hiện tại tiếp diễn → Quá khứ tiếp diễn; will → would; can → could.\n  - Đổi đại từ nhân xưng, tính từ sở hữu cho phù hợp.\n  - Đổi trạng từ chỉ thời gian và nơi chốn: now → then; today → that day; yesterday → the day before; tomorrow → the following day; here → there; this → that.',
    keyFormulas: [
      'Passive: S + BE + V3/ed (+ by O)',
      'Reported statement: S + told/said that + S + V(lùi thì)',
      'Reported Yes/No question: S + asked + if/whether + S + V(lùi thì)'
    ],
    examples: [
      {
        title: 'Ví dụ: Chuyển câu trực tiếp sang gián tiếp',
        problem: 'Rewrite: "I will visit my grandparents tomorrow," Nam said.',
        solution: 'Áp dụng quy tắc lùi thì và đổi trạng từ:\n"Nam said that he would visit his grandparents the following day (hoặc the next day)."',
        tip: 'Đừng quên đổi cả đại từ "my grandparents" thành "his grandparents".'
      }
    ],
    exercises: [
      {
        id: 'bd-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'A new bridge ________ across the river last year.',
        options: ['was built', 'built', 'is built', 'has been built'],
        correctAnswer: 'was built',
        explanation: 'Chủ ngữ "A new bridge" là vật chịu tác động, có mốc thời gian "last year" (quá khứ đơn) nên dùng bị động "was built".'
      }
    ]
  },
  {
    id: 'anh-sign-notice-hcm',
    subjectId: 'anh',
    category: 'skills',
    categoryLabel: 'Kỹ năng & Thực tế',
    title: 'Biển báo & Thông báo thực tế (Sign & Notice)',
    description: 'Đặc trưng đề thi tuyển sinh 10 TP.HCM: 2 câu nhận diện ý nghĩa biển báo chỉ dẫn giao thông, quy tắc an toàn hoặc thông báo công cộng.',
    weightInExam: 'Chiếm 0.5 điểm (2 câu biển báo quen thuộc trong đề thi TP.HCM)',
    theorySummary: '• Dạng bài nhận diện thông điệp từ hình ảnh biển báo giao thông, bảng cảnh báo tại công viên, bệnh viện, trường học.\n• Các từ vựng thường gặp:\n  - Prohibited / Forbidden / Not allowed: Bị cấm.\n  - Must wear protective gear: Phải mặc đồ bảo hộ.\n  - Slippery road: Đường trơn trượt.\n  - Pedestrians: Người đi bộ.\n  - Keep off the grass: Không giẫm lên cỏ.\n  - In case of fire: Trong trường hợp có hỏa hoạn.',
    keyFormulas: [
      'Biển tròn viền đỏ: Biển cấm (You must not...)',
      'Biển tròn nền xanh: Biển hiệu lệnh (You must...)',
      'Biển tam giác viền đỏ nền vàng: Biển cảnh báo nguy hiểm (Be careful...)'
    ],
    examples: [
      {
        title: 'Ví dụ: Biển báo có hình chiếc điện thoại gạch chéo',
        problem: 'What does this sign mean? (A sign showing a mobile phone with a red line through it)',
        solution: 'Đáp án: "You must not use your mobile phone here." (Không được sử dụng điện thoại di động tại khu vực này).',
        tip: 'Chú ý phân biệt biển cấm (must not) và biển hướng dẫn tùy chọn (don\'t have to).'
      }
    ],
    exercises: [
      {
        id: 'sn-1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'A sign at the library says: "PLEASE KEEP SILENCE". What does it mean?',
        options: [
          'You are not allowed to make noise here.',
          'You must listen to music quietly.',
          'You can speak loudly in emergencies.',
          'You should bring food and drinks.'
        ],
        correctAnswer: 'You are not allowed to make noise here.',
        explanation: '"Keep silence" nghĩa là giữ trật tự, yên lặng, không được làm ồn trong thư viện.'
      }
    ],
    isTrending: true,
    hcmFocus: true
  }
];

export const ALL_TOPICS = TOPICS_DATA;
