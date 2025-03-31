import {useState} from "react";
import classNames from "classnames/bind";
import styles from "./ForgotPassword.module.scss";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import images from "~/assets/images";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const cx = classNames.bind(styles);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Thêm state cho lỗi
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3001/check-email", {email});
      if (!response.data.exists) {
        setError("Email does not exist in the system");
        setIsSubmitting(false);
        return;
      }

      const sendCodeResponse = await axios.post("http://localhost:3001/send-reset-code", {email});
      if (sendCodeResponse.data.success) {
        setCodeSent(true);
        setMessage("Mã xác nhận đã được gửi thành công!");
      } else {
        setMessage(sendCodeResponse.data.message || "Gửi mã thất bại");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3001/verify-reset-code", {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        setMessage("Xác minh thành công! Hãy đặt lại mật khẩu.");
        setIsVerified(true);
      } else {
        setMessage("Mã xác nhận không hợp lệ");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi xác minh");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:3001/reset-password", {
        email,
        newPassword,
      });
      if (response.data.success) {
        setMessage("Mật khẩu đã được cập nhật thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setMessage("Lỗi khi đặt lại mật khẩu");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Lỗi cập nhật mật khẩu");
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
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className={cx("form-group")}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
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
