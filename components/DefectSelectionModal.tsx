import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Minus, Trash2, Search, AlertCircle, Tag } from 'lucide-react';

export interface Defect {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface SelectedDefect extends Defect {
  count: number;
}

interface DefectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (defects: SelectedDefect[]) => void;
  itemName?: string;
  initialDefects?: SelectedDefect[];
}

const BRAND_BLUE = '#0A2EF5';

const DEFECT_CATEGORIES = ['所有', '基本质量类', '外观类', '尺寸类', '性能类', '装配类', '电气类'];

// Carrier AC Related Mock Defects
const MOCK_DEFECTS: Defect[] = [
    // 外观类
    { id: 'A001', code: 'A001', name: '漆面划伤', category: '外观类' },
    { id: 'A002', code: 'A002', name: '凹坑/变形', category: '外观类' },
    { id: 'A003', code: 'A003', name: '翅片倒伏', category: '外观类' },
    { id: 'A004', code: 'A004', name: '铭牌错误', category: '外观类' },
    { id: 'A005', code: 'A005', name: '铜管凹瘪', category: '外观类' },
    { id: 'A006', code: 'A006', name: '包装破损', category: '外观类' },
    { id: 'A007', code: 'A007', name: '油污/脏污', category: '外观类' },
    
    // 尺寸类
    { id: 'D001', code: 'D001', name: '尺寸超差', category: '尺寸类' },
    { id: 'D002', code: 'D002', name: '孔径偏大', category: '尺寸类' },
    { id: 'D003', code: 'D003', name: '间隙过大', category: '尺寸类' },
    
    // 性能类
    { id: 'P001', code: 'P001', name: '冷媒泄漏', category: '性能类' },
    { id: 'P002', code: 'P002', name: '噪音超标', category: '性能类' },
    { id: 'P003', code: 'P003', name: '震动异常', category: '性能类' },
    { id: 'P004', code: 'P004', name: '制冷不足', category: '性能类' },
    { id: 'P005', code: 'P005', name: '焊漏', category: '性能类' },
    
    // 装配类
    { id: 'M001', code: 'M001', name: '螺钉松动', category: '装配类' },
    { id: 'M002', code: 'M002', name: '零件缺失', category: '装配类' },
    { id: 'M003', code: 'M003', name: '错装', category: '装配类' },
    
    // 电气类
    { id: 'E001', code: 'E001', name: '接线错误', category: '电气类' },
    { id: 'E002', code: 'E002', name: '绝缘破损', category: '电气类' },
    { id: 'E003', code: 'E003', name: '接地不良', category: '电气类' },
    
    // 基本质量类 (Generic from Screenshot style)
    { id: 'B001', code: 'B001', name: '多划痕', category: '基本质量类' },
    { id: 'B002', code: 'B002', name: '泡水', category: '基本质量类' },
];

