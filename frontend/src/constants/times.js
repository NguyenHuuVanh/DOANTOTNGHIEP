import dayjs from "dayjs";

export const TIMEPARAMS = {
  format: "HH:mm",
  startTime: dayjs("00:00", "HH:mm"),
  endTime: dayjs("00:00", "HH:mm"),
  rangePresets: [
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
  ],
};
