import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  Save,
  Send,
  Download,
  Camera,
  ClipboardList,
  Megaphone,
  Timer,
  Wrench,
  BookOpen,
  FileDiff,
  Inbox,
  UserCircle,
  ScanLine,
  Search,
  AlertTriangle,
  RotateCw,
  MoreHorizontal,
  Box,
  Clock,
  Hash,
  FileText
} from 'lucide-react';
import { MOCK_TASKS, MOCK_BOM, MOCK_LOGS } from '../constants';
import { PreProductionCheck } from './PreProductionCheck';
import { PDFViewer } from './PDFViewer';
import { CarrierLogo } from './CarrierLogo';

interface StationCollectionProps {
  onBack: () => void;
  onHome: () => void;
}

// Carrier Logo Blue
const BRAND_BLUE = '#0A2EF5';

// Updated Mock Data
const MOCK_CHECKS_SCREENSHOT = [
    { id: 1, name: '选项确认', standard: '确认机组制造的选项与生产订单相符', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 2, name: '底盘', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 3, name: '油分离器螺丝扭矩', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: null, isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 4, name: '蒸发器与冷凝器连接', standard: 'M30:1084±34NM', vals: ['1004', '1005', '1002'], result: 'NG', isQuantitative: true, sampleCount: 3, lowerLimit: '1050', upperLimit: '1118', kc: '是', kpc: '是' },
    { id: 5, name: '蒸发器筒身端', standard: 'M20: [285±34 N.M.]', vals: ['200'], result: 'NG', isQuantitative: true, sampleCount: 1, lowerLimit: 251, upperLimit: 319, kc: '否', kpc: '是' },
    { id: 6, name: '压缩机准备', standard: '确认压缩机的SO与机组的SO一致', vals: [''], result: 'NG', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 7, name: '电气接线检查', standard: '接线端子无松动，线号标识清晰', vals: [''], result: null, isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是' },
    { id: 8, name: '冷媒充注量', standard: 'R134a: 25kg ± 0.5kg', vals: [''], result: null, isQuantitative: true, sampleCount: 1, lowerLimit: 24.5, upperLimit: 25.5, kc: '是', kpc: '是' },
];

export const StationCollection: React.FC<StationCollectionProps> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<'INSPECTION' | 'LOGS'>('INSPECTION');
  const [isPreProductionOpen, setIsPreProductionOpen] = useState(false);
  const [isEsopOpen, setIsEsopOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  
  const handleEsopClick = () => setIsEsopOpen(true);
  const PUBLIC_PDF_URL = "https://www.carrier.com/carrier/en/worldwide/media/Carrier-Infinity-Air-Purifier-Coronavirus-Infographic-10-15-2020_tcm933-98829.pdf";

  // Render Tab Content (Left Panel of Right Side)
  const renderTabContent = () => {
    switch (activeTab) {
      case 'INSPECTION':
        return (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
             {/* Toolbar */}
             <div className="bg-white px-3 py-2 border-b border-slate-200 flex gap-2 shrink-0">
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors shadow-sm">
                    <Download size={16} /> 读取设备参数
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors shadow-sm">
                    <Save size={16} /> 保存
                 </button>
                 <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors shadow-sm">
                    <Send size={16} /> 提交
                 </button>
             </div>

             {/* List Content */}
             <div className="flex-1 overflow-auto p-2 space-y-2">
                {MOCK_CHECKS_SCREENSHOT.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
                        {/* Header Row */}
                        <div className="bg-slate-50/50 border-b border-slate-100 px-3 py-2 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm" style={{ backgroundColor: BRAND_BLUE }}>
                                    {index + 1}
                                </div>
                                <span className="font-bold text-slate-900 text-base truncate">{item.name}</span>
                            </div>
                            
                            {/* Controls */}
                            <div className="flex items-center gap-2 shrink-0">
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${item.isQuantitative ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-500 text-white border-slate-500'}`}>
                                    {item.isQuantitative ? '定量' : '定性'}
                                 </span>

                                 <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                    KC:{item.kc} &nbsp; KPC: {item.kpc}
                                 </span>
                                 
                                 <button className="h-7 w-9 flex items-center justify-center bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors shrink-0 text-blue-600 shadow-sm">
                                    <Camera size={16} />
                                 </button>

                                 <div className="flex rounded overflow-hidden border border-slate-300 h-7 shrink-0 shadow-sm">
                                    <button className={`px-3 text-xs font-bold transition-colors flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        合格
                                    </button>
                                    <div className="w-px bg-slate-300"></div>
                                    <button className={`px-3 text-xs font-bold transition-colors flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        不合格
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body Row */}
                        <div className="p-3">
                            <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-2">
                                <div className="text-slate-700 text-sm leading-relaxed">
                                    <span className="font-bold text-slate-900 mr-2">要求:</span>
                                    {item.standard}
                                </div>
                            </div>
                            
                            {item.isQuantitative && (
                                <div className="flex flex-col gap-1.5">
                                     <div className="flex gap-3 font-mono text-slate-600 text-[10px] font-bold">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">下限: {item.lowerLimit}</span>
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">上限: {item.upperLimit}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap mt-1">
                                        <span className="text-xs font-bold text-slate-700">测试值 (样本:{item.sampleCount}):</span>
                                        {Array.from({ length: item.sampleCount }).map((_, i) => (
                                            <input 
                                                key={i}
                                                type="text" 
                                                defaultValue={item.vals[i] || ''}
                                                placeholder={`#${i+1}`}
                                                className="border border-slate-300 rounded px-2 py-1.5 w-20 bg-white focus:border-[#0A2EF5] outline-none transition-all shadow-sm text-center font-bold text-sm text-slate-800"
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
          <div className="flex-1 overflow-auto bg-slate-50 p-4 font-mono text-sm leading-relaxed text-slate-800 border-t border-slate-200">
             {MOCK_LOGS.map(log => (
                <div key={log.id} className="mb-3 border-b border-slate-200 pb-2 last:border-0 flex items-start">
                   <span className="text-slate-400 mr-4 shrink-0">{log.timestamp}</span> 
                   <span className="font-bold mr-4 shrink-0" style={{ color: BRAND_BLUE }}>[{log.action}]</span> 
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
      
      {/* Modals */}
      <PreProductionCheck isOpen={isPreProductionOpen} onClose={() => setIsPreProductionOpen(false)} />
      <PDFViewer isOpen={isEsopOpen} onClose={() => setIsEsopOpen(false)} title="ESOP - AC-Cx.pdf" pdfUrl={PUBLIC_PDF_URL} />
      <PDFViewer isOpen={isDrawingOpen} onClose={() => setIsDrawingOpen(false)} title="图纸预览" pdfUrl={PUBLIC_PDF_URL} />

      {/* --- 1. LEFT SIDEBAR (Reflecting "Figure 1") --- */}
      <aside className="w-[22%] min-w-[300px] max-w-[350px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg relative">
         {/* Logo Header */}
         <div className="h-14 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: BRAND_BLUE }}>YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-6 w-auto" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
             
             {/* Section: Scan Info */}
             <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="w-1 h-4 rounded-full" style={{ backgroundColor: BRAND_BLUE }}></div>
                     <span className="font-bold text-slate-800 text-base">扫码信息</span>
                 </div>
                 
                 <div className="relative mb-2">
                     <input 
                        type="text" 
                        placeholder="扫码/SN"
                        className="w-full h-10 border border-slate-300 rounded-lg pl-3 pr-10 bg-white text-slate-800 font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm text-sm"
                     />
                     <button className="absolute right-1 top-1 h-8 w-8 bg-[#0A2EF5] text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <ScanLine size={16} />
                     </button>
                 </div>

                 <div className="grid grid-cols-3 gap-2 mb-2">
                     <button className="h-9 bg-[#0A2EF5] text-white rounded-md font-bold text-xs shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                        进站
                     </button>
                     <button className="h-9 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                        关键件
                     </button>
                     <button className="h-9 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                        出站
                     </button>
                 </div>

                 <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-start gap-2">
                     <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                     <span className="text-slate-500 text-xs font-medium">暂无异常提示信息...</span>
                 </div>
             </div>

             {/* Section: In-Process Work Order */}
             <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col flex-1 min-h-[300px]">
                 <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-amber-500"></div>
                        <span className="font-bold text-slate-800 text-base">在制工单</span>
                     </div>
                     <button className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors">
                        切换
                     </button>
                 </div>

                 <div className="grid grid-cols-3 gap-2 mb-3">
                     <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                         <div className="text-[10px] text-slate-500 font-medium mb-0.5">完成</div>
                         <div className="text-lg font-extrabold text-slate-800 leading-none">1</div>
                     </div>
                     <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                         <div className="text-[10px] text-slate-500 font-medium mb-0.5">异常</div>
                         <div className="text-base font-bold text-slate-800 leading-none">否</div>
                     </div>
                     <div className="bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                         <div className="text-[10px] text-slate-500 font-medium mb-0.5">点检</div>
                         <div className="text-base font-bold text-red-500 leading-none">否</div>
                     </div>
                 </div>

                 <div className="space-y-2">
                     {/* Active Card */}
                     <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A2EF5]"></div>
                         <div className="flex justify-between items-center">
                             <div className="space-y-1 text-[10px] pl-1">
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">工单号:</span>
                                     <span className="font-bold text-slate-800 text-xs">10907558</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">序列号:</span>
                                     <span className="font-bold text-slate-800 text-xs">251205171</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">SO:</span>
                                     <span className="font-bold text-slate-800 text-xs">10162896</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">机组:</span>
                                     <span className="font-bold text-slate-800 truncate max-w-[80px]" title="30RB202CPT254">30RB202...</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">型号:</span>
                                     <span className="font-bold text-slate-800">30RB202C</span>
                                 </div>
                             </div>
                             
                             {/* Progress Circle (Mock) */}
                             <div className="flex flex-col items-center gap-0.5">
                                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#0A2EF5] border-r-[#0A2EF5] flex items-center justify-center relative bg-slate-50">
                                    <div className="text-center leading-none">
                                        <span className="block text-base font-bold text-[#0A2EF5]">15</span>
                                        <span className="block text-[8px] text-slate-500 font-bold uppercase">min</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-800">12.12 PM</span>
                             </div>
                         </div>
                     </div>

                     {/* Second Card (Inactive) */}
                     <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer relative group opacity-70 hover:opacity-100">
                         <div className="flex justify-between items-center">
                             <div className="space-y-1 text-[10px]">
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">工单号:</span>
                                     <span className="font-bold text-slate-700 text-xs">10907559</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">序列号:</span>
                                     <span className="font-bold text-slate-700 text-xs">251205172</span>
                                 </div>
                                  <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">SO:</span>
                                     <span className="font-bold text-slate-700 text-xs">10162896</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">机组:</span>
                                     <span className="font-bold text-slate-700 truncate max-w-[80px]">30RB202...</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <span className="text-slate-400 font-medium w-14 text-right shrink-0">型号:</span>
                                     <span className="font-bold text-slate-700">30RB202C</span>
                                 </div>
                             </div>
                             
                             <div className="flex flex-col items-center gap-0.5">
                                <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-amber-400 flex items-center justify-center bg-white">
                                    <div className="text-center leading-none">
                                        <span className="block text-sm font-bold text-amber-500">30</span>
                                        <span className="block text-[6px] text-slate-400 font-bold uppercase">min</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-600">12.12 PM</span>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>

         </div>

         {/* Footer User Profile */}
         <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white font-bold bg-blue-100 text-blue-600">
                <UserCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-[10px] text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>

      </aside>

      {/* --- 2. RIGHT MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
          
          {/* Header (Top Navigation) */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-3">
                  <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                      <ChevronLeft size={24} />
                  </button>
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight">生产采集</h1>
              </div>

              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500">产线:</label>
                      <select className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[90px]">
                          <option>星火</option>
                      </select>
                  </div>
                  <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500">工序:</label>
                      <select className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[90px]">
                          <option>大件装配</option>
                      </select>
                  </div>
                  <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500">工位:</label>
                      <select className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[120px]">
                          <option>工位-大件装配</option>
                      </select>
                  </div>
                  <div className="w-px h-5 bg-slate-300 mx-1"></div>
                  <button onClick={onHome} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                      <Home size={20} />
                  </button>
              </div>
          </header>

          {/* Info Panel (Current Work Order) - Replaced with Card Style */}
          <div className="mx-4 mt-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden shrink-0 group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A2EF5]"></div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-[#0A2EF5] rounded-lg">
                            <Box size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-800">当前工单信息</div>
                            <div className="text-[10px] text-slate-500 font-medium">正在进行采集作业...</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        <Clock size={12} className="text-slate-400"/>
                        <span className="text-xs font-bold text-slate-600">入站时间: 1/12 9:01:56</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                    <div className="space-y-0.5 border-l-2 border-slate-100 pl-2">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><FileText size={10}/> 工单号</span>
                        <span className="text-sm font-bold text-slate-800 block">10907558</span>
                    </div>
                    <div className="space-y-0.5 border-l-2 border-slate-100 pl-2">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Hash size={10}/> 序列号</span>
                        <span className="text-sm font-bold text-slate-800 block">251205171</span>
                    </div>
                    <div className="space-y-0.5 border-l-2 border-slate-100 pl-2">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><Box size={10}/> 型号</span>
                        <span className="text-sm font-bold text-slate-800 block">30RB202C</span>
                    </div>
                    <div className="space-y-0.5 border-l-2 border-slate-100 pl-2">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><FileText size={10}/> SO</span>
                        <span className="text-sm font-bold text-slate-800 block">10162896/0010</span>
                    </div>
                </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-2 grid grid-cols-7 gap-2 shrink-0 bg-slate-50/50 border-b border-slate-200">
                <NavButton label="产前准备" icon={<ClipboardList size={20} />} onClick={() => setIsPreProductionOpen(true)} bgColor="bg-red-600 hover:bg-red-700" />
                <NavButton label="叫料" icon={<Megaphone size={20} />} />
                <NavButton label="误工记录" icon={<Timer size={20} />} />
                <NavButton label="在线维修" icon={<Wrench size={20} />} />
                <NavButton label="ESOP" icon={<BookOpen size={20} />} onClick={handleEsopClick} />
                <NavButton label="ECN变更" icon={<FileDiff size={20} />} bgColor="bg-red-600 hover:bg-red-700" />
                <NavButton label="物料接收" icon={<Inbox size={20} />} />
          </div>

          {/* Split Main Content */}
          <div className="flex-1 overflow-hidden p-3 flex gap-3">
              
              {/* Left Panel: Inspection & Logs */}
              <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   {/* Tabs Header */}
                   <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 pr-4 h-10 shrink-0">
                        <div className="flex h-full">
                            <button 
                                onClick={() => setActiveTab('INSPECTION')}
                                className={`px-6 h-full text-sm font-bold transition-all border-r border-slate-200 ${activeTab === 'INSPECTION' ? 'bg-white border-t-4 border-t-[#0A2EF5] text-[#0A2EF5]' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                检验项目
                            </button>
                            <button 
                                 onClick={() => setActiveTab('LOGS')}
                                 className={`px-6 h-full text-sm font-bold transition-all border-r border-slate-200 ${activeTab === 'LOGS' ? 'bg-white border-t-4 border-t-[#0A2EF5] text-[#0A2EF5]' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                采集日志
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2 w-48">
                             <span className="text-xs font-bold text-slate-600">进度: 60%</span>
                             <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full w-[60%]" style={{ backgroundColor: BRAND_BLUE }}></div>
                             </div>
                        </div>
                   </div>
                   
                   {renderTabContent()}
              </div>

              {/* Right Panel: Materials & Personnel */}
              <div className="w-[320px] flex flex-col gap-2 shrink-0 overflow-hidden">
                  
                  {/* Process Materials */}
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[50%]">
                      <div className="h-10 border-b border-slate-200 px-3 flex items-center justify-between shrink-0 bg-slate-50">
                          <div className="flex items-center">
                            <div className="w-1 h-4 bg-lime-600 mr-2 rounded-full"></div>
                            <span className="font-bold text-slate-800 text-sm">工序物料</span>
                          </div>
                          <div className="flex rounded overflow-hidden border border-slate-300 shadow-sm scale-90 origin-right">
                              <button className="px-3 py-0.5 text-xs font-bold bg-[#7db828] text-white">已扫</button>
                              <div className="w-px bg-slate-300"></div>
                              <button className="px-3 py-0.5 text-xs font-bold bg-white text-slate-500 hover:bg-slate-50">未扫</button>
                          </div>
                      </div>
                      <div className="flex-1 overflow-auto">
                          <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-sm">
                                  <tr>
                                      <th className="px-2 py-2 font-bold w-8 text-center">#</th>
                                      <th className="px-2 py-2 font-bold">物料编码</th>
                                      <th className="px-2 py-2 font-bold text-center w-12">数量</th>
                                      <th className="px-2 py-2 font-bold text-center w-12">关键</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {MOCK_BOM.map((item, index) => {
                                      const isScanned = index < 2;
                                      return (
                                          <tr key={item.id} className="hover:bg-slate-50">
                                              <td className="px-2 py-2 text-center text-slate-500 font-medium">{item.seq}</td>
                                              <td className={`px-2 py-2 font-bold ${isScanned ? 'text-[#7db828]' : 'text-slate-400'}`}>{item.materialCode}</td>
                                              <td className="px-2 py-2 text-center text-slate-900 font-bold">{item.qty}</td>
                                              <td className="px-2 py-2 text-center text-slate-500">{item.isKeyPart ? '是' : '-'}</td>
                                          </tr>
                                      );
                                  })}
                                  <tr className="hover:bg-slate-50">
                                      <td className="px-2 py-2 text-center text-slate-500">5</td>
                                      <td className="px-2 py-2 text-slate-400 font-bold">2007750347</td>
                                      <td className="px-2 py-2 text-center text-slate-900 font-bold">1</td>
                                      <td className="px-2 py-2 text-center text-slate-500">-</td>
                                  </tr>
                                  <tr className="hover:bg-slate-50">
                                      <td className="px-2 py-2 text-center text-slate-500">6</td>
                                      <td className="px-2 py-2 text-slate-400 font-bold">2007750348</td>
                                      <td className="px-2 py-2 text-center text-slate-900 font-bold">2</td>
                                      <td className="px-2 py-2 text-center text-slate-500">-</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Personnel */}
                  <div className="h-[220px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
                      <div className="h-10 border-b border-slate-200 px-3 flex items-center justify-between shrink-0 bg-slate-50">
                          <div className="flex items-center">
                              <div className="w-1 h-4 bg-lime-500 mr-2 rounded-full"></div>
                              <span className="font-bold text-slate-800 text-sm">人员上岗</span>
                          </div>
                          <div className="flex gap-1.5">
                                <button className="text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm transition-colors hover:opacity-90" style={{ backgroundColor: BRAND_BLUE }}>上岗</button>
                                <button className="bg-white border border-slate-300 text-slate-600 text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-50 transition-colors shadow-sm">离岗</button>
                            </div>
                      </div>
                      <div className="flex-1 overflow-auto p-2 space-y-2">
                            <PersonCard name="张三" duration="1H" time="2025/12/4 08:00" />
                            <PersonCard name="李四" duration="3H" time="2025/12/4 06:00" />
                            <PersonCard name="王五" duration="0.5H" time="2025/12/4 08:30" />
                      </div>
                  </div>

              </div>
          </div>
      </main>

    </div>
  );
};

// Sub-components

const NavButton: React.FC<{ 
    label: string; 
    icon: React.ReactNode; 
    bgColor?: string;
    onClick?: () => void;
}> = ({ label, icon, bgColor = "bg-[#0A2EF5] hover:bg-[#0621b5]", onClick }) => (
    <button 
        onClick={onClick}
        className={`${bgColor} text-white font-extrabold text-sm rounded-lg flex items-center justify-center gap-1.5 py-2 relative transition-all shadow-sm active:scale-95 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap overflow-hidden w-full`}
    >
        <span className="transform scale-100">{icon}</span>
        <span>{label}</span>
    </button>
);

const PersonCard: React.FC<{ name: string; duration: string; time: string }> = ({ name, duration, time }) => (
    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <UserCircle size={20} />
        </div>
        <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <div className="font-bold text-slate-800 text-sm">{name}</div>
                    <span className="bg-[#0A2EF5]/10 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: BRAND_BLUE }}>{duration}</span>
                </div>
                <div className="text-[10px] text-slate-500">{time}</div>
        </div>
    </div>
);
