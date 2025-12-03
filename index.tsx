
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Define an Error Boundary to catch application crashes (White/Black Screen of Death)
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-slate-200 p-8 font-sans">
          <div className="bg-slate-900/50 p-8 rounded-xl border border-red-900/50 backdrop-blur-md max-w-2xl w-full text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-red-500 mb-4 font-tech tracking-wider">SYSTEM_CRASH_DETECTED</h2>
            
            <div className="bg-black/50 p-6 rounded-lg border border-slate-800 overflow-x-auto text-left mb-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 font-bold">ERROR_LOG:</p>
              <code className="text-red-300 font-mono text-sm break-all">
                {this.state.error?.toString() || "Unknown Error"}
              </code>
            </div>

            <p className="text-slate-400 mb-8 leading-relaxed">
              應用程式啟動失敗。這通常是因為環境變數設定錯誤（例如 <code>API_KEY</code> 遺失）或是部署環境問題。
              <br/>請檢查您的 Zeabur 儀表板設定。
            </p>

            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)] font-tech tracking-wide"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
