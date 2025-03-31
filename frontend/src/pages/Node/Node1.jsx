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
import {filterDataByDateTime} from "~/helper/filterHelper";
const {RangePicker} = DatePicker;

const cx = classNames.bind(styles);

const Node1 = ({data}) => {
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  console.log("🚀 ~ Node1 ~ filteredData:", filteredData);
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
        const data = await dataNode?.node1;
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

  // Xử lý thay đổi ngày
  const handleDateChange = (dates) => {
    if (!dates || dates.length < 2 || !dates[0] || !dates[1]) {
      setDateRange([null, null]);
      return;
    }

    const formattedDates = dates.map((d) => d.format("DD-MM-YYYY")); // ← chuyển về chuỗi "24-12-2024"

    setDateRange(formattedDates); // ← kết quả là mảng string ["24-12-2024", "24-12-2024"]
  };

  // Xử lý thay đổi giờ
  const handleTimeChange = (times) => {
    if (!times || times.length < 2 || !times[0] || !times[1]) {
      setTimeRange([TIMEPARAMS.BEGIN, TIMEPARAMS.END]); // hoặc giá trị mặc định bạn muốn
      return;
    }

    const formattedTimes = times.map((t) => t.format("HH:mm")); // ← chuyển về chuỗi giờ
    setTimeRange(formattedTimes); // → ["09:00", "18:00"]
  };

  const handleFilter = () => {
    try {
      const filtered = filterDataByDateTime(dataNodes, dateRange, timeRange);

      if (filtered.length === 0) {
        notify.warning("⚠️ Không tìm thấy dữ liệu trong khoảng thời gian đã chọn.");
      } else {
        notify.success(`✅ Đã tìm thấy ${filtered.length} bản ghi.`);
      }

      setFilteredData(filtered);
    } catch (error) {
      notify.error(error.message || "Lỗi hệ thống khi lọc dữ liệu");
    }
  };

  // Hàm tính nhiệt độ và độ ẩm trung bình
  const averageTemperatureAndHumidity = () => {
    if (!filteredData.length) return {temperature: 0, humidity: 0};

    const validTemps = filteredData
      .slice(filteredData.length - 21, filteredData.length - 1)
      .map((item) => item.temperature)
      .filter((temp) => typeof temp === "number" && !isNaN(temp));

    const currentTemperature = filteredData && filteredData[filteredData.length - 1].temperature;

    const averageTemperature = Math.round(averageRounded(validTemps));
    const currentTemp = Math.round(currentTemperature);

    return {temperature: averageTemperature, currentTemperature: currentTemp};
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
  }, [loadingData, dataNode, errorData, dateRange, timeRange]);

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
                      <th>Current Temperature entering the drying chamber:</th>
                      <th className={cx("templerature")}>{averageTemperatureAndHumidity().currentTemperature}°C</th>
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
                <RangePicker
                  presets={TIMEPARAMS.rangePresets}
                  onChange={handleDateChange}
                  style={{width: "100%", borderRadius: "2px"}}
                  disabledDate={(current) => current > moment().endOf("day")}
                />
                <TimePicker.RangePicker
                  defaultValue={[TIMEPARAMS.startTime, TIMEPARAMS.endTime]}
                  format="HH:mm"
                  onChange={handleTimeChange}
                  disabled={!dateRange || !dateRange[0] || !dateRange[1]} // Chỉ kích hoạt khi người dùng chọn ngày
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
              <Chart data={filteredData} />
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

export default Node1;
