import { ShieldCheck, Menu } from 'lucide-react';

const MobileHeader = ({ onMenuOpen }) => (
  <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b z-[150]">
    <div className="flex items-center gap-2 font-black text-indigo-600 italic"><ShieldCheck size={20}/> SHIFT MASTER</div>
    <button onClick={onMenuOpen} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Menu size={24} /></button>
  </header>
);

export default MobileHeader;
