import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../../components/chart/Chart";
import History from "../../components/History/History";
import Buttons from "../../components/Buttons/Buttons";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {getDatabase, ref, child, get} from "firebase/database";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faFilter, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {DatePicker, TimePicker, Space} from "antd";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import images from "~/assets/images";
import sortedData from "~/utils/sortData";
import {fetchNodeData} from "~/apis/nodeData";
import {averageRounded} from "~/utils/averageNumbers";
const format = "HH:mm";
const {RangePicker} = DatePicker;

const cx = classNames.bind(styles);

const Node1 = ({data}) => {
  const [dataNodes, setDataNodes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [startTimeValue, setStarTimeValue] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTimeValue, setEndTimeValue] = useState("23:59");
  const [show, setShow] = useState(false);
  console.log("🚀 ~ Node1 ~ filteredData:", filteredData);

  const startTime = dayjs("00:00", "HH:mm");
  const endTime = dayjs("00:00", "HH:mm");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const getData = () => {
  //   axios
  //     .get("http://localhost:3001/data_sensor")
  //     .then((response) => {
  //       setDataNodes(response.data.data.node1);
  //     })
  //     .then((error) => {
  //       console.log(error);
  //     });
  // };

  const getData = async () => {
    try {
      // const response = await axios.get("http://localhost:3001/node_data");
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataNodes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, "UsersData.xlsx");
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
  const rangePresets = [
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
  ];

  //firebase
  // const fetchData = () => {
  //   get(child(dbRef, "/"))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         console.log("Data:", snapshot.val());
  //         setData(snapshot.val());
  //       } else {
  //         console.log("No data available");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // };

  const handleExport = () => {
    exportToExcel();
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = dataNodes.filter((item) => {
        console.log("🚀 ~ filtered ~ item:", item);
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

  const averageTemperature = () => {
    if (!Array.isArray(dataNodes) || dataNodes.length === 0) {
      console.error("dataNodes is not a valid array or is empty.");
      return null;
    }

    const data = dataNodes
      .slice(0, 20)
      .map((item) => item?.temperature)
      .filter((temp) => typeof temp === "number" && !isNaN(temp)); // Lọc giá trị hợp lệ

    console.log("🚀 ~ averageTemperature ~ data:", data);

    if (data.length === 0) {
      console.error("No valid temperatures found.");
      return null;
    }

    return Math.round(averageRounded(data));
  };

  console.log(averageTemperature());

  useEffect(() => {
    getData();
  }, []);
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
                      <th className={cx("pump_speed")}>{averageTemperature()}°C</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={cx("filter")}>
              <div className={cx("filter_location")}>
                <Space direction="vertical" size={12}>
                  <RangePicker
                    presets={rangePresets}
                    onChange={onRangeDateChange}
                    style={{width: "100%", borderRadius: "2px"}}
                  />
                </Space>
                <TimePicker.RangePicker
                  defaultValue={[startTime, endTime]}
                  format={format}
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

export default Node1;
