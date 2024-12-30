import React, {useState} from "react";
import classNames from "classnames/bind";
import styles from "./Buttons.module.scss";
import {getDatabase, ref, set} from "firebase/database";
import {dbRef} from "../firebase/config";

const cx = classNames.bind(styles);

const Buttons = ({value, data, number}) => {
  const [checked, setChecked] = useState(false);
  console.log(data);

  const updateData = (relayValue) => {
    const db = getDatabase();
    const relayRef = ref(db, `/RELAY ${number}`);
    set(relayRef, relayValue)
      .then(() => {
        console.log("Data updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const switchControl = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      console.log("Bật");
      updateData(1);
    } else {
      console.log("tắt");
      updateData(0);
    }
  };

  return (
    <div className={cx("container")}>
      <label className={cx("switch")}>
        <input type="checkbox" onChange={switchControl} />
        <div className={cx("button")}>
          <div className={cx("light")}></div>
          <div className={cx("dots")}></div>
          <div className={cx("characters")}></div>
          <div className={cx("shine")}></div>
          <div className={cx("shadow")}></div>
        </div>
      </label>
      <p className={cx("content")}>{value}</p>
    </div>
  );
};

export default Buttons;
