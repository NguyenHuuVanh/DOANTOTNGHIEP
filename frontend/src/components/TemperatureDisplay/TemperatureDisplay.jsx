import React, {memo} from "react";
import classNames from "classnames/bind";
import styles from "./TemperatureDisplay.module.scss";

const cx = classNames.bind(styles);

const TemperatureDisplay = ({currentTemperature, averageTemperature}) => {
  console.log("TemperatureDisplay rendered");

  return (
    <div className={cx("container")}>
      <div className={cx("infomation")}>
        <div className={cx("card")}>
          <table className={cx("table")}>
            <tbody>
              <tr>
                <th>Current Temperature entering the drying chamber:</th>
                <th className={cx("templerature")}>{currentTemperature}°C</th>
              </tr>
              <tr>
                <th>Average temperature:</th>
                <th className={cx("pump_speed")}>{averageTemperature}°C</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(TemperatureDisplay);
