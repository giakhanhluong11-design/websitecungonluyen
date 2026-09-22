import { MathExam, MathExerciseItem } from '../types/practiceExamTypes';

/**
 * Sinh đề Toán 9 Tuyển sinh 10 mới hoàn toàn (7 bài - 10.0 điểm).
 * Ưu tiên gọi AI Gemini để sáng tạo đề thi độc bản 100%, không trùng lặp bối cảnh.
 * Nếu không có mạng/AI bận, chuyển sang bộ sinh thủ tục đa biến thể cục bộ.
 */
export async function generateRandomMathExam(
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa' = 'Chuẩn',
  onProgressStep?: (msg: string) => void
): Promise<MathExam> {
  onProgressStep?.('AI Gemini đang sáng tạo ngữ cảnh đề thi và 7 bài toán thực tế mới...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max wait

    const res = await fetch('/api/generate/math-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.exam && Array.isArray(data.exam.exercises) && data.exam.exercises.length === 7) {
        onProgressStep?.('Đề thi Toán độc bản từ AI đã sẵn sàng!');
        await new Promise(r => setTimeout(r, 300));
        return data.exam as MathExam;
      }
    }
  } catch (err) {
    console.warn('Không thể tạo đề bằng AI trực tiếp, chuyển sang bộ tạo đề sư phạm phong phú:', err);
  }

  // Fallback: Bộ tạo đề sư phạm nội bộ đa biến thể (nhiều bối cảnh hoàn toàn khác nhau)
  onProgressStep?.('Đang kiến tạo 7 bài toán thực tế đa dạng theo chuẩn ma trận đề thi...');
  await new Promise(r => setTimeout(r, 400));
  return generateLocalDiverseMathExam(difficulty, onProgressStep);
}

/**
 * Bộ tạo đề sư phạm nội bộ với nhiều bối cảnh, dạng bài và câu chuyện thực tế khác nhau
 */
