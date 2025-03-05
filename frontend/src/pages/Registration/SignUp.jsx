import {useState} from "react";
import styles from "./Registration.module.scss";
import classNames from "classnames/bind";
import images from "~/assets/images";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import {Link} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("🚀 ~ handleChange ~ formData:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Chuẩn bị dữ liệu gửi lên server
      const userData = {
        username: formData.firstName + formData.lastName, // Gộp làm username
        email: formData.email,
        password: formData.password,
        role: "user", // Giá trị mặc định
      };

      try {
        const response = await axios.post("http://localhost:3001/register", userData);

        if (response.status === 201) {
          setIsSuccess(true);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          console.error("Registration failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error:", error.response?.data?.message || "Lỗi server");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <RegistrationLayout>
      <div className={cx("registrationContainer")}>
        <div className={cx("registrationFormWrapper")}>
          <h1>Create an Account</h1>
          <p className={cx("formSubtitle")}>Fill in your details to get started</p>

          {isSuccess ? (
            <div className={cx("successMessage")}>
              <div className={cx("successIcon")}>✓</div>
              <h2>Registration Successful!</h2>
              <p>Your account has been created successfully.</p>
              <button className={cx("resetButton")} onClick={() => setIsSuccess(false)}>
                Register Another Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={cx("registrationForm")}>
              <div className={cx("formRow")}>
                <div className={cx("formGroup")}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={cx(errors.firstName ? "error" : "")}
                  />
                  {errors.firstName && <span className={cx("errorMessage")}>{errors.firstName}</span>}
                </div>

                <div className={cx("formGroup")}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={cx(errors.lastName ? "error" : "")}
                  />
                  {errors.lastName && <span className={cx("errorMessage")}>{errors.lastName}</span>}
                </div>
              </div>

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
                {/* <button type="button" onClick={togglePasswordVisibility} className={styles.passwordToggle}>
                  {showPassword ? "Hide" : "Show"}
                </button> */}
                <button className={cx("showPassword")}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                {errors.password && <span className={cx("errorMessage")}>{errors.password}</span>}
              </div>

              <div className={cx("formGroup")}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cx(errors.confirmPassword ? "error" : "")}
                />
                {errors.confirmPassword && <span className={cx("errorMessage")}>{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className={cx("submitButton")} disabled={isSubmitting} onSubmit={handleSubmit}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <p className={cx("loginLink")}>
                Already have an account? <Link to="/signin">Log in</Link>;
              </p>
            </form>
          )}
        </div>
        <div className={cx("registrationFormContent")}>
          <img src={images.img22} alt="" />
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default SignUpForm;
