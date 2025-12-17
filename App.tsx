import React, { useState, useMemo } from 'react';
import { 
  ScanLine, 
  Search,
  LayoutGrid,
  Filter,
  RefreshCw,
  Bell,
  UserCircle,
  ChevronLeft,
  Home,
  Layers
} from 'lucide-react';
import { MOCK_TASKS } from './constants';
import { InspectionStatus, FilterState, Task, InspectionModule } from './types';
import { TaskCard } from './components/TaskCard';
import { StatsDashboard } from './components/StatsDashboard';
import { InspectionDetail } from './components/InspectionDetail';
import { NavigationHome } from './components/NavigationHome';
import { StationCollection } from './components/StationCollection';
import { LoginView } from './components/LoginView';
import { analyzeInspectionTasks } from './services/geminiService';
import { CarrierLogo } from './components/CarrierLogo';

type ViewState = 'LOGIN' | 'HOME' | 'STATION_COLLECTION' | 'FQC_LIST';

const BRAND_BLUE = '#0A2EF5';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [activeModule, setActiveModule] = useState<InspectionModule>('FQC'); // Track which module is active
  const [tasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<FilterState>({
    status: 'ALL',
    search: '',
    line: 'ALL'
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.id.toLowerCase().includes(filter.search.toLowerCase()) || 
        task.productName.includes(filter.search) || 
        task.workOrder.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesStatus = filter.status === 'ALL' || task.status === filter.status;
      const matchesLine = filter.line === 'ALL' || task.line === filter.line;

      return matchesSearch && matchesStatus && matchesLine;
    });
  }, [tasks, filter]);

  // Unique Lines for Filter
  const uniqueLines = useMemo(() => {
    return Array.from(new Set(tasks.map(t => t.line))).sort();
  }, [tasks]);

  // Tab Counts
  const pendingCount = tasks.filter(t => t.status === InspectionStatus.PENDING).length;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleNavigate = (view: ViewState, module?: InspectionModule) => {
    if (module) {
        setActiveModule(module);
    }
    setCurrentView(view);
  };

  const getModuleTitle = () => {
      switch (activeModule) {
          case 'PROCESS': return '过程专检';
          case 'COMPLETION': return '完工检验';
          case 'FQC': return '成品检验';
          default: return '检验任务';
      }
  };

  // --- ROUTER LOGIC ---

  // 0. Login View
  if (currentView === 'LOGIN') {
      return <LoginView onLogin={() => setCurrentView('HOME')} />;
  }

  // 1. Navigation Home
  if (currentView === 'HOME') {
      return (
        <NavigationHome 
            onNavigate={handleNavigate} 
            onLogout={() => setCurrentView('LOGIN')}
        />
      );
  }

  // 2. Station Collection View
  if (currentView === 'STATION_COLLECTION') {
      return (
          <StationCollection 
            onBack={() => setCurrentView('HOME')} 
            onHome={() => setCurrentView('HOME')}
          />
      );
  }

  // 3. FQC Detail View (Nested in List)
  if (selectedTask) {
      return <InspectionDetail task={selectedTask} moduleTitle={getModuleTitle()} onBack={() => setSelectedTask(null)} />;
  }

  // 4. FQC List View (Redesigned Layout)
  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800">
      
      {/* 1. LEFT SIDEBAR (22%) - Matches StationCollection Style */}
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
           <div className="flex items-center gap-3 w-full">
              <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: BRAND_BLUE }}>YLC-MES</span>
              <div className="flex-1"></div>
              <CarrierLogo className="h-7 w-auto" />
           </div>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar flex flex-col gap-6">
           
           {/* Real-time Overview (Stats) */}
           <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                 <h2 className="text-sm font-bold text-slate-600">实时概览</h2>
              </div>
              <StatsDashboard tasks={filteredTasks.length === tasks.length ? tasks : filteredTasks} />
           </div>

           {/* Line Filters */}
           <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                  <h2 className="text-sm font-bold text-slate-600 flex items-center gap-2">
                     线体筛选
                  </h2>
              </div>
              
              <div className="space-y-2 bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                 <button
                    onClick={() => setFilter(prev => ({...prev, line: 'ALL'}))}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${filter.line === 'ALL' ? 'bg-slate-100 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                    全部线体
                 </button>
                 {uniqueLines.map(line => (
                    <button
                        key={line}
                        onClick={() => setFilter(prev => ({...prev, line: line}))}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex justify-between items-center font-medium ${filter.line === line ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Layers size={14} className="opacity-50" />
                            <span>线体 {line}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${filter.line === line ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                           {tasks.filter(t => t.line === line && (filter.status === 'ALL' || t.status === filter.status)).length}
                        </span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm text-white font-bold" style={{ backgroundColor: BRAND_BLUE }}>
                <UserCircle size={24} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
        
        {/* Header Toolbar (Matches StationCollection Header) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
                 <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                    <ChevronLeft size={26} strokeWidth={2.5} />
                </button>
                <span className="text-slate-800 font-bold text-2xl tracking-wide">{getModuleTitle()}</span>
            </div>

            <div className="flex items-center gap-2">
                 <button onClick={() => setCurrentView('HOME')} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                     <Home size={24} />
                 </button>
            </div>
        </header>

        {/* Filters & Actions Toolbar */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
             {/* Left: Tab Switcher (Pill Style) */}
             <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <button 
                   onClick={() => setFilter(prev => ({...prev, status: InspectionStatus.PENDING}))}
                   className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${filter.status === InspectionStatus.PENDING ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                   待检任务 ({pendingCount})
                </button>
                <div className="w-px bg-slate-200 my-1"></div>
                <button 
                   onClick={() => setFilter(prev => ({...prev, status: 'ALL'}))}
                   className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${filter.status === 'ALL' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                   全部任务
                </button>
             </div>

             {/* Right: Search & Actions */}
             <div className="flex items-center gap-3">
                <div className="relative w-96">
                   <input 
                      type="text" 
                      placeholder="输入单号 / 产品名称 / SN..."
                      value={filter.search}
                      onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  
                   />
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                
                <button className="h-10 w-10 flex items-center justify-center rounded-lg text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95" style={{ backgroundColor: BRAND_BLUE }}>
                   <ScanLine size={20} />
                </button>
             </div>
        </div>

        {/* Task Grid Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filteredTasks.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredTasks.map(task => (
                     <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={() => handleTaskClick(task)}
                        showProcess={activeModule === 'PROCESS'}
                     />
                  ))}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                     <Search size={40} className="text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-600">未找到符合条件的任务</p>
                  <p className="text-sm mt-1">请尝试调整搜索关键词或筛选条件</p>
               </div>
            )}
        </div>
      </main>
      
    </div>
  );
};

export default App;