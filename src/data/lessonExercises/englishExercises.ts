import { TopicExercise } from '../../types';

export const ENGLISH_LESSON_EXERCISES: Record<string, TopicExercise[]> = {
  'anh-a1-thi-dong-tu': [
    {
      id: 'a1-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'By the time my father came home yesterday, my sister and I ______ our homework.',
      options: ['had finished', 'have finished', 'finished', 'were finishing'],
      correctAnswer: 'had finished',
      explanation: `Hành động hoàn thành bài tập xảy ra TRƯỚC một hành động trong quá khứ ("came home yesterday") nên chia thì Quá khứ hoàn thành: had + V3/ed (had finished).`
    },
    {
      id: 'a1-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Look at those dark clouds! It ______ rain soon.',
      options: ['is going to', 'will', 'is raining', 'rains'],
      correctAnswer: 'is going to',
      explanation: `Dùng "be going to + V-bare" để diễn tả một dự đoán có bằng chứng cụ thể ở hiện tại ("Look at those dark clouds!").`
    },
    {
      id: 'a1-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'While Lan was reading a book, the lights suddenly ______ out.',
      options: ['went', 'was going', 'were going', 'had gone'],
      correctAnswer: 'went',
      explanation: `Hành động đang xảy ra trong quá khứ (Lan was reading) thì có một hành động khác xen vào (the lights went out - chia thì Quá khứ đơn).`
    },
    {
      id: 'a1-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'They ______ in Hanoi for ten years before they moved to Ho Chi Minh City in 2020.',
      options: ['had lived', 'have lived', 'lived', 'were living'],
      correctAnswer: 'had lived',
      explanation: `Hành động sống ở Hà Nội kéo dài 10 năm và đã kết thúc trước thời điểm chuyển vào TP.HCM (2020) nên chia thì Quá khứ hoàn thành (had lived).`
    },
    {
      id: 'a1-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'I haven\'t seen my primary school teacher since we ______ school five years ago.',
      options: ['left', 'have left', 'had left', 'were leaving'],
      correctAnswer: 'left',
      explanation: `Cấu trúc kinh điển với "since": Hiện tại hoàn thành + since + Mệnh đề Quá khứ đơn (S + V2/ed). Do đó động từ "leave" chia là "left".`
    }
  ],

  'anh-a2-cau-bi-dong': [
    {
      id: 'a2-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'A new bridge ______ across the Red River next year.',
      options: ['will be built', 'will build', 'is building', 'was built'],
      correctAnswer: 'will be built',
      explanation: `Dấu hiệu thời gian "next year" (tương lai đơn). Chủ ngữ "A new bridge" là vật bị tác động (bị động) nên cấu trúc là: will be + V3/ed (will be built).`
    },
    {
      id: 'a2-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'The house ______ when the earthquake struck the city.',
      options: ['was being painted', 'is painted', 'was painting', 'has been painted'],
      correctAnswer: 'was being painted',
      explanation: `Hành động ngôi nhà đang được sơn tại thời điểm động đất xảy ra trong quá khứ → Bị động của thì Quá khứ tiếp diễn: was/were + being + V3/ed.`
    },
    {
      id: 'a2-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Choose the correct passive sentence: "They have repaired the broken computer."',
      options: [
        'The broken computer has been repaired.',
        'The broken computer has repaired.',
        'The broken computer had been repaired.',
        'The broken computer was repaired.'
      ],
      correctAnswer: 'The broken computer has been repaired.',
      explanation: `Chuyển từ chủ động Hiện tại hoàn thành (have/has + V3/ed) sang bị động: S + have/has + been + V3/ed.`
    },
    {
      id: 'a2-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'My mother had the mechanic ______ her car yesterday.',
      options: ['repair', 'to repair', 'repaired', 'repairing'],
      correctAnswer: 'repair',
      explanation: `Cấu trúc nhờ vả thể chủ động với have: S + have + someone + V-bare (nguyên thể không to).`
    },
    {
      id: 'a2-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'It is reported that the ancient pagoda was destroyed by the fire. ➔ The ancient pagoda is reported ______ by the fire.',
      options: [
        'to have been destroyed',
        'to be destroyed',
        'having been destroyed',
        'to destroy'
      ],
      correctAnswer: 'to have been destroyed',
      explanation: `Cấu trúc bị động đặc biệt với động từ tường thuật khi hành động ở mệnh đề sau ("was destroyed") xảy ra TRƯỚC thời điểm hiện tại ("is reported"): S + is reported + to have been + V3/ed.`
    }
  ],

  'anh-a3-cau-dieu-kien': [
    {
      id: 'a3-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'If it rains tomorrow, we ______ the picnic.',
      options: ['will cancel', 'would cancel', 'cancelled', 'had cancelled'],
      correctAnswer: 'will cancel',
      explanation: `Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại hoặc tương lai: If + S + V(s/es), S + will + V-bare.`
    },
    {
      id: 'a3-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'If I ______ a bird, I would fly around the world.',
      options: ['were', 'am', 'was being', 'had been'],
      correctAnswer: 'were',
      explanation: `Câu điều kiện loại 2 giả định điều trái với thực tế ở hiện tại: Mệnh đề If dùng "were" cho tất cả các ngôi chủ ngữ.`
    },
    {
      id: 'a3-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'I don\'t have enough money to buy that laptop. ➔ I wish I ______ enough money to buy it.',
      options: ['had', 'have', 'have had', 'would have'],
      correctAnswer: 'had',
      explanation: `Câu ước trái với hiện tại (Wish for present): S + wish(es) + S + V2/ed (lùi một thì từ hiện tại đơn sang quá khứ đơn: have → had).`
    },
    {
      id: 'a3-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Unless you study hard, you will fail the entrance exam. ➔ If you ______ hard, you will fail the entrance exam.',
      options: ['do not study', 'study', 'will study', 'did not study'],
      correctAnswer: 'do not study',
      explanation: `Quy tắc biến đổi: Unless = If ... not. Do đó "Unless you study hard" tương đương với "If you do not study hard".`
    },
    {
      id: 'a3-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'If you had listened to my advice, you ______ in trouble now.',
      options: [
        'would not be',
        'would not have been',
        'will not be',
        'are not'
      ],
      correctAnswer: 'would not be',
      explanation: `Câu điều kiện hỗn hợp (Mixed conditional): Mệnh đề If giả định trong quá khứ ("had listened"), mệnh đề chính kết quả ở hiện tại ("now" → would + V-bare: would not be).`
    }
  ],

  'anh-a4-cau-tuong-thuat': [
    {
      id: 'a4-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: '"I am preparing for the entrance exam now," Nam said. ➔ Nam said that he ______ for the entrance exam then.',
      options: ['was preparing', 'is preparing', 'has prepared', 'had prepared'],
      correctAnswer: 'was preparing',
      explanation: `Khi chuyển sang câu gián tiếp có động từ tường thuật ở quá khứ ("said"): Hiện tại tiếp diễn (am preparing) lùi thành Quá khứ tiếp diễn (was preparing), trạng từ "now" đổi thành "then".`
    },
    {
      id: 'a4-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: '"Do you like pop music?" she asked me. ➔ She asked me ______ pop music.',
      options: [
        'if I liked',
        'if did I like',
        'whether I like',
        'that I liked'
      ],
      correctAnswer: 'if I liked',
      explanation: `Câu hỏi Yes/No chuyển sang tường thuật dùng "if / whether" + Chủ ngữ + Động từ lùi thì (do you like → I liked), không đảo trợ động từ.`
    },
    {
      id: 'a4-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: '"Where do you live?" the police officer asked the boy. ➔ The police officer asked the boy where ______.',
      options: ['he lived', 'did he live', 'does he live', 'he lives'],
      correctAnswer: 'he lived',
      explanation: `Câu hỏi Wh-question chuyển sang tường thuật: Từ để hỏi + Chủ ngữ + Động từ lùi thì (where + he + lived), tuyệt đối không mượn trợ động từ "did".`
    },
    {
      id: 'a4-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: '"Don\'t make noise in the library," the teacher said to the students. ➔ The teacher told the students ______ noise in the library.',
      options: ['not to make', 'to not make', 'don\'t make', 'not making'],
      correctAnswer: 'not to make',
      explanation: `Cấu trúc câu mệnh lệnh gián tiếp phủ định: S + told / asked + O + not to V (not to make noise).`
    },
    {
      id: 'a4-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: '"Why don\'t we go cycling this weekend?" Peter said. ➔ Peter suggested ______ cycling that weekend.',
      options: ['going', 'to go', 'we should go to', 'that go'],
      correctAnswer: 'going',
      explanation: `Cấu trúc gợi ý với suggest: S + suggested + V-ing (suggested going cycling) hoặc S + suggested that S + (should) + V-bare.`
    }
  ],

  'anh-a5-menh-de-quan-he': [
    {
      id: 'a5-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'The girl ______ won the first prize in the English speaking contest is my classmate.',
      options: ['who', 'whom', 'which', 'whose'],
      correctAnswer: 'who',
      explanation: `Đại từ quan hệ "who" làm chủ ngữ thay thế cho danh từ chỉ người ("The girl") đứng ngay phía trước.`
    },
    {
      id: 'a5-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Do you know the boy ______ father is a famous doctor in this hospital?',
      options: ['whose', 'whom', 'who', 'which'],
      correctAnswer: 'whose',
      explanation: `Đại từ quan hệ chỉ sở hữu "whose" đứng trước danh từ "father" (whose father = the boy's father).`
    },
    {
      id: 'a5-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'The book ______ you lent me last week is extremely interesting.',
      options: ['which', 'who', 'whom', 'whose'],
      correctAnswer: 'which',
      explanation: `Đại từ quan hệ "which" thay thế cho danh từ chỉ vật ("The book") làm tân ngữ cho mệnh đề phía sau.`
    },
    {
      id: 'a5-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'This is the most exciting movie ______ I have ever seen.',
      options: ['that', 'which', 'who', 'what'],
      correctAnswer: 'that',
      explanation: `Khi tiền từ có tính từ so sánh nhất ("the most exciting"), bắt buộc phải dùng đại từ quan hệ "that" chứ không dùng "which".`
    },
    {
      id: 'a5-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'The man ______ next to the principal is our new math teacher.',
      options: ['standing', 'stood', 'stands', 'who standing'],
      correctAnswer: 'standing',
      explanation: `Rút gọn mệnh đề quan hệ dạng chủ động (who is standing next to...) bằng cách dùng hiện tại phân từ V-ing: "standing".`
    }
  ],

  'anh-a6-tu-loai-word-form': [
    {
      id: 'a6-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Solar energy is not only plentiful and clean but also ______.',
      options: ['renewable', 'renew', 'renewal', 'renewably'],
      correctAnswer: 'renewable',
      explanation: `Cấu trúc song hành: sau "is" kết hợp với các tính từ "plentiful" và "clean", vị trí cần điền phải là một tính từ: renewable (có thể tái tạo).`
    },
    {
      id: 'a6-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'He spoke so ______ that none of the foreign tourists could understand him.',
      options: ['fast', 'fastly', 'quick', 'rapidity'],
      correctAnswer: 'fast',
      explanation: `Bổ nghĩa cho động từ thường "spoke" cần một trạng từ. Từ "fast" vừa là tính từ vừa là trạng từ (không có từ "fastly").`
    },
    {
      id: 'a6-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'We should protect wild animals from the danger of ______.',
      options: ['extinction', 'extinct', 'extinctive', 'extinguishing'],
      correctAnswer: 'extinction',
      explanation: `Sau giới từ "of" cần một danh từ: extinction (sự tuyệt chủng). Cụm từ quen thuộc: "danger of extinction".`
    },
    {
      id: 'a6-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'The local government has invested heavily to ______ the historic town.',
      options: ['modernize', 'modern', 'modernization', 'modernly'],
      correctAnswer: 'modernize',
      explanation: `Cấu trúc "to + V-bare" chỉ mục đích: vị trí cần một động từ nguyên mẫu: modernize (hiện đại hóa).`
    },
    {
      id: 'a6-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Her sudden ______ caused great disappointment to all the fans.',
      options: ['absence', 'absent', 'absently', 'absentee'],
      correctAnswer: 'absence',
      explanation: `Sau tính từ "sudden" và tính từ sở hữu "Her" cần một danh từ chỉ sự vắng mặt: absence.`
    }
  ],

  'anh-a7-phat-am-trong-am': [
    {
      id: 'a7-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'Choose the word whose underlined part is pronounced differently: /t/, /d/, /ɪd/',
      options: ['wanted', 'played', 'lived', 'cleaned'],
      correctAnswer: 'wanted',
      explanation: `Đuôi -ed phát âm là /ɪd/ sau âm /t/ và /d/: wanted (/ˈwɒntɪd/). Các từ còn lại phát âm là /d/: played, lived, cleaned.`
    },
    {
      id: 'a7-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Choose the word whose underlined part is pronounced differently: /s/, /z/, /ɪz/',
      options: ['books', 'cats', 'maps', 'dogs'],
      correctAnswer: 'dogs',
      explanation: `Đuôi -s phát âm là /s/ sau các âm vô thanh /k, p, t/: books, cats, maps. Từ "dogs" tận cùng bằng âm hữu thanh /g/ nên phát âm là /z/.`
    },
    {
      id: 'a7-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'Choose the word whose main stress is placed differently from the others:',
      options: ['teacher', 'student', 'village', 'maintain'],
      correctAnswer: 'maintain',
      explanation: `Quy tắc trọng âm từ 2 âm tiết: Danh từ 2 âm tiết thường nhấn âm 1: teacher (/ˈtiːtʃər/), student (/ˈstjuːdənt/), village (/ˈvɪlɪdʒ/). Động từ maintain nhấn âm 2 (/meɪnˈteɪn/).`
    },
    {
      id: 'a7-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'Choose the word whose main stress is placed on the third syllable:',
      options: ['disadvantage', 'environment', 'pollute', 'participate'],
      correctAnswer: 'disadvantage',
      explanation: `Từ "disadvantage" có tiền tố dis- và hậu tố -age, trọng âm rơi vào âm tiết thứ 3 (/ˌdɪsədˈvɑːntɪdʒ/). Các từ còn lại: environment (âm 2), pollute (âm 2), participate (âm 2).`
    },
    {
      id: 'a7-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'Choose the word whose underlined letter is pronounced differently:',
      options: ['chemist', 'church', 'chair', 'check'],
      correctAnswer: 'chemist',
      explanation: `Chữ "ch" trong "chemist" được phát âm là /k/ (/ˈkemɪst/). Trong ba từ còn lại, "ch" phát âm là /tʃ/: church, chair, check.`
    }
  ],

  'anh-a8-ky-nang-doc-hieu-dien-tu': [
    {
      id: 'a8-ex1',
      level: 'de',
      levelLabel: 'Nhận biết',
      question: 'In a reading passage, what is the best reading technique to quickly locate a specific number, year, or proper name?',
      options: ['Scanning', 'Skimming', 'Translating every word', 'Reading aloud'],
      correctAnswer: 'Scanning',
      explanation: `Scanning (đọc quét) là kỹ năng đảo nhanh mắt qua bài đọc để tìm kiếm một thông tin chi tiết cụ thể như con số, năm, tên riêng hay từ khóa.`
    },
    {
      id: 'a8-ex2',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'The word "exhausted" in the sentence "After running a 10km marathon, Peter felt completely exhausted" is closest in meaning to:',
      options: ['extremely tired', 'very excited', 'quite hungry', 'a bit nervous'],
      correctAnswer: 'extremely tired',
      explanation: `"exhausted" mang nghĩa là kiệt sức, kiệt quệ, đồng nghĩa với "extremely tired".`
    },
    {
      id: 'a8-ex3',
      level: 'trung-binh',
      levelLabel: 'Thông hiểu',
      question: 'In cloze tests (guided cloze), before choosing an answer, you should always check:',
      options: [
        'The words immediately before and after the gap for prepositions, collocations, or grammar structures',
        'Only the title of the passage',
        'Which option has the longest word',
        'Translate the entire text into Vietnamese first'
      ],
      correctAnswer: 'The words immediately before and after the gap for prepositions, collocations, or grammar structures',
      explanation: `Khi làm bài điền từ, xem xét ngữ cảnh xung quanh chỗ trống (từ đứng trước, đứng sau, giới từ đi kèm, cụm cố định) là chìa khóa để chọn đúng từ loại và nghĩa.`
    },
    {
      id: 'a8-ex4',
      level: 'kho',
      levelLabel: 'Vận dụng',
      question: 'When a question asks: "What is the main idea of the passage?", where can you usually find the key clue?',
      options: [
        'In the first and last sentences of the introduction and conclusion paragraphs',
        'In the very last footnote of the text',
        'Only in the third paragraph',
        'In numbers and statistical charts'
      ],
      correctAnswer: 'In the first and last sentences of the introduction and conclusion paragraphs',
      explanation: `Chủ đề hoặc ý chính của đoạn văn (Main Idea / Topic Sentence) thường nằm ở câu đầu tiên hoặc câu cuối cùng của đoạn mở bài và kết bài.`
    },
    {
      id: 'a8-ex5',
      level: 'kho',
      levelLabel: 'Vận dụng cao',
      question: 'In the sentence: "Deforestation destroys the habitats of animals. This leads to their extinction." What does the word "This" refer to?',
      options: [
        'The destruction of animal habitats by deforestation',
        'The wild animals',
        'The forest rangers',
        'Only the extinction'
      ],
      correctAnswer: 'The destruction of animal habitats by deforestation',
      explanation: `Đại từ chỉ định "This" thay thế cho toàn bộ sự việc được nhắc đến ở câu trước: việc phá rừng hủy hoại môi trường sống của động vật.`
    }
  ]
};
