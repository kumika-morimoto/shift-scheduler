import { useState, useMemo } from 'react';
import MobileHeader from './components/MobileHeader';
import Sidebar from './components/Sidebar';
import ShiftViewer from './components/ShiftViewer';
import StaffSettings from './components/StaffSettings';
import { useStaffList } from './hooks/useStaffList';
import { generateWeeklyShift } from './utils/shiftGenerator';

const getInitialMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const App = () => {
  const [activeTab, setActiveTab] = useState('viewer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [startDate, setStartDate] = useState(getInitialMonday);
  const [generatedShift, setGeneratedShift] = useState({});

  const { staffList, updateStaff, addStaff, deleteStaff, addOffDate, removeOffDate } = useStaffList();

  const weekDates = useMemo(() => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [startDate]);

  const handleGenerate = () => {
    setGeneratedShift(generateWeeklyShift(staffList, weekDates));
    setActiveTab('viewer');
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 overflow-hidden relative">
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
            setStartDate={setStartDate}
            generatedShift={generatedShift}
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
