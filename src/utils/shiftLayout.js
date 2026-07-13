export const getDayLaneData = (date, generatedShift, staffList) => {
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
  segments.sort((a, b) => a.start - b.start).forEach(seg => {
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
