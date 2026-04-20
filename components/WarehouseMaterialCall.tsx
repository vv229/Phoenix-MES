import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Home, Calendar, UserCircle, MapPin, 
  Truck, ArrowRightLeft, TriangleAlert, BellRing, ClipboardList, LayoutGrid, Box,
  MessageSquare, CheckCircle2, X, Search, Database, ArrowRight
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';
import { MOCK_MATERIAL_CALLS } from '../constants';
import { MaterialCallItem } from '../types';

interface WarehouseMaterialCallProps {
  onBack: () => void;
}

const WAREHOUSES = ['A区-原料仓', 'B区-半成品仓', 'C区-成品仓', 'D区-包材仓', 'S1-车间产线仓', 'S2-装配线仓', 'SAP-虚拟仓'];

const MOCK_MASTER_MATERIALS = [
  { id: 'm1', code: 'W-001', name: '螺纹钢', model: 'Φ16', unit: '吨', stock: 120 },
  { id: 'm2', code: 'W-002', name: '铝型材', model: 'AL-6061', unit: 'kg', stock: 50 },
  { id: 'm3', code: 'C-010', name: '电阻', model: '10K 1%', unit: '个', stock: 10000 },
  { id: 'm4', code: 'C-011', name: '电容', model: '100uF 16V', unit: '个', stock: 5000 },
  { id: 'm5', code: 'P-005', name: '包装箱', model: '500x500', unit: '个', stock: 300 },
  { id: 'm6', code: 'P-006', name: '防静电袋', model: '100x150', unit: '个', stock: 2000 },
  { id: 'm7', code: 'A-001', name: '组装附件包', model: 'Standard', unit: '套', stock: 150 },
];

