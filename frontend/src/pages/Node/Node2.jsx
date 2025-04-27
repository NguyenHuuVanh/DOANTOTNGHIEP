import React, {useCallback, useEffect, useMemo, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../../components/chart/Chart";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {DatePicker, TimePicker} from "antd";
import images from "~/assets/images";
import sortedData from "~/utils/sortData";
import {averageRounded} from "~/utils/averageNumbers";
import Loader from "~/components/Loading/Loading";
import notify from "~/utils/toastify";
import {TIMEPARAMS} from "~/constants/times";
import moment from "moment";
import useFetchData from "~/hooks/useFetchData";
import {filterDataByDateTime} from "~/helper/filterHelper";
import TemperatureDisplay from "~/components/TemperatureDisplay/TemperatureDisplay";
import DataHistory from "~/components/DataHistory/DataHistory";
const {RangePicker} = DatePicker;

const cx = classNames.bind(styles);

const Node2 = ({data}) => {
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [timeRange, setTimeRange] = useState([TIMEPARAMS.BEGIN, TIMEPARAMS.END]);
  const [isResourcesLoaded, setIsResourcesLoaded] = useState(false); // Trạng thái tổng thể cho việc tải tài nguyên
  const [error, setError] = useState(null);
  const {data: dataNode, error: errorData, loading: loadingData, refetch} = useFetchData("/node_data");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const processData = useCallback((data) => {
    if (!data || !Array.isArray(data)) {
      console.error("Dữ liệu không hợp lệ:", data);
      return;
    }

    try {
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
      console.log("Dữ liệu đã được cập nhật:", dataSorted.length, "bản ghi");
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu:", error);
      setError("Lỗi khi xử lý dữ liệu");
    }
  }, []);

  // Theo dõi thay đổi từ dataNode
  useEffect(() => {
    if (dataNode && dataNode.node2) {
      processData(dataNode.node2);
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [dataNode, processData, isFirstLoad]);

  // Xử lý thay đổi ngày - sử dụng useCallback để tránh render lại không cần thiết
  const handleDateChange = useCallback((dates) => {
    if (!dates || dates.length < 2 || !dates[0] || !dates[1]) {
      setDateRange([null, null]);
      return;
    }

    const formattedDates = dates.map((d) => d.format("DD-MM-YYYY"));
    setDateRange(formattedDates);
  }, []);

  // Xử lý thay đổi giờ - sử dụng useCallback
  const handleTimeChange = useCallback((times) => {
    if (!times || times.length < 2 || !times[0] || !times[1]) {
      setTimeRange([TIMEPARAMS.BEGIN, TIMEPARAMS.END]);
      return;
    }

    const formattedTimes = times.map((t) => t.format("HH:mm"));
    setTimeRange(formattedTimes);
  }, []);

  // Hàm xử lý filter - sử dụng useCallback
  const handleFilter = useCallback(() => {
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
  }, [dataNodes, dateRange, timeRange]);

  // Tính nhiệt độ và độ ẩm trung bình với useMemo để tối ưu hiệu suất
  const averageTemperatureAndHumidity = useMemo(() => {
    console.log("Tính toán lại nhiệt độ trung bình");

    if (!filteredData || !filteredData.length) return {temperature: 0, humidity: 0, currentTemperature: 0};

    try {
      // Lấy 20 bản ghi gần nhất để tính trung bình
      const startIndex = Math.max(0, filteredData.length - 21);
      const validTemps = filteredData
        .slice(startIndex, filteredData.length - 1)
        .map((item) => item.temperature)
        .filter((temp) => typeof temp === "number" && !isNaN(temp));

      // Lấy nhiệt độ hiện tại (bản ghi mới nhất)
      const currentTemperature = filteredData.length > 0 ? filteredData[filteredData.length - 1].temperature : 0;

      // Tính trung bình nhiệt độ
      const averageTemperature = validTemps.length > 0 ? Math.round(averageRounded(validTemps)) : 0;
      const currentTemp = Math.round(currentTemperature || 0);

      return {temperature: averageTemperature, currentTemperature: currentTemp};
    } catch (error) {
      console.error("Lỗi khi tính toán nhiệt độ trung bình:", error);
      return {temperature: 0, humidity: 0, currentTemperature: 0};
    }
  }, [filteredData]);

  // Hàm export file Excel
  const exportToExcel = useCallback(() => {
    if (!dataNodes || dataNodes.length === 0) {
      notify.warning("Không có dữ liệu để xuất");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(dataNodes);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
      const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
      saveAs(dataBlob, "UsersData.xlsx");
      notify.success("Xuất file thành công");
    } catch (error) {
      console.error("Lỗi khi xuất file Excel:", error);
      notify.error("Lỗi khi xuất file Excel");
    }
  }, [dataNodes]);

  const handleExport = () => {
    exportToExcel();
  };

  // Tải tài nguyên (hình ảnh) và kiểm tra trạng thái API
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Tải hình ảnh
        const imagePromises = [images.logo, svgs.saveFile].map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // Resolve ngay cả khi có lỗi
          });
        });

        await Promise.all(imagePromises);
        setIsResourcesLoaded(true);
      } catch (error) {
        console.error("Lỗi khi tải tài nguyên: ", error);
        setError("Lỗi khi tải tài nguyên");
        setIsResourcesLoaded(true);
      }
    };

    loadResources();
  }, []);

  // Cập nhật dữ liệu theo thời gian thực sử dụng refetch
  useEffect(() => {
    if (!isResourcesLoaded) return;

    console.log("Thiết lập interval cho refetch");
    const interval = setInterval(() => {
      console.log("Gọi refetch để lấy dữ liệu mới");
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [isResourcesLoaded, refetch]);

  if (errorData || error) {
    return <div className={cx("error")}>Error: {errorData || error}</div>;
  }

  if ((loadingData && isFirstLoad) || !isResourcesLoaded) {
    return (
      <div className={cx("loadingContainer")}>
        <Loader />
      </div>
    );
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

            <TemperatureDisplay
              currentTemperature={averageTemperatureAndHumidity.currentTemperature}
              averageTemperature={averageTemperatureAndHumidity.temperature}
            />

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
                  disabled={!dateRange || !dateRange[0] || !dateRange[1]}
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

            <DataHistory data={filteredData} />
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

export default Node2;
