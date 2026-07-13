import { ShieldCheck, X, LayoutDashboard, Users, RefreshCw } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onGenerate }) => (
  <>
    <div
      className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
    <aside className={`fixed inset-y-0 left-0 z-[210] bg-white w-72 border-r transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-out flex flex-col p-6`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 font-black text-xl text-indigo-600 italic"><ShieldCheck /> SHIFT MASTER</div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
      </div>
      <nav className="space-y-1 flex-1">
        <button
          onClick={() => { setActiveTab('viewer'); onClose(); }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'viewer' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <LayoutDashboard size={20}/> シフト表示
        </button>
        <button
          onClick={() => { setActiveTab('settings'); onClose(); }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Users size={20}/> スタッフ一覧
        </button>
      </nav>
      <div className="pt-6 border-t mt-6">
        <button onClick={onGenerate} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
          <RefreshCw size={18} /> シフト生成
        </button>
      </div>
    </aside>
  </>
);

export default Sidebar;
