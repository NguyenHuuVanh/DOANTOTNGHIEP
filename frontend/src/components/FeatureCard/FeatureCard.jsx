import React from "react";
import classNames from "classnames/bind";
import styles from "./FeatureCard.module.scss";

const cx = classNames.bind(styles);

const FeatureCard = ({title, description}) => (
  <div className={cx("feature-card")}>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default FeatureCard;
