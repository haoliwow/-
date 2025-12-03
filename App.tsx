
import React, { useState, useEffect } from 'react';
import { AppTab, InsightMetrics } from './types';
import Dashboard from './components/Dashboard';
import InsightUploader from './components/InsightUploader';
import VideoAnalyzer from './components/VideoAnalyzer';
import VideoList from './components/VideoList';
import { exportToCSV, exportToPDF } from './services/exportService';
import { 
  LayoutDashboard, 
  Upload, 
  Video, 
  Download, 
  FileText,
  Menu,
  X,
  Cpu,
  ListVideo
} from 'lucide-react';

// Initial Mock Data (with IDs)
const MOCK_DATA: InsightMetrics[] = [
  { id: '1', date: '2023-10-01', videoTitle: 'Cyberpunk City Vlog', views: 1200, reach: 900, likes: 120, shares: 15, saves: 40, comments: 5, retentionRate: 45, avgWatchTime: '5s', source: 'Manual' },
  { id: '2', date: '2023-10-04', videoTitle: 'Neon Light Setup', views: 3500, reach: 2800, likes: 400, shares: 80, saves: 120, comments: 22, retentionRate: 60, avgWatchTime: '8s', source: 'Manual' },
  { id: '3', date: '2023-10-10', videoTitle: 'AI Tech Tips #3', views: 8000, reach: 7200, likes: 900, shares: 450, saves: 600, comments: 50, retentionRate: 75, avgWatchTime: '15s', source: 'Manual' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [insights, setInsights] = useState<InsightMetrics[]>(MOCK_DATA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load from local storage on mount with ID migration
  useEffect(() => {
    const saved = localStorage.getItem('creator_insights');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Ensure all items have an ID
        const migratedData = parsed.map((item: any) => ({
          ...item,
          id: item.id || Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
        }));
        setInsights(migratedData);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('creator_insights', JSON.stringify(insights));
  }, [insights]);

  const handleDataAdded = (newData: InsightMetrics) => {
    setInsights(prev => [...prev, newData]);
    setActiveTab(AppTab.VIDEO_LIST); 
  };

  const handleDeleteInsight = (id: string) => {
    setInsights(prev => prev.filter(item => item.id !== id));
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: AppTab; label: string; icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-cyan-500/10 text-cyan-400 font-semibold border-r-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === tab ? 'animate-pulse' : ''}`} />
      <span className="tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050b14] to-black text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#0f172a]/90 backdrop-blur-md z-50 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <Cpu className="w-6 h-6 text-fuchsia-500" />
           <span className="font-bold text-white font-tech tracking-wider">ReelMind</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6 text-slate-400" /> : <Menu className="w-6 h-6 text-slate-400" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0f172a]/60 backdrop-blur-xl border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800/50 hidden lg:flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-fuchsia-600 rounded-lg blur opacity-75"></div>
              <div className="relative bg-black p-2 rounded-lg">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-tech tracking-wider">
              ReelMind
            </span>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-16 lg:mt-0 overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-2 mt-4 font-tech">ANALYTICS</div>
            <NavItem tab={AppTab.DASHBOARD} label="儀表板" icon={LayoutDashboard} />
            <NavItem tab={AppTab.VIDEO_LIST} label="數據管理" icon={ListVideo} />
            <NavItem tab={AppTab.UPLOAD_INSIGHTS} label="上傳洞察" icon={Upload} />
            
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mb-2 mt-8 font-tech">AI ENGINE</div>
            <NavItem tab={AppTab.VIDEO_ANALYSIS} label="爆款分析" icon={Video} />
          </nav>

          <div className="p-4 border-t border-slate-800/50 bg-[#0f172a]/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 font-tech">EXPORTS</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => exportToCSV(insights)}
                className="flex items-center justify-center p-2 bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-md text-slate-400 transition-all text-xs font-medium group"
              >
                <Download className="w-3 h-3 mr-1 group-hover:animate-bounce" /> CSV
              </button>
              <button 
                onClick={() => exportToPDF(insights)}
                className="flex items-center justify-center p-2 bg-slate-800/50 border border-slate-700 hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:bg-fuchsia-950/30 rounded-md text-slate-400 transition-all text-xs font-medium group"
              >
                <FileText className="w-3 h-3 mr-1 group-hover:animate-bounce" /> PDF
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 relative">
        {/* Ambient Glows */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-8">
          <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end border-b border-slate-800/50 pb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-tech tracking-tight">
                {activeTab === AppTab.DASHBOARD && <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DASHBOARD_</span>}
                {activeTab === AppTab.VIDEO_LIST && <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DATA_GRID_</span>}
                {activeTab === AppTab.UPLOAD_INSIGHTS && <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500">UPLOAD_DATA_</span>}
                {activeTab === AppTab.VIDEO_ANALYSIS && <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">AI_ANALYZER_</span>}
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                {activeTab === AppTab.DASHBOARD && "即時監控帳號各項核心指標與趨勢。"}
                {activeTab === AppTab.VIDEO_LIST && "管理您的影片數據資料庫。"}
                {activeTab === AppTab.UPLOAD_INSIGHTS && "將影像轉換為結構化數據。"}
                {activeTab === AppTab.VIDEO_ANALYSIS && "深度學習模型分析影片病毒傳播潛力。"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/50 text-xs text-slate-500 font-mono">
                SYS.STATUS: <span className="text-emerald-500">ONLINE</span>
              </div>
            </div>
          </header>

          <div className="transition-all duration-300 ease-in-out">
            {activeTab === AppTab.DASHBOARD && <Dashboard data={insights} />}
            {activeTab === AppTab.VIDEO_LIST && <VideoList data={insights} onDelete={handleDeleteInsight} />}
            {activeTab === AppTab.UPLOAD_INSIGHTS && <InsightUploader onDataAdded={handleDataAdded} />}
            {activeTab === AppTab.VIDEO_ANALYSIS && <VideoAnalyzer />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
