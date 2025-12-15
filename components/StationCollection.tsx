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
  Factory,
  ClipboardList,
  Megaphone,
  Timer,
  Wrench,
  BookOpen,
  FileDiff,
  Inbox
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
             <div className="bg-white px-3 py-2 border-b border-slate-200 flex gap-3 shrink-0">
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Download size={16} /> 读取设备参数
                 </button>
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Save size={16} /> 保存
                 </button>
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded border border-slate-300 transition-colors">
                    <Send size={16} /> 提交
                 </button>
             </div>

             {/* List Content - Font Increased by ~1/3 */}
             <div className="flex-1 overflow-auto p-3 space-y-3">
                {MOCK_CHECKS_SCREENSHOT.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm flex flex-col">
                        {/* Header Row: Seq + Name + Result Toggle */}
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-bold text-slate-900 text-lg truncate">{item.name}</span>
                            </div>
                            
                            {/* KC/KPC Label & Toggle Group */}
                            <div className="flex items-center gap-3 shrink-0">
                                 <span className="text-sm font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded border border-slate-300 whitespace-nowrap">
                                    KC:{item.kc} &nbsp; KPC：{item.kpc}
                                 </span>
                                 
                                 {/* Camera Button */}
                                 <button className="h-8 w-10 flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors shrink-0">
                                    <Camera size={18} />
                                 </button>

                                 <div className="flex rounded overflow-hidden border border-slate-300 h-8 shrink-0 shadow-sm">
                                    <button className={`px-4 text-sm font-bold transition-colors flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        合格
                                    </button>
                                    <div className="w-px bg-slate-300"></div>
                                    <button className={`px-4 text-sm font-bold transition-colors flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        不合格
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body Row */}
                        <div className="p-3 text-base">
                            {/* Requirement */}
                            <div className="mb-3 text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-slate-600">要求:</span>
                                    <span>{item.standard}</span>
                                </div>
                                {item.isQuantitative && (
                                    <div className="mt-2 flex gap-4 font-mono text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded w-fit text-sm font-bold">
                                        <span>下限：{item.lowerLimit}</span>
                                        <span>上限：{item.upperLimit}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Input Area */}
                            {item.isQuantitative && (
                                <div className="flex items-center flex-wrap gap-3 mt-2">
                                    {/* Inputs - Only for Quantitative */}
                                    <div className="flex items-center gap-3 flex-wrap bg-slate-50 p-2 rounded border border-slate-100 w-full">
                                        <span className="text-slate-600 shrink-0 font-bold">
                                            测试值 (样本:{item.sampleCount}):
                                        </span>
                                        
                                        {Array.from({ length: item.sampleCount }).map((_, i) => (
                                            <input 
                                                key={i}
                                                type="text" 
                                                defaultValue={item.vals[i] || ''}
                                                placeholder={`#${i+1}`}
                                                className="border border-slate-300 rounded px-2 py-1.5 w-20 bg-white focus:border-blue-500 outline-none transition-colors text-center font-mono font-bold text-slate-800"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );
      case 'LOGS':
        return (
          <div className="flex-1 overflow-auto bg-slate-50 p-3 font-mono text-sm leading-relaxed text-slate-800 border border-slate-200 m-2 rounded shadow-inner">
             {MOCK_LOGS.map(log => (
                <div key={log.id} className="mb-2 pb-2 border-b border-slate-200 last:border-0 flex">
                   <span className="text-slate-500 mr-3 w-36 shrink-0">{log.timestamp}</span> 
                   <span className="font-bold text-blue-700 mr-3 w-16 shrink-0">[{log.action}]</span> 
                   <span className={log.type === 'ERROR' ? 'text-red-600 font-bold' : 'text-slate-700'}>
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
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         {/* 1. Sidebar Header (Brand) */}
         <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight text-blue-900 whitespace-nowrap">YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-7 w-auto" />
            </div>
         </div>

         {/* 2. Sidebar Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
             
             {/* Scan Area */}
             <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                 <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-blue-600 mr-2.5 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">扫码信息</div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                     <div className="relative group w-full">
                        <input 
                            type="text" 
                            placeholder="扫码/SN"
                            className="w-full h-10 border border-slate-300 rounded pl-3 pr-10 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm font-medium"
                        />
                        <button className="absolute right-1 top-1 bottom-1 aspect-square bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors">
                            <Scan size={18} />
                        </button>
                     </div>
                     <div className="flex gap-2 w-full">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-bold shadow-sm active:scale-95">进站</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded text-sm font-bold shadow-sm active:scale-95">关键件</button>
                        <button className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded text-sm font-bold shadow-sm active:scale-95">出站</button>
                     </div>
                 </div>
                 
                 <div className="mt-3 bg-slate-50 p-2 text-xs text-slate-500 font-medium border border-slate-200 rounded flex items-start gap-1.5">
                     <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                     <span>暂无异常提示信息...</span>
                 </div>
             </div>

             {/* WIP Work Order */}
             <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-3">
                 <div className="h-9 border-b border-slate-100 flex items-center justify-between shrink-0">
                     <div className="flex items-center">
                        <div className="w-1.5 h-5 bg-amber-500 mr-2.5 rounded-full"></div>
                        <span className="font-bold text-slate-800 text-base">在制工单</span>
                     </div>
                     <button className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded hover:bg-blue-100 transition-colors">切换</button>
                 </div>
                 
                 {/* Stats Mini Grid */}
                 <div className="grid grid-cols-3 gap-2">
                     <div className="bg-slate-50 p-2 rounded text-center border border-slate-100">
                         <div className="text-xs text-slate-500 mb-1 font-bold">完成</div>
                         <div className="text-base font-extrabold text-slate-800">1</div>
                     </div>
                     <div className="bg-slate-50 p-2 rounded text-center border border-slate-100">
                         <div className="text-xs text-slate-500 mb-1 font-bold">异常</div>
                         <div className="text-base font-extrabold text-slate-800">否</div>
                     </div>
                     <div className="bg-slate-50 p-2 rounded text-center border border-slate-100">
                         <div className="text-xs text-slate-500 mb-1 font-bold">点检</div>
                         <div className="text-sm font-extrabold text-red-500 mt-0.5">否</div>
                     </div>
                 </div>

                 {/* Details List 1 with Countdown */}
                 <div className="flex bg-slate-50 p-3 rounded border border-slate-100 items-center shadow-sm">
                    <div className="flex-1 space-y-2 min-w-0">
                        <DetailRow label="工单号" value={currentTask.workOrder} />
                        <DetailRow label="序列号" value="251205171" />
                        <DetailRow label="机组" value={currentTask.unitModel} />
                        <DetailRow label="型号" value={currentTask.productCode} />
                    </div>
                    {/* Countdown Timer */}
                    <div className="w-20 flex flex-col items-center justify-center ml-2 shrink-0">
                        {/* SVG Timer */}
                        <div className="relative w-12 h-12">
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
                                <span className="text-base font-bold text-blue-600 leading-none">15</span>
                                <span className="text-[10px] text-blue-400 font-medium leading-none mt-0.5">min</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-800 mt-1.5 whitespace-nowrap">12.12 PM</div>
                    </div>
                 </div>

                 {/* Details List 2 (Added) */}
                 <div className="flex bg-slate-50 p-3 rounded border border-slate-100 items-center shadow-sm">
                    <div className="flex-1 space-y-2 min-w-0">
                        <DetailRow label="工单号" value="10907559" />
                        <DetailRow label="序列号" value="251205172" />
                        <DetailRow label="机组" value="30RB202CPT255" />
                        <DetailRow label="型号" value="30RB202C" />
                    </div>
                    {/* Countdown Timer (Different value for variety) */}
                    <div className="w-20 flex flex-col items-center justify-center ml-2 shrink-0">
                        <div className="relative w-12 h-12">
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
                                <span className="text-base font-bold text-amber-500 leading-none">30</span>
                                <span className="text-[10px] text-amber-400 font-medium leading-none mt-0.5">min</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-800 mt-1.5 whitespace-nowrap">12.12 PM</div>
                    </div>
                 </div>

             </div>

             {/* Personnel Info (Compact) */}
             <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <div className="w-1.5 h-5 bg-lime-500 mr-2.5 rounded-full"></div>
                        <div className="text-base font-bold text-slate-800">人员上岗</div>
                    </div>
                    <button className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded hover:bg-blue-100 transition-colors">上/下岗</button>
                </div>
                <div className="space-y-2.5">
                    {/* Person 1 */}
                    <div className="bg-slate-50 rounded p-2.5 border border-slate-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <div className="font-bold text-slate-800 text-sm">张三</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">1H</span>
                             </div>
                             <div className="text-xs text-slate-500 transform origin-left">2025/12/4 08:00</div>
                        </div>
                    </div>
                    {/* Person 2 (Added) */}
                    <div className="bg-slate-50 rounded p-2.5 border border-slate-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <div className="font-bold text-slate-800 text-sm">李四</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">3H</span>
                             </div>
                             <div className="text-xs text-slate-500 transform origin-left">2025/12/4 06:00</div>
                        </div>
                    </div>
                    {/* Person 3 (Added) */}
                    <div className="bg-slate-50 rounded p-2.5 border border-slate-100 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                             <UserCircle size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <div className="font-bold text-slate-800 text-sm">王五</div>
                                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">0.5H</span>
                             </div>
                             <div className="text-xs text-slate-500 transform origin-left">2025/12/4 08:30</div>
                        </div>
                    </div>
                </div>
             </div>
             
         </div>

         {/* 3. User Profile Footer */}
         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shadow-sm">
                <UserCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部</div>
            </div>
        </div>
      </aside>

      {/* --- RIGHT MAIN CONTENT (80%) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
         
         {/* Right Header */}
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-3">
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                    <ChevronLeft size={26} strokeWidth={2.5} />
                </button>
                <span className="text-slate-800 font-bold text-2xl tracking-wide">过站采集</span>
            </div>

            <div className="flex items-center gap-2">
                 <button onClick={onHome} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                     <Home size={24} />
                 </button>
            </div>
         </header>

         {/* Right Content Body - Compact Grid */}
         <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden">
             
             {/* 1. Top Navigation Grid */}
             {/* INCREASED HEIGHT for max font size (h-12 to h-16) */}
             <div className="grid grid-cols-7 gap-3 h-16 shrink-0">
                 {/* Updated buttons: Red background for specific ones, removed notifications, larger font */}
                 <NavButton label="产前准备" icon={<ClipboardList size={22} />} onClick={() => setIsPreProductionOpen(true)} bgColor="bg-red-600 hover:bg-red-700" />
                 <NavButton label="叫料" icon={<Megaphone size={22} />} />
                 <NavButton label="误工记录" icon={<Timer size={22} />} />
                 <NavButton label="在线维修" icon={<Wrench size={22} />} />
                 <NavButton label="ESOP" icon={<BookOpen size={22} />} onClick={handleEsopClick} />
                 <NavButton label="ECN变更" icon={<FileDiff size={22} />} bgColor="bg-red-600 hover:bg-red-700" />
                 <NavButton label="物料接收" icon={<Inbox size={22} />} />
             </div>

             {/* 2. Split Content: Left (Tabs) & Right (Materials/Work Unit) */}
             <div className="flex flex-1 overflow-hidden gap-3">
                 
                 {/* Left: Tabs & Content */}
                 <div className="flex-1 flex flex-col min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                     <div className="flex border-b border-slate-200 bg-slate-50 items-center justify-between pr-4 h-12 shrink-0">
                         <div className="flex h-full">
                            <TabButton label="检验项目" isActive={activeTab === 'INSPECTION'} onClick={() => setActiveTab('INSPECTION')} />
                            <TabButton label="采集日志" isActive={activeTab === 'LOGS'} onClick={() => setActiveTab('LOGS')} />
                         </div>
                         <div className="flex items-center gap-3 w-48">
                                 <span className="text-sm font-bold text-slate-600 whitespace-nowrap">进度: 60%</span>
                                 <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-600 w-[60%]"></div>
                                 </div>
                         </div>
                     </div>
                     
                     <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
                         {renderTabContent()}
                     </div>
                 </div>

                 {/* Right: Info Panels (Materials & Work Unit) */}
                 <div className="w-[320px] flex flex-col gap-3 overflow-y-auto no-scrollbar shrink-0">
                     
                     {/* Process Materials Card */}
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[45%]">
                         <div className="h-10 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
                             <div className="w-1.5 h-4 bg-lime-600 mr-2.5"></div>
                             <span className="font-bold text-slate-800 text-base">工序物料</span>
                         </div>
                         <div className="flex-1 overflow-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-2 py-2 text-center w-10">#</th>
                                        <th className="px-2 py-2">物料编码</th>
                                        <th className="px-2 py-2 text-center w-10">数量</th>
                                        <th className="px-2 py-2 text-center w-10">关键</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_BOM.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-2 py-2.5 text-center text-slate-500 font-medium">{item.seq}</td>
                                            <td className="px-2 py-2.5 font-bold text-slate-700 truncate max-w-[120px]" title={item.materialCode}>{item.materialCode}</td>
                                            <td className="px-2 py-2.5 text-center text-slate-700 font-bold">{item.qty}</td>
                                            <td className="px-2 py-2.5 text-center text-slate-500">{item.isKeyPart ? '是' : '-'}</td>
                                        </tr>
                                    ))}
                                    {/* Mock items */}
                                    <tr className="hover:bg-slate-50"><td className="px-2 py-2.5 text-center text-slate-500">5</td><td className="px-2 py-2.5 text-slate-700 font-bold">2007750347</td><td className="px-2 py-2.5 text-center text-slate-700 font-bold">1</td><td className="px-2 py-2.5 text-center text-slate-500">-</td></tr>
                                    <tr className="hover:bg-slate-50"><td className="px-2 py-2.5 text-center text-slate-500">6</td><td className="px-2 py-2.5 text-slate-700 font-bold">2007750348</td><td className="px-2 py-2.5 text-center text-slate-700 font-bold">2</td><td className="px-2 py-2.5 text-center text-slate-500">-</td></tr>
                                </tbody>
                            </table>
                         </div>
                     </div>

                     {/* Current Work Unit (SWAPPED: Formerly Left Sidebar) */}
                     <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 p-4">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 border-l-4 border-lime-500 pl-2.5 h-5">
                                <span className="font-bold text-slate-800 text-base">当前工作单元</span>
                            </div>
                            <button className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded hover:bg-blue-100 transition-colors">切换</button>
                         </div>
                         <div className="space-y-3 flex-1">
                             <div className="flex flex-col gap-1.5">
                                 <span className="text-xs text-slate-500 font-bold">产线</span>
                                 <div className="border border-slate-200 rounded px-3 py-2 bg-slate-50 flex justify-between items-center text-sm text-slate-700 font-bold">
                                     <span>星火01</span>
                                     <Layout size={14} className="text-slate-400"/>
                                 </div>
                             </div>
                             <div className="flex flex-col gap-1.5">
                                 <span className="text-xs text-slate-500 font-bold">工序</span>
                                 <div className="border border-slate-200 rounded px-3 py-2 bg-slate-50 flex justify-between items-center text-sm text-slate-700 font-bold">
                                     <span>大件装配</span>
                                     <Factory size={14} className="text-slate-400"/>
                                 </div>
                             </div>
                             <div className="flex flex-col gap-1.5">
                                 <span className="text-xs text-slate-500 font-bold">工位</span>
                                 <div className="border border-slate-200 rounded px-3 py-2 bg-slate-50 flex justify-between items-center text-sm text-slate-700 font-bold">
                                     <span>大件装配工位01</span>
                                     <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                 </div>
                             </div>
                         </div>
                     </div>

                 </div>

             </div>

         </div>

         {/* Right Footer */}
         <footer className="h-8 bg-slate-100 border-t border-slate-200 text-slate-500 text-xs flex items-center justify-end px-6 shrink-0 font-medium">
             <span>广东赛意信息科技股份有限公司</span>
         </footer>
      </main>

    </div>
  );
};

// --- Sub-components ---

const NavButton: React.FC<{ 
    label: string; 
    icon: React.ReactNode;
    bgColor?: string;
    onClick?: () => void;
}> = ({ label, icon, bgColor = "bg-blue-600 hover:bg-blue-700", onClick }) => (
    <button 
        onClick={onClick}
        className={`${bgColor} text-white font-extrabold text-lg rounded-lg flex items-center justify-center gap-2.5 relative transition-all shadow-sm active:scale-95 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap overflow-hidden`}
    >
        <span className="transform scale-105">{icon}</span>
        <span>{label}</span>
    </button>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex text-xs">
        <span className="w-14 text-slate-500 text-right mr-3 shrink-0 font-medium">{label}:</span>
        <span className="text-slate-900 font-bold break-all">{value}</span>
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
            px-6 h-full text-sm font-bold transition-all relative border-r border-slate-200 last:border-0 flex items-center
            ${isActive 
                ? 'bg-white text-blue-700 border-t-4 border-t-blue-600' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }
        `}
    >
        {label}
    </button>
);