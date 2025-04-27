import React, {memo} from "react";
import classNames from "classnames/bind";
import styles from "./DataHistory.module.scss";

const cx = classNames.bind(styles);

const DataHistory = ({data}) => {
  console.log("DataHistory rendered");

  return (
    <div className={cx("container")}>
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
              {data.map((item, index) => {
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
  );
};

export default memo(DataHistory);
