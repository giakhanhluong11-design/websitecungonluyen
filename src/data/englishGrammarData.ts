export interface GrammarRule {
  id: string;
  title: string;
  subtitle?: string;
  use: string;
  form: string;
  signalWords?: string;
  examples: [string, string]; // đúng 2 ví dụ
  commonMistakes: string;
}

export const ENGLISH_GRAMMAR_RULES: Record<string, GrammarRule[]> = {
  // A1: Hệ thống thì động từ cốt lõi
  'anh-a1-thi-dong-tu': [
    {
      id: 'a1-r1',
      title: 'Present Simple',
      subtitle: '(Thì Hiện tại đơn)',
      use: 'Diễn tả hành động lặp đi lặp lại như một thói quen (habit), một chân lý hay sự thật hiển nhiên (general truth), hoặc lịch trình/thời gian biểu cố định.',
      form: 'Khẳng định (+): S + V(s/es) + (O)\nPhủ định (-): S + do/does + not + V(nguyên mẫu)\nNghi vấn (?): Do/Does + S + V(nguyên mẫu)?',
      signalWords: 'always, usually, often, sometimes, rarely, never, every day/week/month, once/twice a week...',
      examples: [
        'She usually walks to school every morning with her best friends.',
        'The earth moves around the sun once every 365 days.'
      ],
      commonMistakes: 'Quên thêm "s/es" khi chủ ngữ là ngôi thứ 3 số ít (He, She, It, Danh từ số ít), hoặc khi đã mượn trợ động từ "does/doesn\'t" mà vẫn chia đuôi "s/es" ở động từ chính.'
    },
    {
      id: 'a1-r2',
      title: 'Present Continuous',
      subtitle: '(Thì Hiện tại tiếp diễn)',
      use: 'Diễn tả hành động đang diễn ra ngay tại thời điểm nói, hoặc hành động mang tính chất tạm thời (temporary), hoặc diễn tả lời phàn nàn đi với "always".',
      form: 'Khẳng định (+): S + am/is/are + V-ing + (O)\nPhủ định (-): S + am/is/are + not + V-ing\nNghi vấn (?): Am/Is/Are + S + V-ing?',
      signalWords: 'now, right now, at the moment, at present, Look!, Listen!, Keep silent!...',
      examples: [
        'Listen! Someone is knocking at the front door loudly.',
        'My sister is studying hard for her upcoming entrance exam this month.'
      ],
      commonMistakes: 'Sử dụng thì tiếp diễn với các động từ chỉ giác quan hoặc trạng thái nhận thức (stative verbs) như know, understand, believe, love, hate, want, need, see, hear...'
    },
    {
      id: 'a1-r3',
      title: 'Past Simple',
      subtitle: '(Thì Quá khứ đơn)',
      use: 'Diễn tả một hành động đã xảy ra và kết thúc hoàn toàn tại một thời điểm xác định trong quá khứ.',
      form: 'Khẳng định (+): S + V2/ed + (O)\nPhủ định (-): S + did + not + V(nguyên mẫu)\nNghi vấn (?): Did + S + V(nguyên mẫu)?',
      signalWords: 'yesterday, ago (2 days ago), last (last night, last year), in + năm quá khứ (in 2018), when I was young...',
      examples: [
        'My family visited Da Nang and Hoi An Ancient Town last summer holiday.',
        'He did not attend the meeting yesterday because he was feeling ill.'
      ],
      commonMistakes: 'Quên chuyển động từ bất quy tắc sang cột 2 (ví dụ: go -> went, see -> saw, buy -> bought) hoặc vẫn giữ V-ed sau khi đã dùng trợ động từ "did/didn\'t".'
    },
    {
      id: 'a1-r4',
      title: 'Past Continuous & When/While',
      subtitle: '(Quá khứ tiếp diễn phối hợp thì)',
      use: 'Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ, hoặc một hành động đang xảy ra thì có hành động khác xen vào (When + Quá khứ đơn, Quá khứ tiếp diễn / While + Quá khứ tiếp diễn).',
      form: 'S + was/were + V-ing\nCắt ngang: When + S + V2/ed, S + was/were + V-ing\nSong song: While + S + was/were + V-ing, S + was/were + V-ing',
      signalWords: 'at this time yesterday, at 8 p.m last night, when, while, as...',
      examples: [
        'When the telephone rang, we were having dinner in the dining room.',
        'While my father was reading books, my mother was cooking in the kitchen.'
      ],
      commonMistakes: 'Dùng nhầm "was" và "were" (was đi với I/He/She/It/danh từ số ít; were đi với You/We/They/danh từ số nhiều), hoặc đặt nhầm thì tiếp diễn sau "When" cho hành động cắt ngang.'
    },
    {
      id: 'a1-r5',
      title: 'Present Perfect',
      subtitle: '(Thì Hiện tại hoàn thành)',
      use: 'Diễn tả hành động bắt đầu trong quá khứ kéo dài đến hiện tại và còn có khả năng tiếp diễn; diễn tả trải nghiệm/kinh nghiệm bản thân hoặc hành động vừa mới xảy ra để lại kết quả ở hiện tại.',
      form: 'Khẳng định (+): S + have/has + V3/ed + (O)\nPhủ định (-): S + have/has + not + V3/ed\nNghi vấn (?): Have/Has + S + V3/ed?',
      signalWords: 'since (+ mốc thời gian), for (+ khoảng thời gian), already, yet, just, recently, so far, ever, never, several times...',
      examples: [
        'They have lived in Ho Chi Minh City for more than ten years.',
        'I have already finished all my English homework for tomorrow.'
      ],
      commonMistakes: 'Dùng lẫn lộn giữa "Since" và "For" (since 2010 vs. for 10 years); hoặc dùng thì Quá khứ đơn khi câu có từ nhận biết "since/for" hoặc "so far".'
    }
  ],

  // A2: Câu bị động & Câu ước
  'anh-a2-cau-bi-dong': [
    {
      id: 'a2-r1',
      title: 'Passive Voice (General Tenses)',
      subtitle: '(Câu bị động các thì cơ bản)',
      use: 'Dùng khi muốn nhấn mạnh vào đối tượng chịu tác động của hành động thay vì người thực hiện, hoặc khi người thực hiện hành động không quan trọng, không biết hoặc đã hiển nhiên.',
      form: 'Chủ động (Active): S + V + O\nBị động (Passive): S + be (chia cùng thì) + V3/ed (+ by O)\n• Hiện tại đơn: S + am/is/are + V3/ed\n• Quá khứ đơn: S + was/were + V3/ed\n• Hiện tại hoàn thành: S + have/has been + V3/ed',
      signalWords: 'by + tân ngữ tác nhân (by the teacher, by workers), các trạng từ chỉ thời gian của từng thì tương ứng.',
      examples: [
        'A modern high school was built in our district last year.',
        'English is spoken by millions of students around the world.'
      ],
      commonMistakes: 'Không chia động từ "to be" phù hợp với chủ ngữ mới (số ít/số nhiều), quên chia động từ chính về dạng phân từ 2 (V3/ed), hoặc không lược bỏ "by people, by them, by someone".'
    },
    {
      id: 'a2-r2',
      title: 'Passive Voice with Modal Verbs',
      subtitle: '(Câu bị động với động từ khuyết thiếu)',
      use: 'Dùng khi câu chủ động có chứa động từ khuyết thiếu như can, could, may, might, must, should, will, would, have to... để diễn tả bổn phận, khả năng hay sự cần thiết bị động.',
      form: 'Chủ động (Active): S + Modal Verb + V(nguyên mẫu) + O\nBị động (Passive): S + Modal Verb + be + V3/ed (+ by O)',
      signalWords: 'must be, should be, can be, will be, ought to be, have to be...',
      examples: [
        'These dangerous chemical bottles must be kept out of children\'s reach.',
        'All traffic rules should be strictly obeyed by every citizen.'
      ],
      commonMistakes: 'Quên thêm động từ nguyên mẫu "be" sau modal verb (ví dụ viết nhầm "must done" thay vì "must be done").'
    },
    {
      id: 'a2-r3',
      title: 'Wish Sentences (Present Wish)',
      subtitle: '(Câu ước ở hiện tại - Trái ngược thực tế)',
      use: 'Diễn tả một mong muốn, ước muốn về một sự việc không có thật hoặc trái ngược với thực tế ở hiện tại.',
      form: 'S + wish(es) + S + V2/ed (+ O)\n* Lưu ý động từ To Be: dùng "were" cho tất cả các ngôi (I, he, she, it, we, you, they)',
      signalWords: 'If only..., I wish..., thực tế là hiện tại phủ định hoặc khẳng định.',
      examples: [
        'I wish I had enough free time to travel around Vietnam with my family.',
        'My brother wishes he were taller so that he could join the basketball club.'
      ],
      commonMistakes: 'Không lùi thì động từ sau "wish" (dùng hiện tại đơn thay vì quá khứ đơn), hoặc dùng "was" thay vì "were" trong các bài thi tuyển sinh chuẩn tắc.'
    },
    {
      id: 'a2-r4',
      title: 'Wish Sentences (Future Wish)',
      subtitle: '(Câu ước ở tương lai - Mong muốn thay đổi)',
      use: 'Diễn tả một mong muốn một điều gì đó sẽ xảy ra hoặc ai đó sẽ thay đổi hành vi trong tương lai.',
      form: 'S + wish(es) + S + would/could + V(nguyên mẫu) + (O)',
      signalWords: 'tomorrow, next week, in the future, soon...',
      examples: [
        'We wish the heavy storm would stop tomorrow so we can go to school.',
        'I wish my teacher could join our farewell party next Sunday.'
      ],
      commonMistakes: 'Dùng "will/can" thay vì lùi thì thành "would/could" sau mệnh đề "wish".'
    }
  ],

  // A3: Câu điều kiện (Conditional Sentences)
  'anh-a3-cau-dieu-kien': [
    {
      id: 'a3-r1',
      title: 'Conditional Type 1',
      subtitle: '(Câu điều kiện loại 1 - Có thật ở hiện tại/tương lai)',
      use: 'Diễn tả một điều kiện có thể xảy ra ở hiện tại hoặc tương lai và kết quả có thể xảy ra của nó.',
      form: 'If + S + V(hiện tại đơn), S + will/can/may/must + V(nguyên mẫu)\nHoặc: S + will/can + V(nguyên mẫu) + if + S + V(hiện tại đơn)',
      signalWords: 'If, unless, as long as, provided that, or/otherwise (Study hard or you will fail)...',
      examples: [
        'If you study diligently every day, you will easily pass the grade 10 exam.',
        'If it does not rain tomorrow morning, we will go cycling along the canal.'
      ],
      commonMistakes: 'Dùng "will" ngay trong mệnh đề "If" (ví dụ: If it will rain... là sai; phải là: If it rains...).'
    },
    {
      id: 'a3-r2',
      title: 'Conditional Type 2',
      subtitle: '(Câu điều kiện loại 2 - Trái ngược thực tế ở hiện tại)',
      use: 'Diễn tả một giả định không có thật, trái ngược với thực tế ở hiện tại hoặc đưa ra lời khuyên (If I were you...).',
      form: 'If + S + V2/ed, S + would/could/might + V(nguyên mẫu)\n* Với To Be: dùng "were" cho tất cả các chủ ngữ: If + S + were...',
      signalWords: 'If I were you..., tình huống thực tế cho ở hiện tại phủ định/khẳng định.',
      examples: [
        'If I were you, I would consult the teacher before making this decision.',
        'If my father had a car, he would drive us to the beach this weekend.'
      ],
      commonMistakes: 'Quên lùi thì trong mệnh đề If (chia hiện tại thay vì quá khứ) hoặc dùng "will/can" thay vì "would/could" ở mệnh đề chính.'
    },
    {
      id: 'a3-r3',
      title: 'Structure with UNLESS',
      subtitle: '(Cấu trúc tương đương Unless = If... not)',
      use: 'Dùng "Unless" (trừ phi, nếu không thì) thay thế cho "If... not" để rút gọn câu điều kiện.',
      form: 'Unless + S + V(khẳng định), S + V...\n<=> If + S + do/does/did + not + V(nguyên mẫu), S + V...',
      signalWords: 'Unless = If not',
      examples: [
        'Unless you hurry up immediately, you will miss the morning school bus.',
        'Unless he practices speaking English daily, he cannot improve his pronunciation.'
      ],
      commonMistakes: 'Dùng dạng phủ định sau "Unless" (viết nhầm: Unless you don\'t hurry... là SAI, vì Unless đã mang nghĩa phủ định).'
    }
  ],

  // A4: Câu gián tiếp (Reported Speech)
  'anh-a4-cau-tuong-thuat': [
    {
      id: 'a4-r1',
      title: 'Reported Statements',
      subtitle: '(Câu trần thuật gián tiếp)',
      use: 'Thuật lại lời nói, nhận định hay thông tin của một người khác theo nguyên tắc: lùi một thì của động từ, biến đổi đại từ nhân xưng, và chuyển đổi trạng từ chỉ thời gian/nơi chốn.',
      form: 'S + said + (that) + S + V(lùi thì) + (O)\nS + told + O + (that) + S + V(lùi thì) + (O)\n• V1 -> V2/ed\n• am/is/are -> was/were\n• have/has -> had\n• will -> would, can -> could, must -> had to',
      signalWords: 'said that, told sb that; now -> then, today -> that day, yesterday -> the day before, tomorrow -> the following day/the next day, here -> there, this -> that.',
      examples: [
        'He said to me, "I am doing my homework now." -> He told me that he was doing his homework then.',
        'She said, "I will visit my hometown tomorrow." -> She said that she would visit her hometown the following day.'
      ],
      commonMistakes: 'Dùng "said me" thay vì "said to me" hoặc "told me", và quên lùi thì hoặc quên đổi các trạng từ chỉ thời gian (giữ nguyên now, tomorrow...).'
    },
    {
      id: 'a4-r2',
      title: 'Reported Questions (Yes/No & Wh-Questions)',
      subtitle: '(Câu hỏi gián tiếp)',
      use: 'Thuật lại một câu hỏi của người khác. Trong câu gián tiếp, câu hỏi biến thành câu khẳng định (không đảo trợ động từ lên trước chủ ngữ, bỏ dấu chấm hỏi).',
      form: '• Yes/No Question:\n  S + asked + (O) + if / whether + S + V(lùi thì)\n• Wh-Question:\n  S + asked + (O) + wh-word + S + V(lùi thì)',
      signalWords: 'asked, wondered, wanted to know + if/whether/wh-words (what, where, when, why, who, how)...',
      examples: [
        'She asked me, "Do you like pop music?" -> She asked me if I liked pop music.',
        '"Where do you live?" the policeman asked the boy. -> The policeman asked the boy where he lived.'
      ],
      commonMistakes: 'Vẫn đảo trợ động từ lên trước chủ ngữ (ví dụ viết nhầm: She asked me where did I live -> SAI; phải viết: She asked me where I lived).'
    },
    {
      id: 'a4-r3',
      title: 'Reported Imperatives & Requests',
      subtitle: '(Câu mệnh lệnh & lời yêu cầu gián tiếp)',
      use: 'Dùng để thuật lại mệnh lệnh, yêu cầu, lời đề nghị hoặc lời khuyên của ai đó.',
      form: '• Khẳng định: S + told / asked / ordered + O + to + V(nguyên mẫu)\n• Phủ định: S + told / asked / warned + O + not to + V(nguyên mẫu)',
      signalWords: '"Please...", "Don\'t...", "Remember to..." -> asked sb to V / told sb not to V.',
      examples: [
        '"Please close the windows before leaving," the teacher said. -> The teacher asked us to close the windows before leaving.',
        'The doctor said to him, "Don\'t smoke anymore." -> The doctor told him not to smoke anymore.'
      ],
      commonMistakes: 'Đặt "not" sau "to" (viết nhầm: to not smoke -> SAI; phải viết: not to smoke).'
    }
  ],

  // A5: Mệnh đề quan hệ (Relative Clauses)
  'anh-a5-menh-de-quan-he': [
    {
      id: 'a5-r1',
      title: 'Relative Pronouns for People & Things',
      subtitle: '(Đại từ quan hệ WHO, WHOM, WHICH, THAT)',
      use: 'Nối hai câu đơn có cùng một đối tượng thành một câu phức để bổ nghĩa rõ ràng cho danh từ đứng trước.',
      form: '• Người (Chủ ngữ): Noun(người) + WHO + V + (O)\n• Người (Tân ngữ): Noun(người) + WHOM / WHO + S + V\n• Vật/Con vật: Noun(vật) + WHICH + V / (S + V)\n• Thay thế cả người và vật: Noun + THAT + Clause (trong mệnh đề xác định)',
      signalWords: 'Đứng ngay liền kề sau danh từ cần bổ nghĩa trong câu.',
      examples: [
        'The student who won the highest score in the contest is in my class.',
        'The novel which I borrowed from the library yesterday is very exciting.'
      ],
      commonMistakes: 'Dùng "that" sau dấu phẩy (mệnh đề không xác định) hoặc sau giới từ (in that, with that là SAI; phải dùng in which, with whom).'
    },
    {
      id: 'a5-r2',
      title: 'Possessive Relative Pronoun WHOSE',
      subtitle: '(Đại từ quan hệ chỉ sự sở hữu WHOSE)',
      use: 'Dùng để chỉ sự sở hữu cho cả người và vật, thay thế cho tính từ sở hữu (his, her, their, its) hoặc sở hữu cách (\'s).',
      form: 'Noun(chủ sở hữu) + WHOSE + Noun(vật sở hữu) + V / (S + V)...',
      signalWords: 'thay thế cho his, her, their, its, our, your hoặc danh từ có \'s.',
      examples: [
        'That is the famous writer whose new book has sold millions of copies.',
        'I know the boy whose bicycle was broken in the school yard yesterday.'
      ],
      commonMistakes: 'Thêm mạo từ "the/a" ngay sau "whose" (viết nhầm: whose the book -> SAI; phải là whose book) hoặc nhầm lẫn "whose" với "who\'s" (who is / who has).'
    },
    {
      id: 'a5-r3',
      title: 'Defining vs Non-defining Relative Clauses',
      subtitle: '(Mệnh đề xác định & Không xác định)',
      use: 'Phân biệt mệnh đề cần thiết để định nghĩa danh từ (không có dấu phẩy, dùng được That) và mệnh đề bổ sung thêm thông tin phụ (bắt buộc có dấu phẩy, không dùng That, dùng khi danh từ là tên riêng hoặc có this/that/my).',
      form: 'Tên riêng / Danh từ xác định, + WHO / WHICH / WHOSE + ..., + V chính...',
      signalWords: 'Dấu phẩy (,), tên riêng (Ha Noi, Mary), tính từ chỉ định (this, that, these, those), tính từ sở hữu (my, his...).',
      examples: [
        'Mr. Brown, who lives next door to my house, is a very kind teacher.',
        'Ha Noi, which is the capital of Vietnam, is famous for its delicious street food.'
      ],
      commonMistakes: 'Bỏ quên dấu phẩy khi danh từ đứng trước là tên riêng hoặc danh từ đã xác định, hoặc vẫn dùng đại từ "that" sau dấu phẩy.'
    }
  ],

  // A6: Cấu tạo từ & Word Form
  'anh-a6-tu-loai-word-form': [
    {
      id: 'a6-r1',
      title: 'Positions of Nouns & Adjectives',
      subtitle: '(Quy tắc vị trí Danh từ & Tính từ)',
      use: 'Nhận diện loại từ cần điền vào chỗ trống dựa vào cấu trúc ngữ pháp đứng trước và sau nó.',
      form: '• Danh từ (Noun):\n  a/an/the + Noun\n  Tính từ sở hữu (my/his/her/our/their) + Noun\n  Giới từ (in/on/at/with/for) + Noun\n  Adj + Noun\n• Tính từ (Adjective):\n  S + To be / Linking verb (look, seem, feel, become) + Adj\n  Adj + Noun (đứng trước danh từ)\n  make / keep / find + O + Adj',
      signalWords: 'Mạo từ, tính từ sở hữu, động từ nối (seem, look, feel), đuôi danh từ (-tion, -ment, -ness, -er/or), đuôi tính từ (-ful, -less, -able, -ous, -ive).',
      examples: [
        'Solar energy is an inexhaustible source of clean electricity.',
        'The continuous development of technology has improved our daily life significantly.'
      ],
      commonMistakes: 'Xác định đúng loại từ (ví dụ tính từ) nhưng quên thêm tiền tố phủ định (un-, in-, im-, dis-) khi ngữ cảnh câu mang nghĩa tiêu cực.'
    },
    {
      id: 'a6-r2',
      title: 'Positions of Adverbs & Verbs',
      subtitle: '(Quy tắc vị trí Trạng từ & Động từ)',
      use: 'Xác định trạng từ bổ nghĩa cho động từ/tính từ hoặc động từ chính chia theo ngữ cảnh câu.',
      form: '• Trạng từ (Adverb):\n  S + V(thường) + Adv (bổ nghĩa cho động từ)\n  S + Adv + V(thường)\n  Adv, S + V (đứng đầu câu, ngăn cách bằng dấu phẩy)\n  S + be + Adv + Adj (bổ nghĩa cho tính từ: extremely hot)\n  Công thức đuôi: Adj + ly = Adv (careful -> carefully)',
      signalWords: 'Dấu phẩy ở đầu câu, động từ thường, đuôi "-ly" quen thuộc.',
      examples: [
        'He drives very carefully because the mountain road is extremely slippery.',
        'Fortunately, all the passengers escaped safely from the burning bus.'
      ],
      commonMistakes: 'Nhầm lẫn các trạng từ không có đuôi -ly (fast, hard, late, well) hoặc viết sai chính tả khi đổi sang trạng từ (happy -> happily, terrible -> terribly).'
    },
    {
      id: 'a6-r3',
      title: 'Common Prefixes & Suffixes',
      subtitle: '(Bảng tiền tố phủ định & Hậu tố trọng tâm đề TP.HCM)',
      use: 'Biến đổi nghĩa của từ từ khẳng định sang phủ định hoặc chuyển đổi gốc từ giữa danh từ, tính từ, động từ.',
      form: '• Tiền tố phủ định: un- (unhappy), im- (impolite, impossible), in- (inexpensive), dis- (disadvantage, disagree)\n• Hậu tố danh từ: -tion (pollute -> pollution), -ment (develop -> development), -ness (kind -> kindness)\n• Hậu tố tính từ: -ful (peaceful), -less (careless), -able (enjoyable, renewable)',
      signalWords: 'un-, im-, in-, dis-, -tion, -ment, -ful, -less, -able, -ly',
      examples: [
        'Plastic bags are extremely harmful to the natural environment.',
        'It is impossible for us to complete this huge project in just two days.'
      ],
      commonMistakes: 'Viết sai tiền tố (ví dụ dùng "unpossible" thay vì "impossible", hoặc "dispolite" thay vì "impolite").'
    }
  ],

  // A7: Ngữ âm & Trọng âm (Pronunciation & Stress)
  'anh-a7-phat-am-trong-am': [
    {
      id: 'a7-r1',
      title: 'Pronunciation of -ED Endings',
      subtitle: '(Quy tắc phát âm đuôi -ed của động từ có quy tắc)',
      use: 'Phân loại cách phát âm đuôi -ed vào một trong 3 âm: /ɪd/, /t/, hoặc /d/ trong các bài trắc nghiệm phát âm đề thi.',
      form: '1. Đọc là /ɪd/: Khi động từ kết thúc bằng âm /t/ hoặc /d/ (wanted, decided, needed)\n2. Đọc là /t/: Khi kết thúc bằng âm vô thanh /p, k, f, s, ʃ, tʃ/ (chính phủ phát sách không thiếu): stopped, looked, laughed, washed, watched\n3. Đọc là /d/: Tất cả các âm hữu thanh và nguyên âm còn lại: played, cleaned, loved',
      signalWords: 'Tận cùng chữ cái: t, d -> /ɪd/; p, k, f/gh, s/ce, sh, ch -> /t/; còn lại -> /d/',
      examples: [
        'The students waited (/ɪd/) patiently until the teacher arrived (/d/).',
        'She watched (/t/) a horror film and laughed (/t/) happily with her sister.'
      ],
      commonMistakes: 'Quên các trường hợp tính từ đặc biệt có đuôi -ed phát âm là /ɪd/ như: naked, wicked, learned, sacred.'
    },
    {
      id: 'a7-r2',
      title: 'Pronunciation of -S / -ES Endings',
      subtitle: '(Quy tắc phát âm đuôi -s/es của danh từ số nhiều & động từ)',
      use: 'Phân loại cách phát âm đuôi -s/-es vào một trong 3 âm: /s/, /ɪz/, hoặc /z/.',
      form: '1. Đọc là /s/: Khi tận cùng bằng các âm vô thanh /p, t, k, f, θ/ (thời phong kiến phương tây): stops, cats, books, cliffs, months\n2. Đọc là /ɪz/: Khi tận cùng bằng các âm xuýt/gió /s, z, ʃ, tʃ, dʒ, ʒ/ (ch, sh, s, x, z, ge, ce): watches, washes, boxes, buses, changes\n3. Đọc là /z/: Tất cả các âm hữu thanh và nguyên âm còn lại: plays, pens, doors, rooms',
      signalWords: 'Tận cùng: p, t, k, f, th -> /s/; s, x, z, ch, sh, ge, ce -> /ɪz/; còn lại -> /z/',
      examples: [
        'He washes (/ɪz/) the dishes and feeds (/z/) his pet cats (/s/) every afternoon.',
        'My mother fixes (/ɪz/) watches (/ɪz/) and sells books (/s/) at the market.'
      ],
      commonMistakes: 'Nhầm lẫn các chữ cái tận cùng như "e" trong "houses" (/haʊzɪz/) hoặc "changes" (/tʃeɪndʒɪz/) thuộc nhóm phát âm /ɪz/.'
    },
    {
      id: 'a7-r3',
      title: 'Word Stress Rules for 2-Syllable Words',
      subtitle: '(Quy tắc trọng âm từ có 2 âm tiết)',
      use: 'Xác định vị trí nhấn trọng âm ở âm tiết thứ 1 hay âm tiết thứ 2 trong bài trắc nghiệm trọng âm.',
      form: '• Hầu hết DANH TỪ và TÍNH TỪ 2 âm tiết nhấn âm thứ 1 (O o):\n  \'table, \'summer, \'window, \'happy, \'clever, \'famous\n• Hầu hết ĐỘNG TỪ 2 âm tiết nhấn âm thứ 2 (o O):\n  re\'lax, de\'cide, re\'ceive, in\'vite, pre\'fer, for\'get',
      signalWords: 'Từ 2 âm tiết: N/Adj -> Âm 1; Verb -> Âm 2',
      examples: [
        'They de\'cide (động từ - âm 2) to buy a modern \'table (danh từ - âm 1) for their living room.',
        'The \'weather (danh từ - âm 1) was so hot that we couldn\'t en\'joy (động từ - âm 2) the picnic.'
      ],
      commonMistakes: 'Các ngoại lệ quen thuộc: Danh từ nhấn âm 2: ma\'chine, mi\'stake, ad\'vice; Động từ nhấn âm 1: \'happen, \'listen, \'answer, \'visit, \'enter.'
    }
  ],

  // A8: Kỹ năng đọc hiểu & điền từ (Reading & Cloze Test)
  'anh-a8-ky-nang-doc-hieu-dien-tu': [
    {
      id: 'a8-r1',
      title: 'Skimming & Scanning Techniques',
      subtitle: '(Kỹ năng Đọc lướt & Đọc quét định vị từ khóa)',
      use: 'Áp dụng cho bài đọc hiểu văn bản: Skimming dùng để trả lời câu hỏi ý chính (Main Idea/Best Title), Scanning dùng để tìm chi tiết số liệu, ngày tháng, tên riêng chính xác mà không cần đọc từng chữ.',
      form: '• Bước 1: Đọc câu hỏi & gạch chân Keywords (tên riêng, số liệu, thuật ngữ)\n• Bước 2: Scanning tìm đoạn văn chứa Keywords đó\n• Bước 3: Đọc kỹ 1 câu trước, 1 câu chứa keyword và 1 câu sau để đối chiếu với 4 đáp án\n• Main idea: Đọc kỹ câu đầu tiên (Topic sentence) và câu cuối cùng của từng đoạn.',
      signalWords: 'Main topic, Mainly about, Best title, According to the passage, What, When, Where, Why...',
      examples: [
        'According to the passage, what caused the severe flood in the region? -> Scan từ khóa "severe flood" trong bài để đối chiếu nguyên nhân.',
        'Which of the following is NOT true about the new invention? -> Scan lần lượt từng đáp án A, B, C, D để loại trừ 3 ý đúng.'
      ],
      commonMistakes: 'Đọc toàn bộ bài khóa từ đầu đến cuối trước khi đọc câu hỏi dẫn đến mất nhiều thời gian và quên mất vị trí chi tiết cần tìm.'
    },
    {
      id: 'a8-r2',
      title: 'Reference Question: Pronoun Reference',
      subtitle: '(Kỹ năng trả lời câu hỏi đại từ quy chiếu)',
      use: 'Xác định từ ngữ, cụm từ hoặc đối tượng mà các đại từ nhân xưng (it, they, them, this, that, which) trong bài đọc đang thay thế.',
      form: 'Đại từ quy chiếu (it, they, them, this)\nQuy tắc: Đọc lùi lại 1 câu đứng ngay trước câu chứa đại từ đó. Tìm danh từ tương thích về số ít / số nhiều và nghĩa logic.',
      signalWords: 'The word "it / they / them / this" in paragraph X refers to...',
      examples: [
        '"Engineers have developed modern solar panels. They can convert sunlight into electricity." -> "They" refers to "solar panels".',
        '"Mary visited London last month. She fell in love with this beautiful city." -> "She" refers to "Mary".'
      ],
      commonMistakes: 'Chọn danh từ số ít khi đại từ là "they/them", hoặc chọn một danh từ ở tít đoạn khác mà không đọc câu đứng liền trước.'
    },
    {
      id: 'a8-r3',
      title: 'Cloze Test Strategy (Guided Cloze)',
      subtitle: '(Chiến thuật bài điền từ vào đoạn văn)',
      use: 'Phân tích nhanh loại câu hỏi điền từ: câu hỏi ngữ pháp (chọn thì, liên từ, giới từ) hay câu hỏi từ vựng (chọn từ đồng nghĩa, collocations).',
      form: '• Nhìn trước & sau chỗ trống:\n  Giới từ đi theo cụm: interested IN, fond OF, famous FOR, depend ON\n  Liên từ nối ý: however (tuy nhiên), because (bởi vì), although (mặc dù), therefore (do đó)\n  Cấu trúc câu: so... that, such... that, too... to V',
      signalWords: 'Collocations (cụm từ cố định), liên từ chỉ quan hệ nhân quả / tương phản.',
      examples: [
        'Many teenagers are increasingly interested in learning foreign languages nowadays. (Chỗ trống sau interested cần giới từ "in").',
        'Although the weather was extremely stormy, all the fishermen returned safely to shore. (Liên từ chỉ sự tương phản đối lập).'
      ],
      commonMistakes: 'Dùng cả "Although" và "But" trong cùng một câu (tiếng Anh chỉ được dùng một trong hai liên từ: Although S+V, S+V HOẶC S+V, but S+V).'
    }
  ]
};

// Aliases for topics in topicsData.ts if opened via TopicDetailModal
ENGLISH_GRAMMAR_RULES['anh-cac-thi-tenses'] = ENGLISH_GRAMMAR_RULES['anh-a1-thi-dong-tu'];
ENGLISH_GRAMMAR_RULES['anh-cau-bi-dong-reported'] = [
  ...ENGLISH_GRAMMAR_RULES['anh-a2-cau-bi-dong'],
  ...ENGLISH_GRAMMAR_RULES['anh-a4-cau-tuong-thuat']
];
ENGLISH_GRAMMAR_RULES['anh-cau-dieu-kien'] = ENGLISH_GRAMMAR_RULES['anh-a3-cau-dieu-kien'];
ENGLISH_GRAMMAR_RULES['anh-word-form'] = ENGLISH_GRAMMAR_RULES['anh-a6-tu-loai-word-form'];

