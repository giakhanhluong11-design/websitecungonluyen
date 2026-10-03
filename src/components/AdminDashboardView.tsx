import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { 
  BarChart, Users, HeartPulse, Activity, ShieldCheck, UserX,
  Smile, Frown, Calendar, Clock, Info, FileText
} from 'lucide-react';
import { 
  subscribeToMentalHealthLogs, 
  MentalHealthLog 
} from '../services/communityService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { uploadExamDocument } from '../services/examDocumentService';

export const AdminDashboardView: React.FC = () => {
  const { progress } = useProgressStore();
  const [logs, setLogs] = useState<MentalHealthLog[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToMentalHealthLogs((data) => {
      setLogs(data);
    });
    return () => unsubscribe();
  }, []);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('toan');
  const [uploadYear, setUploadYear] = useState('2025');
  const [uploadProvince, setUploadProvince] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle || !uploadProvince) return;
    
    setIsUploading(true);
    setUploadSuccess(false);
    try {
      await uploadExamDocument(uploadFile, {
        title: uploadTitle,
        subjectId: uploadSubject,
        year: uploadYear,
        province: uploadProvince,
        uploadedBy: progress.profile.name
      });
      setUploadSuccess(true);
      setUploadFile(null);
      setUploadTitle('');
      setUploadProvince('');
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      alert('Có lỗi xảy ra khi upload.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!progress.profile.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <ShieldCheck className="w-16 h-16 mb-4 text-slate-300" />
        <h2 className="text-xl font-bold">Khu vực hạn chế</h2>
        <p>Bạn không có quyền truy cập trang Quản trị viên.</p>
      </div>
    );
  }

  const goodCount = logs.filter(l => l.feeling === 'good').length;
  const badCount = logs.filter(l => l.feeling === 'bad').length;
  const totalLogs = logs.length;
  const goodPercent = totalLogs === 0 ? 0 : Math.round((goodCount / totalLogs) * 100);

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" />
            Bảng điều khiển Admin
          </h1>
          <p className="text-indigo-100 mt-2">
            Chào mừng Quản trị viên <strong>{progress.profile.name}</strong>. Đây là trung tâm giám sát hoạt động.
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-300" />
          <div>
            <div className="text-xs text-indigo-100 uppercase tracking-wider font-semibold">Trạng thái hệ thống</div>
            <div className="font-bold">Đang hoạt động tốt</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Mental Health Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              Chỉ số sức khoẻ tâm thần (Cộng đồng)
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  <Smile className="w-5 h-5" />
                  <span className="font-semibold text-sm">Tích cực</span>
                </div>
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{goodCount}</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800/50">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                  <Frown className="w-5 h-5" />
                  <span className="font-semibold text-sm">Tiêu cực</span>
                </div>
                <div className="text-3xl font-black text-rose-700 dark:text-rose-300">{badCount}</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-600 dark:text-slate-400">Tỉ lệ tích cực chung</span>
                <span className="text-emerald-600 dark:text-emerald-400">{goodPercent}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000"
                  style={{ width: `${goodPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-indigo-500" />
              Công cụ kiểm duyệt (Moderation)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Bạn có quyền xóa bất kỳ bài đăng (Post) hoặc bình luận (Comment) nào trên trang "Chuyện chúng mình" nếu phát hiện vi phạm tiêu chuẩn cộng đồng.
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-amber-800 dark:text-amber-200 text-sm flex gap-3">
              <Info className="w-5 h-5 shrink-0" />
              <span>Nút "Xóa" màu đỏ sẽ tự động xuất hiện bên cạnh mọi bài viết và bình luận trong bảng tin khi bạn đang đăng nhập với tư cách Admin. Hãy truy cập trang Cộng đồng để kiểm duyệt.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed of Robin interactions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-0 shadow-sm flex flex-col h-full max-h-[600px]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Nhật ký cảm xúc (Real-time)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Dữ liệu theo thời gian thực từ trợ lý Robin</p>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {logs.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-10">Chưa có dữ liệu cảm xúc nào được ghi nhận.</p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className={`p-2 rounded-xl shrink-0 ${log.feeling === 'good' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {log.feeling === 'good' ? <Smile className="w-6 h-6" /> : <Frown className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">{log.userName}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: vi }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Đã trả lời Robin: <span className="font-semibold">{log.feeling === 'good' ? '"Hôm nay mọi thứ đều ổn"' : '"Hôm nay là một ngày khá tệ"'}</span>
                  </p>
                  <div className="text-xs text-slate-400 mt-1">ID: {log.userId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quản lý tài liệu đề thi */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6 text-indigo-500" />
          Tải lên Tài liệu Đề thi
        </h3>
        
        <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">File tài liệu (PDF, Word)</label>
            <input 
              type="file" 
              required
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tiêu đề tài liệu</label>
            <input 
              type="text" 
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
              placeholder="VD: Đề thi tuyển sinh lớp 10 THPT Chuyên Lê Hồng Phong"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Môn học</label>
              <select 
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="toan">Toán học</option>
                <option value="van">Ngữ văn</option>
                <option value="anh">Tiếng Anh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Năm thi</label>
              <select 
                value={uploadYear}
                onChange={(e) => setUploadYear(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tỉnh / Thành phố / Đơn vị</label>
            <input 
              type="text" 
              required
              value={uploadProvince}
              onChange={(e) => setUploadProvince(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
              placeholder="VD: TP.HCM, Hà Nội..."
            />
          </div>
          <button 
            type="submit"
            disabled={isUploading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? 'Đang tải lên...' : 'Tải tài liệu lên thư viện'}
          </button>
          {uploadSuccess && (
            <p className="text-emerald-600 font-medium text-center">Tải lên thành công!</p>
          )}
        </form>
      </div>

    </div>
  );
};
