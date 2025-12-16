import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Home,
  Save,
  Send,
  Download,
  Camera,
  UserCircle,
  X,
  Eye,
  Trash2,
  MoreHorizontal,
  FileText,
  Tag,
  Box,
  Activity,
  Layers,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Task, InspectionResult } from '../types';
import { CarrierLogo } from './CarrierLogo';

interface InspectionDetailProps {
  task: Task;
  onBack: () => void;
}

const BRAND_BLUE = '#0A2EF5';

// Define Photo Interface
interface Photo {
  id: string;
  url: string; 
  timestamp: string;
}

interface InspectionItemState {
  id: number;
  name: string;
  type: string;
  kc: string;
  kpc: string;
  standard: string;
  result: 'OK' | 'NG' | null;
  isQuantitative: boolean;
  sampleCount?: number;
  lowerLimit?: number;
  upperLimit?: number;
  vals?: string[];
  allowPhoto: boolean; 
  photos: Photo[];     
}

// --- MOCK DATA ---

// 1. Final Inspection Items (Existing)
const FINAL_ITEMS: InspectionItemState[] = [
    { 
      id: 1, name: '选项确认', type: '定性', kc: '否', kpc: '是', 
      standard: '确认机组制造的选项与生产订单相符', result: 'OK', 
      isQuantitative: false, allowPhoto: true, photos: [] 
    },
    { 
      id: 2, name: '底盘', type: '定性', kc: '否', kpc: '是', 
      standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', result: 'OK', 
      isQuantitative: false, allowPhoto: false, photos: []
    },
    { 
      id: 3, name: '油分离器螺丝扭矩', type: '定性', kc: '否', kpc: '是', 
      standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', result: null, 
      isQuantitative: false, allowPhoto: true, photos: []
    },
    { 
      id: 4, name: '蒸发器与冷凝器连接', type: '定量', kc: '是', kpc: '是', 
      standard: 'M30:1084±34NM', result: 'NG', 
      isQuantitative: true, sampleCount: 3, lowerLimit: 1050, upperLimit: 1118, vals: ['1004', '1005', '1002'], 
      allowPhoto: true, photos: [{ id: 'p1', url: '#', timestamp: '5:12:12 PM' }, { id: 'p2', url: '#', timestamp: '5:12:13 PM' }] 
    },
    { 
      id: 5, name: '蒸发器筒身端', type: '定量', kc: '否', kpc: '是', 
      standard: 'M20: [285±34 N.M.]', result: 'NG', 
      isQuantitative: true, sampleCount: 1, lowerLimit: 251, upperLimit: 319, vals: ['200'], 
      allowPhoto: true, photos: []
    },
];

// 2. Process Inspection Groups (New)
const PROCESS_GROUPS = [
    { id: 'g1', name: '机架外观', status: 'PENDING', total: 5, completed: 0, items: [] },
    { id: 'g2', name: '电气柜外观', status: 'IN_PROGRESS', total: 3, completed: 3, items: [] },
    { id: 'g3', name: '供收料模块外观', status: 'PENDING', total: 0, completed: 0, items: [] },
    { id: 'g4', name: '尺寸项目', status: 'PENDING', total: 3, completed: 0, items: [] },
];

// 3. Mock Items for a Process Group (Drill Down)
const PROCESS_ITEMS_DETAIL: InspectionItemState[] = [
    { 
      id: 101, name: '机架水平度', type: '定量', kc: '是', kpc: '是', 
      standard: '机架整体水平误差 < 2mm', result: null, 
      isQuantitative: true, sampleCount: 1, lowerLimit: 0, upperLimit: 2, vals: [''], 
      allowPhoto: true, photos: [] 
    },
    { 
      id: 102, name: '焊接点检查', type: '定性', kc: '否', kpc: '是', 
      standard: '焊缝平整，无气孔、夹渣', result: null, 
      isQuantitative: false, allowPhoto: true, photos: [] 
    },
    { 
      id: 103, name: '漆面检查', type: '定性', kc: '否', kpc: '否', 
      standard: '漆面光滑，无流挂、橘皮', result: null, 
      isQuantitative: false, allowPhoto: true, photos: [] 
    },
];


