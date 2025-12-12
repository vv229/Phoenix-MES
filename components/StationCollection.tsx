import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  FileText, 
  AlertTriangle,
  MoreHorizontal,
  UserCircle,
  Scan,
  Clock,
  Save,
  Send,
  Download
} from 'lucide-react';
import { MOCK_TASKS, MOCK_BOM, MOCK_LOGS } from '../constants';
import { PreProductionCheck } from './PreProductionCheck';
import { PDFViewer } from './PDFViewer';
import { CarrierLogo } from './CarrierLogo';

interface StationCollectionProps {
  onBack: () => void;
  onHome: () => void;
}

// Mock data specifically for the screenshot requirement
const MOCK_CHECKS_SCREENSHOT = [
    { id: 1, name: '选项确认', type: '人工输入', standard: '确认机组制造的选项与生产订单相符', val: '', result: 'OK' },
    { id: 2, name: '底盘', type: '人工输入', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', val: '', result: 'OK' },
    { id: 3, name: '油分离器螺丝扭矩', type: '人工输入', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', val: '', result: null },
    { id: 4, name: '蒸发器与冷凝器连接', type: '设备数采', standard: 'M30:1084±34NM', val: '1004', result: 'NG' },
    { id: 5, name: '蒸发器筒身端', type: '设备数采', standard: 'M20: [285±34 N.M.]', val: '200', result: 'NG' },
    { id: 6, name: '压缩机准备', type: '人工输入', standard: '确认压缩机的SO与机组的SO一致', val: '', result: 'NG' },
];

export const StationCollection: React.FC<StationCollectionProps> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<'INSPECTION' | 'LOGS'>('INSPECTION');
  const [isPreProductionOpen, setIsPreProductionOpen] = useState(false);
  const [isEsopOpen, setIsEsopOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  
  // Use mock task for display
  const currentTask = MOCK_TASKS[0];

  const handleEsopClick = () => setIsEsopOpen(true);

  // Updated PDF Link
  const PUBLIC_PDF_URL = "https://www.carrier.com/carrier/en/worldwide/media/Carrier-Infinity-Air-Purifier-Coronavirus-Infographic-10-15-2020_tcm933-98829.pdf";

  // Function to render the correct Bottom Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'INSPECTION':
        return (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
             {/* Toolbar */}
             <div className="bg-white px-4 py-2 border-b border-slate-200 flex gap-3 shrink-0">
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Download size={16} /> 读取设备参数
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Save size={16} /> 保存
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Send size={16} /> 提交
                 </button>
             </div>

             {/* List Content */}
             <div className="flex-1 overflow-auto p-4 space-y-3">
                {MOCK_CHECKS_SCREENSHOT.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
                        {/* Header Row */}
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <span className="font-bold text-slate-800 text-sm">检查内容: {item.name}</span>
                                <span className="text-slate-600 text-sm">类型: {item.type}</span>
                            </div>
                            
                            {/* Toggle Group */}
                            <div className="flex rounded overflow-hidden border border-slate-300 h-7">
                                <button className={`px-4 text-xs font-bold transition-colors flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    合格
                                </button>
                                <div className="w-px bg-slate-300"></div>
                                <button className={`px-4 text-xs font-bold transition-colors flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                    不合格
                                </button>
                            </div>
                        </div>

                        {/* Body Row */}
                        <div className="p-4 text-sm">
                            <div className="mb-3 text-slate-600">
                                <span className="font-medium text-slate-500">标准值: </span>
                                {item.standard}
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span>上限:</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <span>下限:</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">测试值:</span>
                                    <input 
                                        type="text" 
                                        defaultValue={item.val}
                                        className="border border-slate-300 rounded px-2 py-1 w-32 bg-slate-100 focus:bg-white focus:border-blue-500 outline-none transition-colors h-8"
                                    />
                                </div>
                            </div>
                        </div>
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
         pdfUrl={PUBLIC_PDF_URL}
      />
       <PDFViewer 
         isOpen={isDrawingOpen} 
         onClose={() => setIsDrawingOpen(false)} 
         title="图纸预览 - AC-Cx.pdf"
         pdfUrl={PUBLIC_PDF_URL}
      />

      {/* --- LEFT SIDEBAR (20%) --- */}
      <aside className="w-[20%] min-w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         {/* 1. Sidebar Header (Brand) */}
         <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight text-blue-900 whitespace-nowrap">YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-6 w-auto" />
            </div>
         </div>

         {/* 2. Sidebar Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
             
             {/* Scan Area */}
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

             {/* Personnel Info */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                    <div className="w-1.5 h-5 bg-lime-500 mr-2 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">人员上岗信息</div>
                </div>
                <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <div className="font-bold text-slate-800">张三</div>
                                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">1H</span>
                             </div>
                             <div className="text-[10px] text-slate-400">2025/12/4 08:00:00</div>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <div className="font-bold text-slate-800">张三</div>
                                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">1H</span>
                             </div>
                             <div className="text-[10px] text-slate-400">2025/12/4 08:00:00</div>
                        </div>
                    </div>
                </div>
             </div>
             
         </div>

         {/* 3. User Profile Footer */}
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

             {/* 2. Split Content: Left (Tabs) & Right (Materials/Data) */}
             <div className="flex flex-1 overflow-hidden gap-4">
                 
                 {/* Left: Tabs & Content */}
                 <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="flex border-b border-slate-200 bg-slate-50 items-center justify-between pr-4">
                         <div className="flex">
                            <TabButton label="检验项目" isActive={activeTab === 'INSPECTION'} onClick={() => setActiveTab('INSPECTION')} />
                            <TabButton label="采集日志" isActive={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} />
                         </div>
                         {/* Inspection Completion Rate maintained */}
                         <div className="flex items-center gap-2 w-48">
                                 <span className="text-sm font-bold text-slate-600 whitespace-nowrap">检验完成率: 60%</span>
                                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-600 w-[60%]"></div>
                                 </div>
                         </div>
                     </div>
                     
                     <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
                         {renderTabContent()}
                     </div>
                 </div>

                 {/* Right: Info Panels (Materials & Work Order) */}
                 <div className="w-[320px] flex flex-col gap-4 overflow-y-auto no-scrollbar shrink-0">
                     
                     {/* Process Materials Card */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[50%]">
                         <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
                             <div className="w-1 h-4 bg-lime-600 mr-2"></div>
                             <span className="font-bold text-slate-800">工序物料</span>
                         </div>
                         <div className="flex-1 overflow-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-2 py-2 text-center w-10">序号</th>
                                        <th className="px-2 py-2">物料编码</th>
                                        <th className="px-2 py-2 text-center w-10">数量</th>
                                        <th className="px-2 py-2 text-center w-14">是否关键件</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_BOM.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-2 py-2 text-center text-slate-500">{item.seq}</td>
                                            <td className="px-2 py-2 font-medium text-slate-700 truncate max-w-[100px]" title={item.materialCode}>{item.materialCode}</td>
                                            <td className="px-2 py-2 text-center text-slate-700">{item.qty}</td>
                                            <td className="px-2 py-2 text-center text-slate-500">{item.isKeyPart ? '是' : '否'}</td>
                                        </tr>
                                    ))}
                                    {/* Mock more items to fill */}
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-2 py-2 text-center text-slate-500">5</td>
                                        <td className="px-2 py-2 font-medium text-slate-700">2007750347</td>
                                        <td className="px-2 py-2 text-center text-slate-700">1</td>
                                        <td className="px-2 py-2 text-center text-slate-500">否</td>
                                    </tr>
                                </tbody>
                            </table>
                         </div>
                         <div className="h-8 bg-slate-50 border-t border-slate-200 flex items-center justify-center text-xs text-slate-400 gap-1 shrink-0">
                             <Clock size={12} /> 2025/12/4 08:00:00
                         </div>
                     </div>

                     {/* Real-time Data (Bottom Right) */}
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
                         <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
                             <div className="w-1 h-4 bg-lime-600 mr-2"></div>
                             <span className="font-bold text-slate-800">实时数据</span>
                         </div>
                         
                         {/* Stats Grid */}
                         <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 border-b border-slate-200">
                             <div className="bg-sky-200/50 p-2 rounded text-center">
                                 <div className="text-[10px] text-slate-500 font-bold mb-1">已完成数量</div>
                                 <div className="text-lg font-bold text-slate-800">1</div>
                             </div>
                             <div className="bg-sky-200/50 p-2 rounded text-center">
                                 <div className="text-[10px] text-slate-500 font-bold mb-1">是否有异常</div>
                                 <div className="text-lg font-bold text-slate-800">否</div>
                             </div>
                             <div className="bg-sky-200/50 p-2 rounded text-center">
                                 <div className="text-[10px] text-slate-500 font-bold mb-1">是否点检完成</div>
                                 <div className="text-sm font-bold text-red-500 mt-1">否</div>
                             </div>
                         </div>

                         {/* Work Order Details List */}
                         <div className="p-3 space-y-2 flex-1 overflow-auto bg-sky-50/30">
                            <DetailRow label="工单号" value={currentTask.workOrder} />
                            <DetailRow label="序列号" value="251205171" />
                            <DetailRow label="SO/行号" value={`${currentTask.salesOrder}/${currentTask.lineNo}`} />
                            <DetailRow label="机组型号" value={currentTask.unitModel} />
                            <div className="h-px bg-slate-200 my-2"></div>
                             <DetailRow label="工单号" value={currentTask.workOrder} />
                            <DetailRow label="序列号" value="251205171" />
                            <DetailRow label="SO/行号" value={`${currentTask.salesOrder}/${currentTask.lineNo}`} />
                            <DetailRow label="机组型号" value={currentTask.unitModel} />
                         </div>
                     </div>

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
        className="bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg flex items-center justify-center relative hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm active:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
    >
        {label}
        {hasNotification && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
    </button>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex text-xs">
        <span className="w-16 text-slate-500 text-right mr-2 shrink-0">{label}:</span>
        <span className="text-slate-800 font-medium break-all">{value}</span>
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
            px-6 py-3 text-sm font-bold transition-all relative border-r border-slate-200 last:border-0
            ${isActive 
                ? 'bg-white text-blue-700 border-t-2 border-t-blue-600' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }
        `}
    >
        {label}
    </button>
);