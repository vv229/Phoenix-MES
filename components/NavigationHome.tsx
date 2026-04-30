
import React, { useState } from 'react';
import { 
  Factory, 
  Settings, 
  ClipboardCheck, 
  Box, 
  Truck,
  Bell,
  UserCircle,
  LogOut,
  ChevronDown,
  FileCheck,
  PackageSearch,
  PackageCheck,
  LayoutGrid,
  ClipboardList
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';
import { SelectStationModal } from './SelectStationModal';
import { ClockInModal } from './ClockInModal';
import { InspectionModule } from '../types';

interface NavigationHomeProps {
  onNavigate: (view: any, module?: InspectionModule) => void;
  onLogout: () => void;
}

export const NavigationHome: React.FC<NavigationHomeProps> = ({ onNavigate, onLogout }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isStationModalOpen, setIsStationModalOpen] = useState(false);
    const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);

    const handleStationCollectionClick = () => {
        setIsStationModalOpen(true);
    };

    const handleStationConfirm = () => {
        setIsStationModalOpen(false);
        setIsClockInModalOpen(true);
    };

    const handleClockInConfirm = () => {
        setIsClockInModalOpen(false);
        onNavigate('STATION_COLLECTION');
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col">
            <SelectStationModal isOpen={isStationModalOpen} onClose={() => setIsStationModalOpen(false)} onConfirm={handleStationConfirm} />
            <ClockInModal isOpen={isClockInModalOpen} onClose={() => setIsClockInModalOpen(false)} onConfirm={handleClockInConfirm} />

            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-50">
                <div className="flex items-center gap-4">
                    <CarrierLogo className="h-8 w-auto text-white" />
                    <div className="w-px h-6 bg-white/20"></div>
                    <span className="font-bold text-xl flex items-center gap-2"><Factory size={24} /> YLC-MES</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-full relative">
                        <Bell size={20} /><span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="relative">
                        <button className={`flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer transition-all border border-transparent ${isUserMenuOpen ? 'bg-white/20 border-white/10' : 'hover:bg-white/20'}`} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700"><UserCircle size={20} /></div>
                            <div className="text-sm hidden md:block text-left">
                                <div className="font-semibold text-white leading-tight">张工 (QC主管)</div>
                                <div className="text-xs text-blue-200 leading-tight">质量管理部 - IQC/FQC组</div>
                            </div>
                            <ChevronDown size={14} className={`text-blue-200 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isUserMenuOpen && (
                            <><div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div><div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden"><div className="p-1"><button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors font-medium rounded-md group"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600 transition-colors text-slate-500"><LogOut size={16} /></div>退出系统</button></div></div></>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">

                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">仓储管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        
                        <NavCard title="仓储叫料" icon={<ClipboardList size={32} />} onClick={() => onNavigate('WAREHOUSE_CALL', 'WAREHOUSE_CALL' as any)} color="text-teal-600" />
                        <NavCard title="拣配任务" icon={<LayoutGrid size={32} />} onClick={() => onNavigate('PICKING', 'PICKING' as any)} color="text-amber-600" />
                        <NavCard title="ASN送货单" icon={<Truck size={32} />} onClick={() => onNavigate('ASN_DELIVERY', 'INCOMING' as any)} color="text-indigo-600" />
                        <NavCard title="物料接收" icon={<PackageCheck size={32} />} onClick={() => onNavigate('MATERIAL_RECEIVE')} color="text-pink-600" />
                    </div>
                    
                </div>
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">生产管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <NavCard title="生产采集" icon={<Factory size={32} />} onClick={handleStationCollectionClick} color="text-blue-600" />
                        <NavCard title="安灯管理" icon={<Settings size={32} />} color="text-slate-500" />
                        
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">质量管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <NavCard title="来料检验" icon={<PackageSearch size={32} />} onClick={() => onNavigate('FQC_LIST', 'INCOMING')} color="text-blue-600" />
                        <NavCard title="过程专检" icon={<ClipboardCheck size={32} />} onClick={() => onNavigate('FQC_LIST', 'PROCESS')} color="text-indigo-600" />
                        <NavCard title="完工检验" icon={<FileCheck size={32} />} onClick={() => onNavigate('FQC_LIST', 'COMPLETION')} color="text-purple-600" />
                        <NavCard title="成品检验" icon={<Box size={32} />} onClick={() => onNavigate('FQC_LIST', 'FQC')} color="text-green-600" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">设备管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <NavCard title="设备保养" icon={<Settings size={32} />} onClick={() => onNavigate('FQC_LIST', 'DEVICE_MAINTENANCE')} color="text-orange-600" />
                    </div>
                </div>

            </main>

            <footer className="h-10 bg-slate-900 text-slate-400 text-xs flex items-center justify-between px-6">
                <span>2025/12/12 星期五 09:27:00</span>
                <span>广州赛意信息科技股份有限公司</span>
            </footer>
        </div>
    );
};

const NavCard: React.FC<{ title: string; icon: React.ReactNode; onClick?: () => void; color?: string }> = ({ title, icon, onClick, color = "text-slate-600" }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all h-40 w-full group">
        <div className={`mb-4 p-3 rounded-full bg-slate-50 group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
        <span className="font-bold text-slate-700 text-lg">{title}</span>
    </button>
);
