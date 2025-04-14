import React from "react";
import classNames from "classnames/bind";
import styles from "./FeatureCard.module.scss";

const cx = classNames.bind(styles);

const FeatureCard = ({title, description, img}) => (
  <div className={cx("feature-card")}>
    <div className={cx("feature-card-image")}>
      <img src={img} alt="feature-image" />
    </div>
    <div className={cx("feature_footer")}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default FeatureCard;
