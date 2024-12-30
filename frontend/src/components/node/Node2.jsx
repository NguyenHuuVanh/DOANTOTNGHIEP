import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../chart/Chart";
import History from "../History/History";
import Buttons from "../Buttons/Buttons";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {getDatabase, ref, child, get} from "firebase/database";
import {dbRef} from "../firebase/config";
import axios from "axios";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);

const Node2 = () => {
  const [dataNodes, setDataNodes] = useState([]);

  const getData = () => {
    axios
      .get("http://localhost:3001/data_sensor")
      .then((response) => {
        setDataNodes(response.data.data.node2);
      })
      .then((error) => {
        console.log(error);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataNodes);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});

    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, "UsersData.xlsx");
  };

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

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={cx("container", "poppins-regular")}>
      <header className={cx("header")}>
        <h1 className={cx("title")}>hệ thống điều khiển máy sấy phun</h1>
      </header>
      <main className={cx("main")}>
        <div className={cx("buttons")}>
          <h2 className={cx("title")}>Thông số vận hành</h2>
          <div className={cx("infomation")}>
            <div className={cx("card")}>
              <table className={cx("table")}>
                <tbody>
                  <tr>
                    <th> Nhiệt độ vào buồng sấy</th>
                    <th className={cx("templerature")}>45°C </th>
                  </tr>
                  <tr>
                    <th>Tốc độ bơm dịch</th>
                    <th className={cx("pump_speed")}>60v/phút </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={cx("filter")}>
            <div className={cx("filter_location")}>
              {/* <RangeDatePicker />
              <RangeTimePicker /> */}
            </div>
            <div className={cx("search-filter-container")}>
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
                  {dataNodes.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.temperature}C</td>
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
            <h2 className={cx("title")}>Biểu đồ giá trị nhiệt độ, độ ẩm theo thời gian thực</h2>
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
          {/* <History /> */}
        </div>
      </main>
    </div>
  );
};

export default Node2;
