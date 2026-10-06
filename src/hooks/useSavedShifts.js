import { useState, useEffect } from 'react';

const STORAGE_KEY = 'shift_results_v1';
const MAX_WEEKS = 12;

// 保存データを読み込む。壊れている/形式が違う場合は空として扱う
const loadSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const result = {};
    Object.entries(parsed).forEach(([weekKey, entry]) => {
      if (entry && typeof entry.schedule === 'object' && entry.schedule !== null) {
        result[weekKey] = entry;
      }
    });
    return result;
  } catch {
    return {};
  }
};

// 今保存した週 (keepKey) は必ず残し、それ以外を新しい週から残して合計 MAX_WEEKS 件にする
const prune = (saved, keepKey) => {
  const others = Object.keys(saved).filter(k => k !== keepKey).sort().reverse().slice(0, MAX_WEEKS - 1);
  return Object.fromEntries([keepKey, ...others].map(k => [k, saved[k]]));
};

export const useSavedShifts = () => {
  const [savedShifts, setSavedShifts] = useState(loadSaved);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedShifts));
    } catch {
      // 容量超過やプライベートモードで保存できなくても、画面上の結果はそのまま使う
    }
  }, [savedShifts]);

  const getSavedShift = (weekKey) => savedShifts[weekKey] || null;

  const saveShift = (weekKey, schedule) => {
    setSavedShifts(prev => prune({
      ...prev,
      [weekKey]: { generatedAt: new Date().toISOString(), schedule }
    }, weekKey));
  };

  const deleteSavedShift = (weekKey) => {
    setSavedShifts(prev => {
      const next = { ...prev };
      delete next[weekKey];
      return next;
    });
  };

  return { getSavedShift, saveShift, deleteSavedShift };
};
