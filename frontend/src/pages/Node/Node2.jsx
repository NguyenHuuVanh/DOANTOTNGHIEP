import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../../components/chart/Chart";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {DatePicker, TimePicker, Space} from "antd";
import images from "~/assets/images";
import sortedData from "~/utils/sortData";
import {averageRounded} from "~/utils/averageNumbers";
import Loader from "~/components/Loading/Loading";
import notify from "~/utils/toastify";
import {TIMEPARAMS} from "~/constants/times";
import moment from "moment";
import useFetchData from "~/hooks/useFetchData";
const format = "HH:mm";
const {RangePicker} = DatePicker;

const cx = classNames.bind(styles);

const Node2 = ({data}) => {
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [startTimeValue, setStarTimeValue] = useState(TIMEPARAMS.BEGIN);
  // const [endTimeValue, setEndTimeValue] = useState(TIMEPARAMS.END);
  const [dateRange, setDateRange] = useState([null, null]);
  const [timeRange, setTimeRange] = useState([TIMEPARAMS.BEGIN, TIMEPARAMS.END]);
  const [error, setError] = useState(null);
  const {data: dataNode, error: errorData, loading: loadingData} = useFetchData("/node_data"); // Gọi custom hook

  const processData = (data) => {
    const dataNodeFilterd = data.map((item) => {
      const time = item.created_at;
      const date = item.created_at;
      return {
        temperature: item.temperature,
        humidity: item.humidity,
        time: moment(time).format("HH:mm"),
        date: moment(date).format("DD-MM-YYYY"),
      };
    });

    const dataSorted = sortedData(dataNodeFilterd);
    setDataNodes(dataSorted);
    setFilteredData(dataSorted);
  };

  const fetchData = async () => {
    try {
      if (loadingData === false && dataNode) {
        const data = await dataNode?.node2;
        if (data) {
          processData(data);
        } else {
          setError("API không trả về dữ liệu node1.");
          loadingData(false);
        }
      }
      if (errorData) {
        setError("Lỗi khi tải dữ liệu");
        loadingData(false);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setError("Lỗi khi gọi API");
      loadingData(false);
    }
  };

  // const onRangeDateChange = (dates, dateStrings) => {
  //   if (dates) {
  //     setStartDate(dateStrings[0]);
  //     setEndDate(dateStrings[1]);
  //   } else {
  //     console.log("Clear");
  //     fetchData();
  //   }
  // };

  // const onRangeTimeChange = (times, timesStrings) => {
  //   if (times) {
  //     console.log("🚀 ~ Node1 ~ times:", timesStrings);
  //     setStarTimeValue(timesStrings[0]);
  //     setEndTimeValue(timesStrings[1]);
  //   } else {
  //     fetchData();
  //   }
  // };

  // const handleFilter = () => {
  //   if (!startDate || !endDate) {
  //     setFilteredData(dataNodes);
  //     return;
  //   }

  //   const filtered = dataNodes.filter((item) => {
  //     const itemTime = moment(`${item.date}T${item.time}`);
  //     const start = moment(`${startDate}T${startTimeValue}`);
  //     const end = moment(`${endDate}T${endTimeValue}`);
  //     return itemTime.isBetween(start, end, null, "[]");
  //   });

  //   setFilteredData(filtered);
  // };

  // Xử lý thay đổi ngày
  const handleDateChange = (dates, dateStrings) => {
    setDateRange(dates);

    // Reset time khi ngày thay đổi
    if (!dates) {
      setTimeRange([TIMEPARAMS.BEGIN, TIMEPARAMS.END]);
    }
  };

  // Xử lý thay đổi giờ
  const handleTimeChange = (times, timeStrings) => {
    setTimeRange(times);
  };

  const handleFilter = () => {
    try {
      // Kiểm tra ngày và giờ có hợp lệ không
      if (!dateRange || dateRange.filter(Boolean).length < 2) {
        notify.error("Vui lòng chọn khoảng ngày");
        return;
      }

      if (!timeRange || timeRange.filter(Boolean).length < 2) {
        notify.error("Vui lòng chọn khoảng thời gian");
        return;
      }

      const [startDateObj, endDateObj] = dateRange;
      const [startTimeStr, endTimeStr] = timeRange;

      // Tạo moment object với timezone
      const createMoment = (date, time) =>
        moment(`${moment(date).format("YYYY-MM-DD")}T${time}`, "YYYY-MM-DDTHH:mm", true);

      const start = createMoment(startDateObj, startTimeStr);
      const end = createMoment(endDateObj, endTimeStr);

      if (!start.isValid() || !end.isValid()) {
        throw new Error("Thời gian không hợp lệ");
      }

      if (start.isAfter(end)) {
        notify.error("Thời gian bắt đầu phải trước thời gian kết thúc");
        return;
      }

      // Lọc dữ liệu với boundary check
      const filtered = dataNodes.filter((item) => {
        const itemTime = moment(`${item.date}T${item.time}`, "YYYY-MM-DDTHH:mm", true);

        return itemTime.isBetween(start, end, "minutes", "[]");
      });

      setFilteredData(filtered.length > 0 ? filtered : []);
      notify.success(`Tìm thấy ${filtered.length} bản ghi`);
    } catch (error) {
      console.error("Lỗi lọc dữ liệu:", error);
      notify.error(error.message || "Lỗi khi lọc dữ liệu");
    }
  };

  // Hàm tính nhiệt độ và độ ẩm trung bình
  const averageTemperatureAndHumidity = () => {
    if (!dataNodes.length) return {temperature: 0, humidity: 0};

    const validTemps = dataNodes
      .slice(0, 20)
      .map((item) => item.temperature)
      .filter((temp) => typeof temp === "number" && !isNaN(temp));

    const validHumidity = dataNodes
      .slice(0, 20)
      .map((item) => item.humidity)
      .filter((humidity) => typeof humidity === "number" && !isNaN(humidity));

    if (!validTemps.length || !validHumidity.length) return {temperature: 0, humidity: 0};

    const averageTemperature = Math.round(averageRounded(validTemps));
    const averageHumidity = Math.round(averageRounded(validHumidity));

    return {temperature: averageTemperature, humidity: averageHumidity};
  };

  // Hàm export file Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataNodes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, "UsersData.xlsx");
  };

  const handleExport = () => {
    exportToExcel();
  };

  useEffect(() => {
    fetchData();
  }, [loadingData, dataNode, errorData]);

  if (loadingData) {
    <Loader />;
  }
  if (error) {
    return <div className={cx("error")}>Error: {error}</div>;
  }

  return (
    <>
      <div className={cx("container", "poppins-regular")}>
        <header className={cx("header")}>
          <div className={cx("navbar")}>
            <a className={cx("nav-link")} href="/">
              <img src={images.logo} alt="" />
            </a>
          </div>
          <h1 className={cx("title")}>SPRAY DRYER CONTROL SYSTEM</h1>
        </header>
        <main className={cx("main")}>
          <div className={cx("buttons")}>
            <h2 className={cx("title")}>operating parameters</h2>
            <div className={cx("infomation")}>
              <div className={cx("card")}>
                <table className={cx("table")}>
                  <tbody>
                    <tr>
                      <th>Temperature entering the drying chamber:</th>
                      <th className={cx("templerature")}>45°C</th>
                    </tr>
                    <tr>
                      <th>Average temperature:</th>
                      <th className={cx("pump_speed")}>{averageTemperatureAndHumidity().temperature}°C</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={cx("filter")}>
              <div className={cx("filter_location")}>
                <Space direction="vertical" size={12}>
                  <RangePicker
                    presets={TIMEPARAMS.rangePresets}
                    onChange={handleDateChange}
                    style={{width: "100%", borderRadius: "2px"}}
                    disabledDate={(current) => current > moment().endOf("day")}
                  />
                </Space>
                <TimePicker.RangePicker
                  defaultValue={[TIMEPARAMS.startTime, TIMEPARAMS.endTime]}
                  format={format}
                  onChange={handleTimeChange}
                  disabled={!dateRange}
                  style={{width: "100%", borderRadius: "2px"}}
                />
              </div>
              <div className={cx("search-filter-container")} onClick={handleFilter}>
                <button className={cx("filter-btn")}>
                  <span className={cx("filter-icon")}>
                    <FontAwesomeIcon icon={faFilter} />
                  </span>{" "}
                  FILTER
                </button>
              </div>
            </div>
            <div className={cx("histories")}>
              <div className={cx("his_content")}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Temperature</th>
                      <th>Humidity</th>
                      <th>Time</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.temperature}°C</td>
                          <td>{item.humidity}%</td>
                          <td>{item.time}</td>
                          <td>{item.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={cx("content")}>
            <div className={cx("chart")}>
              <h2 className={cx("title")}>Real-time temperature and humidity value chart</h2>
              <Chart data={dataNodes} />
              <div className={cx("export_btn")}>
                <button className={cx("export_excel")}>
                  <div className={cx("sign")}>
                    <img src={svgs.saveFile} alt="Save File" />
                  </div>
                  <div className={cx("text")} onClick={handleExport}>
                    Xuất file
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
        <div className={cx("overlay")}></div>
      </div>
    </>
  );
};

export default Node2;
