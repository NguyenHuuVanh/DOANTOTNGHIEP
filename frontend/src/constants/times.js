import dayjs from "dayjs";

export const TIMEPARAMS = {
  BEGIN: "00:00",
  END: "23:59",
  format: "HH:mm",
  startTime: dayjs("00:00", "HH:mm"),
  endTime: dayjs("00:00", "HH:mm"),
  rangePresets: [
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
  ],
};
