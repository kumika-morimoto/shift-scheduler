import { DAYS } from '../data/constants';
import { getDayLaneData } from '../utils/shiftLayout';

const ShiftViewer = ({ staffList, weekDates, startDate, setStartDate, generatedShift }) => (
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
        const lanes = getDayLaneData(date, generatedShift, staffList);
        return (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2 ml-1">
              <span className={`text-2xl font-black italic ${dIdx >= 5 ? 'text-rose-500' : 'text-slate-800'}`}>{DAYS[dIdx]}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{date}</span>
            </div>
            <div className="bg-white border rounded-[1.5rem] shadow-sm p-4 overflow-x-auto custom-scrollbar">
              <div className="min-w-[1000px] relative">
                <div className="flex mb-4 border-b border-slate-50 pb-2">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hourVal = i + 6;
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
                        <div
                          key={sIdx}
                          className={`absolute h-8 rounded-lg border border-white shadow-sm flex items-center justify-center ${seg.color}`}
                          style={{ left: `${((seg.start - 6) / 24) * 100}%`, width: `${(seg.duration / 24) * 100}%` }}
                        >
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
);

export default ShiftViewer;
