import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Chart from "../../components/chart/Chart";
import History from "../../components/History/History";
import Buttons from "../../components/Buttons/Buttons";
import svgs from "~/assets/svgs";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import {getDatabase, ref, child, get, set} from "firebase/database";
import {dbRef} from "~/firebase/config";
import axios from "axios";
import images from "~/assets/images";
import DeviceStatistics from "~/components/DeviceStatistics/deviceStatistics";

const cx = classNames.bind(styles);

const NodeControl = () => {
  const [data, setData] = useState(null);
  const [activeButtons, setActiveButtons] = useState({});

  const handleButtonClick = (id) => {
    setActiveButtons((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {}, []);

  return (
    <div className={cx("container", "poppins-regular")}>
      <header className={cx("header")}>
        <a className={cx("logo")} href="/">
          <img src={images.logo} alt="" />
        </a>
        <h1 className={cx("title")}>SPRAY DRYER CONTROL SYSTEM</h1>
      </header>
      <main className={cx("main")}>
        <div className={cx("buttons")}>
          <h2 className={cx("title")}>Operating parameters</h2>
          <div className={cx("infomation")}>
            <div className={cx("card")}>
              <table className={cx("table")}>
                <tbody>
                  <tr>
                    <th>Temperature entering the drying chamber:</th>
                    <th className={cx("templerature")}>45°C </th>
                  </tr>
                  <tr>
                    <th>Average temperature:</th>
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
          <DeviceStatistics />
        </div>
      </main>
    </div>
  );
};

export default NodeControl;
