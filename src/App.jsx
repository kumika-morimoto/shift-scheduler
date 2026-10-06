import { useState, useMemo } from 'react';
import MobileHeader from './components/MobileHeader';
import Sidebar from './components/Sidebar';
import ShiftViewer from './components/ShiftViewer';
import StaffSettings from './components/StaffSettings';
import { useStaffList } from './hooks/useStaffList';
import { useSavedShifts } from './hooks/useSavedShifts';
import { generateWeeklyShift } from './utils/shiftGenerator';
import { getMondayOf, parseLocalDate, getWeekDates } from './utils/weekUtils';

const App = () => {
  const [activeTab, setActiveTab] = useState('viewer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [startDate, setStartDate] = useState(() => getMondayOf(new Date()));

  const { staffList, updateStaff, addStaff, deleteStaff, addOffDate, removeOffDate } = useStaffList();
  const { getSavedShift, saveShift } = useSavedShifts();

  const weekDates = useMemo(() => getWeekDates(startDate), [startDate]);

  // 日付入力でどの日を選んでも、その週の月曜に合わせる
  const handleStartDateChange = (value) => {
    if (value) setStartDate(getMondayOf(parseLocalDate(value)));
  };

  // 表示中の週の保存済み結果(なければ未生成)
  const savedShift = getSavedShift(weekDates[0]);

  const handleGenerate = () => {
    if (savedShift && !window.confirm('この週の保存済みのシフトは、新しい案に置き換わります。よろしいですか?')) return;
    saveShift(weekDates[0], generateWeeklyShift(staffList, weekDates));
    setActiveTab('viewer');
    setIsSidebarOpen(false);
  };

  return (
    <div translate="no" className="h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden relative">
      <MobileHeader onMenuOpen={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerate={handleGenerate}
      />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        {activeTab === 'viewer' ? (
          <ShiftViewer
            staffList={staffList}
            weekDates={weekDates}
            startDate={startDate}
            onStartDateChange={handleStartDateChange}
            generatedShift={savedShift ? savedShift.schedule : {}}
            generatedAt={savedShift ? savedShift.generatedAt : null}
          />
        ) : (
          <StaffSettings
            staffList={staffList}
            editingStaff={editingStaff}
            setEditingStaff={setEditingStaff}
            onUpdateStaff={updateStaff}
            onDeleteStaff={deleteStaff}
            onAddStaff={addStaff}
            onAddOffDate={addOffDate}
            onRemoveOffDate={removeOffDate}
          />
        )}
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
};

export default App;
