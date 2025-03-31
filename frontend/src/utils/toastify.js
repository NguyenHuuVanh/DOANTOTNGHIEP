import {toast} from "react-toastify";
import {FaCheckCircle, FaTimesCircle, FaExclamationTriangle} from "react-icons/fa";

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const notificationType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

const getIcon = (type) => {
  const iconSize = 24;

  switch (type) {
    case notificationType.SUCCESS:
      return <FaCheckCircle color="#28a745" size={iconSize} />;
    case notificationType.ERROR:
      return <FaTimesCircle color="#dc3545" size={iconSize} />;
    case notificationType.WARNING:
      return <FaExclamationTriangle color="#ffc107" size={iconSize} />;
    default:
      return null;
  }
};

const notify = {
  success: (message, options = {}) => {
    toast(
      <div className="notification-content">
        <div className="notification-icon">{getIcon(notificationType.SUCCESS)}</div>
        <div className="notification-message">{message}</div>
      </div>,
      {
        ...toastConfig,
        ...options,
        className: `custom-toast ${notificationType.SUCCESS}`,
      }
    );
  },

  error: (message, options = {}) => {
    toast(
      <div className="notification-content">
        <div className="notification-icon">{getIcon(notificationType.ERROR)}</div>
        <div className="notification-message">{message}</div>
      </div>,
      {
        ...toastConfig,
        ...options,
        className: `custom-toast ${notificationType.ERROR}`,
      }
    );
  },

  warning: (message, options = {}) => {
    toast(
      <div className="notification-content">
        <div className="notification-icon">{getIcon(notificationType.WARNING)}</div>
        <div className="notification-message">{message}</div>
      </div>,
      {
        ...toastConfig,
        ...options,
        className: `custom-toast ${notificationType.WARNING}`,
      }
    );
  },
};

export default notify;
