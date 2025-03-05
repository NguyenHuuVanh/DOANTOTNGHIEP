import {averageRounded} from "./averageNumbers";

const calculateStatistics = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn("Invalid or empty array provided for calculations.");
    return {
      Minimum: "N/A",
      Maximum: "N/A",
      Average: "N/A",
      Median: "N/A",
      Mode: "N/A",
      Range: "N/A",
      InterquartileRange: "N/A",
      StandardDeviation: "N/A",
      MeanDeviation: "N/A",
    };
  }

  // Sắp xếp mảng để tính median, IQR
  const sortedArr = [...arr].sort((a, b) => a - b);

  // Tính các giá trị thống kê
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const average = averageRounded(arr);

  const median =
    arr.length % 2 === 0
      ? (sortedArr[arr.length / 2 - 1] + sortedArr[arr.length / 2]) / 2
      : sortedArr[Math.floor(arr.length / 2)];

  // Tính mode (giá trị xuất hiện nhiều nhất)
  const frequency = {};
  let mode = [];
  let maxFreq = 0;

  arr.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      mode = [num];
    } else if (frequency[num] === maxFreq) {
      mode.push(num);
    }
  });

  mode = [...new Set(mode)]; // Loại bỏ trùng lặp
  mode = mode.length === arr.length ? "No mode" : mode; // Nếu tất cả giá trị xuất hiện một lần

  const range = max - min;
  const q1 = sortedArr[Math.floor(arr.length / 4)];
  const q3 = sortedArr[Math.floor((arr.length * 3) / 4)];
  const iqr = q3 - q1;

  const variance = arr.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / arr.length;
  const standardDeviation = Math.sqrt(variance);

  const meanDeviation = arr.reduce((sum, val) => sum + Math.abs(val - average), 0) / arr.length;

  return {
    Minimum: min,
    Maximum: max,
    Average: average.toFixed(2),
    Median: median,
    Mode: mode,
    Range: range,
    InterquartileRange: iqr,
    StandardDeviation: standardDeviation.toFixed(2),
    MeanDeviation: meanDeviation.toFixed(2),
  };
};

export default calculateStatistics;
