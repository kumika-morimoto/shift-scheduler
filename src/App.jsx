import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Trash2, 
  RefreshCw, ShieldCheck, Menu, LayoutDashboard,
  Clock, Plus, X, Edit3, UserPlus, CalendarOff, Repeat
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('viewer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); 
  
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffType, setNewStaffType] = useState('free');

  const getInitialMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getInitialMonday());

  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 
    'bg-orange-100 text-orange-700 border-orange-200', 'bg-purple-100 text-purple-700 border-purple-200',
    'bg-rose-100 text-rose-700 border-rose-200', 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'bg-slate-100 text-slate-700 border-slate-200', 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-teal-100 text-teal-700 border-teal-200', 'bg-pink-100 text-pink-700 border-pink-200',
    'bg-yellow-100 text-yellow-700 border-yellow-200', 'bg-lime-100 text-lime-700 border-lime-200',
    'bg-amber-100 text-amber-700 border-amber-200', 'bg-sky-100 text-sky-700 border-sky-200'
  ];

  const initialStaff = [
    { id: 1, name: 'Staff01', type: 'free', color: colors[0], maxDailyHours: 3, maxWeeklyDays: 3, freeHours: [6, 9], offDates: [], pref: { 0:[6,9,false], 1:[6,9,false], 2:[6,9,false], 3:[6,9,false], 4:[6,9,false], 5:[6,9,false], 6:[6,9,false] } },
    { id: 2, name: 'Staff02', type: 'fixed', color: colors[1], maxDailyHours: 6, maxWeeklyDays: 5, freeHours: [6, 12], pref: { 0:[6,12,false], 1:[6,12,false], 2:[6,12,false], 3:[6,12,false], 4:[6,12,false], 5:[0,0,true], 6:[0,0,true] }, offDates: [] },
    { id: 3, name: 'Staff03', type: 'fixed', color: colors[2], maxDailyHours: 3, maxWeeklyDays: 2, freeHours: [6, 9], pref: { 0:[0,0,true], 1:[0,0,true], 2:[0,0,true], 3:[0,0,true], 4:[0,0,true], 5:[6,9,false], 6:[6,9,false] }, offDates: [] },
    { id: 4, name: 'Staff04', type: 'fixed', color: colors[3], maxDailyHours: 3, maxWeeklyDays: 3, freeHours: [14, 17], pref: { 0:[14,17,false], 1:[0,0,true], 2:[14,17,false], 3:[14,17,false], 4:[0,0,true], 5:[0,0,true], 6:[0,0,true] }, offDates: [] },
    { id: 5, name: 'Staff05', type: 'fixed', color: colors[4], maxDailyHours: 8, maxWeeklyDays: 3, freeHours: [9, 18], pref: { 0:[0,0,true], 1:[0,0,true], 2:[0,0,true], 3:[9,18,false], 4:[0,0,true], 5:[9,18,false], 6:[9,18,false] }, offDates: [] },
    { id: 6, name: 'Staff06', type: 'free', color: colors[5], maxDailyHours: 5, maxWeeklyDays: 4, freeHours: [9, 17], offDates: [], pref: { 0:[9,17,false], 1:[9,17,false], 2:[9,17,false], 3:[9,17,false], 4:[9,17,false], 5:[9,17,false], 6:[9,17,false] } },
    { id: 7, name: 'Staff07', type: 'free', color: colors[6], maxDailyHours: 8, maxWeeklyDays: 5, freeHours: [12, 24], offDates: [], pref: { 0:[12,24,false], 1:[12,24,false], 2:[12,24,false], 3:[12,24,false], 4:[12,24,false], 5:[12,24,false], 6:[12,24,false] } },
    { id: 8, name: 'Staff08', type: 'free', color: colors[7], maxDailyHours: 10, maxWeeklyDays: 5, freeHours: [12, 30], offDates: [], pref: { 0:[12,30,false], 1:[12,30,false], 2:[12,30,false], 3:[12,30,false], 4:[12,30,false], 5:[12,30,false], 6:[12,30,false] } },
    { id: 9, name: 'Staff09', type: 'free', color: colors[8], maxDailyHours: 5, maxWeeklyDays: 3, freeHours: [17, 22], offDates: [], pref: { 0:[17,22,false], 1:[17,22,false], 2:[17,22,false], 3:[17,22,false], 4:[17,22,false], 5:[17,22,false], 6:[17,22,false] } },
    { id: 10, name: 'Staff10', type: 'free', color: colors[9], maxDailyHours: 5, maxWeeklyDays: 3, freeHours: [17, 22], offDates: [], pref: { 0:[17,22,false], 1:[17,22,false], 2:[17,22,false], 3:[17,22,false], 4:[17,22,false], 5:[17,22,false], 6:[17,22,false] } },
    { id: 11, name: 'Staff11', type: 'free', color: colors[10], maxDailyHours: 11, maxWeeklyDays: 6, freeHours: [22, 33], offDates: [], pref: { 0:[22,33,false], 1:[22,33,false], 2:[22,33,false], 3:[22,33,false], 4:[22,33,false], 5:[22,33,false], 6:[22,33,false] } },
    { id: 12, name: 'Staff12', type: 'free', color: colors[11], maxDailyHours: 3, maxWeeklyDays: 3, freeHours: [6, 15], offDates: [], pref: { 0:[6,15,false], 1:[6,15,false], 2:[6,15,false], 3:[6,15,false], 4:[6,15,false], 5:[6,15,false], 6:[6,15,false] } },
    { id: 13, name: 'Staff13', type: 'free', color: colors[12], maxDailyHours: 5, maxWeeklyDays: 5, freeHours: [7, 12], offDates: [], pref: { 0:[7,12,false], 1:[7,12,false], 2:[7,12,false], 3:[7,12,false], 4:[7,12,false], 5:[7,12,false], 6:[7,12,false] } },
    { id: 14, name: 'Staff14', type: 'fixed', color: colors[13], maxDailyHours: 3, maxWeeklyDays: 5, freeHours: [19, 22], pref: { 0:[19,22,false], 1:[19,22,false], 2:[19,22,false], 3:[19,22,false], 4:[0,0,true], 5:[19,22,false], 6:[0,0,true] }, offDates: [] },
  ];

  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem('shift_staff_v32_real');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return initialStaff;
  });

  const [generatedShift, setGeneratedShift] = useState({});

  useEffect(() => {
    localStorage.setItem('shift_staff_v32_real', JSON.stringify(staffList));
  }, [staffList]);

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

  const generateWeeklyShift = () => {
    const newShift = {};
    const staffWeeklyDaysCount = {};
    staffList.forEach(s => staffWeeklyDaysCount[s.id] = 0);

    const shiftState = weekDates.map((dateStr, dIdx) => {
      const hourlyPlan = {};
      for(let h=6; h<36; h++) { hourlyPlan[h] = (h >= 22 && h < 30) ? 1 : 2; }
      newShift[dateStr] = { assignments: {} };
      return { dateStr, dIdx, hourlyPlan };
    });

    const tryAssign = (state, hTarget, pool) => {
      if (state.hourlyPlan[hTarget] <= 0) return false;
      const candidates = pool
        .filter(s => staffWeeklyDaysCount[s.id] < s.maxWeeklyDays)
        .filter(s => {
            if (s.offDates && s.offDates.includes(state.dateStr)) return false;
            if (newShift[state.dateStr].assignments[s.id]) return false;
            let sStart, sEnd, isDisabled;
            if (s.type === 'fixed') {
              const config = s.pref?.[state.dIdx] || [0, 0, true];
              [sStart, sEnd, isDisabled] = config;
            } else {
              [sStart, sEnd] = s.freeHours || [0, 0];
              isDisabled = false;
            }
            if (isDisabled) return false;
            return hTarget >= sStart && hTarget < sEnd;
        })
        .map(s => {
          let [sStart, sEnd] = s.type === 'fixed' ? [s.pref?.[state.dIdx]?.[0] || 0, s.pref?.[state.dIdx]?.[1] || 0] : s.freeHours;
          let count = 0;
          for(let th = hTarget; th < Math.min(hTarget + (s.maxDailyHours || 8), sEnd); th++) {
            if (state.hourlyPlan[th] > 0) count++;
            else break;
          }
          return { ...s, count };
        })
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count);

      if (candidates.length > 0) {
        const selected = candidates[0];
        const block = [];
        for (let bh = hTarget; bh < hTarget + selected.count; bh++) {
          block.push(bh);
          state.hourlyPlan[bh]--;
        }
        newShift[state.dateStr].assignments[selected.id] = block;
        staffWeeklyDaysCount[selected.id]++;
        return true;
      }
      return false;
    };

    shiftState.forEach(state => { for(let h=22; h<30; h++) { if (state.hourlyPlan[h] > 0) tryAssign(state, h, staffList); } });
    const fixedStaff = staffList.filter(s => s.type === 'fixed');
    shiftState.forEach(state => { for(let h=6; h<36; h++) { if (h >= 22 && h < 30) continue; tryAssign(state, h, fixedStaff); } });
    shiftState.forEach(state => { for(let h=6; h<36; h++) { if (h >= 22 && h < 30) continue; while(state.hourlyPlan[h] > 0) { if (!tryAssign(state, h, staffList)) break; } } });
    
    setGeneratedShift(newShift);
    setActiveTab('viewer');
    setIsSidebarOpen(false);
  };

  const handleUpdateStaff = (updated) => {
    setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const parseInputValue = (val) => {
    if (val === "") return "";
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // 時刻選択肢の生成 (6時〜35時)
  // 表記: 24時以降は「翌0時」「翌1時」とする
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 6; h <= 35; h++) {
      let label = h >= 24 ? `翌${h - 24}` : h;
      options.push({ value: h, label: `${label}:00` });
    }
    return options;
  }, []);

  const addNewStaff = () => {
    if (!newStaffName.trim()) return;
    const newId = Date.now();
    const newStaff = {
      id: newId,
      name: newStaffName,
      type: newStaffType,
      color: colors[staffList.length % colors.length],
      maxDailyHours: 8,
      maxWeeklyDays: 5,
      freeHours: [9, 18],
      pref: { 0:[9,18,false], 1:[9,18,false], 2:[9,18,false], 3:[9,18,false], 4:[9,18,false], 5:[0,0,true], 6:[0,0,true] },
      offDates: []
    };
    setStaffList([newStaff, ...staffList]);
    setNewStaffName('');
  };

  const deleteStaff = (e, staffId) => {
    e.stopPropagation();
    setStaffList((prev) => prev.filter(s => s.id !== staffId));
    if (editingStaff === staffId) setEditingStaff(null);
  };

  const addOffDate = (staffId, date) => {
    if (!date) return;
    const staff = staffList.find(s => s.id === staffId);
    if (!staff.offDates.includes(date)) {
      handleUpdateStaff({...staff, offDates: [...staff.offDates, date].sort()});
    }
  };

  const removeOffDate = (staffId, date) => {
    const staff = staffList.find(s => s.id === staffId);
    handleUpdateStaff({...staff, offDates: staff.offDates.filter(d => d !== date)});
  };

  const getDayLaneData = (date) => {
    const dayData = generatedShift[date];
    if (!dayData) return [[], [], []];
    const segments = [];
    staffList.forEach(staff => {
      const hours = dayData.assignments[staff.id] || [];
      if (hours.length > 0) {
        segments.push({ staffId: staff.id, name: staff.name, color: staff.color, hours, start: hours[0], duration: hours.length });
      }
    });
    const lanes = [[], [], []];
    segments.sort((a,b) => a.start - b.start).forEach(seg => {
      for (let i = 0; i < lanes.length; i++) {
        const conflict = lanes[i].some(ex => ex.hours.some(h => seg.hours.includes(h)));
        if (!conflict) {
          lanes[i].push(seg);
          return;
        }
      }
    });
    return lanes;
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden relative">
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b z-[150]">
        <div className="flex items-center gap-2 font-black text-indigo-600 italic"><ShieldCheck size={20}/> SHIFT MASTER</div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Menu size={24} /></button>
      </header>

      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed inset-y-0 left-0 z-[210] bg-white w-72 border-r transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-out flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 font-black text-xl text-indigo-600 italic"><ShieldCheck /> SHIFT MASTER</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
        </div>
        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab('viewer')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'viewer' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={20}/> シフト表示</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}><Users size={20}/> スタッフ一覧</button>
        </nav>
        <div className="pt-6 border-t mt-6">
          <button onClick={generateWeeklyShift} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"><RefreshCw size={18} /> シフト生成</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        {activeTab === 'viewer' ? (
          <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-fadeIn">
            <div className="bg-white p-5 rounded-[1.5rem] border shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-lg font-black tracking-tight italic">REAL DATA PLANNER</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Management of {staffList.length} Active Staffs</p>
                </div>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-100 border-none p-2 rounded-lg font-black text-xs outline-none" />
            </div>

            <div className="space-y-6">
              {weekDates.map((date, dIdx) => {
                const lanes = getDayLaneData(date);
                return (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <span className={`text-2xl font-black italic ${dIdx >= 5 ? 'text-rose-500' : 'text-slate-800'}`}>{days[dIdx]}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{date}</span>
                    </div>
                    <div className="bg-white border rounded-[1.5rem] shadow-sm p-4 overflow-x-auto custom-scrollbar">
                      <div className="min-w-[1000px] relative">
                        {/* シフト表示ヘッダー（時刻表記）の修正 */}
                        <div className="flex mb-4 border-b border-slate-50 pb-2">
                           {Array.from({length: 30}).map((_, i) => {
                             const hourVal = i + 6;
                             // 24時以降は「翌0」「翌1」...
                             const label = hourVal >= 24 ? `翌${hourVal - 24}` : hourVal;
                             return (
                               <div key={i} className={`flex-1 text-center text-[9px] font-black ${hourVal >= 22 && hourVal < 30 ? 'text-indigo-600 underline' : 'text-slate-300'}`}>{label}</div>
                             );
                           })}
                        </div>
                        <div className="space-y-1">
                           {lanes.map((lane, lIdx) => (
                             <div key={lIdx} className="h-10 relative flex items-center">
                                {lane.map((seg, sIdx) => (
                                  <div key={sIdx} className={`absolute h-8 rounded-lg border border-white shadow-sm flex items-center justify-center ${seg.color}`} style={{ left: `${((seg.start - 6) / 30) * 100}%`, width: `${(seg.duration / 30) * 100}%` }}>
                                    <span className="text-[9px] font-black truncate px-1">{seg.name}</span>
                                  </div>
                                ))}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
             <div className="bg-white border rounded-[1.5rem] p-6 shadow-sm mb-8 border-dashed border-indigo-200">
                <h3 className="text-sm font-black text-indigo-600 italic uppercase mb-4 flex items-center gap-2"><UserPlus size={18} /> Add New Member</h3>
                <div className="flex flex-wrap gap-4 items-end">
                   <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] font-black text-slate-400 block mb-1">スタッフ名</label>
                      <input type="text" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold outline-none" placeholder="名前"/>
                   </div>
                   <button onClick={addNewStaff} className="bg-indigo-600 text-white p-3 rounded-xl font-black shadow-md"><Plus size={20} /></button>
                </div>
             </div>

             <div className="grid gap-3">
                {staffList.map(staff => (
                  <div key={staff.id} className="bg-white border rounded-[1.2rem] p-4 shadow-sm hover:border-slate-200 transition-all overflow-hidden">
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
                          <button onClick={() => setEditingStaff(editingStaff === staff.id ? null : staff.id)} className={`p-2 rounded-lg transition-all ${editingStaff === staff.id ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`}><Edit3 size={18}/></button>
                          <button onClick={(e) => deleteStaff(e, staff.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                        </div>
                     </div>

                     {editingStaff === staff.id && (
                       <div className="mt-4 pt-4 border-t space-y-6 animate-slideDown">
                         <div>
                           <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest flex items-center gap-1"><Repeat size={12}/> Current Work Mode</label>
                           <div className="flex bg-slate-100 p-1 rounded-xl">
                             <button onClick={() => handleUpdateStaff({...staff, type: 'free'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${staff.type === 'free' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>自由シフト</button>
                             <button onClick={() => handleUpdateStaff({...staff, type: 'fixed'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${staff.type === 'fixed' ? 'bg-white shadow text-amber-600' : 'text-slate-400'}`}>曜日固定</button>
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="text-[10px] font-black text-slate-400 block mb-1">最大勤務時間/日</label>
                             <input type="number" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" value={staff.maxDailyHours} onChange={e => handleUpdateStaff({...staff, maxDailyHours: parseInputValue(e.target.value)})} />
                           </div>
                           <div>
                             <label className="text-[10px] font-black text-slate-400 block mb-1">最大勤務日数/週</label>
                             <input type="number" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" value={staff.maxWeeklyDays} onChange={e => handleUpdateStaff({...staff, maxWeeklyDays: parseInputValue(e.target.value)})} />
                           </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`p-4 rounded-2xl border ${staff.type === 'free' ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 opacity-40'}`}>
                               <label className="text-[10px] font-black text-blue-600 block mb-2 underline tracking-tighter">自由シフト設定（時間指定）</label>
                               <div className="flex items-center gap-2">
                                  <select 
                                    className="w-full p-2 text-xs font-bold rounded-lg border bg-white appearance-none text-center" 
                                    value={staff.freeHours[0]} 
                                    onChange={e => handleUpdateStaff({...staff, freeHours:[Number(e.target.value), staff.freeHours[1]]})}
                                  >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                  </select>
                                  <span className="text-slate-400">～</span>
                                  <select 
                                    className="w-full p-2 text-xs font-bold rounded-lg border bg-white appearance-none text-center" 
                                    value={staff.freeHours[1]} 
                                    onChange={e => handleUpdateStaff({...staff, freeHours:[staff.freeHours[0], Number(e.target.value)]})}
                                  >
                                    {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                  </select>
                               </div>
                           </div>
                           <div className={`p-4 rounded-2xl border ${staff.type === 'fixed' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 opacity-40'}`}>
                               <label className="text-[10px] font-black text-amber-600 block mb-2 underline tracking-tighter">曜日固定設定（個別）</label>
                               <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
                                 {days.map((day, idx) => {
                                   const [start, end, isDisabled] = staff.pref?.[idx] || [0, 0, true];
                                   return (
                                     <div key={idx} className="flex items-center gap-2 text-[10px]">
                                         <button onClick={() => {
                                           const newPref = {...staff.pref};
                                           newPref[idx] = [start, end, !isDisabled];
                                           handleUpdateStaff({...staff, pref: newPref});
                                         }} className={`w-5 h-5 rounded font-black shrink-0 ${isDisabled ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white'}`}>{day}</button>
                                         {!isDisabled && (
                                           <div className="flex items-center gap-1 flex-1">
                                              <select 
                                                value={start} 
                                                onChange={e => {
                                                  const newPref = {...staff.pref};
                                                  newPref[idx] = [Number(e.target.value), end, isDisabled];
                                                  handleUpdateStaff({...staff, pref: newPref});
                                                }} 
                                                className="w-full p-1 text-[10px] font-bold border rounded bg-white text-center"
                                              >
                                                {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                              </select>
                                              <span className="text-slate-300">～</span>
                                              <select 
                                                value={end} 
                                                onChange={e => {
                                                  const newPref = {...staff.pref};
                                                  newPref[idx] = [start, Number(e.target.value), isDisabled];
                                                  handleUpdateStaff({...staff, pref: newPref});
                                                }} 
                                                className="w-full p-1 text-[10px] font-bold border rounded bg-white text-center"
                                              >
                                                {timeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                              </select>
                                           </div>
                                         )}
                                     </div>
                                   );
                                 })}
                               </div>
                           </div>
                         </div>

                         <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                             <div className="flex items-center justify-between mb-3 font-black text-rose-600 text-[10px] uppercase">
                               <label><CalendarOff size={14} className="inline mr-1"/> Holiday Settings</label>
                               <input type="date" className="text-[10px] p-1 rounded border border-rose-200 bg-white" onChange={(e) => { addOffDate(staff.id, e.target.value); e.target.value = ''; }} />
                             </div>
                             <div className="flex flex-wrap gap-1">
                                {staff.offDates?.map(date => (
                                  <div key={date} className="bg-white border border-rose-200 px-2 py-0.5 rounded flex items-center gap-2">
                                     <span className="text-[9px] font-bold text-rose-600">{date}</span>
                                     <button onClick={() => removeOffDate(staff.id, date)} className="text-rose-300 hover:text-rose-600"><X size={10}/></button>
                                  </div>
                                ))}
                             </div>
                         </div>
                         
                         <button onClick={() => setEditingStaff(null)} className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-black">設定を閉じる</button>
                       </div>
                     )}
                  </div>
                ))}
             </div>
          </div>
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