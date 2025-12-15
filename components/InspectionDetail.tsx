import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  Save,
  Send,
  Download,
  Camera,
  UserCircle
} from 'lucide-react';
import { Task, InspectionResult } from '../types';
import { CarrierLogo } from './CarrierLogo';

interface InspectionDetailProps {
  task: Task;
  onBack: () => void;
}

const BRAND_BLUE = '#0A2EF5';

// Mock data updated to include quantitative items from the screenshot
const MOCK_CHECK_ITEMS = [
    { 
      id: 1, 
      name: '选项确认', 
      type: '定性', 
      kc: '否', 
      kpc: '是', 
      standard: '确认机组制造的选项与生产订单相符', 
      result: 'OK' as const,
      isQuantitative: false 
    },
    { 
      id: 2, 
      name: '底盘', 
      type: '定性', 
      kc: '否', 
      kpc: '是', 
      standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', 
      result: 'OK' as const,
      isQuantitative: false
    },
    { 
      id: 3, 
      name: '油分离器螺丝扭矩', 
      type: '定性', 
      kc: '否', 
      kpc: '是', 
      standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', 
      result: null,
      isQuantitative: false
    },
    { 
      id: 4, 
      name: '蒸发器与冷凝器连接', 
      type: '定量', 
      kc: '是', 
      kpc: '是', 
      standard: 'M30:1084±34NM', 
      result: 'NG' as const,
      isQuantitative: true,
      sampleCount: 3,
      lowerLimit: 1050,
      upperLimit: 1118,
      vals: ['1004', '1005', '1002']
    },
    { 
      id: 5, 
      name: '蒸发器筒身端', 
      type: '定量', 
      kc: '否', 
      kpc: '是', 
      standard: 'M20: [285±34 N.M.]', 
      result: 'NG' as const,
      isQuantitative: true,
      sampleCount: 1,
      lowerLimit: 251,
      upperLimit: 319,
      vals: ['200']
    },
];

