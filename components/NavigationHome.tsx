import React, { useState } from 'react';
import { 
  Factory, 
  Settings, 
  ClipboardCheck, 
  Box, 
  Truck,
  Bell,
  UserCircle,
  MoreHorizontal,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { CarrierLogo } from './CarrierLogo';
import { SelectStationModal } from './SelectStationModal';
import { ClockInModal } from './ClockInModal';

interface NavigationHomeProps {
  onNavigate: (view: 'STATION_COLLECTION' | 'FQC_LIST') => void;
  onLogout: () => void;
}

export const NavigationHome: React.FC<NavigationHomeProps> = ({ onNavigate, onLogout }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isStationModalOpen, setIsStationModalOpen] = useState(false);
    const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);

    // Flow Handler
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
            {/* Modals */}
            <SelectStationModal 
                isOpen={isStationModalOpen} 
                onClose={() => setIsStationModalOpen(false)} 
                onConfirm={handleStationConfirm} 
            />
            <ClockInModal 
                isOpen={isClockInModalOpen}
                onClose={() => setIsClockInModalOpen(false)}
                onConfirm={handleClockInConfirm}
            />

            {/* Header */}
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-50">
                <div className="flex items-center gap-4">
                    <CarrierLogo className="h-8 w-auto text-white" />
                    <div className="w-px h-6 bg-white/20"></div>
                    <span className="font-bold text-xl flex items-center gap-2">
                        <Factory size={24} /> YLC-MES
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-full relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    
                    {/* User Profile & Dropdown Wrapper */}
                    <div className="relative">
                        <button 
                            className={`flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer transition-all select-none border border-transparent ${isUserMenuOpen ? 'bg-white/20 border-white/10' : 'hover:bg-white/20'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsUserMenuOpen(!isUserMenuOpen);
                            }}
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                                <UserCircle size={20} />
                            </div>
                            <div className="text-sm hidden md:block text-left">
                                <div className="font-semibold text-white leading-tight">张工 (QC主管)</div>
                                <div className="text-xs text-blue-200 leading-tight">质量管理部 - FQC组</div>
                            </div>
                            <ChevronDown 
                                size={14} 
                                className={`text-blue-200 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <>
                                {/* Backdrop to close when clicking outside */}
                                <div 
                                    className="fixed inset-0 z-40 cursor-default" 
                                    onClick={() => setIsUserMenuOpen(false)}
                                ></div>
                                
                                {/* Menu */}
                                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-4 border-b border-slate-100 md:hidden bg-slate-50">
                                         <div className="font-semibold text-slate-800">张工 (QC主管)</div>
                                         <div className="text-xs text-slate-500">质量管理部 - FQC组</div>
                                    </div>
                                    <div className="p-1">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsUserMenuOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors font-medium rounded-md group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-600 transition-colors text-slate-500">
                                                <LogOut size={16} />
                                            </div>
                                            退出系统
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                  
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                
                {/* Section 1: Production Management */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">生产管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <NavCard 
                            title="过站采集" 
                            icon={<Factory size={32} />} 
                            onClick={handleStationCollectionClick}
                            color="text-blue-600"
                        />
                        <NavCard 
                            title="安灯管理" 
                            icon={<Settings size={32} />} 
                            color="text-slate-500"
                        />
                    </div>
                </div>

                {/* Section 2: Quality Management */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-4">质量管理</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <NavCard 
                            title="过程专检" 
                            icon={<ClipboardCheck size={32} />} 
                            color="text-slate-500"
                        />
                        <NavCard 
                            title="成品检验" 
                            icon={<Box size={32} />} 
                            onClick={() => onNavigate('FQC_LIST')}
                            color="text-green-600"
                        />
                        <NavCard 
                            title="入库检验" 
                            icon={<Truck size={32} />} 
                            color="text-slate-500"
                        />
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="h-10 bg-slate-900 text-slate-400 text-xs flex items-center justify-between px-6">
                <span>2025/12/12 星期二 14:00:12</span>
                <span>广州赛意信息科技股份有限公司</span>
            </footer>
        </div>
    );
};

const NavCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    onClick?: () => void;
    color?: string 
}> = ({ title, icon, onClick, color = "text-slate-600" }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all h-40 w-full"
    >
        <div className={`mb-4 p-3 rounded-full bg-slate-50 ${color}`}>
            {icon}
        </div>
        <span className="font-bold text-slate-700 text-lg">{title}</span>
    </button>
);