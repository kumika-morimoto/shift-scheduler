import { useState, useEffect } from 'react';
import { initialStaff } from '../data/initialStaff';
import { COLORS } from '../data/constants';

const STORAGE_KEY = 'shift_staff_v32_real';

export const useStaffList = () => {
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // 保存データが壊れている/存在しない場合は初期データにフォールバックする
    }
    return initialStaff;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
  }, [staffList]);

  const updateStaff = (updated) => {
    setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const addStaff = (name, type) => {
    if (!name.trim()) return;
    setStaffList(prev => {
      const newStaff = {
        id: Date.now(),
        name,
        type,
        color: COLORS[prev.length % COLORS.length],
        maxDailyHours: 8,
        maxWeeklyDays: 5,
        freeHours: [9, 18],
        pref: { 0:[9,18,false], 1:[9,18,false], 2:[9,18,false], 3:[9,18,false], 4:[9,18,false], 5:[0,0,true], 6:[0,0,true] },
        offDates: []
      };
      return [newStaff, ...prev];
    });
  };

  const deleteStaff = (staffId) => {
    setStaffList(prev => prev.filter(s => s.id !== staffId));
  };

  const addOffDate = (staffId, date) => {
    if (!date) return;
    setStaffList(prev => prev.map(s => {
      if (s.id !== staffId || s.offDates.includes(date)) return s;
      return { ...s, offDates: [...s.offDates, date].sort() };
    }));
  };

  const removeOffDate = (staffId, date) => {
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, offDates: s.offDates.filter(d => d !== date) } : s));
  };

  return { staffList, updateStaff, addStaff, deleteStaff, addOffDate, removeOffDate };
};
