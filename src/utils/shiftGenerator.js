// シフト自動生成ロジック
//
// 前提(README準拠):
// - 1日を6:00〜翌6:00(内部時間インデックス 6〜29)として扱う
// - 22:00〜翌6:00(インデックス22〜29)は夜間帯: 必要人数1人
// - それ以外は日中帯: 必要人数2人
// - 同じスタッフの勤務は、前の勤務終了から次の勤務開始まで
//   最低 MIN_INTERVAL_HOURS 時間空ける(勤務間インターバル)
// - ①夜間帯を全スタッフから優先的に埋める
// - ②固定シフト(fixed)のスタッフだけで日中帯を埋める
// - ③残った日中帯を全スタッフ対象にできるだけ埋める(埋まらない枠はそのまま「空席」として残る)

const MIN_INTERVAL_HOURS = 12; // 勤務間インターバル(最低休息時間)。将来変更する場合はここだけ直せばよい

export const generateWeeklyShift = (staffList, weekDates) => {
  const newShift = {};
  const staffWeeklyDaysCount = {};
  const staffAssignedBlocks = {}; // { [staffId]: [{start, end}, ...] } 週内の絶対時間で管理
  staffList.forEach(s => { staffWeeklyDaysCount[s.id] = 0; staffAssignedBlocks[s.id] = []; });

  const shiftState = weekDates.map((dateStr, dIdx) => {
    const hourlyPlan = {};
    for (let h = 6; h < 30; h++) { hourlyPlan[h] = (h >= 22 && h < 30) ? 1 : 2; }
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
        const [, sEnd] = s.type === 'fixed' ? [s.pref?.[state.dIdx]?.[0] || 0, s.pref?.[state.dIdx]?.[1] || 0] : s.freeHours;
        let count = 0;
        for (let th = hTarget; th < Math.min(hTarget + (s.maxDailyHours || 8), sEnd); th++) {
          if (state.hourlyPlan[th] > 0) count++;
          else break;
        }
        return { ...s, count };
      })
      .filter(c => c.count > 0)
      .filter(c => {
        // 勤務間インターバル(最低12時間)チェック
        const newStart = state.dIdx * 24 + hTarget;
        const newEnd = state.dIdx * 24 + hTarget + c.count;
        const existing = staffAssignedBlocks[c.id] || [];
        return existing.every(b => {
          const gapAfter = newStart - b.end;
          const gapBefore = b.start - newEnd;
          return gapAfter >= MIN_INTERVAL_HOURS || gapBefore >= MIN_INTERVAL_HOURS;
        });
      })
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
      staffAssignedBlocks[selected.id].push({
        start: state.dIdx * 24 + hTarget,
        end: state.dIdx * 24 + hTarget + selected.count
      });
      return true;
    }
    return false;
  };

  shiftState.forEach(state => { for (let h = 22; h < 30; h++) { if (state.hourlyPlan[h] > 0) tryAssign(state, h, staffList); } });
  const fixedStaff = staffList.filter(s => s.type === 'fixed');
  shiftState.forEach(state => { for (let h = 6; h < 30; h++) { if (h >= 22 && h < 30) continue; tryAssign(state, h, fixedStaff); } });
  shiftState.forEach(state => { for (let h = 6; h < 30; h++) { if (h >= 22 && h < 30) continue; while (state.hourlyPlan[h] > 0) { if (!tryAssign(state, h, staffList)) break; } } });

  return newShift;
};
