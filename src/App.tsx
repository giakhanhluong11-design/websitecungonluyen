import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { KnowledgeView } from './components/KnowledgeView';
import { PracticeView } from './components/PracticeView';
import { ExamLibraryView } from './components/ExamLibraryView';
import { AccountView } from './components/AccountView';
import { BenchmarkView } from './components/BenchmarkView';
import { MinigameView } from './components/minigame/MinigameView';
import { ExamRunnerModal } from './components/ExamRunnerModal';
import { ExamPreviewModal } from './components/ExamPreviewModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AuthModal, AuthModalMode } from './components/AuthModal';
import { GeminiApiKeyModal } from './components/GeminiApiKeyModal';
import { onAuthChange, logoutAuth, AuthUser } from './services/authService';

import { 
  ALL_TOPICS 
} from './data/topicsData';
import { 
  ALL_EXAMS 
} from './data/examsData';
import { 
  getUserProgress, 
  syncWithCloud,
  toggleTopicCompleted, 
  savePracticeAttempt, 
  saveExamAttempt, 
  toggleBookmarkExam, 
  saveUserProfile, 
  resetUserProgress,
  linkGoogleAccount,
  unlinkGoogleAccount,
  loginGoogleAccount,
  logoutGoogleAccount,
  loginEmailAccount,
  logoutAuthAccount
} from './data/userStorage';
import { SubjectId, Exam, Topic, UserProgress, UserProfile, PracticeAttempt, ExamAttempt } from './types';
import { Heart, Sparkles, BookOpen, CheckCircle2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { useTheme } from './components/ThemeWaterDropRipple';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeSubject, setActiveSubject] = useState<SubjectId>('toan');
  const [selectedPracticeSubject, setSelectedPracticeSubject] = useState<SubjectId>('toan');
  const [selectedPracticeTopicId, setSelectedPracticeTopicId] = useState<string>('');
  const [selectedKnowledgeTopic, setSelectedKnowledgeTopic] = useState<Topic | null>(null);

  // Active modals
  const [activeExamToRun, setActiveExamToRun] = useState<Exam | null>(null);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [showGeminiConfigModal, setShowGeminiConfigModal] = useState<boolean>(false);

  // Toast / sync feedback
  const [authToast, setAuthToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // Progress state
  const [progress, setProgress] = useState<UserProgress>(getUserProgress);

  // Listen to Firebase Auth state change and sync cloud data
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const updated = loginEmailAccount(user.email, user.name);
        setProgress(updated);
        try {
          const synced = await syncWithCloud(user.id);
          setProgress(synced);
        } catch (e) {
          console.warn('Sync cloud error on auth change:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Dark mode from ThemeWaterDropRipple provider with water drop ripple effect
  const { darkMode, toggleDarkMode } = useTheme();

  // Handlers
  const handleToggleTopicComplete = (topicId: string) => {
    const updated = toggleTopicCompleted(topicId);
    setProgress(updated);
  };

  const handleSavePractice = (attempt: PracticeAttempt) => {
    const updated = savePracticeAttempt(attempt);
    setProgress(updated);
  };

  const handleSaveExam = (attempt: ExamAttempt) => {
    const updated = saveExamAttempt(attempt);
    setProgress(updated);
  };

  const handleToggleBookmark = (examId: string) => {
    const updated = toggleBookmarkExam(examId);
    setProgress(updated);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    const updated = saveUserProfile(newProfile);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    const fresh = resetUserProgress();
    setProgress(fresh);
  };

  const handleOpenAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = async (user: AuthUser, _token: string) => {
    const updated = loginEmailAccount(user.email, user.name);
    setProgress(updated);
    setAuthToast({
      message: `Đăng nhập thành công! Chào mừng ${user.name || user.email} đã quay trở lại. Dữ liệu đang được đồng bộ với đám mây Firebase...`,
      type: 'success'
    });
    try {
      const synced = await syncWithCloud(user.id);
      setProgress(synced);
    } catch {}
    setTimeout(() => setAuthToast(null), 4500);
  };

  const handleLogoutAuth = async () => {
    await logoutAuth();
    const blank = logoutAuthAccount();
    setProgress(blank);
    setAuthToast({
      message: 'Đã đăng xuất tài khoản. Dữ liệu đã chuyển về trạng thái trắng (0). Đăng nhập lại bất kỳ lúc nào để khôi phục.',
      type: 'info'
    });
    setTimeout(() => setAuthToast(null), 4500);
  };

  const handleLoginGoogle = (email: string, displayName?: string) => {
    const updated = loginGoogleAccount(email, displayName);
    setProgress(updated);
    setAuthToast({
      message: `Đã đăng nhập Google (${email}) và đồng bộ lại đầy đủ toàn bộ tiến trình học tập!`,
      type: 'success'
    });
    setTimeout(() => setAuthToast(null), 4500);
  };

  const handleLogoutGoogle = () => {
    handleLogoutAuth();
  };

  const handleLinkGoogle = handleLoginGoogle;
  const handleUnlinkGoogle = handleLogoutGoogle;

  const handleNavigate = (tab: string, subjectFilter?: string, topicId?: string) => {
    setCurrentTab(tab);
    if (subjectFilter) {
      setActiveSubject(subjectFilter as SubjectId);
      setSelectedPracticeSubject(subjectFilter as SubjectId);
    }
    if (topicId) {
      setSelectedPracticeTopicId(topicId);
      const matched = ALL_TOPICS.find(t => t.id === topicId);
      if (matched) setSelectedKnowledgeTopic(matched);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewTopic = (topicId: string) => {
    const topic = ALL_TOPICS.find(t => t.id === topicId);
    if (topic) {
      setActiveSubject(topic.subjectId);
      setSelectedKnowledgeTopic(topic);
      setCurrentTab('knowledge');
    } else {
      setCurrentTab('knowledge');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* Dynamic Auth / Sync Notification Toast */}
      {authToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-start gap-3 p-4 rounded-xl shadow-md border ${
            authToast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
          }`}>
            {authToast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {authToast.message}
            </div>
            <button
              onClick={() => setAuthToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        progress={progress}
        onOpenAccount={() => handleNavigate('account')}
        onOpenGoogleLogin={() => setShowGoogleLoginModal(true)}
        onLogoutGoogle={handleLogoutGoogle}
        onOpenAuthModal={handleOpenAuthModal}
        onLogoutAuth={handleLogoutAuth}
        onOpenGeminiConfig={() => setShowGeminiConfigModal(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {currentTab === 'home' && (
          <HomeView
            progress={progress}
            exams={ALL_EXAMS}
            topics={ALL_TOPICS}
            onNavigate={handleNavigate}
            onStartExam={(exam) => setActiveExamToRun(exam)}
            onPreviewExam={(exam) => setPreviewExam(exam)}
            onSelectTopic={(topic) => {
              setActiveSubject(topic.subjectId);
              setSelectedKnowledgeTopic(topic);
              setCurrentTab('knowledge');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleBookmark={handleToggleBookmark}
            onReviewTopic={handleReviewTopic}
            onClearHistory={handleResetProgress}
          />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeView
            topics={ALL_TOPICS}
            progress={progress}
            activeSubject={activeSubject}
            setActiveSubject={setActiveSubject}
            onToggleTopicComplete={handleToggleTopicComplete}
            onStartPractice={(subj, topId) => {
              setSelectedPracticeSubject(subj as SubjectId);
              setSelectedPracticeTopicId(topId);
              setCurrentTab('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialSelectedTopic={selectedKnowledgeTopic}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeView
            topics={ALL_TOPICS}
            initialSubject={selectedPracticeSubject}
            initialTopicId={selectedPracticeTopicId}
            onSavePracticeResult={handleSavePractice}
            onReviewTopic={handleReviewTopic}
            onOpenGeminiConfig={() => setShowGeminiConfigModal(true)}
          />
        )}

        {currentTab === 'exams' && (
          <ExamLibraryView
            exams={ALL_EXAMS}
            progress={progress}
            onStartExam={(exam) => setActiveExamToRun(exam)}
            onPreviewExam={(exam) => setPreviewExam(exam)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentTab === 'benchmarks' && (
          <BenchmarkView
            targetSchool={progress.profile.targetSchool}
            targetScore={progress.profile.targetScore}
            onUpdateTargetSchool={(schoolName, score) => {
              const updated = saveUserProfile({
                ...progress.profile,
                targetSchool: schoolName,
                targetScore: score
              });
              setProgress(updated);
            }}
          />
        )}

        {currentTab === 'minigame' && (
          <MinigameView
            topics={ALL_TOPICS}
            onNavigateToPractice={(subj, topicId) => {
              setSelectedPracticeSubject(subj);
              setSelectedPracticeTopicId(topicId);
              setCurrentTab('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'account' && (
          <AccountView
            progress={progress}
            onToggleDarkMode={toggleDarkMode}
            onUpdateProfile={handleUpdateProfile}
            onResetProgress={handleResetProgress}
            onLinkGoogle={handleLoginGoogle}
            onUnlinkGoogle={handleLogoutGoogle}
            onLoginGoogle={handleLoginGoogle}
            onLogoutGoogle={handleLogoutGoogle}
            onOpenAuthModal={handleOpenAuthModal}
            onLogoutAuth={handleLogoutAuth}
            onStartExam={(exam) => setActiveExamToRun(exam)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              Cùng Ôn Luyện<span className="font-black text-indigo-800 dark:text-indigo-300">.AI</span>
            </span>
            <span>– Đồng hành cùng học sinh chinh phục kỳ thi Tuyển sinh 10</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('knowledge')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Hệ thống kiến thức
            </button>
            <button onClick={() => setCurrentTab('practice')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Luyện tập chuyên đề
            </button>
            <button onClick={() => setCurrentTab('exams')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Kho đề thi TP.HCM
            </button>
            <button onClick={() => setCurrentTab('minigame')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Minigame
            </button>
            <button onClick={() => setCurrentTab('benchmarks')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Điểm chuẩn các năm
            </button>
            <button onClick={() => setCurrentTab('account')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Mục tiêu nguyện vọng
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Exam Simulation Modal */}
      {activeExamToRun && (
        <ExamRunnerModal
          exam={activeExamToRun}
          onClose={() => setActiveExamToRun(null)}
          onSaveExamAttempt={handleSaveExam}
          onReviewTopic={handleReviewTopic}
        />
      )}

      {/* Exam Preview Modal */}
      {previewExam && (
        <ExamPreviewModal
          exam={previewExam}
          onClose={() => setPreviewExam(null)}
          onStartExam={(exam) => {
            setPreviewExam(null);
            setActiveExamToRun(exam);
          }}
        />
      )}

      {/* Google Authentication & Data Sync Modal */}
      <GoogleAuthModal
        isOpen={showGoogleLoginModal}
        onClose={() => setShowGoogleLoginModal(false)}
        onLogin={handleLoginGoogle}
        currentProfile={progress.profile}
      />

      {/* Email Authentication & Registration Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
