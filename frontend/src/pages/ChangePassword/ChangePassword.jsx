import {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ChangePassword.module.scss";
import images from "~/assets/images";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import axios from "~/utils/axiosConfig";
import notify from "~/utils/toastify";

const cx = classNames.bind(styles);

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{8,}$/;

    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Mật khẩu phải ít nhất 8 kí tự, bao gồm 1 chữ Hoa, 1 chữ thường, 1 chữ số và 1 kí tự đặc biệt";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/change-password", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        notify.success("Password changed successfully");
        setMessage({type: "success", text: response.data.message});
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu";
      setMessage({type: "error", text: errorMessage});
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className={cx("container")}>
        <div className={cx("password-container")}>
          <div className={cx("icon-container")}>
            <FontAwesomeIcon icon={faLock} />
          </div>

          <h1 className={cx("title")}>Change Password</h1>

          <p className={cx("description")}>
            To change your password, please fill in the fields below. Your password must contain at least 8 characters,
            it must also include at least one upper case letter, one lower case letter, one number and one special
            character.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={cx("input-group")}>
              <label htmlFor="currentPassword" className={cx("label")}>
                Current Password
              </label>
              <div className={cx("input-wrapper")}>
                <FontAwesomeIcon icon={faLock} />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className={cx("input", {"input-error": errors.currentPassword})}
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={cx("visibility-toggle")}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              {errors.currentPassword && <p className={cx("error-message")}>{errors.currentPassword}</p>}
            </div>

            <div className={cx("input-group")}>
              <label htmlFor="newPassword" className={cx("label")}>
                New Password
              </label>
              <div className={cx("input-wrapper")}>
                <FontAwesomeIcon icon={faLock} />

                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className={cx("input", {"input-error": errors.newPassword})}
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={cx("visibility-toggle")}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              {errors.newPassword && <p className={cx("error-message")}>{errors.newPassword}</p>}
            </div>

            <div className={cx("input-group")}>
              <label htmlFor="confirmPassword" className={cx("label")}>
                Confirm Password
              </label>
              <div className={cx("input-wrapper")}>
                <FontAwesomeIcon icon={faLock} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={cx("input", {"input-error": errors.confirmPassword})}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={cx("visibility-toggle")}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
              {errors.confirmPassword && <p className={cx("error-message")}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className={cx("submit-button")} disabled={loading}>
              {loading ? "Changing ..." : "Change password"}
            </button>
          </form>
        </div>
        <div className={cx("password_image")}>
          <img src={images.img45} alt="changePassword" />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChangePassword;
