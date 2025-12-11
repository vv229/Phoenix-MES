import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  FileText, 
  Settings, 
  Clipboard, 
  AlertTriangle,
  File,
  RefreshCw,
  LogOut,
  Menu,
  MoreHorizontal,
  Eye,
  UserCircle,
  Scan,
  Image as ImageIcon
} from 'lucide-react';
import { MOCK_TASKS, MOCK_BOM, MOCK_LOGS, MOCK_INSPECTION_DETAIL } from '../constants';
import { PreProductionCheck } from './PreProductionCheck';
import { PDFViewer } from './PDFViewer';
import { InspectionDetail } from './InspectionDetail';

interface StationCollectionProps {
  onBack: () => void;
  onHome: () => void;
}

export const StationCollection: React.FC<StationCollectionProps> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<'BOM' | 'INSPECTION' | 'LOGS'>('BOM');
  const [isPreProductionOpen, setIsPreProductionOpen] = useState(false);
  const [isEsopOpen, setIsEsopOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  
  // Use mock task for display
  const currentTask = MOCK_TASKS[0];

  const handleEsopClick = () => setIsEsopOpen(true);

  // Function to render the correct Bottom Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'BOM':
        return (
          <div className="flex-1 overflow-auto bg-white">
             <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 text-slate-600">
                   <tr>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-16">序号</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center">物料编码</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-20">数量</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-24">是否关键件</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-24">已扫数量</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-20">图号</th>
                      <th className="border border-slate-200 px-4 py-3 font-medium text-center w-24">操作</th>
                   </tr>
                </thead>
                <tbody className="text-slate-700">
                   {MOCK_BOM.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="border border-slate-200 px-4 py-2 text-center text-lg">{item.seq}</td>
                         <td className="border border-slate-200 px-4 py-2 text-lg font-medium">{item.materialCode}</td>
                         <td className="border border-slate-200 px-4 py-2 text-lg text-center">{item.qty}</td>
                         <td className="border border-slate-200 px-4 py-2 text-lg text-center">{item.isKeyPart ? '是' : '否'}</td>
                         <td className="border border-slate-200 px-4 py-2 text-lg text-center">{item.scannedQty}</td>
                         <td className="border border-slate-200 px-4 py-2 text-center">
                            {item.hasDrawing && (
                               <button 
                                 onClick={() => setIsDrawingOpen(true)}
                                 className="inline-flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50" title="查看图纸"
                               >
                                  <FileText size={20} />
                               </button>
                            )}
                         </td>
                         <td className="border border-slate-200 px-2 py-1 text-center">
                             <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded shadow-sm hover:bg-blue-700 transition-colors active:scale-95">
                                 下料
                             </button>
                         </td>
                      </tr>
                   ))}
                   {/* Empty rows to fill space */}
                   {[1,2,3].map(i => (
                       <tr key={`empty-${i}`} className="h-12 border border-slate-200">
                           <td className="border border-slate-200"></td><td className="border border-slate-200"></td><td className="border border-slate-200"></td><td className="border border-slate-200"></td><td className="border border-slate-200"></td><td className="border border-slate-200"></td><td className="border border-slate-200"></td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
        );
      case 'INSPECTION':
        return (
          <div className="flex-1 overflow-auto bg-slate-50 p-4">
             <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                {MOCK_INSPECTION_DETAIL.groups.map(group => (
                    <div key={group.id} className="border-b border-slate-100 last:border-0 p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Eye size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{group.name}</h4>
                                <span className={`text-xs ${group.status === 'PENDING' ? 'text-slate-400' : 'text-blue-600'}`}>
                                    {group.status === 'PENDING' ? '未开始' : '进行中'} • {group.items.length} 项
                                </span>
                            </div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">完成进度: {Math.round(group.progress)}/{group.items.length}</span>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'LOGS':
        return (
          <div className="flex-1 overflow-auto bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-800 border border-slate-200 m-2 rounded-lg shadow-inner">
             {MOCK_LOGS.map(log => (
                <div key={log.id} className="mb-2 pb-2 border-b border-slate-200 last:border-0">
                   <span className="text-slate-500 text-xs mr-2">{log.timestamp}</span> 
                   <span className="font-bold text-blue-700 mr-2">[{log.action}]</span> 
                   <span className={log.type === 'ERROR' ? 'text-red-600 font-medium' : 'text-slate-700'}>
                      {log.message}
                   </span>
                </div>
             ))}
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800">
      
      {/* --- Modals --- */}
      <PreProductionCheck isOpen={isPreProductionOpen} onClose={() => setIsPreProductionOpen(false)} />
      <PDFViewer 
         isOpen={isEsopOpen} 
         onClose={() => setIsEsopOpen(false)} 
         title="ESOP - AC-Cx.pdf"
         pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      />
       <PDFViewer 
         isOpen={isDrawingOpen} 
         onClose={() => setIsDrawingOpen(false)} 
         title="图纸预览 - AC-Cx.pdf"
         pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      />

      {/* --- LEFT SIDEBAR (20%) --- */}
      <aside className="w-[20%] min-w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         {/* 1. Sidebar Header (Brand) */}
         <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight text-blue-900 whitespace-nowrap">YLC-MES</span>
               <div className="flex-1"></div>
               <img 
                 src="http://127.0.0.1:32768/00.43.45/images/fqc___pad/u646.png" 
                 alt="Carrier" 
                 className="h-6 object-contain"
               />
            </div>
         </div>

         {/* 2. Sidebar Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
             
             {/* Station Selector */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 border-l-4 border-lime-500 pl-3 h-5">
                      <span className="font-bold text-slate-800 text-lg">当前工作单元</span>
                   </div>
                   <button className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium">切换</button>
                </div>
                <div className="space-y-3 px-1">
                    <div className="flex items-center text-sm">
                        <span className="w-14 text-slate-500 font-medium">产线</span>
                        <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center text-slate-700 font-medium">
                            <span>星火01</span>
                            <span className="text-[10px] text-slate-400">▼</span>
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-14 text-slate-500 font-medium">工序</span>
                        <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center text-slate-700 font-medium">
                            <span>大件装配</span>
                            <span className="text-[10px] text-slate-400">▼</span>
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-14 text-slate-500 font-medium">工位</span>
                        <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 flex justify-between items-center text-slate-700 font-medium">
                            <span>大件装配工位01</span>
                            <span className="text-[10px] text-slate-400">▼</span>
                        </div>
                    </div>
                </div>
             </div>

             {/* Scan Area (Moved to Sidebar) */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-blue-600 mr-2 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">扫码信息</div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                     <div className="relative group w-full">
                        <input 
                            type="text" 
                            placeholder="请扫码/SN/送货单..."
                            className="w-full h-10 border border-slate-300 rounded-lg pl-3 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm group-hover:border-blue-300"
                        />
                        <button className="absolute right-1 top-1 bottom-1 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors shadow-sm active:scale-95">
                            <Scan size={18} />
                        </button>
                     </div>
                     <div className="flex gap-2 w-full">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95">上料</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95">进站</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95">出站</button>
                     </div>
                 </div>
                 
                 <div className="mt-3 bg-slate-50 p-2 text-xs text-slate-500 font-medium border border-slate-200 rounded-lg flex items-start gap-2">
                     <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                     <span>暂无异常提示信息...</span>
                 </div>
             </div>

             {/* Work Order Info (Moved to Sidebar) */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-blue-600 mr-2 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">当前工单信息</div>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                     <InfoField label="工单号" value={currentTask.workOrder} compact />
                     <InfoField label="物料编码" value={currentTask.productCode} compact />
                     <InfoField label="销售单号" value={currentTask.salesOrder} compact />
                     <InfoField label="型号" value={currentTask.unitModel} compact />
                     <InfoField label="物料名称" value={currentTask.productName} compact />
                     <InfoField label="行号" value={currentTask.lineNo} compact />
                 </div>
             </div>

             {/* Daily Stats Card */}
             <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-md p-5 h-[200px] flex flex-col relative overflow-hidden ring-1 ring-blue-500/20 shrink-0">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Clipboard size={100} />
                 </div>
                 <h3 className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">今日任务总量</h3>
                 <div className="flex items-baseline gap-2 mb-auto mt-2">
                     <span className="text-6xl font-bold tracking-tighter">8</span>
                     <span className="text-xl opacity-80 font-medium">单</span>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-white/10 pt-4 mt-2">
                     <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-sm">
                         <div className="opacity-70 text-[10px] mb-0.5">未开始</div>
                         <div className="font-bold text-lg">4</div>
                     </div>
                     <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-sm">
                         <div className="opacity-70 text-[10px] mb-0.5">进行中</div>
                         <div className="font-bold text-lg">2</div>
                     </div>
                     <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-sm">
                         <div className="opacity-70 text-[10px] mb-0.5">已完成</div>
                         <div className="font-bold text-lg">2</div>
                     </div>
                 </div>
             </div>

         </div>

         {/* 3. User Profile Footer (Pinned to bottom left) */}
         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shadow-sm">
                <UserCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>
      </aside>

      {/* --- RIGHT MAIN CONTENT (80%) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
         
         {/* Right Header */}
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-2">
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                    <ChevronLeft size={28} strokeWidth={2.5} />
                </button>
                <span className="text-slate-800 font-bold text-2xl tracking-wide">过站采集</span>
            </div>

            <div className="flex items-center gap-2">
                 <button onClick={onHome} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex flex-col items-center">
                     <Home size={24} />
                 </button>
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                     <MoreHorizontal size={24} />
                 </button>
            </div>
         </header>

         {/* Right Content Body */}
         <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
             
             {/* 1. Top Navigation Grid */}
             <div className="grid grid-cols-7 gap-3 h-14 shrink-0">
                 <NavButton label="产前准备" onClick={() => setIsPreProductionOpen(true)} hasNotification />
                 <NavButton label="叫料/接收" />
                 <NavButton label="安灯管理" />
                 <NavButton label="在线维修" />
                 <NavButton label="ESOP" onClick={handleEsopClick} />
                 <NavButton label="ECN变更通知" hasNotification />
                 <NavButton label="切换工单" />
             </div>

             {/* 2. Bottom Tabs & Content (Occupies remaining space) */}
             <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="flex border-b border-slate-200 bg-slate-50">
                     <TabButton label="工序BOM" isActive={activeTab === 'BOM'} onClick={() => setActiveTab('BOM')} />
                     <TabButton label="检验项目" isActive={activeTab === 'INSPECTION'} onClick={() => setActiveTab('INSPECTION')} />
                     <TabButton label="采集日志" isActive={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} />
                 </div>
                 
                 <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
                     {renderTabContent()}
                 </div>
             </div>

         </div>

         {/* Right Footer */}
         <footer className="h-8 bg-slate-100 border-t border-slate-200 text-slate-400 text-xs flex items-center justify-end px-6 shrink-0">
             <span>广东赛意信息科技股份有限公司</span>
         </footer>
      </main>

    </div>
  );
};

// --- Sub-components ---

const NavButton: React.FC<{ 
    label: string; 
    hasNotification?: boolean;
    onClick?: () => void;
}> = ({ label, hasNotification, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg flex items-center justify-center relative hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm active:bg-slate-100 hover:shadow-md hover:-translate-y-0.5"
    >
        {label}
        {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
    </button>
);

const InfoField: React.FC<{ label: string; value: string; compact?: boolean }> = ({ label, value, compact }) => (
    <div className={`flex items-center ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className={`font-bold text-slate-500 text-right mr-3 shrink-0 ${compact ? 'w-16' : 'w-20'}`}>{label}:</span>
        <div className={`flex-1 border border-slate-200 px-3 flex items-center text-slate-900 bg-slate-50 rounded-lg truncate font-medium ${compact ? 'h-8 text-xs' : 'h-9 text-sm'}`}>
            {value}
        </div>
    </div>
);

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`
            px-8 py-3 text-sm font-bold transition-all min-w-[140px] relative
            ${isActive 
                ? 'bg-white text-blue-700 border-t-2 border-t-blue-600' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border-r border-slate-200 last:border-0'
            }
        `}
    >
        {label}
    </button>
);
