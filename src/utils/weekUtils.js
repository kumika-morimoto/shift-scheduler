import { DAYS } from '../data/constants';

// 週の日付計算
// toISOString は UTC のため、日本時間の朝9時より前に前日になる。日付は必ずローカル時刻で扱う

// Date を YYYY-MM-DD (ローカル時刻) にする
export const toLocalDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 指定日を含む週の月曜 (日曜は前の月曜の週に属する)
export const getMondayOf = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return toLocalDateStr(d);
};

// YYYY-MM-DD をローカル時刻の Date にする
export const parseLocalDate = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// 開始日から7日分の YYYY-MM-DD
export const getWeekDates = (startDate) => {
  const start = parseLocalDate(startDate);
  return Array.from({ length: 7 }, (_, i) =>
    toLocalDateStr(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  );
};

// 「10/12(月)〜10/18(日)」の形式 (weekDates は月曜始まり)
export const formatWeekRange = (weekDates) => {
  const fmt = (str, idx) => {
    const d = parseLocalDate(str);
    return `${d.getMonth() + 1}/${d.getDate()}(${DAYS[idx]})`;
  };
  return `${fmt(weekDates[0], 0)}〜${fmt(weekDates[6], 6)}`;
};
