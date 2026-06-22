import React, { ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, Trash2 } from "lucide-react";

interface Props {
  children?: ReactNode;
  errorMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetDataAndReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-ui" className="flex flex-col items-center justify-center p-8 my-6 bg-slate-50 border border-slate-200 rounded-3xl max-w-xl mx-auto shadow-sm text-center">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-5 animate-pulse">
            <AlertOctagon size={32} />
          </div>
          
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
            Waduh, Terjadi Masalah!
          </h2>
          
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {this.props.errorMessage || 
              "Aplikasi mengalami kendala teknis internal yang tidak terduga. Jangan khawatir, Anda dapat memulihkannya dengan tombol di bawah."}
          </p>

          {this.state.error && (
            <div className="w-full text-left bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6 font-mono text-xs text-slate-600 overflow-x-auto max-h-32">
              <strong>Detail Error:</strong> {this.state.error.toString()}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              id="btn-reload-page"
              type="button"
              onClick={this.handleReload}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
            >
              <RotateCcw size={16} />
              Muat Ulang Halaman
            </button>
            <button
              id="btn-reset-data-reload"
              type="button"
              onClick={this.handleResetDataAndReload}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition active:scale-95"
            >
              <Trash2 size={16} />
              Reset Data Lokal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

