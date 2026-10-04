import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar,
  Building2,
  Clock,
  Loader2
} from 'lucide-react';
import { UserProgress, ExamDocument } from '../types';
import { getExamDocuments, incrementDownloadCount, downloadExamDocument } from '../services/examDocumentService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ExamLibraryViewProps {
  progress: UserProgress;
  onToggleBookmark: (examId: string) => void;
}

export const ExamLibraryView: React.FC<ExamLibraryViewProps> = ({
  progress,
  onToggleBookmark
}) => {
  const [documents, setDocuments] = useState<ExamDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      const docs = await getExamDocuments();
      setDocuments(docs);
      setLoading(false);
    };
    fetchDocs();
  }, []);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.province.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = subjectFilter === 'all' || doc.subjectId === subjectFilter;
      return matchSearch && matchSubject;
    });
  }, [documents, searchQuery, subjectFilter]);

  const handleDownload = async (doc: ExamDocument) => {
    try {
      await downloadExamDocument(doc);
      await incrementDownloadCount(doc.id);
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, downloadsCount: (d.downloadsCount || 0) + 1 } : d));
    } catch (err) {
      console.error('Lỗi tải tài liệu:', err);
      alert('Không thể tải tài liệu này. Vui lòng thử lại sau.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Thư Viện Đề Thi (Tài Liệu PDF)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tải xuống các đề thi chính thức, đề thi thử từ các trường THPT trọng điểm.
        </p>
      </div>

      {/* Multi-Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu, tên trường, tỉnh thành..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Filter Môn */}
          <div className="w-full sm:w-48">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tất cả môn</option>
              <option value="toan">Toán học</option>
              <option value="van">Ngữ văn</option>
              <option value="anh">Tiếng Anh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Không tìm thấy tài liệu nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 uppercase tracking-wider">
                      {doc.subjectId === 'toan' ? 'Toán' : doc.subjectId === 'van' ? 'Ngữ Văn' : 'Tiếng Anh'}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Năm {doc.year}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {doc.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{doc.province}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{formatFileSize(doc.fileSize)} • {doc.fileName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Đăng tải {formatDistanceToNow(doc.uploadedAt, { addSuffix: true, locale: vi })}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {doc.downloadsCount} lượt tải
                </span>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
