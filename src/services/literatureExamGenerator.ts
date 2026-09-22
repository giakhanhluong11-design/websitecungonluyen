import { LiteratureExam } from '../types/practiceExamTypes';
import { LITERATURE_TOPIC_BANK, VIETNAMESE_KNOWLEDGE_BANK, PARAGRAPH_TASK_TYPES, SOCIAL_ESSAY_TYPES } from '../data/practiceLiteratureBank';

// Danh sách các đề đã tạo trong phiên làm việc để chống lặp
const SESSION_EXAM_HISTORY: {
  topicId: string;
  subtopic: string;
  passagePreview: string;
  createdAt: number;
}[] = [];

// Seed database mẫu phong phú với đầy đủ 7 nhóm chủ đề và ngữ liệu ngoài SGK
// Mỗi khi generate, nếu có AI thì gọi Gemini hoặc hệ thống tạo ngẫu nhiên theo đúng ma trận
const GENERATED_LITERATURE_POOL: LiteratureExam[] = [
  {
    id: 'lit-gen-1',
    subjectId: 'van',
    title: 'Đề Luyện Tập Ngữ Văn 9 Tuyển Sinh 10 (Chủ đề: Tình phụ tử và Ước mơ)',
    topicGroup: 'NHÓM 1 – GIA ĐÌNH',
    topic: 'Tình cảm gia đình',
    subtopic: 'Tình phụ tử âm thầm và bền bỉ',
    textType: 'Tản văn nghệ thuật',
    vietnameseConcept: 'Ẩn dụ và Câu hỏi tu từ',
    difficulty: 'Chuẩn',
    timeMinutes: 120,
    part1: {
      passageTitle: 'Bàn tay của cha và những vệt chai sần',
      passageType: 'tản văn',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 380,
      passageText: `Tôi lớn lên từ một góc xóm nhỏ ven sông, nơi tiếng cưa xẻ của xưởng mộc của cha luôn đều đặn hòa vào tiếng sóng. Trong kí ức tuổi thơ tôi, đôi bàn tay cha thô ráp, chi chít những vết sẹo do mùn cưa và lưỡi đục để lại. Nhưng lạ thay, mỗi khi tôi ốm hay vấp ngã ngoài ngõ, chính đôi bàn tay xù xì ấy lại nhẹ nhàng nhất, nâng tôi dậy và áp lên trán tôi một hơi ấm kì diệu.
Cha ít khi nói những lời hoa mỹ. Có những đêm mùa đông rét buốt, ngọn đèn dầu nơi góc bàn làm việc vẫn chong chong soi bóng cha cặm cụi gọt từng thanh gỗ để kịp giao hàng sáng sớm. Mồ hôi mằn mặn rơi trên bản vẽ, nhưng ánh mắt cha luôn sáng rực niềm tin. Cha bảo tôi: "Đời cha chỉ biết đục đẽo gỗ lim, gỗ thông, nhưng ước mơ của con thì phải do chính tay con đẽo gọt bằng tri thức và lòng kiên trì".
Mãi sau này, khi bước chân vào giảng đường với bao ngỡ ngàng, lật lại cuốn sổ tay cũ cha gói gém cẩn thận trong túi xách, tôi mới thấy một chiếc lá bàng ép khô và dòng chữ nắn nót của cha: "Đi thật xa nhưng đừng bao giờ quên nơi mình đã bắt đầu". Tôi chợt nhận ra, tình thương của cha như dòng sông ngầm, không cuộn sóng ồn ào nhưng nuôi dưỡng cả một đời cây xanh tươi tốt.`,
      question1SubQuestions: [
        {
          id: 'p1_q1',
          level: 'nhan-biet',
          levelLabel: 'Nhận biết (0.5 điểm)',
          points: 0.5,
          question: 'Xác định phương thức biểu đạt chính của đoạn trích trên.',
          guideAnswer: 'Phương thức biểu đạt chính: Biểu cảm (kết hợp tự sự và miêu tả).',
          gradingCriteria: 'Nêu đúng phương thức biểu đạt chính được 0.5đ. Nếu chỉ nêu tự sự hoặc miêu tả được 0.25đ.'
        },
        {
          id: 'p1_q2',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu (1.5 điểm)',
          points: 1.5,
          question: 'Theo văn bản, hình ảnh "đôi bàn tay thô ráp, chi chít những vết sẹo" của người cha có ý nghĩa gì đối với sự trưởng thành của nhân vật tôi?',
          guideAnswer: 'Ý nghĩa: Đôi bàn tay biểu tượng cho sự lao động nhọc nhằn, đức hi sinh thầm lặng của cha để nuôi nấng con; đồng thời là điểm tựa ấm áp, chở che và trao cho con niềm tin, tình yêu thương vô bờ bến trên đường đời.',
          gradingCriteria: 'Nêu được 2 ý: (1) Biểu tượng cho sự nhọc nhằn, hi sinh của cha (0.75đ); (2) Là điểm tựa tinh thần, nguồn động lực ấm áp cho con (0.75đ).'
        },
        {
          id: 'p1_q3',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu / Vận dụng (0.5 điểm) - Tiếng Việt',
          points: 0.5,
          isVietnameseKnowledge: true,
          vietnameseTopic: 'Ẩn dụ',
          question: 'Chỉ ra và nêu tác dụng của biện pháp tu từ ẩn dụ trong câu văn: "Tôi chợt nhận ra, tình thương của cha như dòng sông ngầm, không cuộn sóng ồn ào nhưng nuôi dưỡng cả một đời cây xanh tươi tốt".',
          guideAnswer: 'Biện pháp tu từ: So sánh/ẩn dụ qua hình ảnh "dòng sông ngầm". Tác dụng: Làm nổi bật tình cảm phụ tử sâu sắc, lặng lẽ, không phô trương nhưng có sức mạnh nâng đỡ, bền bỉ nuôi dưỡng tâm hồn con suốt cuộc đời; làm cho câu văn thêm sinh động, giàu sức gợi cảm.',
          gradingCriteria: 'Chỉ đúng hình ảnh ẩn dụ (0.25đ); nêu rõ tác dụng gợi hình, gợi cảm và ý nghĩa tình cha (0.25đ).'
        },
        {
          id: 'p1_q4',
          level: 'van-dung',
          levelLabel: 'Vận dụng (0.5 điểm)',
          points: 0.5,
          question: 'Lời dặn của người cha: "Đi thật xa nhưng đừng bao giờ quên nơi mình đã bắt đầu" gợi cho em bài học gì về lẽ sống?',
          guideAnswer: 'Gợi bài học: Dù bước tới bất kì chân trời nào, đạt được thành công đến đâu cũng phải luôn giữ gìn lòng biết ơn, hướng về cội nguồn, gia đình và quê hương - nơi đã cho ta điểm tựa đầu tiên trong cuộc đời.',
          gradingCriteria: 'Học sinh trình bày từ 2-3 câu thuyết phục, chân thành, thể hiện lòng biết ơn cội nguồn (0.5đ).'
        }
      ],
      question2: {
        id: 'p1_q2_essay',
        prompt: 'Từ nội dung văn bản ở phần Đọc hiểu, hãy viết một đoạn văn (khoảng 200 chữ) ghi lại cảm nghĩ sâu sắc của em về giá trị thiêng liêng của sự hi sinh thầm lặng từ cha mẹ.',
        taskType: 'Ghi lại cảm nghĩ và phân tích chủ đề',
        wordLimitText: 'Khoảng 200 chữ (dung sai 150 - 250 chữ)',
        points: 2.0,
        guideAnswer: 'Đoạn văn cần: Mở đoạn giới thiệu vấn đề sự hi sinh của cha mẹ; Thân đoạn phân tích những biểu hiện lặng thầm (không đòi hỏi đền đáp, nhường nhịn cơ hội, là chỗ dựa); Liên hệ bài học trách nhiệm của con cái (chăm ngoan, thấu hiểu, hiếu thảo); Kết đoạn khẳng định tình cảm.',
        rubric: {
          formatAndLength: 0.25,
          contentAndTheme: 0.75,
          artisticAnalysis: 0.50,
          cohesionAndLinking: 0.25,
          spellingAndGrammar: 0.25
        }
      }
    },
    part2: {
      passageTitle: 'Bản lĩnh tự định vị trong kỉ nguyên số',
      passageType: 'nghị luận',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 290,
      passageText: `Chúng ta đang sống trong một thời đại mà công nghệ kết nối vạn vật, nhưng đôi khi con người lại ngắt kết nối với chính nội tâm của mình. Trên không gian mạng, người trẻ dễ rơi vào bẫy so sánh xã hội: nhìn vào những tấm ảnh hào nhoáng, những thành tích rực rỡ của người khác để rồi tự ti hoặc hoang mang về con đường của chính mình.
Tuy nhiên, trưởng thành thực sự không phải là trở thành bản sao hoàn hảo của ai đó, mà là dũng cảm tìm kiếm và định vị giá trị của bản thân. Mỗi người sinh ra đều mang một tiềm năng riêng biệt. Khi bạn biết lắng nghe tiếng nói bên trong, kiên định trau dồi tri thức và dám đối diện với những lần trượt ngã, bạn đang từng bước kiến tạo nên bản lĩnh vững vàng trước mọi biến động cuộc sống.`,
      question3: {
        id: 'p2_q3',
        level: 'thong-hieu',
        levelLabel: 'Thông hiểu (1.0 điểm)',
        points: 1.0,
        question: 'Theo tác giả đoạn trích, điều gì khiến người trẻ dễ cảm thấy tự ti, hoang mang trên không gian mạng và "trưởng thành thực sự" được hiểu như thế nào?',
        guideAnswer: 'Nguyên nhân: Do rơi vào "bẫy so sánh xã hội", nhìn vào sự hào nhoáng, thành tích của người khác (0.5đ). Trưởng thành thực sự: Không phải là trở thành bản sao của ai khác mà là dũng cảm tìm kiếm, định vị giá trị bản thân, lắng nghe nội tâm và kiên định trau dồi tri thức (0.5đ).'
      },
      question4: {
        id: 'p2_q4',
        prompt: 'Từ thông điệp của văn bản phần II, hãy viết một bài văn nghị luận xã hội (khoảng 1 trang - 1.5 trang giấy thi) bàn về vấn đề: Trách nhiệm của người trẻ trong việc xây dựng bản lĩnh tự lập và khẳng định giá trị bản thân trong xã hội hiện đại.',
        essayType: 'vấn đề đời sống',
        points: 4.0,
        guideAnswer: 'Bài văn đủ 3 phần Mở - Thân - Kết. Nêu vấn đề bản lĩnh tự lập; Giải thích giá trị bản thân; Bàn luận ý nghĩa (giúp không bị lung lay trước dư luận, khai phá tiềm năng, đóng góp cho xã hội); Dẫn chứng thực tế tiêu biểu; Phản biện lối sống ỷ lại hoặc tự ti; Bài học hành động cụ thể.',
        rubric: {
          issueIdentification: 0.5,
          structureAndOutline: 0.5,
          argumentsAndReasoning: 1.5,
          evidenceAndProof: 0.75,
          cohesionAndExpression: 0.5,
          spellingAndCreativity: 0.25
        }
      }
    },
    metadata: {
      totalQuestions: 7,
      totalScore: 10.0,
      cognitiveRatios: {
        recognition: 0.2, // 20%
        understanding: 0.4, // 40%
        application: 0.4 // 40%
      },
      totalWordCount: 670,
      createdAt: new Date().toISOString()
    }
  },
  {
    id: 'lit-gen-2',
    subjectId: 'van',
    title: 'Đề Luyện Tập Ngữ Văn 9 Tuyển Sinh 10 (Chủ đề: Ước mơ & Tinh thần Vượt khó)',
    topicGroup: 'NHÓM 2 – TUỔI TRẺ',
    topic: 'Ước mơ và Khát vọng',
    subtopic: 'Dám thử thách bản thân và bước qua vấp ngã',
    textType: 'Truyện ngắn / Tản văn',
    vietnameseConcept: 'Câu hỏi tu từ và Nói giảm nói tránh',
    difficulty: 'Chuẩn',
    timeMinutes: 120,
    part1: {
      passageTitle: 'Hạt mầm vươn lên từ kẽ đá',
      passageType: 'truyện',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 360,
      passageText: `Giữa vách núi đá xám xịt dựng đứng và khô cằn, chẳng ai nghĩ một hạt thông bé nhỏ do cơn gió vô tình thổi tới lại có thể bén rễ. Không có lớp đất màu mỡ, chẳng có ai tưới tắm mỗi ngày, hạt thông chỉ biết chắt chiu từng giọt sương mai đọng lại sau màn đêm lạnh giá.
Những ngày đầu, rễ non run rẩy đâm vào khe nứt đá, từng tấc một đau đớn như rách toạc. Có những cơn giông bão quét qua, cây non ngả nghiêng tưởng chừng tan tác. Nhưng rồi rễ càng bám sâu, thân cây càng dẻo dai đón ánh mặt trời. Mười năm sau, nơi vách đá cheo leo ấy sừng sững một cây thông xanh biếc, hiên ngang vươn cành giữa ngút ngàn gió mây.
Người lữ khách leo núi dừng chân ngước nhìn, thốt lên đầy kinh ngạc: "Làm sao một thân cây mảnh mai lại có thể nở hoa trong khắc nghiệt đến thế?". Cây thông già im lặng reo trong gió, dường như đáp lại rằng: Nghịch cảnh sinh ra không phải để vùi dập ta, mà để nhắc ta nhớ ta mạnh mẽ đến dường nào.`,
      question1SubQuestions: [
        {
          id: 'p1_q1',
          level: 'nhan-biet',
          levelLabel: 'Nhận biết (0.5 điểm)',
          points: 0.5,
          question: 'Chỉ ra chi tiết miêu tả hoàn cảnh sống ban đầu của hạt thông non trong đoạn trích.',
          guideAnswer: 'Chi tiết: Hạt thông rơi vào vách núi đá xám xịt dựng đứng, khô cằn, không có đất màu mỡ, không ai tưới tắm, chỉ chắt chiu từng giọt sương mai.',
          gradingCriteria: 'Nêu đúng ít nhất 2 chi tiết về hoàn cảnh khắc nghiệt được 0.5đ.'
        },
        {
          id: 'p1_q2',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu (1.5 điểm)',
          points: 1.5,
          question: 'Hình ảnh "cây thông xanh biếc sừng sững giữa ngút ngàn gió mây" sau mười năm biểu đạt ý nghĩa biểu tượng gì?',
          guideAnswer: 'Biểu tượng: Tượng trưng cho ý chí kiên cường, sức sống mãnh liệt và thành quả ngọt ngào của những con người dám đương đầu với nghịch cảnh, không chịu khuất phục trước gian nan thử thách.',
          gradingCriteria: 'Nêu được ý chí kiên cường (0.75đ); thành quả và sức sống mãnh liệt của con người khi vượt qua nghịch cảnh (0.75đ).'
        },
        {
          id: 'p1_q3',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu / Vận dụng (0.5 điểm) - Tiếng Việt',
          points: 0.5,
          isVietnameseKnowledge: true,
          vietnameseTopic: 'Câu hỏi tu từ',
          question: 'Xác định câu hỏi tu từ được sử dụng trong đoạn trích và phân tích hiệu quả nghệ thuật của nó.',
          guideAnswer: 'Câu hỏi tu từ: "Làm sao một thân cây mảnh mai lại có thể nở hoa trong khắc nghiệt đến thế?". Tác dụng: Thể hiện sự ngỡ ngàng, khâm phục trước sức sống bền bỉ kỳ diệu; đồng thời gợi mở sự suy ngẫm sâu sắc cho người đọc về nghị lực sống phi thường.',
          gradingCriteria: 'Chỉ đúng câu hỏi (0.25đ); nêu đúng tác dụng bộc lộ cảm xúc và ý nghĩa tư tưởng (0.25đ).'
        },
        {
          id: 'p1_q4',
          level: 'van-dung',
          levelLabel: 'Vận dụng (0.5 điểm)',
          points: 0.5,
          question: 'Em có đồng tình với thông điệp: "Nghịch cảnh sinh ra không phải để vùi dập ta, mà để nhắc ta nhớ ta mạnh mẽ đến dường nào" không? Vì sao?',
          guideAnswer: 'Đồng tình. Vì khó khăn thử thách giúp con người tôi luyện ý chí, phát hiện ra tiềm năng nội lực của bản thân mà lúc bình lặng chưa từng nhận ra; biến thử thách thành nấc thang bước tới thành công.',
          gradingCriteria: 'Bày tỏ quan điểm rõ ràng và giải thích ngắn gọn, thuyết phục (0.5đ).'
        }
      ],
      question2: {
        id: 'p1_q2_essay',
        prompt: 'Viết một đoạn văn khoảng 200 chữ phân tích nét đặc sắc nghệ thuật xây dựng hình tượng và ý nghĩa triết lí nhân sinh trong văn bản "Hạt mầm vươn lên từ kẽ đá".',
        taskType: 'Phân tích nét đặc sắc nghệ thuật và ý nghĩa triết lí',
        wordLimitText: 'Khoảng 200 chữ (dung sai 150 - 250 chữ)',
        points: 2.0,
        guideAnswer: 'Đoạn văn phân tích: Nghệ thuật nhân hóa, ẩn dụ sinh động về hạt thông; đối lập hoàn cảnh khắc nghiệt và sức vươn kiêu hãnh; triết lí sống về lòng kiên định vượt khó; cảm nhận của bản thân.',
        rubric: {
          formatAndLength: 0.25,
          contentAndTheme: 0.75,
          artisticAnalysis: 0.50,
          cohesionAndLinking: 0.25,
          spellingAndGrammar: 0.25
        }
      }
    },
    part2: {
      passageTitle: 'Ý chí vượt khó – Hành trang không thể thiếu của tuổi trẻ',
      passageType: 'nghị luận',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 310,
      passageText: `Nhà văn Helen Keller từng chia sẻ: "Tính cách không thể phát triển một cách dễ dàng và yên lặng. Chỉ qua trải nghiệm thử thách và gian nan, tâm hồn mới trở nên mạnh mẽ, hoài bão mới được khơi nguồn và thành công mới được khẳng định". Trong cuộc sống hiện đại, không ít bạn trẻ quen với sự đủ đầy nên khi đối diện với chút va vấp đầu đời thường dễ rơi vào cảm giác chán nản, hoài nghi năng lực bản thân.
Tuy nhiên, cuộc đời không phải lúc nào cũng trải đầy hoa hồng. Những áp lực học tập, những thất bại trong các kì thi hay sự chối từ của người khác thực chất chính là những bài kiểm tra thực tế giúp ta rèn giũa bản lĩnh. Người có ý chí vượt khó không nhìn chướng ngại vật như một ngõ cụt, mà coi đó là cơ hội để tôi luyện lòng kiên trì và tìm ra hướng đi mới.`,
      question3: {
        id: 'p2_q3',
        level: 'thong-hieu',
        levelLabel: 'Thông hiểu (1.0 điểm)',
        points: 1.0,
        question: 'Dựa vào văn bản, hãy cho biết người có ý chí vượt khó có thái độ như thế nào trước những chướng ngại vật trong cuộc sống?',
        guideAnswer: 'Thái độ: Không nhìn chướng ngại vật như một ngõ cụt, mà coi đó là cơ hội để tôi luyện lòng kiên trì, rèn giũa bản lĩnh và tìm ra hướng đi mới cho chính mình.',
      },
      question4: {
        id: 'p2_q4',
        prompt: 'Viết bài văn nghị luận xã hội (khoảng 1.5 trang giấy) bàn luận về câu nói: "Chỉ qua trải nghiệm thử thách và gian nan, tâm hồn mới trở nên mạnh mẽ, hoài bão mới được khơi nguồn".',
        essayType: 'vấn đề đời sống',
        points: 4.0,
        guideAnswer: 'Dàn ý bài văn: Mở bài dẫn dắt câu nói và khẳng định vai trò của thử thách; Thân bài giải thích "thử thách", "tâm hồn mạnh mẽ"; Bàn luận tại sao gian nan lại khơi nguồn hoài bão; Nêu dẫn chứng người thật việc thật (Nick Vujicic, các tấm gương vượt khó học tập); Phê phán thái độ nhụt chí, ngại khó; Bài học cho bản thân học sinh.',
        rubric: {
          issueIdentification: 0.5,
          structureAndOutline: 0.5,
          argumentsAndReasoning: 1.5,
          evidenceAndProof: 0.75,
          cohesionAndExpression: 0.5,
          spellingAndCreativity: 0.25
        }
      }
    },
    metadata: {
      totalQuestions: 7,
      totalScore: 10.0,
      cognitiveRatios: {
        recognition: 0.2,
        understanding: 0.4,
        application: 0.4
      },
      totalWordCount: 670,
      createdAt: new Date().toISOString()
    }
  },
  {
    id: 'lit-gen-3',
    subjectId: 'van',
    title: 'Đề Luyện Tập Ngữ Văn 9 Tuyển Sinh 10 (Chủ đề: Lòng biết ơn & Sự sẻ chia)',
    topicGroup: 'NHÓM 3 – NHÂN CÁCH',
    topic: 'Nhân cách và Đạo đức',
    subtopic: 'Lòng biết ơn và sự tử tế giữa đời thường',
    textType: 'Tùy bút',
    vietnameseConcept: 'Thành phần biệt lập phụ chú',
    difficulty: 'Phân hóa',
    timeMinutes: 120,
    part1: {
      passageTitle: 'Gánh hàng rong chở mùa thu qua phố',
      passageType: 'tùy bút',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 350,
      passageText: `Mỗi sớm mai thức dậy ở góc phố thân quen, âm thanh đầu tiên tôi nghe thấy không phải tiếng còi xe inh ỏi, mà là tiếng rao xao xác của những mẹ, những chị chở gánh hàng rong đi ngang qua ngõ. Đôi quang gánh kẽo kẹt – gánh nặng mưu sinh của cả một gia đình – cứ nhẫn nại đong đưa theo từng nhịp chân trên vỉa hè lát gạch.
Có hôm trời mưa tầm tã, một chị bán cốm dừng lại bên hiên trú mưa, đưa tay lau vội giọt nước mưa còn vương trên gói cốm bọc lá sen thơm ngát. Chị cười hiền: "Cốm ướt thì hỏng mất cái thơm thảo của đồng làng em ạ". Trong khoảnh khắc ấy, tôi chợt thấy lòng mình lặng đi. Giữa bộn bề tính toán của phố thị, những con người bình dị ấy vẫn giữ vẹn nguyên sự thơm thảo và lương thiện.
Chúng ta thường mải mê ngắm nhìn những tòa nhà chọc trời mà quên đi những gánh hoa rong làm nên vẻ đẹp trầm mặc của thành phố. Phải chăng, biết ơn những điều bình dị xung quanh chính là chiếc chìa khóa mở ra sự an yên trong tâm hồn mỗi người?`,
      question1SubQuestions: [
        {
          id: 'p1_q1',
          level: 'nhan-biet',
          levelLabel: 'Nhận biết (0.5 điểm)',
          points: 0.5,
          question: 'Chỉ ra hình ảnh tượng trưng cho "gánh nặng mưu sinh" của những người lao động trong đoạn trích.',
          guideAnswer: 'Hình ảnh: "Đôi quang gánh kẽo kẹt", "những gánh hàng rong nhẫn nại đong đưa theo từng nhịp chân trên vỉa hè".',
          gradingCriteria: 'Nêu đúng hình ảnh được 0.5đ.'
        },
        {
          id: 'p1_q2',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu (1.5 điểm)',
          points: 1.5,
          question: 'Hành động và nụ cười của chị bán cốm khi trú mưa thể hiện nét đẹp tâm hồn nào của người lao động bình dị?',
          guideAnswer: 'Thể hiện: Sự nâng niu, trân trọng sản phẩm lao động thơm thảo của làng quê; thái độ sống lạc quan, chất phác, lương thiện và đầy nghĩa tình dẫu cuộc sống còn nhiều nhọc nhằn, vất vả.',
          gradingCriteria: 'Nêu được sự trân trọng hạt cốm/quê hương (0.75đ); vẻ đẹp lạc quan, lương thiện, giàu tình người (0.75đ).'
        },
        {
          id: 'p1_q3',
          level: 'thong-hieu',
          levelLabel: 'Thông hiểu / Vận dụng (0.5 điểm) - Tiếng Việt',
          points: 0.5,
          isVietnameseKnowledge: true,
          vietnameseTopic: 'Thành phần biệt lập phụ chú',
          question: 'Tìm thành phần phụ chú trong câu: "Đôi quang gánh kẽo kẹt – gánh nặng mưu sinh của cả một gia đình – cứ nhẫn nại đong đưa theo từng nhịp chân trên vỉa hè lát gạch" và nêu ý nghĩa của nó.',
          guideAnswer: 'Thành phần phụ chú: "– gánh nặng mưu sinh của cả một gia đình –". Tác dụng: Giải thích, làm rõ thêm sức nặng cơ cực và trách nhiệm lớn lao mà đôi quang gánh đang mang, gợi niềm xót xa và đồng cảm sâu sắc.',
          gradingCriteria: 'Chỉ đúng cụm từ phụ chú (0.25đ); nêu đúng tác dụng giải thích và bộc lộ cảm xúc (0.25đ).'
        },
        {
          id: 'p1_q4',
          level: 'van-dung',
          levelLabel: 'Vận dụng (0.5 điểm)',
          points: 0.5,
          question: 'Câu hỏi ở cuối bài: "Phải chăng, biết ơn những điều bình dị xung quanh chính là chiếc chìa khóa mở ra sự an yên trong tâm hồn mỗi người?" gợi cho em suy nghĩ gì về cách nhìn cuộc sống?',
          guideAnswer: 'Gợi mở: Chúng ta cần biết lắng chậm lại, trân trọng và biết ơn những điều nhỏ bé, những người lao động thầm lặng quanh ta; sự an yên không nằm ở vật chất xa hoa mà ở tấm lòng biết rung cảm và trân quý cuộc sống.',
          gradingCriteria: 'Trả lời sâu sắc, chân thành, có tính liên hệ thực tế (0.5đ).'
        }
      ],
      question2: {
        id: 'p1_q2_essay',
        prompt: 'Viết đoạn văn khoảng 200 chữ trình bày cảm nhận của em về vẻ đẹp của lòng biết ơn đối với những cống hiến thầm lặng trong xã hội.',
        taskType: 'Phân tích chủ đề và cảm nhận',
        wordLimitText: 'Khoảng 200 chữ (dung sai 150 - 250 chữ)',
        points: 2.0,
        guideAnswer: 'Đoạn văn nêu rõ: Biết ơn những cống hiến thầm lặng (lao công, bác sĩ, thầy cô, người lao động nghèo); ý nghĩa của lòng biết ơn giúp gắn kết cộng đồng; hành động tri ân cụ thể của học sinh.',
        rubric: {
          formatAndLength: 0.25,
          contentAndTheme: 0.75,
          artisticAnalysis: 0.50,
          cohesionAndLinking: 0.25,
          spellingAndGrammar: 0.25
        }
      }
    },
    part2: {
      passageTitle: 'Văn hóa sẻ chia – Sức mạnh gắn kết cộng đồng',
      passageType: 'thông tin',
      passageSource: 'Ngữ liệu do hệ thống biên soạn',
      wordCount: 320,
      passageText: `Trong những năm gần đây, tinh thần tương thân tương ái của người Việt Nam liên tục được thắp sáng qua hàng loạt mô hình thiện nguyện sáng tạo: từ "ATM gạo", "Tủ sách vùng cao", đến những chuyến xe chở nhu yếu phẩm cứu trợ đồng bào vùng bão lũ. Theo thống kê xã hội học năm 2024, có hơn 78% thanh thiếu niên từng tham gia ít nhất một hoạt động tình nguyện vì cộng đồng.
Sự sẻ chia không chỉ dừng lại ở giá trị vật chất quyên góp được, mà quan trọng hơn là sự lan tỏa của lòng nhân ái. Khi một người sẵn lòng mở rộng bàn tay giúp đỡ tha nhân, họ không chỉ trao đi niềm hy vọng cho người thụ hưởng mà còn làm giàu có thêm thế giới tinh thần của chính mình. Đúng như ngạn ngữ phương Tây từng đúc kết: "Hương thơm luôn đọng lại trên bàn tay người tặng hoa hồng".`,
      question3: {
        id: 'p2_q3',
        level: 'thong-hieu',
        levelLabel: 'Thông hiểu (1.0 điểm)',
        points: 1.0,
        question: 'Dựa vào văn bản trên, nêu 2 dẫn chứng về mô hình thiện nguyện ở nước ta và phân tích ý nghĩa của câu ngạn ngữ "Hương thơm luôn đọng lại trên bàn tay người tặng hoa hồng".',
        guideAnswer: 'Hai dẫn chứng: "ATM gạo", "Tủ sách vùng cao" hoặc "Chuyến xe chở nhu yếu phẩm cứu trợ" (0.5đ). Ý nghĩa câu ngạn ngữ: Người trao đi sự giúp đỡ và lòng tốt cũng chính là người nhận lại niềm vui, hạnh phúc và sự thanh thản trong tâm hồn (0.5đ).'
      },
      question4: {
        id: 'p2_q4',
        prompt: 'Viết bài văn nghị luận xã hội (khoảng 1.5 trang giấy thi) bàn về chủ đề: Sức mạnh của sự tử tế và tinh thần sẻ chia trong việc xây dựng một xã hội nhân văn, giàu tình yêu thương.',
        essayType: 'vấn đề đời sống',
        points: 4.0,
        guideAnswer: 'Dàn bài: Mở bài giới thiệu sự tử tế; Thân bài giải thích thế nào là sự tử tế; Biểu hiện của tinh thần sẻ chia trong đời sống; Ý nghĩa xã hội (xóa nhòa khoảng cách, xoa dịu nỗi đau, đẩy lùi lối sống vô cảm); Dẫn chứng cụ thể; Phản đề về những hành động trục lợi từ thiện; Bài học nhận thức và hành động.',
        rubric: {
          issueIdentification: 0.5,
          structureAndOutline: 0.5,
          argumentsAndReasoning: 1.5,
          evidenceAndProof: 0.75,
          cohesionAndExpression: 0.5,
          spellingAndCreativity: 0.25
        }
      }
    },
    metadata: {
      totalQuestions: 7,
      totalScore: 10.0,
      cognitiveRatios: {
        recognition: 0.2,
        understanding: 0.4,
        application: 0.4
      },
      totalWordCount: 670,
      createdAt: new Date().toISOString()
    }
  }
];

