import { TopicExample, TopicExercise } from '../types';
import { ALL_LESSON_EXERCISES } from './lessonExercises';

export interface LessonContent {
  moduleId: string; // matches CourseModule id e.g. 'toan-t1-can-thuc'
  theory: string;
  formulas: string[];
  examples: TopicExample[];
  exercises: TopicExercise[];
}

export const CURRICULUM_LESSONS: Record<string, LessonContent> = {
  // ============================ TOÁN 9 (T1 - T10) ============================
  'toan-t1-can-thuc': {
    moduleId: 'toan-t1-can-thuc',
    theory: `Chuyên đề "Căn thức bậc hai" là bài toán mở màn kinh điển trong mọi đề thi tuyển sinh vào lớp 10 THPT trên cả nước (thường chiếm từ 1.5 đến 2.0 điểm). Để đạt điểm tuyệt đối 10/10 ở câu hỏi này, bạn cần hiểu sâu sắc bản chất toán học chứ không được học vẹt! Dưới đây là các kiến thức trọng tâm bạn cần nắm vững:

I. CĂN BẬC HAI SỐ HỌC & ĐIỀU KIỆN XÁC ĐỊNH (ĐKXĐ)
1. Khái niệm bản chất: Với một số thực a ≥ 0, căn bậc hai số học của a là một số x không âm (x ≥ 0) thỏa mãn đẳng thức x² = a. Kí hiệu là √a.
   - Lưu ý quan trọng: Số âm tuyệt đối KHÔNG có căn bậc hai trong tập số thực! Vì bình phương của bất kỳ số thực nào cũng không thể là số âm.
2. Điều kiện xác định (ĐKXĐ) - Bí quyết không để mất 0.25 điểm đầu tiên:
   - Biểu thức √(A) có nghĩa (xác định) khi và chỉ khi biểu thức dưới dấu căn không âm: A ≥ 0.
   - Mẫu số chứa căn: Với phân thức dạng 1 / √(A), điều kiện bắt buộc là A > 0 (vừa nằm trong căn nên A ≥ 0, vừa nằm dưới mẫu số nên A ≠ 0, kết hợp lại là A > 0).
   - Biểu thức √(A / B): Xác định khi A.B ≥ 0 và B ≠ 0.

II. HẰNG ĐẲNG THỨC CỐT LÕI: √(A²) = |A|
- Lưu ý quan trọng: Khi bỏ dấu căn của một bình phương, bạn phải LUÔN LUÔN đặt trong dấu giá trị tuyệt đối trước tiên:
  √(A²) = |A|
- Sau đó mới tiến hành phá dấu giá trị tuyệt đối theo quy tắc:
  + Nếu A ≥ 0 thì |A| = A (giữ nguyên).
  + Nếu A < 0 thì |A| = -A (đổi dấu).
- Ví dụ kinh điển: √((-5)²) = |-5| = 5, chứ bạn nào ghi ngay bằng -5 là sai hoàn toàn bản chất số học!

III. CÁC PHÉP BIẾN ĐỔI CĂN THỨC BẬC HAI THƯỜNG DÙNG TRONG ĐỀ THI
1. Đưa thừa số ra ngoài / vào trong dấu căn:
   - Với B ≥ 0: √(A² . B) = |A|√B.
   - Nếu A ≥ 0, B ≥ 0 thì A√B = √(A²B). Còn nếu A < 0, B ≥ 0 thì A√B = -√(A²B).
2. Khử mẫu của biểu thức lấy căn:
   - √(A / B) = √(A.B) / |B| (với A.B ≥ 0 và B ≠ 0).
3. Trục căn thức ở mẫu bằng phương pháp nhân liên hợp:
   - Dạng 1 căn: m / √A = m√A / A (với A > 0).
   - Dạng tổng hiệu chứa căn:
     + m / (√A - √B) = m(√A + √B) / (A - B) (với A, B ≥ 0 và A ≠ B).
     + m / (√A + √B) = m(√A - √B) / (A - B) (với A, B ≥ 0 và A ≠ B).

IV. LƯU Ý QUAN TRỌNG KHI LÀM BÀI RÚT GỌN VÀO 10:
- Bước 1: Luôn ghi ĐKXĐ ngay dòng đầu tiên (hoặc nếu đề bài đã cho sẵn thì ghi "Với điều kiện đã cho...").
- Bước 2: Phân tích tất cả mẫu thức thành nhân tử để tìm Mẫu Thức Chung (MTC).
- Bước 3: Đổi dấu tinh tế: Nhớ rằng (a - b) = -(b - a), ví dụ (3 - √x) = -(√x - 3). Rất nhiều bạn quên đổi dấu phân thức trước ngoặc dẫn đến sai toàn bộ bài!
- Bước 4: Sau khi rút gọn ra kết quả, bạn hãy chọn thử một giá trị x cụ thể (ví dụ x = 4 hoặc x = 25) bấm máy tính Casio để đối chiếu biểu thức gốc và kết quả xem có bằng nhau không nhé!`,
    formulas: [
      '√(A) có nghĩa (xác định) ⇔ A ≥ 0 (Lưu ý: nếu ở mẫu thì A > 0)',
      '√(A²) = |A| = A (nếu A ≥ 0) hoặc -A (nếu A < 0)',
      '√(A.B) = √A . √B (với A ≥ 0, B ≥ 0)',
      '√(A/B) = √A / √B (với A ≥ 0, B > 0)',
      'm / (√A - √B) = m(√A + √B) / (A - B) (Nhân liên hợp tạo hằng đẳng thức hiệu hai bình phương)'
    ],
    examples: [
      {
        title: 'Ví dụ 1: Khai căn hằng đẳng thức bằng cách đưa về bình phương',
        problem: 'Rút gọn biểu thức: P = √(7 - 4√3) + √3',
        solution: `Ta có:
7 - 4√3 = 4 - 2.2.√3 + 3 = 2² - 2.2.√3 + (√3)² = (2 - √3)²

Suy ra:
P = √(7 - 4√3) + √3
  = √((2 - √3)²) + √3
  = |2 - √3| + √3

Vì 2 = √4 > √3 nên 2 - √3 > 0, do đó |2 - √3| = 2 - √3.

Thay vào biểu thức ta được:
P = (2 - √3) + √3 = 2.

Vậy giá trị của biểu thức P là 2.`,
        tip: 'Lấy hệ số đứng trước căn chia cho 2 để tìm tích a.b, sau đó nhẩm hai số sao cho tổng bình phương bằng số nguyên đứng đầu.'
      },
      {
        title: 'Ví dụ 2: Bài toán rút gọn phân thức chứa căn thi vào lớp 10',
        problem: 'Cho biểu thức A = (√x / (√x - 2) - 4 / (x - 2√x)) : (√x + 2) / √x với x > 0, x ≠ 4. Hãy rút gọn biểu thức A.',
        solution: `Với x > 0, x ≠ 4, ta có:
x - 2√x = √x(√x - 2)

Biểu thức trong ngoặc là:
√x / (√x - 2) - 4 / (x - 2√x)
= √x / (√x - 2) - 4 / [√x(√x - 2)]
= (√x . √x - 4) / [√x(√x - 2)]
= (x - 4) / [√x(√x - 2)]
= [(√x - 2)(√x + 2)] / [√x(√x - 2)]
= (√x + 2) / √x

Khi đó:
A = [(√x + 2) / √x] : [(√x + 2) / √x]
  = [(√x + 2) / √x] . [√x / (√x + 2)]
  = 1.

Vậy với x > 0, x ≠ 4 thì biểu thức A = 1.`,
        tip: 'Khi biến đổi x - 4, bạn nhớ nhìn ngay ra hằng đẳng thức (√x - 2)(√x + 2) để rút gọn phân số trước khi nhân chia.'
      }
    ],
    exercises: [
      {
        id: 't1-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Biểu thức √(3x - 12) xác định (có nghĩa) khi và chỉ khi giá trị của x thỏa mãn điều kiện nào sau đây?',
        options: ['x ≥ 4', 'x > 4', 'x ≤ 4', 'x ≥ -4'],
        correctAnswer: 'x ≥ 4',
        explanation: `Đáp án chính xác tuyệt đối là: x ≥ 4.

Hướng dẫn giải chi tiết từng bước:
- Biểu thức √(A) có nghĩa khi và chỉ khi biểu thức dưới dấu căn không âm, tức là A ≥ 0.
- Áp dụng vào bài toán, ta có: 3x - 12 ≥ 0.
- Chuyển vế đổi dấu: 3x ≥ 12.
- Chia cả hai vế cho 3 (số dương nên không đổi chiều bất đẳng thức): x ≥ 12 / 3 ⇔ x ≥ 4.

Phân tích các bẫy thường gặp của học sinh lớp 9:
- Bẫy chọn x > 4: Sai vì biểu thức nằm trên tử số, dấu căn vẫn nhận giá trị bằng 0 nên phải có dấu bằng (≥).
- Bẫy chọn x ≤ 4: Sai do chuyển vế hoặc chia nhầm làm đổi chiều bất đẳng thức.
- Lời khuyên: Bất kỳ khi nào gặp câu hỏi tìm điều kiện xác định của căn thức, bạn cứ đặt ngay A ≥ 0 rồi giải cẩn thận từng bước nhé!`
      },
      {
        id: 't1-ex2',
        level: 'trung-binh',
        levelLabel: 'Thông hiểu',
        question: 'Hãy tính giá trị của biểu thức P = √((-9)²) và chọn kết luận đúng nhất:',
        options: ['P = 9', 'P = -9', 'P = ±9', 'P = 81'],
        correctAnswer: 'P = 9',
        explanation: `Đáp án đúng là: P = 9.

Phân tích chi tiết bản chất toán học:
- Áp dụng hằng đẳng thức cốt lõi: √(A²) = |A|.
- Ở đây A = -9, do đó: √((-9)²) = |-9|.
- Vì -9 là số âm, nên khi bỏ dấu giá trị tuyệt đối ta phải lấy số đối của nó: |-9| = -(-9) = 9.
- Hoặc bạn có thể tính trực tiếp: (-9)² = 81, và căn bậc hai số học của 81 là số không âm bình phương bằng 81, chính là 9.

Cảnh báo lỗi sai nghiêm trọng trong phòng thi:
- Rất nhiều bạn học sinh vội vàng bỏ căn và bình phương rồi ghi ngay là -9. Điều này vi phạm định nghĩa căn bậc hai số học: "Căn bậc hai số học của một số không âm luôn luôn phải là một số KHÔNG ÂM" (√a ≥ 0). Tuyệt đối không được mắc bẫy này nữa nhé!`
      },
      {
        id: 't1-ex3',
        level: 'kho',
        levelLabel: 'Vận dụng',
        question: 'Rút gọn biểu thức Q = √(14 - 6√5) + √5, ta được kết quả cuối cùng là:',
        options: ['3', '2√5', '3 - 2√5', '5'],
        correctAnswer: '3',
        explanation: `Đáp án chính xác là: 3.

Ta có:
14 - 6√5 = 9 - 2.3.√5 + 5 = 3² - 2.3.√5 + (√5)² = (3 - √5)²

Khai căn:
√(14 - 6√5) = √((3 - √5)²) = |3 - √5|

Vì 3 = √9 > √5 nên 3 - √5 > 0, do đó |3 - √5| = 3 - √5.

Thay vào biểu thức:
Q = (3 - √5) + √5 = 3.`
      }
    ]
  },

  'toan-t2-phuong-trinh':
    {
    moduleId: 'toan-t2-phuong-trinh',
    theory: `Phương trình là một trong những cột trụ lớn nhất của Đại số lớp 9. Trong đề thi vào 10, phương trình xuất hiện ở dạng giải phương trình chứa ẩn ở mẫu, phương trình quy về bậc hai, phương trình vô tỉ hoặc là bước then chốt khi giải bài toán bằng cách lập phương trình. Dưới đây là các kiến thức trọng tâm bạn cần nắm vững:

I. PHƯƠNG TRÌNH CHỨA ẨN Ở MẪU THỨC
bạn cần tuân thủ nghiêm ngặt quy trình 4 bước chuẩn mực của Bộ GD&ĐT:
- Bước 1: Tìm Điều Kiện Xác Định (ĐKXĐ) để tất cả các mẫu thức khác 0. Đừng bao giờ quên bước này!
- Bước 2: Quy đồng mẫu thức ở cả hai vế rồi KHỬ MẪU.
  + Lưu ý quan trọng: Khi khử mẫu thức chứa ẩn, bạn phải DÙNG DẤU SUY RA (⇒), không được dùng dấu tương đương (⇔) vì phép khử mẫu có thể làm xuất hiện nghiệm ngoại lai (nghiệm làm mẫu thức bằng 0)!
- Bước 3: Giải phương trình đại số vừa nhận được (thường là bậc nhất hoặc bậc hai).
- Bước 4: ĐỐI CHIẾU NGHIỆM với ĐKXĐ ở Bước 1. Nghiệm nào thỏa mãn thì "Nhận", nghiệm nào vi phạm thì "Loại", sau đó mới kết luận tập nghiệm S.

II. PHƯƠNG TRÌNH TÍCH: A(x) . B(x) = 0
- Bản chất: Một tích bằng 0 khi và chỉ khi ít nhất một trong các thừa số bằng 0:
  A(x) . B(x) = 0 ⇔ A(x) = 0 HOẶC B(x) = 0.
- Phương pháp: Đưa mọi phương trình bậc cao về phương trình tích bằng cách chuyển hết sang vế trái và phân tích thành nhân tử (đặt nhân tử chung, dùng hằng đẳng thức, hoặc tách hạng tử).

III. PHƯƠNG TRÌNH VÔ TỈ CƠ BẢN (CHỨA DẤU CĂN)
Bạn cần nắm thật chắc dạng phương trình chứa căn bậc hai:
- Dạng 1: √(f(x)) = g(x)
  + Sai lầm chí mạng của học sinh: Bình phương ngay hai vế mà quên điều kiện vế phải g(x) ≥ 0!
  + Công thức chuẩn: √(f(x)) = g(x) ⇔ { g(x) ≥ 0 VÀ f(x) = [g(x)]² }.
  + Giải thích: Vế trái √(f(x)) luôn không âm, nên muốn bằng vế phải thì vế phải g(x) bắt buộc phải không âm! Khi g(x) ≥ 0 thì [g(x)]² ≥ 0, kéo theo f(x) ≥ 0 nên ta không cần đặt thêm điều kiện f(x) ≥ 0 nữa.
- Dạng 2: √(f(x)) = √(g(x))
  + Tương đương: { f(x) ≥ 0 (hoặc g(x) ≥ 0) VÀ f(x) = g(x) }. Chỉ cần đặt điều kiện cho biểu thức đơn giản hơn trong hai cái!`,
    formulas: [
      'Khử mẫu chứa ẩn BẮT BUỘC dùng dấu suy ra "⇒" (Tránh nghiệm ngoại lai làm mẫu bằng 0)',
      '√(f(x)) = g(x) ⇔ { g(x) ≥ 0 và f(x) = [g(x)]² } (Tuyệt đối không quên g(x) ≥ 0)',
      '√(f(x)) = √(g(x)) ⇔ { f(x) ≥ 0 (hoặc g(x) ≥ 0) và f(x) = g(x) }',
      'Phương trình tích: A(x) . B(x) = 0 ⇔ [ A(x) = 0 hoặc B(x) = 0',
      'Phương trình chứa dấu giá trị tuyệt đối: |A(x)| = B(x) ⇔ { B(x) ≥ 0 và [ A(x) = B(x) hoặc A(x) = -B(x) ] }'
    ],
    examples: [
      {
        title: 'Ví dụ 1: Giải phương trình chứa ẩn ở mẫu chuẩn ba-rem thi vào 10',
        problem: 'Giải phương trình: (x + 2) / (x - 2) - 1 / x = 2 / [x(x - 2)]',
        solution: `Điều kiện xác định: x ≠ 0 và x ≠ 2.

Phương trình đã cho tương đương với:
[x(x + 2)] / [x(x - 2)] - (x - 2) / [x(x - 2)] = 2 / [x(x - 2)]
⇒ x(x + 2) - (x - 2) = 2
⇔ x² + 2x - x + 2 = 2
⇔ x² + x = 0
⇔ x(x + 1) = 0
⇔ x = 0 hoặc x = -1.

Đối chiếu với điều kiện xác định:
- x = 0 (loại do không thỏa mãn ĐKXĐ).
- x = -1 (thỏa mãn ĐKXĐ).

Vậy tập nghiệm của phương trình là S = {-1}.`,
        tip: 'Khử mẫu phương trình chứa ẩn bắt buộc phải dùng dấu suy ra (⇒) và luôn đối chiếu lại với ĐKXĐ trước khi kết luận.'
      },
      {
        title: 'Ví dụ 2: Giải phương trình vô tỉ dạng căn bằng nhị thức',
        problem: 'Giải phương trình: √(2x² - 3) = x - 1',
        solution: `Phương trình tương đương với:
{ x - 1 ≥ 0
{ 2x² - 3 = (x - 1)²

⇔ { x ≥ 1
   { 2x² - 3 = x² - 2x + 1

⇔ { x ≥ 1
   { x² + 2x - 4 = 0  (*)

Giải phương trình (*): Δ' = 1² - 1.(-4) = 5 > 0.
Phương trình (*) có hai nghiệm phân biệt:
x1 = -1 + √5
x2 = -1 - √5

Đối chiếu với điều kiện x ≥ 1:
- x1 = -1 + √5 > -1 + 2 = 1 (thỏa mãn điều kiện).
- x2 = -1 - √5 < 0 < 1 (loại).

Vậy phương trình có nghiệm duy nhất x = -1 + √5.`,
        tip: 'Lưu ý: Tuyệt đối không được bình phương hai vế trước khi đặt điều kiện không âm cho vế không chứa căn!'
      }
    ],
    exercises: [
      {
        id: 't2-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Tập nghiệm S của phương trình tích (2x - 6)(x + 5) = 0 là:',
        options: ['S = {3; -5}', 'S = {-3; 5}', 'S = {3; 5}', 'S = {-3; -5}'],
        correctAnswer: 'S = {3; -5}',
        explanation: `Đáp án chính xác là: S = {3; -5}.

Hướng dẫn giải phương trình tích:
- Cho từng nhân tử bằng 0:
  + Trường hợp 1: 2x - 6 = 0 ⇔ 2x = 6 ⇔ x = 3.
  + Trường hợp 2: x + 5 = 0 ⇔ x = -5.
- Cả hai nghiệm đều là nghiệm của phương trình ban đầu.
- Vậy tập nghiệm của phương trình là S = {3; -5}.

Lưu ý: Khi chuyển vế, nhớ quy tắc bất hủ "chuyển vế phải đổi dấu" để không bị nhầm dấu +5 thành 5 nhé!`
      },
      {
        id: 't2-ex2',
        level: 'trung-binh',
        levelLabel: 'Thông hiểu',
        question: 'Điều kiện xác định của phương trình (x - 2)/(x + 3) + 5/(x² - 9) = 0 là:',
        options: ['x ≠ ±3', 'x ≠ -3', 'x ≠ 3', 'x ≠ 9'],
        correctAnswer: 'x ≠ ±3',
        explanation: `Đáp án đúng là: x ≠ ±3.

Phân tích chi tiết vì sao lại như vậy:
- Mẫu thứ nhất là (x + 3), điều kiện khác 0 là: x + 3 ≠ 0 ⇔ x ≠ -3.
- Mẫu thứ hai là (x² - 9) = (x - 3)(x + 3), điều kiện khác 0 là: x² - 9 ≠ 0 ⇔ x² ≠ 9 ⇔ x ≠ ±3.
- Kết hợp cả hai điều kiện lại, ta có điều kiện xác định chung là x ≠ 3 và x ≠ -3 (viết gọn là x ≠ ±3).

Cảnh báo bẫy thi cử: Nhiều bạn chỉ nhìn thấy mẫu đầu x + 3 rồi vội vàng kết luận x ≠ -3 mà quên mất mẫu thứ hai còn có nghiệm x = 3 làm mẫu bằng 0. Hãy luôn phân tích các mẫu thành nhân tử trước khi kết luận ĐKXĐ nhé!`
      }
    ]
  },

  'toan-t3-he-phuong-trinh': {
    moduleId: 'toan-t3-he-phuong-trinh',
    theory: `Hệ phương trình bậc nhất hai ẩn và dạng toán "Giải bài toán bằng cách lập hệ phương trình" là phần thi chiếm trọn 2.0 điểm trong cấu trúc đề thi tuyển sinh vào lớp 10. Đây là phần bài tập bạn hoàn toàn có thể giành trọn điểm số tối đa nếu biết cách lập luận logic và trình bày khoa học!

I. HAI PHƯƠNG PHÁP CỐT LÕI GIẢI HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
Hệ tổng quát: { a1.x + b1.y = c1 (1) ; a2.x + b2.y = c2 (2) }
1. Phương pháp thế:
   - Khi nào nên dùng? Khi hệ số của một trong các ẩn bằng 1 hoặc -1 (rất dễ rút ra).
   - Cách làm: Từ một phương trình, biểu diễn một ẩn theo ẩn còn lại (ví dụ y = c1 - a1.x), rồi THẾ vào phương trình kia để thu được phương trình một ẩn x duy nhất.
2. Phương pháp cộng đại số (Phương pháp được sử dụng nhiều nhất):
   - Khi nào nên dùng? Áp dụng hiệu quả cho hầu hết các hệ phương trình.
   - Cách làm:
     + Nếu hệ số của cùng một ẩn trong hai phương trình BẰNG NHAU: Trừ từng vế hai phương trình cho nhau.
     + Nếu hệ số của cùng một ẩn ĐỐI NHAU: Cộng từng vế hai phương trình lại với nhau.
     + Nếu hệ số chưa bằng/đối nhau: Nhân hai vế của mỗi phương trình với các số thích hợp để đưa về hệ số bằng nhau hoặc đối nhau rồi tiến hành cộng/trừ triệt tiêu ẩn.

II. CẨM NANG 4 BƯỚC GIẢI BÀI TOÁN BẰNG CÁCH LẬP HỆ PHƯƠNG TRÌNH
Nên lập bảng phân tích 3 cột trước khi viết bài tự luận:
- Bước 1: Chọn hai ẩn số x và y (thường đề hỏi gì thì đặt trực tiếp cái đó làm ẩn).
  + Bắt buộc phải có: Đơn vị đo (km/h, ngày, người, đồng...) và Điều kiện của ẩn (x > 0, x nguyên dương, x < tổng...). Quên điều kiện bị trừ 0.25đ!
- Bước 2: Biểu diễn các đại lượng chưa biết qua ẩn và các đại lượng đã biết theo đề bài.
- Bước 3: Lập hai phương trình độc lập dựa trên hai mối liên hệ trong đề bài để tạo thành hệ phương trình.
- Bước 4: Giải hệ phương trình, ĐỐI CHIẾU NGHIỆM với điều kiện ở Bước 1 và viết câu trả lời kết luận kèm đơn vị.

III. CÁC DẠNG TOÁN THỰC TẾ ĐIỂN HÌNH TRONG ĐỀ THI VÀO 10
1. Toán chuyển động: Công thức vàng: Quãng đường = Vận tốc × Thời gian (S = v . t).
   - Chuyển động xuôi dòng - ngược dòng nước:
     + Vận tốc xuôi dòng = Vận tốc thực của tàu + Vận tốc dòng nước.
     + Vận tốc ngược dòng = Vận tốc thực của tàu - Vận tốc dòng nước.
2. Toán năng suất / Làm chung - Làm riêng:
   - Khối lượng công việc = Năng suất 1 ngày (hoặc 1 giờ) × Thời gian làm.
   - Quy ước: Toàn bộ công việc hoàn thành coi là 1 đơn vị công việc.
   - Nếu đội 1 làm một mình xong trong x ngày thì trong 1 ngày đội 1 làm được 1/x (công việc).
3. Toán phần trăm, tiền tệ:
   - Giá sau khi tăng a% = Giá gốc . (1 + a/100).
   - Giá sau khi giảm b% = Giá gốc . (1 - b/100).`,
    formulas: [
      'Hệ phương trình bậc nhất hai ẩn: { a1.x + b1.y = c1 ; a2.x + b2.y = c2 }',
      'Toán chuyển động: S = v . t ; t = S / v ; v = S / t',
      'Chuyển động dòng nước: v_xuôi = v_tàu + v_nước ; v_ngược = v_tàu - v_nước',
      'Toán làm chung làm riêng: Năng suất 1 ngày = 1 / (Thời gian hoàn thành một mình)'
    ],
    examples: [
      {
        title: 'Ví dụ 1: Giải hệ phương trình bằng phương pháp cộng đại số',
        problem: 'Giải hệ phương trình sau: { 3x + 2y = 8 ; 2x - y = 3 }',
        solution: `Chúng ta cùng quan sát: Ở phương trình (2) hệ số của y là -1, ở phương trình (1) hệ số của y là 2.
Ta chỉ cần nhân phương trình (2) với 2 để hệ số của y trở thành -2 (đối nhau), khi đó cộng lại sẽ triệt tiêu y rất đẹp!

• Lời giải chi tiết:
Hệ phương trình đã cho:
{ 3x + 2y = 8   (1)
{ 2x - y = 3    (2)

Nhân cả hai vế của phương trình (2) với 2, ta được:
{ 3x + 2y = 8
{ 4x - 2y = 6

Cộng từng vế hai phương trình trên với nhau:
(3x + 4x) + (2y - 2y) = 8 + 6
⇔ 7x = 14
⇔ x = 14 / 7 = 2.

Thay x = 2 vào phương trình ban đầu (2):
2.(2) - y = 3
⇔ 4 - y = 3
⇔ y = 4 - 3 = 1.

Kết luận: Vậy hệ phương trình đã cho có nghiệm duy nhất (x; y) = (2; 1).`,
        tip: 'Khi kết luận nghiệm của hệ phương trình, bạn phải viết dưới dạng cặp số (x; y) = (2; 1), tuyệt đối không viết rời rạc x = 2; y = 1 kẻo bị mất điểm hình thức.'
      },
      {
        title: 'Ví dụ 2: Giải bài toán làm chung làm riêng bằng cách lập hệ phương trình',
        problem: 'Hai tổ công nhân cùng làm chung một công việc thì sau 12 giờ sẽ hoàn thành. Nếu tổ một làm trong 4 giờ rồi tổ hai đến làm tiếp trong 10 giờ thì cả hai tổ hoàn thành được 7/12 công việc. Hỏi nếu làm riêng thì mỗi tổ phải mất bao nhiêu giờ để hoàn thành công việc?',
        solution: `Gọi thời gian tổ một làm một mình hoàn thành công việc là x (giờ).
Gọi thời gian tổ hai làm một mình hoàn thành công việc là y (giờ).
Điều kiện: x > 12, y > 12.

Trong 1 giờ:
- Tổ một làm được 1/x (công việc).
- Tổ hai làm được 1/y (công việc).

Vì hai tổ cùng làm chung thì sau 12 giờ hoàn thành xong công việc nên trong 1 giờ cả hai tổ làm được 1/12 công việc. Ta có phương trình:
1/x + 1/y = 1/12  (1)

Vì tổ một làm trong 4 giờ và tổ hai làm trong 10 giờ thì hoàn thành 7/12 công việc, ta có phương trình:
4/x + 10/y = 7/12  (2)

Từ (1) và (2) ta có hệ phương trình:
{ 1/x + 1/y = 1/12
{ 4/x + 10/y = 7/12

Đặt u = 1/x, v = 1/y (điều kiện u > 0, v > 0), hệ trở thành:
{ u + v = 1/12
{ 4u + 10v = 7/12

Nhân phương trình đầu với 4:
{ 4u + 4v = 1/3
{ 4u + 10v = 7/12

Trừ vế theo vế ta được:
6v = 7/12 - 1/3 = 1/4 ⇒ v = 1/24.
Thay v = 1/24 vào u + v = 1/12 ta được:
u = 1/12 - 1/24 = 1/24.

Suy ra:
1/x = 1/24 ⇒ x = 24 (thỏa mãn điều kiện).
1/y = 1/24 ⇒ y = 24 (thỏa mãn điều kiện).

Vậy nếu làm riêng, tổ một cần 24 giờ và tổ hai cần 24 giờ để hoàn thành công việc.`,
        tip: 'Với dạng bài làm chung làm riêng, đặt ẩn phụ u = 1/x, v = 1/y giúp giải hệ cực nhanh và không bao giờ bị rối mẫu thức.'
      }
    ],
    exercises: [
      {
        id: 't3-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Cặp số (x; y) nào sau đây là nghiệm của hệ phương trình { x + y = 10 ; x - y = 4 }?',
        options: ['(7; 3)', '(3; 7)', '(6; 4)', '(8; 2)'],
        correctAnswer: '(7; 3)',
        explanation: `Đáp án đúng là: (7; 3).

Hướng dẫn giải cực nhanh:
- Cộng từng vế hai phương trình:
  (x + y) + (x - y) = 10 + 4
  ⇔ 2x = 14 ⇔ x = 7.
- Thay x = 7 vào phương trình đầu x + y = 10:
  7 + y = 10 ⇔ y = 10 - 7 = 3.
- Vậy nghiệm của hệ phương trình là (x; y) = (7; 3).

Cảnh báo: Chú ý thứ tự của nghiệm là (x; y), nếu bạn nào chọn (3; 7) là nhầm lẫn vị trí của x và y đấy nhé!`
      }
    ]
  },

  'toan-t4-ham-so-do-thi': {
    moduleId: 'toan-t4-ham-so-do-thi',
    theory: `Chuyên đề hàm số và đồ thị là cầu nối quan trọng giữa Đại số và Hình học giải tích. Trong đề thi vào 10, câu hỏi về Parabol (P): y = ax² và đường thẳng (d): y = mx + n luôn chiếm từ 1.0 đến 1.5 điểm. Bạn cần nắm thật vững lý thuyết và các dạng toán tương giao dưới đây:

I. ĐỒ THỊ HÀM SỐ BẬC HAI (PARABOL): y = ax² (a ≠ 0)
1. Tính chất cơ bản:
   - Đồ thị Parabol (P) luôn đi qua gốc tọa độ O(0; 0) và nhận trục tung Oy (đường thẳng x = 0) làm trục đối xứng.
   - Nếu a > 0: Đồ thị có bề lõm quay lên trên, O(0; 0) là điểm thấp nhất của đồ thị. Hàm số đồng biến khi x > 0 và nghịch biến khi x < 0.
   - Nếu a < 0: Đồ thị có bề lõm quay xuống dưới, O(0; 0) là điểm cao nhất của đồ thị. Hàm số đồng biến khi x < 0 và nghịch biến khi x > 0.
2. Quy tắc vẽ Parabol chuẩn chỉ để lấy trọn điểm vẽ hình:
   - Luôn lập bảng giá trị gồm 5 điểm đối xứng nhau qua trục tung:
     x = -2, x = -1, x = 0, x = 1, x = 2 (kèm theo các giá trị y tương ứng).
   - Vẽ đường cong parabol mềm mại, không dùng thước thẳng nối gấp khúc.

II. ĐƯỜNG THẲNG (d): y = mx + n
- Hệ số góc m: Nếu m > 0 hàm số đồng biến (đường đi lên từ trái sang phải); nếu m < 0 hàm số nghịch biến (đường đi xuống).
- Hai đường thẳng d1: y = a1.x + b1 và d2: y = a2.x + b2:
  + Song song với nhau: ⇔ a1 = a2 và b1 ≠ b2.
  + Trùng nhau: ⇔ a1 = a2 và b1 = b2.
  + Cắt nhau: ⇔ a1 ≠ a2.
  + Vuông góc với nhau: ⇔ a1 . a2 = -1 (Tính chất đặc biệt hay dùng trong câu điểm 9-10!).

III. BÀI TOÁN TƯƠNG GIAO GIỮA PARABOL (P) VÀ ĐƯỜNG THẲNG (d)
Đây là câu hỏi xuất hiện 100% trong đề thi vào 10!
Xét (P): y = ax² và (d): y = mx + n.
- Bước 1: Thiết lập PHƯƠNG TRÌNH HOÀNH ĐỘ GIAO ĐIỂM:
  ax² = mx + n ⇔ ax² - mx - n = 0 (*)
- Bước 2: Số giao điểm của (d) và (P) chính bằng số nghiệm của phương trình (*):
  + Biệt thức Δ > 0: Phương trình (*) có 2 nghiệm phân biệt ⇒ (d) CẮT (P) tại 2 điểm phân biệt.
  + Biệt thức Δ = 0: Phương trình (*) có nghiệm kép ⇒ (d) TIẾP XÚC với (P) tại 1 điểm duy nhất (tiếp điểm).
  + Biệt thức Δ < 0: Phương trình (*) vô nghiệm ⇒ (d) và (P) KHÔNG CÓ ĐIỂM CHUNG (không cắt nhau).
- Bước 3: Tìm tọa độ giao điểm: Sau khi giải tìm được hoành độ x, thay vào công thức của (P) hoặc (d) để tìm tung độ y tương ứng, rồi kết luận tọa độ điểm A(x1; y1) và B(x2; y2).`,
    formulas: [
      'Phương trình hoành độ giao điểm của (P): y = ax² và (d): y = mx + n là: ax² - mx - n = 0',
      '(d) cắt (P) tại 2 điểm phân biệt ⇔ Δ > 0',
      '(d) tiếp xúc với (P) ⇔ Δ = 0 (Hoành độ tiếp điểm là nghiệm kép x = -b / (2a))',
      '(d) và (P) không giao nhau ⇔ Δ < 0',
      'Hai đường thẳng vuông góc: a1 . a2 = -1'
    ],
    examples: [
      {
        title: 'Ví dụ: Tìm tọa độ giao điểm của Parabol và Đường thẳng',
        problem: 'Cho Parabol (P): y = x² và đường thẳng (d): y = 2x + 3. Hãy tìm tọa độ các giao điểm của (d) và (P).',
        solution: `Phương trình hoành độ giao điểm của Parabol (P) và đường thẳng (d) là:
x² = 2x + 3 ⇔ x² - 2x - 3 = 0  (*)

Phương trình (*) có các hệ số: a = 1, b = -2, c = -3.
Nhận thấy a - b + c = 1 - (-2) + (-3) = 0 nên phương trình có hai nghiệm:
x1 = -1
x2 = -c / a = -(-3) / 1 = 3.

Tìm tung độ các giao điểm:
- Với x1 = -1 ⇒ y1 = (-1)² = 1 ⇒ Giao điểm A(-1; 1).
- Với x2 = 3 ⇒ y2 = 3² = 9 ⇒ Giao điểm B(3; 9).

Vậy đường thẳng (d) cắt Parabol (P) tại hai điểm phân biệt là A(-1; 1) và B(3; 9).`,
        tip: 'Khi giải phương trình hoành độ giao điểm, luôn kiểm tra nhẩm nghiệm a + b + c = 0 hoặc a - b + c = 0 để tìm nghiệm nhanh và không bị sai sót khi tính Δ!'
      }
    ],
    exercises: [
      {
        id: 't4-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Đồ thị Parabol y = -3x² có đặc điểm nào sau đây?',
        options: [
          'Đi qua gốc O(0; 0), nhận Oy làm trục đối xứng và bề lõm quay xuống dưới',
          'Bề lõm quay lên trên, O(0; 0) là điểm thấp nhất',
          'Nằm hoàn toàn ở phía trên trục hoành Ox',
          'Đi qua điểm M(1; 3)'
        ],
        correctAnswer: 'Đi qua gốc O(0; 0), nhận Oy làm trục đối xứng và bề lõm quay xuống dưới',
        explanation: `Đáp án chính xác là phương án đầu tiên.

Giải thích chi tiết:
- Hàm số có hệ số a = -3 < 0.
- Vì a < 0 nên với mọi x ≠ 0 thì y = -3x² < 0, do đó toàn bộ đồ thị nằm ở phía dưới trục hoành (chỉ chạm trục hoành tại O(0; 0)).
- Điểm O(0; 0) là điểm cao nhất của đồ thị và bề lõm của Parabol quay xuống dưới.
- Nếu x = 1 thì y = -3.(1)² = -3, chứ không phải bằng 3 (nên điểm M(1; 3) không thuộc đồ thị).`
      }
    ]
  },

  'toan-t5-phuong-trinh-bac-hai-viet': {
    moduleId: 'toan-t5-phuong-trinh-bac-hai-viet',
    theory: `Hệ thức Vi-ét và các bài toán liên quan đến phương trình bậc hai một ẩn là "đặc sản" không thể thiếu trong đề thi tuyển sinh vào lớp 10 THPT (thường chiếm từ 1.5 đến 2.0 điểm). Nắm chắc công thức nghiệm và hệ thức Vi-ét sẽ giúp bạn tự tin chinh phục điểm 8, 9 một cách dễ dàng!

I. CÔNG THỨC NGHIỆM PHƯƠNG TRÌNH BẬC HAI: ax² + bx + c = 0 (a ≠ 0)
1. Biệt thức tổng quát Δ = b² - 4ac:
   - Δ > 0: Phương trình có hai nghiệm phân biệt: x1,2 = (-b ± √Δ) / (2a).
   - Δ = 0: Phương trình có nghiệm kép: x1 = x2 = -b / (2a).
   - Δ < 0: Phương trình vô nghiệm trên tập số thực.
2. Công thức nghiệm thu gọn (Khi b = 2b\' là số chẵn):
   - Tính Δ\' = b\'² - ac.
   - Δ\' > 0: Phương trình có hai nghiệm phân biệt: x1,2 = (-b\' ± √Δ\') / a.
   - Mẹo hay: Khi hệ số b là số chẵn (như ±2, ±4, ±6...), bạn nên DÙNG Δ\' để biểu thức gọn gàng và tránh tính toán các con số quá lớn!

II. ĐỊNH LÝ VI-ÉT (VIÈTE) - VIÊN NGỌC QUÝ CỦA ĐẠI SỐ
Nếu phương trình bậc hai ax² + bx + c = 0 (a ≠ 0) CÓ HAI NGHIỆM x1, x2 (tức là điều kiện Δ ≥ 0 đã được thỏa mãn), thì:
- Tổng hai nghiệm: S = x1 + x2 = -b / a
- Tích hai nghiệm: P = x1 . x2 = c / a

III. BỘ CÔNG THỨC BIỂU DIỄN ĐỐI XỨNG CẦN THUỘC LÒNG:
Để tính giá trị biểu thức hoặc tìm tham số m thỏa mãn biểu thức đối xứng giữa hai nghiệm, bạn cần đưa biểu thức về S và P:
1. x1² + x2² = (x1 + x2)² - 2x1.x2 = S² - 2P
2. (x1 - x2)² = (x1 + x2)² - 4x1.x2 = S² - 4P ⇒ |x1 - x2| = √(S² - 4P)
3. x1³ + x2³ = (x1 + x2)³ - 3x1.x2.(x1 + x2) = S³ - 3SP
4. 1 / x1 + 1 / x2 = (x1 + x2) / (x1.x2) = S / P (với P ≠ 0)
5. x1 / x2 + x2 / x1 = (x1² + x2²) / (x1.x2) = (S² - 2P) / P (với P ≠ 0)

IV. LỖI SAI KINH ĐIỂN CỦA HỌC SINH MÀ GIÁM KHẢO RẤT HAY TRỪ ĐIỂM:
- Quên đặt điều kiện phương trình có nghiệm (Δ ≥ 0 hoặc Δ > 0): Rất nhiều bạn lao vào viết hệ thức Vi-ét ngay khi chưa tìm điều kiện của tham số m để phương trình có hai nghiệm. Lỗi này bị trừ từ 0.25 đến 0.5 điểm!
- Quên kiểm tra điều kiện a ≠ 0 khi phương trình chứa tham số ở hệ số a (ví dụ (m - 1)x²...).`,
    formulas: [
      'Δ = b² - 4ac ; Δ\' = b\'² - ac (khi b = 2b\')',
      'Định lý Vi-ét: S = x1 + x2 = -b / a ; P = x1 . x2 = c / a',
      'x1² + x2² = S² - 2P',
      '(x1 - x2)² = S² - 4P',
      '1 / x1 + 1 / x2 = S / P (với P ≠ 0)'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính giá trị biểu thức đối xứng bằng định lý Vi-ét',
        problem: 'Cho phương trình bậc hai: x² - 6x + 4 = 0. Không giải phương trình, hãy tính giá trị của biểu thức A = x1² + x2² và B = 1/x1 + 1/x2.',
        solution: `Phương trình có: a = 1, b' = -3, c = 4.
Biệt thức Δ' = (-3)² - 1.4 = 5 > 0 nên phương trình có hai nghiệm phân biệt x1, x2.

Theo định lý Vi-ét:
S = x1 + x2 = -b / a = 6
P = x1 . x2 = c / a = 4.

Ta có:
1) A = x1² + x2² = (x1 + x2)² - 2x1.x2 = S² - 2P = 6² - 2.4 = 28.
2) B = 1/x1 + 1/x2 = (x1 + x2) / (x1 . x2) = S / P = 6 / 4 = 3/2.

Vậy A = 28 và B = 3/2.`,
        tip: 'Luôn tính Δ hoặc Δ\' trước để khẳng định phương trình có hai nghiệm rồi mới áp dụng hệ thức Vi-ét.'
      }
    ],
    exercises: [
      {
        id: 't5-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Tổng hai nghiệm S và tích hai nghiệm P của phương trình 3x² - 9x + 2 = 0 là:',
        options: ['S = 3 và P = 2/3', 'S = -3 và P = 2/3', 'S = 3 và P = -2/3', 'S = 9 và P = 2'],
        correctAnswer: 'S = 3 và P = 2/3',
        explanation: `Đáp án đúng là: S = 3 và P = 2/3.

Hướng dẫn chi tiết:
- Xác định hệ số: a = 3, b = -9, c = 2.
- Kiểm tra Δ: Δ = (-9)² - 4.3.2 = 81 - 24 = 57 > 0 (phương trình có 2 nghiệm phân biệt).
- Theo hệ thức Vi-ét:
  + Tổng hai nghiệm: S = x1 + x2 = -b / a = -(-9) / 3 = 9 / 3 = 3.
  + Tích hai nghiệm: P = x1 . x2 = c / a = 2 / 3.

Lưu ý: Công thức tổng là CÓ DẤU TRỪ: -b/a, còn tích là KHÔNG CÓ DẤU TRỪ: c/a. Đừng nhớ lộn dấu nhé!`
      }
    ]
  },

  'toan-t6-bat-dang-thuc-cuc-tri': {
    moduleId: 'toan-t6-bat-dang-thuc-cuc-tri',
    theory: `Bài toán Bất đẳng thức và Tìm giá trị lớn nhất (GTLN), giá trị nhỏ nhất (GTNN) là câu hỏi số 5 (câu phân loại cuối cùng, chiếm 0.5 đến 1.0 điểm) trong đề thi tuyển sinh vào lớp 10. Dù là câu khó nhất, nhưng nếu nắm được tư duy chọn "điểm rơi" và các bất đẳng thức kinh điển, bạn hoàn toàn có thể chinh phục được câu điểm 10 này!

I. BẤT ĐẲNG THỨC CAUCHY (AM - GM) CHO HAI SỐ KHÔNG ÂM
1. Định lý: Cho hai số thực không âm a, b ≥ 0:
   (a + b) / 2 ≥ √(ab)  ⇔  a + b ≥ 2√(ab)
2. Điều kiện xảy ra dấu đẳng thức (Dấu "=" xảy ra):
   Dấu "=" xảy ra khi và chỉ khi a = b.
3. Bản chất tư duy:
   - Nếu tích a . b là một hằng số (không đổi), thì tổng a + b đạt giá trị nhỏ nhất khi a = b.
   - Nếu tổng a + b là một hằng số, thì tích a . b đạt giá trị lớn nhất khi a = b.

II. CÁC HỆ QUẢ VÀ BẤT ĐẲNG THỨC PHỤ THƯỜNG DÙNG TRONG ĐỀ THI
- BĐT cộng mẫu số Bunhiacopxki dạng Engel (Schwarz) cho 2 số:
  1/a + 1/b ≥ 4 / (a + b) (với a, b > 0; dấu "=" khi a = b).
- BĐT bình phương:
  a² + b² ≥ 2ab  và  (a + b)² ≥ 4ab (dấu "=" khi a = b).
  a² + b² ≥ (a + b)² / 2 (dấu "=" khi a = b).

III. KỸ THUẬT CHỌN "ĐIỂM RƠI" - BÍ QUYẾT VÀNG ĐẠT ĐIỂM 10:
- Điểm rơi là gì? Điểm rơi là giá trị của các biến số khi biểu thức đạt cực trị (GTLN hoặc GTNN).
- Trong các bài toán có tính đối xứng giữa các biến (ví dụ cho x, y > 0 thỏa mãn x + y = 2), điểm rơi thông thường nhất là các biến bằng nhau: x = y = 1.
- Sau khi dự đoán được điểm rơi, bạn hãy tách ghép các số hạng sao cho tại điểm rơi đó, các đại lượng áp dụng Cauchy phải bằng nhau, đồng thời khi nhân lại thì triệt tiêu hết biến số!`,
    formulas: [
      'a + b ≥ 2√(ab) (với a, b ≥ 0; dấu "=" ⇔ a = b)',
      '1/a + 1/b ≥ 4 / (a + b) (với a, b > 0; dấu "=" ⇔ a = b)',
      'a² + b² ≥ 2ab (với mọi a, b; dấu "=" ⇔ a = b)',
      '(a + b)² ≥ 4ab ⇔ ab ≤ (a + b)² / 4'
    ],
    examples: [
      {
        title: 'Ví dụ: Tìm giá trị nhỏ nhất bằng kỹ thuật Cauchy nghịch đảo',
        problem: 'Cho số thực dương x > 0. Tìm giá trị nhỏ nhất (GTNN) của biểu thức P = x + 9 / x.',
        solution: `Vì x > 0 nên 9/x > 0.
Áp dụng bất đẳng thức Cauchy cho hai số dương x và 9/x, ta có:
P = x + 9/x ≥ 2.√(x . 9/x) = 2.√9 = 6.

Dấu "=" xảy ra khi và chỉ khi:
x = 9/x ⇔ x² = 9 ⇔ x = 3 (do x > 0).

Vậy giá trị nhỏ nhất của P là 6, đạt được khi x = 3.`,
        tip: 'Khi làm bài tìm cực trị, luôn luôn phải có bước chỉ ra dấu "=" xảy ra khi nào. Nếu thiếu bước này, bài làm sẽ bị trừ 0.25 điểm!'
      }
    ],
    exercises: [
      {
        id: 't6-ex1',
        level: 'trung-binh',
        levelLabel: 'Thông hiểu',
        question: 'Với hai số dương a và b, bất đẳng thức nào sau đây luôn đúng và dấu đẳng thức xảy ra khi nào?',
        options: [
          'a + b ≥ 2√(ab), dấu "=" xảy ra khi a = b',
          'a + b ≤ 2√(ab), dấu "=" xảy ra khi a = b',
          'a + b ≥ 2√(ab), dấu "=" xảy ra khi a = 2b',
          'ab ≥ 2(a + b), dấu "=" xảy ra khi a = b'
        ],
        correctAnswer: 'a + b ≥ 2√(ab), dấu "=" xảy ra khi a = b',
        explanation: `Đáp án chính xác là: a + b ≥ 2√(ab), dấu "=" xảy ra khi a = b.

Giải thích chi tiết:
- Xuất phát từ hằng đẳng thức hiển nhiên: (√a - √b)² ≥ 0 với mọi a, b ≥ 0.
- Khai triển ra: a - 2√(ab) + b ≥ 0 ⇔ a + b ≥ 2√(ab).
- Dấu "=" xảy ra khi (√a - √b)² = 0 ⇔ √a = √b ⇔ a = b.
- Đây chính là Bất đẳng thức Cauchy (AM-GM) cho hai số không âm, công cụ số một để giải các bài toán cực trị trong đề thi vào 10.`
      }
    ]
  },

  'toan-t7-he-thuc-luong': {
    moduleId: 'toan-t7-he-thuc-luong',
    theory: `Phần Hình học lớp 9 mở đầu bằng chuyên đề "Hệ thức lượng trong tam giác vuông" và "Tỉ số lượng giác của góc nhọn". Đây là mảng kiến thức xuất hiện trong mọi đề thi tuyển sinh vào 10, đặc biệt là ở câu hỏi thực tế đo chiều cao, khoảng cách (thường chiếm 0.5 đến 1.0 điểm). Dưới đây là 5 hệ thức trọng tâm bạn cần ghi nhớ:

I. 5 HỆ THỨC LƯỢNG VÀNG TRONG TAM GIÁC VUÔNG
Xét tam giác ABC vuông tại A, đường cao AH hạ từ A xuống cạnh huyền BC.
Quy ước độ dài: Cạnh huyền a = BC; Cạnh góc vuông b = AC, c = AB; Đường cao h = AH; Hình chiếu của b trên BC là b\' = CH; Hình chiếu của c trên BC là c\' = BH.
1. Định lý Pythagoras huyền thoại: a² = b² + c² (BC² = AB² + AC²).
2. Bình phương cạnh góc vuông bằng tích cạnh huyền và hình chiếu:
   b² = a . b\'  (AC² = BC . CH)
   c² = a . c\'  (AB² = BC . BH)
3. Bình phương đường cao bằng tích hai hình chiếu:
   h² = b\' . c\' (AH² = BH . CH)
4. Tích hai cạnh góc vuông bằng tích cạnh huyền và đường cao:
   b . c = a . h  (AB . AC = BC . AH)
5. Nghịch đảo bình phương đường cao bằng tổng nghịch đảo bình phương hai cạnh góc vuông:
   1 / h² = 1 / b² + 1 / c²  (1 / AH² = 1 / AB² + 1 / AC²)

II. TỈ SỐ LƯỢNG GIÁC CỦA GÓC NHỌN α (0° < α < 90°)
Bài thơ mẹo nhớ muôn đời của học trò Việt Nam:
"Sao Đi Học (Sin = Đối / Huyền)
 Cứ Khóc Hoài (Cos = Kề / Huyền)
 Thôi Đừng Khóc (Tan = Đối / Kề)
 Có Kẹo Đây (Cot = Kề / Đối)"

- Công thức liên hệ quan trọng:
  + tan α = sin α / cos α ; cot α = cos α / sin α ; tan α . cot α = 1.
  + sin² α + cos² α = 1 (Công thức lượng giác vàng!).
- Hai góc phụ nhau (α + β = 90°):
  sin α = cos β ; cos α = sin β ; tan α = cot β ; cot α = tan β.`,
    formulas: [
      'BC² = AB² + AC² (Định lý Pythagoras)',
      'AB² = BC . BH và AC² = BC . CH (Hệ thức cạnh và hình chiếu)',
      'AH² = BH . CH (Bình phương đường cao)',
      'AB . AC = BC . AH (Tích cạnh góc vuông = Cạnh huyền × Đường cao)',
      '1 / AH² = 1 / AB² + 1 / AC²',
      'sin = đối/huyền, cos = kề/huyền, tan = đối/kề, cot = kề/đối'
    ],
    examples: [
      {
        title: 'Ví dụ: Bài toán tính các cạnh và đường cao trong tam giác vuông',
        problem: 'Cho tam giác ABC vuông tại A có cạnh AB = 6cm, AC = 8cm. Đường cao AH hạ từ A xuống cạnh huyền BC. Hãy tính độ dài cạnh huyền BC, đường cao AH và các đoạn hình chiếu BH, CH.',
        solution: `Áp dụng định lý Pythagoras cho tam giác ABC vuông tại A:
BC² = AB² + AC² = 6² + 8² = 100
⇒ BC = √100 = 10 (cm).

Áp dụng hệ thức lượng AB . AC = BC . AH:
AH = (AB . AC) / BC = (6 . 8) / 10 = 4.8 (cm).

Áp dụng hệ thức lượng AB² = BC . BH:
BH = AB² / BC = 6² / 10 = 3.6 (cm).

Đoạn hình chiếu CH = BC - BH = 10 - 3.6 = 6.4 (cm).

Vậy BC = 10cm, AH = 4.8cm, BH = 3.6cm, CH = 6.4cm.`,
        tip: 'Bộ ba số Pythagoras kinh điển (3 - 4 - 5) hay (6 - 8 - 10) xuất hiện rất thường xuyên trong đề thi, bạn hãy nhớ để nhẩm nhanh kết quả.'
      }
    ],
    exercises: [
      {
        id: 't7-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Trong tam giác vuông ABC vuông tại A, tỉ số sin của góc nhọn B được định nghĩa là:',
        options: ['AC / BC (Cạnh đối / Cạnh huyền)', 'AB / BC (Cạnh kề / Cạnh huyền)', 'AC / AB (Cạnh đối / Cạnh kề)', 'AB / AC (Cạnh kề / Cạnh đối)'],
        correctAnswer: 'AC / BC (Cạnh đối / Cạnh huyền)',
        explanation: `Đáp án đúng là: AC / BC (Cạnh đối / Cạnh huyền).

Gợi ý bài thơ thần chú:
"Sao Đi Học" -> S (sin) = Đ (đối) / H (huyền).
Đối diện với góc B là cạnh AC, cạnh huyền đối diện góc vuông A là cạnh BC. Do đó sin B = AC / BC.`
      }
    ]
  },

  'toan-t8-duong-tron-tiep-tuyen': {
    moduleId: 'toan-t8-duong-tron-tiep-tuyen',
    theory: `Đường tròn là trung tâm của toàn bộ chương trình Hình học 9 và chiếm từ 3.0 đến 3.5 điểm trong đề thi vào 10. Để giải quyết được các câu hỏi hình học, điều đầu tiên bạn phải thuộc như in các định lý về đường kính, dây cung, tiếp tuyến và các loại góc với đường tròn.

I. MỐI QUAN HỆ GIỮA ĐƯỜNG KÍNH VÀ DÂY CUNG
1. Trong các dây của một đường tròn, đường kính là dây có độ dài lớn nhất.
2. Định lý vuông góc: Trong một đường tròn, đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy.
3. Định lý đảo: Đường kính đi qua trung điểm của một dây không đi qua tâm thì vuông góc với dây ấy.

II. TÍNH CHẤT HAI TIẾP TUYẾN CẮT NHAU - VŨ KHÍ SẮC BÉN
Cho đường tròn (O), từ điểm A nằm ngoài đường tròn kẻ hai tiếp tuyến AB và AC (B, C là hai tiếp điểm). Khi đó:
1. AB = AC (Hai đoạn tiếp tuyến kẻ từ một điểm thì bằng nhau).
2. Tia AO là tia phân giác của góc BAC (Tia nối điểm đó với tâm là phân giác góc tạo bởi hai tiếp tuyến).
3. Tia OA là tia phân giác của góc BOC (Tia nối tâm với điểm đó là phân giác góc ở tâm).
4. Đường thẳng AO là đường TRUNG TRỰC của đoạn thẳng nối hai tiếp điểm BC (tức là AO ⊥ BC tại trung điểm của BC). Đây là chìa khóa chứng minh vuông góc cực kỳ phổ biến!

III. CÁC LOẠI GÓC VỚI ĐƯỜNG TRÒN CẦN PHÂN BIỆT RÕ:
1. Góc ở tâm: Đỉnh trùng với tâm đường tròn. Số đo góc ở tâm = Số đo cung bị chắn.
2. Góc nội tiếp: Đỉnh nằm trên đường tròn, hai cạnh chứa hai dây cung.
   - Số đo góc nội tiếp = 1/2 Số đo cung bị chắn.
   - Hệ quả vàng: Góc nội tiếp chắn nửa đường tròn là góc vuông (bằng 90°)! Bất kỳ khi nào thấy tam giác nội tiếp nhận đường kính làm một cạnh, bạn kết luận ngay tam giác đó vuông!
   - Trong một đường tròn, các góc nội tiếp cùng chắn một cung (hoặc chắn hai cung bằng nhau) thì bằng nhau.
3. Góc tạo bởi tia tiếp tuyến và dây cung:
   - Số đo = 1/2 Số đo cung bị chắn.
   - Định lý so sánh: Góc tạo bởi tia tiếp tuyến và dây cung và góc nội tiếp cùng chắn một cung thì BẰNG NHAU!`,
    formulas: [
      'Góc nội tiếp = 1/2 Số đo cung bị chắn',
      'Góc nội tiếp chắn nửa đường tròn = 90° (Tam giác vuông)',
      'Góc tạo bởi tiếp tuyến và dây cung = Góc nội tiếp cùng chắn một cung',
      'Tính chất 2 tiếp tuyến cắt nhau: AB = AC và AO là trung trực của BC (AO ⊥ BC)'
    ],
    examples: [
      {
        title: 'Ví dụ: Ứng dụng tính chất góc nội tiếp chắn nửa đường tròn',
        problem: 'Cho nửa đường tròn (O) đường kính AB = 10cm. Lấy điểm C thuộc nửa đường tròn sao cho AC = 6cm. Kẻ CH vuông góc với AB tại H. Tính độ dài đoạn BC và đường cao CH.',
        solution: `Ta có góc ACB là góc nội tiếp chắn nửa đường tròn đường kính AB
⇒ góc ACB = 90°, hay tam giác ABC vuông tại C.

Áp dụng định lý Pythagoras trong tam giác ABC vuông tại C:
BC² = AB² - AC² = 10² - 6² = 64
⇒ BC = √64 = 8 (cm).

Áp dụng hệ thức lượng trong tam giác ABC vuông tại C, đường cao CH:
AC . BC = AB . CH
⇒ CH = (AC . BC) / AB = (6 . 8) / 10 = 4.8 (cm).

Vậy BC = 8cm và CH = 4.8cm.`,
        tip: 'Khi vẽ hình thi vào 10, cứ thấy tam giác nội tiếp đường tròn có một cạnh là đường kính, hãy nhớ ký hiệu ngay góc vuông ở đỉnh đối diện!'
      }
    ],
    exercises: [
      {
        id: 't8-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Góc nội tiếp chắn nửa đường tròn có số đo bằng bao nhiêu độ?',
        options: ['90°', '180°', '60°', '45°'],
        correctAnswer: '90°',
        explanation: `Đáp án chính xác là: 90°.

Giải thích chi tiết:
- Nửa đường tròn có số đo cung bằng 180°.
- Theo định lý góc nội tiếp, số đo của góc nội tiếp bằng một nửa số đo của cung bị chắn: 180° / 2 = 90°.
- Do đó góc nội tiếp chắn nửa đường tròn luôn luôn là một góc vuông (90°).`
      }
    ]
  },

  'toan-t9-tu-giac-noi-tiep-tong-hop': {
    moduleId: 'toan-t9-tu-giac-noi-tiep-tong-hop',
    theory: `Bài hình tổng hợp (câu 4 trong đề thi vào 10) luôn chiếm từ 3.0 đến 3.5 điểm. Trong đó, câu a và câu b hầu như luôn xoay quanh bài toán: CHỨNG MINH TỨ GIÁC NỘI TIẾP. Đây là chiếc "chìa khóa vạn năng" mở ra toàn bộ các câu hỏi phía sau (như chứng minh tam giác đồng dạng, hệ thức hình học, ba điểm thẳng hàng, tiếp tuyến). Dưới đây là 4 dấu hiệu nhận biết trọng tâm:

I. 4 DẤU HIỆU NHẬN BIẾT TỨ GIÁC NỘI TIẾP KINH ĐIỂN
1. Dấu hiệu 1 (Tổng hai góc đối bằng 180° - Chiếm 70% các đề thi):
   - Định lý: Tứ giác có tổng hai góc đối diện bằng 180° thì nội tiếp được một đường tròn.
   - Thường gặp nhất: Tứ giác ABCD có góc A + góc C = 90° + 90° = 180° (thường tạo bởi hai đường cao hoặc tiếp tuyến vuông góc với bán kính).
2. Dấu hiệu 2 (Hai đỉnh kề cùng nhìn một cạnh - Cung chứa góc):
   - Định lý: Tứ giác có hai đỉnh kề nhau cùng nhìn cạnh chứa hai đỉnh còn lại dưới một góc bằng nhau α.
   - Ví dụ: Tứ giác ABCD có góc DAC = góc DBC (hai góc này cùng nhìn đoạn thẳng CD).
3. Dấu hiệu 3 (Góc ngoài bằng góc đối trong):
   - Định lý: Tứ giác có góc ngoài tại một đỉnh bằng góc trong tại đỉnh đối diện.
4. Dấu hiệu 4 (Bốn đỉnh cách đều một điểm):
   - Định lý: Tứ giác có 4 đỉnh cùng cách đều một điểm O cố định (OA = OB = OC = OD = R) thì tứ giác nội tiếp đường tròn tâm O bán kính R.

II. HỆ QUẢ VÀNG SAU KHI ĐÃ CHỨNG MINH ĐƯỢC TỨ GIÁC NỘI TIẾP
Ngay sau khi chứng minh xong tứ giác nội tiếp ở câu a, bạn phải NGHĨ NGAY ĐẾN:
1. Các góc nội tiếp cùng chắn một cung thì bằng nhau: Đây là công cụ cực mạnh để chuyển đổi góc trong câu b và câu c!
2. Tam giác đồng dạng và hệ thức tích (Phương tích):
   - Nếu hai đường chéo AC và BD cắt nhau tại I thì: IA . IC = IB . ID (chứng minh qua hai tam giác đồng dạng ΔIAB ∼ ΔIDC).
   - Nếu hai cạnh đối AB và CD kéo dài cắt nhau tại M thì: MA . MB = MC . MD.`,
    formulas: [
      'Góc đối 1 + Góc đối 2 = 180° ⇒ Tứ giác nội tiếp đường tròn',
      'Hai đỉnh kề cùng nhìn một cạnh dưới hai góc bằng nhau ⇒ Tứ giác nội tiếp',
      'Góc ngoài tại một đỉnh = Góc trong tại đỉnh đối diện ⇒ Tứ giác nội tiếp',
      'Tứ giác ABCD nội tiếp ⇒ Các góc cùng chắn một cung bằng nhau'
    ],
    examples: [
      {
        title: 'Ví dụ: Chứng minh tứ giác nội tiếp bằng dấu hiệu tổng hai góc đối 180°',
        problem: 'Cho tam giác ABC nhọn có ba đường cao AD, BE, CF cắt nhau tại trực tâm H. Chứng minh tứ giác BFHD và tứ giác CDHE là các tứ giác nội tiếp.',
        solution: `1) Chứng minh tứ giác BFHD nội tiếp:
Vì CF là đường cao của tam giác ABC nên CF ⊥ AB ⇒ góc BFH = 90°.
Vì AD là đường cao của tam giác ABC nên AD ⊥ BC ⇒ góc BDH = 90°.

Xét tứ giác BFHD có:
góc BFH + góc BDH = 90° + 90° = 180°.
Mà hai góc này ở vị trí đối diện nhau.
Vậy tứ giác BFHD nội tiếp đường tròn (đường kính BH).

2) Chứng minh tứ giác CDHE nội tiếp:
Ta có góc CDH = 90° (do AD ⊥ BC) và góc CEH = 90° (do BE ⊥ AC).
Xét tứ giác CDHE có:
góc CDH + góc CEH = 90° + 90° = 180°.
Mà hai góc này ở vị trí đối diện nhau.
Vậy tứ giác CDHE nội tiếp đường tròn (đường kính CH).`,
        tip: 'Mô hình tam giác có ba đường cao cắt nhau tại trực tâm H tạo ra tới 6 tứ giác nội tiếp khác nhau! bạn hãy rèn luyện nhìn hình thật nhanh mô hình này nhé.'
      }
    ],
    exercises: [
      {
        id: 't9-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Tứ giác MNPQ có góc M = 85° và góc P = 95°. Tứ giác MNPQ có nội tiếp được đường tròn hay không?',
        options: [
          'Có, vì hai góc đối diện có tổng số đo bằng 180°',
          'Không, vì các góc không phải là góc vuông 90°',
          'Chỉ nội tiếp khi MN = PQ',
          'Chưa đủ dữ kiện để khẳng định'
        ],
        correctAnswer: 'Có, vì hai góc đối diện có tổng số đo bằng 180°',
        explanation: `Phân tích:
- Trong tứ giác MNPQ, đỉnh M và đỉnh P là hai đỉnh đối diện nhau.
- Ta tính tổng hai góc đối diện: góc M + góc P = 85° + 95° = 180°.
- Theo dấu hiệu nhận biết số 1: Tứ giác có tổng hai góc đối diện bằng 180° thì luôn nội tiếp được trong một đường tròn.
- Do đó, tứ giác MNPQ chắc chắn nội tiếp được đường tròn.`
      }
    ]
  },

  'toan-t10-hinh-khong-gian': {
    moduleId: 'toan-t10-hinh-khong-gian',
    theory: `Chuyên đề cuối cùng trong chương trình Toán 9 là "Hình học không gian thực tế" (Hình trụ, Hình nón, Hình cầu). Trong cấu trúc đề thi vào 10 những năm gần đây, câu hỏi ứng dụng thực tế về hình không gian luôn chiếm từ 0.5 đến 1.0 điểm. Đây được coi là câu hỏi "cho điểm" nếu bạn thuộc lòng công thức và biết đổi đơn vị đo lường chính xác!

I. HÌNH TRỤ (Được tạo ra khi quay một hình chữ nhật một vòng quanh một cạnh cố định)
Các đại lượng: Bán kính đáy R, Chiều cao h (cũng chính là đường sinh l).
- Diện tích xung quanh: S_xq = 2πRh
- Diện tích toàn phần (gồm diện tích xung quanh + 2 đáy): S_tp = 2πRh + 2πR² = 2πR(h + R)
- Thể tích hình trụ: V = S_đáy . h = πR²h

II. HÌNH NÓN (Được tạo ra khi quay một tam giác vuông một vòng quanh một cạnh góc vuông)
Các đại lượng: Bán kính đáy R, Chiều cao h, Đường sinh l.
- Mối liên hệ Pythagoras không thể quên: l² = h² + R²  (Đường sinh là cạnh huyền tam giác vuông!).
- Diện tích xung quanh: S_xq = πRl
- Diện tích toàn phần (xung quanh + 1 đáy): S_tp = πRl + πR² = πR(l + R)
- Thể tích hình nón: V = (1/3)πR²h (Bằng một phần ba thể tích hình trụ có cùng đáy và chiều cao!).

III. HÌNH CẦU (Được tạo ra khi quay một nửa hình tròn quanh đường kính của nó)
Đại lượng duy nhất: Bán kính R (hoặc đường kính d = 2R).
- Diện tích mặt cầu: S = 4πR² = πd²
- Thể tích hình cầu: V = (4/3)πR³

IV. BÍ KÍP ĐỔI ĐƠN VỊ ĐO THỰC TẾ TRÁNH BỊ MẤT ĐIỂM NGỚ NGẨN:
- 1 lít = 1 dm³ = 1000 cm³ = 1000 ml.
- 1 m³ = 1000 lít = 1 000 000 cm³.
- Khi đề bài yêu cầu "lấy π ≈ 3.14" hoặc "làm tròn đến chữ số thập phân thứ hai", bạn phải đọc thật kỹ để làm tròn đúng yêu cầu của người ra đề!`,
    formulas: [
      'Hình trụ: V = πR²h ; S_xq = 2πRh ; S_tp = 2πRh + 2πR²',
      'Hình nón: V = (1/3)πR²h ; S_xq = πRl ; l² = h² + R²',
      'Hình cầu: V = (4/3)πR³ ; S = 4πR²',
      'Đổi đơn vị: 1 lít = 1 dm³ = 1000 cm³ = 1000 ml'
    ],
    examples: [
      {
        title: 'Ví dụ: Tính dung tích bồn nước hình trụ trong đời sống thực tế',
        problem: 'Một chiếc téc nước inox hình trụ có đường kính đáy d = 1.2m và chiều cao h = 1.8m. Hãy tính lượng nước tối đa mà chiếc téc nước này có thể chứa được (theo đơn vị lít, lấy π ≈ 3.14 và làm tròn đến hàng đơn vị).',
        solution: `Bán kính đáy của hình trụ là:
R = d / 2 = 1.2 / 2 = 0.6 (m).

Thể tích hình trụ là:
V = π . R² . h ≈ 3.14 . (0.6)² . 1.8 = 2.03472 (m³).

Đổi đơn vị sang lít (1 m³ = 1000 lít):
2.03472 m³ = 2034.72 (lít).

Làm tròn đến hàng đơn vị:
2035 (lít).

Vậy chiếc téc nước này có thể chứa tối đa khoảng 2035 lít nước.`,
        tip: 'Đề bài cho đường kính d thì việc đầu tiên phải chia đôi để tìm bán kính R trước khi ráp vào công thức tính diện tích hoặc thể tích bạn nhé!'
      }
    ],
    exercises: [
      {
        id: 't10-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Công thức chuẩn xác để tính thể tích V của một hình nón có bán kính đáy R và chiều cao h là:',
        options: ['V = (1/3)πR²h', 'V = πR²h', 'V = (4/3)πR²h', 'V = 2πRh'],
        correctAnswer: 'V = (1/3)πR²h',
        explanation: `Đáp án chính xác là: V = (1/3)πR²h.

Giải thích chi tiết:
- Thể tích hình trụ là V_trụ = πR²h.
- Hình nón có cùng đáy và chiều cao sẽ "thuôn nhọn" về đỉnh, và thể tích của nó chỉ bằng ĐÚNG MỘT PHẦN BA thể tích của hình trụ: V = (1/3)πR²h.
- Còn công thức (4/3)πR³ là của hình cầu, đừng nhầm lẫn nhé!`
      }
    ]
  },

  // ============================ NGỮ VĂN 9 (V1 - V6) ============================
  'van-v1-doc-hieu-nghe-thuat': {
    moduleId: 'van-v1-doc-hieu-nghe-thuat',
    theory: `I. 6 PHƯƠNG THỨC BIỂU ĐẠT CHÍNH
1. Tự sự: Kể lại diễn biến chuỗi sự việc có nhân vật, cốt truyện.
2. Miêu tả: Tái hiện đường nét, màu sắc, hình ảnh giúp sự vật hiện lên sống động.
3. Biểu cảm: Bộc lộ trực tiếp cảm xúc, tình cảm, rung động tâm hồn.
4. Nghị luận: Bàn bạc, đưa ra ý kiến, lí lẽ, dẫn chứng nhằm thuyết phục người đọc.
5. Thuyết minh: Cung cấp tri thức khách quan, chuẩn xác về sự vật, hiện tượng.
6. Hành chính - công vụ: Giao tiếp hành chính giữa các cơ quan, cá nhân.

II. KỸ THUẬT TRẢ LỜI CÂU HỎI ĐỌC HIỂU
• Câu 1 (Nhận biết): Trả lời ngắn gọn, chính xác bằng một câu hoàn chỉnh, trích dẫn đúng từ ngữ trong văn bản.
• Câu 2-3 (Thông hiểu): Giải thích ý nghĩa câu nói / hình ảnh, chia thành 2 ý: nghĩa đen (nghĩa bề mặt) và nghĩa bóng (tầng nghĩa sâu xa).
• Câu 4 (Vận dụng): Rút ra thông điệp hoặc bài học: Nêu rõ thông điệp + Lí giải vì sao em chọn thông điệp đó (2 - 3 câu).`,
    formulas: [
      'Nhận biết 6 Phương thức biểu đạt: Tự sự (kể việc), Miêu tả (tả cảnh/người), Biểu cảm (bộc lộ cảm xúc), Thuyết minh (tri thức khách quan), Nghị luận (bàn luận đúng sai), Hành chính - công vụ.',
      'Xác định 6 Phong cách ngôn ngữ: Sinh hoạt (giao tiếp hằng ngày), Nghệ thuật (văn học hình tượng), Báo chí (thời sự, tin tức), Chính luận (chính trị, xã hội), Khoa học, Hành chính.',
      'Công thức trả lời câu hỏi thông điệp: 1. Nêu thông điệp cốt lõi → 2. Lí giải vì sao em chọn thông điệp đó (2-3 câu) → 3. Liên hệ hành động thực tế của bản thân.',
      'Công thức câu hỏi nhận biết: Trả lời trọn vẹn 1 câu hoàn chỉnh + Trích dẫn nguyên văn từ ngữ/chi tiết trong ngữ liệu đề bài.',
      'Kỹ thuật giải nghĩa từ/hình ảnh: Nêu nghĩa đen (nghĩa gốc bề mặt) + Nêu nghĩa bóng (tầng nghĩa biểu tượng, thông điệp sâu xa tác giả gửi gắm).'
    ],
    examples: [
      {
        title: 'Ví dụ: Trả lời câu hỏi thông điệp đọc hiểu',
        problem: 'Đề bài: Thông điệp ý nghĩa nhất mà em rút ra từ văn bản nói về lòng biết ơn là gì? Hãy lí giải ngắn gọn.',
        solution: `• Thông điệp ý nghĩa nhất với em là: Hãy luôn trân trọng và thể hiện lòng biết ơn chân thành đối với những người đã giúp đỡ mình trong cuộc sống.
• Lí giải: Bởi vì lòng biết ơn không chỉ giúp gắn kết tình cảm giữa người với người, mà còn nuôi dưỡng một nhân cách tốt đẹp, giúp tâm hồn chúng ta trở nên ấm áp và hướng thiện hơn.`,
        tip: 'Tránh viết quá dài hoặc quá cộc lốc; độ dài chuẩn là 3 đến 5 dòng.'
      }
    ],
    exercises: [
      {
        id: 'v1-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Phương thức biểu đạt nào nhằm mục đích bày tỏ trực tiếp cảm xúc, rung động của người viết?',
        options: ['Biểu cảm', 'Tự sự', 'Thuyết minh', 'Hành chính'],
        correctAnswer: 'Biểu cảm',
        explanation: 'Phương thức biểu cảm dùng để bộc lộ tình cảm, cảm xúc của tác giả.'
      }
    ]
  },

  'van-v2-tieng-viet-tu-tu': {
    moduleId: 'van-v2-tieng-viet-tu-tu',
    theory: `I. HỆ THỐNG BIỆN PHÁP TU TỪ THƯỜNG GẶP
• So sánh: Đối chiếu sự vật A với B dựa trên nét tương đồng (từ so sánh: như, là, tựa...).
• Nhân hóa: Gán phẩm chất, hành động của con người cho đồ vật, con vật, thiên nhiên.
• Ẩn dụ: Gọi tên sự vật A bằng sự vật B dựa trên nét tương đồng ngầm.
• Hoán dụ: Gọi tên sự vật A bằng sự vật B dựa trên mối liên hệ gần gũi, tương cận (ví dụ: áo chàm chỉ người Việt Bắc).
• Điệp từ / Điệp ngữ: Lặp lại từ ngữ nhằm nhấn mạnh ý và tạo nhịp điệu.

II. CÔNG THỨC 5 BƯỚC PHÂN TÍCH TÁC DỤNG BIỆN PHÁP TU TỪ
1. Bước 1: Chỉ tên biện pháp tu từ được sử dụng.
2. Bước 2: Trích dẫn từ ngữ thể hiện biện pháp đó trong ngữ liệu.
3. Bước 3: Tác dụng về hình thức (tạo nhịp điệu sinh động, giàu hình ảnh, biểu cảm).
4. Bước 4: Tác dụng về nội dung (làm nổi bật hình ảnh gì, đặc điểm gì của sự vật).
5. Bước 5: Bộc lộ tình cảm, thái độ, tư tưởng gì của tác giả.`,
    formulas: [
      'Công thức 5 bước phân tích tu từ: 1. Chỉ tên biện pháp → 2. Trích dẫn từ ngữ trong văn bản → 3. Tác dụng nhịp điệu hình thức → 4. Làm nổi bật hình ảnh nội dung gì → 5. Bộc lộ cảm xúc tác giả.',
      'So sánh (A như B): Giúp hình ảnh trở nên cụ thể, sinh động, người đọc dễ hình dung và tăng sức gợi cảm cho câu văn/thơ.',
      'Nhân hóa: Thổi hồn vào sự vật, làm cho thiên nhiên, đồ vật có tâm hồn, sự sống và tình cảm gần gũi như con người.',
      'Ẩn dụ & Hoán dụ: Ẩn dụ dựa trên tương đồng (ngầm so sánh); Hoán dụ dựa trên tương cận (gần gũi). Cả hai làm lời văn hàm súc, giàu tính triết lý.',
      'Điệp từ / Điệp ngữ: Nhấn mạnh ý đồ nghệ thuật, tô đậm cảm xúc dâng trào và tạo nhạc tính, nhịp điệu dồn dập, tha thiết cho câu văn.'
    ],
    examples: [
      {
        title: 'Ví dụ: Phân tích phép điệp ngữ',
        problem: 'Nêu tác dụng của điệp từ "nhóm" trong bài thơ Bếp lửa của Bằng Việt.',
        solution: `1. Biện pháp tu từ: Điệp từ "nhóm" (được nhắc lại 4 lần).
2. Tác dụng hình thức: Tạo nhịp thơ dồn dập, tha thiết, giàu nhạc tính.
3. Tác dụng nội dung: Nhấn mạnh hành động nhóm lửa kiên trì của bà, không chỉ nhóm lên ngọn lửa của rơm rạ củi cành, mà còn nhóm lên ngọn lửa của tình yêu thương, niềm tin và hy vọng.
4. Bộc lộ cảm xúc: Thể hiện lòng biết ơn và sự trân trọng sâu sắc của người cháu đối với người bà tảo tần.`,
        tip: 'Phải phân tích được cả nghĩa tả thực và nghĩa biểu tượng sâu xa.'
      }
    ],
    exercises: [
      {
        id: 'v2-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Câu thơ "Mặt trời xuống biển như hòn lửa" sử dụng biện pháp tu từ nào?',
        options: ['So sánh', 'Ẩn dụ', 'Hoán dụ', 'Nói quá'],
        correctAnswer: 'So sánh',
        explanation: 'Có từ so sánh "như", đối chiếu hình ảnh mặt trời với hòn lửa rực đỏ.'
      }
    ]
  },

  'van-v3-nghi-luan-xa-hoi-tu-tuong': {
    moduleId: 'van-v3-nghi-luan-xa-hoi-tu-tuong',
    theory: `I. CẤU TRÚC ĐOẠN VĂN NGHỊ LUẬN XÃ HỘI 200 CHỮ
1. Mở đoạn (1-2 câu): Dẫn dắt và nêu đúng vấn đề nghị luận (từ khóa chính).
2. Thân đoạn (khoảng 15-18 dòng):
   • Giải thích: Khái niệm vấn đề là gì (ngắn gọn, chuẩn xác trong 1-2 câu).
   • Bàn luận & Chứng minh: Vì sao vấn đề lại quan trọng? Ý nghĩa/vai trò của phẩm chất đó là gì? (3-4 câu kèm 1 DẪN CHỨNG NGƯỜI THẬT VIỆC THẬT tiêu biểu).
   • Phản đề (Mở rộng): Phê phán những người có suy nghĩ tiêu cực, trái ngược với phẩm chất này.
3. Kết đoạn (2 câu): Rút ra bài học nhận thức và hành động cụ thể cho bản thân.`,
    formulas: [
      'Cấu trúc đoạn văn 200 chữ: Mở đoạn (1-2 câu nêu vấn đề) → Giải thích (1-2 câu) → Bàn luận lí lẽ (4-5 câu) + Dẫn chứng (2-3 câu) → Phản đề (1-2 câu) → Bài học (2 câu).',
      'Công thức chọn dẫn chứng vàng: Chọn 1 người thật việc thật tiêu biểu, có sức lan tỏa (nêu rõ Tên người + Hành động vượt khó + Kết quả truyền cảm hứng).',
      'Công thức phản đề (mở rộng): Phê phán những hành vi, nhận thức đi ngược lại với phẩm chất đạo lý tốt đẹp đang bàn luận.',
      'Công thức bài học hành động: Nhận thức đúng đắn (hiểu được gì) + Hành động cụ thể (học sinh lớp 9 cần làm gì trong học tập và đối nhân xử thế).',
      'Quy tắc hình thức: Tuyệt đối không xuống dòng tách đoạn (trừ điểm cấu trúc), dung lượng khoảng 2/3 đến 1 trang giấy thi.'
    ],
    examples: [
      {
        title: 'Ví dụ: Dẫn chứng tiêu biểu cho lòng kiên trì',
        problem: 'Nêu dẫn chứng thuyết phục khi viết đoạn văn về nghị lực sống.',
        solution: `Dẫn chứng thầy giáo Nguyễn Ngọc Ký: Dù bị liệt cả hai tay từ nhỏ, thầy vẫn kiên trì vượt qua nghịch cảnh, luyện viết bằng chân để trở thành một người thầy mẫu mực, truyền cảm hứng sống mãnh liệt cho biết bao thế hệ học sinh Việt Nam.`,
        tip: 'Chỉ nên dành 2-3 câu cho dẫn chứng, tập trung nêu hành động và kết quả để chứng minh cho luận điểm.'
      }
    ],
    exercises: [
      {
        id: 'v3-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Dung lượng tiêu chuẩn của đoạn văn Nghị luận xã hội trong đề thi tuyển sinh lớp 10 thường là:',
        options: ['Khoảng 200 chữ (khoảng 2/3 đến 1 trang giấy thi)', 'Khoảng 500 chữ', 'Bài văn dài 3 trang', 'Tùy ý không giới hạn'],
        correctAnswer: 'Khoảng 200 chữ (khoảng 2/3 đến 1 trang giấy thi)',
        explanation: 'Đề thi tuyển sinh lớp 10 hiện hành thường yêu cầu viết đoạn văn khoảng 200 chữ, tránh viết thành bài văn tách nhiều đoạn.'
      }
    ]
  },

  'van-v4-nghi-luan-xa-hoi-hien-tuong': {
    moduleId: 'van-v4-nghi-luan-xa-hoi-hien-tuong',
    theory: `I. NGHỊ LUẬN VỀ HIỆN TƯỢNG ĐỜI SỐNG
1. Nêu thực trạng: Hiện tượng gì đang xảy ra trong đời sống? (Lối sống ảo, bạo lực học đường, rác thải nhựa, vô cảm...).
2. Phân tích nguyên nhân:
   • Nguyên nhân chủ quan: Nhận thức, lối sống buông thả của bản thân.
   • Nguyên nhân khách quan: Sự thiếu quan tâm của gia đình, ảnh hưởng từ mạng xã hội, chế tài pháp luật chưa đủ răn đe.
3. Đánh giá hậu quả / tác hại: Tác động xấu đến thể chất, tinh thần và trật tự cộng đồng.
4. Đề xuất giải pháp: Gia đình, nhà trường và hành động thiết thực của mỗi học sinh.`,
    formulas: [
      'Cấu trúc NLXH hiện tượng đời sống: Nêu hiện tượng → Thực trạng diễn ra → Nguyên nhân (chủ quan + khách quan) → Hậu quả/Tác động → Giải pháp khắc phục.',
      'Công thức tìm nguyên nhân: Bản thân người trong cuộc (nhận thức non nớt, a dua) + Gia đình (thiếu quản lý, bảo bọc) + Xã hội/Mạng xã hội (tác động tiêu cực).',
      'Công thức nêu hậu quả: Ảnh hưởng trực tiếp đến cá nhân (sức khỏe, tương lai) + Ảnh hưởng đến gia đình và môi trường xã hội chung quanh.',
      'Công thức đề xuất giải pháp 3 cấp: Bản thân tự giác nâng cao nhận thức + Gia đình đồng hành, giáo dục + Nhà trường và cơ quan chức năng giám sát, xử lý.',
      'Dẫn chứng hiện tượng: Nên cập nhật số liệu hoặc sự việc thực tế thời sự gần đây trên báo đài uy tín.'
    ],
    examples: [
      {
        title: 'Ví dụ: Giải pháp đối với hiện tượng nghiện mạng xã hội',
        problem: 'Nêu giải pháp khắc phục tình trạng giới trẻ lạm dụng thiết bị điện tử.',
        solution: `Mỗi học sinh cần chủ động xây dựng thời gian biểu sinh hoạt khoa học, tích cực tham gia các hoạt động thể thao, đọc sách và giao tiếp trực tiếp ngoài đời thực thay vì đắm chìm trong thế giới ảo.`,
        tip: 'Giải pháp phải cụ thể, khả thi và gắn liền với độ tuổi học sinh.'
      }
    ],
    exercises: [
      {
        id: 'v4-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Khi phân tích một hiện tượng đời sống tiêu cực, phần quan trọng nhất để tạo tính thuyết phục là:',
        options: ['Nguyên nhân và Giải pháp khắc phục', 'Chỉ kể lể các vụ việc giật gân', 'Chỉ trích gay gắt mà không nêu giải pháp', 'Liệt kê số liệu thống kê chung chung'],
        correctAnswer: 'Nguyên nhân và Giải pháp khắc phục',
        explanation: 'Nghị luận hiện tượng đời sống đòi hỏi tư duy phân tích nguyên nhân và đề xuất hướng giải quyết thấu đáo.'
      }
    ]
  },

  'van-v5-nghi-luan-van-hoc-tho': {
    moduleId: 'van-v5-nghi-luan-van-hoc-tho',
    theory: `I. KỸ NĂNG NGHỊ LUẬN TÁC PHẨM THƠ
1. Mở bài: Giới thiệu tác giả, phong cách sáng tác, hoàn cảnh sáng tác và trích dẫn đoạn thơ.
2. Thân bài:
   • Luận điểm 1: Cảm xúc, hình ảnh thơ trong khổ 1.
   • Luận điểm 2: Sự chuyển biến cảm xúc ở các khổ thơ tiếp theo.
   • Luận điểm đánh giá nghệ thuật: Thể thơ, nhịp điệu, giọng điệu, biện pháp tu từ, từ ngữ đặc sắc.
3. Kết bài: Khái quát giá trị tư tưởng và sức sống lâu bền của tác phẩm trong lòng độc giả.`,
    formulas: [
      'Cấu trúc phân tích đoạn thơ: Mở bài (Tác giả + Tác phẩm + Hoàn cảnh sáng tác + Trích thơ) → Cảm nhận nội dung và tín hiệu nghệ thuật → Đánh giá khái quát.',
      'Công thức khai thác tín hiệu nghệ thuật thơ: Khai thác từ ngữ gợi cảm, hình ảnh biểu tượng, thể thơ, vần, nhịp điệu và các biện pháp tu từ độc đáo.',
      'Bức tranh hiện thực & Tâm tư: Thơ là tiếng nói của cảm xúc — qua bức tranh thiên nhiên/cuộc sống là tấm lòng, tư tưởng yêu nước hay tình mẫu tử thiêng liêng.',
      'Liên hệ mở rộng trong thơ: So sánh với một hình tượng thơ tương đồng (ví dụ: Ánh trăng liên hệ với Đồng chí, Bếp lửa liên hệ với Khúc hát ru...).',
      'Kết bài/đoạn: Khẳng định phong cách riêng của nhà thơ và sức sống lâu bền của tác phẩm trong dòng chảy thi ca dân tộc.'
    ],
    examples: [
      {
        title: 'Ví dụ: Mở bài gián tiếp cho bài thơ Mùa xuân nho nhỏ',
        problem: 'Viết mở bài ấn tượng cho bài thơ Mùa xuân nho nhỏ của Thanh Hải.',
        solution: `Thời gian có thể làm tàn phai vạn vật, nhưng những áng thơ xuất phát từ trái tim nhiệt thành sẽ sống mãi cùng năm tháng. "Mùa xuân nho nhỏ" của Thanh Hải là một thi phẩm như thế. Được viết trên giường bệnh trước lúc nhà thơ đi xa, bài thơ không chỉ là khúc ca ngợi vẻ đẹp mùa xuân thiên nhiên, đất nước mà còn là khát vọng dâng hiến thầm lặng, cháy bỏng cho cuộc đời chung.`,
        tip: 'Mở bài gián tiếp đi từ đề tài mùa xuân hoặc sức sống của thơ ca sẽ tạo điểm nhấn ấn tượng cho bài thi.'
      }
    ],
    exercises: [
      {
        id: 'v5-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Khi phân tích thơ trữ tình, điều quan trọng nhất là phải bám sát vào:',
        options: ['Ngôn từ, hình ảnh thơ và mạch cảm xúc', 'Kể lại nội dung bài thơ bằng văn xuôi', 'Chép lại lời giảng của giáo viên nguyên văn', 'Chỉ nói về tiểu sử tác giả'],
        correctAnswer: 'Ngôn từ, hình ảnh thơ và mạch cảm xúc',
        explanation: 'Thơ là tiếng nói của cảm xúc thông qua ngôn từ tinh đọng và hình tượng nghệ thuật.'
      }
    ]
  },

  'van-v6-nghi-luan-van-hoc-truyen': {
    moduleId: 'van-v6-nghi-luan-van-hoc-truyen',
    theory: `I. KỸ NĂNG PHÂN TÍCH NHÂN VẬT TRONG TRUYỆN NGẮN
1. Tình huống truyện: Hoàn cảnh đặc biệt giúp bộc lộ rõ tính cách và chiều sâu tâm lý nhân vật.
2. Nghệ thuật xây dựng nhân vật:
   • Ngoại hình, lai lịch, hoàn cảnh sống.
   • Lời nói, cử chỉ, hành động trong các bước ngoặt.
   • Thế giới nội tâm, diễn biến tâm trạng sâu sắc.
3. Khái quát vẻ đẹp phẩm chất: Nhân cách, tình yêu thương, sự hy sinh thầm lặng.
4. Đánh giá nghệ thuật: Nghệ thuật kể chuyện, xây dựng đối thoại, độc thoại nội tâm.`,
    formulas: [
      'Cấu trúc phân tích nhân vật truyện: Giới thiệu nhân vật (hoàn cảnh, lai lịch) → Phân tích các vẻ đẹp phẩm chất qua hành động, lời thoại, độc thoại nội tâm → Nghệ thuật xây dựng nhân vật.',
      'Công thức trích dẫn chứng truyện: Nêu luận điểm phẩm chất → Trích câu thoại đắt giá hoặc hành động then chốt → Bình luận và làm sáng tỏ phẩm chất.',
      'Phân tích tình huống truyện: Chỉ rõ hoàn cảnh thử thách éo le giúp bộc lộ sâu sắc tính cách, phẩm chất và tâm lý của nhân vật.',
      'Nghệ thuật xây dựng nhân vật: Nghệ thuật miêu tả tâm lý tinh tế, nghệ thuật trần thuật sinh động, ngôn ngữ đối thoại đậm tính cách đời thường.',
      'Đánh giá đại diện thế hệ: Nêu rõ nhân vật là hình mẫu đại diện cho phẩm chất của con người Việt Nam trong hoàn cảnh lịch sử lúc bấy giờ.'
    ],
    examples: [
      {
        title: 'Ví dụ: Phân tích nhân vật anh thanh niên (Lặng lẽ Sa Pa)',
        problem: 'Nêu các phẩm chất tiêu biểu của anh thanh niên trong Lặng lẽ Sa Pa.',
        solution: `Anh thanh niên hội tụ những vẻ đẹp tiêu biểu của thế hệ trẻ Việt Nam thời kỳ xây dựng đất nước:
1. Tinh thần trách nhiệm cao, hết lòng tận tụy với công việc đo gió đo mưa trên đỉnh Yên Sơn 2600m.
2. Tinh thần lạc quan, biết tự sắp xếp cuộc sống ngăn nắp, trồng hoa, nuôi gà, đọc sách.
3. Lòng cởi mở, chân thành, hiếu khách và đức tính khiêm tốn đáng quý.`,
        tip: 'Nêu các luận điểm rõ ràng bằng câu chủ đề trước khi phân tích dẫn chứng.'
      }
    ],
    exercises: [
      {
        id: 'v6-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Lỗi sai phổ biến nhất học sinh hay mắc phải khi làm bài phân tích nhân vật trong truyện là:',
        options: ['Sa vào kể lể tóm tắt cốt truyện thay vì phân tích phẩm chất', 'Dẫn chứng quá ngắn gọn', 'Viết mở bài quá nhanh', 'Nhớ đúng tên các nhân vật'],
        correctAnswer: 'Sa vào kể lể tóm tắt cốt truyện thay vì phân tích phẩm chất',
        explanation: 'Phân tích nhân vật phải bám vào chi tiết nghệ thuật, hành động, lời nói chứ không kể lại truyện từ đầu đến cuối.'
      }
    ]
  },

  // ============================ TIẾNG ANH 9 (A1 - A8) ============================
  'anh-a1-thi-dong-tu': {
    moduleId: 'anh-a1-thi-dong-tu',
    theory: `I. HỆ THỐNG CÁC THÌ TRỌNG TÂM THI VÀO 10
1. Present Simple (Hiện tại đơn): S + V(s/es) | Diễn tả thói quen, chân lý.
2. Present Continuous (Hiện tại tiếp diễn): S + is/am/are + V-ing | Diễn tả hành động đang diễn ra tại thời điểm nói.
3. Past Simple (Quá khứ đơn): S + V2/ed | Hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ (yesterday, ago, last...).
4. Past Continuous (Quá khứ tiếp diễn): S + was/were + V-ing | Hành động đang diễn ra tại một thời điểm xác định trong quá khứ, hoặc cấu trúc When/While.
5. Present Perfect (Hiện tại hoàn thành): S + have/has + V3/ed | Diễn tả hành động xảy ra trong quá khứ kéo dài đến hiện tại (since, for, already, yet, just, ever, never).
6. Future Simple (Tương lai đơn): S + will + V-inf | Quyết định ngay tại thời điểm nói, lời dự đoán.`,
    formulas: [
      'Present Simple: S + V(s/es)',
      'Past Simple: S + V2/ed',
      'Present Perfect: S + have/has + V3/ed (since + mốc thời gian / for + khoảng thời gian)',
      'When + Past Simple, Past Continuous (hành động đang diễn ra thì có hành động khác xen vào)'
    ],
    examples: [
      {
        title: 'Ví dụ: Phân biệt Since và For trong Hiện tại hoàn thành',
        problem: 'Chia động từ: They (live) here since 2020.',
        solution: `Vì có dấu hiệu "since 2020" (mốc thời gian), câu diễn tả hành động bắt đầu từ năm 2020 và vẫn tiếp diễn ở hiện tại.
Ta chia thì Hiện tại hoàn thành: They have lived here since 2020.`,
        tip: 'Since đi với mốc thời gian (since yesterday, since 2015), For đi với khoảng thời gian (for 5 years, for two months).'
      }
    ],
    exercises: [
      {
        id: 'a1-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'I _______ this movie three times so far.',
        options: ['have seen', 'saw', 'see', 'was seeing'],
        correctAnswer: 'have seen',
        explanation: 'Dấu hiệu "so far" (cho đến nay) và trải nghiệm "three times" chia thì Hiện tại hoàn thành (have seen).'
      }
    ]
  },

  'anh-a2-cau-bi-dong': {
    moduleId: 'anh-a2-cau-bi-dong',
    theory: `I. QUY TẮC CHUYỂN CÂU CHỦ ĐỘNG SANG BỊ ĐỘNG
• Chủ động: S + V + O
• Bị động: S (từ O chuyển lên) + be (chia cùng thì của V) + V3/ed (+ by O).

II. BẢNG BIẾN ĐỔI TO BE THEO CÁC THÌ
• Hiện tại đơn: am / is / are + V3/ed
• Quá khứ đơn: was / were + V3/ed
• Hiện tại hoàn thành: have / has been + V3/ed
• Động từ khuyết thiếu (Modal verbs: can, must, should, will): modal + be + V3/ed

III. CÂU ƯỚC (WISH)
• Ước ở hiện tại (trái thực tế hiện tại): S + wish + S + V2/ed (to be dùng were cho mọi ngôi).
• Ước ở tương lai: S + wish + S + would / could + V-inf.`,
    formulas: [
      'Passive: S + be + V3/ed (+ by O)',
      'Modal Passive: S + can/must/should/will + be + V3/ed',
      'Wish ở hiện tại: S + wish + S + V2/ed (be → were)'
    ],
    examples: [
      {
        title: 'Ví dụ: Chuyển sang câu bị động',
        problem: 'Chuyển sang bị động: People speak English all over the world.',
        solution: `Chủ ngữ mới: English (số ít).
Động từ "speak" ở thì hiện tại đơn ⇒ be chia là "is". Quá khứ phân từ của speak là "spoken".
Bỏ tân ngữ "by people".
⇒ English is spoken all over the world.`,
        tip: 'Các đại lượng chung như by people, by them, by someone thường được lược bỏ.'
      }
    ],
    exercises: [
      {
        id: 'a2-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'The bridge _______ by workers last year.',
        options: ['was built', 'built', 'is built', 'has been built'],
        correctAnswer: 'was built',
        explanation: 'Chủ ngữ "the bridge" là vật chịu tác động, có "last year" là quá khứ đơn ⇒ was built.'
      }
    ]
  },

  'anh-a3-cau-dieu-kien': {
    moduleId: 'anh-a3-cau-dieu-kien',
    theory: `I. CÂU ĐIỀU KIỆN LOẠI 1 (Có thể xảy ra ở hiện tại hoặc tương lai)
• Cấu trúc: If + S + V(hiện tại đơn), S + will / can + V-inf
• Ví dụ: If it rains tomorrow, we will stay at home.

II. CÂU ĐIỀU KIỆN LOẠI 2 (Giả định trái ngược thực tế ở hiện tại)
• Cấu trúc: If + S + V2/ed (to be chia were cho mọi ngôi), S + would / could + V-inf
• Ví dụ: If I had a car, I would drive to school.

III. CẤU TRÚC UNLESS
• Unless = If ... not (Trừ phi, nếu không thì)
• Unless + khẳng định = If + phủ định.`,
    formulas: [
      'Type 1: If + S + V(s/es), S + will + V-inf',
      'Type 2: If + S + V2/ed (were), S + would + V-inf',
      'Unless = If not'
    ],
    examples: [
      {
        title: 'Ví dụ: Viết lại câu dùng Unless',
        problem: 'Viết lại câu: If you do not hurry, you will miss the train.',
        solution: `Bỏ "If... do not" thay bằng "Unless":
⇒ Unless you hurry, you will miss the train.`,
        tip: 'Sau Unless luôn là mệnh đề khẳng định (không dùng Unless you don\'t).'
      }
    ],
    exercises: [
      {
        id: 'a3-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'If I _______ you, I would take that opportunity.',
        options: ['were', 'am', 'was', 'have been'],
        correctAnswer: 'were',
        explanation: 'Câu điều kiện loại 2 (lời khuyên If I were you) luôn dùng "were" cho mọi ngôi.'
      }
    ]
  },

  'anh-a4-cau-tuong-thuat': {
    moduleId: 'anh-a4-cau-tuong-thuat',
    theory: `I. NGUYÊN TẮC LÙI THÌ TRONG CÂU GIÁN TIẾP
• Hiện tại đơn (V1) → Quá khứ đơn (V2)
• Hiện tại tiếp diễn (am/is/are V-ing) → Quá khứ tiếp diễn (was/were V-ing)
• Hiện tại hoàn thành (have/has V3) → Quá khứ hoàn thành (had V3)
• Will → Would ; Can → Could ; Must → Had to

II. ĐỔI TRẠNG TỪ CHỈ THỜI GIAN VÀ NƠI CHỐN
• now → then ; today → that day ; yesterday → the day before ; tomorrow → the next day
• here → there ; this → that ; these → those

III. CÂU HỎI TRONG LỜI NÓI GIÁN TIẾP
• Yes/No Question: S + asked + (O) + if / whether + S + V(lùi thì).
• Wh-Question: S + asked + (O) + wh-word + S + V(lùi thì) (không đảo trợ động từ lên trước chủ ngữ!).`,
    formulas: [
      'Statement: S + said that + S + V(lùi thì)',
      'Yes/No: S + asked + if/whether + S + V(lùi thì)',
      'Wh-question: S + asked + Wh-word + S + V(lùi thì)'
    ],
    examples: [
      {
        title: 'Ví dụ: Chuyển câu hỏi sang gián tiếp',
        problem: '"Where do you live?" she asked me.',
        solution: `Câu hỏi Wh-: đổi "you" thành "I", lùi thì "do live" thành "lived":
⇒ She asked me where I lived.`,
        tip: 'Tuyệt đối không đảo trợ động từ lên trước chủ ngữ trong câu gián tiếp.'
      }
    ],
    exercises: [
      {
        id: 'a4-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'He told me that he _______ to Da Nang the following day.',
        options: ['would go', 'will go', 'goes', 'went'],
        correctAnswer: 'would go',
        explanation: 'Có dấu hiệu "the following day" và động từ tường thuật "told" ở quá khứ, will lùi thành would go.'
      }
    ]
  },

  'anh-a5-menh-de-quan-he': {
    moduleId: 'anh-a5-menh-de-quan-he',
    theory: `I. CÁC ĐẠI TỪ QUAN HỆ
• Who: Thay cho danh từ chỉ người, đóng vai trò chủ ngữ (The man who taught me...).
• Whom: Thay cho danh từ chỉ người, đóng vai trò tân ngữ (The woman whom I met...).
• Which: Thay cho danh từ chỉ đồ vật, con vật (The book which is on the table...).
• That: Thay cho cả người và vật trong mệnh đề quan hệ xác định.
• Whose: Chỉ sở hữu, đứng trước một danh từ (The boy whose bike was stolen...).

II. LƯU Ý ĐẶC BIỆT CẦN TRÁNH TRONG ĐỀ THI
• KHÔNG dùng "That" sau dấu phẩy (mệnh đề không xác định) và sau giới từ (in, on, at, with...).
• Mệnh đề có dấu phẩy bổ nghĩa cho danh từ riêng hoặc danh từ có tính từ chỉ định (this, that, my...).`,
    formulas: [
      'Person + WHO + Verb',
      'Person + WHOM + Subject + Verb',
      'Thing + WHICH + Verb / Clause',
      'Noun + WHOSE + Noun + Verb'
    ],
    examples: [
      {
        title: 'Ví dụ: Nối câu bằng đại từ quan hệ',
        problem: 'Nối câu: The girl is my sister. She won the first prize.',
        solution: `Từ chung: "The girl" và "She" (chỉ người làm chủ ngữ).
Dùng đại từ "who" thay thế cho "She":
⇒ The girl who won the first prize is my sister.`,
        tip: 'Đặt mệnh đề quan hệ ngay sau danh từ mà nó bổ nghĩa.'
      }
    ],
    exercises: [
      {
        id: 'a5-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'The scientist _______ invented this machine is very famous.',
        options: ['who', 'which', 'whom', 'whose'],
        correctAnswer: 'who',
        explanation: 'Bổ nghĩa cho danh từ chỉ người "The scientist" và đóng vai trò chủ ngữ của động từ "invented" ⇒ dùng "who".'
      }
    ]
  },

  'anh-a6-tu-loai-word-form': {
    moduleId: 'anh-a6-tu-loai-word-form',
    theory: `I. VỊ TRÍ CÁC TỪ LOẠI TRONG CÂU
1. Danh từ (Noun):
   • Sau mạo từ: a, an, the
   • Sau tính từ sở hữu: my, your, his, her, their, our, its
   • Sau tính từ miêu tả: a beautiful girl
   • Sau giới từ: in, on, at, about...
2. Tính từ (Adjective):
   • Đứng trước danh từ: an interesting book
   • Sau động từ to be và linking verbs: look, feel, seem, taste, smell, become...
3. Trạng từ (Adverb):
   • Bổ nghĩa cho động từ thường: He drives carefully.
   • Bổ nghĩa cho tính từ: It is extremely cold.
   • Thường có đuôi "-ly" (Adj + ly = Adv).

II. CÁC TIỀN TỐ PHỦ ĐỊNH CẦN NHỚ
• un- (unhappy, unhealthy)
• im- (impolite, impossible)
• in- (inexpensive, convenient -> inconvenient)
• dis- (disagree, disappear)`,
    formulas: [
      'a / an / the + Adj + Noun',
      'To be + Adjective',
      'Verb + Adverb (Adj + ly)'
    ],
    examples: [
      {
        title: 'Ví dụ: Điền dạng đúng của từ trong ngoặc',
        problem: 'Solar energy is an _______ source of energy. (exhaust)',
        solution: `Sau mạo từ "an" và trước danh từ "source" cần một tính từ.
Từ gốc "exhaust" (làm cạn kiệt), tính từ mang nghĩa "không bao giờ cạn kiệt" là "inexhaustible".
⇒ Solar energy is an inexhaustible source of energy.`,
        tip: 'Luôn xác định từ loại trước, sau đó xem xét ngữ cảnh để xem có cần thêm tiền tố phủ định hay không.'
      }
    ],
    exercises: [
      {
        id: 'a6-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'She sings very _______. Everyone loves her voice. (beauty)',
        options: ['beautifully', 'beautiful', 'beauty', 'beautify'],
        correctAnswer: 'beautifully',
        explanation: 'Đứng sau động từ thường "sings" cần một trạng từ chỉ cách thức: beautifully.'
      }
    ]
  },

  'anh-a7-phat-am-trong-am': {
    moduleId: 'anh-a7-phat-am-trong-am',
    theory: `I. QUY TẮC PHÁT ÂM ĐUÔI -ED
1. /ɪd/: Tận cùng bằng /t/ hoặc /d/ (wanted, decided, needed).
2. /t/: Tận cùng bằng các âm vô thanh /p, k, f, s, ʃ, tʃ/ (mẹo: chính phủ phát sách không thiếu) (stopped, looked, laughed, washed, watched).
3. /d/: Các trường hợp còn lại (played, cleaned, loved).

II. QUY TẮC PHÁT ÂM ĐUÔI -S / -ES
1. /s/: Tận cùng bằng /p, t, k, f, θ/ (mẹo: thời phong kiến phương tây) (stops, books, cats, cliffs).
2. /ɪz/: Tận cùng bằng các âm gió /s, z, ʃ, tʃ, dʒ, ʒ/ (ch, sh, s, x, z, ge, ce) (watches, washes, boxes, buses, changes).
3. /z/: Các âm còn lại.

III. QUY TẮC TRỌNG ÂM TỪ 2 ÂM TIẾT
• Danh từ và tính từ 2 âm tiết thường nhấn âm thứ 1: 'table, 'summer, 'happy.
• Động từ 2 âm tiết thường nhấn âm thứ 2: re'lax, en'joy, de'cide.`,
    formulas: [
      '-ed: /ɪd/ (sau t, d) ; /t/ (sau p, k, f, s, sh, ch) ; /d/ (còn lại)',
      '-s/es: /s/ (sau p, t, k, f, th) ; /ɪz/ (sau ch, sh, s, x, z, ge, ce) ; /z/ (còn lại)',
      'Từ 2 âm tiết: Danh/Tính nhấn âm 1, Động từ nhấn âm 2'
    ],
    examples: [
      {
        title: 'Ví dụ: Chọn từ có phần gạch chân phát âm khác',
        problem: 'A. wanted   B. decided   C. played   D. needed',
        solution: `• wanted: tận cùng là t ⇒ phát âm /ɪd/
• decided: tận cùng là d ⇒ phát âm /ɪd/
• played: tận cùng là nguyên âm y ⇒ phát âm /d/
• needed: tận cùng là d ⇒ phát âm /ɪd/
⇒ Đáp án đúng là C.`,
        tip: 'Ghi nhớ nhóm tận cùng bằng /t, d/ phát âm là /ɪd/ trước tiên.'
      }
    ],
    exercises: [
      {
        id: 'a7-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Từ nào có đuôi -ed phát âm khác với các từ còn lại?',
        options: ['watched', 'looked', 'stopped', 'listened'],
        correctAnswer: 'listened',
        explanation: 'watched, looked, stopped tận cùng là âm vô thanh nên đuôi -ed phát âm là /t/. Còn listened phát âm là /d/.'
      }
    ]
  },

  'anh-a8-ky-nang-doc-hieu-dien-tu': {
    moduleId: 'anh-a8-ky-nang-doc-hieu-dien-tu',
    theory: `I. CHIẾN THUẬT LÀM BÀI ĐỌC HIỂU (READING COMPREHENSION)
1. Đọc câu hỏi trước để xác định từ khóa (keywords) và vị trí thông tin trong bài.
2. Áp dụng kỹ năng Skimming (đọc lướt lấy ý chính toàn bài) và Scanning (đọc quét tìm từ khóa, số liệu, tên riêng).
3. Câu hỏi đại từ quy chiếu ("It / They / Them refers to..."): đọc lùi lại 1 câu đứng ngay trước nó để tìm danh từ số ít / số nhiều tương ứng.
4. Đoán nghĩa từ vựng mới dựa vào ngữ cảnh câu và các từ liên kết (however, but, because, therefore).

II. BÀI ĐIỀN TỪ VÀO ĐOẠN VĂN (CLOZE TEST)
• Bước 1: Nhìn vào 4 phương án lựa chọn để biết câu hỏi kiểm tra Ngữ pháp (thì, liên từ, đại từ quan hệ) hay Từ vựng (collocation, nghĩa của từ).
• Bước 2: Quan sát từ đứng ngay trước và ngay sau chỗ trống để tìm cấu trúc ngữ pháp tương ứng.`,
    formulas: [
      'Kỹ thuật Skimming: Đọc lướt nhanh tiêu đề, câu mở đoạn và câu kết đoạn để nắm bắt chủ đề chính (Main Idea) của toàn bài đọc trong 30-45 giây.',
      'Kỹ thuật Scanning: Đảo mắt tìm từ khóa cụ thể (Keywords: tên riêng, năm, số liệu, thuật ngữ) để định vị thông tin chính xác trong câu hỏi Detail.',
      'Kỹ thuật Cloze Test (Điền từ vào đoạn văn): Xác định từ loại cần điền (danh/động/tính/trạng), liên từ nối câu (however, because, although) hoặc giới từ đi kèm cụm từ cố định.',
      'Đoán nghĩa từ trong ngữ cảnh (Vocabulary in Context): Dựa vào từ đồng nghĩa (synonyms), từ trái nghĩa (antonyms) hoặc ví dụ minh họa ngay câu trước và câu sau.'
    ],
    examples: [
      {
        title: 'Ví dụ: Kỹ năng trả lời câu hỏi đại từ quy chiếu',
        problem: 'Câu hỏi: In paragraph 2, the word "they" refers to... A. solar panels   B. clouds   C. engineers   D. houses',
        solution: `Đọc câu phía trước: "Engineers have developed modern solar panels. They can convert sunlight into electricity efficiently."
Từ "They" thay thế cho "solar panels" (các tấm pin mặt trời) vì chúng có khả năng chuyển hóa ánh sáng thành điện.
⇒ Đáp án: A. solar panels.`,
        tip: 'Đại từ thay thế luôn cùng số (ít/nhiều) và hòa hợp về nghĩa với danh từ ở câu liền trước.'
      }
    ],
    exercises: [
      {
        id: 'a8-ex1',
        level: 'de',
        levelLabel: 'Cơ bản',
        question: 'Khi làm bài đọc hiểu, thao tác đầu tiên và hiệu quả nhất bạn nên thực hiện là:',
        options: ['Đọc lướt câu hỏi trước để tìm từ khóa', 'Tra từ điển từng từ vựng mới', 'Dịch từng câu sang tiếng Việt', 'Đọc đi đọc lại bài văn 5 lần'],
        correctAnswer: 'Đọc lướt câu hỏi trước để tìm từ khóa',
        explanation: 'Đọc câu hỏi trước giúp bạn định hướng mục tiêu thông tin cần tìm, tiết kiệm thời gian làm bài.'
      }
    ]
  }
};

// Đảm bảo tất cả 24 bài học đều có ít nhất 5 câu hỏi tự luyện chất lượng cao
for (const [key, lesson] of Object.entries(CURRICULUM_LESSONS)) {
  if (ALL_LESSON_EXERCISES[key] && ALL_LESSON_EXERCISES[key].length >= 5) {
    lesson.exercises = ALL_LESSON_EXERCISES[key];
  }
}

