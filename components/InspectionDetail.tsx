import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  Paperclip,
  Printer,
  MoreHorizontal,
  Upload,
  Eye,
  Trash2,
  FileText,
  AlertCircle,
  X,
  Aperture
} from 'lucide-react';
import { Task, InspectionGroup, InspectionItem, InspectionDetailData, InspectionType, CapturedPhoto } from '../types';
import { MOCK_INSPECTION_DETAIL } from '../constants';
import { CarrierLogo } from './CarrierLogo';

interface InspectionDetailProps {
  task: Task;
  onBack: () => void;
}

// --- CSS Carrier Logo ---
const Logo = () => (
  <CarrierLogo className="h-8 w-auto mr-4" />
);

// --- Camera Modal Component ---
interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (dataUrl: string) => void;
}
const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    // NOTE: Removed actual Camera logic to avoid "Permission Denied" errors in environment without https/camera access
    
    const handleSnap = () => {
        // Create a fake captured image (solid color with timestamp)
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#cbd5e1'; // Slate-300
            ctx.fillRect(0, 0, 640, 480);
            ctx.fillStyle = '#000';
            ctx.font = '30px Arial';
            ctx.fillText('MOCK PHOTO', 220, 240);
            ctx.font = '20px Arial';
            ctx.fillText(new Date().toLocaleTimeString(), 260, 280);
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(dataUrl);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center h-96">
                <div className="text-white text-center">
                    <Camera size={64} className="mx-auto mb-4 opacity-50" />
                    <p>摄像头画面模拟</p>
                    <p className="text-xs text-slate-400 mt-2">(真实摄像头调用已禁用以避免权限错误)</p>
                </div>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
                >
                    <X size={24} />
                </button>
            </div>
            
            <div className="mt-8 flex gap-8 items-center">
                <button onClick={onClose} className="px-6 py-3 rounded-full bg-slate-700 text-white font-medium hover:bg-slate-600">
                    关闭
                </button>
                <button 
                    onClick={handleSnap}
                    className="w-20 h-20 rounded-full bg-white border-4 border-slate-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                    <div className="w-16 h-16 rounded-full bg-red-600 border-2 border-white"></div>
                </button>
            </div>
            <p className="text-white/60 mt-4 text-sm">点击红色按钮拍照，可连续拍摄</p>
        </div>
    );
};

