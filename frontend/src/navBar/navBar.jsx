import React from "react";
import classNames from "classnames";
import styles from "./navBar.module.scss";

const cx = classNames.bind(styles);

const navBar = () => {
  return (
    <div className={cx("container")}>
      <h1>IOT NCKH</h1>
      <ul>
        <li>Node 1</li>
        <li>Node 2</li>
      </ul>
      <div className={cx("overlay")}></div>
    </div>
  );
};

export default navBar;