export const DefectSelectionModal: React.FC<DefectSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = '检验项目',
  initialDefects = []
}) => {
  const [selectedDefects, setSelectedDefects] = useState<SelectedDefect[]>([]);
  const [activeCategory, setActiveCategory] = useState('所有');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDefects(initialDefects.length > 0 ? [...initialDefects] : []);
      setActiveCategory('所有');
      setSearchQuery('');
    }
  }, [isOpen, initialDefects]);

  // Filter Logic
  const filteredDefects = useMemo(() => {
    return MOCK_DEFECTS.filter(defect => {
      const matchesCategory = activeCategory === '所有' || defect.category === activeCategory;
      const matchesSearch = defect.name.includes(searchQuery) || defect.code.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handlers
  const toggleDefect = (defect: Defect) => {
    const existingIndex = selectedDefects.findIndex(d => d.id === defect.id);
    if (existingIndex >= 0) {
      // If exists, just remove it? Or maybe ignore click if we want to rely on the left panel for removal?
      // Let's make grid click toggle: add if not present, remove if present
      const newSelected = [...selectedDefects];
      newSelected.splice(existingIndex, 1);
      setSelectedDefects(newSelected);
    } else {
      setSelectedDefects([...selectedDefects, { ...defect, count: 1 }]);
    }
  };

  const updateCount = (id: string, delta: number) => {
    setSelectedDefects(prev => prev.map(d => {
      if (d.id === id) {
        const newCount = Math.max(1, d.count + delta);
        return { ...d, count: newCount };
      }
      return d;
    }));
  };

  const removeDefect = (id: string) => {
    setSelectedDefects(prev => prev.filter(d => d.id !== id));
  };

  const handleConfirm = () => {
    onConfirm(selectedDefects);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100">
                 <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">不良代码录入</h2>
                <p className="text-xs text-slate-500 font-medium">当前项目: {itemName}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex">
           
           {/* Left Panel: Selected Defects (35%) */}
           <div className="w-[35%] bg-slate-50 border-r border-slate-200 flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Tag size={18} className="text-blue-600"/> 已选缺陷 
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{selectedDefects.length}</span>
                 </h3>
                 {selectedDefects.length > 0 && (
                    <button 
                        onClick={() => setSelectedDefects([])} 
                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                    >
                        清空
                    </button>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {selectedDefects.length > 0 ? (
                      selectedDefects.map(defect => (
                          <div key={defect.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-3 group hover:border-blue-300 transition-colors">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <div className="font-bold text-slate-800 text-base">{defect.name}</div>
                                      <div className="text-xs text-slate-400 font-mono mt-0.5">{defect.code} | {defect.category}</div>
                                  </div>
                                  <button onClick={() => removeDefect(defect.id)} className="text-slate-300 hover:text-red-500 p-1">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                              <div className="flex items-center justify-between bg-slate-50 rounded px-2 py-1.5 border border-slate-100">
                                  <span className="text-xs font-bold text-slate-500">数量</span>
                                  <div className="flex items-center gap-3">
                                      <button onClick={() => updateCount(defect.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-100 active:scale-95 text-slate-600">
                                          <Minus size={12} />
                                      </button>
                                      <span className="font-bold text-slate-800 w-4 text-center">{defect.count}</span>
                                      <button onClick={() => updateCount(defect.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded hover:bg-slate-100 active:scale-95 text-slate-600">
                                          <Plus size={12} />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                          <Tag size={32} className="mb-2 opacity-20" />
                          <span className="text-sm font-medium">暂无已选缺陷</span>
                          <span className="text-xs">请从右侧选择</span>
                      </div>
                  )}
              </div>
           </div>

           {/* Right Panel: Selection (65%) */}
           <div className="flex-1 flex flex-col bg-white">
              
              {/* Toolbar: Categories & Search */}
              <div className="p-4 border-b border-slate-100 space-y-4 shrink-0">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2">
                      {DEFECT_CATEGORIES.map(cat => (
                          <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-4 py-2 text-sm font-bold rounded-md transition-all border ${
                                  activeCategory === cat 
                                  ? 'bg-[#0A2EF5] text-white border-[#0A2EF5] shadow-md' 
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                          type="text" 
                          placeholder="搜索缺陷名称或代码..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                      />
                  </div>
              </div>

              {/* Defect Grid */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredDefects.map(defect => {
                          const isSelected = selectedDefects.some(d => d.id === defect.id);
                          return (
                              <button
                                  key={defect.id}
                                  onClick={() => toggleDefect(defect)}
                                  className={`
                                    relative p-4 rounded-lg border text-left transition-all group flex flex-col justify-between min-h-[80px]
                                    ${isSelected 
                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                                    }
                                  `}
                              >
                                  <div>
                                      <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{defect.name}</div>
                                      <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>{defect.code}</div>
                                  </div>
                                  
                                  {/* Selection Indicator */}
                                  {isSelected && (
                                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                          <Plus size={12} strokeWidth={4} />
                                      </div>
                                  )}
                              </button>
                          );
                      })}
                  </div>
                  {filteredDefects.length === 0 && (
                      <div className="py-12 text-center text-slate-400">未找到匹配的缺陷代码</div>
                  )}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="h-16 px-6 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
             <div className="text-sm text-slate-500">
                已选 <span className="font-bold text-slate-800">{selectedDefects.length}</span> 项缺陷
             </div>
             <div className="flex gap-3">
                 <button onClick={onClose} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 active:scale-95 transition-all">
                    取消
                 </button>
                 <button onClick={handleConfirm} className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2">
                    确定不合格
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};
