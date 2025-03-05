import {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./deviceStatistics.module.scss";
import {DatePicker, Space, TimePicker} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {fetchNodeData} from "~/apis/nodeData";
import sortedData from "~/utils/sortData";
import {averageRounded} from "~/utils/averageNumbers";
import calculateStatistics from "~/utils/calculateStatistics";
import {TIMEPARAMS} from "~/constants/times";

const cx = classNames.bind(styles);
const {RangePicker} = DatePicker;

const DeviceStatistics = () => {
  const devices = ["Node 1", "Node 2"];
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [allDevices, setAllDevices] = useState(false);
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  console.log("🚀 ~ DeviceStatistics ~ filteredData:", filteredData);
  const [startDate, setStartDate] = useState("");
  const [startTimeValue, setStarTimeValue] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTimeValue, setEndTimeValue] = useState("23:59");

  const getData = async () => {
    try {
      const response = await fetchNodeData();
      const dataNode = response.node1;
      if (dataNode) {
        const dataNodeFilterd = dataNode.map((item) => {
          const time = item.created_at.split(" ")[1].slice(0, 5);
          const date = item.created_at.split(" ")[0];
          return {
            temperature: item.temperature,
            humidity: item.humidity,
            time: `${time}`,
            date: `${date}`,
          };
        });

        const dataSorted = sortedData(dataNodeFilterd);
        console.log("🚀 ~ getData ~ dataSorted:", dataSorted);

        setDataNodes(dataSorted);
        setFilteredData(dataSorted);
      } else {
        console.error("API không trả về dữ liệu node1.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const onRangeDateChange = (dates, dateStrings) => {
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      console.log("Clear");
      getData();
    }
  };

  const onRangeTimeChange = (times, timesStrings) => {
    if (times) {
      console.log("🚀 ~ Node1 ~ times:", timesStrings);
      setStarTimeValue(timesStrings[0]);
      setEndTimeValue(timesStrings[1]);
    } else {
      getData();
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = dataNodes.filter((item) => {
        const itemDateTime = new Date(`${item.date}T${item.time}`);
        const startDateTime = new Date(`${startDate}T${startTimeValue}`);
        const endDateTime = new Date(`${endDate}T${endTimeValue}`);
        return itemDateTime >= startDateTime && itemDateTime <= endDateTime;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(dataNodes);
    }
  };

  const calculateParameters = () => {
    // Nếu `filteredData` không rỗng, dùng nó; nếu rỗng, dùng `dataNodes`
    const dataToCalculate = filteredData && filteredData.length > 0 ? filteredData : dataNodes;

    if (!dataToCalculate || dataToCalculate.length === 0) {
      console.warn("No valid data available for calculations.");
      return {
        calculateTemp: null,
        calculateHumi: null,
      };
    }

    // Lọc dữ liệu hợp lệ trước khi tính toán
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
  };

  // console.log("🚀 ~ calculateParameters ~ calculateParameters:", calculateParameters());

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
    getData();
  }, []);

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
            <Space direction="vertical" size={12}>
              <RangePicker
                presets={TIMEPARAMS.rangePresets}
                onChange={onRangeDateChange}
                style={{width: "100%", borderRadius: "2px"}}
              />
            </Space>
            <TimePicker.RangePicker
              defaultValue={[TIMEPARAMS.startTime, TIMEPARAMS.endTime]}
              format={TIMEPARAMS.format}
              onChange={onRangeTimeChange}
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
      {filteredData && (
        <table className={cx("statistics-table")}>
          <thead>
            <tr>
              <th>Devices</th>
              <th>Types</th>
              <th>Minimum</th>
              <th>Maximum</th>
              <th>Average</th>
              <th>Median</th>
              <th>Mode</th>
              <th>Range</th>
              <th>InterquartileRange</th>
              <th>StandardDeviation</th>
              <th>MeanDeviation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{devices[0]}</td>
              <td>Temperature</td>
              <td>{calculateParameters()?.calculateTemp?.Minimum ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.Maximum ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.Average ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.Median ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.Mode ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.Range ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.InterquartileRange ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.StandardDeviation ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateTemp?.MeanDeviation ?? "N/A"}</td>
            </tr>
            <tr>
              <td>{devices[0]}</td>
              <td>Humidity</td>
              <td>{calculateParameters()?.calculateHumi?.Minimum ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.Maximum ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.Average ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.Median ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.Mode ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.Range ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.InterquartileRange ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.StandardDeviation ?? "N/A"}</td>
              <td>{calculateParameters()?.calculateHumi?.MeanDeviation ?? "N/A"}</td>
            </tr>
          </tbody>
        </table>
      )}

      <button className={cx("export-button")} onClick={exportToExcel}>
        Send To Excel
      </button>
    </div>
  );
};

export default DeviceStatistics;
