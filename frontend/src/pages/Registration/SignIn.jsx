import {useEffect, useState} from "react";
import {useAuth} from "~/context/AuthContext"; // Import AuthContext
import classNames from "classnames/bind";
import styles from "./Registration.module.scss";
import images from "~/assets/images";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "~/utils/axiosConfig";
import notify from "~/utils/toastify";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import Loader from "~/components/Loading/Loading";
import {Container, Row, Col} from "react-bootstrap";

const cx = classNames.bind(styles);

const SignInForm = () => {
  const {login} = useAuth(); // Sử dụng hàm login từ AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading cho API

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;

    setFormData((prev) => {
      const updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setIsLoading(true);
      try {
        const response = await axios.post("/login", formData);
        if (response.status === 200) {
          const {token, user} = response.data;

          // Gọi login với rememberMe
          login({...user, token}, formData.rememberMe);

          const from = location.state?.from?.pathname || "/";
          navigate(from, {replace: true}); // Chuyển hướng đến trang trước đó hoặc trang chủ
          notify.success("Đăng nhập thành công");
        }
      } catch (error) {
        // ... xử lý lỗi
        const errorMessage = error.response?.data?.message || "Login failed. Please try again!";
        if (errorMessage === "Account does not exist") {
          setErrors({
            email: "Email address doesn't exist!",
            password: "",
          });
        } else if (errorMessage === "Wrong password") {
          setErrors({
            email: "",
            password: "Wrong password!",
          });
        } else {
          setErrors({
            email: "",
            password: errorMessage,
          });
        }
        notify.error(errorMessage);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <RegistrationLayout>
      <Container fluid className={cx("signinContainer")}>
        <Row className={cx("signinFormRow")}>
          <Col lg={6} className={cx("signinFormWrapper")}>
            <h1>Sign In</h1>
            <p className={cx("formSubtitle")}>Welcome back! Please enter your details</p>

            {isSuccess ? (
              <div className={cx("successMessage")}>
                <div className={cx("successIcon")}>✓</div>
                <h2>Sign In Successful!</h2>
                <p>You have been successfully signed in.</p>
                <button className={cx("resetButton")} onClick={() => setIsSuccess(false)}>
                  Sign In Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={cx("signinForm")}>
                <div className={cx("formGroup")}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cx(errors.email ? "error" : "")}
                  />
                  <span className={cx("errorMessage", errors.email ? "" : "hide")}>{errors.email}</span>
                </div>

                <div className={cx("formGroup")}>
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={cx(errors.password ? "error" : "")}
                  />
                  <button type="button" className={cx("showPassword")} onClick={togglePasswordVisibility}>
                    {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                  <span className={cx("errorMessage", errors.password ? "" : "hide")}>{errors.password}</span>
                </div>

                <div className={cx("formOptions")}>
                  <div className={cx("rememberMe")}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="rememberMe">Remember me for 7 days</label>
                  </div>
                  <Link to="/forgot-password" className={cx("forgotPassword")}>
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className={cx("submitButton")} disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>

                <p className={cx("signupLink")}>
                  Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
              </form>
            )}
          </Col>
          <Col lg={6} className={cx("signupFormContent")}>
            <img src={images.img28} alt="" />
          </Col>
        </Row>
      </Container>
      {/* Hiển thị Loader fullscreen khi isLoading là true */}
      {isLoading && (
        <div className={cx("fullscreenLoader")}>
          <Loader />
        </div>
      )}
    </RegistrationLayout>
  );
};

export default SignInForm;
