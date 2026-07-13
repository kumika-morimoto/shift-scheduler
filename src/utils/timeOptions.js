// 時刻選択肢 (6時〜翌6時)
// 表記: 24時以降は「翌0時」「翌1時」とする
const buildTimeOptions = () => {
  const options = [];
  for (let h = 6; h <= 30; h++) {
    const label = h >= 24 ? `翌${h - 24}` : h;
    options.push({ value: h, label: `${label}:00` });
  }
  return options;
};

export const TIME_OPTIONS = buildTimeOptions();
