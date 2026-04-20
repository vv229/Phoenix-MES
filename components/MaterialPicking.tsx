
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Home, Search, RefreshCw, Layers, CheckCircle2, 
  UserCircle, ScanLine, Box, Clock, MapPin, Truck, ChevronRight, 
  LayoutGrid, Users, Barcode, ClipboardList, Check, ShoppingCart, Trash2, X, Package, Send, Plus, AlertCircle, Settings2, Factory, Lock
} from 'lucide-react';
import { MOCK_PICKING_TASKS } from '../constants';
import { PickingTask, PickingStatus, PickingItem } from '../types';
import { CarrierLogo } from './CarrierLogo';

// 扩展前端本地状态
interface ExtendedPickingItem extends PickingItem {
  isInCart?: boolean; // 拣配中
  assignedCart?: string; // 已关联的料车号
  pickedQty?: number; // 实际已拣配数量
  cartQty?: number; // 当前在购物车里的数量
  shortageReason?: string; // 缺料原因
}

interface MaterialPickingProps {
  onBack: () => void;
}

const PROCESSES = [
  { code: '0010', name: 'AC-大件装配' },
  { code: '0020', name: 'AC-管配' },
  { code: '0030', name: 'AC-钎焊' },
  { code: '0035', name: 'AC-V盘预装' },
  { code: '0040', name: 'AC-V盘安装' },
  { code: '0050', name: 'AC-泵压检测' },
  { code: '0060', name: 'AC-真空/接线/加注' },
  { code: '0070', name: 'AC-试车' },
  { code: '0080', name: 'AC-最后整理' },
];

const WORKSHOPS = ['星火车间', '螺杆车间', '离心车间'];
const LINES = ['星火1线', '星火2线', '螺杆1线', '螺杆2线', '离心1线'];

