
import React, { useState, useMemo } from 'react';
import { 
  ScanLine, 
  Search,
  ChevronLeft,
  Home,
  Layers
} from 'lucide-react';
import { MOCK_TASKS } from './constants';
import { InspectionStatus, FilterState, Task, InspectionModule } from './types';
import { TaskCard } from './components/TaskCard';
import { StatsDashboard } from './components/StatsDashboard';
import { InspectionDetail } from './components/InspectionDetail';
import { DeviceMaintenanceDetail } from './components/DeviceMaintenanceDetail';
import { NavigationHome } from './components/NavigationHome';
import { StationCollection } from './components/StationCollection';
import { LoginView } from './components/LoginView';
import { MaterialPicking } from './components/MaterialPicking';
import { WarehouseMaterialCall } from './components/WarehouseMaterialCall';
import { CarrierLogo } from './components/CarrierLogo';

type ViewState = 'LOGIN' | 'HOME' | 'STATION_COLLECTION' | 'FQC_LIST' | 'PICKING' | 'WAREHOUSE_CALL';

const BRAND_BLUE = '#0A2EF5';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [activeModule, setActiveModule] = useState<InspectionModule>('FQC');
  const [tasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState<FilterState>({
    status: 'ALL',
    search: '',
    line: 'ALL'
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const isIncoming = activeModule === 'INCOMING';
      const taskIsIncoming = !!task.asnNo;
      
      if (isIncoming !== taskIsIncoming) return false;

      const matchesSearch = 
        task.id.toLowerCase().includes(filter.search.toLowerCase()) || 
        task.productName.includes(filter.search) || 
        (task.workOrder && task.workOrder.toLowerCase().includes(filter.search.toLowerCase())) ||
        (task.asnNo && task.asnNo.toLowerCase().includes(filter.search.toLowerCase())) ||
        (task.supplierName && task.supplierName.includes(filter.search)) ||
        (task.deviceCode && task.deviceCode.toLowerCase().includes(filter.search.toLowerCase()));
      
      const matchesStatus = filter.status === 'ALL' || task.status === filter.status;
      
      // Line filter logic
      let matchesLine = true;
      if (activeModule === 'INCOMING') {
          matchesLine = true;
      } else if (activeModule === 'DEVICE_MAINTENANCE') {
          matchesLine = filter.line === 'ALL' || task.department === filter.line;
      } else {
          matchesLine = filter.line === 'ALL' || task.line === filter.line;
      }

      return matchesSearch && matchesStatus && matchesLine;
    });
  }, [tasks, filter, activeModule]);

  const uniqueLines = useMemo(() => {
    if (activeModule === 'DEVICE_MAINTENANCE') {
        return Array.from(new Set(tasks.filter(t => t.department).map(t => t.department as string))).sort();
    }
    return Array.from(new Set(tasks.filter(t => !t.asnNo && t.line).map(t => t.line as string))).sort();
  }, [tasks, activeModule]);

  const pendingCount = filteredTasks.filter(t => t.status === InspectionStatus.PENDING).length;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleNavigate = (view: ViewState, module?: InspectionModule) => {
    if (module) {
        setActiveModule(module);
        setFilter(prev => ({ ...prev, line: 'ALL', status: 'ALL', search: '' }));
    }
    setCurrentView(view);
  };

  const getModuleTitle = () => {
      switch (activeModule) {
          case 'PROCESS': return '过程专检';
          case 'COMPLETION': return '完工检验';
          case 'FQC': return '成品检验';
          case 'INCOMING': return '来料检验';
          case 'PICKING': return '物料拣配';
          case 'DEVICE_MAINTENANCE': return '设备保养';
          case 'WAREHOUSE_CALL': return '仓储叫料';
          default: return '检验任务';
      }
  };

  if (currentView === 'LOGIN') {
      return <LoginView onLogin={() => setCurrentView('HOME')} />;
  }

  if (currentView === 'HOME') {
      return (
        <NavigationHome 
            onNavigate={handleNavigate} 
            onLogout={() => setCurrentView('LOGIN')}
        />
      );
  }

  if (currentView === 'STATION_COLLECTION') {
      return (
          <StationCollection 
            onBack={() => setCurrentView('HOME')} 
            onHome={() => setCurrentView('HOME')}
          />
      );
  }

  if (currentView === 'PICKING') {
      return (
          <MaterialPicking 
            onBack={() => setCurrentView('HOME')}
          />
      );
  }

  if (currentView === 'WAREHOUSE_CALL') {
      return (
          <WarehouseMaterialCall 
            onBack={() => setCurrentView('HOME')}
          />
      );
  }

  if (selectedTask) {
      if (activeModule === 'DEVICE_MAINTENANCE') {
          return <DeviceMaintenanceDetail task={selectedTask} onBack={() => setSelectedTask(null)} />;
      }
      return <InspectionDetail task={selectedTask} activeModule={activeModule} moduleTitle={getModuleTitle()} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800">
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
        <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
           <div className="flex items-center gap-3 w-full">
              <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: BRAND_BLUE }}>YLC-MES</span>
              <div className="flex-1"></div>
              <CarrierLogo className="h-7 w-auto" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 no-scrollbar flex flex-col gap-6">
           <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                 <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                 <h2 className="text-sm font-bold text-slate-600">任务统计</h2>
              </div>
              <StatsDashboard tasks={filteredTasks} />
           </div>
           {activeModule !== 'INCOMING' && (
           <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                  <h2 className="text-sm font-bold text-slate-600">{activeModule === 'DEVICE_MAINTENANCE' ? '责任部门' : '线体筛选'}</h2>
              </div>
              <div className="space-y-2 bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                 <button onClick={() => setFilter(prev => ({...prev, line: 'ALL'}))} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${filter.line === 'ALL' ? 'bg-slate-100 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{activeModule === 'DEVICE_MAINTENANCE' ? '全部部门' : '全部线体'}</button>
                 {uniqueLines.map(line => (
                    <button key={line} onClick={() => setFilter(prev => ({...prev, line: line}))} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex justify-between items-center font-medium ${filter.line === line ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2"><Layers size={14} className="opacity-50" /><span>{activeModule === 'DEVICE_MAINTENANCE' ? '' : '线体'} {line}</span></div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${filter.line === line ? 'bg-white text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                            {tasks.filter(t => {
                                if (activeModule === 'DEVICE_MAINTENANCE') {
                                    return t.department === line && (filter.status === 'ALL' || t.status === filter.status);
                                }
                                return t.line === line && (filter.status === 'ALL' || t.status === filter.status);
                            }).length}
                        </span>
                    </button>
                 ))}
              </div>
           </div>
           )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
                 <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
                <span className="text-slate-800 font-bold text-2xl tracking-wide">{getModuleTitle()}</span>
            </div>
            <button onClick={() => setCurrentView('HOME')} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={24} /></button>
        </header>
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
             <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <button onClick={() => setFilter(prev => ({...prev, status: InspectionStatus.PENDING}))} className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${filter.status === InspectionStatus.PENDING ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>待检任务 ({pendingCount})</button>
                <div className="w-px bg-slate-200 my-1"></div>
                <button onClick={() => setFilter(prev => ({...prev, status: 'ALL'}))} className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${filter.status === 'ALL' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>全部任务</button>
             </div>
             <div className="flex items-center gap-3">
                <div className="relative w-96">
                   <input type="text" placeholder={activeModule === 'INCOMING' ? "输入ASN编号 / 供应商 / 物料..." : activeModule === 'DEVICE_MAINTENANCE' ? "输入保养单号 / 设备编码 / 设备名称..." : "输入单号 / 产品名称 / SN..."} value={filter.search} onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))} className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-lg text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95" style={{ backgroundColor: BRAND_BLUE }}><ScanLine size={20} /></button>
             </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filteredTasks.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {filteredTasks.map(task => (<TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} showProcess={activeModule === 'PROCESS'} />))}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100"><Search size={40} className="text-slate-300" /></div>
                  <p className="text-lg font-bold text-slate-600">未找到符合条件的任务</p>
               </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