function generateLocalDiverseMathExam(
  difficulty: 'Cơ bản' | 'Chuẩn' | 'Phân hóa',
  onProgressStep?: (msg: string) => void
): MathExam {
  // ================= BÀI 1: HÀM SỐ & PARABOL (1.5 điểm) =================
  const b1Variants = [
    // Biến thể A: Parabol y = ax² và toạ độ giao điểm
    () => {
      const aVals = [-1, -0.5, 0.5, 1, 2];
      const a = aVals[Math.floor(Math.random() * aVals.length)];
      const targetY = a > 0 ? a * 4 : a * 4;
      const xVal = 2;
      return {
        id: 'bai1',
        baiNumber: 1,
        title: 'Bài 1 (1.5 điểm) - Hàm số và Đồ thị parabol',
        points: 1.5,
        topicCategory: 'Số và Đại số' as const,
        problemText: `Cho hàm số y = ${a === 1 ? '' : a === -1 ? '-' : a}x² có đồ thị là parabol (P).
a) (1.0 điểm) Lập bảng giá trị, vẽ đồ thị (P) và xác định tọa độ đỉnh O(0; 0) cùng 4 điểm phân biệt thuộc (P) trên mặt phẳng tọa độ Oxy.
b) (0.5 điểm) Tìm tọa độ các điểm thuộc (P) có tung độ bằng ${targetY}.`,
        subQuestions: [
          { id: 'b1_a', label: 'a', points: 1.0, content: `Lập bảng giá trị, vẽ đồ thị parabol (P): y = ${a === 1 ? '' : a === -1 ? '-' : a}x² và xác định toạ độ đỉnh O(0; 0) cùng 4 điểm đối xứng` },
          { id: 'b1_b', label: 'b', points: 0.5, content: `Tìm điểm thuộc (P) có tung độ bằng ${targetY}` }
        ],
        sampleSolution: `a) Bảng giá trị và xác định 5 điểm đặc biệt đối xứng qua trục tung:
- Đỉnh O(0; 0)
- Điểm A(-2; ${a * 4}), B(-1; ${a}), C(1; ${a}), D(2; ${a * 4}).
Vẽ đường cong parabol đi qua 5 điểm trên và nhận Oy làm trục đối xứng.
b) Tung độ y = ${targetY} ⇒ ${a}x² = ${targetY} ⇒ x² = ${targetY / a} ⇒ x = ±${xVal}.
Vậy các điểm cần tìm là M(${xVal}; ${targetY}) và N(-${xVal}; ${targetY}).`,
        guideSteps: [
          { step: 'Lập đúng bảng giá trị và xác định toạ độ đỉnh O cùng 4 điểm', points: 0.5 },
          { step: 'Vẽ đúng hệ trục và vẽ parabol cong đều đẹp', points: 0.5 },
          { step: 'Thay y tìm được x và kết luận tọa độ 2 điểm', points: 0.5 }
        ],
        svgIllustration: {
          type: 'parabola' as const,
          svgContent: `<svg viewBox="0 0 200 150" class="w-full h-36">
            <line x1="20" y1="120" x2="180" y2="120" stroke="currentColor" stroke-width="1.5" />
            <line x1="100" y1="10" x2="100" y2="140" stroke="currentColor" stroke-width="1.5" />
            <path d="M 40 30 Q 100 120 160 30" fill="none" stroke="#4f46e5" stroke-width="2" />
            <circle cx="100" cy="120" r="3" fill="#4f46e5" />
            <text x="105" y="135" font-size="10" fill="currentColor">O</text>
            <text x="185" y="124" font-size="10" fill="currentColor">x</text>
            <text x="105" y="18" font-size="10" fill="currentColor">y</text>
          </svg>`,
          caption: `Đồ thị Parabol y = ${a === 1 ? '' : a === -1 ? '-' : a}x²`
        }
      };
    },
    // Biến thể B: Tương giao Parabol và đường thẳng d
    () => {
      return {
        id: 'bai1',
        baiNumber: 1,
        title: 'Bài 1 (1.5 điểm) - Tương giao giữa Parabol và Đường thẳng',
        points: 1.5,
        topicCategory: 'Số và Đại số' as const,
        problemText: `Cho parabol (P): y = x²/2 và đường thẳng (d): y = x + 4.
a) (1.0 điểm) Vẽ đồ thị (P), (d) và xác định tọa độ các điểm đặc biệt dùng để vẽ (gồm đỉnh O(0; 0), 4 điểm thuộc (P) và 2 giao điểm của (d) với hai trục tọa độ Ox, Oy).
b) (0.5 điểm) Tìm tọa độ giao điểm của (P) và (d) bằng phép tính.`,
        subQuestions: [
          { id: 'b1_a', label: 'a', points: 1.0, content: 'Vẽ đồ thị (P), (d) và xác định toạ độ các điểm đặc biệt trên hệ trục Oxy' },
          { id: 'b1_b', label: 'b', points: 0.5, content: 'Tìm toạ độ giao điểm của (P) và (d) bằng phép tính' }
        ],
        sampleSolution: `a) Xác định các điểm đặc biệt để vẽ hai đồ thị:
- Đối với (P): Đỉnh O(0; 0), các điểm (-4; 8), (-2; 2), (2; 2), (4; 8).
- Đối với (d): Giao với trục tung Oy tại C(0; 4), giao với trục hoành Ox tại D(-4; 0).
Vẽ (P) và (d) chính xác trên cùng hệ trục Oxy.
b) Phương trình hoành độ giao điểm của (P) và (d):
x²/2 = x + 4 ⇔ x² - 2x - 8 = 0.
Δ' = (-1)² - 1.(-8) = 9 > 0 ⇒ x₁ = 1 + 3 = 4, x₂ = 1 - 3 = -2.
- Với x = 4 ⇒ y = 8 ⇒ Giao điểm A(4; 8).
- Với x = -2 ⇒ y = 2 ⇒ Giao điểm B(-2; 2).
Vậy (d) cắt (P) tại hai điểm A(4; 8) và B(-2; 2).`,
        guideSteps: [
          { step: 'Lập bảng giá trị, xác định đúng toạ độ các điểm đặc biệt và vẽ 2 đồ thị', points: 1.0 },
          { step: 'Lập đúng phương trình hoành độ và tìm toạ độ 2 giao điểm', points: 0.5 }
        ]
      };
    },
    // Biến thể C: Parabol và xác định toạ độ điểm thoả mãn điều kiện
    () => {
      const a = -0.5;
      return {
        id: 'bai1',
        baiNumber: 1,
        title: 'Bài 1 (1.5 điểm) - Hàm số y = ax² và Xác định toạ độ điểm',
        points: 1.5,
        topicCategory: 'Số và Đại số' as const,
        problemText: `Cho hàm số y = -1/2 x² có đồ thị là parabol (P).
a) (1.0 điểm) Lập bảng giá trị, vẽ đồ thị (P) và xác định tọa độ đỉnh O(0; 0) cùng điểm A thuộc (P) có hoành độ bằng 2.
b) (0.5 điểm) Xác định tọa độ điểm B thuộc (P) có tung độ bằng -8.`,
        subQuestions: [
          { id: 'b1_a', label: 'a', points: 1.0, content: 'Lập bảng giá trị, vẽ đồ thị (P) và xác định toạ độ đỉnh O cùng điểm A có hoành độ bằng 2' },
          { id: 'b1_b', label: 'b', points: 0.5, content: 'Xác định toạ độ điểm B thuộc (P) có tung độ bằng -8' }
        ],
        sampleSolution: `a) Bảng giá trị xác định ít nhất 5 điểm:
x = -4 ⇒ y = -8; x = -2 ⇒ y = -2; x = 0 ⇒ y = 0; x = 2 ⇒ y = -2; x = 4 ⇒ y = -8.
- Đỉnh parabol là O(0; 0).
- Điểm A có hoành độ x = 2 ⇒ y = -1/2*(2)² = -2 ⇒ A(2; -2).
Vẽ đường cong parabol đi qua các điểm trên, bề lõm quay xuống dưới.
b) Điểm B thuộc (P) có tung độ y = -8 ⇒ -1/2 x² = -8 ⇒ x² = 16 ⇒ x = ±4.
Vậy có 2 điểm B thỏa mãn: B₁(4; -8) và B₂(-4; -8).`,
        guideSteps: [
          { step: 'Lập đúng bảng giá trị và xác định tọa độ đỉnh O cùng điểm A(2; -2)', points: 0.5 },
          { step: 'Vẽ đúng parabol trên hệ trục Oxy', points: 0.5 },
          { step: 'Tìm chính xác hoành độ và kết luận tọa độ 2 điểm B', points: 0.5 }
        ]
      };
    }
  ];
  const bai1 = b1Variants[Math.floor(Math.random() * b1Variants.length)]();

  // ================= BÀI 2: ĐỊNH LÝ VIÈTE (1.0 điểm) =================
  const b2Variants = [
    () => {
      const root1 = Math.floor(Math.random() * 3) + 2; // 2..4
      const root2 = -1;
      const S = root1 + root2;
      const P = root1 * root2;
      return {
        id: 'bai2',
        baiNumber: 2,
        title: 'Bài 2 (1.0 điểm) - Phương trình bậc hai và Định lí Viète',
        points: 1.0,
        topicCategory: 'Số và Đại số' as const,
        problemText: `Cho phương trình bậc hai: x² - ${S}x + ${P} = 0 có hai nghiệm phân biệt x₁, x₂.
Không giải phương trình, hãy:
a) (0.5 điểm) Chứng minh phương trình luôn có hai nghiệm phân biệt.
b) (0.5 điểm) Tính giá trị của biểu thức A = x₁² + x₂² + 2x₁x₂ - 3(x₁ + x₂).`,
        sampleSolution: `a) Ta có a.c = 1.(${P}) = ${P} < 0 nên phương trình luôn có hai nghiệm phân biệt trái dấu.
b) Áp dụng định lí Viète: S = x₁ + x₂ = ${S}, P = x₁x₂ = ${P}.
Biểu thức A = (x₁ + x₂)² - 3(x₁ + x₂) = ${S}² - 3.(${S}) = ${S * S - 3 * S}.`,
        guideSteps: [
          { step: 'Chứng minh phương trình có 2 nghiệm phân biệt qua delta hoặc a.c < 0', points: 0.5 },
          { step: 'Áp dụng hệ thức Viète và tính đúng giá trị biểu thức', points: 0.5 }
        ]
      };
    },
    () => {
      return {
        id: 'bai2',
        baiNumber: 2,
        title: 'Bài 2 (1.0 điểm) - Hệ thức Vi-ét với biểu thức phân thức',
        points: 1.0,
        topicCategory: 'Số và Đại số' as const,
        problemText: `Cho phương trình bậc hai: x² - 5x + 3 = 0 có hai nghiệm phân biệt x₁, x₂.
Không giải phương trình, hãy tính giá trị của biểu thức:
M = (x₁ / x₂) + (x₂ / x₁) - 2x₁x₂.`,
        sampleSolution: `Ta có Δ = (-5)² - 4.1.3 = 13 > 0 nên phương trình luôn có hai nghiệm phân biệt x₁, x₂ khác 0.
Theo định lí Viète: x₁ + x₂ = 5 và x₁x₂ = 3.
Biến đổi biểu thức M:
M = (x₁² + x₂²) / (x₁x₂) - 2x₁x₂ = [(x₁ + x₂)² - 2x₁x₂] / (x₁x₂) - 2x₁x₂
M = [5² - 2.3] / 3 - 2.3 = 19/3 - 6 = 1/3.
Vậy M = 1/3.`,
        guideSteps: [
          { step: 'Khẳng định phương trình có 2 nghiệm và nêu hệ thức Viète', points: 0.5 },
          { step: 'Quy đồng biểu thức và thay số tính đúng kết quả 1/3', points: 0.5 }
        ]
      };
    }
  ];
  const bai2 = b2Variants[Math.floor(Math.random() * b2Variants.length)]();

  // ================= BÀI 3: THỐNG KÊ & XÁC SUẤT THỰC NGHIỆM (1.0 - 1.5 điểm) =================
  const b3Scenarios = [
    {
      title: 'Khảo sát thói quen đọc sách và văn hóa đọc tại thư viện',
      data: 'Dưới 2 cuốn/tháng: 12 học sinh; Từ 2 đến 4 cuốn: 20 học sinh; Trên 4 cuốn: 8 học sinh',
      total: 40,
      targetText: 'chọn ngẫu nhiên một học sinh đọc từ 2 cuốn sách trở lên trong tháng',
      favCount: 28,
      percent: '70%'
    },
    {
      title: 'Khảo sát lượng điện mặt trời mái nhà phát ra tại 50 hộ gia đình',
      data: 'Dưới 15 kWh/ngày: 10 hộ; Từ 15 đến 25 kWh/ngày: 25 hộ; Trên 25 kWh/ngày: 15 hộ',
      total: 50,
      targetText: 'chọn ngẫu nhiên một hộ gia đình phát ra từ 15 kWh/ngày trở lên',
      favCount: 40,
      percent: '80%'
    },
    {
      title: 'Thống kê lượng rác thải nhựa tái chế thu gom của 60 chi đội',
      data: 'Mức A (dưới 10 kg): 15 chi đội; Mức B (10 - 20 kg): 30 chi đội; Mức C (trên 20 kg): 15 chi đội',
      total: 60,
      targetText: 'chọn ngẫu nhiên một chi đội đạt mức thu gom từ 10 kg rác tái chế trở lên',
      favCount: 45,
      percent: '75%'
    }
  ];
  const sc = b3Scenarios[Math.floor(Math.random() * b3Scenarios.length)];
  const bai3: MathExerciseItem = {
    id: 'bai3',
    baiNumber: 3,
    title: 'Bài 3 (1.0 điểm) - Bài toán thực tế Thống kê và Xác suất',
    points: 1.0,
    topicCategory: 'Thống kê và Xác suất',
    problemText: `Một nhóm nghiên cứu tiến hành thu thập số liệu: "${sc.title}".
Kết quả ghi nhận như sau:
${sc.data}.
a) (0.5 điểm) Tính tỷ lệ phần trăm (%) học sinh (hoặc đối tượng) ở từng nhóm so với tổng số mẫu khảo sát.
b) (0.5 điểm) Tính xác suất thực nghiệm để ${sc.targetText}.`,
    sampleSolution: `a) Tổng số mẫu khảo sát: N = ${sc.total}.
Tỷ lệ phần trăm ở từng nhóm được tính bằng (Tần số / ${sc.total}) × 100%.
b) Số kết quả thuận lợi cho biến cố: n = ${sc.favCount}.
Xác suất thực nghiệm: P = ${sc.favCount} / ${sc.total} = ${(sc.favCount / sc.total).toFixed(2)} (${sc.percent}).`,
    guideSteps: [
      { step: 'Tính đúng tỷ lệ phần trăm từng nhóm', points: 0.5 },
      { step: 'Xác định số kết quả thuận lợi và tính đúng xác suất', points: 0.5 }
    ]
  };

  // ================= BÀI 4: HÀM SỐ & MÔ HÌNH HÓA THỰC TẾ (1.0 điểm) =================
  const b4Scenarios = [
    {
      topic: 'Cước phí dịch vụ xe công nghệ chở khách',
      text: `Bác Ba sử dụng dịch vụ xe ôm công nghệ để di chuyển. Bảng cước phí được tính như sau: Giá cước mở cửa cho 2 km đầu tiên là 14 000 đồng; từ km thứ 3 trở đi, cước phí là 6 500 đồng cho mỗi km.
a) (0.5 điểm) Gọi y (đồng) là tổng số tiền bác Ba phải trả khi đi quãng đường x km (với x > 2). Hãy thiết lập hàm số biểu diễn y theo x.
b) (0.5 điểm) Nếu bác Ba thanh toán chuyến đi hết 79 000 đồng, hỏi quãng đường di chuyển của bác Ba dài bao nhiêu km?`,
      solution: `a) Với x > 2, quãng đường sau 2 km đầu là (x - 2) km.
Hàm số biểu diễn y theo x:
y = 14 000 + 6 500(x - 2) = 6 500x + 1 000 (đồng).
b) Khi y = 79 000:
6 500x + 1 000 = 79 000 ⇒ 6 500x = 78 000 ⇒ x = 12 (thỏa mãn x > 2).
Vậy quãng đường bác Ba đã di chuyển là 12 km.`
    },
    {
      topic: 'Gói cước viễn thông dữ liệu học tập',
      text: `Một nhà mạng cung cấp gói cước học tập trực tuyến: Cước thuê bao cố định mỗi tháng là 50 000 đồng. Ngoài ra, mỗi gigabyte (GB) dữ liệu tốc độ cao sử dụng thêm có giá 8 000 đồng/GB.
a) (0.5 điểm) Gọi T (đồng) là tổng số tiền cước phải trả trong một tháng khi sử dụng thêm x (GB) dữ liệu. Hãy biểu diễn T theo x.
b) (0.5 điểm) Bạn An tháng này thanh toán tiền cước với tổng số tiền 114 000 đồng. Hỏi bạn An đã dùng thêm bao nhiêu GB dữ liệu tốc độ cao?`,
      solution: `a) Công thức hàm số bậc nhất biểu diễn T theo x:
T = 50 000 + 8 000x (đồng, với x ≥ 0).
b) Khi T = 114 000 đồng:
50 000 + 8 000x = 114 000 ⇒ 8 000x = 64 000 ⇒ x = 8.
Vậy bạn An đã sử dụng thêm 8 GB dữ liệu tốc độ cao.`
    }
  ];
  const b4Selected = b4Scenarios[Math.floor(Math.random() * b4Scenarios.length)];
  const bai4: MathExerciseItem = {
    id: 'bai4',
    baiNumber: 4,
    title: 'Bài 4 (1.0 điểm) - Mô hình hóa toán học và Thiết lập hàm số',
    points: 1.0,
    topicCategory: 'Số và Đại số',
    problemText: b4Selected.text,
    sampleSolution: b4Selected.solution,
    guideSteps: [
      { step: 'Thiết lập đúng hàm số bậc nhất y = ax + b theo bài toán thực tế', points: 0.5 },
      { step: 'Thay giá trị, giải phương trình và kết luận chính xác', points: 0.5 }
    ]
  };

  // ================= BÀI 5: HÌNH HỌC KHÔNG GIAN THỰC TẾ (1.0 điểm) =================
  const b5Scenarios = [
    {
      text: `Một bồn chứa nước sạch inox dạng hình trụ đứng có đường kính đáy d = 1.2 m (bán kính r = 0.6 m) và chiều cao h = 2 m.
a) (0.5 điểm) Tính diện tích toàn phần của bồn chứa nước (lấy π ≈ 3.14).
b) (0.5 điểm) Bồn chứa có thể chứa tối đa bao nhiêu lít nước? (Biết 1 m³ = 1 000 lít, kết quả làm tròn đến hàng đơn vị).`,
      solution: `a) Bán kính đáy r = 0.6 m, chiều cao h = 2 m.
Diện tích toàn phần hình trụ:
Stp = 2πr(r + h) = 2 × 3.14 × 0.6 × (0.6 + 2) = 9.7968 m² ≈ 9.8 m².
b) Thể tích của bồn chứa:
V = πr²h = 3.14 × 0.6² × 2 = 2.2608 m³.
Dung tích nước tối đa:
2.2608 × 1 000 ≈ 2 261 lít nước.`
    },
    {
      text: `Một chiếc nón lá truyền thống xứ Huế có dạng hình nón với đường kính đáy là 40 cm (bán kính đáy r = 20 cm) và độ dài đường sinh l = 30 cm.
a) (0.5 điểm) Tính diện tích lá cọ cần dùng để phủ kín mặt xung quanh của chiếc nón lá (lấy π ≈ 3.14).
b) (0.5 điểm) Tính chiều cao của chiếc nón lá (kết quả làm tròn đến chữ số thập phân thứ nhất).`,
      solution: `a) Diện tích xung quanh hình nón:
Sxq = πrl = 3.14 × 20 × 30 = 1 884 cm².
b) Chiều cao h của hình nón:
Áp dụng định lí Pythagore trong tam giác vuông:
h = √(l² - r²) = √(30² - 20²) = √500 ≈ 22.4 cm.`
    }
  ];
  const b5Selected = b5Scenarios[Math.floor(Math.random() * b5Scenarios.length)];
  const bai5: MathExerciseItem = {
    id: 'bai5',
    baiNumber: 5,
    title: 'Bài 5 (1.0 điểm) - Thực tế Hình học không gian và Đo lường',
    points: 1.0,
    topicCategory: 'Hình học và Đo lường',
    problemText: b5Selected.text,
    sampleSolution: b5Selected.solution,
    guideSteps: [
      { step: 'Viết đúng công thức diện tích và thay số tính đúng', points: 0.5 },
      { step: 'Tính thể tích/chiều cao và đổi đơn vị chính xác', points: 0.5 }
    ]
  };

  // ================= BÀI 6: TOÁN LIÊN MÔN / KINH TẾ THỰC TẾ (1.0 điểm) =================
  const b6Scenarios = [
    {
      text: `Để chuẩn bị nước rửa tay sát khuẩn cho học sinh trở lại trường, nhân viên y tế cần pha 500 ml dung dịch cồn 70° từ dung dịch cồn 90° và nước tinh khiết (cồn 0°).
Hỏi cần lấy bao nhiêu ml cồn 90° và bao nhiêu ml nước tinh khiết để thu được lượng dung dịch cồn 70° theo yêu cầu?`,
      solution: `Gọi thể tích cồn 90° và nước tinh khiết cần lấy lần lượt là x và y (ml; 0 < x, y < 500).
Tổng thể tích dung dịch là 500 ml: x + y = 500 (1).
Lượng cồn nguyên chất trong dung dịch 70°: 500 × 70% = 350 ml.
Phương trình bảo toàn lượng cồn nguyên chất: 0.9x + 0y = 350 ⇒ 0.9x = 350 (2).
Từ (2) suy ra: x = 350 / 0.9 ≈ 388.9 ml cồn 90°.
Thay vào (1): y = 500 - 388.9 = 111.1 ml nước tinh khiết.
Vậy cần lấy khoảng 388.9 ml cồn 90° và 111.1 ml nước tinh khiết.`
    },
    {
      text: `Một cửa hàng bánh mì khởi nghiệp bán mỗi ổ bánh mì với giá 25 000 đồng. Chi phí nguyên liệu cho mỗi ổ bánh là 13 000 đồng, và chi phí thuê mặt bằng cố định là 6 000 000 đồng mỗi tháng.
a) (0.5 điểm) Hỏi cửa hàng cần bán tối thiểu bao nhiêu ổ bánh mì trong một tháng để đạt điểm hòa vốn?
b) (0.5 điểm) Cửa hàng muốn đạt lợi nhuận 18 000 000 đồng trong tháng thì cần bán được bao nhiêu ổ bánh mì?`,
      solution: `Lợi nhuận trên mỗi ổ bánh mì bán ra: 25 000 - 13 000 = 12 000 đồng.
a) Điểm hòa vốn đạt được khi tổng lợi nhuận từ các ổ bánh mì bằng chi phí cố định:
Số bánh mì tối thiểu để hòa vốn = 6 000 000 / 12 000 = 500 ổ bánh mì.
b) Để đạt lợi nhuận 18 000 000 đồng:
Tổng số tiền chênh lệch cần thu = 6 000 000 + 18 000 000 = 24 000 000 đồng.
Số bánh mì cần bán = 24 000 000 / 12 000 = 2 000 ổ bánh mì.`
    }
  ];
  const b6Selected = b6Scenarios[Math.floor(Math.random() * b6Scenarios.length)];
  const bai6: MathExerciseItem = {
    id: 'bai6',
    baiNumber: 6,
    title: 'Bài 6 (1.0 điểm) - Toán thực tế giải bằng phương pháp đại số',
    points: 1.0,
    topicCategory: 'Số và Đại số',
    problemText: b6Selected.text,
    sampleSolution: b6Selected.solution,
    guideSteps: [
      { step: 'Lập đúng phương trình / hệ phương trình đại số biểu thị đại lượng', points: 0.5 },
      { step: 'Giải đúng và kết luận phù hợp với câu hỏi thực tế', points: 0.5 }
    ]
  };

  // ================= BÀI 7: HÌNH HỌC PHẲNG CỔ ĐIỂN (3.0 điểm) =================
  const bai7: MathExerciseItem = {
    id: 'bai7',
    baiNumber: 7,
    title: 'Bài 7 (3.0 điểm) - Hình học phẳng tổng hợp',
    points: 3.0,
    topicCategory: 'Hình học và Đo lường',
    problemText: `Cho tam giác nhọn ABC (AB < AC) nội tiếp đường tròn (O; R). Các đường cao AD, BE, CF của tam giác ABC cắt nhau tại trực tâm H.
a) (1.0 điểm) Chứng minh tứ giác BFEC nội tiếp một đường tròn và tứ giác AFHE nội tiếp đường tròn đường kính AH.
b) (1.0 điểm) Kẻ đường kính AK của đường tròn (O). Chứng minh tứ giác BHCK là hình bình hành và ba điểm H, M, K thẳng hàng (với M là trung điểm của BC).
c) (1.0 điểm) Gọi I là trung điểm của AH. Chứng minh I là tâm đường tròn ngoại tiếp tam giác AEF và OM = 1/2 AH.`,
    subQuestions: [
      { id: 'b7_a', label: 'a', points: 1.0, content: 'Chứng minh tứ giác BFEC và tứ giác AFHE nội tiếp' },
      { id: 'b7_b', label: 'b', points: 1.0, content: 'Chứng minh tứ giác BHCK là hình bình hành và H, M, K thẳng hàng' },
      { id: 'b7_c', label: 'c', points: 1.0, content: 'Chứng minh I là tâm ngoại tiếp tam giác AEF và OM = 1/2 AH' }
    ],
    sampleSolution: `a) - Do BE ⊥ AC, CF ⊥ AB nên ∠BFC = ∠BEC = 90°. Hai đỉnh F, E cùng nhìn đoạn BC dưới một góc 90° ⇒ Tứ giác BFEC nội tiếp đường tròn đường kính BC.
- Xét tứ giác AFHE có ∠AFH + ∠AEH = 90° + 90° = 180° ⇒ Tứ giác AFHE nội tiếp đường tròn đường kính AH.
b) - Kẻ đường kính AK: Ta có ∠ACK = 90° (góc nội tiếp chắn nửa đường tròn) ⇒ CK ⊥ AC.
Mà BH ⊥ AC (BE là đường cao) ⇒ BH // CK.
Tương tự ∠ABK = 90° ⇒ BK ⊥ AB, mà CH ⊥ AB ⇒ BK // CH.
Tứ giác BHCK có các cạnh đối song song nên là hình bình hành.
- Vì M là trung điểm của BC nên M cũng là trung điểm của đường chéo HK ⇒ H, M, K thẳng hàng.
c) - Vì AFHE nội tiếp đường tròn đường kính AH nên tâm của đường tròn ngoại tiếp △AEF chính là trung điểm I của đoạn thẳng AH.
- Trong tam giác AHK có: O là trung điểm của AK, M là trung điểm của HK. Do đó OM là đường trung bình của tam giác AHK ⇒ OM = 1/2 AH (đpcm).`,
    guideSteps: [
      { step: 'Chứng minh 2 góc vuông cùng nhìn một cạnh để suy ra tứ giác nội tiếp', points: 0.5 },
      { step: 'Chứng minh tổng 2 góc đối bằng 180°', points: 0.5 },
      { step: 'Chứng minh góc nội tiếp chắn nửa đường tròn và cặp cạnh song song để suy ra hình bình hành', points: 1.0 },
      { step: 'Sử dụng tính chất đường trung bình tam giác AHK để suy ra OM = 1/2 AH', points: 1.0 }
    ],
    svgIllustration: {
      type: 'circle_geometry',
      svgContent: `<svg viewBox="0 0 280 200" class="w-full max-w-sm mx-auto h-44 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2">
        <circle cx="140" cy="105" r="75" fill="none" stroke="#6366f1" stroke-width="1.5" />
        <polygon points="140,30 80,165 200,165" fill="none" stroke="currentColor" stroke-width="1.5" />
        <line x1="140" y1="30" x2="140" y2="165" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,3" />
        <line x1="80" y1="165" x2="180" y2="75" stroke="#059669" stroke-width="1.2" stroke-dasharray="3,3" />
        <circle cx="140" cy="105" r="2.5" fill="#6366f1" />
        <text x="145" y="105" font-size="10" fill="currentColor">O</text>
        <text x="135" y="24" font-size="11" font-weight="bold" fill="currentColor">A</text>
        <text x="65" y="175" font-size="11" font-weight="bold" fill="currentColor">B</text>
        <text x="205" y="175" font-size="11" font-weight="bold" fill="currentColor">C</text>
      </svg>`,
      caption: 'Mô hình tam giác nhọn ABC nội tiếp đường tròn (O)'
    }
  };

  const exercises = [bai1, bai2, bai3, bai4, bai5, bai6, bai7];

  return {
    id: `math-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    subjectId: 'toan',
    title: `Đề Thi Tuyển Sinh 10 Môn Toán (Mã đề: M${Math.floor(Math.random() * 900 + 100)})`,
    difficulty,
    timeMinutes: 120,
    exercises,
    metadata: {
      totalScore: 10.0,
      totalExercises: 7,
      categoriesCovered: ['Số và Đại số', 'Hình học và Đo lường', 'Thống kê và Xác suất'],
      createdAt: new Date().toISOString()
    }
  };
}
