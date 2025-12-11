import React, { useState, useMemo } from 'react';
import { 
  ScanLine, 
  Sparkles, 
  Search,
  LayoutGrid,
  Filter,
  RefreshCw,
  Bell,
  UserCircle
} from 'lucide-react';
import { MOCK_TASKS, WORKSHOPS } from './constants';
import { InspectionStatus, FilterState, Task } from './types';
import { TaskCard } from './components/TaskCard';
import { StatsDashboard } from './components/StatsDashboard';
import { InspectionDetail } from './components/InspectionDetail';
import { NavigationHome } from './components/NavigationHome';
import { StationCollection } from './components/StationCollection';
import { analyzeInspectionTasks } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

type ViewState = 'HOME' | 'STATION_COLLECTION' | 'FQC_LIST';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [tasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<FilterState>({
    status: 'ALL',
    search: '',
    workshop: 'ALL'
  });
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.id.toLowerCase().includes(filter.search.toLowerCase()) || 
        task.productName.includes(filter.search) || 
        task.workOrder.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesStatus = filter.status === 'ALL' || task.status === filter.status;
      const matchesWorkshop = filter.workshop === 'ALL' || task.workshop === filter.workshop;

      return matchesSearch && matchesStatus && matchesWorkshop;
    });
  }, [tasks, filter]);

  // Tab Counts
  const pendingCount = tasks.filter(t => t.status === InspectionStatus.PENDING).length;

  const handleAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    setAiInsight(null);
    const insight = await analyzeInspectionTasks(filteredTasks);
    setAiInsight(insight);
    setIsAiAnalyzing(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // --- ROUTER LOGIC ---

  // 1. Navigation Home
  if (currentView === 'HOME') {
      return <NavigationHome onNavigate={(view) => setCurrentView(view)} />;
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
      return <InspectionDetail task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  // 4. FQC List View (Existing App Logic)
  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR - Fixed Width */}
      <aside className="w-80 flex-shrink-0 bg-white shadow-xl z-20 flex flex-col h-full border-r border-slate-200">
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white flex-shrink-0 cursor-pointer" onClick={() => setCurrentView('HOME')}>
          <div className="flex items-center gap-3 text-primary-900 w-full">
             <span className="font-bold text-xl tracking-tight whitespace-nowrap">Phoenix MES</span>
             <div className="flex-1"></div>
             <img 
               src="http://127.0.0.1:32768/00.43.45/images/fqc___pad/u646.png" 
               alt="Carrier Logo" 
               className="h-8 object-contain"
             />
          </div>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-6">
           
           {/* Stats Section */}
           <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">实时概览</h2>
              <StatsDashboard tasks={filteredTasks.length === tasks.length ? tasks : filteredTasks} />
           </div>

          

           {/* Workshop Filters */}
           <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                 <Filter size={12} /> 车间筛选
              </h2>
              <div className="space-y-1">
                 <button
                    onClick={() => setFilter(prev => ({...prev, workshop: 'ALL'}))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter.workshop === 'ALL' ? 'bg-slate-100 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                    全部车间
                 </button>
                 {WORKSHOPS.map(ws => (
                    <button
                        key={ws}
                        onClick={() => setFilter(prev => ({...prev, workshop: ws}))}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${filter.workshop === ws ? 'bg-primary-50 text-primary-700 font-semibold border border-primary-100' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        {ws}
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-400 shadow-sm border border-slate-100">
                           {tasks.filter(t => t.workshop === ws && (filter.status === 'ALL' || t.status === filter.status)).length}
                        </span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                <UserCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100/50 relative">
        
        {/* Header Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm flex-shrink-0 z-10">
           
           {/* Left: Tab Switcher */}
           <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                 onClick={() => setFilter(prev => ({...prev, status: InspectionStatus.PENDING}))}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter.status === InspectionStatus.PENDING ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 待检任务 ({pendingCount})
              </button>
              <button 
                 onClick={() => setFilter(prev => ({...prev, status: 'ALL'}))}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter.status === 'ALL' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 全部任务
              </button>
           </div>

           {/* Right: Search & Actions */}
           <div className="flex items-center gap-4">
              <div className="relative w-80">
                 <input 
                    type="text" 
                    placeholder="输入单号 / 产品名称 / SN..."
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                
                 />
                  
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                
              </div>
               <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-sm">
                <ScanLine size={20} />
             </div>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                 <RefreshCw size={20} />
              </button>
           </div>
        </header>

        {/* Task Grid Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <LayoutGrid size={20} className="text-slate-400" />
                  {filter.status === 'ALL' ? '全部任务列表' : '待处理任务'}
               </h2>
               <span className="text-sm text-slate-500">共 {filteredTasks.length} 条记录</span>
            </div>

            {filteredTasks.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredTasks.map(task => (
                     <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={() => handleTaskClick(task)}
                     />
                  ))}
               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                     <Search size={32} className="opacity-40" />
                  </div>
                  <p className="text-lg font-medium">未找到符合条件的任务</p>
                  <p className="text-sm mt-1">请尝试调整搜索关键词或筛选条件</p>
               </div>
            )}
        </div>
      </main>
      
    </div>
  );
};

export default App;