import React from "react";
import classNames from "classnames/bind";
import styles from "./TestimonialCard.module.scss";

const cx = classNames.bind(styles);

const TestimonialCard = ({name, comment}) => (
  <div className={cx("testimonial-card")}>
    <p className={cx("comment")}>"{comment}"</p>
    <h3 className={cx("customer-name")}>{name}</h3>
  </div>
);

export default TestimonialCard;
