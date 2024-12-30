import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../chart/Chart";
import History from "../History/History";
import Buttons from "../Buttons/Buttons";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {getDatabase, ref, child, get, set} from "firebase/database";
import {dbRef} from "../firebase/config";
import axios from "axios";

const cx = classNames.bind(styles);

const NodeControl = () => {
  const [data, setData] = useState(null);
  const [activeButtons, setActiveButtons] = useState({});

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});

    const dataBlob = new Blob([excelBuffer], {type: "application/octet-stream"});
    saveAs(dataBlob, "UsersData.xlsx");
  };

  const fetchData = () => {
    get(child(dbRef, "/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Data:", snapshot.val());
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleButtonClick = (id) => {
    setActiveButtons((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    fetchData();
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
          <div className={cx("btn")}>
            <div className={cx("controls_header")}>
              <button
                type="checkbox"
                onClick={() => handleButtonClick(1)}
                className={cx("Btn_control", "turn_auto", activeButtons[1] ? "active" : "")}
              >
                Chạy Auto
              </button>
              <button
                type="checkbox"
                onClick={() => handleButtonClick(2)}
                className={cx("Btn_control", "turn_auto", activeButtons[2] ? "active" : "")}
              >
                Dừng Auto
              </button>
              <button
                type="checkbox"
                onClick={() => handleButtonClick(3)}
                className={cx("Btn_control", "turn_auto", activeButtons[3] ? "active" : "")}
              >
                Manual
              </button>
            </div>
            <div className={cx("controler")}>
              <Buttons data={data} number={1} value={"Relay 1"} />
              <Buttons data={data} number={2} value={"Relay 2"} />
              <Buttons data={data} number={3} value={"Relay 3"} />
              <Buttons data={data} number={4} value={"Relay 4"} />
              <Buttons data={data} number={5} value={"Relay 5"} />
              <Buttons data={data} number={6} value={"Relay 6"} />
              <Buttons data={data} number={7} value={"Relay 7"} />
              <Buttons data={data} number={8} value={"Relay 8"} />
            </div>
          </div>
        </div>
        <div className={cx("content")}>
          {/* <div className={cx("chart")}>
            <h2 className={cx("title")}>Biểu đồ giá trị nhiệt độ, độ ẩm theo thời gian thực</h2>
            <Chart />
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
          </div> */}
          {/* <History /> */}
        </div>
      </main>
    </div>
  );
};

export default NodeControl;
