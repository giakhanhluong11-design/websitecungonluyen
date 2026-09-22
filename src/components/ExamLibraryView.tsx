import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  Bookmark, 
  Play, 
  Eye, 
  CheckCircle2, 
  Award, 
  MapPin, 
  Calendar,
  Building2
} from 'lucide-react';
import { Exam, UserProgress, SubjectId } from '../types';
import { HCM_SCHOOLS } from '../data/examsData';

interface ExamLibraryViewProps {
  exams: Exam[];
  progress: UserProgress;
  onStartExam: (exam: Exam) => void;
  onPreviewExam: (exam: Exam) => void;
  onToggleBookmark: (examId: string) => void;
}

export const ExamLibraryView: React.FC<ExamLibraryViewProps> = ({
  exams,
  progress,
  onStartExam,
  onPreviewExam,
  onToggleBookmark
}) => {
  // Main tab filter
  const [activeTab, setActiveTab] = useState<'all' | 'done' | 'saved' | 'latest' | 'hcm'>('all');
  
  // Specific criteria filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      // Main tab filter
      if (activeTab === 'saved' && !progress.bookmarkedExamIds.includes(exam.id)) {
        return false;
      }
      if (activeTab === 'done') {
        const hasDone = progress.examAttempts.some(a => a.examId === exam.id);
        if (!hasDone) return false;
      }
      if (activeTab === 'latest' && exam.year < 2024) {
        return false;
      }
      if (activeTab === 'hcm' && !exam.province.includes('TP.HCM')) {
        return false;
      }

      // Dropdown filters
      if (subjectFilter !== 'all' && exam.subjectId !== subjectFilter) {
        return false;
      }
      if (yearFilter !== 'all' && exam.year.toString() !== yearFilter) {
        return false;
      }
      if (schoolFilter !== 'all' && exam.schoolId !== schoolFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && exam.difficulty !== difficultyFilter) {
        return false;
      }

      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          exam.title.toLowerCase().includes(q) ||
          exam.description.toLowerCase().includes(q) ||
          exam.province.toLowerCase().includes(q) ||
          (exam.schoolName && exam.schoolName.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [exams, activeTab, subjectFilter, yearFilter, schoolFilter, difficultyFilter, searchQuery, progress]);

  // Unique years
  const availableYears = useMemo(() => {
    const setYears = new Set<number>();
    exams.forEach(e => setYears.add(e.year));
    return Array.from(setYears).sort((a, b) => b - a);
  }, [exams]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Thư Viện Đề Thi Tuyển Sinh Lớp 10
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tổng hợp đề thi chính thức Sở GD&ĐT TP.HCM và các trường THPT trọng điểm qua các năm có đáp án chi tiết
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'all', label: 'Tất cả đề thi', count: exams.length },
          { id: 'hcm', label: 'Đề thi TP.HCM', count: exams.filter(e => e.province.includes('TP.HCM')).length },
          { id: 'latest', label: 'Mới nhất (2024-2025)', count: exams.filter(e => e.year >= 2024).length },
          { id: 'done', label: 'Đề đã làm', count: progress.examAttempts.length },
          { id: 'saved', label: 'Đề đã lưu', count: progress.bookmarkedExamIds.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Multi-Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="exam-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm đề theo tên trường, môn học, năm thi..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Filter Môn */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Môn thi
            </label>
            <select
              id="filter-exam-subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả môn</option>
              <option value="toan">Toán học</option>
              <option value="van">Ngữ văn</option>
              <option value="anh">Tiếng Anh</option>
            </select>
          </div>

          {/* Filter Năm */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Năm thi
            </label>
            <select
              id="filter-exam-year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả năm</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr.toString()}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Filter Trường TP.HCM */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Trường / Đơn vị ra đề
            </label>
            <select
              id="filter-exam-school"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả đơn vị</option>
              {HCM_SCHOOLS.map(sc => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>

          {/* Filter Mức độ */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Mức độ thử thách
            </label>
            <select
              id="filter-exam-difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="chuan-thi-that">Chuẩn thi thật</option>
              <option value="nang-cao">Nâng cao / Chuyên</option>
              <option value="co-ban">Cơ bản luyện tay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Không tìm thấy đề thi phù hợp với các tiêu chí tìm kiếm.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setSubjectFilter('all');
              setYearFilter('all');
              setSchoolFilter('all');
              setDifficultyFilter('all');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const isBookmarked = progress.bookmarkedExamIds.includes(exam.id);
            const userAttempt = progress.examAttempts.find(a => a.examId === exam.id);

            return (
              <div
                key={exam.id}
                id={`exam-card-${exam.id}`}
                className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        exam.subjectId === 'toan'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : exam.subjectId === 'van'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {exam.subjectId === 'toan' ? 'Toán' : exam.subjectId === 'van' ? 'Ngữ văn' : 'Tiếng Anh'}
                      </span>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Năm {exam.year}
                      </span>

                      {exam.province.includes('TP.HCM') && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900">
                          TP.HCM
                        </span>
                      )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      id={`bookmark-exam-${exam.id}`}
                      onClick={() => onToggleBookmark(exam.id)}
                      title={isBookmarked ? 'Bỏ lưu đề' : 'Lưu đề'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-rose-600 dark:fill-rose-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 
                    onClick={() => onPreviewExam(exam)}
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors leading-snug"
                  >
                    {exam.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>

                  {/* School info if available */}
                  {exam.schoolName && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{exam.schoolName}</span>
                    </div>
                  )}

                  {/* History badge if previously done */}
                  {userAttempt && (
                    <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Đã làm ({userAttempt.date})
                      </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                        {userAttempt.score} / 10đ
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Meta & Action buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {exam.durationMinutes} phút
                    </span>
                    <span>•</span>
                    <span>{exam.questionsCount} câu hỏi</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      {exam.takesCount.toLocaleString()} lượt làm
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`preview-exam-btn-${exam.id}`}
                      onClick={() => onPreviewExam(exam)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Xem đề
                    </button>

                    <button
                      id={`start-exam-btn-${exam.id}`}
                      onClick={() => onStartExam(exam)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      Làm đề
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
