import classNames from "classnames/bind";
import styles from "./ConfirmModal.module.scss";

const cx = classNames.bind(styles);
const ConfirmModal = ({isOpen, onClose, onConfirm, title, message}) => {
  if (!isOpen) return null;
  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal")}>
        <h2 className={cx("modal-title")}>{title}</h2>
        <p className={cx("modal-message")}>{message}</p>
        <div className={cx("modal-buttons")}>
          <button className={cx("modal-button", "confirm")} onClick={onConfirm}>
            Yes
          </button>
          <button className={cx("modal-button", "cancel")} onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
