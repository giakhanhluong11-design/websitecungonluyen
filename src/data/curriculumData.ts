// Curriculum Course Map, 16-Week Roadmap, and Checklist Data
// Bám sát Chương trình GDPT 2018 - Bộ sách "Kết nối tri thức với cuộc sống"
// Chuẩn bị ôn thi Tuyển sinh vào Lớp 10 (3 môn: Toán, Ngữ văn, Tiếng Anh)

export interface CourseModule {
  id: string;
  code: string; // T1, T2... V1, V2... A1, A2...
  subjectId: 'toan' | 'van' | 'anh';
  chapter: string;
  title: string;
  description: string;
  examPriority: 'rat-quan-trong' | 'quan-trong' | 'nen-biet' | 'mo-rong'; // 🔴, 🟠, 🟡, 🟢
  isTop20PercentCore?: boolean; // Nằm trong "20% kiến thức quan trọng nhất"
  phase: 1 | 2 | 3 | 4; // 4 Giai đoạn: 1. Củng cố, 2. Chuyên đề, 3. Luyện đề, 4. Nước rút
  subtopics: string[];
  sampleQuestionPattern: string;
  mistakesToAvoid: string[];
  localNotice?: string; // e.g. "Nội dung này có thể thay đổi tùy địa phương/kỳ thi."
}

export interface RoadmapWeek {
  week: number;
  phase: number;
  phaseTitle: string;
  title: string;
  focusToan: string;
  focusVan: string;
  focusAnh: string;
  goals: string[];
}

