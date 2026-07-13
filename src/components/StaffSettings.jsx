import { useState } from 'react';
import { UserPlus, Plus } from 'lucide-react';
import StaffCard from './StaffCard';

const StaffSettings = ({ staffList, editingStaff, setEditingStaff, onUpdateStaff, onDeleteStaff, onAddStaff, onAddOffDate, onRemoveOffDate }) => {
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffType] = useState('free');

  const handleAdd = () => {
    onAddStaff(newStaffName, newStaffType);
    setNewStaffName('');
  };

  const handleDelete = (e, staffId) => {
    e.stopPropagation();
    onDeleteStaff(staffId);
    if (editingStaff === staffId) setEditingStaff(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
      <div className="bg-white border rounded-[1.5rem] p-6 shadow-sm mb-8 border-dashed border-indigo-200">
        <h3 className="text-sm font-black text-indigo-600 italic uppercase mb-4 flex items-center gap-2"><UserPlus size={18} /> Add New Member</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 block mb-1">スタッフ名</label>
            <input type="text" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold outline-none" placeholder="名前"/>
          </div>
          <button onClick={handleAdd} className="bg-indigo-600 text-white p-3 rounded-xl font-black shadow-md"><Plus size={20} /></button>
        </div>
      </div>

      <div className="grid gap-3">
        {staffList.map(staff => (
          <StaffCard
            key={staff.id}
            staff={staff}
            isEditing={editingStaff === staff.id}
            onToggleEdit={() => setEditingStaff(editingStaff === staff.id ? null : staff.id)}
            onDelete={(e) => handleDelete(e, staff.id)}
            onUpdateStaff={onUpdateStaff}
            onAddOffDate={onAddOffDate}
            onRemoveOffDate={onRemoveOffDate}
            onCloseEdit={() => setEditingStaff(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffSettings;
