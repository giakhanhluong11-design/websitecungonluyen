import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  BookOpen, 
  Languages, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Play, 
  Award, 
  AlertTriangle, 
  ChevronRight, 
  Info,
  Search,
  Filter,
  Check,
  User,
  PenTool
} from 'lucide-react';
import { SubjectId, Topic, UserProgress } from '../types';
import { COURSE_MODULES_DATA, CourseModule } from '../data/curriculumData';
import { CourseLessonModal } from './CourseLessonModal';
import { Lesson1MathModal } from './Lesson1MathModal';
import { TopicCardIllustration } from './TopicCardIllustration';

interface KnowledgeViewProps {
  topics: Topic[];
  progress: UserProgress;
  activeSubject: SubjectId;
  setActiveSubject: (subject: SubjectId) => void;
  onToggleTopicComplete: (topicId: string) => void;
  onStartPractice: (subjectId: string, topicId: string) => void;
  initialSelectedTopic?: Topic | null;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  progress,
  activeSubject,
  setActiveSubject,
  onToggleTopicComplete,
  onStartPractice
}) => {
  // Modal states
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [isLesson1Open, setIsLesson1Open] = useState<boolean>(false);

  // Search & Filters within the Course Map
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'rat-quan-trong' | 'core'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Filter modules for current subject in Course Map
  const subjectModules = useMemo(() => {
    return COURSE_MODULES_DATA.filter(m => m.subjectId === activeSubject);
  }, [activeSubject]);

  // Filtered modules based on user search & tags
  const filteredModules = useMemo(() => {
    return subjectModules.filter(m => {
      // Priority / Core filter
      if (filterPriority === 'rat-quan-trong' && m.examPriority !== 'rat-quan-trong') return false;
      if (filterPriority === 'core' && !m.isTop20PercentCore) return false;

      // Status filter
      const isDone = progress.completedTopicIds.includes(m.id) || progress.completedTopicIds.includes(`toan-${m.code.toLowerCase()}`);
      if (filterStatus === 'completed' && !isDone) return false;
      if (filterStatus === 'pending' && isDone) return false;

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.code.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.chapter.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.subtopics.some(st => st.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [subjectModules, filterPriority, filterStatus, searchQuery, progress.completedTopicIds]);

  // Statistics
  const completedCount = subjectModules.filter(m => 
    progress.completedTopicIds.includes(m.id) || progress.completedTopicIds.includes(`toan-${m.code.toLowerCase()}`)
  ).length;
  const progressPercent = Math.round((completedCount / Math.max(subjectModules.length, 1)) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header: Chỉ giữ Bản đồ khóa học ôn thi vào 10, loại bỏ thanh 4 nút công cụ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>Chương trình GDPT 2018 • Bộ sách Kết nối tri thức</span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Mỗi bài học gồm: Lý thuyết trọng tâm • Công thức & Ghi nhớ • Bài tập tự luyện
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Bản Đồ Khóa Học Ôn Thi Tuyển Sinh Vào Lớp 10
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium">Tiến độ hoàn thành</div>
            <div className="text-sm font-black text-slate-900 dark:text-white">
              {completedCount}/{subjectModules.length} bài ({progressPercent}%)
            </div>
          </div>
          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subject Switcher (Toán - Văn - Anh) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
            Chọn môn:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              id="tab-subject-toan"
              onClick={() => setActiveSubject('toan')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubject === 'toan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Toán học (T1 – T10)</span>
            </button>

            <button
              id="tab-subject-van"
              onClick={() => setActiveSubject('van')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubject === 'van'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Ngữ văn (V1 – V6)</span>
            </button>

            <button
              id="tab-subject-anh"
              onClick={() => setActiveSubject('anh')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubject === 'anh'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>Tiếng Anh (A1 – A8)</span>
            </button>
          </div>
        </div>

        {/* Quick Launch Button: Mở Bài 1 theo đúng sư phạm 12 bước */}
        {activeSubject === 'toan' && (
          <button
            onClick={() => setIsLesson1Open(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Mô hình 12 bước: Bài 1 (T1)</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên bài, công thức, dạng bài..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Lọc:
          </span>

          <button
            onClick={() => setFilterPriority(filterPriority === 'rat-quan-trong' ? 'all' : 'rat-quan-trong')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterPriority === 'rat-quan-trong'
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            🔴 Trọng tâm thi
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Cần học
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'completed' ? 'all' : 'completed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Đã học xong
          </button>
        </div>
      </div>

      {/* Grid of Course Lessons: Gọn gàng theo mẫu ảnh, gồm Chuyên đề + Ảnh minh hoạ + Tiến độ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const isDone = progress.completedTopicIds.includes(mod.id) || progress.completedTopicIds.includes(`toan-${mod.code.toLowerCase()}`);
          const lessonNumber = mod.code.replace(/^[A-Z]+/, '');
          const percent = isDone ? 100 : 0;

          return (
            <div
              key={mod.id}
              id={`lesson-card-${mod.id}`}
              onClick={() => setSelectedModule(mod)}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 cursor-pointer"
            >
              <div>
                {/* 1. Ảnh minh hoạ chuyên đề */}
                <div className="relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                  <TopicCardIllustration module={mod} />
                  
                  {/* Nút đánh dấu hoàn thành nhanh góc trên bên trái */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTopicComplete(mod.id);
                    }}
                    className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400 dark:text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 2. Phần nội dung chuyên đề (Theo đúng bức ảnh tham khảo) */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Icon cuốn sách viền vàng/hổ phách giống ảnh mẫu */}
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/80 dark:to-amber-900/40 border border-amber-300 dark:border-amber-700/80 flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                    </div>

                    {/* Tên chuyên đề in hoa đậm & thông tin người phụ trách / nội dung */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        BÀI {lessonNumber}: {mod.title}
                      </h3>

                      {/* Thông tin phụ: Người phụ trách & Số nội dung */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium truncate">Nguyễn Thị Huyền</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <PenTool className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium">{mod.subtopics.length} nội dung</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Thanh tiến độ học tập (Dữ liệu thật của người dùng) */}
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 space-y-1.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={percent === 100 ? "text-emerald-600 dark:text-emerald-400" : percent > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}>
                    Tiến độ: {percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent === 100
                        ? 'bg-emerald-500'
                        : percent > 0
                        ? 'bg-indigo-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hệ thống kiến thức trọng tâm cần nắm chắc */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-blue-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
        <h4 className="text-sm font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          HỆ THỐNG KIẾN THỨC TRỌNG TÂM THI VÀO 10
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60">
            <span className="font-bold text-blue-700 dark:text-blue-300">Toán 9:</span>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              • Rút gọn căn thức & bài toán phụ (T1)<br />
              • Hệ thức Viète & tương giao đồ thị (T4, T5)<br />
              • Tứ giác nội tiếp & tam giác đồng dạng (T8, T9)<br />
              • Bài toán thực tế lập hệ PT & hình không gian (T3, T10)
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60">
            <span className="font-bold text-emerald-700 dark:text-emerald-300">Ngữ văn 9:</span>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              • Công thức 5 bước phân tích biện pháp tu từ (V2)<br />
              • Dàn ý đoạn văn NLXH 200 chữ có phản biện (V3)<br />
              • Kỹ năng phân tích thơ & nhân vật truyện (V5, V6)<br />
              • Kỹ thuật trả lời câu hỏi đọc hiểu đủ ý (V1)
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60">
            <span className="font-bold text-amber-700 dark:text-amber-300">Tiếng Anh 9:</span>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              • Cấu tạo từ (Word Form) theo ngữ cảnh (A6)<br />
              • Câu bị động, câu điều kiện & Wish (A2, A3)<br />
              • Câu gián tiếp & Mệnh đề quan hệ (A4, A5)<br />
              • Quy tắc phát âm -ed, -s/es và trọng âm (A7)
            </p>
          </div>
        </div>
      </div>

      {/* Course Lesson Fullscreen Window: Mở cửa sổ mới hoàn toàn để học bài */}
      <CourseLessonModal
        module={selectedModule}
        modulesList={subjectModules}
        onSelectModule={(mod) => setSelectedModule(mod)}
        onClose={() => setSelectedModule(null)}
        isCompleted={selectedModule ? (progress.completedTopicIds.includes(selectedModule.id) || progress.completedTopicIds.includes(`toan-${selectedModule.code.toLowerCase()}`)) : false}
        onToggleComplete={(moduleId) => onToggleTopicComplete(moduleId)}
        onStartPractice={(subjectId, topicId) => {
          setSelectedModule(null);
          onStartPractice(subjectId, topicId);
        }}
      />

      {/* Lesson 1 Math Modal: Bài học chuyên sâu 12 bước cho Bài 1 Toán 9 */}
      <Lesson1MathModal
        isOpen={isLesson1Open}
        onClose={() => setIsLesson1Open(false)}
        onCompleteLesson={() => {
          onToggleTopicComplete('toan-t1-can-thuc');
          onToggleTopicComplete('toan-can-bac-hai');
        }}
      />
    </div>
  );
};