export const MaterialPicking: React.FC<MaterialPickingProps> = ({ onBack }) => {
  const [tasks, setTasks] = useState<PickingTask[]>(MOCK_PICKING_TASKS);
  const [selectedTask, setSelectedTask] = useState<(PickingTask & { items: ExtendedPickingItem[] }) | null>(null);
  const [search, setSearch] = useState('');
  const [processFilter, setProcessFilter] = useState('ALL');
  const [workshopFilter, setWorkshopFilter] = useState('ALL');
  const [lineFilter, setLineFilter] = useState('ALL');
  
  // 详情页状态
  const [cartBarcode, setCartBarcode] = useState('');
  const [locBarcode, setLocBarcode] = useState('');
  const [activeAdmin, setActiveAdmin] = useState<string>('ALL');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [markAsReady, setMarkAsReady] = useState(false);

  // 添加物料弹窗状态
  const [addingItem, setAddingItem] = useState<ExtendedPickingItem | null>(null);
  const [pickingQty, setPickingQty] = useState<number>(0);
  const [shortageReason, setShortageReason] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.id.includes(search) || t.soNo.includes(search) || t.woNo.includes(search);
    const matchesProcess = processFilter === 'ALL' || t.processCode === processFilter;
    const matchesWorkshop = workshopFilter === 'ALL' || t.workshop === workshopFilter;
    const matchesLine = lineFilter === 'ALL' || t.line === lineFilter;
    return matchesSearch && matchesProcess && matchesWorkshop && matchesLine;
  });

  const getStatusStyle = (status: PickingStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'PARTIAL': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'READY': return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = (status: PickingStatus) => {
    switch (status) {
      case 'PENDING': return '待拣配';
      case 'PARTIAL': return '部分拣配';
      case 'READY': return '已备料';
    }
  };

  // 1. 点击“添加”：打开弹窗
  const handleOpenAddModal = (item: ExtendedPickingItem) => {
    if (!selectedTask || selectedTask.status === 'READY') return;
    setAddingItem(item);
    const remainingQty = item.qty - (item.pickedQty || 0);
    setPickingQty(remainingQty > 0 ? remainingQty : item.qty);
    setShortageReason(item.shortageReason || '');
  };

  // 2. 确认添加：加入购物车
  const handleConfirmAdd = () => {
    if (!selectedTask || !addingItem) return;
    
    const newItems = selectedTask.items.map(item => {
        if (item.id === addingItem.id) {
            return { 
                ...item, 
                isInCart: true, 
                cartQty: pickingQty,
                shortageReason: pickingQty < (item.qty - (item.pickedQty || 0)) ? shortageReason : item.shortageReason
            };
        }
        return item;
    });
    setSelectedTask({ ...selectedTask, items: newItems });
    setAddingItem(null);
  };

  // 3. 购物车撤回
  const handleRemoveFromCart = (itemId: string) => {
    if (!selectedTask || selectedTask.status === 'READY') return;
    const newItems = selectedTask.items.map(item => {
        if (item.id === itemId) {
            return { ...item, isInCart: false, cartQty: undefined };
        }
        return item;
    });
    setSelectedTask({ ...selectedTask, items: newItems });
  };

  // 4. 最终提交逻辑（由弹窗内的确认按钮触发）
  const handleFinalSubmit = () => {
    if (!selectedTask || !cartBarcode) return;

    const newItems = selectedTask.items.map(item => {
        if (item.isInCart) {
            const newPickedQty = (item.pickedQty || 0) + (item.cartQty || 0);
            const isFullyPicked = newPickedQty >= item.qty;
            return { 
                ...item, 
                isInCart: false, 
                isPicked: isFullyPicked, 
                pickedQty: newPickedQty,
                cartQty: undefined,
                assignedCart: cartBarcode,
                pickedTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            };
        }
        return item;
    });

    const allPicked = newItems.every(i => i.isPicked || (i.pickedQty || 0) >= i.qty);
    const anyPicked = newItems.some(i => i.isPicked || (i.pickedQty || 0) > 0);
    const newStatus: PickingStatus = markAsReady ? 'READY' : (allPicked ? 'READY' : (anyPicked ? 'PARTIAL' : 'PENDING'));

    const updatedTask = { ...selectedTask, items: newItems, status: newStatus };
    
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? (updatedTask as any) : t));
    
    setCartBarcode('');
    setLocBarcode('');
    setMarkAsReady(false);
    setShowConfirmModal(false);
    setSelectedTask(null); // Return to list or stay? Usually stay or return. Here we return to list.
  };

  // 渲染列表视图
  if (!selectedTask) {
    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-800">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
              <span className="text-slate-800 font-bold text-2xl tracking-wide">物料拣配任务清单</span>
          </div>
          <div className="flex items-center gap-4">
              <CarrierLogo className="h-7 w-auto" />
              <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Home size={24} /></button>
          </div>
        </header>

        <div className="px-6 py-4 flex items-center justify-between bg-white/50 border-b border-slate-200">
             <div className="flex items-center gap-3">
                <div className="relative w-64">
                   <input 
                      type="text" 
                      placeholder="搜索 拣配单号 / SO / 工单..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm h-10"
                   />
                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#0A2EF5] text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                   <ScanLine size={20} />
                </button>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-sm h-10">
                   <Factory size={16} className="text-slate-400" />
                   <select 
                      value={workshopFilter}
                      onChange={(e) => setWorkshopFilter(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none h-full min-w-[80px]"
                   >
                      <option value="ALL">全部车间</option>
                      {WORKSHOPS.map(ws => (
                        <option key={ws} value={ws}>{ws}</option>
                      ))}
                   </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-sm h-10">
                   <Layers size={16} className="text-slate-400" />
                   <select 
                      value={lineFilter}
                      onChange={(e) => setLineFilter(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none h-full min-w-[80px]"
                   >
                      <option value="ALL">全部线体</option>
                      {LINES.map(line => (
                        <option key={line} value={line}>{line}</option>
                      ))}
                   </select>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-sm h-10">
                   <Settings2 size={16} className="text-slate-400" />
                   <select 
                      value={processFilter}
                      onChange={(e) => setProcessFilter(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none h-full min-w-[100px]"
                   >
                      <option value="ALL">全部工序</option>
                      {PROCESSES.map(p => (
                        <option key={p.code} value={p.code}>{p.code} {p.name}</option>
                      ))}
                   </select>
                </div>
             </div>

             <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase">待拣配</span>
                     <span className="text-lg font-black text-slate-700">{tasks.filter(t => t.status === 'PENDING').length}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-300"></div>
                 <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase">部分拣配</span>
                     <span className="text-lg font-black text-amber-600">{tasks.filter(t => t.status === 'PARTIAL').length}</span>
                 </div>
                 <div className="w-px h-8 bg-slate-300"></div>
                 <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase">已备料</span>
                     <span className="text-lg font-black text-green-600">{tasks.filter(t => t.status === 'READY').length}</span>
                 </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
                <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task as any)}
                    className={`bg-white rounded-xl border p-5 flex items-center justify-between shadow-sm transition-all hover:border-blue-400 hover:shadow-md cursor-pointer ${task.status === 'READY' ? 'bg-slate-50/50' : ''}`}
                >
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">拣配单号</span>
                            <span className="text-lg font-black text-slate-800 font-mono">{task.id}</span>
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-xs font-bold text-slate-600">
                            <div className="flex items-center gap-2"><ClipboardList size={14} className="text-slate-400"/> SO/ITEM: <span className="font-mono">{task.soNo}</span></div>
                            <div className="flex items-center gap-2 col-span-2"><LayoutGrid size={14} className="text-slate-400"/> WO: <span className="font-mono">{task.woNo}</span></div>
                            <div className="flex items-center gap-2"><Box size={14} className="text-slate-400"/> 生产代码: <span>{task.model}</span></div>
                            
                            <div className="flex items-center gap-2"><Clock size={14} className="text-slate-400"/> 需求日期: <span>{task.planDate}</span></div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Factory size={14} className="text-slate-400"/> 车间: <span>{task.workshop}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 col-span-2">
                                <UserCircle size={14} className="text-slate-400"/> 管理员: <span className="truncate">{Array.from(new Set(task.items.map(i => i.admin))).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${getStatusStyle(task.status)}`}>
                                {getStatusLabel(task.status)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">拣配进度: {task.items.filter(i => i.isPicked).length}/{task.items.length}</span>
                        </div>
                        <ChevronRight className="text-slate-300" />
                    </div>
                </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Package size={64} className="opacity-20 mb-4" />
                  <p className="text-lg font-bold">暂无匹配的拣配任务</p>
                  <p className="text-sm">请调整筛选条件或搜索关键词</p>
              </div>
            )}
        </div>
      </div>
    );
  }

  // 详情视图
  const admins = ['ALL', ...Array.from(new Set(selectedTask.items.map(i => i.admin)))];
  const itemsByAdmin = selectedTask.items.filter(i => activeAdmin === 'ALL' || i.admin === activeAdmin);
  const itemsInCart = selectedTask.items.filter(i => i.isInCart);
  const pickedItemsCount = selectedTask.items.filter(i => i.isPicked).length;
  const isReadOnly = selectedTask.status === 'READY';

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-800">
        <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><ChevronLeft size={26} strokeWidth={2.5} /></button>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight flex items-center gap-2">
                    拣配作业 - {selectedTask.id}
                    {isReadOnly && <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-green-500 shadow-sm flex items-center gap-1"><Lock size={10} /> 只读模式</span>}
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">SO/ITEM: {selectedTask.soNo} | WO: {selectedTask.woNo} | 生产代码: {selectedTask.model}</span>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <CarrierLogo className="h-6 w-auto" />
              <button onClick={() => setSelectedTask(null)} className="p-2.5 hover:bg-white/10 rounded-lg text-white transition-colors"><Home size={22} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Picking Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200 bg-white/50">
              {/* Header: Admin Grouping Filter */}
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                  <div className="flex items-center gap-3">
                      <Users size={20} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">按管理员分组:</span>
                      <div className="flex gap-2">
                          {admins.map(admin => (
                              <button 
                                  key={admin}
                                  onClick={() => setActiveAdmin(admin)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeAdmin === admin ? 'bg-[#0A2EF5] text-white border-[#0A2EF5] shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                              >
                                  {admin === 'ALL' ? '全部物料' : admin}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {itemsByAdmin.map((item, idx) => {
                      const isFullyPicked = item.isPicked || (item.pickedQty || 0) >= item.qty;
                      const isPartiallyPicked = !isFullyPicked && (item.pickedQty || 0) > 0;
                      
                      return (
                      <div 
                          key={item.id} 
                          className={`bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm transition-all ${isFullyPicked ? 'bg-green-50/10 border-green-100 opacity-60' : item.isInCart ? 'bg-blue-50/20 border-blue-200 shadow-inner' : isPartiallyPicked ? 'bg-amber-50/20 border-amber-200' : 'border-slate-200 hover:border-blue-200'}`}
                      >
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 shrink-0">{idx + 1}</div>
                              <div className="flex-1 min-w-0">
                                  <div className="font-mono font-black text-slate-800 text-base">{item.materialCode}</div>
                                  <div className="text-xs text-slate-500 font-bold truncate">{item.description}</div>
                              </div>
                              <div className="w-px h-8 bg-slate-100 hidden md:block"></div>
                              <div className="w-24 hidden md:block">
                                  <span className="text-[10px] font-black text-slate-400 uppercase block">需求数量</span>
                                  <span className="text-lg font-black text-slate-800">{item.qty} <span className="text-xs font-bold text-slate-400 uppercase">{item.unit}</span></span>
                              </div>
                              <div className="w-24 hidden md:block">
                                  <span className="text-[10px] font-black text-slate-400 uppercase block">已拣数量</span>
                                  <span className={`text-lg font-black ${isFullyPicked ? 'text-green-600' : isPartiallyPicked ? 'text-amber-600' : 'text-slate-400'}`}>
                                      {item.pickedQty || 0}
                                      {item.isInCart && <span className="text-blue-500 text-sm ml-1">(+{item.cartQty})</span>}
                                      <span className="text-xs font-bold text-slate-400 uppercase ml-1">{item.unit}</span>
                                  </span>
                              </div>
                              <div className="w-32 hidden md:block">
                                  <span className="text-[10px] font-black text-slate-400 uppercase block">源库位</span>
                                  <span className="text-sm font-black text-blue-700 flex items-center gap-1.5"><MapPin size={14}/> {item.sourceLoc}</span>
                              </div>
                              <div className="w-20 hidden lg:block">
                                  <span className="text-[10px] font-black text-slate-400 uppercase block">管理员</span>
                                  <span className="text-sm font-black text-slate-600 flex items-center gap-1">
                                      <UserCircle size={14} className="text-slate-300" /> {item.admin}
                                  </span>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0 pl-6 border-l border-slate-100 min-w-[120px] justify-center">
                              {isFullyPicked ? (
                                  <div className="flex flex-col items-center">
                                      <div className="flex items-center gap-1 text-green-600 font-black text-xs uppercase"><Check size={16} strokeWidth={4}/> 已拣完</div>
                                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 mt-1 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                          <Truck size={10} /> {item.assignedCart}
                                      </div>
                                  </div>
                              ) : item.isInCart ? (
                                  <div className="flex items-center gap-1 text-blue-600 font-black text-xs animate-pulse">
                                      <RefreshCw size={14} className="animate-spin" /> 拣配中
                                  </div>
                              ) : isReadOnly ? (
                                  <span className="text-slate-400 font-bold text-xs bg-slate-100 px-2 py-1 rounded">已完结</span>
                              ) : (
                                  <div className="flex flex-col items-center gap-1">
                                      {isPartiallyPicked && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">部分拣配</span>}
                                      <button 
                                          onClick={() => handleOpenAddModal(item)}
                                          className={`h-9 px-6 rounded-xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 bg-[#0A2EF5] text-white hover:bg-blue-700 hover:shadow-blue-200 cursor-pointer`}
                                      >
                                          <Plus size={16} /> {isPartiallyPicked ? '继续添加' : '添加'}
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  )})}
              </div>
          </div>

          {/* Right Column: Material Cart */}
          <div className="w-[340px] flex flex-col bg-white border-l border-slate-200 shrink-0">
              {/* Material Cart Barcode Scan */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2 shrink-0">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Truck size={12}/> 扫描料车条码</label>
                  <div className="relative">
                      <input 
                          disabled={isReadOnly}
                          type="text" 
                          value={cartBarcode} 
                          onChange={e => setCartBarcode(e.target.value)}
                          placeholder={isReadOnly ? "任务已锁定" : "录入料车 ID 以提交..."}
                          className={`w-full h-11 bg-white border-2 rounded-xl px-10 font-mono font-bold outline-none transition-all shadow-sm ${isReadOnly ? 'border-slate-100 text-slate-400 bg-slate-50 cursor-not-allowed' : 'border-slate-200 text-blue-700 focus:border-blue-600'}`}
                      />
                      <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      {cartBarcode && !isReadOnly && <CheckCircle2 size={16} fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"/>}
                  </div>
              </div>

              <div className="h-12 px-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 shadow-sm">
                  <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 text-white rounded-lg flex items-center justify-center shadow-md ${isReadOnly ? 'bg-slate-400' : 'bg-blue-600'}`}>
                          <ShoppingCart size={16} />
                      </div>
                      <h3 className="font-black text-slate-800 text-xs tracking-tight uppercase">待确认料车 ({itemsInCart.length})</h3>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-slate-50/30">
                  {itemsInCart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-300 italic opacity-40">
                          <Package size={40} className="mb-2" />
                          <span className="text-xs font-bold uppercase tracking-widest text-center leading-relaxed">
                            {isReadOnly ? "任务已完成<br/>无待确认物料" : "请从左侧点击“添加”<br/>将物料放入料车"}
                          </span>
                      </div>
                  ) : (
                      itemsInCart.map(item => (
                          <div key={item.id} className="bg-white border border-green-100 rounded-xl p-3 flex flex-col gap-2 relative group animate-in slide-in-from-right duration-200 shadow-sm">
                              <div className="flex justify-between items-start pr-8">
                                  <div className="min-w-0">
                                      <div className="font-mono font-black text-slate-800 text-xs leading-none mb-1 truncate">{item.materialCode}</div>
                                      <div className="text-[9px] text-slate-500 font-bold truncate">{item.description}</div>
                                  </div>
                                  <div className="text-right shrink-0">
                                      <div className="font-black text-blue-700 text-base">+{item.cartQty}</div>
                                      <div className="text-[9px] font-bold text-slate-400 uppercase">{item.unit}</div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-400">
                                      <MapPin size={10} /> {item.sourceLoc}
                                  </div>
                              </div>
                              
                              {!isReadOnly && (
                                <button 
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="absolute top-2 right-2 p-1.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                    title="移出购物车"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                              )}
                          </div>
                      ))
                  )}
              </div>

              {/* Side Action Area */}
              <div className="p-4 bg-white border-t border-slate-200 space-y-3 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-500">已备物料累计:</span>
                      <span className="text-sm font-black text-slate-800">{pickedItemsCount} / {selectedTask.items.length}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                          className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                          style={{ width: `${(pickedItemsCount / selectedTask.items.length) * 100}%` }}
                      ></div>
                  </div>
                  {isReadOnly ? (
                     <div className="w-full py-4 rounded-xl font-black text-sm bg-green-50 text-green-600 border border-green-100 flex items-center justify-center gap-2 cursor-default">
                        <CheckCircle2 size={18}/> 任务已完结
                     </div>
                  ) : (
                    <button 
                        onClick={() => setShowConfirmModal(true)}
                        disabled={itemsInCart.length === 0 || !cartBarcode}
                        className={`w-full py-4 rounded-xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${itemsInCart.length > 0 && cartBarcode ? 'bg-[#0A2EF5] text-white hover:bg-blue-700 shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                    >
                        <Send size={18}/> 确认并返回清单
                    </button>
                  )}
                  <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                     {isReadOnly ? "该单据所有物料已拣配完成" : "确认后将物料状态正式标记为“已拣”"}
                  </p>
              </div>
          </div>
        </div>

        {/* Add Item Modal */}
        {addingItem && (
            <div className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                    <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <span className="font-black text-slate-800 text-sm tracking-tight uppercase flex items-center gap-2">
                           <Package size={16} className="text-blue-600" /> 录入拣配数量
                        </span>
                        <button onClick={() => setAddingItem(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase">物料编码</span>
                            <span className="text-lg font-black text-slate-900 font-mono">{addingItem.materialCode}</span>
                            <span className="text-xs font-bold text-slate-600 mt-1">{addingItem.description}</span>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase">需求数量</label>
                                <div className="h-12 bg-slate-100 rounded-xl flex items-center px-4 font-black text-slate-500">
                                    {addingItem.qty} {addingItem.unit}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase">已拣数量</label>
                                <div className="h-12 bg-slate-100 rounded-xl flex items-center px-4 font-black text-slate-500">
                                    {addingItem.pickedQty || 0} {addingItem.unit}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-blue-600 uppercase">本次拣配数量</label>
                            <div className="relative">
                                <input 
                                    autoFocus
                                    type="number" 
                                    min="1"
                                    max={addingItem.qty - (addingItem.pickedQty || 0)}
                                    value={pickingQty} 
                                    onChange={e => setPickingQty(Number(e.target.value))}
                                    className="w-full h-12 bg-white border-2 border-blue-200 rounded-xl px-4 font-black text-blue-700 focus:border-blue-600 outline-none transition-all shadow-sm text-lg"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{addingItem.unit}</span>
                            </div>
                        </div>

                        {pickingQty < (addingItem.qty - (addingItem.pickedQty || 0)) && (
                            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                                <label className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1">
                                    <AlertCircle size={12} /> 缺料原因 (必填)
                                </label>
                                <input 
                                    type="text" 
                                    value={shortageReason} 
                                    onChange={e => setShortageReason(e.target.value)}
                                    placeholder="请输入缺料原因..."
                                    className="w-full h-12 bg-amber-50 border-2 border-amber-200 rounded-xl px-4 font-bold text-amber-900 focus:border-amber-500 outline-none transition-all shadow-sm placeholder:text-amber-300"
                                />
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => setAddingItem(null)}
                                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleConfirmAdd}
                                disabled={pickingQty <= 0 || (pickingQty < (addingItem.qty - (addingItem.pickedQty || 0)) && !shortageReason)}
                                className="flex-[2] py-3 bg-[#0A2EF5] text-white font-black rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={18} strokeWidth={3} /> 确认添加
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Final Submission Modal */}
        {showConfirmModal && (
            <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                    <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <span className="font-black text-slate-800 text-sm tracking-tight uppercase flex items-center gap-2">
                           <AlertCircle size={16} className="text-blue-600" /> 确认物料拣配提交
                        </span>
                        <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col gap-1">
                            <span className="text-[10px] font-black text-blue-500 uppercase">当前料车号</span>
                            <span className="text-lg font-black text-slate-900 font-mono">{cartBarcode}</span>
                            <span className="text-[10px] font-bold text-slate-400 mt-2">包含物料项数: {itemsInCart.length} 项</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5"><MapPin size={12}/> 扫描/录入库位条码 (非必填)</label>
                            <div className="relative">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={locBarcode} 
                                    onChange={e => setLocBarcode(e.target.value)}
                                    placeholder="扫描库位以记录来源..."
                                    className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-12 font-mono font-bold text-blue-700 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm"
                                />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                {locBarcode && <CheckCircle2 size={16} fill="currentColor" className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"/>}
                            </div>
                        </div>

                        <div 
                          onClick={() => setMarkAsReady(!markAsReady)}
                          className="flex items-center gap-3 px-1 py-2 cursor-pointer group select-none"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${markAsReady ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                              {markAsReady && <Check size={14} className="text-white" strokeWidth={4} />}
                          </div>
                          <span className="text-sm font-bold text-slate-700">是否已备料 (将单据状态置为“已备料”)</span>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleFinalSubmit}
                                className="flex-[2] py-3 bg-[#0A2EF5] text-white font-black rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={18} strokeWidth={3} /> 确认提交
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const StatusTile: React.FC<{ label: string; value: string; isAlert?: boolean }> = ({ label, value, isAlert }) => (
    <div className={`flex flex-col items-center justify-center rounded-xl py-1 px-1 border shadow-sm transition-colors bg-white border-slate-200 h-[64px] flex-1`}>
        <span className={`text-[10px] font-bold mb-0.5 text-slate-500`}>{label}</span>
        <span className={`text-xl font-black ${isAlert ? 'text-red-600' : 'text-slate-800'}`}>
            {value}
        </span>
    </div>
);
