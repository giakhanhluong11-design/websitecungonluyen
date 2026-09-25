import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

type ReactComponentClass = new (props: ErrorBoundaryProps) => React.Component<ErrorBoundaryProps, ErrorBoundaryState> & {
  componentDidCatch(error: Error, info: React.ErrorInfo): void;
};

// We use React.Component via declaration to avoid useDefineForClassFields TS issues
const ReactComponentBase = React.Component as unknown as ReactComponentClass;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class _ErrorBoundary extends (React.Component as any) {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    (this as any).state = { hasError: false, error: null } as ErrorBoundaryState;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const self = this as any;
    if (self.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {self.props.fallbackTitle || 'Đã xảy ra sự cố hiển thị'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hệ thống ghi nhận sự cố khi tải nội dung phần này. Bạn có thể thử tải lại hoặc quay về trang chủ.
              </p>
              {self.state.error && (
                <p className="mt-2 text-[11px] font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900 break-all text-left">
                  {(self.state.error as Error).message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  self.setState({ hasError: false, error: null });
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tải lại trang
              </button>
              <button
                type="button"
                onClick={() => {
                  self.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }
    return self.props.children;
  }
}

export const ErrorBoundary = _ErrorBoundary as unknown as React.ComponentClass<ErrorBoundaryProps>;
