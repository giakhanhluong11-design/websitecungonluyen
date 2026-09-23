import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { KnowledgeView } from './components/KnowledgeView';
import { PracticeView } from './components/PracticeView';
import { ExamLibraryView } from './components/ExamLibraryView';
import { AccountView } from './components/AccountView';
import { HCMBenchmarkView } from './components/HCMBenchmarkView';
import { MinigameView } from './components/minigame/MinigameView';
import { ExamRunnerModal } from './components/ExamRunnerModal';
import { ExamPreviewModal } from './components/ExamPreviewModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AuthModal } from './components/AuthModal';
import { onAuthChange, logoutAuth, AuthUser } from './services/authService';
import { ALL_TOPICS } from './data/topicsData';
import { ALL_EXAMS } from './data/examsData';
import { CheckCircle2, Info } from 'lucide-react';
import { useTheme } from './components/ThemeWaterDropRipple';
import { Exam } from './types';
import { useProgressStore } from './store/useProgressStore';
import { useAppStore } from './store/useAppStore';
import { useState } from 'react';

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  // ── Stores ──────────────────────────────────────────────────────────────
  const {
    progress,
    handleLoginEmail,
    handleSyncCloud,
    handleLogout,
    handleLoginGoogle,
    handleToggleTopicComplete,
    handleSavePractice,
    handleSaveExam,
    handleToggleBookmark,
    handleUpdateProfile,
    handleResetProgress,
    handleUpdateTargetSchool,
  } = useProgressStore();

  const {
    currentTab,
    activeSubject,
    selectedPracticeSubject,
    selectedPracticeTopicId,
    selectedKnowledgeTopic,
    showGoogleLoginModal,
    showAuthModal,
    authModalMode,
    showGeminiConfigModal,
    toast,
    setCurrentTab,
    setActiveSubject,
    handleNavigate,
    handleReviewTopic,
    openAuthModal,
    closeAuthModal,
    openGoogleLoginModal,
    closeGoogleLoginModal,
    openGeminiConfig,
    closeGeminiConfig,
    showToast,
    clearToast,
  } = useAppStore();

  // Exam modals are local since they're transient UI state
  const [activeExamToRun, setActiveExamToRun] = useState<Exam | null>(null);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);

  // ── Firebase auth listener ───────────────────────────────────────────────
  useEffect(() => {
    const remember = typeof window !== 'undefined' && localStorage.getItem('cung_on_luyen_remember_login') === 'true';
    if (!remember) {
      // Khi vào web, mặc định tài khoản là Khách trừ khi người dùng đã nhấn Lưu đăng nhập
      return;
    }
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        handleLoginEmail(user.email, user.name, undefined, true);
        await handleSyncCloud(user.id);
      }
    });
    return () => unsubscribe();
  }, []);

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleLoginSuccess = async (user: AuthUser, _token: string, rememberLogin?: boolean) => {
    handleLoginEmail(
      user.email,
      user.name,
      {
        birthYear: user.birthYear,
        currentSchool: user.currentSchool,
        currentClass: user.currentClass,
      },
      rememberLogin
    );
    showToast(
      `Đăng nhập thành công! Chào mừng ${user.name || user.email}${rememberLogin ? ' (Đã lưu đăng nhập)' : ''}.`,
      'success'
    );
    await handleSyncCloud(user.id);
    setTimeout(clearToast, 4500);
  };

  const handleLogoutAuth = async () => {
    await logoutAuth();
    handleLogout();
    showToast(
      'Đã đăng xuất tài khoản. Dữ liệu đã chuyển về trạng thái khách. Đăng nhập lại bất kỳ lúc nào để khôi phục.',
      'info'
    );
    setTimeout(clearToast, 4500);
  };

  const handleLoginGoogleAndToast = (email: string, displayName?: string, rememberLogin?: boolean) => {
    handleLoginGoogle(email, displayName, rememberLogin);
    showToast(
      `Đã đăng nhập Google (${email})${rememberLogin ? ' và lưu đăng nhập trên thiết bị' : ''}!`,
      'success'
    );
    setTimeout(clearToast, 4500);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200`}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl shadow-md border ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
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
        onOpenGoogleLogin={openGoogleLoginModal}
        onLogoutGoogle={handleLogoutAuth}
        onOpenAuthModal={openAuthModal}
        onLogoutAuth={handleLogoutAuth}
        onOpenGeminiConfig={openGeminiConfig}
      />

      {/* Main content */}
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
              useAppStore.setState({ selectedKnowledgeTopic: topic, currentTab: 'knowledge' });
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
              useAppStore.setState({
                selectedPracticeSubject: subj as any,
                selectedPracticeTopicId: topId,
                currentTab: 'practice',
              });
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
            onOpenGeminiConfig={openGeminiConfig}
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
          <HCMBenchmarkView
            targetSchool={progress.profile.targetSchool}
            targetScore={progress.profile.targetScore}
            onUpdateTargetSchool={handleUpdateTargetSchool}
          />
        )}

        {currentTab === 'minigame' && (
          <MinigameView
            topics={ALL_TOPICS}
            onNavigateToPractice={(subj, topicId) => {
              useAppStore.setState({
                selectedPracticeSubject: subj,
                selectedPracticeTopicId: topicId,
                currentTab: 'practice',
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'account' && (
          <AccountView
            progress={progress}
            exams={ALL_EXAMS}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onUpdateProfile={handleUpdateProfile}
            onResetProgress={handleResetProgress}
            onLinkGoogle={handleLoginGoogleAndToast}
            onUnlinkGoogle={handleLogoutAuth}
            onLoginGoogle={handleLoginGoogleAndToast}
            onLogoutGoogle={handleLogoutAuth}
            onOpenAuthModal={openAuthModal}
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
            {['knowledge', 'practice', 'exams', 'minigame', 'benchmarks', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {tab === 'knowledge' ? 'Hệ thống kiến thức'
                  : tab === 'practice' ? 'Luyện tập chuyên đề'
                  : tab === 'exams' ? 'Kho đề thi TP.HCM'
                  : tab === 'minigame' ? 'Minigame'
                  : tab === 'benchmarks' ? 'Điểm chuẩn các năm'
                  : 'Mục tiêu nguyện vọng'}
              </button>
            ))}
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

      {/* Exam Modals */}
      {activeExamToRun && (
        <ExamRunnerModal
          exam={activeExamToRun}
          onClose={() => setActiveExamToRun(null)}
          onSaveExamAttempt={handleSaveExam}
          onReviewTopic={handleReviewTopic}
        />
      )}
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

      {/* Auth Modals */}
      <GoogleAuthModal
        isOpen={showGoogleLoginModal}
        onClose={closeGoogleLoginModal}
        onLogin={handleLoginGoogleAndToast}
        currentProfile={progress.profile}
      />
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={closeAuthModal}
        onSuccess={handleLoginSuccess}
      />

    </div>
  );
}
