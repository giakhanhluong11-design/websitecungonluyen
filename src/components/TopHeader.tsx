import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  X,
  ExternalLink,
  BookOpen,
  FileText,
  CheckCircle2,
  Calendar,
  Flame,
  Target
} from 'lucide-react';
import { UserProgress, Topic, Exam } from '../types';
import { ALL_TOPICS } from '../data/topicsData';
import { ALL_EXAMS } from '../data/examsData';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  progress: UserProgress;
  onOpenAccount: () => void;
  onOpenGeminiConfig?: () => void;
  onNavigate?: (tab: string, subjectFilter?: string, topicId?: string) => void;
  onSelectTopic?: (topic: Topic) => void;
  onStartExam?: (exam: Exam) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  progress,
  onOpenAccount,
  onOpenGeminiConfig,
  onNavigate,
  onSelectTopic,
  onStartExam,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search in ALL_TOPICS and ALL_EXAMS
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { topics: [], exams: [] };

    const matchedTopics = ALL_TOPICS.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedExams = ALL_EXAMS.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.province.toLowerCase().includes(q) ||
      (e.schoolOrDept && e.schoolOrDept.toLowerCase().includes(q))
    ).slice(0, 4);

    return { topics: matchedTopics, exams: matchedExams };
  }, [searchQuery]);

  const hasResults = searchResults.topics.length > 0 || searchResults.exams.length > 0;

  // Real notifications based strictly on user's real state
  const realNotifications = useMemo(() => {
    const list: Array<{ id: string; title: string; desc: string; time: string; icon: any; actionTab?: string }> = [];

    // Streak notification
    if (progress.streakDays > 0) {
      list.push({
        id: 'notif-streak',
        title: `Chuỗi học ${progress.streakDays} ngày liên tiếp!`,
        desc: 'Tuyệt vời! Bạn đang duy trì phong độ ôn luyện rất đều đặn.',
        time: 'Hôm nay',
        icon: Flame,
        actionTab: 'practice'
      });
    }

    // Target school notification
    if (progress.profile.targetSchool) {
      list.push({
        id: 'notif-target',
        title: `Mục tiêu NV1: ${progress.profile.targetSchool}`,
        desc: `Mục tiêu điểm chuẩn: ${progress.profile.targetScore || 21} điểm. Hãy kiểm tra các chuyên đề cần ôn tập.`,
        time: 'Gần đây',
        icon: Target,
        actionTab: 'benchmarks'
      });
    }

    // Topics completed
    const completedCount = progress.completedTopicIds.length;
    if (completedCount > 0) {
      list.push({
        id: 'notif-topics',
        title: `Đã hoàn thành ${completedCount} chuyên đề`,
        desc: 'Tiếp tục luyện tập thêm các dạng bài mới để củng cố kiến thức.',
        time: 'Hôm nay',
        icon: CheckCircle2,
        actionTab: 'knowledge'
      });
    } else {
      list.push({
        id: 'notif-start',
        title: 'Bắt đầu lộ trình ôn thi Tuyển sinh 10',
        desc: 'Khám phá các chuyên đề trọng tâm Toán, Ngữ văn và Tiếng Anh.',
        time: 'Hôm nay',
        icon: BookOpen,
        actionTab: 'knowledge'
      });
    }

    return list;
  }, [progress]);

  const handleSelectTopicResult = (topic: Topic) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (onSelectTopic) {
      onSelectTopic(topic);
    } else if (onNavigate) {
      onNavigate('knowledge', topic.subjectId, topic.id);
    }
  };

  const handleSelectExamResult = (exam: Exam) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (onStartExam) {
      onStartExam(exam);
    } else if (onNavigate) {
      onNavigate('exams');
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left side: Hamburger Toggle + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Hamburger Menu Toggle (Visible on Mobile/Tablet) */}
          <button
            onClick={onToggleSidebar}
            title="Mở thanh điều hướng"
            aria-label="Mở thanh điều hướng"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95 lg:hidden"
          >
            <Menu className="h-5 w-5 stroke-[2.2]" />
          </button>

          {/* Search Bar with live search dropdown */}
          <div ref={searchContainerRef} className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchResults(true);
              }}
              placeholder="Tìm kiếm chuyên đề, đề thi, tác phẩm..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-xl z-50 animate-in fade-in duration-150 max-h-96 overflow-y-auto">
                {!hasResults ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Không tìm thấy bài học hay đề thi phù hợp với "{searchQuery}"
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* Topics Match */}
                    {searchResults.topics.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                          Chuyên đề bài học ({searchResults.topics.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.topics.map(t => (
                            <div
                              key={t.id}
                              onClick={() => handleSelectTopicResult(t)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {t.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {t.subjectId === 'toan' ? 'Toán học' : t.subjectId === 'van' ? 'Ngữ văn' : 'Tiếng Anh'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exams Match */}
                    {searchResults.exams.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                          Kho đề thi tuyển sinh ({searchResults.exams.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.exams.map(e => (
                            <div
                              key={e.id}
                              onClick={() => handleSelectExamResult(e)}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                            >
                              <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {e.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {e.province} • {e.year} • {e.durationMinutes} phút
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: AI Config + Notifications + Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak Flame Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-orange-200/90 dark:border-orange-800/60 bg-gradient-to-r from-orange-50/90 to-amber-50/90 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-700 dark:text-orange-300 text-xs font-black shadow-2xs select-none"
            title={`Chuỗi học tập liên tục: ${progress.streakDays || 0} ngày. Đọc lý thuyết & làm bài tập chuyên đề để duy trì!`}
          >
            <Flame className={`w-4 h-4 ${progress.streakDays > 0 ? 'text-orange-500 fill-orange-500 animate-flame-pulse-glow drop-shadow-xs' : 'text-slate-400'}`} />
            <span>{progress.streakDays || 0}</span>
            <span className="hidden sm:inline font-semibold text-[11px] text-orange-600/90 dark:text-orange-400/90">ngày</span>
          </div>

          {/* Gemini AI Config button */}
          {onOpenGeminiConfig && (
            <button
              onClick={onOpenGeminiConfig}
              title="Cấu hình Trợ lý AI Gemini"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Trợ lý AI</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Thông báo học tập thực tế"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell className="h-4 w-4" />
              {realNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
                  {realNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Thông báo học tập</span>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {realNotifications.length} cập nhật
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
                    {realNotifications.map((n) => {
                      const IconComponent = n.icon;
                      return (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setShowNotifications(false);
                            if (n.actionTab && onNavigate) {
                              onNavigate(n.actionTab);
                            }
                          }}
                          className="py-2.5 space-y-1 hover:bg-slate-50 dark:hover:bg-slate-700/40 p-2 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <IconComponent className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>{n.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">{n.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Student Profile Quick Button */}
          <button
            onClick={onOpenAccount}
            title={`Hồ sơ: ${progress.profile.name || 'Học sinh'}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {progress.profile.avatar ? (
              <span className="text-xl leading-none">{progress.profile.avatar}</span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
