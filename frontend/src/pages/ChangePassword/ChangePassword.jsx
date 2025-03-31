import {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ChangePassword.module.scss";

const cx = classNames.bind(styles);

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password change logic here
    console.log("Password change submitted");
  };

  return (
    <div className={cx("password-container")}>
      <div className={cx("icon-container")}>{/* <i className={cx("fas fa-lock"></i> */}</div>

      <h1 className={cx("title")}>Change Password</h1>

      <p className={cx("description")}>
        To change your password, please fill in the fields below. Your password must contain at least 8 characters, it
        must also include at least one upper case letter, one lower case letter, one number and one special character.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={cx("input-group")}>
          <label htmlFor="currentPassword" className={cx("label")}>
            Current Password
          </label>
          <div className={cx("input-wrapper")}>
            {/* <i className={cx("fas fa-lock input-icon"></i> */}
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              className={cx("input")}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className={cx("visibility-toggle")}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {/* <i className={cx({showCurrentPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> */}
            </button>
          </div>
        </div>

        <div className={cx("input-group")}>
          <label htmlFor="newPassword" className={cx("label")}>
            New Password
          </label>
          <div className={cx("input-wrapper")}>
            {/* <i className={cx("fas fa-lock input-icon"></i> */}
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              className={cx("input")}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className={cx("visibility-toggle")}
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {/* <i className={cx({showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> */}
            </button>
          </div>
        </div>

        <div className={cx("input-group")}>
          <label htmlFor="confirmPassword" className={cx("label")}>
            Confirm Password
          </label>
          <div className={cx("input-wrapper")}>
            {/* <i className={cx("fas fa-lock input-icon"></i> */}
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={cx("input")}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className={cx("visibility-toggle")}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {/* <i className={cx({showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i> */}
            </button>
          </div>
        </div>

        <button type="submit" className={cx("submit-button")}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
