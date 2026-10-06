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
