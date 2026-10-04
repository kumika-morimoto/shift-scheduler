// シフト自動生成ロジック(提案用の叩き台)
//
// 1日 = 6:00〜翌6:00(内部時間 6〜29)。同日の分割勤務はしない(1人1日1ブロック)。
//
// 人数のルール(1時間ごと):
//   22:00〜翌6:00 … 登録スタッフ1人が必須(スポット不可・最優先)
//    6:00〜 9:00  … 登録スタッフ2人が必須(スポット不可)
//    9:00〜22:00  … 登録スタッフ最低1人が必須。2人目は「空席」にしてよい(スポット等で補う)
//   上限は 夜間1人 / それ以外2人
//
// 方式: 1日ずつ順に埋めるのではなく、1週間まとめて「いま一番価値の高い勤務ブロック」を
//       1つずつ決めていく(必須の時間帯が最優先)。これを乱数を少し変えて何回か繰り返し、
//       採点が一番良い案を採用する。

const MIN_INTERVAL_HOURS = 12; // 勤務間インターバル(最低休息時間)。変更はここだけ
const DAY_START = 6;
const DAY_END = 30;            // 翌6:00(この時刻は含まない)
const NIGHT_START = 22;
const MORNING_END = 9;
const RESTARTS = 40;           // 乱数を変えて作り直す回数

const isNight = (h) => h >= NIGHT_START;
const isMorning = (h) => h < MORNING_END;
const requiredAt = (h) => (isMorning(h) ? 2 : 1); // 登録スタッフが必須の人数
const capAt = (h) => (isNight(h) ? 1 : 2);         // これ以上は入れない人数

// ブロックを選ぶときの重み(必須 >> 任意)
const W_NIGHT = 150;
const W_MANDATORY = 100;
const W_OPTIONAL = 1;
const hourValue = (covered, h) =>
  covered < requiredAt(h) ? (isNight(h) ? W_NIGHT : W_MANDATORY) : W_OPTIONAL;

// スタッフの、その日の勤務可能枠 [開始, 終了) 。働けない日は null
const getWindow = (s, dIdx, date) => {
  if (s.offDates && s.offDates.includes(date)) return null;
  let start, end;
  if (s.type === 'fixed') {
    const [st, en, off] = s.pref?.[dIdx] || [0, 0, true];
    if (off) return null;
    start = st; end = en;
  } else {
    [start, end] = s.freeHours || [0, 0];
  }
  start = Math.max(DAY_START, Number(start) || 0);
  end = Math.min(DAY_END, Number(end) || 0);
  return end > start ? [start, end] : null;
};

const buildOnce = (staffList, weekDates, rng) => {
  const coverage = weekDates.map(() => new Array(DAY_END).fill(0));
  const assign = weekDates.map(() => ({}));
  const blocks = {};
  const used = {};
  staffList.forEach((s) => { blocks[s.id] = []; used[s.id] = 0; });
  const windows = staffList.map((s) => weekDates.map((date, d) => getWindow(s, d, date)));

  for (;;) {
    let best = null;
    let bestScore = 0;
    staffList.forEach((s, si) => {
      const maxW = Number(s.maxWeeklyDays) || 0;
      if (used[s.id] >= maxW) return;
      const maxD = Number(s.maxDailyHours) || 8;
      weekDates.forEach((_, d) => {
        const w = windows[si][d];
        if (!w || assign[d][s.id]) return;
        const [ws, we] = w;
        const desired = Math.min(maxD, we - ws);
        for (let a = ws; a < we; a++) {
          let b = a;
          let gain = 0;
          while (b < we && b - a < maxD && coverage[d][b] < capAt(b)) {
            gain += hourValue(coverage[d][b], b);
            b++;
          }
          if (b === a) continue;
          const start = d * 24 + a;
          const end = d * 24 + b;
          const okInterval = blocks[s.id].every(
            (x) => start - x.end >= MIN_INTERVAL_HOURS || x.start - end >= MIN_INTERVAL_HOURS
          );
          if (!okInterval) continue;
          // 希望の時間数(最大勤務時間)に近いほど少し加点
          const score = (gain + (30 * (b - a)) / desired) * (1 + 0.1 * rng());
          if (score > bestScore) {
            bestScore = score;
            best = { s, d, a, b };
          }
        }
      });
    });
    if (!best) break;
    const { s, d, a, b } = best;
    const hours = [];
    for (let h = a; h < b; h++) { hours.push(h); coverage[d][h]++; }
    assign[d][s.id] = hours;
    blocks[s.id].push({ start: d * 24 + a, end: d * 24 + b });
    used[s.id]++;
  }
  return { assign, coverage };
};

// 案の採点(小さいほど良い)
const penalty = (staffList, weekDates, { assign, coverage }) => {
  let nightGap = 0, mandatoryGap = 0, spot = 0, shortfall = 0;
  coverage.forEach((c) => {
    for (let h = DAY_START; h < DAY_END; h++) {
      if (isNight(h)) { if (c[h] < 1) nightGap++; }
      else {
        mandatoryGap += Math.max(0, requiredAt(h) - c[h]);
        if (!isMorning(h) && c[h] < 2) spot++;
      }
    }
  });
  weekDates.forEach((_, d) => {
    Object.entries(assign[d]).forEach(([id, hours]) => {
      const s = staffList.find((x) => String(x.id) === id);
      const w = getWindow(s, d, weekDates[d]);
      const desired = Math.min(Number(s.maxDailyHours) || 8, w[1] - w[0]);
      shortfall += Math.max(0, desired - hours.length);
    });
  });
  return nightGap * 1e6 + mandatoryGap * 1e4 + shortfall * 100 + spot * 10;
};

// 戻り値の形は従来と同じ: { [日付]: { assignments: { [staffId]: [時刻, ...] } } }
export const generateWeeklyShift = (staffList, weekDates, rng = Math.random) => {
  let best = null;
  let bestPenalty = Infinity;
  for (let i = 0; i < RESTARTS; i++) {
    const result = buildOnce(staffList, weekDates, rng);
    const p = penalty(staffList, weekDates, result);
    if (p < bestPenalty) { bestPenalty = p; best = result; }
  }
  const shift = {};
  weekDates.forEach((date, d) => { shift[date] = { assignments: best.assign[d] }; });
  return shift;
};
