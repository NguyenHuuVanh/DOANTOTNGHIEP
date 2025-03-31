import React, {memo, useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./Buttons.module.scss";
import axios from "axios";

const cx = classNames.bind(styles);

const Buttons = memo(({value, relay, toggleRelay, disabled}) => {
  const [isActive, setIsActive] = useState(false);

  // Đặt isActive về false khi component được mount lần đầu
  useEffect(() => {
    setIsActive(false);
  }, []); // Dependency rỗng, chỉ chạy một lần khi mount

  useEffect(() => {
    setIsActive(relay.status === "ON");
  }, [relay.status]); // Theo dõi thay đổi từ prop

  const handleToggle = async () => {
    if (!disabled) {
      try {
        await toggleRelay();
        // Không cần setState ở đây vì sẽ nhận prop mới từ parent
      } catch (error) {
        console.error("Lỗi khi chuyển trạng thái:", error);
      }
    }
  };
  return (
    <div className={cx("container")}>
      <label className={cx("switch")}>
        <input type="checkbox" onChange={handleToggle} checked={isActive} disabled={disabled} />
        <div className={cx("button", {active: isActive})}>
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
});

export default Buttons;