// --- Image Viewer Modal ---
interface ImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemName: string;
    photos: CapturedPhoto[];
    onDelete: (id: string) => void;
}
const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ isOpen, onClose, itemName, photos, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="font-bold text-lg text-slate-800">附件查看 - {itemName}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                     <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left w-16">序号</th>
                                <th className="px-4 py-3 text-left">检验项目</th>
                                <th className="px-4 py-3 text-left">附件地址 (缩略图)</th>
                                <th className="px-4 py-3 text-center w-24">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {photos.length > 0 ? (
                                photos.map((photo, index) => (
                                    <tr key={photo.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                        <td className="px-4 py-3 text-slate-700">{itemName}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={photo.dataUrl} 
                                                    alt="capture" 
                                                    className="w-16 h-12 object-cover rounded border border-slate-200 hover:scale-150 transition-transform origin-left z-10 bg-slate-100" 
                                                />
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {new Date(photo.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button className="text-blue-600 font-medium hover:underline text-xs">预览</button>
                                                <button 
                                                    onClick={() => onDelete(photo.id)}
                                                    className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                        暂无照片附件
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium">
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};


export const InspectionDetail: React.FC<InspectionDetailProps> = ({ task, onBack }) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'ATTACHMENTS' | 'WO_NOTES' | 'TECH_NOTES'>('ITEMS');
  const [activeGroup, setActiveGroup] = useState<InspectionGroup | null>(null);
  const [executionSubTab, setExecutionSubTab] = useState<InspectionType>('QUALITATIVE');
  const [detailData] = useState<InspectionDetailData>(MOCK_INSPECTION_DETAIL);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeCameraItemId, setActiveCameraItemId] = useState<string | null>(null);

  // Gallery State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryItem, setActiveGalleryItem] = useState<InspectionItem | null>(null);

  // --- Helpers ---
  const handleGroupClick = (group: InspectionGroup) => {
    setActiveGroup(group);
    setExecutionSubTab(group.type);
  };

  const handleBackToOverview = () => {
    setActiveGroup(null);
  };

  const openCamera = (itemId: string) => {
      setActiveCameraItemId(itemId);
      setIsCameraOpen(true);
  };

  const handleCapture = (dataUrl: string) => {
      if (activeCameraItemId) {
          const newPhoto: CapturedPhoto = {
              id: Date.now().toString() + Math.random().toString(),
              itemId: activeCameraItemId,
              dataUrl: dataUrl,
              timestamp: Date.now()
          };
          setCapturedPhotos(prev => [...prev, newPhoto]);
      }
  };

  const openGallery = (item: InspectionItem) => {
      setActiveGalleryItem(item);
      setIsGalleryOpen(true);
  };

  const handleDeletePhoto = (photoId: string) => {
      setCapturedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  // --- RENDER: Execution View (Table) ---
  const renderExecutionView = (group: InspectionGroup) => {
    const isQualitative = executionSubTab === 'QUALITATIVE';
    
    // Filter items based on sub-tab
    const displayItems = group.items.filter(item => {
        if (isQualitative) {
            return group.type === 'QUALITATIVE' || item.specMin === undefined;
        } else {
            return group.type === 'QUANTITATIVE' || item.specMin !== undefined;
        }
    });

    // Dynamic Columns Calculation for Quantitative
    let maxSamples = 0;
    if (!isQualitative) {
        maxSamples = displayItems.reduce((max, item) => Math.max(max, item.sampleCount || 0), 0);
    }
    const sampleColumns = Array.from({ length: maxSamples }, (_, i) => i + 1);

    return (
      <div className="flex flex-col h-full bg-slate-50 relative">
        <CameraModal 
            isOpen={isCameraOpen} 
            onClose={() => setIsCameraOpen(false)} 
            onCapture={handleCapture} 
        />
        
        <ImageViewerModal
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            itemName={activeGalleryItem?.requirement || ''}
            photos={capturedPhotos.filter(p => p.itemId === activeGalleryItem?.id)}
            onDelete={handleDeletePhoto}
        />

        {/* Top Header - Execution */}
        <div className="bg-slate-900 text-white h-14 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={handleBackToOverview} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft size={24} />
             </button>
             <h1 className="font-bold text-lg tracking-wide">检验执行 - {group.name}</h1>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Info Bar */}
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center gap-4 shrink-0">
           <div className="flex-1">
              <span className="text-sm font-bold text-slate-700 block mb-1">检验完成率: {Math.round((3/5)*100)}%</span>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
              </div>
           </div>
           {/* Simple group navigation indicators */}
           <div className="flex gap-0.5">
              {detailData.groups.map(g => (
                 <div 
                    key={g.id} 
                    onClick={() => {
                        setActiveGroup(g);
                        setExecutionSubTab(g.type);
                    }}
                    className={`px-3 py-1 text-xs border border-slate-200 cursor-pointer transition-colors ${g.id === group.id ? 'bg-amber-100 text-amber-800 font-bold border-amber-300' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                 >
                    {g.name.substring(0, 4)}
                 </div>
              ))}
           </div>
        </div>

        {/* Content Area - Table */}
        <div className="flex-1 overflow-auto p-4">
           <div className="bg-white rounded-t-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
               
               {/* Sub-Tabs Header */}
               <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
                  <button
                    onClick={() => setExecutionSubTab('QUALITATIVE')}
                    className={`flex-1 sm:flex-none px-6 py-3 font-bold text-sm transition-all relative ${
                        executionSubTab === 'QUALITATIVE' 
                        ? 'text-blue-700 bg-white border-t-2 border-t-blue-600 shadow-[0_1px_0_#fff]' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    检验内容（定性）
                  </button>
                  <button
                    onClick={() => setExecutionSubTab('QUANTITATIVE')}
                    className={`flex-1 sm:flex-none px-6 py-3 font-bold text-sm transition-all relative ${
                        executionSubTab === 'QUANTITATIVE' 
                        ? 'text-blue-700 bg-white border-t-2 border-t-blue-600 shadow-[0_1px_0_#fff]' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    检验内容（定量）
                  </button>
                  <div className="flex-1 bg-slate-50 border-b border-slate-200"></div>
               </div>

               <div className="overflow-x-auto flex-1 relative">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                       <tr>
                          <th className="px-4 py-3 w-1/4 min-w-[150px]">检验项目</th>
                          <th className="px-4 py-3 w-16 text-center whitespace-nowrap">是否<br/>必检</th>
                          <th className="px-4 py-3 w-20 text-center whitespace-nowrap">是否<br/>拍照</th>
                          <th className="px-4 py-3 whitespace-nowrap">检验类别</th>
                          <th className="px-4 py-3 whitespace-nowrap">图示</th>
                          
                          {/* Columns based on Tab */}
                          {isQualitative ? (
                            <>
                                {/* Sample Count & Defect Count Removed for Qualitative */}
                                <th className="px-4 py-3 text-center w-32 whitespace-nowrap">检验确认</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap">检验结果</th>
                            </>
                          ) : (
                            <>
                                <th className="px-4 py-3 text-center whitespace-nowrap">样本数</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap">规格下限</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap">规格上限</th>
                                {/* Dynamic Measurement Columns */}
                                {sampleColumns.map(i => (
                                    <th key={i} className="px-4 py-3 text-center whitespace-nowrap min-w-[80px]">实测值{i}</th>
                                ))}
                            </>
                          )}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {displayItems.length > 0 ? (
                           displayItems.map((item) => {
                               // Check photos for this item
                               const photoCount = capturedPhotos.filter(p => p.itemId === item.id).length;
                               
                               return (
                                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                     <td className="px-4 py-3 font-medium text-slate-700">{item.requirement}</td>
                                     <td className="px-4 py-3 text-center">
                                        <div className={`w-4 h-4 rounded-full border mx-auto ${item.isMandatory ? 'border-primary-500 bg-primary-50' : 'border-slate-300'}`}></div>
                                     </td>
                                     <td className="px-4 py-3 text-center">
                                        {item.isPhotoRequired ? (
                                            <div className="relative inline-block">
                                                <button 
                                                    onClick={() => openCamera(item.id)}
                                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors mx-auto active:scale-95" 
                                                    title="拍照"
                                                >
                                                    <Camera size={18} />
                                                </button>
                                                {photoCount > 0 && (
                                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                                                        {photoCount}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                     </td>
                                     <td className="px-4 py-3 text-slate-500">{item.category}</td>
                                     <td className="px-4 py-3">
                                        <button 
                                            onClick={() => openGallery(item)}
                                            className="text-blue-600 hover:text-blue-800 underline decoration-dotted underline-offset-2 flex items-center gap-1 whitespace-nowrap"
                                        >
                                           查看图片
                                        </button>
                                     </td>
                                     
                                     {isQualitative ? (
                                        <>
                                            {/* Qualitative View */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Default checked as OK */}
                                                    <button className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${item.checkResult === 'OK' || !item.checkResult ? 'bg-green-50 border-green-500 text-green-600 shadow-sm' : 'border-slate-200 text-slate-300 hover:border-green-300'}`}>
                                                        <div className="text-[10px] font-bold">合格</div>
                                                    </button>
                                                    <button className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${item.checkResult === 'NG' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'border-slate-200 text-slate-300 hover:border-red-300'}`}>
                                                        <div className="text-[10px] font-bold">不合格</div>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-700">
                                                {/* Auto-default to OK if not set */}
                                                {item.result || 'OK'}
                                            </td>
                                        </>
                                     ) : (
                                        <>
                                            {/* Quantitative View */}
                                            <td className="px-4 py-3 text-center text-slate-700">{item.sampleCount}</td>
                                            <td className="px-4 py-3 text-center text-slate-500">{item.specMin}</td>
                                            <td className="px-4 py-3 text-center text-slate-500">{item.specMax}</td>
                                            
                                            {/* Dynamic Inputs */}
                                            {sampleColumns.map(i => {
                                                const isDisabled = i > item.sampleCount;
                                                const value = item.measuredValues?.[i-1] || '';
                                                return (
                                                    <td key={i} className="px-4 py-3 text-center">
                                                        <input 
                                                            type="text" 
                                                            disabled={isDisabled}
                                                            className={`w-16 border rounded px-1 py-1 text-center text-sm transition-colors ${isDisabled ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'}`} 
                                                            defaultValue={value} 
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </>
                                     )}
                                  </tr>
                               );
                           })
                       ) : (
                           <tr>
                               <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                                   此页签下无检验项目
                               </td>
                           </tr>
                       )}
                    </tbody>
                 </table>
               </div>
           </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="h-16 bg-white border-t border-slate-200 px-4 flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <Logo />
           <div className="w-px h-8 bg-slate-200 mx-2"></div>
           <button 
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 text-white rounded-md font-medium hover:bg-blue-900 transition-colors"
           >
              <Camera size={18} /> 拍照
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors">
              <ArrowLeft size={18} /> 上一项
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-lime-500 text-white rounded-md font-medium hover:bg-lime-600 transition-colors">
              下一项 <ArrowRight size={18} />
           </button>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors ml-4">
              <Save size={18} /> 保存
           </button>
        </div>
      </div>
    );
  };

  // --- RENDER: Overview View (Main) ---
  if (activeGroup) {
      return renderExecutionView(activeGroup);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* 1. Header */}
      <div className="bg-slate-900 text-white h-14 px-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
               <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg tracking-wide">检验信息</h1>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full">
            <MoreHorizontal size={20} />
        </button>
      </div>

      {/* 2. Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
         <div className="p-4 space-y-4">
            
            {/* Info Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-slate-800 pl-3">检验信息</h2>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 text-sm">
                   {[
                       { label: '检验单号', value: task.id },
                       { label: '工单', value: task.workOrder },
                       { label: '销售单号', value: task.salesOrder },
                       { label: '行号', value: task.lineNo },
                       { label: '物料编码', value: task.productCode },
                       { label: '物料名称', value: task.productName },
                       { label: '机组型号', value: task.unitModel },
                       { label: '检验员', value: task.inspector },
                       { label: '检验结果', value: 'OK' }, 
                   ].map((field, i) => (
                       <div key={i} className="flex flex-col">
                           <label className="text-slate-500 mb-1.5">{field.label}</label>
                           <div className={`px-3 py-2 rounded border border-slate-200 ${['检验单号','工单', '销售单号', '行号', '物料编码'].includes(field.label) ? 'bg-blue-50/50' : 'bg-slate-50'} text-slate-700 font-medium truncate`}>
                               {field.value || '\u00A0'}
                           </div>
                       </div>
                   ))}
               </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-slate-200 px-2">
                {[
                    { id: 'ITEMS', label: '检验项目' },
                    { id: 'ATTACHMENTS', label: '附件' },
                    { id: 'WO_NOTES', label: '工单备注' },
                    { id: 'TECH_NOTES', label: '技术部备注' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 text-lg font-bold transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[300px]">
                {/* 1. INSPECTION ITEMS TAB */}
                {activeTab === 'ITEMS' && (
                    <div className="space-y-3">
                        {detailData.groups.map(group => (
                            <div 
                                key={group.id}
                                onClick={() => handleGroupClick(group)}
                                className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 hover:shadow-sm hover:border-blue-300 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                        {group.type === 'QUALITATIVE' ? <Eye size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{group.name}</h3>
                                        <p className="text-slate-500 text-sm mt-0.5">
                                           {group.status === 'PENDING' ? '未开始' : '进行中'} • {group.items.length} 项
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-slate-600 mb-1">完成进度: {Math.round(group.progress)}/{group.items.length}</div>
                                    </div>
                                    
                                    {group.groupResult === 'FAIL' && (
                                       <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center transform -rotate-12 opacity-80">
                                            <span className="text-red-600 font-bold text-xs">FAIL</span>
                                       </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. ATTACHMENTS TAB */}
                {activeTab === 'ATTACHMENTS' && (
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left">名称</th>
                                    <th className="px-6 py-3 text-left">附件上传</th>
                                    <th className="px-6 py-3 text-left">附件</th>
                                    <th className="px-6 py-3 text-center w-24">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {detailData.attachments.map((file, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-slate-700">{file.name}</td>
                                        <td className="px-6 py-4 text-slate-400 italic">/</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button className="text-blue-600 hover:text-blue-800 flex flex-col items-center gap-1 group">
                                                    <Upload size={20} className="group-hover:scale-110 transition-transform"/>
                                                </button>
                                                <button className="text-slate-400 hover:text-slate-600 flex flex-col items-center gap-1 group">
                                                    <Camera size={20} className="group-hover:scale-110 transition-transform"/>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-3">
                                                <button className="text-blue-600 font-medium hover:underline">预览</button>
                                                <button className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 3. WORK ORDER NOTES TAB */}
                {activeTab === 'WO_NOTES' && (
                    <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0 mt-1">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900 text-lg mb-3">工单备注</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                    {task.woNotes ? task.woNotes.split('；').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && <>；<br /></>}
                                        </React.Fragment>
                                    )) : '无工单备注信息。'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. TECHNICAL NOTES TAB */}
                {activeTab === 'TECH_NOTES' && (
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0 mt-1">
                                <AlertCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-blue-900 text-lg mb-3">技术部备注</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                                    {task.techNotes ? task.techNotes.split('；').map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && <>；<br /></>}
                                        </React.Fragment>
                                    )) : '无技术部备注信息。'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* 3. Footer */}
      <div className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-end shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 gap-6">
          <Logo />
          <button className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-sm transition-all hover:shadow-md transform active:scale-95">
             提交
          </button>
      </div>

    </div>
  );
};
