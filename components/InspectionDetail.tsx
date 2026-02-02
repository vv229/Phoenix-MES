
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
  ClipboardList,
  AlertCircle,
  Truck,
  MapPin,
  Barcode,
  ShoppingBag,
  Warehouse
} from 'lucide-react';
import { Task, InspectionResult, InspectionModule } from '../types';
import { CarrierLogo } from './CarrierLogo';
import { DefectSelectionModal, SelectedDefect } from './DefectSelectionModal';

interface InspectionDetailProps {
  task: Task;
  onBack: () => void;
  moduleTitle: string; 
  activeModule: InspectionModule;
}

const BRAND_BLUE = '#0A2EF5';

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
  defects?: SelectedDefect[]; 
}

// --- MOCK DATA ---

const FINAL_ITEMS: InspectionItemState[] = [
    { 
      id: 1, name: '包装确认', type: '定性', kc: '否', kpc: '是', 
      standard: '确认外包装无破损，标签清晰可辨', result: 'OK', 
      isQuantitative: false, allowPhoto: true, photos: [] 
    },
    { 
      id: 2, name: '关键尺寸 A', type: '定量', kc: '是', kpc: '否', 
      standard: '技术要求: 50.0 ± 0.5 mm', result: null, 
      isQuantitative: true, sampleCount: 5, lowerLimit: 49.5, upperLimit: 50.5, vals: ['', '', '', '', ''], 
      allowPhoto: true, photos: [] 
    },
];

const PROCESS_GROUPS = [
    { id: 'g1', name: '大件装配', status: 'PENDING', total: 5, completed: 0, items: [] },
    { id: 'g2', name: '管配', status: 'IN_PROGRESS', total: 3, completed: 3, items: [] },
];