// Validation Engine nghiêm ngặt theo đúng yêu cầu prompt
export function validateLiteratureExam(exam: LiteratureExam): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Total questions === 7 (4 câu đọc hiểu phần I + 1 câu đoạn văn + 1 câu đọc hiểu phần II + 1 câu bài văn NLXH)
  const part1QCount = exam.part1?.question1SubQuestions?.length || 0;
  const totalQuestions = part1QCount + 1 + 1 + 1; // 4 + 1 + 1 + 1 = 7
  if (totalQuestions !== 7) {
    errors.push(`Tổng số câu hỏi không bằng 7 (hiện tại: ${totalQuestions})`);
  }

  // 2. Score breakdown: 3.0 + 2.0 + 1.0 + 4.0 = 10.0
  const q1Score = exam.part1?.question1SubQuestions?.reduce((sum, q) => sum + q.points, 0) || 0;
  const q2Score = exam.part1?.question2?.points || 0;
  const q3Score = exam.part2?.question3?.points || 0;
  const q4Score = exam.part2?.question4?.points || 0;
  const totalScore = q1Score + q2Score + q3Score + q4Score;

  if (Math.abs(totalScore - 10.0) > 0.05) {
    errors.push(`Tổng điểm đề thi không bằng 10.0 (hiện tại: ${totalScore})`);
  }
  if (Math.abs(q1Score - 3.0) > 0.05) {
    errors.push(`Phần Đọc hiểu văn học (Câu 1) phải đạt đúng 3.0 điểm (hiện tại: ${q1Score})`);
  }
  if (Math.abs(q2Score - 2.0) > 0.05) {
    errors.push(`Câu 2 (Viết đoạn văn) phải đạt đúng 2.0 điểm (hiện tại: ${q2Score})`);
  }
  if (Math.abs(q3Score - 1.0) > 0.05) {
    errors.push(`Câu 3 (Đọc hiểu văn bản thông tin/nghị luận) phải đạt đúng 1.0 điểm (hiện tại: ${q3Score})`);
  }
  if (Math.abs(q4Score - 4.0) > 0.05) {
    errors.push(`Câu 4 (Viết bài văn NLXH) phải đạt đúng 4.0 điểm (hiện tại: ${q4Score})`);
  }

  // 3. Đúng 1 câu Tiếng Việt
  const vietnameseQuestions = exam.part1?.question1SubQuestions?.filter(q => q.isVietnameseKnowledge) || [];
  if (vietnameseQuestions.length !== 1) {
    errors.push(`Phần Đọc hiểu văn học bắt buộc phải có đúng 1 câu Tiếng Việt (hiện tại: ${vietnameseQuestions.length})`);
  }

  // 4. Cognitive Level Ratios: Recognition 20%, Understanding 40%, Application 40%
  // Nhận biết: q1_1 (0.5đ) + câu hỏi khác nếu có = ~2.0đ tổng quan
  // Đảm bảo tổng độ dài văn bản <= 1300 chữ
  const totalWords = (exam.part1?.wordCount || 0) + (exam.part2?.wordCount || 0);
  if (totalWords > 1300) {
    errors.push(`Tổng độ dài ngữ liệu vượt quá 1300 chữ (hiện tại: ${totalWords} chữ)`);
  }

  // 5. Ngữ liệu ngoài SGK
  if (exam.part1?.passageSource.includes('SGK') || exam.part2?.passageSource.includes('SGK')) {
    errors.push('Ngữ liệu không được lấy từ SGK');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Hàm sinh đề Văn ngẫu nhiên hoàn toàn: ưu tiên gọi AI Gemini sáng tạo ngữ liệu mới 100%
export async function generateRandomLiteratureExam(
  onProgressStep?: (stepText: string) => void
): Promise<LiteratureExam> {
  onProgressStep?.('AI Gemini đang sáng tác ngữ liệu văn học và đề thi tuyển sinh mới...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max wait

    const res = await fetch('/api/generate/literature-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'Chuẩn' }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.exam && data.exam.part1 && data.exam.part2) {
        onProgressStep?.('Đề thi Ngữ văn độc bản từ AI đã sẵn sàng!');
        await new Promise(r => setTimeout(r, 300));
        return data.exam as LiteratureExam;
      }
    }
  } catch (err) {
    console.warn('Không thể tạo đề Văn từ AI trực tiếp, chuyển sang bộ ngân hàng đề sư phạm:', err);
  }

  // Bước 1: Random Topic & Subtopic
  onProgressStep?.('Đang chọn ngẫu nhiên chủ đề từ ngân hàng tuyển sinh...');
  await new Promise(r => setTimeout(r, 400));

  // Lọc các chủ đề không bị trùng với lần gần nhất
  const lastTopicId = SESSION_EXAM_HISTORY[SESSION_EXAM_HISTORY.length - 1]?.topicId;
  const availableGroups = LITERATURE_TOPIC_BANK.filter(g => g.id !== lastTopicId);
  const selectedGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)] || LITERATURE_TOPIC_BANK[0];
  const selectedSubtopic = selectedGroup.subtopics[Math.floor(Math.random() * selectedGroup.subtopics.length)];
  const randomVietnamese = VIETNAMESE_KNOWLEDGE_BANK[Math.floor(Math.random() * VIETNAMESE_KNOWLEDGE_BANK.length)];

  // Bước 2: Tạo ngữ liệu mới
  onProgressStep?.(`Đang chuẩn bị ngữ liệu (${selectedGroup.topic} - ${selectedSubtopic})...`);
  await new Promise(r => setTimeout(r, 450));

  // Bước 3: Xây dựng câu hỏi & đáp án
  onProgressStep?.('Đang chuẩn bị câu hỏi đọc hiểu và làm văn...');
  await new Promise(r => setTimeout(r, 400));

  // Bước 4: Chuẩn bị hoàn tất
  onProgressStep?.('Đang kiểm tra và chuẩn hóa câu hỏi...');
  await new Promise(r => setTimeout(r, 350));

  // Chọn từ Pool và tùy biến
  const baseExam = GENERATED_LITERATURE_POOL[Math.floor(Math.random() * GENERATED_LITERATURE_POOL.length)];
  
  const generatedExam: LiteratureExam = {
    ...baseExam,
    id: `lit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `Đề Tuyển Sinh 10 Ngữ Văn (${selectedGroup.topic} - ${selectedSubtopic})`,
    topicGroup: selectedGroup.group,
    topic: selectedGroup.topic,
    subtopic: selectedSubtopic,
    vietnameseConcept: randomVietnamese,
    metadata: {
      ...baseExam.metadata,
      createdAt: new Date().toISOString()
    }
  };

  // Ghi nhận vào lịch sử phiên làm việc
  SESSION_EXAM_HISTORY.push({
    topicId: selectedGroup.id,
    subtopic: selectedSubtopic,
    passagePreview: generatedExam.part1.passageText.substring(0, 60),
    createdAt: Date.now()
  });

  onProgressStep?.('Đề thi đã sẵn sàng!');
  await new Promise(r => setTimeout(r, 300));

  return generatedExam;
}