export const WarehouseMaterialCall: React.FC<WarehouseMaterialCallProps> = ({ onBack }) => {
  const [items, setItems] = useState<MaterialCallItem[]>(MOCK_MATERIAL_CALLS);
  
  // 查询条件
  const [dateFilter, setDateFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [targetLocFilter, setTargetLocFilter] = useState('');

  const filteredItems = items.filter(item => {
    const matchesDate = dateFilter ? item.planDate.includes(dateFilter) : true;
    const matchesAdmin = adminFilter ? item.admin.includes(adminFilter) : true;
    const matchesLoc = targetLocFilter ? item.targetLoc.includes(targetLocFilter) : true;
    return matchesDate && matchesAdmin && matchesLoc;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'PARTIAL': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '待拣配';
      case 'PARTIAL': return '部分拣配';
      case 'COMPLETED': return '已拣配';
      default: return status;
    }
  };

  // 选中状态
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(new Set(filteredItems.map(item => item.id)));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItemIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItemIds(newSelected);
  };

  const isAllSelected = filteredItems.length > 0 && selectedItemIds.size === filteredItems.length;

  // 物料叫料 (调拨单据) Modal 状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceWarehouse, setSourceWarehouse] = useState(WAREHOUSES[0]);
  const [targetWarehouse, setTargetWarehouse] = useState(WAREHOUSES[4]);
  const [matCodeFilter, setMatCodeFilter] = useState('');
  const [matNameFilter, setMatNameFilter] = useState('');
  const [modalSelectedIds, setModalSelectedIds] = useState<Set<string>>(new Set());
  const [callQuantities, setCallQuantities] = useState<Record<string, number>>({});

  const filteredMasterMaterials = useMemo(() => {
    return MOCK_MASTER_MATERIALS.filter(m => {
      const matchCode = matCodeFilter ? m.code.toLowerCase().includes(matCodeFilter.toLowerCase()) : true;
      const matchName = matNameFilter ? m.name.toLowerCase().includes(matNameFilter.toLowerCase()) : true;
      return matchCode && matchName;
    });
  }, [matCodeFilter, matNameFilter]);

  const handleModalSelect = (id: string) => {
    const newSelected = new Set(modalSelectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
      if (!callQuantities[id]) {
        setCallQuantities(prev => ({ ...prev, [id]: 1 }));
      }
    }
    setModalSelectedIds(newSelected);
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setCallQuantities(prev => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const handleSubmitMaterialCall = () => {
    setIsModalOpen(false);
    // 这里可以处理提交逻辑，例如将调拨单推送到后端，目前仅关闭弹框
    setModalSelectedIds(new Set());
    setCallQuantities({});
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800 relative">
        {/* 物料叫料 (调拨单) Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col h-[90vh] lg:h-auto lg:max-h-[85vh] overflow-hidden">
              {/* Modal Header */}
              <div className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Database size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">物料叫料 (SAP调拨单据)</h2>
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">Material Transfer Order</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
                
                {/* 仓库选择 */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                    <ArrowRightLeft size={16} className="text-blue-600"/> 调拨仓位设定
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">调出仓库 (Source)</label>
                      <select 
                        value={sourceWarehouse}
                        onChange={(e) => setSourceWarehouse(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center w-12 h-12 mt-5 rounded-full bg-slate-100 text-slate-400 shrink-0">
                      <ArrowRight size={20} />
                    </div>

                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">调入仓库 (Target)</label>
                      <select 
                        value={targetWarehouse}
                        onChange={(e) => setTargetWarehouse(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-teal-50/50 text-sm font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 物料选择区 */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mr-auto">
                      <Box size={16} className="text-blue-600"/> 物料主数据
                    </h3>
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 w-[200px]">
                      <Search size={14} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="检索物料编码..." 
                        value={matCodeFilter}
                        onChange={(e) => setMatCodeFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 w-[200px]">
                      <Search size={14} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="检索物料名称..." 
                        value={matNameFilter}
                        onChange={(e) => setMatNameFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 p-0">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                        <tr className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                          <th className="p-3 w-12 text-center border-b border-slate-200">选择</th>
                          <th className="p-3 border-b border-slate-200">物料编码</th>
                          <th className="p-3 border-b border-slate-200">物料名称</th>
                          <th className="p-3 border-b border-slate-200">型号</th>
                          <th className="p-3 border-b border-slate-200 text-right">可用库存</th>
                          <th className="p-3 border-b border-slate-200 w-32 text-center">调拨数量</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredMasterMaterials.length > 0 ? filteredMasterMaterials.map((m) => {
                          const isSelected = modalSelectedIds.has(m.id);
                          return (
                            <tr 
                              key={m.id} 
                              className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
                              onClick={() => handleModalSelect(m.id)}
                            >
                              <td className="p-3 text-center border-r border-slate-50">
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => handleModalSelect(m.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                              <td className="p-3 font-mono font-black text-slate-700">{m.code}</td>
                              <td className="p-3 font-bold text-slate-800">{m.name}</td>
                              <td className="p-3 text-slate-500">{m.model}</td>
                              <td className="p-3 text-right font-mono text-slate-600">{m.stock} <span className="text-xs text-slate-400">{m.unit}</span></td>
                              <td className="p-3">
                                {isSelected ? (
                                  <div className="flex items-center gap-1 bg-white border border-blue-200 rounded px-2 py-1" onClick={e => e.stopPropagation()}>
                                    <input 
                                      type="number"
                                      min="1"
                                      value={callQuantities[m.id] || 1}
                                      onChange={(e) => handleQuantityChange(m.id, parseInt(e.target.value) || 1)}
                                      className="w-16 text-right font-black text-blue-700 outline-none bg-transparent"
                                    />
                                    <span className="text-xs text-slate-400 font-bold">{m.unit}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-300 text-xs text-center block">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                              暂无匹配的物料数据
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 rounded-b-2xl">
                <div className="text-sm font-bold text-slate-500">
                  已选择 <span className="text-blue-600 font-black">{modalSelectedIds.size}</span> 种物料
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSubmitMaterialCall}
                    disabled={modalSelectedIds.size === 0}
                    className={`px-6 py-2 rounded-lg font-black text-white shadow hover:shadow-md transition-all flex items-center gap-2 ${modalSelectedIds.size > 0 ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`}
                  >
                    <CheckCircle2 size={16} /> 确认调拨单生成
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">仓储叫料</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Warehouse Material Call</span>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <CarrierLogo className="h-6 w-auto" />
              <button onClick={onBack} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors"><Home size={22} /></button>
          </div>
        </header>

        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between shadow-sm z-10 gap-4">
            <div className="flex items-center gap-4 flex-wrap flex-1">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <Calendar size={16} className="text-slate-400" />
                    <input 
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 w-32"
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <UserCircle size={16} className="text-slate-400" />
                    <input 
                        type="text"
                        placeholder="管理员"
                        value={adminFilter}
                        onChange={(e) => setAdminFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 w-32"
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <MapPin size={16} className="text-slate-400" />
                    <input 
                        type="text"
                        placeholder="车间库存地点"
                        value={targetLocFilter}
                        onChange={(e) => setTargetLocFilter(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400 w-40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                  className={`h-10 px-6 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 ${selectedItemIds.size > 0 ? 'bg-[#0A2EF5] hover:bg-blue-700 active:scale-95' : 'bg-slate-300 cursor-not-allowed'}`}
                  disabled={selectedItemIds.size === 0}
                >
                    <BellRing size={16} /> 叫料 {selectedItemIds.size > 0 ? `(${selectedItemIds.size})` : ''}
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-10 px-6 bg-teal-600 text-white font-black rounded-xl shadow-lg hover:bg-teal-700 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Database size={16} /> 物料叫料
                </button>
            </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col w-full bg-slate-50">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                                <th className="p-4 w-12 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                                    <input 
                                      type="checkbox" 
                                      checked={isAllSelected}
                                      onChange={handleSelectAll}
                                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4">状态</th>
                                <th className="p-4">需求时间</th>
                                <th className="p-4">工单号</th>
                                <th className="p-4">物料编码</th>
                                <th className="p-4 max-w-[200px] min-w-[150px]">物料名称</th>
                                <th className="p-4">型号</th>
                                <th className="p-4 text-right">需求数量</th>
                                <th className="p-4 text-right">已拣数量</th>
                                <th className="p-4">仓储库存地点</th>
                                <th className="p-4">车间需求地点</th>
                                <th className="p-4 text-center">虚拟标识</th>
                                <th className="p-4">管理员</th>
                                <th className="p-4 max-w-[150px]">备注</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredItems.length > 0 ? filteredItems.map((item) => {
                                const isSelected = selectedItemIds.has(item.id);
                                return (
                                    <tr 
                                      key={item.id} 
                                      className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50 relative' : ''}`}
                                      onClick={() => handleSelectItem(item.id)}
                                    >
                                        <td className={`p-4 sticky left-0 z-10 border-r border-slate-100 ${isSelected ? 'bg-blue-50/50' : 'bg-white group-hover:bg-blue-50/50'}`}>
                                            <div className="flex items-center justify-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => handleSelectItem(item.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-black border inline-flex ${getStatusStyle(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-700">{item.planDate}</td>
                                        <td className="p-4 font-mono font-black text-slate-800">{item.woNo}</td>
                                        <td className="p-4 font-mono font-black text-blue-700">{item.materialCode}</td>
                                        <td className="p-4 font-bold text-slate-600 max-w-[200px] truncate" title={item.description}>{item.description}</td>
                                        <td className="p-4 text-slate-600 truncate max-w-[120px]" title={item.model}>{item.model}</td>
                                        <td className="p-4 text-right font-black text-slate-800">{item.qty}</td>
                                        <td className="p-4 text-right font-black text-blue-600">{item.pickedQty}</td>
                                        <td className="p-4 text-slate-600"><span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs font-bold">{item.sourceLoc}</span></td>
                                        <td className="p-4 text-slate-600"><span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs font-bold">{item.targetLoc}</span></td>
                                        <td className="p-4 text-center">
                                            {item.virtualFlag === '是' ? (
                                                <span className="bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs font-bold inline-block">是</span>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-bold">否</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-slate-700 flex items-center gap-1.5"><UserCircle size={14} className="text-slate-400"/> {item.admin}</td>
                                        <td className="p-4 text-slate-500 text-xs truncate max-w-[150px]" title={item.remarks}>{item.remarks || '-'}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={14} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                                            <Truck size={48} className="opacity-20 mb-4" />
                                            <p className="text-lg font-bold">暂无仓储叫料需求</p>
                                            <p className="text-sm">请调整筛选条件</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* 底部统计栏 */}
                <div className="h-12 bg-slate-50 border-t border-slate-200 flex items-center px-4 justify-between shrink-0 text-sm">
                    <div className="font-bold text-slate-600 flex items-center gap-4">
                        <span>共找到 <span className="text-blue-700 font-black">{filteredItems.length}</span> 条记录</span>
                        {selectedItemIds.size > 0 && (
                            <>
                                <div className="w-px h-4 bg-slate-300"></div>
                                <span className="text-blue-600">已选中 <strong>{selectedItemIds.size}</strong> 条</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
