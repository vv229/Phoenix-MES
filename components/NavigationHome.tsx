import React from 'react';
import { 
  Factory, 
  Settings, 
  ClipboardCheck, 
  Box, 
  Truck,
  Bell,
  UserCircle,
  MoreHorizontal
} from 'lucide-react';

interface NavigationHomeProps {
  onNavigate: (view: 'STATION_COLLECTION' | 'FQC_LIST') => void;
}

export const NavigationHome: React.FC<NavigationHomeProps> = ({ onNavigate }) => {
    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md">
                <div className="flex items-center gap-4">
                    <img 
                       src="http://127.0.0.1:32768/00.43.45/images/fqc___pad/u646.png" 
                       alt="Carrier" 
                       className="h-8 object-contain"
                    />
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
                    <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                            <UserCircle size={20} />
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold">张工 (QC主管)</div>
                            <div className="text-xs text-slate-300">质量管理部 - FQC组</div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-full">
                        <MoreHorizontal size={24} />
                    </button>
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
                            onClick={() => onNavigate('STATION_COLLECTION')}
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
                <span>广东赛意信息科技股份有限公司</span>
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