export const InspectionDetail: React.FC<InspectionDetailProps> = ({ task, onBack }) => {
  // Tabs & Navigation State
  const [activeTab, setActiveTab] = useState<'FINAL' | 'PROCESS'>('FINAL');
  const [selectedProcessGroup, setSelectedProcessGroup] = useState<string | null>(null);

  // Data State
  const [finalItems, setFinalItems] = useState<InspectionItemState[]>(FINAL_ITEMS);
  const [processItems, setProcessItems] = useState<InspectionItemState[]>(PROCESS_ITEMS_DETAIL);

  // UI State
  const [modalMode, setModalMode] = useState<'NONE' | 'CAMERA' | 'GALLERY'>('NONE');
  const [noteModal, setNoteModal] = useState<{ title: string; content: string } | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState({ info: true }); // Removed wo and tech from expand state

  // Helpers
  const currentItems = activeTab === 'FINAL' ? finalItems : processItems;
  const activeItem = currentItems.find(i => i.id === activeItemId);

  // --- Handlers ---

  const handleBack = () => {
      if (activeTab === 'PROCESS' && selectedProcessGroup) {
          setSelectedProcessGroup(null); // Go back to group list
      } else {
          onBack(); // Go back to home
      }
  };

  const toggleInfoCard = () => {
      setExpandedCards(prev => ({ ...prev, info: !prev.info }));
  };

  const handleCameraIconClick = (item: InspectionItemState) => {
    setActiveItemId(item.id);
    if (item.photos.length > 0) {
      setModalMode('GALLERY');
    } else {
      setModalMode('CAMERA');
    }
  };

  const handleCapturePhoto = () => {
    if (!activeItemId) return;

    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: '#', 
      timestamp: new Date().toLocaleTimeString('en-US')
    };

    const updateFunc = activeTab === 'FINAL' ? setFinalItems : setProcessItems;
    updateFunc(prev => prev.map(item => {
      if (item.id === activeItemId) {
        return { ...item, photos: [...item.photos, newPhoto] };
      }
      return item;
    }));
  };

  const handleDeletePhoto = (photoId: string) => {
    const updateFunc = activeTab === 'FINAL' ? setFinalItems : setProcessItems;
    updateFunc(prev => prev.map(item => {
      if (item.id === activeItemId) {
        return { ...item, photos: item.photos.filter(p => p.id !== photoId) };
      }
      return item;
    }));
  };

  const handleSwitchToCamera = () => {
    setModalMode('CAMERA');
  };

  const closeModal = () => {
    setModalMode('NONE');
    setActiveItemId(null);
  };

  // --- Render Components ---

  const renderInfoRow = (label: string, value: string | React.ReactNode, icon: React.ReactNode) => (
      <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
          <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 break-words">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
      </div>
  );

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800 relative">
      
      {/* --- NOTE DETAILS MODAL (2/3 Screen, Centered) --- */}
      {noteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-2/3 h-2/3 relative animate-in zoom-in-95 duration-200">
                 {/* Header */}
                 <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                     <span className="font-bold text-xl text-slate-800">{noteModal.title}</span>
                     <button onClick={() => setNoteModal(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                         <X size={24} />
                     </button>
                 </div>
                 {/* Content */}
                 <div className="flex-1 overflow-auto p-8 text-base leading-loose text-slate-700 font-medium whitespace-pre-wrap">
                     {noteModal.content}
                 </div>
                 {/* Footer */}
                 <div className="h-16 border-t border-slate-200 flex items-center justify-end px-6 bg-slate-50 shrink-0">
                      <button onClick={() => setNoteModal(null)} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-sm">
                          关闭
                      </button>
                 </div>
             </div>
        </div>
      )}

      {/* --- MODALS (Camera/Gallery) --- */}
      {modalMode === 'CAMERA' && (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center animate-in fade-in duration-200">
           <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-slate-800/50 rounded-full text-white hover:bg-slate-700">
              <X size={24} />
           </button>
           <div className="flex flex-col items-center justify-center text-slate-400 gap-4 mb-20">
              <Camera size={64} className="opacity-50" />
              <div className="text-xl font-bold text-white">摄像头画面模拟</div>
              <div className="text-sm">(真实摄像头调用已禁用以避免权限错误)</div>
           </div>
           <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <button onClick={handleCapturePhoto} className="w-20 h-20 rounded-full bg-red-600 border-4 border-white shadow-lg active:scale-95 transition-transform flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-red-400/50"></div>
              </button>
              <div className="text-slate-400 text-sm font-medium">点击红色按钮拍照，可连续拍摄</div>
              <button onClick={closeModal} className="mt-4 px-6 py-2 bg-slate-700 text-white rounded-full hover:bg-slate-600">关闭</button>
           </div>
        </div>
      )}

      {modalMode === 'GALLERY' && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                    <span className="font-bold text-lg text-slate-800">附件查看 - {activeItem.name}</span>
                    <button onClick={closeModal} className="text-slate-500 hover:text-slate-800"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-sm sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="py-4 px-6 font-medium w-20">序号</th>
                                <th className="py-4 px-6 font-medium">检验项目</th>
                                <th className="py-4 px-6 font-medium">附件地址 (缩略图)</th>
                                <th className="py-4 px-6 font-medium text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {activeItem.photos.length > 0 ? (
                              activeItem.photos.map((photo, idx) => (
                                <tr key={photo.id} className="hover:bg-slate-50 group">
                                    <td className="py-4 px-6 text-slate-500">{idx + 1}</td>
                                    <td className="py-4 px-6 text-slate-700 font-medium">{activeItem.name}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-12 bg-slate-200 rounded border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-tighter">Mock Photo</div>
                                            <span className="text-slate-400 font-mono">{photo.timestamp}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <button className="text-blue-600 font-medium hover:underline flex items-center gap-1"><Eye size={16} /> 预览</button>
                                            <button onClick={() => handleDeletePhoto(photo.id)} className="text-red-400 font-medium hover:text-red-600 hover:underline flex items-center gap-1"><Trash2 size={16} /> 删除</button>
                                        </div>
                                    </td>
                                </tr>
                              ))
                            ) : (
                                <tr><td colSpan={4} className="py-12 text-center text-slate-400">暂无照片，请点击下方按钮拍照</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={handleSwitchToCamera} className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-500 font-bold rounded hover:bg-red-50 transition-colors shadow-sm active:scale-95">继续拍照</button>
                    <button onClick={closeModal} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors shadow-sm active:scale-95">关闭</button>
                </div>
            </div>
        </div>
      )}


      {/* --- LEFT SIDEBAR (22%) --- */}
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         
         <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: BRAND_BLUE }}>YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-7 w-auto" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
            
            {/* Card 1: Inspection Info (Expandable) */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative group">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                        <div className="text-base font-bold text-slate-800">检验信息</div>
                    </div>
                    <button onClick={toggleInfoCard} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                
                <div className={`space-y-1 transition-all duration-300 ease-in-out ${expandedCards.info ? 'max-h-[500px]' : 'max-h-32 overflow-hidden'}`}>
                    {renderInfoRow('工单号', task.workOrder, <FileText size={18}/>)}
                    {renderInfoRow('序列号', task.sn, <Tag size={18}/>)}
                    {renderInfoRow('机型', task.unitModel, <Box size={18}/>)}
                    {renderInfoRow('物料名称', task.productName, <Layers size={18}/>)}
                    {renderInfoRow('检验状态', 
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${task.result === InspectionResult.PASS ? 'bg-green-500' : task.result === InspectionResult.FAIL ? 'bg-red-500' : 'bg-slate-400'}`}>
                            {task.result === InspectionResult.PASS ? '合格' : task.result === InspectionResult.FAIL ? '不合格' : '待定'}
                        </span>, 
                        <Activity size={18}/>
                    )}
                </div>
                {!expandedCards.info && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg"></div>
                )}
            </div>

            {/* Card 2: Work Order Notes (Popup Modal) */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col relative">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                        <div className="text-base font-bold text-slate-800">工单备注</div>
                    </div>
                    <button 
                        onClick={() => setNoteModal({ title: '工单备注', content: task.woNotes || '无工单备注信息...' })}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className="bg-yellow-50/50 border border-yellow-100 rounded p-3 text-xs leading-relaxed text-slate-700 font-medium h-24 overflow-hidden relative">
                    {task.woNotes || '无工单备注信息...'}
                    {/* Gradient Overlay for truncated preview */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-yellow-50 to-transparent pointer-events-none rounded-b"></div>
                </div>
            </div>

             {/* Card 3: Tech Notes (Popup Modal) */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col relative">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                        <div className="text-base font-bold text-slate-800">技术备注</div>
                    </div>
                     <button 
                        onClick={() => setNoteModal({ title: '技术备注', content: task.techNotes || '无技术备注信息...' })}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded p-3 text-xs leading-relaxed text-slate-700 font-medium h-24 overflow-hidden relative">
                     {task.techNotes || '无技术备注信息...'}
                     {/* Gradient Overlay for truncated preview */}
                     <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none rounded-b"></div>
                </div>
            </div>

         </div>

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
              <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                  <ChevronLeft size={26} strokeWidth={2.5} />
              </button>
              {/* Updated font size to text-2xl */}
              <span className="text-slate-800 font-bold text-2xl tracking-wide">
                  成品检验 – {task.sn}
              </span>
          </div>
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
              <Home size={24} />
          </button>
        </header>

        {/* 2. Top Stats & Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 py-0 shrink-0 flex items-end justify-between h-14">
            <div className="flex h-full gap-8">
                <button 
                    onClick={() => { setActiveTab('FINAL'); setSelectedProcessGroup(null); }}
                    className={`h-full border-b-4 font-bold px-1 text-base transition-colors ${activeTab === 'FINAL' ? 'border-[#0A2EF5] text-[#0A2EF5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    检验项目
                </button>
                <button 
                     onClick={() => { setActiveTab('PROCESS'); setSelectedProcessGroup(null); }}
                    className={`h-full border-b-4 font-bold px-1 text-base transition-colors ${activeTab === 'PROCESS' ? 'border-[#0A2EF5] text-[#0A2EF5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    过程检验项目
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

        {/* 4. List Content (Conditional) */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
            
            {/* VIEW A: Process Groups List (Figure 2) */}
            {activeTab === 'PROCESS' && !selectedProcessGroup && (
                <div className="grid grid-cols-1 gap-4">
                    {PROCESS_GROUPS.map(group => (
                        <div 
                            key={group.id} 
                            onClick={() => setSelectedProcessGroup(group.id)}
                            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${group.total === 0 ? 'bg-slate-300' : 'bg-blue-600'}`}>
                                    <ClipboardList size={24} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-slate-800 mb-1">{group.name}</div>
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <span>共 {group.total} 项</span>
                                        {group.total > 0 && <span className="w-1 h-1 rounded-full bg-slate-300"></span>}
                                        {group.total > 0 && <span>已完成 {group.completed} 项</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {group.status === 'IN_PROGRESS' && (
                                    <div className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">进行中</div>
                                )}
                                {group.total > 0 ? (
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-800">{Math.round((group.completed/group.total)*100)}%</div>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-sm font-medium">未开始</span>
                                )}
                                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW B: Inspection Items (Final or Process Details) */}
            {(activeTab === 'FINAL' || selectedProcessGroup) && (
                <>
                {activeTab === 'PROCESS' && selectedProcessGroup && (
                    <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm">
                        <button onClick={() => setSelectedProcessGroup(null)} className="hover:text-blue-600 hover:underline">过程检验项目</button>
                        <ChevronRight size={14} />
                        <span className="font-bold text-slate-800">{PROCESS_GROUPS.find(g => g.id === selectedProcessGroup)?.name}</span>
                    </div>
                )}
                
                {currentItems.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0A2EF5] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-bold text-slate-800 text-lg truncate">{item.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-3 py-1 bg-[#0984e3] text-white text-xs font-bold rounded shadow-sm`}>{item.type}</span>
                                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded border border-slate-300 whitespace-nowrap">
                                    KC:{item.kc} &nbsp; KPC: {item.kpc}
                                </span>
                                
                                <button 
                                    disabled={!item.allowPhoto}
                                    onClick={() => handleCameraIconClick(item)}
                                    className={`
                                    w-9 h-9 flex items-center justify-center border rounded transition-all ml-2 shadow-sm relative group
                                    ${item.allowPhoto 
                                        ? 'bg-blue-50 text-[#0A2EF5] border-blue-100 hover:bg-blue-100 active:scale-95 cursor-pointer' 
                                        : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                    }
                                    `}
                                >
                                    <Camera size={18} />
                                    {item.photos.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm font-bold">
                                        {item.photos.length}
                                        </span>
                                    )}
                                </button>

                                <div className="flex rounded-md overflow-hidden border border-slate-300 shadow-sm h-9">
                                    <button className={`px-4 text-sm font-bold transition-all flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>合格</button>
                                    <div className="w-px bg-slate-300"></div>
                                    <button className={`px-4 text-sm font-bold transition-all flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>不合格</button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="space-y-4">
                                <div className="text-slate-700 leading-relaxed">
                                    <span className="font-bold text-slate-900 mr-2 text-base">要求:</span>
                                    <span className="text-base">{item.standard}</span>
                                </div>

                                {item.isQuantitative && (
                                    <div className="space-y-3">
                                        <div className="inline-flex gap-4 border border-slate-200 rounded px-3 py-1.5 text-sm font-bold text-slate-600 bg-slate-50">
                                            <span>下限: <span className="text-slate-900 font-mono">{item.lowerLimit}</span></span>
                                            <span>上限: <span className="text-slate-900 font-mono">{item.upperLimit}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <span className="font-bold text-slate-700 text-sm shrink-0">测试值 (样本:{item.sampleCount}):</span>
                                            <div className="flex gap-3 flex-wrap">
                                                {Array.from({length: item.sampleCount || 1}).map((_, idx) => (
                                                    <input 
                                                        key={idx}
                                                        type="text"
                                                        defaultValue={item.vals?.[idx] || ''}
                                                        className="w-24 h-10 border border-slate-300 rounded text-center font-bold text-slate-800 focus:border-[#0A2EF5] outline-none shadow-sm transition-all focus:ring-2 focus:ring-blue-100 text-lg bg-white"
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
                </>
            )}
        </div>
      </main>
    </div>
  );
};