import {useState} from "react";
import classNames from "classnames/bind";
import styles from "./Registration.module.scss";
import images from "~/assets/images";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const cx = classNames.bind(styles);

const SignInForm = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     setIsSubmitting(true);

  //     // Simulate API call
  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 1500));
  //       setIsSuccess(true);
  //       // Reset form after successful submission
  //       setFormData({
  //         email: "",
  //         password: "",
  //         rememberMe: false,
  //       });
  //     } catch (error) {
  //       console.error("Sign in failed:", error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      axios
        .post("http://localhost:3001/login", formData) // Sửa đường dẫn API (thêm `/api/`)
        .then((response) => {
          if (response.status === 200) {
            navigate("/"); // Chuyển hướng nếu đăng nhập thành công
          } else {
            setIsSuccess(false);
            setErrors({
              email: response.data.message || "Invalid email or password",
              password: "",
            });
          }
        })
        .catch((error) => {
          console.error("Login failed:", error.response?.data?.message || "Lỗi server");
          setErrors({
            email: "Login failed. Please try again.",
            password: "",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <RegistrationLayout>
      <div className={cx("signinContainer")}>
        <div className={cx("signinFormWrapper")}>
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
                {errors.email && <span className={cx("errorMessage")}>{errors.email}</span>}
              </div>

              <div className={cx("formGroup")}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cx(errors.password ? "error" : "")}
                />
                {errors.password && <span className={cx("errorMessage")}>{errors.password}</span>}
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
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="#" className={cx("forgotPassword")}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={cx("submitButton")} disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <p className={cx("signupLink")}>
                Don't have an account? <Link to="/signup">Sign</Link>;
              </p>
            </form>
          )}
        </div>
        <div className={cx("signupFormContent")}>
          <img src={images.img28} alt="" />
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default SignInForm;
