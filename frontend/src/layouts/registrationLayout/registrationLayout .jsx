import React from "react";
import classNames from "classnames/bind";
import styles from "./registrationLayout.module.scss";
import Navbar from "~/components/Navbar/Navbar";

const cx = classNames.bind(styles);

const RegistrationLayout = ({children}) => {
  return (
    <>
      <div className={cx("container")}>
        <Navbar />
        <div className={cx("registration")}>{children}</div>
      </div>
      <div className={cx("overlay")}></div>
    </>
  );
};

export default RegistrationLayout;
