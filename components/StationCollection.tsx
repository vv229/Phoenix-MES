import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  AlertTriangle,
  MoreHorizontal,
  UserCircle,
  Scan,
  Clock,
  Save,
  Send,
  Download,
  Camera,
  Layout,
  Factory
} from 'lucide-react';
import { MOCK_TASKS, MOCK_BOM, MOCK_LOGS } from '../constants';
import { PreProductionCheck } from './PreProductionCheck';
import { PDFViewer } from './PDFViewer';
import { CarrierLogo } from './CarrierLogo';

interface StationCollectionProps {
  onBack: () => void;
  onHome: () => void;
}

// Updated Mock Data with Quantitative logic and Limits
const MOCK_CHECKS_SCREENSHOT = [
    { id: 1, name: '选项确认', standard: '确认机组制造的选项与生产订单相符', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 2, name: '底盘', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 3, name: '油分离器螺丝扭矩', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: null, isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 4, name: '蒸发器与冷凝器连接', standard: 'M30:1084±34NM', vals: ['1004', '1005', '1002'], result: 'NG', isQuantitative: true, sampleCount: 3, lowerLimit: '1050', upperLimit: '1118', kc: '是', kpc: '是' },
    { id: 5, name: '蒸发器筒身端', standard: 'M20: [285±34 N.M.]', vals: ['200'], result: 'NG', isQuantitative: true, sampleCount: 1, lowerLimit: '251', upperLimit: '319', kc: '否', kpc: '是' },
    { id: 6, name: '压缩机准备', standard: '确认压缩机的SO与机组的SO一致', vals: [''], result: 'NG', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
];

export const StationCollection: React.FC<StationCollectionProps> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<'INSPECTION' | 'LOGS'>('INSPECTION');
  const [isPreProductionOpen, setIsPreProductionOpen] = useState(false);
  const [isEsopOpen, setIsEsopOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  
  // Use mock task for display
  const currentTask = MOCK_TASKS[0];

  const handleEsopClick = () => setIsEsopOpen(true);

  // PDF Link
  const PUBLIC_PDF_URL = "https://www.carrier.com/carrier/en/worldwide/media/Carrier-Infinity-Air-Purifier-Coronavirus-Infographic-10-15-2020_tcm933-98829.pdf";

  // Function to render the correct Bottom Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'INSPECTION':
        return (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
             {/* Toolbar - More Compact */}
             <div className="bg-white px-2 py-1.5 border-b border-slate-200 flex gap-2 shrink-0">
                 <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors">
                    <Download size={14} /> 读取设备参数
                 </button>
                 <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors">
                    <Save size={14} /> 保存
                 </button>
                 <button className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors">
                    <Send size={14} /> 提交
                 </button>
             </div>

             {/* List Content - Compact Layout */}
             <div className="flex-1 overflow-auto p-2 space-y-2">
                {MOCK_CHECKS_SCREENSHOT.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm flex flex-col">
                        {/* Header Row: Seq + Name + Result Toggle */}
                        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-bold text-slate-800 text-sm truncate">{item.name}</span>
                            </div>
                            
                            {/* KC/KPC Label & Toggle Group */}
                            <div className="flex items-center gap-2 shrink-0">
                                 <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                    KC:{item.kc} &nbsp; KPC：{item.kpc}
                                 </span>
                                 <div className="flex rounded overflow-hidden border border-slate-300 h-6 shrink-0">
                                    <button className={`px-2 text-xs font-bold transition-colors flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        合格
                                    </button>
                                    <div className="w-px bg-slate-300"></div>
                                    <button className={`px-2 text-xs font-bold transition-colors flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        不合格
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body Row */}
                        <div className="p-2 text-xs">
                            {/* Requirement */}
                            <div className="mb-2 text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                                <div><span className="font-bold text-slate-500 mr-1">要求:</span>{item.standard}</div>
                                {item.isQuantitative && (
                                    <div className="mt-1 flex gap-3 font-mono text-slate-500 bg-white border border-slate-100 px-1 rounded w-fit">
                                        <span>下限：{item.lowerLimit}</span>
                                        <span>上限：{item.upperLimit}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Input Area */}
                            <div className="flex items-center flex-wrap gap-2">
                                {/* Camera Button */}
                                <button className="p-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors shrink-0">
                                    <Camera size={16} />
                                </button>

                                {/* Inputs - Only for Quantitative */}
                                {item.isQuantitative && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-slate-500 shrink-0 font-medium">
                                            测试值 (样本:{item.sampleCount}):
                                        </span>
                                        
                                        {Array.from({ length: item.sampleCount }).map((_, i) => (
                                            <input 
                                                key={i}
                                                type="text" 
                                                defaultValue={item.vals[i] || ''}
                                                placeholder={`#${i+1}`}
                                                className="border border-slate-300 rounded px-1.5 py-1 w-14 bg-white focus:border-blue-500 outline-none transition-colors text-center font-mono"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'LOGS':
        return (
          <div className="flex-1 overflow-auto bg-slate-50 p-2 font-mono text-xs leading-relaxed text-slate-800 border border-slate-200 m-2 rounded shadow-inner">
             {MOCK_LOGS.map(log => (
                <div key={log.id} className="mb-1.5 pb-1.5 border-b border-slate-200 last:border-0">
                   <span className="text-slate-500 mr-2">{log.timestamp}</span> 
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
      <aside className="w-[22%] min-w-[260px] max-w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         {/* 1. Sidebar Header (Brand) */}
         <div className="h-14 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-2 w-full">
               <span className="font-bold text-lg tracking-tight text-blue-900 whitespace-nowrap">YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-5 w-auto" />
            </div>
         </div>

         {/* 2. Sidebar Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 no-scrollbar">
             
             {/* Scan Area */}
             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                 <div className="flex items-center mb-2">
                    <div className="w-1 h-4 bg-blue-600 mr-2 rounded-full"></div>
                    <div className="text-sm font-bold text-slate-800">扫码信息</div>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                     <div className="relative group w-full">
                        <input 
                            type="text" 
                            placeholder="扫码/SN/送货单"
                            className="w-full h-8 border border-slate-300 rounded pl-2 pr-8 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
                        />
                        <button className="absolute right-1 top-0.5 bottom-0.5 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors">
                            <Scan size={14} />
                        </button>
                     </div>
                     <div className="flex gap-1 w-full">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs font-bold shadow-sm active:scale-95">进站</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-1.5 rounded text-xs font-bold shadow-sm active:scale-95">关键件</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-1.5 rounded text-xs font-bold shadow-sm active:scale-95">出站</button>
                     </div>
                 </div>
                 
                 <div className="mt-2 bg-slate-50 p-1.5 text-[10px] text-slate-500 font-medium border border-slate-200 rounded flex items-start gap-1">
                     <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                     <span>暂无异常提示信息...</span>
                 </div>
             </div>

             {/* WIP Work Order (SWAPPED: Formerly Real-time Data) */}
             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-2">
                 <div className="h-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                     <div className="flex items-center">
                        <div className="w-1 h-4 bg-amber-500 mr-2 rounded-full"></div>
                        <span className="font-bold text-slate-800 text-sm">在制工单</span>
                     </div>
                     <button className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">切换</button>
                 </div>
                 
                 {/* Stats Mini Grid */}
                 <div className="grid grid-cols-3 gap-1">
                     <div className="bg-slate-50 p-1.5 rounded text-center border border-slate-100">
                         <div className="text-[10px] text-slate-400 mb-0.5">完成</div>
                         <div className="text-sm font-bold text-slate-800">1</div>
                     </div>
                     <div className="bg-slate-50 p-1.5 rounded text-center border border-slate-100">
                         <div className="text-[10px] text-slate-400 mb-0.5">异常</div>
                         <div className="text-sm font-bold text-slate-800">否</div>
                     </div>
                     <div className="bg-slate-50 p-1.5 rounded text-center border border-slate-100">
                         <div className="text-[10px] text-slate-400 mb-0.5">点检</div>
                         <div className="text-xs font-bold text-red-500 mt-0.5">否</div>
                     </div>
                 </div>

                 {/* Details List 1 with Countdown */}
                 <div className="flex bg-slate-50 p-2 rounded border border-slate-100 items-center">
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <DetailRow label="工单号" value={currentTask.workOrder} />
                        <DetailRow label="序列号" value="251205171" />
                        <DetailRow label="机组" value={currentTask.unitModel} />
                        <DetailRow label="型号" value={currentTask.productCode} />
                    </div>
                    {/* Countdown Timer */}
                    <div className="w-16 flex flex-col items-center justify-center ml-1 shrink-0">
                        {/* SVG Timer */}
                        <div className="relative w-10 h-10">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                               <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                               {/* Progress Circle (approx 75%) */}
                               <circle 
                                    cx="28" cy="28" r="24" 
                                    stroke="#3b82f6" strokeWidth="4" 
                                    fill="none" 
                                    strokeDasharray="150.8" 
                                    strokeDashoffset="37.7" 
                                    strokeLinecap="round"
                                />
                                {/* Pointer */}
                                <circle cx="28" cy="52" r="3" fill="#3b82f6" stroke="white" strokeWidth="1" />
                            </svg>
                            {/* Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-bold text-blue-600 leading-none">15</span>
                                <span className="text-[8px] text-blue-400 font-medium leading-none">min</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-800 mt-1 whitespace-nowrap">12.12 PM</div>
                    </div>
                 </div>

                 {/* Details List 2 (Added) */}
                 <div className="flex bg-slate-50 p-2 rounded border border-slate-100 items-center">
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <DetailRow label="工单号" value="10907559" />
                        <DetailRow label="序列号" value="251205172" />
                        <DetailRow label="机组" value="30RB202CPT255" />
                        <DetailRow label="型号" value="30RB202C" />
                    </div>
                    {/* Countdown Timer (Different value for variety) */}
                    <div className="w-16 flex flex-col items-center justify-center ml-1 shrink-0">
                        <div className="relative w-10 h-10">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                               <circle cx="28" cy="28" r="24" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                               <circle 
                                    cx="28" cy="28" r="24" 
                                    stroke="#f59e0b" strokeWidth="4" 
                                    fill="none" 
                                    strokeDasharray="150.8" 
                                    strokeDashoffset="75.4" 
                                    strokeLinecap="round"
                                />
                                <circle cx="52" cy="28" r="3" fill="#f59e0b" stroke="white" strokeWidth="1" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-sm font-bold text-amber-500 leading-none">30</span>
                                <span className="text-[8px] text-amber-400 font-medium leading-none">min</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-800 mt-1 whitespace-nowrap">12.12 PM</div>
                    </div>
                 </div>

             </div>

             {/* Personnel Info (Compact) */}
             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <div className="w-1 h-4 bg-lime-500 mr-2 rounded-full"></div>
                        <div className="text-sm font-bold text-slate-800">人员上岗</div>
                    </div>
                    <button className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">上/下岗</button>
                </div>
                <div className="space-y-2">
                    {/* Person 1 */}
                    <div className="bg-slate-50 rounded p-2 border border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center">
                                 <div className="font-bold text-slate-800 text-xs">张三</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 rounded">1H</span>
                             </div>
                             <div className="text-[10px] text-slate-400 transform scale-95 origin-left">2025/12/4 08:00</div>
                        </div>
                    </div>
                    {/* Person 2 (Added) */}
                    <div className="bg-slate-50 rounded p-2 border border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center">
                                 <div className="font-bold text-slate-800 text-xs">李四</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 rounded">3H</span>
                             </div>
                             <div className="text-[10px] text-slate-400 transform scale-95 origin-left">2025/12/4 06:00</div>
                        </div>
                    </div>
                    {/* Person 3 (Added) */}
                    <div className="bg-slate-50 rounded p-2 border border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center">
                                 <div className="font-bold text-slate-800 text-xs">王五</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 rounded">0.5H</span>
                             </div>
                             <div className="text-[10px] text-slate-400 transform scale-95 origin-left">2025/12/4 08:30</div>
                        </div>
                    </div>
                </div>
             </div>
             
         </div>

         {/* 3. User Profile Footer */}
         <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shadow-sm">
                <UserCircle size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-[10px] text-slate-500 truncate">质量管理部</div>
            </div>
        </div>
      </aside>

      {/* --- RIGHT MAIN CONTENT (80%) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
         
         {/* Right Header */}
         <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-2">
                 <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <span className="text-slate-800 font-bold text-xl tracking-wide">过站采集</span>
            </div>

            <div className="flex items-center gap-1">
                 <button onClick={onHome} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                     <Home size={20} />
                 </button>
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                     <MoreHorizontal size={20} />
                 </button>
            </div>
         </header>

         {/* Right Content Body - Compact Grid */}
         <div className="flex-1 flex flex-col gap-2 p-2 overflow-hidden">
             
             {/* 1. Top Navigation Grid */}
             <div className="grid grid-cols-7 gap-2 h-10 shrink-0">
                 <NavButton label="产前准备" onClick={() => setIsPreProductionOpen(true)} hasNotification />
                 <NavButton label="叫料/接收" />
                 <NavButton label="安灯管理" />
                 <NavButton label="在线维修" />
                 <NavButton label="ESOP" onClick={handleEsopClick} />
                 <NavButton label="ECN变更" hasNotification />
                 <NavButton label="切换工单" />
             </div>

             {/* 2. Split Content: Left (Tabs) & Right (Materials/Work Unit) */}
             <div className="flex flex-1 overflow-hidden gap-2">
                 
                 {/* Left: Tabs & Content */}
                 <div className="flex-1 flex flex-col min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                     <div className="flex border-b border-slate-200 bg-slate-50 items-center justify-between pr-3 h-10 shrink-0">
                         <div className="flex h-full">
                            <TabButton label="检验项目" isActive={activeTab === 'INSPECTION'} onClick={() => setActiveTab('INSPECTION')} />
                            <TabButton label="采集日志" isActive={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} />
                         </div>
                         <div className="flex items-center gap-2 w-40">
                                 <span className="text-xs font-bold text-slate-600 whitespace-nowrap">进度: 60%</span>
                                 <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-600 w-[60%]"></div>
                                 </div>
                         </div>
                     </div>
                     
                     <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
                         {renderTabContent()}
                     </div>
                 </div>

                 {/* Right: Info Panels (Materials & Work Unit) */}
                 <div className="w-[280px] flex flex-col gap-2 overflow-y-auto no-scrollbar shrink-0">
                     
                     {/* Process Materials Card */}
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[45%]">
                         <div className="h-8 bg-white border-b border-slate-200 flex items-center px-3 shrink-0">
                             <div className="w-1 h-3 bg-lime-600 mr-2"></div>
                             <span className="font-bold text-slate-800 text-sm">工序物料</span>
                         </div>
                         <div className="flex-1 overflow-auto">
                            <table className="w-full text-[10px] text-left">
                                <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-1.5 py-1.5 text-center w-8">#</th>
                                        <th className="px-1.5 py-1.5">物料编码</th>
                                        <th className="px-1.5 py-1.5 text-center w-8">数量</th>
                                        <th className="px-1.5 py-1.5 text-center w-8">关键</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_BOM.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-1.5 py-1.5 text-center text-slate-500">{item.seq}</td>
                                            <td className="px-1.5 py-1.5 font-medium text-slate-700 truncate max-w-[90px]" title={item.materialCode}>{item.materialCode}</td>
                                            <td className="px-1.5 py-1.5 text-center text-slate-700">{item.qty}</td>
                                            <td className="px-1.5 py-1.5 text-center text-slate-500">{item.isKeyPart ? '是' : '-'}</td>
                                        </tr>
                                    ))}
                                    {/* Mock items */}
                                    <tr className="hover:bg-slate-50"><td className="px-1.5 py-1.5 text-center text-slate-500">5</td><td className="px-1.5 py-1.5 text-slate-700">2007750347</td><td className="px-1.5 py-1.5 text-center text-slate-700">1</td><td className="px-1.5 py-1.5 text-center text-slate-500">-</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-1.5 py-1.5 text-center text-slate-500">6</td><td className="px-1.5 py-1.5 text-slate-700">2007750348</td><td className="px-1.5 py-1.5 text-center text-slate-700">2</td><td className="px-1.5 py-1.5 text-center text-slate-500">-</td></tr>
                                </tbody>
                            </table>
                         </div>
                         <div className="h-6 bg-slate-50 border-t border-slate-200 flex items-center justify-center text-[10px] text-slate-400 gap-1 shrink-0">
                             <Clock size={10} /> 2025/12/4 08:00
                         </div>
                     </div>

                     {/* Current Work Unit (SWAPPED: Formerly Left Sidebar) */}
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 p-3">
                         <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 border-l-4 border-lime-500 pl-2 h-4">
                                <span className="font-bold text-slate-800 text-sm">当前工作单元</span>
                            </div>
                            <button className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">切换</button>
                         </div>
                         <div className="space-y-2 flex-1">
                             <div className="flex flex-col gap-1">
                                 <span className="text-xs text-slate-500 font-medium">产线</span>
                                 <div className="border border-slate-200 rounded px-2 py-1.5 bg-slate-50 flex justify-between items-center text-xs text-slate-700 font-bold">
                                     <span>星火01</span>
                                     <Layout size={12} className="text-slate-400"/>
                                 </div>
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-xs text-slate-500 font-medium">工序</span>
                                 <div className="border border-slate-200 rounded px-2 py-1.5 bg-slate-50 flex justify-between items-center text-xs text-slate-700 font-bold">
                                     <span>大件装配</span>
                                     <Factory size={12} className="text-slate-400"/>
                                 </div>
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-xs text-slate-500 font-medium">工位</span>
                                 <div className="border border-slate-200 rounded px-2 py-1.5 bg-slate-50 flex justify-between items-center text-xs text-slate-700 font-bold">
                                     <span>大件装配工位01</span>
                                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                 </div>
                             </div>
                         </div>
                     </div>

                 </div>

             </div>

         </div>

         {/* Right Footer */}
         <footer className="h-6 bg-slate-100 border-t border-slate-200 text-slate-400 text-[10px] flex items-center justify-end px-4 shrink-0">
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
        className="bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded flex items-center justify-center relative hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm active:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
    >
        {label}
        {hasNotification && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white"></span>
        )}
    </button>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex text-[10px]">
        <span className="w-12 text-slate-500 text-right mr-2 shrink-0">{label}:</span>
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
            px-4 h-full text-xs font-bold transition-all relative border-r border-slate-200 last:border-0 flex items-center
            ${isActive 
                ? 'bg-white text-blue-700 border-t-2 border-t-blue-600' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }
        `}
    >
        {label}
    </button>
);