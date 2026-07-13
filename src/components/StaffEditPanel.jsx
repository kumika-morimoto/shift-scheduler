import { CalendarOff, X, Repeat } from 'lucide-react';
import { TIME_OPTIONS } from '../utils/timeOptions';
import { DAYS } from '../data/constants';
import { parseInputValue } from '../utils/parseInputValue';

const StaffEditPanel = ({ staff, onUpdateStaff, onAddOffDate, onRemoveOffDate, onClose }) => (
  <div className="mt-4 pt-4 border-t space-y-6 animate-slideDown">
    <div>
      <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest flex items-center gap-1"><Repeat size={12}/> Current Work Mode</label>
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button onClick={() => onUpdateStaff({...staff, type: 'free'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${staff.type === 'free' ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>自由シフト</button>
        <button onClick={() => onUpdateStaff({...staff, type: 'fixed'})} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${staff.type === 'fixed' ? 'bg-white shadow text-amber-600' : 'text-slate-400'}`}>曜日固定</button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[10px] font-black text-slate-400 block mb-1">最大勤務時間/日</label>
        <input type="number" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" value={staff.maxDailyHours} onChange={e => onUpdateStaff({...staff, maxDailyHours: parseInputValue(e.target.value)})} />
      </div>
      <div>
        <label className="text-[10px] font-black text-slate-400 block mb-1">最大勤務日数/週</label>
        <input type="number" className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm font-bold" value={staff.maxWeeklyDays} onChange={e => onUpdateStaff({...staff, maxWeeklyDays: parseInputValue(e.target.value)})} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className={`p-4 rounded-2xl border ${staff.type === 'free' ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 opacity-40'}`}>
        <label className="text-[10px] font-black text-blue-600 block mb-2 underline tracking-tighter">自由シフト設定（時間指定）</label>
        <div className="flex items-center gap-2">
          <select
            className="w-full p-2 text-xs font-bold rounded-lg border bg-white appearance-none text-center"
            value={staff.freeHours[0]}
            onChange={e => onUpdateStaff({...staff, freeHours: [Number(e.target.value), staff.freeHours[1]]})}
          >
            {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <span className="text-slate-400">～</span>
          <select
            className="w-full p-2 text-xs font-bold rounded-lg border bg-white appearance-none text-center"
            value={staff.freeHours[1]}
            onChange={e => onUpdateStaff({...staff, freeHours: [staff.freeHours[0], Number(e.target.value)]})}
          >
            {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>
      <div className={`p-4 rounded-2xl border ${staff.type === 'fixed' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 opacity-40'}`}>
        <label className="text-[10px] font-black text-amber-600 block mb-2 underline tracking-tighter">曜日固定設定（個別）</label>
        <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1">
          {DAYS.map((day, idx) => {
            const [start, end, isDisabled] = staff.pref?.[idx] || [0, 0, true];
            return (
              <div key={idx} className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => {
                    const newPref = {...staff.pref};
                    newPref[idx] = [start, end, !isDisabled];
                    onUpdateStaff({...staff, pref: newPref});
                  }}
                  className={`w-5 h-5 rounded font-black shrink-0 ${isDisabled ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white'}`}
                >
                  {day}
                </button>
                {!isDisabled && (
                  <div className="flex items-center gap-1 flex-1">
                    <select
                      value={start}
                      onChange={e => {
                        const newPref = {...staff.pref};
                        newPref[idx] = [Number(e.target.value), end, isDisabled];
                        onUpdateStaff({...staff, pref: newPref});
                      }}
                      className="w-full p-1 text-[10px] font-bold border rounded bg-white text-center"
                    >
                      {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <span className="text-slate-300">～</span>
                    <select
                      value={end}
                      onChange={e => {
                        const newPref = {...staff.pref};
                        newPref[idx] = [start, Number(e.target.value), isDisabled];
                        onUpdateStaff({...staff, pref: newPref});
                      }}
                      className="w-full p-1 text-[10px] font-bold border rounded bg-white text-center"
                    >
                      {TIME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
        <input type="date" className="text-[10px] p-1 rounded border border-rose-200 bg-white" onChange={e => { onAddOffDate(staff.id, e.target.value); e.target.value = ''; }} />
      </div>
      <div className="flex flex-wrap gap-1">
        {staff.offDates?.map(date => (
          <div key={date} className="bg-white border border-rose-200 px-2 py-0.5 rounded flex items-center gap-2">
            <span className="text-[9px] font-bold text-rose-600">{date}</span>
            <button onClick={() => onRemoveOffDate(staff.id, date)} className="text-rose-300 hover:text-rose-600"><X size={10}/></button>
          </div>
        ))}
      </div>
    </div>

    <button onClick={onClose} className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-black">設定を閉じる</button>
  </div>
);

export default StaffEditPanel;
