import {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import images from "~/assets/images";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import axios from "~/utils/axiosConfig";
import {useNavigate} from "react-router-dom";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import notify from "~/utils/toastify";

const cx = classNames.bind(styles);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Thêm state cho lỗi
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setConfirmNewShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setConfirmNewShowPassword((prev) => !prev);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/check-email", {email});
      if (!response.data.exists) {
        setError("Email does not exist in the system");
        setIsSubmitting(false);
        return;
      }

      const sendCodeResponse = await axios.post("/send-reset-code", {email});
      if (sendCodeResponse.data.success) {
        setCodeSent(true);
        setMessage("Verification code sent successfully!");
        notify.success("Verification code sent successfully! Please check your email for the code!");
      } else {
        setMessage(sendCodeResponse.data.message || "Sending code failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/verify-reset-code", {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        setMessage("Xác minh thành công! Hãy đặt lại mật khẩu.");
        notify.success("Verification successful! Please reset your password!");
        setIsVerified(true);
      } else {
        setMessage("Invalid confirmation code");
        notify.error("Invalid confirmation code");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Xóa lỗi cũ
    setErrors({
      newPassword: "",
      confirmPassword: "",
    });
    setMessage("");

    // Kiểm tra các yêu cầu về mật khẩu
    let valid = true;
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    // // Kiểm tra độ dài tối thiểu của mật khẩu (ví dụ: tối thiểu 8 ký tự)
    // if (newPassword.length < 8) {
    //   newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    //   valid = false;
    // }

    // Kiểm tra mật khẩu có chứa ký tự đặc biệt, số, chữ hoa, chữ thường (tùy chọn)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long including at least one uppercase letter, one lowercase letter, one number and one special character";
      valid = false;
    }

    // Kiểm tra mật khẩu xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Confirmation password does not match";
      valid = false;
    }

    // Nếu có lỗi, cập nhật state errors và dừng lại
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/reset-password", {
        email,
        newPassword,
      });
      if (response.data.success) {
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setMessage("Error resetting password");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password update error";
      setErrors({
        newPassword: "",
        confirmPassword: "",
        general: errorMessage, // Thêm lỗi chung nếu cần
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegistrationLayout>
      <div className={cx("forgot-password-container")}>
        <div className={cx("forgot-password-card")}>
          <h1 className={cx("title")}>Forgot your Password?</h1>
          <p className={cx("description")}>
            Enter your email address below and we'll send you a verification code to reset your password.
          </p>

          {isVerified ? (
            <form onSubmit={handleResetPassword} className={cx("forgot-password-form")}>
              <div className={cx("form-group")}>
                <label>New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button type="button" className={cx("showNewPassword")} onClick={togglePasswordVisibility}>
                  {showNewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
                {errors.newPassword && <span className={cx("error-message")}>{errors.newPassword}</span>}
              </div>
              <div className={cx("form-group")}>
                <label>Confirm New Password</label>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className={cx("showConfirmNewPassword")}
                  onClick={toggleConfirmNewPasswordVisibility}
                >
                  {showConfirmNewPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
                {errors.confirmPassword && <span className={cx("error-message")}>{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className={cx("reset-button")} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Reset Password"}
              </button>
            </form>
          ) : codeSent ? (
            <form onSubmit={handleVerifyCode} className={cx("forgot-password-form")}>
              <div className={cx("form-group")}>
                <label>
                  Please enter the verification code sent to <strong>{email}</strong>
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  required
                />
                {message && <p className={cx("error-message")}>{message}</p>} {/* Hiển thị lỗi màu đỏ */}
              </div>
              <button type="submit" className={cx("reset-button")} disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode} className={cx("forgot-password-form")}>
              <div className={cx("form-group")}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {error && <p className={cx("error-message")}>{error}</p>} {/* Hiển thị lỗi màu đỏ */}
              <button type="submit" className={cx("reset-button")} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}
          <div className={cx("back-to-login")}>
            <a href="/signin">
              <FontAwesomeIcon icon={faArrowLeft} /> Return back to login page
            </a>
          </div>
        </div>
        <div className={cx("forgotPassword-image")}>
          <img src={images.img31} alt="" />
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default ForgotPasswordForm;
