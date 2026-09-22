// Ngân hàng và định nghĩa cho hệ thống tạo đề Văn ngẫu nhiên chuẩn GDPT 2018

export interface TopicItem {
  id: string;
  group: string;
  topic: string;
  subtopics: string[];
}

export const LITERATURE_TOPIC_BANK: TopicItem[] = [
  {
    id: 'grp1-giadinh',
    group: 'NHÓM 1 – GIA ĐÌNH',
    topic: 'Tình cảm gia đình',
    subtopics: [
      'Tình mẫu tử thiêng liêng',
      'Tình phụ tử âm thầm và bền bỉ',
      'Tình anh em sẻ chia gắn bó',
      'Giá trị tổ ấm gia đình trong bão giông',
      'Sự hi sinh lặng thầm của cha mẹ'
    ]
  },
  {
    id: 'grp2-tuoitre',
    group: 'NHÓM 2 – TUỔI TRẺ',
    topic: 'Tuổi trẻ và Khát vọng',
    subtopics: [
      'Ước mơ và hành trình theo đuổi đam mê',
      'Lí tưởng sống đẹp của thanh niên',
      'Khát vọng cống hiến xây dựng đất nước',
      'Trách nhiệm của người trẻ với bản thân và thời đại',
      'Sự trưởng thành qua vấp ngã',
      'Dám bước ra khỏi vùng an toàn và thử thách bản thân'
    ]
  },
  {
    id: 'grp3-nhancach',
    group: 'NHÓM 3 – NHÂN CÁCH',
    topic: 'Nhân cách và Đạo đức',
    subtopics: [
      'Lòng nhân ái và sự đồng cảm',
      'Lòng biết ơn trong cuộc sống hiện đại',
      'Sự tử tế giữa đời thường',
      'Lòng trung thực và lòng tự trọng',
      'Sự bao dung và thấu hiểu',
      'Tinh thần trách nhiệm và giữ chữ tín'
    ]
  },
  {
    id: 'grp4-hoctap',
    group: 'NHÓM 4 – HỌC TẬP',
    topic: 'Học tập và Tri thức',
    subtopics: [
      'Ý thức tự học trong kỉ nguyên số',
      'Văn hóa đọc và giá trị của sách',
      'Xây dựng thói quen học tập suốt đời',
      'Ý chí vượt khó vươn lên trong học tập',
      'Vượt qua áp lực học tập và thi cử',
      'Tinh thần ham học hỏi và tư duy phản biện'
    ]
  },
  {
    id: 'grp5-xahoi',
    group: 'NHÓM 5 – XÃ HỘI',
    topic: 'Đời sống và Xã hội',
    subtopics: [
      'Sống có trách nhiệm với cộng đồng',
      'Sự sẻ chia và tinh thần tương thân tương ái',
      'Tình người trong hoàn cảnh nghịch cảnh',
      'Văn hóa ứng xử văn minh trên không gian mạng',
      'Phòng chống và đẩy lùi bạo lực học đường',
      'Thức tỉnh trước lối sống ích kỉ, vô cảm',
      'Giữ gìn nét đẹp văn hóa ứng xử nơi công cộng'
    ]
  },
  {
    id: 'grp6-moitruong',
    group: 'NHÓM 6 – MÔI TRƯỜNG',
    topic: 'Môi trường và Thiên nhiên',
    subtopics: [
      'Hành động bảo vệ môi trường sống',
      'Ứng phó với biến đổi khí hậu toàn cầu',
      'Giảm thiểu rác thải nhựa và lối sống xanh',
      'Tiết kiệm tài nguyên nước và năng lượng',
      'Bảo vệ thiên nhiên và sự đa dạng sinh học'
    ]
  },
  {
    id: 'grp7-congnghe',
    group: 'NHÓM 7 – CÔNG NGHỆ',
    topic: 'Khoa học Công nghệ và Thời đại số',
    subtopics: [
      'Mạng xã hội: Cơ hội và thách thức',
      'Trí tuệ nhân tạo (AI) và vai trò của con người',
      'Ứng dụng công nghệ thông minh trong học tập',
      'Cảnh giác với chứng "nghiện" điện thoại và sống ảo',
      'Bộ lọc thông tin trước tin giả trên Internet',
      'Kĩ năng tự bảo vệ và trở thành công dân số văn minh'
    ]
  },
  {
    id: 'grp8-quehuong',
    group: 'NHÓM 8 – QUÊ HƯƠNG, ĐẤT NƯỚC',
    topic: 'Quê hương và Đất nước',
    subtopics: [
      'Tình yêu quê hương qua những điều bình dị',
      'Lòng yêu nước của thế hệ trẻ hôm nay',
      'Giữ gìn và phát huy truyền thống dân tộc',
      'Nhớ về cội nguồn và đạo lí "Uống nước nhớ nguồn"',
      'Trách nhiệm đóng góp xây dựng quê hương giàu đẹp'
    ]
  },
  {
    id: 'grp9-nghiluc',
    group: 'NHÓM 9 – NGHỊ LỰC',
    topic: 'Ý chí và Bản lĩnh',
    subtopics: [
      'Nghị lực sống và ngọn lửa niềm tin',
      'Vượt qua thất bại để tiến bước',
      'Tính kiên trì - chìa khóa của thành công',
      'Không bỏ cuộc trước nghịch cảnh khó khăn',
      'Biến nghịch cảnh thành động lực vươn lên'
    ]
  },
  {
    id: 'grp10-thoigian',
    group: 'NHÓM 10 – THỜI GIAN VÀ CUỘC SỐNG',
    topic: 'Thời gian và Ý nghĩa Cuộc sống',
    subtopics: [
      'Trân trọng từng khoảnh khắc thời gian',
      'Sống sâu sắc với giá trị của hiện tại',
      'Định nghĩa về hạnh phúc đích thực',
      'Kiếm tìm những điều có ý nghĩa trong cuộc sống',
      'Cân bằng giữa học tập, công việc và tâm hồn'
    ]
  }
];

export const VIETNAMESE_KNOWLEDGE_BANK = [
  'Ẩn dụ',
  'Hoán dụ',
  'Nói quá',
  'Nói giảm nói tránh',
  'Đảo ngữ',
  'Câu hỏi tu từ',
  'Điệp thanh / Điệp vần',
  'Từ tượng hình / Từ tượng thanh',
  'Thành phần biệt lập (Tình thái, Cảm thán, Gọi - đáp, Phụ chú)',
  'Nghĩa tường minh và hàm ẩn',
  'Câu khiến / Câu cảm',
  'Câu rút gọn / Câu đặc biệt',
  'Dẫn trực tiếp và Dẫn gián tiếp'
];

export const PARAGRAPH_TASK_TYPES = [
  'Ghi lại cảm nghĩ sâu sắc về một hình ảnh/thông điệp trong văn bản',
  'Phân tích chủ đề tư tưởng nổi bật của văn bản',
  'Phân tích nét đặc sắc về nghệ thuật và hiệu quả thẩm mĩ',
  'Kết hợp làm rõ nội dung ý nghĩa và nét nghệ thuật độc đáo'
];

export const SOCIAL_ESSAY_TYPES = [
  'Nghị luận về một vấn đề đời sống (Nêu quan điểm, lí lẽ, dẫn chứng)',
  'Nghị luận về một vấn đề cần giải quyết (Nguyên nhân, hậu quả, đề xuất giải pháp khả thi)'
];
