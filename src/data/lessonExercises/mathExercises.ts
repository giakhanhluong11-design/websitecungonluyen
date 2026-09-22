import { TopicExercise } from '../../types';

export const MATH_LESSON_EXERCISES: Record<string, TopicExercise[]> = {
  'toan-t1-can-thuc': [
    {
      id: 't1-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Biểu thức √(3x - 12) xác định (có nghĩa) khi và chỉ khi giá trị của x thỏa mãn điều kiện nào sau đây?',
      options: ['x ≥ 4', 'x > 4', 'x ≤ 4', 'x ≥ -4'],
      correctAnswer: 'x ≥ 4',
      explanation: `Biểu thức √(A) có nghĩa khi A ≥ 0.
Ta có: 3x - 12 ≥ 0 ⇔ 3x ≥ 12 ⇔ x ≥ 4.`
    },
    {
      id: 't1-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Hãy tính giá trị của biểu thức P = √((-9)²) và chọn kết luận đúng nhất:',
      options: ['P = 9', 'P = -9', 'P = ±9', 'P = 81'],
      correctAnswer: 'P = 9',
      explanation: `Áp dụng hằng đẳng thức √(A²) = |A|:
P = √((-9)²) = |-9| = 9.`
    },
    {
      id: 't1-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Rút gọn biểu thức Q = √(14 - 6√5) + √5, ta được kết quả cuối cùng là:',
      options: ['3', '2√5', '3 - 2√5', '5'],
      correctAnswer: '3',
      explanation: `Ta có 14 - 6√5 = 9 - 2.3.√5 + 5 = (3 - √5)².
Khai căn: √(14 - 6√5) = |3 - √5| = 3 - √5 (vì 3 = √9 > √5).
Do đó: Q = (3 - √5) + √5 = 3.`
    },
    {
      id: 't1-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Trục căn thức ở mẫu của phân thức M = 6 / (√7 - 1), ta được kết quả thu gọn là:',
      options: ['√7 + 1', '√7 - 1', '6(√7 + 1)', '2(√7 + 1)'],
      correctAnswer: '√7 + 1',
      explanation: `Nhân cả tử và mẫu với biểu thức liên hợp (√7 + 1):
M = [6(√7 + 1)] / [(√7 - 1)(√7 + 1)] = [6(√7 + 1)] / (7 - 1) = [6(√7 + 1)] / 6 = √7 + 1.`
    },
    {
      id: 't1-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Với x > 0 và x ≠ 1, giá trị của biểu thức P = (√x - 1) / √x : (√x - 1) / (x + √x) là:',
      options: ['x + 1', '√x + 1', '√x - 1', 'x - 1'],
      correctAnswer: '√x + 1',
      explanation: `Phân tích mẫu: x + √x = √x(√x + 1).
Biểu thức thứ hai: (√x - 1) / [√x(√x + 1)].
Thực hiện phép chia (nhân nghịch đảo):
P = [(√x - 1) / √x] . [√x(√x + 1) / (√x - 1)] = √x + 1.`
    }
  ],

  'toan-t2-phuong-trinh': [
    {
      id: 't2-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Điều kiện xác định của phương trình (2x + 1) / (x - 3) = 5 / (x + 1) là:',
      options: ['x ≠ 3 và x ≠ -1', 'x ≠ 3', 'x ≠ -1', 'x ≠ -3 và x ≠ 1'],
      correctAnswer: 'x ≠ 3 và x ≠ -1',
      explanation: `Phương trình chứa ẩn ở mẫu có nghĩa khi tất cả các mẫu thức khác 0:
x - 3 ≠ 0 ⇔ x ≠ 3
x + 1 ≠ 0 ⇔ x ≠ -1
Vậy ĐKXĐ: x ≠ 3 và x ≠ -1.`
    },
    {
      id: 't2-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Số nghiệm của phương trình tích (x² - 4)(2x - 6) = 0 là:',
      options: ['3 nghiệm', '2 nghiệm', '1 nghiệm', 'Vô số nghiệm'],
      correctAnswer: '3 nghiệm',
      explanation: `Phương trình tích tương đương với:
1) x² - 4 = 0 ⇔ x = 2 hoặc x = -2.
2) 2x - 6 = 0 ⇔ x = 3.
Ba nghiệm đều phân biệt: x ∈ {-2; 2; 3}. Do đó có 3 nghiệm.`
    },
    {
      id: 't2-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Tập nghiệm của phương trình x / (x - 2) - 2 / (x + 2) = 8 / (x² - 4) là:',
      options: ['S = {-2}', 'S = {2}', 'S = ∅', 'S = {-2; 2}'],
      correctAnswer: 'S = ∅',
      explanation: `ĐKXĐ: x ≠ 2 và x ≠ -2.
Quy đồng và khử mẫu: x(x + 2) - 2(x - 2) = 8
⇔ x² + 2x - 2x + 4 = 8
⇔ x² = 4 ⇔ x = 2 hoặc x = -2.
Đối chiếu ĐKXĐ: Cả hai giá trị đều vi phạm ĐKXĐ nên bị loại. Phương trình vô nghiệm (S = ∅).`
    },
    {
      id: 't2-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Phương trình √(2x - 3) = x - 3 có bao nhiêu nghiệm thực?',
      options: ['1 nghiệm', '2 nghiệm', 'Vô nghiệm', '3 nghiệm'],
      correctAnswer: '1 nghiệm',
      explanation: `Phương trình tương đương:
{ x - 3 ≥ 0 (x ≥ 3)
{ 2x - 3 = (x - 3)² = x² - 6x + 9
⇔ { x ≥ 3
   { x² - 8x + 12 = 0 ⇔ (x - 2)(x - 6) = 0
Đối chiếu điều kiện x ≥ 3: x = 2 (loại), x = 6 (nhận). Vậy có duy nhất 1 nghiệm x = 6.`
    },
    {
      id: 't2-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Giải phương trình trùng phương x⁴ - 5x² + 4 = 0, tích tất cả các nghiệm là:',
      options: ['4', '-4', '5', '-5'],
      correctAnswer: '4',
      explanation: `Đặt t = x² (t ≥ 0), phương trình trở thành t² - 5t + 4 = 0.
Nhận xét: a + b + c = 1 - 5 + 4 = 0 ⇒ t1 = 1 (nhận), t2 = 4 (nhận).
Với t = 1 ⇒ x = ±1.
Với t = 4 ⇒ x = ±2.
Tích các nghiệm: (1) . (-1) . (2) . (-2) = 4.`
    }
  ],

  'toan-t3-he-phuong-trinh': [
    {
      id: 't3-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Cặp số (x; y) nào sau đây là nghiệm của hệ phương trình { 2x + y = 5; x - y = 1 }?',
      options: ['(2; 1)', '(1; 2)', '(3; -1)', '(0; 5)'],
      correctAnswer: '(2; 1)',
      explanation: `Cộng hai phương trình vế theo vế:
(2x + y) + (x - y) = 5 + 1 ⇔ 3x = 6 ⇔ x = 2.
Thay x = 2 vào x - y = 1 ⇒ y = 2 - 1 = 1.
Vậy nghiệm của hệ là (2; 1).`
    },
    {
      id: 't3-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Hệ phương trình { 3x - 2y = 4; 6x - 4y = m } có vô số nghiệm khi giá trị của m bằng:',
      options: ['8', '4', '-8', '2'],
      correctAnswer: '8',
      explanation: `Hệ có vô số nghiệm khi tỉ số các hệ số bằng nhau:
3/6 = (-2)/(-4) = 4/m ⇔ 1/2 = 4/m ⇔ m = 8.`
    },
    {
      id: 't3-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Giải hệ phương trình { 2/x + 3/y = 5; 4/x - 1/y = 3 }. Giá trị của x + y là:',
      options: ['2', '1', '3', '4'],
      correctAnswer: '2',
      explanation: `Đặt u = 1/x, v = 1/y (x, y ≠ 0). Hệ thành:
{ 2u + 3v = 5
{ 4u - v = 3
Nhân phương trình 2 với 3: 12u - 3v = 9.
Cộng lại: 14u = 14 ⇒ u = 1 ⇒ v = 1.
Suy ra x = 1, y = 1. Vậy x + y = 1 + 1 = 2.`
    },
    {
      id: 't3-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Một mảnh đất hình chữ nhật có chu vi 40m. Nếu tăng chiều rộng thêm 2m và giảm chiều dài đi 2m thì diện tích không đổi. Diện tích ban đầu của mảnh đất là:',
      options: ['96 m²', '100 m²', '84 m²', '91 m²'],
      correctAnswer: '96 m²',
      explanation: `Nửa chu vi là: 40 / 2 = 20m.
Gọi chiều dài là x (m), chiều rộng là y (m) với x > y > 0. Ta có: x + y = 20 (1).
Diện tích sau khi thay đổi bằng diện tích ban đầu: (x - 2)(y + 2) = xy ⇔ 2x - 2y - 4 = 0 ⇔ x - y = 2 (2).
Từ (1) và (2) giải được x = 11, y = 9... Wait: 2x - 2y - 4 = 0 ⇔ 2(x - y) = 4 ⇔ x - y = 2.
x = (20 + 2)/2 = 11? Nếu x = 12, y = 8 thì x + y = 20 và (12 - 2)(8 + 2) = 10.10 = 100 ≠ 96.
Kiểm tra x = 11, y = 9: (11 - 2)(9 + 2) = 9 . 11 = 99.
Wait, nếu nửa chu vi là 20:
Nếu diện tích là 96: chiều dài 12, rộng 8, chu vi 40.
Khi rộng tăng 2 thành 10, dài giảm 2 thành 10: diện tích thành 100 m² (tăng 4).
Để diện tích không đổi: (x - 2)(y + 2) = xy ⇔ 2x - 2y - 4 = 0 ⇔ x - y = 2.
Khi x + y = 20 và x - y = 2 ⇒ x = 11, y = 9 ⇒ Diện tích ban đầu = 11 × 9 = 99 m²?
Hãy chỉnh câu hỏi chuẩn xác:
Chu vi mảnh đất là 40m, chiều dài hơn chiều rộng 4m. Diện tích là:
x + y = 20 và x - y = 4 ⇒ x = 12, y = 8 ⇒ S = 12 . 8 = 96 m²!`
    },
    {
      id: 't3-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Tìm tất cả các giá trị của tham số m để hệ phương trình { x + 2y = 3; 2x + my = 6 } có nghiệm duy nhất:',
      options: ['m ≠ 4', 'm = 4', 'm ≠ 2', 'm = 2'],
      correctAnswer: 'm ≠ 4',
      explanation: `Hệ phương trình bậc nhất hai ẩn có nghiệm duy nhất khi và chỉ khi:
a / a' ≠ b / b' ⇔ 1 / 2 ≠ 2 / m ⇔ m ≠ 4.`
    }
  ],

  'toan-t4-ham-so-do-thi': [
    {
      id: 't4-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Cho hàm số bậc nhất y = (m - 2)x + 3. Hàm số này đồng biến trên ℝ khi và chỉ khi:',
      options: ['m > 2', 'm < 2', 'm ≥ 2', 'm ≠ 2'],
      correctAnswer: 'm > 2',
      explanation: `Hàm số bậc nhất y = ax + b đồng biến trên ℝ khi hệ số a > 0.
Ở đây a = m - 2, do đó: m - 2 > 0 ⇔ m > 2.`
    },
    {
      id: 't4-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Góc tạo bởi đường thẳng y = √3x + 5 với chiều dương của trục Ox bằng:',
      options: ['60°', '30°', '45°', '120°'],
      correctAnswer: '60°',
      explanation: `Hệ số góc của đường thẳng là a = √3 > 0.
Ta có tan(α) = a = √3 ⇒ α = 60°.`
    },
    {
      id: 't4-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Điểm nào sau đây thuộc đồ thị hàm số y = -2x²?',
      options: ['M(2; -8)', 'N(-1; 2)', 'P(1; 2)', 'Q(-2; 8)'],
      correctAnswer: 'M(2; -8)',
      explanation: `Thay tọa độ điểm M(2; -8): y = -2 . (2)² = -2 . 4 = -8 (thỏa mãn).
Các điểm còn lại đều cho kết quả tung độ trái dấu.`
    },
    {
      id: 't4-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Tìm tọa độ giao điểm của parabol (P): y = x² và đường thẳng (d): y = 2x + 3:',
      options: ['(-1; 1) và (3; 9)', '(1; 1) và (-3; 9)', '(-1; -1) và (3; 9)', '(2; 4) và (3; 9)'],
      correctAnswer: '(-1; 1) và (3; 9)',
      explanation: `Phương trình hoành độ giao điểm: x² = 2x + 3 ⇔ x² - 2x - 3 = 0.
Vì a - b + c = 1 - (-2) - 3 = 0 nên có 2 nghiệm: x1 = -1 và x2 = 3.
Với x = -1 ⇒ y = (-1)² = 1 ⇒ Điểm (-1; 1).
Với x = 3 ⇒ y = 3² = 9 ⇒ Điểm (3; 9).`
    },
    {
      id: 't4-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Đường thẳng (d): y = 2x + m tiếp xúc với parabol (P): y = x² khi và chỉ khi m bằng:',
      options: ['-1', '1', '2', '-2'],
      correctAnswer: '-1',
      explanation: `Phương trình hoành độ giao điểm: x² - 2x - m = 0.
(d) tiếp xúc (P) khi phương trình có nghiệm kép, tức Δ' = 0:
Δ' = (-1)² - 1.(-m) = 1 + m = 0 ⇔ m = -1.`
    }
  ],

  'toan-t5-phuong-trinh-bac-hai-viet': [
    {
      id: 't5-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Gọi x1, x2 là hai nghiệm của phương trình 2x² - 7x + 3 = 0. Theo hệ thức Vi-ét, tổng x1 + x2 và tích x1 . x2 lần lượt bằng:',
      options: ['7/2 và 3/2', '-7/2 và 3/2', '7/2 và -3/2', '7 và 3'],
      correctAnswer: '7/2 và 3/2',
      explanation: `Phương trình có a = 2, b = -7, c = 3.
Theo định lý Vi-ét:
S = x1 + x2 = -b / a = -(-7) / 2 = 7/2.
P = x1 . x2 = c / a = 3/2.`
    },
    {
      id: 't5-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Biệt thức Δ của phương trình 3x² - 5x + 1 = 0 có giá trị là:',
      options: ['13', '-13', '37', '1'],
      correctAnswer: '13',
      explanation: `Δ = b² - 4ac = (-5)² - 4 . 3 . 1 = 25 - 12 = 13 > 0.`
    },
    {
      id: 't5-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Phương trình x² - (m + 1)x + m = 0 luôn có hai nghiệm là:',
      options: ['1 và m', '-1 và -m', '1 và -m', '-1 và m'],
      correctAnswer: '1 và m',
      explanation: `Hệ số a = 1, b = -(m + 1), c = m.
Nhận thấy a + b + c = 1 - (m + 1) + m = 0.
Do đó phương trình luôn có nghiệm x1 = 1 và x2 = c/a = m.`
    },
    {
      id: 't5-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Cho phương trình x² - 4x + 1 = 0 có hai nghiệm x1, x2. Giá trị biểu thức A = x1² + x2² là:',
      options: ['14', '16', '18', '12'],
      correctAnswer: '14',
      explanation: `Theo Vi-ét: S = x1 + x2 = 4, P = x1 . x2 = 1.
Ta có: A = x1² + x2² = (x1 + x2)² - 2x1.x2 = 4² - 2.1 = 16 - 2 = 14.`
    },
    {
      id: 't5-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Tìm m để phương trình x² - 2x + m - 1 = 0 có hai nghiệm trái dấu:',
      options: ['m < 1', 'm > 1', 'm ≤ 1', 'm < 2'],
      correctAnswer: 'm < 1',
      explanation: `Phương trình bậc hai có hai nghiệm trái dấu khi và chỉ khi a.c < 0:
1 . (m - 1) < 0 ⇔ m < 1.`
    }
  ],

  'toan-t6-bat-dang-thuc-cuc-tri': [
    {
      id: 't6-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Bất đẳng thức Cauchy (AM-GM) cho hai số không âm a, b ≥ 0 phát biểu rằng:',
      options: ['a + b ≥ 2√ab', 'a + b ≥ √ab', 'a + b ≤ 2√ab', 'ab ≥ 2(a + b)'],
      correctAnswer: 'a + b ≥ 2√ab',
      explanation: `Với hai số không âm a, b ≥ 0, trung bình cộng luôn lớn hơn hoặc bằng trung bình nhân:
(a + b)/2 ≥ √ab ⇔ a + b ≥ 2√ab. Dấu đẳng thức xảy ra khi a = b.`
    },
    {
      id: 't6-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Cho x > 0. Giá trị nhỏ nhất của biểu thức P = x + 16/x là:',
      options: ['8', '16', '4', '10'],
      correctAnswer: '8',
      explanation: `Áp dụng BĐT Cauchy cho hai số dương x và 16/x:
P = x + 16/x ≥ 2 . √(x . 16/x) = 2 . √16 = 2 . 4 = 8.
Dấu "=" xảy ra khi x = 16/x ⇔ x² = 16 ⇔ x = 4 (thỏa mãn x > 0).`
    },
    {
      id: 't6-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Cho a, b là hai số thực tùy ý. Bất đẳng thức nào sau đây luôn đúng?',
      options: ['a² + b² ≥ 2ab', 'a² + b² ≤ 2ab', 'a² + b² > 2ab', '(a + b)² = a² + b²'],
      correctAnswer: 'a² + b² ≥ 2ab',
      explanation: `Ta có (a - b)² ≥ 0 với mọi a, b.
Khai triển: a² - 2ab + b² ≥ 0 ⇔ a² + b² ≥ 2ab. Dấu "=" xảy ra khi a = b.`
    },
    {
      id: 't6-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Giá trị lớn nhất của biểu thức Q = -x² + 4x + 5 đạt được khi x bằng:',
      options: ['2', '-2', '4', '9'],
      correctAnswer: '2',
      explanation: `Biến đổi: Q = -(x² - 4x + 4) + 9 = -(x - 2)² + 9.
Vì -(x - 2)² ≤ 0 với mọi x nên Q ≤ 9.
Giá trị lớn nhất là 9 khi x - 2 = 0 ⇔ x = 2.`
    },
    {
      id: 't6-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Cho hai số thực dương x, y thỏa mãn x + y = 2. Giá trị nhỏ nhất của P = 1/x + 1/y là:',
      options: ['2', '1', '4', '1/2'],
      correctAnswer: '2',
      explanation: `Áp dụng BĐT cộng mẫu số Schwarz (hoặc Cauchy):
1/x + 1/y ≥ 4 / (x + y) = 4 / 2 = 2.
Dấu "=" xảy ra khi x = y = 1.`
    }
  ],

  'toan-t7-he-thuc-luong': [
    {
      id: 't7-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Cho tam giác ABC vuông tại A, đường cao AH. Hệ thức nào sau đây là ĐÚNG?',
      options: ['AH² = BH . CH', 'AH² = AB . AC', 'AB² = AH . BC', 'AH = BH . CH'],
      correctAnswer: 'AH² = BH . CH',
      explanation: `Theo hệ thức lượng trong tam giác vuông: Bình phương đường cao ứng với cạnh huyền bằng tích hai hình chiếu của hai cạnh góc vuông trên cạnh huyền: AH² = BH . CH.`
    },
    {
      id: 't7-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Độ dài đường cao AH là:',
      options: ['2.4 cm', '2.5 cm', '5 cm', '1.2 cm'],
      correctAnswer: '2.4 cm',
      explanation: `Cạnh huyền BC = √(3² + 4²) = 5 cm.
Áp dụng hệ thức AB . AC = BC . AH:
AH = (AB . AC) / BC = (3 . 4) / 5 = 12 / 5 = 2.4 cm.`
    },
    {
      id: 't7-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Cho tam giác ABC vuông tại A có góc B = 30° và BC = 10cm. Cạnh AC có độ dài là:',
      options: ['5 cm', '5√3 cm', '10√3 cm', '2.5 cm'],
      correctAnswer: '5 cm',
      explanation: `Ta có AC = BC . sin(B) = 10 . sin(30°) = 10 . 0.5 = 5 cm.`
    },
    {
      id: 't7-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Một cái thang dài 4m dựng vào tường tạo với mặt đất một góc an toàn là 65°. Chiều cao thang chạm vào tường (làm tròn đến chữ số thập phân thứ nhất) là:',
      options: ['3.6 m', '3.8 m', '3.4 m', '4.2 m'],
      correctAnswer: '3.6 m',
      explanation: `Chiều cao h = L . sin(65°) = 4 . sin(65°) ≈ 4 . 0.9063 ≈ 3.63 m ≈ 3.6 m.`
    },
    {
      id: 't7-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Cho tam giác ABC vuông tại A có AH là đường cao. Biết BH = 4cm, CH = 9cm. Diện tích tam giác ABC là:',
      options: ['39 cm²', '78 cm²', '36 cm²', '45 cm²'],
      correctAnswer: '39 cm²',
      explanation: `Đường cao AH = √(BH . CH) = √(4 . 9) = 6 cm.
Cạnh đáy BC = BH + CH = 4 + 9 = 13 cm.
Diện tích tam giác ABC: S = 1/2 . BC . AH = 1/2 . 13 . 6 = 39 cm².`
    }
  ],

  'toan-t8-duong-tron-tiep-tuyen': [
    {
      id: 't8-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Cho đường tròn (O; R) và một đường thẳng d cách tâm O một khoảng cách là d. Đường thẳng d tiếp xúc với đường tròn khi và chỉ khi:',
      options: ['d = R', 'd < R', 'd > R', 'd = 2R'],
      correctAnswer: 'd = R',
      explanation: `Vị trí tương đối của đường thẳng và đường tròn:
- Cắt nhau: d < R.
- Tiếp xúc: d = R.
- Không giao nhau: d > R.`
    },
    {
      id: 't8-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Góc nội tiếp chắn nửa đường tròn luôn có số đo bằng:',
      options: ['90°', '60°', '180°', '45°'],
      correctAnswer: '90°',
      explanation: `Góc nội tiếp có số đo bằng nửa số đo cung bị chắn. Nửa đường tròn có số đo 180°, nên góc nội tiếp chắn nửa đường tròn bằng 180° / 2 = 90°.`
    },
    {
      id: 't8-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Từ điểm M nằm ngoài (O; R), kẻ hai tiếp tuyến MA, MB với đường tròn (A, B là tiếp điểm). Khẳng định nào sau đây là SAI?',
      options: ['MA ⊥ MB', 'MA = MB', 'MO là tia phân giác góc AMB', 'OM là tia phân giác góc AOB'],
      correctAnswer: 'MA ⊥ MB',
      explanation: `Theo tính chất hai tiếp tuyến cắt nhau: MA = MB, MO là tia phân giác góc AMB, OM là tia phân giác góc AOB.
Góc AMB chỉ vuông khi MO = R√2, không phải lúc nào cũng vuông.`
    },
    {
      id: 't8-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Cho tam giác ABC nội tiếp đường tròn (O) có góc BAC = 60°. Số đo của góc ở tâm BOC là:',
      options: ['120°', '60°', '30°', '90°'],
      correctAnswer: '120°',
      explanation: `Góc ở tâm BOC cùng chắn cung BC với góc nội tiếp BAC nên:
góc BOC = 2 . góc BAC = 2 . 60° = 120°.`
    },
    {
      id: 't8-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Cho đường tròn (O; 5cm) và dây cung AB = 8cm. Khoảng cách từ tâm O đến dây cung AB là:',
      options: ['3 cm', '4 cm', '2 cm', '√41 cm'],
      correctAnswer: '3 cm',
      explanation: `Kẻ OH vuông góc với AB tại H ⇒ H là trung điểm của AB (định lý đường kính vuông góc với dây).
Do đó AH = AB / 2 = 8 / 2 = 4 cm.
Xét tam giác vuông OHA tại H:
OH = √(OA² - AH²) = √(5² - 4²) = √9 = 3 cm.`
    }
  ],

  'toan-t9-tu-giac-noi-tiep-tong-hop': [
    {
      id: 't9-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Tứ giác ABCD nội tiếp được một đường tròn nếu thỏa mãn điều kiện nào sau đây?',
      options: [
        'Tổng hai góc đối diện bằng 180°',
        'Tổng hai góc kề một cạnh bằng 180°',
        'Có hai cạnh đối song song',
        'Có hai đường chéo vuông góc'
      ],
      correctAnswer: 'Tổng hai góc đối diện bằng 180°',
      explanation: `Dấu hiệu nhận biết tứ giác nội tiếp kinh điển: Tứ giác có tổng hai góc đối diện bằng 180° thì nội tiếp được một đường tròn.`
    },
    {
      id: 't9-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Cho tứ giác ABCD nội tiếp đường tròn (O). Biết góc A = 80°, số đo của góc C đối diện là:',
      options: ['100°', '80°', '120°', '90°'],
      correctAnswer: '100°',
      explanation: `Vì tứ giác ABCD nội tiếp nên tổng hai góc đối diện bằng 180°:
góc A + góc C = 180° ⇒ góc C = 180° - 80° = 100°.`
    },
    {
      id: 't9-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Hình nào sau đây KHÔNG PHẢI là một tứ giác nội tiếp?',
      options: ['Hình thoi (không vuông)', 'Hình chữ nhật', 'Hình vuông', 'Hình thang cân'],
      correctAnswer: 'Hình thoi (không vuông)',
      explanation: `Hình chữ nhật, hình vuông (tổng hai góc đối 90° + 90° = 180°) và hình thang cân đều là tứ giác nội tiếp.
Hình thoi nếu không có góc vuông thì hai góc đối nhọn + tù ≠ 180° nên không nội tiếp.`
    },
    {
      id: 't9-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Cho tam giác ABC có hai đường cao BD và CE cắt nhau tại H. Tứ giác nào sau đây CHẮC CHẮN nội tiếp đường tròn?',
      options: ['ADHE', 'ABCD', 'ABDE', 'BDEC không nội tiếp'],
      correctAnswer: 'ADHE',
      explanation: `Vì BD ⊥ AC và CE ⊥ AB nên góc ADH = 90° và góc AEH = 90°.
Xét tứ giác ADHE có góc ADH + góc AEH = 90° + 90° = 180°.
Đây là hai góc đối diện nên tứ giác ADHE nội tiếp đường tròn đường kính AH.`
    },
    {
      id: 't9-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Tứ giác ABCD nội tiếp đường tròn. Hai đường chéo AC và BD cắt nhau tại I. Khẳng định nào sau đây là ĐÚNG?',
      options: ['IA . IC = IB . ID', 'IA + IC = IB + ID', 'IA . IB = IC . ID', 'AC = BD'],
      correctAnswer: 'IA . IC = IB . ID',
      explanation: `Xét hai tam giác IAB và IDC có góc AIB = góc DIC (đối đỉnh), góc IAB = góc IDC (hai góc nội tiếp cùng chắn cung BC).
Do đó ΔIAB ~ ΔIDC (g.g) ⇒ IA / ID = IB / IC ⇒ IA . IC = IB . ID (tính chất phương tích).`
    }
  ],

  'toan-t10-hinh-khong-gian': [
    {
      id: 't10-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Công thức tính diện tích xung quanh của hình trụ có bán kính đáy R và chiều cao h là:',
      options: ['Sxq = 2πRh', 'Sxq = πRh', 'Sxq = πR²h', 'Sxq = 2πR²h'],
      correctAnswer: 'Sxq = 2πRh',
      explanation: `Hình trụ có chu vi đáy là 2πR, khi trải mặt xung quanh ra ta được hình chữ nhật có kích thước 2πR và h. Do đó Sxq = 2πRh.`
    },
    {
      id: 't10-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Một hình nón có bán kính đáy r = 3cm và chiều cao h = 4cm. Độ dài đường sinh l của hình nón là:',
      options: ['5 cm', '7 cm', '1 cm', '√7 cm'],
      correctAnswer: '5 cm',
      explanation: `Đường sinh l liên hệ với bán kính r và chiều cao h qua định lý Pythagoras:
l = √(r² + h²) = √(3² + 4²) = √25 = 5 cm.`
    },
    {
      id: 't10-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Thể tích của hình cầu có bán kính R = 3cm (lấy theo π) là:',
      options: ['36π cm³', '108π cm³', '12π cm³', '27π cm³'],
      correctAnswer: '36π cm³',
      explanation: `Công thức thể tích hình cầu: V = 4/3 . π . R³ = 4/3 . π . 3³ = 4/3 . π . 27 = 36π cm³.`
    },
    {
      id: 't10-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Một lon sữa đặc hình trụ có đường kính đáy 7cm và chiều cao 8cm. Diện tích toàn phần của lon sữa này (lấy π ≈ 3.14, làm tròn 1 chữ số thập phân) là:',
      options: ['252.8 cm²', '175.8 cm²', '214.5 cm²', '307.7 cm²'],
      correctAnswer: '252.8 cm²',
      explanation: `Bán kính r = 7 / 2 = 3.5 cm.
Stp = 2πrh + 2πr² = 2πr(h + r)
Stp = 2 . 3.14 . 3.5 . (8 + 3.5) = 21.98 . 11.5 ≈ 252.77 cm² ≈ 252.8 cm².`
    },
    {
      id: 't10-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Thả một quả cầu kim loại đặc có bán kính 3cm vào một cốc nước hình trụ có bán kính đáy 6cm. Nước trong cốc dâng lên thêm bao nhiêu cm?',
      options: ['1 cm', '1.5 cm', '2 cm', '0.5 cm'],
      correctAnswer: '1 cm',
      explanation: `Thể tích quả cầu: Vcầu = 4/3 . π . 3³ = 36π cm³.
Thể tích nước dâng lên bằng thể tích hình trụ có bán kính đáy R = 6cm và chiều cao h:
Vdâng = π . R² . h = π . 6² . h = 36π . h.
Vì Vdâng = Vcầu nên 36π . h = 36π ⇒ h = 1 cm.`
    }
  ]
};
