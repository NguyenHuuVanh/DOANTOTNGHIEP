import React from "react";
import classNames from "classnames/bind";
import styles from "./StatCard.module.scss";

const cx = classNames.bind(styles);

const StatCard = ({number, label}) => (
  <div className={cx("stat-card")}>
    <h3 className={cx("stat-number")}>{number}</h3>
    <p className={cx("stat-label")}>{label}</p>
  </div>
);

export default StatCard;
