import React from "react";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import Footer from "~/components/Footer/Footer";
import Navbar from "~/components/Navbar/Navbar";

const cx = classNames.bind(styles);

const DefaultLayout = ({children}) => {
  return (
    <>
      <div className={cx("container")}>
        <Navbar />
        <main className={cx("main")}>{children}</main>
        <Footer />
      </div>
      <div className={cx("overlay")}></div>
    </>
  );
};

export default DefaultLayout;