export const COURSE_MODULES_DATA: CourseModule[] = [
  // ========================== TOÁN HỌC (T1 -> T10) ==========================
  // A. ĐẠI SỐ
  {
    id: 'toan-t1-can-thuc',
    code: 'T1',
    subjectId: 'toan',
    chapter: 'Chương 1: Căn bậc hai và căn bậc ba',
    title: 'Căn bậc hai và căn thức',
    description: 'Điều kiện xác định, hằng đẳng thức √(A²) = |A|, trục căn thức, rút gọn biểu thức, tính giá trị và GTLN/GTNN.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Khái niệm căn bậc hai số học và căn bậc ba',
      'Điều kiện xác định để căn thức có nghĩa: √(A) xác định ⇔ A ≥ 0',
      'Hằng đẳng thức √(A²) = |A| và phá dấu giá trị tuyệt đối',
      'Các phép biến đổi căn thức: đưa thừa số vào trong/ra ngoài dấu căn',
      'Trục căn thức ở mẫu bằng lượng liên hợp',
      'Rút gọn biểu thức chứa căn và bài toán phụ (tính giá trị, so sánh, GTLN/GTNN)'
    ],
    sampleQuestionPattern: 'Câu 1 trong đề thi tuyển sinh (0.75 - 1.0 điểm): Rút gọn P và tìm x để P < 1/2.',
    mistakesToAvoid: [
      'Quên tìm ĐKXĐ hoặc không đối chiếu ĐKXĐ sau khi tìm ra x',
      'Bỏ qua dấu giá trị tuyệt đối khi khai căn: viết √(A²) = A thay vì |A|',
      'Đổi dấu sai khi nhân lượng liên hợp (A - B)'
    ]
  },
  {
    id: 'toan-t2-phuong-trinh',
    code: 'T2',
    subjectId: 'toan',
    chapter: 'Chương 2: Phương trình và bất phương trình',
    title: 'Phương trình và phương trình quy về',
    description: 'Phương trình bậc nhất, phương trình chứa ẩn ở mẫu, phương trình tích, phương trình vô tỉ cơ bản.',
    examPriority: 'quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Phương trình bậc nhất một ẩn và cách giải cơ bản',
      'Phương trình chứa ẩn ở mẫu thức: tìm MTC, quy đồng, khử mẫu, thử lại nghiệm',
      'Phương trình tích: A(x).B(x) = 0 ⇔ A(x) = 0 hoặc B(x) = 0',
      'Phương trình chứa căn bậc hai dạng cơ bản: √(f(x)) = g(x) ⇔ {g(x) ≥ 0, f(x) = [g(x)]²}',
      'Điều kiện xác định và thao tác loại nghiệm ngoại lai'
    ],
    sampleQuestionPattern: 'Giải phương trình chứa căn hoặc ẩn ở mẫu, tìm nghiệm nguyên.',
    mistakesToAvoid: [
      'Quên đặt điều kiện g(x) ≥ 0 trước khi bình phương 2 vế',
      'Khử mẫu mà không dùng dấu suy ra (⇒) dẫn đến kết luận nhầm nghiệm ngoại lai'
    ]
  },
  {
    id: 'toan-t3-he-phuong-trinh',
    code: 'T3',
    subjectId: 'toan',
    chapter: 'Chương 3: Hệ hai phương trình bậc nhất hai ẩn',
    title: 'Hệ phương trình & Bài toán thực tế bằng hệ',
    description: 'Phương pháp thế, cộng đại số, hệ chứa tham số m, giải bài toán bằng cách lập hệ phương trình.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Khái niệm nghiệm của hệ phương trình bậc nhất hai ẩn',
      'Phương pháp thế: biểu diễn một ẩn theo ẩn còn lại',
      'Phương pháp cộng đại số: cân bằng hệ số và cộng/trừ triệt tiêu',
      'Hệ phương trình có tham số m ở mức phù hợp thi vào 10 (tìm m để hệ có nghiệm duy nhất thỏa mãn x + y = k)',
      'Giải bài toán bằng cách lập hệ phương trình: toán chuyển động, năng suất, phần trăm, hình học thực tế'
    ],
    sampleQuestionPattern: 'Bài 2 hoặc 3 (1.0 - 1.5 điểm): Giải hệ hoặc giải bài toán thực tế thực tế kinh tế/năng suất.',
    mistakesToAvoid: [
      'Nhầm dấu âm khi trừ vế theo vế trong phương pháp cộng',
      'Không đặt điều kiện và đơn vị cho ẩn số trong bài toán thực tế (ví dụ: x > 0, x nguyên)'
    ]
  },
  {
    id: 'toan-t4-ham-so-do-thi',
    code: 'T4',
    subjectId: 'toan',
    chapter: 'Chương 4: Hàm số và đồ thị',
    title: 'Hàm số bậc nhất & Parabol y = ax²',
    description: 'Hàm số y = ax + b, đồ thị Parabol (P): y = ax², tương giao giữa đường thẳng và parabol, bài toán thực tế.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Tính chất đồng biến, nghịch biến của hàm số y = ax + b (a > 0 đồng biến, a < 0 nghịch biến)',
      'Vị trí tương đối của hai đường thẳng (song song, cắt nhau, trùng nhau, vuông góc khi a.a\' = -1)',
      'Đồ thị hàm số y = ax² (a ≠ 0): đỉnh O(0,0), trục đối xứng Oy, bảng giá trị đối xứng',
      'Phương trình hoành độ giao điểm giữa (d) và (P): ax² - mx - n = 0',
      'Ứng dụng hàm số mô hình hóa bài toán thực tế (giá cước taxi, tiền điện nước, chi phí dịch vụ)'
    ],
    sampleQuestionPattern: 'Bài toán đồ thị Parabol (P) và đường thẳng (d), tìm tọa độ giao điểm (1.5 điểm).',
    mistakesToAvoid: [
      'Lấy thiếu bảng giá trị đối xứng của Parabol (phải lấy ít nhất 5 điểm)',
      'Quên ghi tên đồ thị, gốc tọa độ O, mũi tên Ox, Oy trên hệ trục'
    ]
  },
  {
    id: 'toan-t5-phuong-trinh-bac-hai-viet',
    code: 'T5',
    subjectId: 'toan',
    chapter: 'Chương 5: Phương trình bậc hai một ẩn',
    title: 'Phương trình bậc hai & Định lý Viète',
    description: 'Dạng tổng quát ax² + bx + c = 0, biệt thức Δ và Δ\', hệ thức Viète, tìm tham số m thỏa biểu thức nghiệm.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Công thức nghiệm: Δ = b² - 4ac (Δ > 0: 2 nghiệm pb, Δ = 0: nghiệm kép, Δ < 0: vô nghiệm)',
      'Công thức nghiệm thu gọn Δ\' = (b\')² - ac (khi b chẵn)',
      'Định lý Viète: S = x1 + x2 = -b/a, P = x1.x2 = c/a',
      'Các biểu thức đối xứng cơ bản: x1² + x2² = S² - 2P, (x1 - x2)² = S² - 4P, x1³ + x2³ = S(S² - 3P)',
      'Tìm điều kiện của m để phương trình có 2 nghiệm thỏa mãn hệ thức không đối xứng',
      'Trường hợp a chứa tham số m: phải xét a ≠ 0 để là phương trình bậc hai'
    ],
    sampleQuestionPattern: 'Cho pt ax² + bx + c = 0. Tìm m để pt có 2 nghiệm phân biệt thỏa x1² + x2² - 3x1x2 = 5.',
    mistakesToAvoid: [
      'Quên đặt điều kiện Δ ≥ 0 (hoặc Δ > 0) trước khi áp dụng hệ thức Viète',
      'Quên xét điều kiện hệ số a ≠ 0 khi a chứa tham số'
    ]
  },
  {
    id: 'toan-t6-bat-dang-thuc-cuc-tri',
    code: 'T6',
    subjectId: 'toan',
    chapter: 'Chương 6: Bất đẳng thức và giá trị lớn nhất, nhỏ nhất',
    title: 'Bất đẳng thức & Bài toán cực trị phân loại 10 điểm',
    description: 'BĐT Cauchy (AM-GM), BĐT Bunhiacopxki dạng phân thức cơ bản, phương pháp biến đổi tương đương.',
    examPriority: 'mo-rong',
    isTop20PercentCore: false,
    phase: 4,
    subtopics: [
      'Bất đẳng thức Cauchy (AM-GM) cho 2 số không âm: a + b ≥ 2√(ab), dấu "=" khi a = b',
      'Kỹ thuật thêm bớt, cô-si ngược dấu',
      'Phương pháp biến đổi tương đương đưa về dạng bình phương một tổng/hiệu ≥ 0',
      'Tìm GTLN, GTNN của biểu thức đại số chứa căn thức hoặc phân thức'
    ],
    sampleQuestionPattern: 'Câu phân loại điểm 9.5 - 10 (0.5 điểm cuối cùng).',
    mistakesToAvoid: [
      'Dùng Cauchy khi các biến chưa được chứng minh là số không âm',
      'Quên chỉ ra dấu "=" xảy ra khi nào'
    ]
  },
  // B. HÌNH HỌC
  {
    id: 'toan-t7-he-thuc-luong',
    code: 'T7',
    subjectId: 'toan',
    chapter: 'Chương 7: Hệ thức lượng trong tam giác vuông',
    title: 'Hệ thức lượng & Tỉ số lượng giác',
    description: 'Các hệ thức về cạnh và đường cao, định nghĩa sin, cos, tan, cot và ứng dụng giải tam giác, toán thực tế đo bóng đo tháp.',
    examPriority: 'quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Định lý Pythagoras: a² = b² + c²',
      'Hệ thức đường cao và hình chiếu: b² = a.b\', c² = a.c\', h² = b\'.c\', b.c = a.h, 1/h² = 1/b² + 1/c²',
      'Tỉ số lượng giác góc nhọn: sin = đối/huyền, cos = kề/huyền, tan = đối/kề, cot = kề/đối',
      'Tính chất lượng giác 2 góc phụ nhau: sin α = cos(90° - α), tan α = cot(90° - α)',
      'Bài toán thực tế: đo chiều cao ngọn hải đăng/cây cối bằng bóng râm và giác kế'
    ],
    sampleQuestionPattern: 'Tính chiều cao tòa tháp hoặc khoảng cách tàu thuyền qua góc ngắm (0.75 - 1.0 điểm).',
    mistakesToAvoid: [
      'Dùng nhầm cạnh kề và cạnh đối khi tính sin/cos',
      'Quên để máy tính ở chế độ độ (DEG) khi bấm giá trị góc'
    ]
  },
  {
    id: 'toan-t8-duong-tron-tiep-tuyen',
    code: 'T8',
    subjectId: 'toan',
    chapter: 'Chương 8: Đường tròn và các góc liên quan',
    title: 'Đường tròn, Tiếp tuyến & Góc với đường tròn',
    description: 'Vị trí tương đối, tính chất hai tiếp tuyến cắt nhau, góc ở tâm, góc nội tiếp, góc tạo bởi tia tiếp tuyến và dây cung.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Sự xác định đường tròn, đường kính vuông góc với dây cung thì đi qua trung điểm của dây',
      'Dấu hiệu nhận biết tiếp tuyến và tính chất hai tiếp tuyến cắt nhau (đoạn nối tâm là phân giác, vuông góc dây nối 2 tiếp điểm)',
      'Góc ở tâm có số đo bằng số đo cung bị chắn',
      'Góc nội tiếp có số đo bằng nửa số đo cung bị chắn (hai góc nội tiếp cùng chắn một cung thì bằng nhau)',
      'Góc tạo bởi tiếp tuyến và dây cung'
    ],
    sampleQuestionPattern: 'Ý a, b của bài hình tổng hợp: chứng minh tiếp tuyến, chứng minh các góc bằng nhau.',
    mistakesToAvoid: [
      'Không giải thích rõ các góc bằng nhau là do cùng chắn một cung hay cùng phụ góc nào',
      'Vẽ hình sai quy cách dẫn đến sai toàn bộ bài chứng minh'
    ]
  },
  {
    id: 'toan-t9-tu-giac-noi-tiep-tong-hop',
    code: 'T9',
    subjectId: 'toan',
    chapter: 'Chương 9: Tứ giác nội tiếp & Hình tổng hợp',
    title: 'Tứ giác nội tiếp & Bài toán hình học tổng hợp',
    description: '4 dấu hiệu chứng minh tứ giác nội tiếp, tam giác đồng dạng, tích các đoạn thẳng, chứng minh thẳng hàng/đồng quy.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Dấu hiệu 1: Tứ giác có tổng hai góc đối diện bằng 180°',
      'Dấu hiệu 2: Tứ giác có hai đỉnh kề nhau cùng nhìn cạnh chứa hai đỉnh còn lại dưới một góc bằng nhau',
      'Dấu hiệu 3: Tứ giác có góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện',
      'Dấu hiệu 4: Tứ giác có 4 đỉnh cách đều một điểm',
      'Hệ quả: Các tam giác đồng dạng suy ra đẳng thức tích a.b = c.d',
      'Các bài toán nâng cao: chứng minh 3 điểm thẳng hàng, 3 đường thẳng đồng quy, đường thẳng cố định'
    ],
    sampleQuestionPattern: 'Bài hình học lớn (3.0 điểm): Câu a (nội tiếp), Câu b (đẳng thức tích), Câu c (cực trị/thẳng hàng).',
    mistakesToAvoid: [
      'Ghi nhầm đỉnh tương ứng khi suy ra tam giác đồng dạng',
      'Nhầm lẫn giữa 2 đỉnh đối diện (tổng 180°) và 2 đỉnh kề nhau (cùng nhìn một cạnh)'
    ]
  },
  {
    id: 'toan-t10-hinh-khong-gian',
    code: 'T10',
    subjectId: 'toan',
    chapter: 'Chương 10: Hình học không gian thực tế',
    title: 'Hình trụ, Hình nón, Hình cầu & Thể tích thực tế',
    description: 'Công thức diện tích xung quanh, toàn phần và thể tích của hình trụ, hình nón, hình cầu gắn liền với đồ vật thực tế.',
    examPriority: 'quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Hình trụ: S_xq = 2πRh, S_tp = 2πRh + 2πR², V = πR²h',
      'Hình nón: Đường sinh l² = h² + R², S_xq = πRl, V = (1/3)πR²h',
      'Hình cầu: S_mặt cầu = 4πR², V = (4/3)πR³',
      'Ứng dụng tính lượng nước trong bình, khối lượng kim loại, thùng phuy, nón lá, quả bóng'
    ],
    sampleQuestionPattern: 'Bài toán thực tế tính dung tích bể nước, diện tích vải may lều (0.75 - 1.0 điểm).',
    mistakesToAvoid: [
      'Quên chia 3 trong công thức thể tích hình nón: V = (1/3)πR²h',
      'Nhầm lẫn giữa bán kính R và đường kính d (d = 2R)',
      'Làm tròn số sai yêu cầu đề bài (làm tròn đến chữ số thập phân thứ nhất/thứ hai)'
    ]
  },

  // ========================== NGỮ VĂN (V1 -> V6) ==========================
  {
    id: 'van-v1-doc-hieu-nghe-thuat',
    code: 'V1',
    subjectId: 'van',
    chapter: 'Phần I: Kỹ năng Đọc hiểu văn bản',
    title: 'Kỹ năng Đọc hiểu & Nhận diện thể loại',
    description: 'Xác định phương thức biểu đạt, thể loại thơ/truyện, ngôi kể, điểm nhìn, đề tài, chủ đề và thông điệp của văn bản.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      '6 phương thức biểu đạt: Tự sự, Miêu tả, Biểu cảm, Nghị luận, Thuyết minh, Hành chính công vụ',
      'Thể loại: Thơ tự do, thơ lục bát, truyện ngắn, tùy bút, ký',
      'Ngôi kể: Ngôi thứ nhất (nhân vật "tôi" chân thực, giàu cảm xúc), Ngôi thứ ba (bao quát, khách quan)',
      'Xác định thông điệp ý nghĩa nhất mà tác giả muốn gửi gắm tới người đọc',
      'Kỹ thuật trả lời câu hỏi đọc hiểu: Viết câu hoàn chỉnh, trích dẫn chi tiết trong ngữ liệu'
    ],
    sampleQuestionPattern: 'Phần Đọc hiểu đề thi tuyển sinh (3.0 điểm): Câu 1-4 hỏi PTBĐ, chi tiết, thông điệp.',
    mistakesToAvoid: [
      'Trả lời cộc lốc bằng 1 từ, không lập thành câu hoàn chỉnh',
      'Chép lại toàn bộ đoạn văn thay vì chọn lọc từ khóa cô đọng'
    ]
  },
  {
    id: 'van-v2-tieng-viet-tu-tu',
    code: 'V2',
    subjectId: 'van',
    chapter: 'Phần II: Tiếng Việt trong văn cảnh',
    title: 'Biện pháp tu từ & Công thức phân tích 5 bước',
    description: 'So sánh, nhân hóa, ẩn dụ, hoán dụ, điệp từ/ngữ, liệt kê, nói quá, nói giảm nói tránh, câu hỏi tu từ.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Hệ thống biện pháp tu từ từ vựng và cú pháp',
      'Phân biệt Ẩn dụ (dựa trên nét tương đồng ngầm) và Hoán dụ (dựa trên nét tương cận gắn bó)',
      'Công thức trả lời 5 bước bắt buộc: Chỉ rõ biện pháp → Nêu từ ngữ biểu hiện → Tác dụng tạo nhịp điệu/hình thức → Tác dụng làm nổi bật nội dung/hình ảnh → Bộc lộ tình cảm/thông điệp của tác giả',
      'Nghĩa của từ, thành phần biệt lập (tình thái, cảm thán, gọi - đáp, phụ chú), liên kết câu và liên kết đoạn'
    ],
    sampleQuestionPattern: 'Chỉ ra và nêu tác dụng của biện pháp tu từ trong câu văn/câu thơ sau (1.0 điểm).',
    mistakesToAvoid: [
      'Chỉ nêu tên biện pháp tu từ mà không chỉ ra từ ngữ thể hiện trong văn bản',
      'Viết tác dụng chung chung ("làm cho câu văn thêm sinh động") mà không gắn với nội dung cụ thể'
    ]
  },
  {
    id: 'van-v3-nghi-luan-xa-hoi-tu-tuong',
    code: 'V3',
    subjectId: 'van',
    chapter: 'Phần III: Nghị luận xã hội',
    title: 'Nghị luận xã hội về Tư tưởng đạo lý',
    description: 'Nghị lực, ý chí, lòng biết ơn, tình yêu thương, sự kiên trì, bản lĩnh, tinh thần tự học, trách nhiệm bản thân.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Cấu trúc đoạn văn/bài văn nghị luận xã hội (khoảng 200 chữ hoặc 1 trang giấy thi)',
      'Bước 1: Giải thích khái niệm, từ ngữ then chốt trong đề bài',
      'Bước 2: Phân tích và chứng minh biểu hiện trong đời sống (kèm dẫn chứng thực tế, người thật việc thật)',
      'Bước 3: Bàn luận mở rộng, lật lại vấn đề (phản biện những người sống ích kỷ, thiếu ý chí)',
      'Bước 4: Bài học nhận thức và hành động thiết thực cho học sinh'
    ],
    sampleQuestionPattern: 'Viết đoạn văn khoảng 200 chữ bàn về ý nghĩa của sự kiên trì trong cuộc sống (2.0 điểm).',
    mistakesToAvoid: [
      'Viết thành bài văn dài quá quy định thay vì đoạn văn khoảng 200 chữ (nếu đề yêu cầu đoạn văn)',
      'Dẫn chứng sáo rỗng, xa rời thực tế hoặc chỉ liệt kê tên danh nhân mà không phân tích hành động'
    ]
  },
  {
    id: 'van-v4-nghi-luan-xa-hoi-hien-tuong',
    code: 'V4',
    subjectId: 'van',
    chapter: 'Phần III: Nghị luận xã hội',
    title: 'Nghị luận về Hiện tượng đời sống & Giới trẻ',
    description: 'Mạng xã hội, bạo lực học đường, biến đổi khí hậu, lối sống ảo, văn hóa ứng xử, tự chủ công nghệ.',
    examPriority: 'quan-trong',
    isTop20PercentCore: false,
    phase: 2,
    subtopics: [
      'Nêu thực trạng hiện tượng đời sống đang diễn ra',
      'Chỉ ra nguyên nhân khách quan (gia đình, xã hội) và chủ quan (ý thức cá nhân)',
      'Đánh giá hậu quả hoặc tác động tích cực',
      'Đề xuất giải pháp đồng bộ và hành động của bản thân'
    ],
    sampleQuestionPattern: 'Viết bài văn nghị luận ngắn bàn về hiện tượng lạm dụng mạng xã hội của giới trẻ hiện nay.',
    mistakesToAvoid: [
      'Chỉ mải mê kể lể hiện tượng mà thiếu phần phân tích nguyên nhân và giải pháp'
    ]
  },
  {
    id: 'van-v5-nghi-luan-van-hoc-tho',
    code: 'V5',
    subjectId: 'van',
    chapter: 'Phần IV: Nghị luận văn học (Kết nối tri thức)',
    title: 'Nghị luận tác phẩm Thơ & Nguyện vọng lớp 9',
    description: 'Đặc trưng thể loại thơ trữ tình, hệ thống hình ảnh, mạch cảm xúc, giọng điệu, biện pháp tu từ.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Nguyên tắc không học thuộc văn mẫu: phân tích hình ảnh, cảm xúc qua từ ngữ then chốt',
      'Cách phân tích thơ: Cắt nghĩa từ ngữ/hình ảnh → Bóc tách biện pháp nghệ thuật → Khái quát tư tưởng tác giả',
      'Bố cục bài nghị luận thơ: Mở bài (dẫn dắt, tác giả, tác phẩm, trích thơ), Thân bài (các luận điểm theo khổ thơ hoặc mạch cảm xúc), Kết bài (đánh giá thành công nghệ thuật và dư ba cảm xúc)'
    ],
    sampleQuestionPattern: 'Phân tích đoạn trích thơ hoặc cảm nhận vẻ đẹp tâm hồn nhân vật trong thi phẩm (4.0 - 5.0 điểm).',
    mistakesToAvoid: [
      'Diễn xuôi lại bài thơ thay vì phân tích nghệ thuật ngôn từ và hình tượng'
    ],
    localNotice: 'Nội dung tác phẩm văn học cụ thể có thể thay đổi tùy địa phương hoặc đề tuyển sinh từng năm.'
  },
  {
    id: 'van-v6-nghi-luan-van-hoc-truyen',
    code: 'V6',
    subjectId: 'van',
    chapter: 'Phần IV: Nghị luận văn học (Kết nối tri thức)',
    title: 'Nghị luận tác phẩm Truyện ngắn',
    description: 'Phân tích nhân vật, tình huống truyện, chi tiết nghệ thuật đắt giá, xung đột và thông điệp nhân đạo.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Tình huống truyện: hoàn cảnh đặc biệt làm bộc lộ tính cách và phẩm chất nhân vật',
      'Nghệ thuật xây dựng nhân vật: ngoại hình, hành động, lời thoại, độc thoại nội tâm',
      'Ý nghĩa của các chi tiết nghệ thuật then chốt mang tính biểu tượng',
      'Khái quát giá trị hiện thực và giá trị nhân đạo sâu sắc của tác phẩm'
    ],
    sampleQuestionPattern: 'Cảm nhận về nhân vật chính trong một truyện ngắn chương trình Ngữ văn 9.',
    mistakesToAvoid: [
      'Kể lại toàn bộ cốt truyện mà không tập trung phân tích phẩm chất, tính cách nhân vật'
    ],
    localNotice: 'Nội dung tác phẩm truyện có thể linh hoạt theo chương trình Ngữ văn 9 mới của địa phương.'
  },

  // ========================== TIẾNG ANH (A1 -> A8) ==========================
  {
    id: 'anh-a1-thi-dong-tu',
    code: 'A1',
    subjectId: 'anh',
    chapter: 'Chuyên đề 1: Hệ thống thì động từ cốt lõi',
    title: 'Tenses: Hiện tại, Quá khứ, Tương lai & Hoàn thành',
    description: 'Present Simple, Present Continuous, Present Perfect, Past Simple, Past Continuous, Future Simple, Be going to.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Hiện tại đơn (S + V(s/es)) & Hiện tại tiếp diễn (S + is/am/are + V-ing)',
      'Hiện tại hoàn thành (S + have/has + V3/ed) với since, for, already, yet, just, recently, ever, never',
      'Quá khứ đơn (S + V2/ed) & Quá khứ tiếp diễn (S + was/were + V-ing) với cấu trúc When/While',
      'Tương lai đơn (will + V-inf) & Tương lai gần (be going to + V-inf)',
      'Sự phối hợp thì trong câu kể và mệnh đề thời gian (As soon as, until, by the time)'
    ],
    sampleQuestionPattern: 'Chia động từ trong ngoặc hoặc chọn đáp án đúng A, B, C, D.',
    mistakesToAvoid: [
      'Quên chia thì quá khứ hoàn thành hoặc quá khứ đơn khi có "by the time" hoặc "before/after"',
      'Nhầm lẫn giữa Since (mốc thời gian) và For (khoảng thời gian)'
    ]
  },
  {
    id: 'anh-a2-cau-bi-dong',
    code: 'A2',
    subjectId: 'anh',
    chapter: 'Chuyên đề 2: Câu bị động & Câu ước',
    title: 'Passive Voice & Wish Sentences',
    description: 'Chuyển đổi câu bị động mọi thì, bị động với động từ khuyết thiếu (modal verbs), cấu trúc Wish ở hiện tại và quá khứ.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Quy tắc chuyển chủ động sang bị động: S + be + V3/ed (+ by O)',
      'Bị động với Modal verbs: S + can/could/must/should + be + V3/ed',
      'Bị động với động từ chỉ ý kiến (people say that...): It is said that... / S + is said to V...',
      'Câu ước ở tương lai: S + wish + S + would/could + V-inf',
      'Câu ước ở hiện tại (trái thực tế): S + wish + S + V2/ed (be -> were cho mọi ngôi)'
    ],
    sampleQuestionPattern: 'Viết lại câu hoàn chỉnh (Sentence transformation) không đổi nghĩa.',
    mistakesToAvoid: [
      'Quên lùi thì trong câu Wish ở hiện tại',
      'Dùng was thay vì were trong câu wish trang trọng'
    ]
  },
  {
    id: 'anh-a3-cau-dieu-kien',
    code: 'A3',
    subjectId: 'anh',
    chapter: 'Chuyên đề 3: Câu điều kiện',
    title: 'Conditional Sentences Type 1 & 2',
    description: 'Câu điều kiện loại 1 (có thể xảy ra ở hiện tại/tương lai), loại 2 (giả định trái ngược thực tế hiện tại), Unless = If not.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Loại 1: If + S + V(hiện tại đơn), S + will/can/must + V-inf',
      'Loại 2: If + S + V2/ed (were), S + would/could + V-inf',
      'Chuyển đổi Unless = If ... not (chú ý bỏ trợ động từ do/does/did)',
      'Lời khuyên với If I were you, I would...'
    ],
    sampleQuestionPattern: 'Viết lại câu: "Study hard or you will fail" -> "If you don\'t study hard..."',
    mistakesToAvoid: [
      'Dùng will/would ngay sau mệnh đề If',
      'Quên đổi thể phủ định sang khẳng định khi dùng Unless'
    ]
  },
  {
    id: 'anh-a4-cau-tuong-thuat',
    code: 'A4',
    subjectId: 'anh',
    chapter: 'Chuyên đề 4: Câu gián tiếp',
    title: 'Reported Speech: Statements, Questions, Requests',
    description: 'Quy tắc lùi thì, chuyển đổi đại từ, chuyển đổi trạng từ chỉ thời gian và nơi chốn, câu trần thuật và câu hỏi Wh-/Yes-No.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Quy tắc lùi thì: Hiện tại đơn -> Quá khứ đơn, Hiện tại tiếp diễn -> Quá khứ tiếp diễn, v.v.',
      'Đổi trạng từ: today -> that day, yesterday -> the day before, now -> then, here -> there, this -> that',
      'Câu hỏi Yes/No: S + asked + (O) + if / whether + S + V(lùi thì)',
      'Câu hỏi Wh-questions: S + asked + (O) + wh-word + S + V(lùi thì)',
      'Câu mệnh lệnh: S + told/asked + O + to V / not to V'
    ],
    sampleQuestionPattern: 'Viết lại câu từ trực tiếp sang gián tiếp (0.5 điểm bài tự luận viết lại câu).',
    mistakesToAvoid: [
      'Vẫn đảo trợ động từ lên trước chủ ngữ trong câu hỏi gián tiếp (phải viết dạng khẳng định S + V)',
      'Quên đổi trạng từ chỉ thời gian như yesterday hay tomorrow'
    ]
  },
  {
    id: 'anh-a5-menh-de-quan-he',
    code: 'A5',
    subjectId: 'anh',
    chapter: 'Chuyên đề 5: Mệnh đề quan hệ',
    title: 'Relative Clauses: Who, Whom, Which, That, Whose',
    description: 'Đại từ quan hệ, phân biệt mệnh đề xác định và không xác định, dấu phẩy và rút gọn mệnh đề quan hệ.',
    examPriority: 'quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Who: thay thế cho danh từ chỉ người làm chủ ngữ',
      'Whom: thay thế cho danh từ chỉ người làm tân ngữ',
      'Which: thay thế cho danh từ chỉ vật làm chủ ngữ hoặc tân ngữ',
      'That: thay thế cho cả người và vật trong mệnh đề xác định (không dùng sau dấu phẩy và giới từ)',
      'Whose: chỉ sở hữu, đứng trước một danh từ',
      'Mệnh đề không xác định (có dấu phẩy) bổ nghĩa cho danh từ riêng hoặc danh từ xác định'
    ],
    sampleQuestionPattern: 'Nối hai câu đơn thành một câu phức có sử dụng đại từ quan hệ phù hợp.',
    mistakesToAvoid: [
      'Dùng that sau dấu phẩy trong mệnh đề không xác định',
      'Bỏ sót danh từ bị sở hữu khi dùng whose'
    ]
  },
  {
    id: 'anh-a6-tu-loai-word-form',
    code: 'A6',
    subjectId: 'anh',
    chapter: 'Chuyên đề 6: Cấu tạo từ & Word Form',
    title: 'Word Formation: Noun, Verb, Adjective, Adverb',
    description: 'Xác định vị trí từ loại trong câu, các tiền tố (un-, im-, dis-), hậu tố (-ment, -tion, -ful, -less, -ly).',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 2,
    subtopics: [
      'Quy tắc xác định vị trí danh từ: sau mạo từ (a/an/the), tính từ, tính từ sở hữu, giới từ',
      'Quy tắc xác định vị trí tính từ: trước danh từ, sau to be, linking verbs (look, seem, feel)',
      'Quy tắc xác định vị trí trạng từ: bổ nghĩa cho động từ thường, tính từ, hoặc đứng đầu câu',
      'Bảng Word Form các chủ đề trọng tâm lớp 9: Environment, Science & Technology, Community, Media'
    ],
    sampleQuestionPattern: 'Dạng bài Word Form cho từ trong ngoặc (1.5 điểm cực kỳ phổ biến trong đề thi tuyển sinh).',
    mistakesToAvoid: [
      'Chỉ tìm đúng loại từ (ví dụ tính từ) nhưng quên xét nghĩa phủ định cần thêm tiền tố (un-, dis-, in-)',
      'Viết sai chính tả khi biến đổi đuôi từ (ví dụ: satisfy -> satisfaction)'
    ]
  },
  {
    id: 'anh-a7-phat-am-trong-am',
    code: 'A7',
    subjectId: 'anh',
    chapter: 'Chuyên đề 7: Ngữ âm & Trọng âm',
    title: 'Pronunciation (-ed, -s/es) & Stress Rules',
    description: 'Quy tắc phát âm đuôi -ed (/t/, /d/, /ɪd/), đuôi -s/es (/s/, /z/, /ɪz/), quy tắc trọng âm từ 2 và 3 âm tiết.',
    examPriority: 'quan-trong',
    isTop20PercentCore: true,
    phase: 1,
    subtopics: [
      'Phát âm đuôi -ed: /ɪd/ sau t, d; /t/ sau âm vô thanh (p, k, f, s, sh, ch); /d/ trường hợp còn lại',
      'Phát âm đuôi -s/es: /s/ sau âm vô thanh (p, k, t, f, th); /ɪz/ sau âm gió (s, x, z, ch, sh, ge); /z/ trường hợp còn lại',
      'Quy tắc trọng âm từ 2 âm tiết: danh từ và tính từ thường nhấn âm 1, động từ thường nhấn âm 2',
      'Quy tắc trọng âm từ có đuôi: -tion, -sion, -ic, -ical nhấn trước đuôi 1 âm tiết'
    ],
    sampleQuestionPattern: '4 câu trắc nghiệm đầu tiên trong đề thi (1.0 điểm): 2 câu phát âm, 2 câu trọng âm.',
    mistakesToAvoid: [
      'Nhầm lẫn giữa nguyên âm ngắn và nguyên âm dài',
      'Không nhớ các từ ngoại lệ (ví dụ: record, permit vừa là danh từ vừa là động từ)'
    ]
  },
  {
    id: 'anh-a8-ky-nang-doc-hieu-dien-tu',
    code: 'A8',
    subjectId: 'anh',
    chapter: 'Chuyên đề 8: Đọc hiểu & Điền từ',
    title: 'Reading Comprehension & Cloze Test',
    description: 'Chiến thuật tìm ý chính (skimming), tìm thông tin chi tiết (scanning), đoán nghĩa từ vựng qua ngữ cảnh.',
    examPriority: 'rat-quan-trong',
    isTop20PercentCore: true,
    phase: 3,
    subtopics: [
      'Bài điền từ vào đoạn văn (Cloze test): phân tích ngữ pháp trước - sau chỗ trống và collocation',
      'Bài đọc hiểu văn bản: Đọc câu hỏi trước để xác định từ khóa (keywords)',
      'Kỹ thuật trả lời câu True/False hoặc trắc nghiệm A, B, C, D',
      'Câu hỏi đại từ quy chiếu: "The word \'they\' in line 3 refers to..."'
    ],
    sampleQuestionPattern: 'Bài đọc hiểu 1.5 - 2.0 điểm trong cấu trúc đề thi tuyển sinh 10.',
    mistakesToAvoid: [
      'Đọc từng chữ một dẫn đến không kịp thời gian làm bài',
      'Chọn đáp án dựa trên suy đoán chủ quan thay vì dựa vào chứng cứ trong văn bản'
    ]
  }
];