export const InspectionDetail: React.FC<InspectionDetailProps> = ({ task, onBack, moduleTitle, activeModule }) => {
  const isIncoming = activeModule === 'INCOMING';
  const [activeTab, setActiveTab] = useState<'FINAL' | 'PROCESS'>('FINAL');
  const [selectedProcessGroup, setSelectedProcessGroup] = useState<string | null>(null);
  const [finalItems, setFinalItems] = useState<InspectionItemState[]>(FINAL_ITEMS);
  const [modalMode, setModalMode] = useState<'NONE' | 'CAMERA' | 'GALLERY'>('NONE');
  const [noteModal, setNoteModal] = useState<{ title: string; content: string } | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState({ info: true }); 
  const [defectModalState, setDefectModalState] = useState<{ isOpen: boolean; itemId: number | null }>({ isOpen: false, itemId: null });

  const currentItems = finalItems;
  const activeItem = currentItems.find(i => i.id === activeItemId);
  const defectTargetItem = currentItems.find(i => i.id === defectModalState.itemId);

  const handleBack = () => {
      if (activeTab === 'PROCESS' && selectedProcessGroup) {
          setSelectedProcessGroup(null);
      } else {
          onBack();
      }
  };

  const handleCameraIconClick = (item: InspectionItemState) => {
    setActiveItemId(item.id);
    setModalMode(item.photos.length > 0 ? 'GALLERY' : 'CAMERA');
  };

  const handleCapturePhoto = () => {
    if (!activeItemId) return;
    const newPhoto: Photo = { id: Date.now().toString(), url: '#', timestamp: new Date().toLocaleTimeString('en-US') };
    setFinalItems(prev => prev.map(item => item.id === activeItemId ? { ...item, photos: [...item.photos, newPhoto] } : item));
  };

  const handleResultChange = (id: number, result: 'OK' | 'NG') => {
      if (result === 'NG') {
          setDefectModalState({ isOpen: true, itemId: id });
      } else {
          setFinalItems(prev => prev.map(item => item.id === id ? { ...item, result: 'OK', defects: [] } : item));
      }
  };
  
  const handleDefectConfirm = (defects: SelectedDefect[]) => {
      if (defectModalState.itemId === null) return;
      setFinalItems(prev => prev.map(item => item.id === defectModalState.itemId ? { ...item, result: 'NG', defects: defects } : item));
  };

  const renderInfoRow = (label: string, value: string | React.ReactNode, icon: React.ReactNode) => (
      <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
          <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 break-words">{value || '-'}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
      </div>
  );

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800 relative">
      <DefectSelectionModal isOpen={defectModalState.isOpen} onClose={() => setDefectModalState({ isOpen: false, itemId: null })} onConfirm={handleDefectConfirm} itemName={defectTargetItem?.name} initialDefects={defectTargetItem?.defects} />

      {noteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-2/3 h-2/3 relative">
                 <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                     <span className="font-bold text-xl text-slate-800">{noteModal.title}</span>
                     <button onClick={() => setNoteModal(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
                 </div>
                 <div className="flex-1 overflow-auto p-8 text-base leading-loose text-slate-700 font-medium whitespace-pre-wrap">{noteModal.content}</div>
                 <div className="h-16 border-t border-slate-200 flex items-center justify-end px-6 bg-slate-50 shrink-0">
                      <button onClick={() => setNoteModal(null)} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">关闭</button>
                 </div>
             </div>
        </div>
      )}

      {modalMode === 'CAMERA' && (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center animate-in fade-in">
           <button onClick={() => setModalMode('NONE')} className="absolute top-6 right-6 p-2 bg-slate-800/50 rounded-full text-white"><X size={24} /></button>
           <div className="text-white text-center">摄像头模拟画面</div>
           <button onClick={handleCapturePhoto} className="mt-10 w-20 h-20 rounded-full bg-red-600 border-4 border-white"></button>
        </div>
      )}

      {modalMode === 'GALLERY' && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[70vh] rounded-lg overflow-hidden flex flex-col">
                <div className="h-14 border-b px-6 flex items-center justify-between font-bold text-slate-800">附件查看 - {activeItem.name} <X className="cursor-pointer" onClick={() => setModalMode('NONE')} /></div>
                <div className="flex-1 p-4 overflow-auto">
                    {activeItem.photos.map((p, i) => (
                        <div key={p.id} className="py-2 border-b flex justify-between">
                            <span>照片 #{i+1} - {p.timestamp}</span>
                            <button onClick={() => setModalMode('NONE')} className="text-blue-600 font-bold">查看</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-[22%] min-w-[280px] max-w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg">
         <div className="h-16 flex items-center px-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight" style={{ color: BRAND_BLUE }}>YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-7 w-auto" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 no-scrollbar">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center mb-3">
                    <div className="w-1.5 h-5 bg-slate-800 mr-2.5 rounded-full"></div>
                    <div className="text-base font-bold text-slate-800">{isIncoming ? '来料单信息' : '检验信息'}</div>
                </div>
                
                <div className="space-y-1">
                    {isIncoming ? (
                        <>
                            {renderInfoRow('ASN编号', task.asnNo, <Barcode size={18}/>)}
                            {renderInfoRow('ASN行号', task.lineNo, <Layers size={18}/>)}
                            {renderInfoRow('供应商', task.supplierName, <Truck size={18}/>)}
                            {renderInfoRow('采购订单', task.poNo, <ShoppingBag size={18}/>)}
                            {renderInfoRow('交货数量', <span className="text-blue-600 font-black">{task.deliveryQty} {task.unit}</span>, <Activity size={18}/>)}
                            {renderInfoRow('库存地点', task.storageLocation, <Warehouse size={18}/>)}
                            {renderInfoRow('送货地址', task.deliveryAddr, <MapPin size={18}/>)}
                        </>
                    ) : (
                        <>
                            {renderInfoRow('工单号', task.workOrder, <FileText size={18}/>)}
                            {renderInfoRow('序列号', task.sn, <Tag size={18}/>)}
                            {renderInfoRow('机型', task.unitModel, <Box size={18}/>)}
                            {renderInfoRow('物料名称', task.productName, <Layers size={18}/>)}
                        </>
                    )}
                    {renderInfoRow('物料编码', task.productCode, <Barcode size={18}/>)}
                </div>
            </div>

            {!isIncoming && (
                <>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-32 overflow-hidden relative">
                        <div className="font-bold text-slate-800 mb-2">工单备注</div>
                        <div className="text-xs text-slate-500">{task.woNotes || '无'}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-32 overflow-hidden relative">
                        <div className="font-bold text-slate-800 mb-2">技术备注</div>
                        <div className="text-xs text-slate-500">{task.techNotes || '无'}</div>
                    </div>
                </>
            )}
         </div>

         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#0A2EF5]/10 rounded-full flex items-center justify-center" style={{ color: BRAND_BLUE }}><UserCircle size={22} /></div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-xs text-slate-500 truncate">质量管理部 - IQC/FQC组</div>
            </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
              <span className="text-slate-800 font-bold text-2xl tracking-wide">{moduleTitle} – {isIncoming ? task.asnNo : task.sn}</span>
          </div>
          <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={24} /></button>
        </header>

        <div className="bg-white border-b border-slate-200 px-6 py-0 shrink-0 flex items-end justify-between h-14">
            <div className="flex h-full gap-8">
                <button 
                    onClick={() => { setActiveTab('FINAL'); }}
                    className={`h-full border-b-4 font-bold px-1 text-base transition-colors ${activeTab === 'FINAL' ? 'border-[#0A2EF5] text-[#0A2EF5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    检验项目
                </button>
                {!isIncoming && (
                    <button 
                        onClick={() => { setActiveTab('PROCESS'); }}
                        className={`h-full border-b-4 font-bold px-1 text-base transition-colors ${activeTab === 'PROCESS' ? 'border-[#0A2EF5] text-[#0A2EF5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        过程检验项目
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3 pb-4">
                <span className="text-sm font-bold text-slate-600">检验完成度: 0%</span>
                <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0A2EF5] w-[0%] rounded-full"></div>
                </div>
            </div>
        </div>

        <div className="bg-white px-6 py-3 border-b border-slate-200 flex gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold hover:bg-slate-100 active:scale-95"><Download size={18} /> 读取设备参数</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold hover:bg-slate-100 active:scale-95"><Save size={18} /> 保存</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0A2EF5] text-white rounded text-sm font-bold hover:bg-blue-700 active:scale-95 shadow-md"><Send size={18} /> 提交检验结果</button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
            {activeTab === 'FINAL' ? (
                currentItems.map((item, index) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0A2EF5] text-white flex items-center justify-center font-bold text-lg">{index + 1}</div>
                                <span className="font-bold text-slate-800 text-lg">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button disabled={!item.allowPhoto} onClick={() => handleCameraIconClick(item)} className={`w-9 h-9 flex items-center justify-center border rounded relative shadow-sm ${item.allowPhoto ? 'bg-blue-50 text-[#0A2EF5] border-blue-100 hover:bg-blue-100' : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'}`}>
                                    <Camera size={18} />
                                    {item.photos.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white font-bold">{item.photos.length}</span>}
                                </button>
                                <div className="flex rounded-md overflow-hidden border border-slate-300 h-9">
                                    <button onClick={() => handleResultChange(item.id, 'OK')} className={`px-4 text-sm font-bold transition-all ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>合格</button>
                                    <div className="w-px bg-slate-300"></div>
                                    <button onClick={() => handleResultChange(item.id, 'NG')} className={`px-4 text-sm font-bold transition-all ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>不合格</button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="text-slate-700 text-base"><span className="font-bold text-slate-900 mr-2">技术要求:</span>{item.standard}</div>
                            {item.isQuantitative && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-6">
                                    <div className="text-sm font-bold text-slate-500">实测值:</div>
                                    <div className="flex gap-3">
                                        {Array.from({length: item.sampleCount || 1}).map((_, idx) => (
                                            <input key={idx} type="text" className="w-24 h-10 border border-slate-300 rounded text-center font-bold text-lg focus:border-blue-500 outline-none" />
                                        ))}
                                    </div>
                                    <div className="text-xs text-slate-400">范围: {item.lowerLimit} ~ {item.upperLimit}</div>
                                </div>
                            )}
                            {item.defects && item.defects.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {item.defects.map(d => <span key={d.id} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">{d.name} x{d.count}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-20 text-center text-slate-400">过程检验视图已加载...</div>
            )}
        </div>
      </main>
    </div>
  );
};