export const InspectionDetail: React.FC<InspectionDetailProps> = ({ task, onBack }) => {
  const [items, setItems] = useState(MOCK_CHECK_ITEMS);

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800">

      {/* --- LEFT SIDEBAR (22%) --- */}
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         {/* 1. Sidebar Header (Brand) */}
         <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: BRAND_BLUE }}>YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-7 w-auto" />
            </div>
         </div>

         {/* 2. Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
            
            {/* Card 1: Inspection Info */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">检验信息</div>
                </div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">检验单号</label>
                        <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-700">
                            {task.id}
                        </div>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">物料编码</label>
                        <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-700">
                            {task.productCode}
                        </div>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">检验结果</label>
                        <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-700">
                             {task.result === InspectionResult.PASS ? 'OK' : task.result === InspectionResult.FAIL ? 'NG' : ''}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Work Order Notes */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">工单备注</div>
                </div>
                <div className="bg-yellow-50/50 border border-yellow-100 rounded p-3 text-xs leading-relaxed text-slate-700 font-medium overflow-y-auto max-h-[300px]">
                    {task.woNotes || '无工单备注信息...'}
                </div>
            </div>

             {/* Card 3: Tech Notes */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">技术备注</div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded p-3 text-xs leading-relaxed text-slate-700 font-medium overflow-y-auto max-h-[300px]">
                     {task.techNotes || '无技术备注信息...'}
                </div>
            </div>

         </div>

         {/* 3. Footer */}
         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#0A2EF5]/10 rounded-full flex items-center justify-center shadow-sm" style={{ color: BRAND_BLUE }}>
                <UserCircle size={22} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>

      </aside>
      
      {/* --- RIGHT MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">

        {/* 1. Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                  <ChevronLeft size={26} strokeWidth={2.5} />
              </button>
              <span className="text-slate-800 font-bold text-xl tracking-wide">
                  成品检验 – {task.sn}
              </span>
          </div>
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
              <Home size={24} />
          </button>
        </header>

        {/* 2. Top Stats & Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 py-0 shrink-0 flex items-end justify-between h-14">
            <div className="flex h-full">
                <button className="h-full border-b-4 border-[#0A2EF5] text-[#0A2EF5] font-bold px-4 text-base transition-colors">
                    检验项目
                </button>
            </div>
            <div className="flex items-center gap-3 pb-4">
                <span className="text-sm font-bold text-slate-600">进度: 60%</span>
                <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0A2EF5] w-[60%] rounded-full"></div>
                </div>
            </div>
        </div>

        {/* 3. Action Toolbar */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 flex gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-md border border-slate-300 transition-colors shadow-sm active:scale-95">
              <Download size={18} /> 读取设备参数
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-md border border-slate-300 transition-colors shadow-sm active:scale-95">
              <Save size={18} /> 保存
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-md border border-slate-300 transition-colors shadow-sm active:scale-95">
              <Send size={18} /> 提交
            </button>
        </div>

        {/* 4. List Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  
                  {/* Item Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0A2EF5] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                              {index + 1}
                          </div>
                          <span className="font-bold text-slate-800 text-lg truncate">{item.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                          {/* Badges */}
                          {/* Use different color for Quantitative vs Qualitative if desired, but here keeping clean */}
                          <span className={`px-3 py-1 text-white text-xs font-bold rounded shadow-sm ${item.type === '定量' ? 'bg-[#0984e3]' : 'bg-[#0984e3]'}`}>
                              {item.type}
                          </span>
                          <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded border border-slate-300 whitespace-nowrap">
                              KC:{item.kc} &nbsp; KPC: {item.kpc}
                          </span>
                          
                          {/* Camera */}
                          <button className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#0A2EF5] border border-blue-100 rounded hover:bg-blue-100 transition-colors ml-2 shadow-sm active:scale-95">
                              <Camera size={18} />
                          </button>

                          {/* Result Toggle */}
                          <div className="flex rounded-md overflow-hidden border border-slate-300 shadow-sm h-9">
                              <button className={`px-4 text-sm font-bold transition-all flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                                  合格
                              </button>
                              <div className="w-px bg-slate-300"></div>
                              <button className={`px-4 text-sm font-bold transition-all flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                                  不合格
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Item Body */}
                  <div className="p-4">
                      <div className="bg-slate-50 rounded border border-slate-100 p-3 text-slate-700 leading-relaxed">
                          <div className="mb-2">
                             <span className="font-bold text-slate-900 mr-2">要求:</span>
                             {item.standard}
                          </div>

                          {/* Quantitative Fields */}
                          {item.isQuantitative && (
                             <div className="mt-3 space-y-3">
                                 {/* Limits Row */}
                                 <div className="inline-flex gap-4 bg-white border border-slate-200 px-3 py-1.5 rounded text-sm font-mono font-bold text-slate-600 shadow-sm">
                                    <span>下限: {item.lowerLimit}</span>
                                    <span>上限: {item.upperLimit}</span>
                                 </div>
                                 
                                 {/* Inputs Row */}
                                 <div className="bg-white border border-slate-200 rounded p-3 flex items-center gap-3 shadow-sm">
                                     <span className="font-bold text-slate-700 text-sm">测试值 (样本:{item.sampleCount}):</span>
                                     <div className="flex gap-2 flex-wrap">
                                         {Array.from({length: item.sampleCount || 1}).map((_, idx) => (
                                             <input 
                                                key={idx}
                                                type="text"
                                                defaultValue={item.vals?.[idx] || ''}
                                                className="w-24 h-9 border border-slate-300 rounded text-center font-bold text-slate-800 focus:border-[#0A2EF5] outline-none shadow-sm transition-all focus:ring-2 focus:ring-blue-100"
                                             />
                                         ))}
                                     </div>
                                 </div>
                             </div>
                          )}
                      </div>
                  </div>

              </div>
            ))}
        </div>
      </main>
    </div>
  );
};