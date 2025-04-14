import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./deviceStatistics.module.scss";
import {DatePicker, Space, TimePicker} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import sortedData from "~/utils/sortData";
import calculateStatistics from "~/utils/calculateStatistics";
import {TIMEPARAMS} from "~/constants/times";
import useFetchData from "~/hooks/useFetchData";
import moment from "moment";
import BarChartComponents from "../BarChart/BarChart";
import notify from "~/utils/toastify";
import {VARIABLES} from "~/constants/variables";
import {filterDataByDateTime} from "~/helper/filterHelper";

const cx = classNames.bind(styles);
const {RangePicker} = DatePicker;

const DeviceStatistics = () => {
  const devices = VARIABLES.NODES;
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [allDevices, setAllDevices] = useState(false);
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [timeRange, setTimeRange] = useState([TIMEPARAMS.BEGIN, TIMEPARAMS.END]);
  const {data: dataNode, error: errorData, loading: loadingData} = useFetchData("/node_data"); // Gọi custom hook

  const processData = (data, nodeName) => {
    return data.map((item) => {
      const time = item.created_at;
      const date = item.created_at;
      return {
        node: nodeName,
        temperature: item.temperature,
        humidity: item.humidity,
        time: moment(time).format("HH:mm"),
        date: moment(date).format("DD-MM-YYYY"),
      };
    });
  };

  const fetchData = async () => {
    try {
      if (loadingData === false && dataNode) {
        if (allDevices) {
          const dataNode1 = dataNode?.node1 || [];
          const dataNode2 = dataNode?.node2 || [];
          const processedDataNode1 = processData(dataNode1, "Node 1");
          const processedDataNode2 = processData(dataNode2, "Node 2");
          const combinedData = [...processedDataNode1, ...processedDataNode2];
          const sorted = sortedData(combinedData);
          setDataNodes(sorted);
          setFilteredData(sorted); // ✅ Dùng biến sorted trực tiếp
        } else {
          const nodeKey = selectedDevice.toLowerCase().replace(" ", "");
          const data = dataNode?.[nodeKey] || [];
          const processedData = processData(data, selectedDevice);
          const sorted = sortedData(processedData);
          setDataNodes(sorted);
          setFilteredData(sorted); // ✅ Fix tương tự
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
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

  const calculateParameters = () => {
    const dataToCalculate = filteredData && filteredData.length > 0 ? filteredData : dataNodes;

    // Kiểm tra dữ liệu đầu vào
    if (!dataToCalculate || dataToCalculate.length === 0) {
      console.warn("No valid data available for calculations.");
      return {calculateTemp: null, calculateHumi: null};
    }

    // Trường hợp tích "All Devices"
    if (allDevices) {
      const result = {};
      devices.forEach((node) => {
        const nodeData = dataToCalculate.filter((item) => item.node === node);
        const temperatureArray = nodeData
          .map((item) => item.temperature)
          .filter((temp) => typeof temp === "number" && !isNaN(temp));
        const humidityArray = nodeData
          .map((item) => item.humidity)
          .filter((hum) => typeof hum === "number" && !isNaN(hum));
        result[node] = {
          calculateTemp: temperatureArray.length > 0 ? calculateStatistics(temperatureArray) : null,
          calculateHumi: humidityArray.length > 0 ? calculateStatistics(humidityArray) : null,
        };
      });
      return result;
    } else {
      // Trường hợp chọn một node cụ thể
      const temperatureArray = dataToCalculate
        .map((item) => item.temperature)
        .filter((temp) => typeof temp === "number" && !isNaN(temp));
      const humidityArray = dataToCalculate
        .map((item) => item.humidity)
        .filter((hum) => typeof hum === "number" && !isNaN(hum));
      return {
        calculateTemp: temperatureArray.length > 0 ? calculateStatistics(temperatureArray) : null,
        calculateHumi: humidityArray.length > 0 ? calculateStatistics(humidityArray) : null,
      };
    }
  };

  const dataTable = calculateParameters() ?? {};
  let data = {Temperature: {name: [], value: []}, Humidity: {name: [], value: []}};
  if (allDevices) {
    data = devices.reduce(
      (acc, node) => {
        const nodeData = dataTable[node] || {};
        acc.Temperature.name = Object.keys(nodeData?.calculateTemp || {});
        acc.Temperature.value = Object.values(nodeData?.calculateTemp || {});
        acc.Humidity.name = Object.keys(nodeData?.calculateHumi || {});
        acc.Humidity.value = Object.values(nodeData?.calculateHumi || {});
        return acc;
      },
      {Temperature: {name: [], value: []}, Humidity: {name: [], value: []}}
    );
  } else {
    const temp = dataTable?.calculateTemp ?? {};
    const humi = dataTable?.calculateHumi ?? {};

    data = {
      Temperature: {
        name: Object.keys(temp),
        value: Object.values(temp),
      },
      Humidity: {
        name: Object.keys(humi),
        value: Object.values(humi),
      },
    };
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataNodes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, "UsersData.xlsx");
    alert("Excel");
  };

  useEffect(() => {
    fetchData();
  }, [loadingData, dataNode, errorData, selectedDevice, allDevices, dateRange, timeRange]);

  return (
    <div className={cx("container")}>
      <h2 className={cx("title")}>Device Statistics</h2>
      <div className={cx("selection-devicce")}>
        <h3 className={cx("title")}>Device(s):</h3>
        <div className={cx("checkbox-container")}>
          <input type="checkbox" id="all-devices" checked={allDevices} onChange={() => setAllDevices(!allDevices)} />
          <label htmlFor="all-devices">All Devices</label>
        </div>
        {!allDevices && (
          <select
            className={cx("device-select")}
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className={cx("selection-time")}>
        <h3 className={cx("title")}>Filter time:</h3>
        <div className={cx("filter")}>
          <div className={cx("filter_location")}>
            <RangePicker
              presets={TIMEPARAMS.rangePresets}
              format="DD-MM-YYYY"
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
      </div>

      {filteredData ? (
        <table className={cx("statistics-table")}>
          <thead>
            <tr>
              <th>Devices</th>
              <th>Types</th>
              {(data.Temperature.name.length > 0 ? data.Temperature.name : ["Min", "Max", "Avg", "Std"]).map((item) => (
                <th key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDevices ? (
              devices.map((device) => (
                <React.Fragment key={device}>
                  <tr>
                    <td rowSpan={2}>{device}</td>
                    <td>Temperature</td>
                    {dataTable[device]?.calculateTemp
                      ? Object.values(dataTable[device].calculateTemp).map((item) => <td key={item}>{item}</td>)
                      : data.Temperature.value.map((item) => <td key={item}>-</td>)}
                  </tr>
                  <tr>
                    <td>Humidity</td>
                    {dataTable[device]?.calculateHumi
                      ? Object.values(dataTable[device].calculateHumi).map((item) => <td key={item}>{item}</td>)
                      : data.Humidity.value.map((item) => <td key={item}>-</td>)}
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <>
                <tr>
                  <td rowSpan={2}>{selectedDevice}</td>
                  <td>Temperature</td>
                  {dataTable.calculateTemp
                    ? Object.values(dataTable.calculateTemp).map((item) => <td key={item}>{item}</td>)
                    : data.Temperature.value.map((item) => <td key={item}>-</td>)}
                </tr>
                <tr>
                  <td>Humidity</td>
                  {dataTable.calculateHumi
                    ? Object.values(dataTable.calculateHumi).map((item) => <td key={item}>{item}</td>)
                    : data.Humidity.value.map((item) => <td key={item}>-</td>)}
                </tr>
              </>
            )}
          </tbody>
        </table>
      ) : (
        <p style={{textAlign: "center", fontStyle: "italic"}}>Không có dữ liệu phù hợp</p>
      )}
      <BarChartComponents data={dataTable} allDevices={allDevices} devices={devices} />
      <button className={cx("export-button")} onClick={exportToExcel}>
        Send To Excel
      </button>
    </div>
  );
};

export default DeviceStatistics;
