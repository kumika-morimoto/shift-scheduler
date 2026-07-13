import { Trash2, Edit3 } from 'lucide-react';
import StaffEditPanel from './StaffEditPanel';

const StaffCard = ({ staff, isEditing, onToggleEdit, onDelete, onUpdateStaff, onAddOffDate, onRemoveOffDate, onCloseEdit }) => (
  <div className="bg-white border rounded-[1.2rem] p-4 shadow-sm hover:border-slate-200 transition-all overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${staff.color}`}>{staff.name[0]}</div>
        <div>
          <p className="font-black text-slate-800">{staff.name}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${staff.type === 'fixed' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
              {staff.type === 'fixed' ? '曜日固定' : '自由シフト'}
            </span>
            <span className="text-[8px] font-black text-slate-400">MAX: {staff.maxDailyHours}h / 週{staff.maxWeeklyDays}日</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onToggleEdit} className={`p-2 rounded-lg transition-all ${isEditing ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}><Edit3 size={18}/></button>
        <button onClick={onDelete} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18}/></button>
      </div>
    </div>
    {isEditing && (
      <StaffEditPanel
        staff={staff}
        onUpdateStaff={onUpdateStaff}
        onAddOffDate={onAddOffDate}
        onRemoveOffDate={onRemoveOffDate}
        onClose={onCloseEdit}
      />
    )}
  </div>
);

export default StaffCard;
