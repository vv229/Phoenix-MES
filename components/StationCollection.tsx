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
  X,
  Eye,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Tag,
  Info
} from 'lucide-react';
import { MOCK_BOM } from '../constants';
import { PreProductionCheck } from './PreProductionCheck';
import { PDFViewer } from './PDFViewer';
import { CarrierLogo } from './CarrierLogo';
import { DefectSelectionModal, SelectedDefect } from './DefectSelectionModal';

interface StationCollectionProps {
  onBack: () => void;
  onHome: () => void;
}

const BRAND_BLUE = '#0A2EF5';

interface Photo {
  id: string;
  url: string; 
  timestamp: string;
}

interface CollectionItem {
  id: number;
  name: string;
  standard: string;
  vals: string[];
  result: 'OK' | 'NG' | null;
  isQuantitative: boolean;
  sampleCount: number;
  lowerLimit?: number | string;
  upperLimit?: number | string;
  kc: string;
  kpc: string;
  isPhotoRequired: boolean;
  photos: Photo[];
  defects: SelectedDefect[];
}

const INITIAL_ITEMS: CollectionItem[] = [
    { id: 1, name: '选项确认', standard: '确认机组制造的选项与生产订单相符', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是', isPhotoRequired: true, photos: [], defects: [] },
    { id: 2, name: '底盘', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: 'OK', isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是', isPhotoRequired: false, photos: [], defects: [] },
    { id: 3, name: '油分离器螺丝扭矩', standard: '各尺寸符合图纸要求，无缺陷。底盘连接按工艺规程，力矩30NM。', vals: [''], result: null, isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是', isPhotoRequired: true, photos: [], defects: [] },
    { id: 4, name: '蒸发器与冷凝器连接', standard: 'M30:1084±34NM', vals: ['1004', '1005', '1002'], result: 'NG', isQuantitative: true, sampleCount: 3, lowerLimit: 1050, upperLimit: 1118, kc: '是', kpc: '是', isPhotoRequired: true, photos: [], defects: [{ id: 'M001', code: 'M001', name: '螺钉松动', category: '装配类', count: 1 }] },
    { id: 5, name: '蒸发器筒身端', standard: 'M20: [285±34 N.M.]', vals: ['200'], result: 'NG', isQuantitative: true, sampleCount: 1, lowerLimit: 251, upperLimit: 319, kc: '否', kpc: '是', isPhotoRequired: true, photos: [], defects: [] },
    { id: 6, name: '压缩机准备', standard: '确认压缩机的SO与机组的SO一致', vals: [''], result: null, isQuantitative: false, sampleCount: 1, kc: '否', kpc: '是', isPhotoRequired: true, photos: [], defects: [] },
];

const MOCK_WOS = [
    { id: '10907558', sn: '251205171', model: '30RB202CPT', so: '10165731', lineNo: '10', mins: '15', time: '12:12 PM', progress: 0.75 },
    { id: '10907559', sn: '251205172', model: '30RB202CPT', so: '10165732', lineNo: '10', mins: '08', time: '12:45 PM', progress: 0.4 },
    { id: '10907560', sn: '251205173', model: '30KAV0800A', so: '20013945', lineNo: '20', mins: '22', time: '01:15 PM', progress: 0.6 },
    { id: '10907561', sn: '251205174', model: '19DV-800-45', so: '20014001', lineNo: '10', mins: '05', time: '01:40 PM', progress: 0.2 },
];

export const StationCollection: React.FC<StationCollectionProps> = ({ onBack, onHome }) => {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(INITIAL_ITEMS);
  const [activeWOId, setActiveWOId] = useState('10907558');
  const [isPreProductionOpen, setIsPreProductionOpen] = useState(false);
  const [isEsopOpen, setIsEsopOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'NONE' | 'CAMERA' | 'GALLERY'>('NONE');
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [defectModalState, setDefectModalState] = useState<{ isOpen: boolean; itemId: number | null }>({ isOpen: false, itemId: null });

  const activeItemForPhoto = collectionItems.find(i => i.id === activeItemId);
  const defectTargetItem = collectionItems.find(i => i.id === defectModalState.itemId);
  const PUBLIC_PDF_URL = "https://www.carrier.com/carrier/en/worldwide/media/Carrier-Infinity-Air-Purifier-Coronavirus-Infographic-10-15-2020_tcm933-98829.pdf";

  const handleResultChange = (id: number, result: 'OK' | 'NG') => {
      if (result === 'NG') {
          setDefectModalState({ isOpen: true, itemId: id });
      } else {
          setCollectionItems(prev => prev.map(item => {
              if (item.id === id) return { ...item, result: 'OK', defects: [] };
              return item;
          }));
      }
  };

  const handleDefectConfirm = (defects: SelectedDefect[]) => {
      if (defectModalState.itemId === null) return;
      setCollectionItems(prev => prev.map(item => {
          if (item.id === defectModalState.itemId) return { ...item, result: 'NG', defects: defects };
          return item;
      }));
  };

  const handleCameraClick = (item: CollectionItem) => {
      setActiveItemId(item.id);
      setModalMode(item.photos.length > 0 ? 'GALLERY' : 'CAMERA');
  };

  const closeModal = () => {
      setModalMode('NONE');
      setActiveItemId(null);
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex font-sans overflow-hidden text-slate-800">
      <PreProductionCheck isOpen={isPreProductionOpen} onClose={() => setIsPreProductionOpen(false)} />
      <PDFViewer isOpen={isEsopOpen} onClose={() => setIsEsopOpen(false)} title="作业指导书 - AC-Cx.pdf" pdfUrl={PUBLIC_PDF_URL} />
      
      <DefectSelectionModal 
          isOpen={defectModalState.isOpen}
          onClose={() => setDefectModalState({ isOpen: false, itemId: null })}
          onConfirm={handleDefectConfirm}
          itemName={defectTargetItem?.name}
          initialDefects={defectTargetItem?.defects}
      />

      {isMaterialModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
                  <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                      <span className="font-extrabold text-lg text-slate-800">工序物料清单 (全字段展示)</span>
                      <button onClick={() => setIsMaterialModalOpen(false)} className="text-slate-500 hover:text-slate-800"><X size={24} /></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4">
                      <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0">
                              <tr>
                                  <th className="px-4 py-3 border">项次</th>
                                  <th className="px-4 py-3 border">物料编码</th>
                                  <th className="px-4 py-3 border">计划数量</th>
                                  <th className="px-4 py-3 border">是否关键件</th>
                                  <th className="px-4 py-3 border">物料批次</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                              {MOCK_BOM.map(item => (
                                  <tr key={item.id} className="hover:bg-slate-50">
                                      <td className="px-4 py-3 border text-center">{item.seq}</td>
                                      <td className="px-4 py-3 border font-mono font-bold">{item.materialCode}</td>
                                      <td className="px-4 py-3 border font-bold text-center">{item.qty}</td>
                                      <td className="px-4 py-3 border text-center">
                                          {item.isKeyPart ? <span className="text-orange-600 font-bold">关键件</span> : '-'}
                                      </td>
                                      <td className="px-4 py-3 border text-slate-400">BATCH-202512</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* --- Sidebar (22%) --- */}
      <aside className="w-[22%] min-w-[280px] max-w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-lg relative">
         <div className="h-14 flex items-center px-4 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center gap-3 w-full">
               <span className="font-bold text-xl tracking-tight" style={{ color: BRAND_BLUE }}>YLC-MES</span>
               <div className="flex-1"></div>
               <CarrierLogo className="h-6 w-auto" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
             {/* 1. Scan Card */}
             <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="w-1 h-4 rounded-full" style={{ backgroundColor: BRAND_BLUE }}></div>
                     <span className="font-bold text-slate-800 text-base">扫码信息</span>
                 </div>
                 <div className="relative mb-2">
                     <input type="text" placeholder="扫码/SN" className="w-full h-10 border border-slate-300 rounded-lg pl-3 pr-10 bg-white text-slate-800 font-bold focus:border-blue-500 outline-none text-sm" />
                     <button className="absolute right-1 top-1 h-8 w-8 bg-[#0A2EF5] text-white rounded-md flex items-center justify-center"><ScanLine size={16} /></button>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                     <button className="h-9 bg-[#0A2EF5] text-white rounded-md font-bold text-xs shadow-md">进站</button>
                     <button className="h-9 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs">关键件</button>
                     <button className="h-9 bg-white border border-slate-300 text-slate-700 rounded-md font-bold text-xs">出站</button>
                 </div>
             </div>

             {/* 2. Station Summary Blocks */}
             <div className="grid grid-cols-3 gap-2 px-0.5">
                <StatusTile label="完成" value="3" />
                <StatusTile label="异常" value="2" />
                <StatusTile label="点检" value="否" isAlert={true} />
             </div>

             {/* 3. Work Order List */}
             <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-col flex-1">
                 <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-amber-500"></div>
                        <span className="font-bold text-slate-800 text-base">在制工单 <span className="text-blue-600 ml-1 text-sm font-extrabold">[2/4]</span></span>
                     </div>
                     <button className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold">切换</button>
                 </div>

                 <div className="space-y-3">
                     {MOCK_WOS.map(wo => (
                         <div 
                            key={wo.id}
                            onClick={() => setActiveWOId(wo.id)}
                            className={`border rounded-xl p-3 shadow-sm transition-all cursor-pointer relative overflow-hidden group flex items-center justify-between min-h-[140px] ${activeWOId === wo.id ? 'bg-[#0A2EF5] border-[#0A2EF5] text-white' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                         >
                            <div className="space-y-1.5 text-[10px] w-[60%] shrink-0">
                                <div className="flex items-center gap-1">
                                    <span className={`font-medium w-12 text-right shrink-0 ${activeWOId === wo.id ? 'text-blue-100' : 'text-slate-400'}`}>工单号:</span>
                                    <span className="font-extrabold text-[11px] font-mono">{wo.id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`font-medium w-12 text-right shrink-0 ${activeWOId === wo.id ? 'text-blue-100' : 'text-slate-400'}`}>序列号:</span>
                                    <span className="font-extrabold text-[11px] font-mono">{wo.sn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`font-medium w-12 text-right shrink-0 ${activeWOId === wo.id ? 'text-blue-100' : 'text-slate-400'}`}>型号:</span>
                                    <span className="font-bold truncate">{wo.model}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`font-medium w-12 text-right shrink-0 ${activeWOId === wo.id ? 'text-blue-100' : 'text-slate-400'}`}>SO/行号:</span>
                                    <span className="font-bold">{wo.so}/{wo.lineNo}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center shrink-0 w-[40%]">
                                <CircularTimer 
                                    mins={wo.mins} 
                                    time={wo.time} 
                                    progress={wo.progress} 
                                    isDark={activeWOId === wo.id}
                                />
                            </div>
                             
                             {activeWOId === wo.id && (
                                 <div className="absolute bottom-1 right-2 bg-white/20 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-white/30 uppercase tracking-tighter shadow-sm">当前工单</div>
                             )}
                         </div>
                     ))}
                 </div>
             </div>
         </div>

         <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 bg-blue-100 font-bold"><UserCircle size={20} /></div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">张工 (QC主管)</div>
                <div className="text-[10px] text-slate-500 truncate">质量管理部 - FQC组</div>
            </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 shrink-0 z-20 shadow-sm">
              <div className="flex items-center gap-2">
                  <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={24} /></button>
                  <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">生产采集 - 251205171</h1>
              </div>

              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-slate-500 whitespace-nowrap">产线:</label>
                      <select className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[80px] shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L7%207L13%201%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px_auto] bg-[right_8px_center] bg-no-repeat pr-6">
                          <option>星火</option>
                      </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-slate-500 whitespace-nowrap">工序:</label>
                      <select className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[100px] shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L7%207L13%201%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px_auto] bg-[right_8px_center] bg-no-repeat pr-6">
                          <option>大件装配</option>
                      </select>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-slate-500 whitespace-nowrap">工位:</label>
                      <select className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 min-w-[120px] shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%228%22%20viewBox%3D%220%200%2014%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L7%207L13%201%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:10px_auto] bg-[right_8px_center] bg-no-repeat pr-6">
                          <option>工位-大件装配</option>
                      </select>
                  </div>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button onClick={onHome} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={22} /></button>
              </div>
          </header>

          <div className="px-3 py-2 grid grid-cols-7 gap-2 shrink-0 bg-white border-b border-slate-200 shadow-sm">
                <NavButton label="点检"  onClick={() => setIsPreProductionOpen(true)} bgColor="bg-red-600 hover:bg-red-700" />
                <NavButton label="叫料" />
                <NavButton label="误工记录"  />
                <NavButton label="在线维修" />
                <NavButton label="作业指导书"  onClick={() => setIsEsopOpen(true)} />
                <NavButton label="ECN变更"  bgColor="bg-red-600 hover:bg-red-700" />
                <NavButton label="物料接收" />
          </div>

          <div className="flex-1 overflow-hidden p-2 flex gap-2 bg-slate-100">
              {/* Left Panel: Inspection Items - Expanded Width */}
              <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                   <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 pr-3 h-10 shrink-0">
                        <div className="flex h-full">
                            <div className="px-4 h-full flex items-center text-xs font-extrabold bg-white border-t-4 border-t-[#0A2EF5] text-[#0A2EF5] border-r border-slate-200 uppercase">检验项目</div>
                        </div>
                        <div className="flex items-center gap-3 w-64">
                             <span className="text-[10px] font-black text-slate-700 whitespace-nowrap">完成进度（10/23）: <span className="text-xs font-black text-blue-700">66%</span></span>
                             <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                 <div className="h-full w-[66%] bg-[#0A2EF5] rounded-full"></div>
                             </div>
                        </div>
                   </div>

                   {/* Control Bar */}
                   <div className="bg-white px-3 py-1.5 border-b border-slate-200 flex gap-2 shrink-0">
                        <button className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                            <Download size={14} /> 读取设备参数
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                            <Save size={14} /> 保存
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 border border-slate-300 rounded text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
                            <Send size={14} /> 提交
                        </button>
                   </div>
                   
                   <div className="flex-1 overflow-auto p-2 space-y-2 no-scrollbar bg-slate-50/30">
                        {collectionItems.map((item, index) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded shadow-sm flex flex-col hover:border-blue-200 transition-colors">
                                <div className="bg-slate-50/50 border-b border-slate-100 px-3 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 text-white rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm" style={{ backgroundColor: BRAND_BLUE }}>{index + 1}</div>
                                        <span className="font-bold text-slate-900 text-base truncate">{item.name}</span>
                                        {item.defects.length > 0 && (
                                            <div className="flex items-center gap-1 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full shadow-sm">
                                                <Tag size={10} className="text-red-500"/><span className="text-[9px] font-bold text-red-600">{item.defects.length} 项缺陷</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm text-white ${item.isQuantitative ? 'bg-blue-600' : 'bg-slate-600'}`}>{item.isQuantitative ? '定量' : '定性'}</span>
                                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">KC:{item.kc} KPC:{item.kpc}</span>
                                        <button disabled={!item.isPhotoRequired} onClick={() => handleCameraClick(item)} className={`h-8 w-10 flex items-center justify-center border rounded transition-all relative shadow-sm ${item.isPhotoRequired ? 'bg-blue-50 text-[#0A2EF5] border-blue-100' : 'bg-slate-100 text-slate-300'}`}>
                                            <Camera size={16} />
                                            {item.photos.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm font-bold">{item.photos.length}</span>}
                                        </button>
                                        <div className="flex rounded-md overflow-hidden border border-slate-300 h-8 shadow-sm bg-white">
                                            <button onClick={() => handleResultChange(item.id, 'OK')} className={`px-3 text-xs font-bold transition-all flex items-center ${item.result === 'OK' ? 'bg-[#7db828] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>合格</button>
                                            <div className="w-px bg-slate-300"></div>
                                            <button onClick={() => handleResultChange(item.id, 'NG')} className={`px-3 text-xs font-bold transition-all flex items-center ${item.result === 'NG' ? 'bg-[#cc0000] text-white' : 'text-slate-400 hover:bg-slate-50'}`}>不合格</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2.5 bg-white">
                                    <div className="bg-slate-50/50 p-2 rounded border border-slate-100 mb-2">
                                        <div className="text-slate-700 leading-snug text-[13px]"><span className="font-bold text-slate-900 mr-2 text-sm italic">要求:</span>{item.standard}</div>
                                    </div>
                                    {item.isQuantitative && (
                                        <div className="flex flex-col gap-2">
                                            <div className="inline-flex gap-3 border border-slate-200 rounded px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-50 w-fit"><span>L: <span className="text-slate-900">{item.lowerLimit}</span></span><span>U: <span className="text-slate-900">{item.upperLimit}</span></span></div>
                                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-100">
                                                <span className="font-bold text-slate-600 text-xs shrink-0">检测值 ({item.sampleCount}):</span>
                                                <div className="flex gap-2">{Array.from({ length: item.sampleCount }).map((_, i) => (
                                                    <input key={i} type="text" defaultValue={item.vals[i] || ''} className="border border-slate-300 rounded px-2 py-1.5 w-16 text-center font-black text-sm text-slate-800 focus:border-[#0A2EF5] outline-none shadow-sm transition-all" />
                                                ))}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                   </div>
              </div>

              {/* Right Panel - Narrower Width (260px) */}
              <div className="w-[260px] flex flex-col gap-2 shrink-0 overflow-hidden">
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[55%]">
                      <div className="h-10 border-b border-slate-200 px-3 flex items-center justify-between bg-slate-50 shrink-0">
                          <div onClick={() => setIsMaterialModalOpen(true)} className="flex items-center cursor-pointer group">
                            <div className="w-1.5 h-4 bg-green-600 mr-2 rounded-full shadow-sm"></div>
                            <span className="font-bold text-slate-800 text-xs group-hover:text-blue-700 group-hover:underline transition-all">工序物料</span>
                            <Info size={12} className="ml-1 text-slate-400 group-hover:text-blue-600" />
                          </div>
                          <div className="flex rounded overflow-hidden border border-slate-300 shadow-sm bg-white">
                              <button className="px-2 py-0.5 text-[9px] font-bold bg-[#7db828] text-white">已扫</button>
                              <div className="w-px bg-slate-200"></div>
                              <button className="px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-50">未扫</button>
                          </div>
                      </div>
                      <div className="flex-1 overflow-auto no-scrollbar">
                          <table className="w-full text-[11px] text-left">
                              <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                                  <tr>
                                      <th className="px-2 py-2 font-black text-center w-6">#</th>
                                      <th className="px-2 py-2 font-black">物料编码</th>
                                      <th className="px-1 py-2 font-black text-center w-8">数</th>
                                      <th className="px-1 py-2 font-black text-center w-10">关</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {MOCK_BOM.map((item) => (
                                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                          <td className="px-2 py-2 text-center text-slate-400">{item.seq}</td>
                                          <td className={`px-2 py-2 font-bold break-all ${item.id === '1' || item.id === '2' ? 'text-[#7db828]' : 'text-slate-500'}`}>{item.materialCode}</td>
                                          <td className="px-1 py-2 text-center text-slate-900 font-black">{item.qty}</td>
                                          <td className="px-1 py-2 text-center">
                                              {item.isKeyPart && <span className="text-[8px] bg-orange-50 text-orange-600 px-0.5 py-0.5 rounded border border-orange-100 font-bold">是</span>}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <div className="h-[200px] bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
                      <div className="h-10 border-b border-slate-200 px-3 flex items-center justify-between shrink-0 bg-slate-50">
                          <div className="flex items-center">
                              <div className="w-1.5 h-4 bg-lime-500 mr-2 rounded-full"></div>
                              <span className="font-bold text-slate-800 text-xs">人员上岗 <span className="text-blue-600 ml-1 font-black">[3/5]</span></span>
                          </div>
                          <div className="flex gap-1.5">
                                <button className="text-white text-[9px] font-black px-2 py-1 rounded shadow-sm bg-[#0A2EF5]">上岗</button>
                                <button className="bg-white border border-slate-300 text-slate-600 text-[9px] font-black px-2 py-1 rounded">离岗</button>
                            </div>
                      </div>
                      <div className="flex-1 overflow-auto p-2 space-y-1.5 no-scrollbar bg-slate-50/20">
                            <PersonCard name="张三" duration="1H" time="08:00" />
                            <PersonCard name="李四" duration="3H" time="06:00" />
                            <PersonCard name="王五" duration="0.5H" time="08:30" />
                      </div>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

const StatusTile: React.FC<{ label: string; value: string; isAlert?: boolean }> = ({ label, value, isAlert }) => (
    <div className={`flex flex-col items-center justify-center rounded-xl py-1 px-1 border shadow-sm transition-colors bg-white border-slate-200 h-[64px] flex-1`}>
        <span className={`text-[10px] font-bold mb-0.5 text-slate-500`}>{label}</span>
        <span className={`text-xl font-black ${isAlert ? 'text-red-600' : 'text-slate-800'}`}>
            {value}
        </span>
    </div>
);

const CircularTimer: React.FC<{ mins: string; time: string; progress: number; isDark?: boolean }> = ({ mins, time, progress, isDark }) => {
    const size = 52;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={isDark ? "rgba(255,255,255,0.15)" : "#f1f5f9"} strokeWidth={strokeWidth} />
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={isDark ? "white" : BRAND_BLUE} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-base font-black leading-none ${isDark ? 'text-white' : 'text-blue-600'}`}>{mins}</span>
                    <span className={`text-[6px] font-bold uppercase tracking-tighter ${isDark ? 'text-blue-100' : 'text-slate-500'}`}>MIN</span>
                </div>
            </div>
            <div className={`mt-0.5 text-[9px] font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{time}</div>
        </div>
    );
};

const NavButton: React.FC<{ label: string; icon?: React.ReactNode; bgColor?: string; onClick?: () => void; }> = ({ label, icon, bgColor = "bg-[#0A2EF5]", onClick }) => (
    <button onClick={onClick} className={`${bgColor} text-white font-extrabold text-[20px] rounded flex flex-col items-center justify-center ${icon ?'gap-1.5':''}  py-2.5 shadow-sm active:scale-95 transition-all w-full`}>
        {icon &&<div className="">{icon}</div>}<span>{label}</span>
    </button>
);

const PersonCard: React.FC<{ name: string; duration: string; time: string }> = ({ name, duration, time }) => (
    <div className="bg-white rounded p-2 border border-slate-200 flex items-center gap-2 shadow-sm">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200"><UserCircle size={18} /></div>
        <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <div className="font-bold text-slate-800 text-[11px] truncate">{name}</div>
                    <span className="bg-blue-50 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-100 text-blue-600">{duration}</span>
                </div>
                <div className="text-[8px] text-slate-400 font-mono italic">{time}</div>
        </div>
    </div>
);