// 16-WEEK ROADMAP
export const ROADMAP_16_WEEKS: RoadmapWeek[] = [
  {
    week: 1,
    phase: 1,
    phaseTitle: 'Giai đoạn 1: Củng cố kiến thức lớp 9',
    title: 'Nền tảng Đại số, Đọc hiểu & Ngữ âm cốt lõi',
    focusToan: 'T1: Căn bậc hai, điều kiện xác định, hằng đẳng thức √(A²) = |A|',
    focusVan: 'V1: Phương thức biểu đạt, ngôi kể, thể loại và kỹ năng đọc hiểu',
    focusAnh: 'A7: Quy tắc phát âm đuôi -ed, -s/es và trọng âm từ 2 âm tiết',
    goals: [
      'Nắm chắc ĐKXĐ của căn thức, không bị nhầm dấu giá trị tuyệt đối',
      'Trả lời câu hỏi đọc hiểu thành câu hoàn chỉnh',
      'Thuộc lòng quy tắc phát âm -ed và -s/es đạt 100% độ chính xác'
    ]
  },
  {
    week: 2,
    phase: 1,
    phaseTitle: 'Giai đoạn 1: Củng cố kiến thức lớp 9',
    title: 'Biến đổi biểu thức, Biện pháp tu từ & Thì động từ',
    focusToan: 'T1: Trục căn thức, rút gọn phân thức chứa căn bậc hai',
    focusVan: 'V2: Công thức 5 bước phân tích biện pháp tu từ (so sánh, ẩn dụ, hoán dụ)',
    focusAnh: 'A1: Thì hiện tại đơn, tiếp diễn, hiện tại hoàn thành (since/for)',
    goals: [
      'Thành thạo rút gọn biểu thức bài 1 không bị sót điều kiện',
      'Áp dụng nhuần nhuyễn công thức 5 bước khi phân tích BPTT',
      'Phân biệt chính xác hiện tại hoàn thành và quá khứ đơn'
    ]
  },
  {
    week: 3,
    phase: 1,
    phaseTitle: 'Giai đoạn 1: Củng cố kiến thức lớp 9',
    title: 'Phương trình, Câu bị động & Hệ thức lượng tam giác',
    focusToan: 'T2: Phương trình chứa ẩn ở mẫu & T7: Hệ thức lượng trong tam giác vuông',
    focusVan: 'V2: Thành phần biệt lập trong câu, liên kết câu và đoạn văn',
    focusAnh: 'A2: Câu bị động các thì và bị động với Modal verbs',
    goals: [
      'Giải chuẩn phương trình ẩn ở mẫu và phương trình tích',
      'Tính chính xác độ dài cạnh, đường cao và tỉ số sin/cos trong tam giác vuông',
      'Viết lại câu bị động chuẩn cấu trúc S + be + V3'
    ]
  },
  {
    week: 4,
    phase: 1,
    phaseTitle: 'Giai đoạn 1: Củng cố kiến thức lớp 9',
    title: 'Hình học không gian & Câu điều kiện',
    focusToan: 'T10: Hình trụ, nón, cầu & bài toán thực tế đo đạc',
    focusVan: 'V3: Bắt đầu dàn ý đoạn văn Nghị luận xã hội về tư tưởng đạo lý',
    focusAnh: 'A3: Câu điều kiện loại 1, loại 2 và chuyển đổi Unless',
    goals: [
      'Thuộc lòng công thức V, S xung quanh hình trụ, nón, cầu',
      'Nắm khung bài văn nghị luận xã hội 4 bước',
      'Hoàn thành Chapter Test cuối Giai đoạn 1 cho cả 3 môn'
    ]
  },
  {
    week: 5,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Hàm số bậc nhất, Parabol & Nghị luận xã hội chuyên sâu',
    focusToan: 'T4: Hàm số y = ax + b, vị trí tương đối và vẽ Parabol y = ax²',
    focusVan: 'V3: Thực hành viết đoạn văn 200 chữ về ý chí, lòng biết ơn, tự học',
    focusAnh: 'A4: Câu tường thuật (Reported speech) câu kể và câu hỏi',
    goals: [
      'Vẽ chính xác đồ thị (P) và đường thẳng (d), tìm tọa độ giao điểm',
      'Tự viết đoạn văn NLXH có dẫn chứng thuyết phục và phản biện',
      'Thành thạo lùi thì và đổi trạng từ trong câu gián tiếp'
    ]
  },
  {
    week: 6,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Hệ phương trình & Bài toán thực tế',
    focusToan: 'T3: Giải hệ phương trình và lập hệ giải bài toán kinh tế/năng suất',
    focusVan: 'V4: Nghị luận về hiện tượng đời sống (mạng xã hội, bạo lực học đường)',
    focusAnh: 'A5: Mệnh đề quan hệ (Who, Whom, Which, That, Whose)',
    goals: [
      'Thiết lập phương trình chuẩn xác cho các bài toán thực tế',
      'Biết phân tích nguyên nhân và giải pháp trong bài văn đời sống',
      'Nối câu thành thạo với đại từ quan hệ không nhầm dấu phẩy'
    ]
  },
  {
    week: 7,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Phương trình bậc hai & Hệ thức Viète',
    focusToan: 'T5: Biệt thức Δ, công thức nghiệm và định lý Viète cơ bản',
    focusVan: 'V5: Nghị luận văn học tác phẩm Thơ (Kết nối tri thức)',
    focusAnh: 'A6: Chuyên đề Cấu tạo từ (Word form) danh/tính/động/trạng',
    goals: [
      'Vận dụng Viète tính S, P và các biểu thức đối xứng x1² + x2²',
      'Cảm nhận thơ bám sát từ ngữ và biện pháp nghệ thuật',
      'Nhận biết vị trí từ loại đạt 80% độ chính xác trong bài Word Form'
    ]
  },
  {
    week: 8,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Đường tròn & Tiếp tuyến cắt nhau',
    focusToan: 'T8: Tính chất 2 tiếp tuyến cắt nhau, góc ở tâm, góc nội tiếp',
    focusVan: 'V5: Luyện viết bài văn phân tích đoạn trích thơ hoàn chỉnh',
    focusAnh: 'A6: Word Form nâng cao theo chủ đề môi trường và công nghệ',
    goals: [
      'Chứng minh tiếp tuyến và các góc bằng nhau chắn cung',
      'Hoàn thành bài viết văn có mở bài, thân bài rõ luận điểm, kết bài sâu sắc',
      'Tích lũy 50 từ Word Form then chốt'
    ]
  },
  {
    week: 9,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Tứ giác nội tiếp - Chìa khóa điểm 8-9 môn Toán',
    focusToan: 'T9: 4 dấu hiệu chứng minh tứ giác nội tiếp và tam giác đồng dạng',
    focusVan: 'V6: Nghị luận tác phẩm Truyện ngắn (tình huống truyện, nhân vật)',
    focusAnh: 'A8: Kỹ năng đọc hiểu điền từ (Cloze test)',
    goals: [
      'Chứng minh thành thạo câu a, b bài hình tuyển sinh',
      'Phân tích nhân vật truyện qua hành động, lời thoại và phẩm chất',
      'Đọc lướt tìm từ khóa trong bài đọc tiếng Anh'
    ]
  },
  {
    week: 10,
    phase: 2,
    phaseTitle: 'Giai đoạn 2: Ôn theo chuyên đề thi vào 10',
    title: 'Ứng dụng Viète nâng cao & Đánh giá giữa kỳ',
    focusToan: 'T5: Viète chứa tham số m và hệ thức không đối xứng',
    focusVan: 'V6: Luyện viết bài văn phân tích nhân vật truyện ngắn',
    focusAnh: 'A8: Đọc hiểu văn bản dài và chiến thuật trả lời câu hỏi khó',
    goals: [
      'Tìm điều kiện của m để phương trình có 2 nghiệm thỏa mãn hệ thức phụ',
      'Mid-course Test: Đánh giá tổng quát mức độ sẵn sàng sau 10 tuần'
    ]
  },
  {
    week: 11,
    phase: 3,
    phaseTitle: 'Giai đoạn 3: Luyện đề tổng hợp',
    title: 'Đề thi số 1 & 2 - Rèn luyện tâm lý phòng thi',
    focusToan: 'Đề thi Toán số 1 (120 phút) - Phân tích bảng thống kê lỗi sai',
    focusVan: 'Đề thi Văn số 1 (120 phút) - Bấm giờ và căn chỉnh dung lượng bài viết',
    focusAnh: 'Đề thi Tiếng Anh số 1 (60-90 phút) - Tối ưu thời gian trắc nghiệm',
    goals: [
      'Hoàn thành đề đúng thời gian thực tế',
      'Tự ghi nhật ký 6 nhóm lỗi sai (kiến thức, công thức, tính toán, đọc đề, trình bày, thời gian)'
    ]
  },
  {
    week: 12,
    phase: 3,
    phaseTitle: 'Giai đoạn 3: Luyện đề tổng hợp',
    title: 'Đề thi số 3 & 4 - Tăng tốc độ và độ chính xác',
    focusToan: 'Đề thi Toán số 2 & 3 - Trọng tâm bài toán thực tế TP.HCM',
    focusVan: 'Đề thi Văn số 2 & 3 - Rèn luyện tốc độ viết 2 bài văn/đoạn văn',
    focusAnh: 'Đề thi Anh số 2 & 3 - Chữa bẫy trắc nghiệm ngữ pháp & từ vựng',
    goals: [
      'Nâng điểm số đề thi lên trên 7.5 điểm',
      'Khắc phục triệt để lỗi tính toán sai và nhầm dấu'
    ]
  },
  {
    week: 13,
    phase: 3,
    phaseTitle: 'Giai đoạn 3: Luyện đề tổng hợp',
    title: 'Đề thi số 5 & 6 - Nâng cao dạng bài phân loại',
    focusToan: 'T6: Bất đẳng thức cực trị phân loại điểm 10 & Ý c bài hình',
    focusVan: 'Luyện đề so sánh 2 đoạn trích/nhân vật hoặc câu hỏi liên hệ thực tế',
    focusAnh: 'Luyện câu viết lại nâng cao và cụm động từ (Phrasal verbs)',
    goals: [
      'Tập dượt các câu phân loại 9-10 điểm',
      'Hoàn thiện kỹ năng trình bày sạch đẹp, không tẩy xóa'
    ]
  },
  {
    week: 14,
    phase: 3,
    phaseTitle: 'Giai đoạn 3: Luyện đề tổng hợp',
    title: 'Mock Entrance Exam - Khảo sát toàn diện',
    focusToan: 'Thi thử như thi thật: Đề khảo sát chuẩn cấu trúc Sở GD&ĐT',
    focusVan: 'Thi thử bài thi Ngữ văn 120 phút',
    focusAnh: 'Thi thử bài thi Tiếng Anh',
    goals: [
      'Đạt chỉ tiêu điểm số mục tiêu trường nguyện vọng 1',
      'Lập danh sách các lỗ hổng kiến thức còn sót lại để vá trong Giai đoạn 4'
    ]
  },
  {
    week: 15,
    phase: 4,
    phaseTitle: 'Giai đoạn 4: Nước rút',
    title: 'Vá lỗ hổng & Kiến thức trọng tâm then chốt',
    focusToan: 'Ôn tập kiến thức trọng tâm: Rút gọn, Viète, Tứ giác nội tiếp, Toán thực tế',
    focusVan: 'Ôn tập công thức đọc hiểu, dàn ý NLXH và dẫn chứng tiêu biểu',
    focusAnh: 'Tổng ôn Word form, câu điều kiện, câu bị động, phát âm/trọng âm',
    goals: [
      'Làm các "Bài chữa lỗ hổng" 5-10 câu tập trung đúng vào lỗi sai thường gặp',
      'Không nạp kiến thức mới ngoài chương trình, củng cố sự tự tin tuyệt đối'
    ]
  },
  {
    week: 16,
    phase: 4,
    phaseTitle: 'Giai đoạn 4: Nước rút',
    title: 'Sẵn sàng thi vào 10 - Tâm lý vững vàng',
    focusToan: 'Rà soát bảng công thức Toán 9 bỏ túi, mẹo kiểm tra lại nghiệm',
    focusVan: 'Đọc lại các bài văn mẫu điểm cao của bản thân, ghi nhớ cấu trúc 5 bước',
    focusAnh: 'Xem lại sổ tay từ vựng hay sai và mẹo làm bài đọc hiểu',
    goals: [
      'Nắm vững kỹ năng phân bổ thời gian cho từng câu trong phòng thi',
      'Thể lực tốt, tinh thần thoải mái, sẵn sàng bứt phá kỳ thi tuyển sinh vào 10!'
    ]
  }
];
