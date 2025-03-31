import moment from "moment";

/**
 * Lọc dữ liệu trong khoảng ngày + giờ
 * @param {Array} dataNodes - Mảng dữ liệu gốc
 * @param {Array} dateRange - Mảng ngày dạng ["DD-MM-YYYY", "DD-MM-YYYY"]
 * @param {Array} timeRange - Mảng giờ dạng ["HH:mm", "HH:mm"]
 * @returns {Array} filteredData
 */
export const filterDataByDateTime = (dataNodes, dateRange, timeRange) => {
  if (!Array.isArray(dateRange) || dateRange.length < 2 || !dateRange[0] || !dateRange[1]) {
    throw new Error("Khoảng ngày không hợp lệ");
  }

  if (!Array.isArray(timeRange) || timeRange.length < 2 || !timeRange[0] || !timeRange[1]) {
    throw new Error("Khoảng giờ không hợp lệ");
  }

  const [startDateStr, endDateStr] = dateRange;
  const [startTimeStr, endTimeStr] = timeRange;

  const start = moment(`${startDateStr} ${startTimeStr}`, "DD-MM-YYYY HH:mm");
  const end = moment(`${endDateStr} ${endTimeStr}`, "DD-MM-YYYY HH:mm");

  if (!start.isValid() || !end.isValid()) {
    throw new Error("Thời gian không hợp lệ");
  }

  if (start.isAfter(end)) {
    throw new Error("Thời gian bắt đầu phải trước thời gian kết thúc");
  }

  const filtered = dataNodes.filter((item) => {
    const itemTime = moment(`${item.date} ${item.time}`, "DD-MM-YYYY HH:mm");
    return itemTime.isBetween(start, end, "minutes", "[]");
  });

  return filtered;
};
