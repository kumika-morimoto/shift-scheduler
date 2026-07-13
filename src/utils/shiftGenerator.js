export const generateShift = (staffList, weekDates) => {
  const newShift = {};
  const staffWeeklyDaysCount = {};
  staffList.forEach(s => { staffWeeklyDaysCount[s.id] = 0; });

  const shiftState = weekDates.map((dateStr, dIdx) => {
    const hourlyPlan = {};
    for (let h = 6; h < 36; h++) { hourlyPlan[h] = (h >= 22 && h < 30) ? 1 : 2; }
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
        const [, sEnd] = s.type === 'fixed'
          ? [s.pref?.[state.dIdx]?.[0] || 0, s.pref?.[state.dIdx]?.[1] || 0]
          : s.freeHours;
        let count = 0;
        for (let th = hTarget; th < Math.min(hTarget + (s.maxDailyHours || 8), sEnd); th++) {
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

  shiftState.forEach(state => {
    for (let h = 22; h < 30; h++) {
      if (state.hourlyPlan[h] > 0) tryAssign(state, h, staffList);
    }
  });
  const fixedStaff = staffList.filter(s => s.type === 'fixed');
  shiftState.forEach(state => {
    for (let h = 6; h < 36; h++) {
      if (h >= 22 && h < 30) continue;
      tryAssign(state, h, fixedStaff);
    }
  });
  shiftState.forEach(state => {
    for (let h = 6; h < 36; h++) {
      if (h >= 22 && h < 30) continue;
      while (state.hourlyPlan[h] > 0) {
        if (!tryAssign(state, h, staffList)) break;
      }
    }
  });

  return newShift;
};
