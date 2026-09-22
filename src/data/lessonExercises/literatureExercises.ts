import { TopicExercise } from '../../types';

export const LITERATURE_LESSON_EXERCISES: Record<string, TopicExercise[]> = {
  'van-v1-doc-hieu-nghe-thuat': [
    {
      id: 'v1-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Phương thức biểu đạt chính của một đoạn trích kể lại diễn biến câu chuyện có nhân vật, cốt truyện, lời thoại và hành động là:',
      options: ['Tự sự', 'Biểu cảm', 'Nghị luận', 'Thuyết minh'],
      correctAnswer: 'Tự sự',
      explanation: `Phương thức tự sự dùng để trình bày chuỗi sự việc, hiện tượng, có mở đầu, diễn biến và kết thúc, hướng tới một ý nghĩa nhất định.`
    },
    {
      id: 'v1-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Khi câu hỏi đọc hiểu yêu cầu "Chỉ ra phong cách ngôn ngữ của văn bản trích từ một bài báo trên báo Tuổi Trẻ", câu trả lời chính xác nhất là:',
      options: ['Phong cách ngôn ngữ báo chí', 'Phong cách ngôn ngữ sinh hoạt', 'Phong cách ngôn ngữ nghệ thuật', 'Phong cách ngôn ngữ chính luận'],
      correctAnswer: 'Phong cách ngôn ngữ báo chí',
      explanation: `Văn bản đăng tải trên báo chí (báo in, báo điện tử) nhằm thông tin thời sự, phản ánh dư luận thuộc phong cách ngôn ngữ báo chí.`
    },
    {
      id: 'v1-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Thao tác lập luận nào được sử dụng chủ yếu khi người viết đưa ra các dẫn chứng số liệu thực tế để chứng minh cho nhận định của mình?',
      options: ['Thao tác chứng minh', 'Thao tác giải thích', 'Thao tác so sánh', 'Thao tác bác bỏ'],
      correctAnswer: 'Thao tác chứng minh',
      explanation: `Thao tác chứng minh là việc đưa ra các lí lẽ và dẫn chứng xác thực, đáng tin cậy để làm sáng tỏ một nhận định hay luận điểm.`
    },
    {
      id: 'v1-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Để trả lời trọn vẹn câu hỏi đọc hiểu: "Theo tác giả, lòng dũng cảm được thể hiện như thế nào?", thí sinh cần làm gì trước tiên?',
      options: [
        'Căn cứ trực tiếp vào các câu chữ trong văn bản đọc hiểu',
        'Tự suy diễn theo vốn hiểu biết cá nhân',
        'Viết một đoạn văn nghị luận dài 200 chữ',
        'Phân tích nghệ thuật so sánh của tác giả'
      ],
      correctAnswer: 'Căn cứ trực tiếp vào các câu chữ trong văn bản đọc hiểu',
      explanation: `Câu hỏi có cụm từ "Theo tác giả" yêu cầu tìm câu trả lời có sẵn trong văn bản đọc hiểu, trích dẫn hoặc diễn đạt lại chính xác ý của tác giả.`
    },
    {
      id: 'v1-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Khi trả lời câu hỏi thông điệp ý nghĩa nhất rút ra từ văn bản, cấu trúc trả lời đạt điểm tối đa trong ba-rem chấm thi gồm:',
      options: [
        'Nêu rõ thông điệp + Lí giải ngắn gọn vì sao thông điệp ấy có ý nghĩa',
        'Chỉ cần nêu tên một bài học ngắn gọn 3 từ',
        'Chép lại nguyên văn câu văn cuối cùng của ngữ liệu',
        'Kể lại một câu chuyện của bản thân'
      ],
      correctAnswer: 'Nêu rõ thông điệp + Lí giải ngắn gọn vì sao thông điệp ấy có ý nghĩa',
      explanation: `Ba-rem thi vào 10 thường cho 0.5 - 1.0 điểm cho câu thông điệp: 0.25 - 0.5 điểm cho việc nêu thông điệp tích cực và 0.25 - 0.5 điểm cho phần giải thích tính thuyết phục.`
    }
  ],

  'van-v2-tieng-viet-tu-tu': [
    {
      id: 'v2-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Trong câu thơ "Mặt trời của bắp thì nằm trên đồi / Mặt trời của mẹ, em nằm trên lưng" (Nguyễn Khoa Điềm), từ "mặt trời" thứ hai được dùng theo biện pháp tu từ nào?',
      options: ['Ẩn dụ', 'Hoán dụ', 'So sánh', 'Nhân hóa'],
      correctAnswer: 'Ẩn dụ',
      explanation: `Em bé được ví như "mặt trời" vì em là nguồn sống, niềm hạnh phúc, ánh sáng ấm áp của đời mẹ (dựa trên mối quan hệ tương đồng - ẩn dụ).`
    },
    {
      id: 'v2-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Xác định thành phần biệt lập trong câu: "Chao ôi, bắt gặp một con người như anh ta là một cơ hội hãn hữu..." (Nguyễn Thành Long):',
      options: ['Thành phần cảm thán ("Chao ôi")', 'Thành phần tình thái', 'Thành phần phụ chú', 'Thành phần gọi đáp'],
      correctAnswer: 'Thành phần cảm thán ("Chao ôi")',
      explanation: `"Chao ôi" là thành phần cảm thán dùng để bộc lộ trực tiếp cảm xúc ngỡ ngàng, xúc động của người nói/người viết.`
    },
    {
      id: 'v2-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Phép liên kết nào được sử dụng giữa hai câu sau: "Trường học của chúng ta là trường học của chế độ dân chủ nhân dân. Trường học ấy đào tạo những công dân có ích."?',
      options: ['Phép thế', 'Phép lặp từ ngữ', 'Phép nối', 'Phép đồng nghĩa'],
      correctAnswer: 'Phép thế',
      explanation: `Từ ngữ "Trường học ấy" ở câu sau đã thay thế cho cụm từ "Trường học của chúng ta là trường học của chế độ dân chủ nhân dân" ở câu trước, đây là phép thế.`
    },
    {
      id: 'v2-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Biện pháp tu từ nói giảm nói tránh trong câu "Bác đã đi rồi sao Bác ơi!" (Tố Hữu) có tác dụng gì?',
      options: [
        'Giảm bớt nỗi đau xót, mất mát lớn lao trước sự ra đi của Bác',
        'Nhấn mạnh hành trình đi xa của Bác',
        'Tạo tính hài hước cho câu thơ',
        'Miêu tả hành động cụ thể của Bác'
      ],
      correctAnswer: 'Giảm bớt nỗi đau xót, mất mát lớn lao trước sự ra đi của Bác',
      explanation: `Từ "đi" thay cho từ "mất" hoặc "qua đời" nhằm tránh cảm giác quá đau buồn, nghẹn ngào trước sự ra đi của vị Cha già dân tộc.`
    },
    {
      id: 'v2-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Câu tục ngữ "Áo chàm đưa buổi phân ly / Cầm tay nhau biết nói gì hôm nay" (Tố Hữu) sử dụng biện pháp hoán dụ dựa trên mối quan hệ nào?',
      options: [
        'Lấy dấu hiệu của sự vật để chỉ sự vật (Áo chàm chỉ người Việt Bắc)',
        'Lấy một bộ phận để chỉ toàn thể',
        'Lấy vật chứa đựng để chỉ vật bị chứa đựng',
        'Lấy cái cụ thể để chỉ cái trừu tượng'
      ],
      correctAnswer: 'Lấy dấu hiệu của sự vật để chỉ sự vật (Áo chàm chỉ người Việt Bắc)',
      explanation: `"Áo chàm" là trang phục đặc trưng của đồng bào các dân tộc thiểu số vùng Việt Bắc, tác giả dùng dấu hiệu trang phục để gọi người Việt Bắc.`
    }
  ],

  'van-v3-nghi-luan-xa-hoi-tu-tuong': [
    {
      id: 'v3-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Đề bài nào sau đây thuộc dạng bài "Nghị luận về một tư tưởng, đạo lý"?',
      options: [
        'Suy nghĩ về ý nghĩa của lòng biết ơn trong cuộc sống',
        'Suy nghĩ về hiện tượng vứt rác bừa bãi nơi công cộng',
        'Bàn về việc học sinh lạm dụng điện thoại thông minh',
        'Thực trạng bạo lực học đường hiện nay'
      ],
      correctAnswer: 'Suy nghĩ về ý nghĩa của lòng biết ơn trong cuộc sống',
      explanation: `"Lòng biết ơn" là một phẩm chất đạo đức, chuẩn mực lối sống và tư tưởng đạo lý của con người.`
    },
    {
      id: 'v3-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Trong cấu trúc đoạn văn nghị luận xã hội 200 chữ, bước "Phản đề" (mở rộng vấn đề) có ý nghĩa gì?',
      options: [
        'Phê phán những biểu hiện trái ngược để bài viết đa chiều và sâu sắc hơn',
        'Để bài viết dài thêm đạt số lượng trang',
        'Bác bỏ hoàn toàn tư tưởng đạo lý đề bài nêu',
        'Kể một câu chuyện cổ tích làm dẫn chứng'
      ],
      correctAnswer: 'Phê phán những biểu hiện trái ngược để bài viết đa chiều và sâu sắc hơn',
      explanation: `Bước phản đề giúp lập luận toàn diện: vừa khẳng định mặt đúng, vừa phê phán những thái độ, hành vi lệch lạc đối lập.`
    },
    {
      id: 'v3-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Dẫn chứng nào sau đây thuyết phục và tiêu biểu nhất khi viết về đức tính kiên trì, vượt khó?',
      options: [
        'Thầy giáo Nguyễn Ngọc Ký rèn luyện viết chữ bằng chân',
        'Một bạn giấu tên cùng lớp rất chăm học',
        'Một nhân vật hư cấu trong truyện tranh',
        'Lời bài hát vừa mới phát hành trên mạng'
      ],
      correctAnswer: 'Thầy giáo Nguyễn Ngọc Ký rèn luyện viết chữ bằng chân',
      explanation: `Thầy giáo Nguyễn Ngọc Ký là tấm gương người thật, việc thật có sức lan tỏa rộng lớn và tính thuyết phục cao trong xã hội.`
    },
    {
      id: 'v3-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Quy tắc quan trọng nhất khi viết đoạn văn nghị luận xã hội khoảng 200 chữ trong đề thi vào 10 là:',
      options: [
        'Đúng dung lượng (khoảng 2/3 đến 1 trang giấy thi), không xuống dòng ngắt đoạn tùy tiện',
        'Chia bài thành 3 đoạn văn riêng biệt mở - thân - kết',
        'Càng viết dài càng được chấm điểm cao',
        'Không cần nêu dẫn chứng thực tế'
      ],
      correctAnswer: 'Đúng dung lượng (khoảng 2/3 đến 1 trang giấy thi), không xuống dòng ngắt đoạn tùy tiện',
      explanation: `Yêu cầu "viết một đoạn văn" bắt buộc chỉ viết thành MỘT ĐOẠN duy nhất (bắt đầu bằng lùi đầu dòng viết hoa và kết thúc bằng dấu chấm xuống dòng). Xuống dòng ngắt đoạn sẽ bị trừ 0.5 điểm hình thức.`
    },
    {
      id: 'v3-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Phần liên hệ bản thân ở cuối đoạn văn nghị luận về "Sự tử tế" cần trả lời được câu hỏi nào?',
      options: [
        'Bản thân em cần làm những việc cụ thể gì để sống tử tế hơn mỗi ngày?',
        'Em có đồng ý với đề bài không?',
        'Có bao nhiêu người tử tế trên thế giới?',
        'Tác giả là ai và viết bài khi nào?'
      ],
      correctAnswer: 'Bản thân em cần làm những việc cụ thể gì để sống tử tế hơn mỗi ngày?',
      explanation: `Liên hệ bản thân phải chân thành, thiết thực, gắn liền với hành động cụ thể của một học sinh lớp 9 (giúp đỡ bạn bè, kính trọng cha mẹ, ứng xử văn minh).`
    }
  ],

  'van-v4-nghi-luan-xa-hoi-hien-tuong': [
    {
      id: 'v4-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Thứ tự triển khai các luận điểm chuẩn trong bài nghị luận về một hiện tượng đời sống là:',
      options: [
        'Giải thích / Thực trạng → Nguyên nhân → Hậu quả / Tác động → Giải pháp',
        'Giải pháp → Thực trạng → Nguyên nhân → Kết luận',
        'Nguyên nhân → Dẫn chứng → Giải thích → Mở rộng',
        'Thực trạng → Dẫn chứng → Khen ngợi → Bác bỏ'
      ],
      correctAnswer: 'Giải thích / Thực trạng → Nguyên nhân → Hậu quả / Tác động → Giải pháp',
      explanation: `Quy trình lập luận logic: Nêu rõ hiện tượng là gì, đang diễn ra thế nào → Vì sao lại xảy ra → Gây ra tác hại/ảnh hưởng gì → Đề xuất giải pháp khắc phục.`
    },
    {
      id: 'v4-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Khi bàn về nguyên nhân của hiện tượng học sinh nghiện mạng xã hội, nguyên nhân chủ quan xuất phát từ:',
      options: [
        'Thiếu bản lĩnh tự chủ, chưa biết quản lý thời gian và thiếu kỹ năng sống',
        'Sự phát triển nhanh chóng của công nghệ 4G/5G',
        'Các thuật toán giữ chân người dùng của nhà mạng',
        'Do thị trường có quá nhiều dòng điện thoại thông minh giá rẻ'
      ],
      correctAnswer: 'Thiếu bản lĩnh tự chủ, chưa biết quản lý thời gian và thiếu kỹ năng sống',
      explanation: `Nguyên nhân chủ quan bắt nguồn từ chính ý thức, nhận thức và tâm lý của bản thân cá nhân người trong cuộc.`
    },
    {
      id: 'v4-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Đề xuất giải pháp trong bài văn nghị luận xã hội về hiện tượng đời sống cần có tính chất gì?',
      options: [
        'Cụ thể, khả thi, giải quyết được từ nguyên nhân và phối hợp nhiều phía (gia đình, nhà trường, xã hội)',
        'Càng hô khẩu hiệu to lớn càng tốt',
        'Chỉ cần dựa vào sự tự giác tuyệt đối của cá nhân',
        'Chỉ trích toàn bộ xã hội'
      ],
      correctAnswer: 'Cụ thể, khả thi, giải quyết được từ nguyên nhân và phối hợp nhiều phía (gia đình, nhà trường, xã hội)',
      explanation: `Giải pháp phải sát thực tế, bắt nguồn trực tiếp từ các nguyên nhân đã phân tích và có tính khả thi trong đời sống.`
    },
    {
      id: 'v4-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Hiện tượng "văn hóa ứng xử nơi công cộng" là hiện tượng:',
      options: [
        'Hiện tượng có cả mặt tích cực đáng biểu dương và mặt tiêu cực cần phê phán',
        'Hiện tượng thuần túy tiêu cực',
        'Hiện tượng chỉ xuất hiện ở giới trẻ',
        'Một vấn đề tư tưởng đạo lý trừu tượng'
      ],
      correctAnswer: 'Hiện tượng có cả mặt tích cực đáng biểu dương và mặt tiêu cực cần phê phán',
      explanation: `Văn hóa ứng xử có những tấm gương đẹp (xếp hàng, nhường ghế xe buýt) cần biểu dương, bên cạnh những hành vi phản cảm (chen lấn, nói tục) cần phê phán.`
    },
    {
      id: 'v4-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Để dẫn chứng trong bài nghị luận hiện tượng đời sống có sức thuyết phục cao nhất, thí sinh nên:',
      options: [
        'Chọn sự việc thời sự có thật, mang tính điển hình và được kiểm chứng rõ ràng',
        'Tự bịa ra tên người và số liệu thống kê',
        'Dùng những câu chuyện truyền thuyết từ xa xưa',
        'Nêu chung chung "theo một cuộc khảo sát gần đây"'
      ],
      correctAnswer: 'Chọn sự việc thời sự có thật, mang tính điển hình và được kiểm chứng rõ ràng',
      explanation: `Dẫn chứng thời sự tiêu biểu, chính xác giúp tăng độ tin cậy và tạo ấn tượng mạnh với giám khảo chấm thi.`
    }
  ],

  'van-v5-nghi-luan-van-hoc-tho': [
    {
      id: 'v5-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Bài thơ "Đồng chí" của Chính Hữu được sáng tác vào thời kỳ kháng chiến nào và năm bao nhiêu?',
      options: [
        'Kháng chiến chống Pháp (năm 1948)',
        'Kháng chiến chống Mỹ (năm 1969)',
        'Thời kỳ hòa bình lập lại (năm 1954)',
        'Thời kỳ đổi mới đất nước (năm 1986)'
      ],
      correctAnswer: 'Kháng chiến chống Pháp (năm 1948)',
      explanation: `Bài thơ "Đồng chí" được Chính Hữu sáng tác đầu năm 1948, sau chiến dịch Việt Bắc thu - đông 1947.`
    },
    {
      id: 'v5-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Hình ảnh biểu tượng giàu chất thơ và hiện thực ở cuối bài thơ "Đồng chí" là:',
      options: [
        'Đầu súng trăng treo',
        'Áo anh rách vai',
        'Miệng cười buốt giá',
        'Giếng nước gốc đa'
      ],
      correctAnswer: 'Đầu súng trăng treo',
      explanation: `"Đầu súng trăng treo" là biểu tượng đẹp kết hợp giữa hiện thực chiến đấu khốc liệt (súng) và tâm hồn lãng mạn yêu đời (trăng), giữa chiến sĩ và thi sĩ.`
    },
    {
      id: 'v5-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Nét độc đáo nhất trong giọng điệu và hình ảnh của "Bài thơ về tiểu đội xe không kính" (Phạm Tiến Duật) là:',
      options: [
        'Giọng điệu ngang tàng, trẻ trung, hóm hỉnh và đậm chất văn xuôi hiện thực',
        'Giọng điệu trầm buồn, bi thương và u uất',
        'Giọng điệu trang trọng, cổ kính theo lối thơ Đường luật',
        'Giọng điệu nhẹ nhàng, tha thiết như điệu dân ca'
      ],
      correctAnswer: 'Giọng điệu ngang tàng, trẻ trung, hóm hỉnh và đậm chất văn xuôi hiện thực',
      explanation: `Phạm Tiến Duật đã đưa chất liệu hiện thực chiến trường khốc liệt vào thơ với giọng điệu đậm chất lính trẻ: sôi nổi, lạc quan, ngang tàng vượt lên gian khổ.`
    },
    {
      id: 'v5-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Hình ảnh "mùa xuân nho nhỏ" trong bài thơ cùng tên của Thanh Hải mang ý nghĩa biểu tượng gì?',
      options: [
        'Khát vọng cống hiến phần đời đẹp nhất, khiêm nhường cho quê hương, đất nước',
        'Một mùa xuân ngắn ngủi của đời người',
        'Vẻ đẹp thiên nhiên xứ Huế lúc xuân về',
        'Tình yêu đôi lứa thời kháng chiến'
      ],
      correctAnswer: 'Khát vọng cống hiến phần đời đẹp nhất, khiêm nhường cho quê hương, đất nước',
      explanation: `"Mùa xuân nho nhỏ" là một ẩn dụ sáng tạo, thể hiện lẽ sống cao đẹp: mỗi người hãy là một mùa xuân tươi đẹp, lặng lẽ dâng hiến cho mùa xuân lớn của Tổ quốc.`
    },
    {
      id: 'v5-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Khi phân tích một đoạn thơ, sai lầm phổ biến nhất khiến bài làm bị điểm thấp là:',
      options: [
        'Diễn xuôi lại nội dung bài thơ mà không bám vào các tín hiệu nghệ thuật (từ ngữ, nhịp điệu, biện pháp tu từ)',
        'Trích dẫn đúng và đủ các câu thơ trong đề bài',
        'Nêu được hoàn cảnh sáng tác của bài thơ',
        'So sánh mở rộng với các tác phẩm cùng đề tài'
      ],
      correctAnswer: 'Diễn xuôi lại nội dung bài thơ mà không bám vào các tín hiệu nghệ thuật (từ ngữ, nhịp điệu, biện pháp tu từ)',
      explanation: `Thơ là nghệ thuật của ngôn từ và hình ảnh. Phân tích thơ bắt buộc phải đi từ các tín hiệu thẩm mỹ (từ ngữ, hình ảnh, nhịp thơ, phép tu từ) để làm nổi bật tâm trạng, tư tưởng chứ không được diễn xuôi.`
    }
  ],

  'van-v6-nghi-luan-van-hoc-truyen': [
    {
      id: 'v6-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Tình huống truyện then chốt tạo nên bước ngoặt tâm lý của nhân vật ông Hai trong truyện ngắn "Làng" (Kim Lân) là:',
      options: [
        'Ông Hai nghe tin làng Chợ Dầu của mình theo giặc từ miệng những người tản cư',
        'Ông Hai cùng gia đình đi tản cư lên vùng trung du',
        'Ông Hai làm việc chăm chỉ ngoài ruộng đất tản cư',
        'Ông Hai trò chuyện với cậu con trai út'
      ],
      correctAnswer: 'Ông Hai nghe tin làng Chợ Dầu của mình theo giặc từ miệng những người tản cư',
      explanation: `Tin dữ làng theo giặc đã đẩy tâm trạng ông Hai vào một cuộc đấu tranh nội tâm dữ dội giữa tình yêu làng và lòng yêu nước.`
    },
    {
      id: 'v6-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Nhân vật anh thanh niên trong truyện ngắn "Lặng lẽ Sa Pa" (Nguyễn Thành Long) tiêu biểu cho vẻ đẹp nào?',
      options: [
        'Vẻ đẹp của những con người lao động thầm lặng, say mê công việc và giàu tình nghĩa',
        'Vẻ đẹp kiên cường, dũng cảm nơi chiến trường bom đạn',
        'Vẻ đẹp của người nông dân chất phác, một nắng hai sương',
        'Vẻ đẹp người trí thức uyên bác sống tách biệt thế giới'
      ],
      correctAnswer: 'Vẻ đẹp của những con người lao động thầm lặng, say mê công việc và giàu tình nghĩa',
      explanation: `Anh thanh niên làm công tác khí tượng kiêm vật lý địa cầu trên đỉnh Yên Sơn 2600m là biểu tượng cho thế hệ trẻ cống hiến thầm lặng cho công cuộc xây dựng đất nước.`
    },
    {
      id: 'v6-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Chi tiết vết thẹo trên má của nhân vật ông Sáu trong "Chiếc lược ngà" (Nguyễn Quang Sáng) đóng vai trò gì trong cốt truyện?',
      options: [
        'Là nút thắt ngăn cách khiến bé Thu không nhận cha, và cũng là nút mở khi hiểu ra để tình cha con bùng nổ mãnh liệt',
        'Chỉ là chi tiết miêu tả ngoại hình cho chân thực',
        'Thể hiện nỗi căm thù của bé Thu đối với chiến tranh',
        'Làm cho nhân vật ông Sáu trở nên đáng sợ'
      ],
      correctAnswer: 'Là nút thắt ngăn cách khiến bé Thu không nhận cha, và cũng là nút mở khi hiểu ra để tình cha con bùng nổ mãnh liệt',
      explanation: `Vết thẹo vừa là chứng tích của chiến tranh tàn khốc, vừa là chi tiết nghệ thuật đắt giá thúc đẩy toàn bộ diễn biến tâm lý éo le mà cảm động của hai cha con.`
    },
    {
      id: 'v6-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Câu nói nổi tiếng của ông Hai: "Làng thì yêu thật, nhưng làng theo Tây mất rồi thì phải thù" thể hiện sự chuyển biến gì trong nhận thức?',
      options: [
        'Tình yêu làng quê đã thống nhất và đặt dưới tình yêu Tổ quốc, trung thành với kháng chiến',
        'Ông Hai đã hoàn toàn hết yêu làng Chợ Dầu',
        'Ông Hai muốn từ bỏ quê hương để chuyển đến nơi khác',
        'Ông Hai chỉ lo sợ bị người khác kỳ thị'
      ],
      correctAnswer: 'Tình yêu làng quê đã thống nhất và đặt dưới tình yêu Tổ quốc, trung thành với kháng chiến',
      explanation: `Câu nói khẳng định lập trường dứt khoát: Khi danh dự của làng mâu thuẫn với độc lập tự do của Tổ quốc, người nông dân đặt tình yêu nước và lòng trung thành với cách mạng lên trên hết.`
    },
    {
      id: 'v6-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Khi làm bài văn nghị luận phân tích một nhân vật trong tác phẩm truyện, thí sinh cần làm sáng tỏ qua những phương diện nào?',
      options: [
        'Hoàn cảnh xuất thân, ngoại hình, hành động, lời thoại, nội tâm và mối quan hệ với các nhân vật khác',
        'Chỉ cần tóm tắt lại toàn bộ diễn biến câu chuyện từ đầu đến cuối',
        'Chỉ nêu tiểu sử tác giả và năm xuất bản của cuốn sách',
        'Liệt kê tất cả các nhân vật phụ trong tác phẩm'
      ],
      correctAnswer: 'Hoàn cảnh xuất thân, ngoại hình, hành động, lời thoại, nội tâm và mối quan hệ với các nhân vật khác',
      explanation: `Phân tích nhân vật phải toàn diện qua các phương diện nghệ thuật xây dựng nhân vật (hoàn cảnh, hành động, ngôn ngữ, độc thoại nội tâm) nhằm làm bật lên phẩm chất và tư tưởng tác giả gửi gắm.`
    }
  ]
};
