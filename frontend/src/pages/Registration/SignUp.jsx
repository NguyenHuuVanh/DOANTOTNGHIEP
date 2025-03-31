import {useState} from "react";
import styles from "./Registration.module.scss";
import classNames from "classnames/bind";
import images from "~/assets/images";
import RegistrationLayout from "~/layouts/registrationLayout/registrationLayout ";
import {Link} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronRight, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import notify from "~/utils/toastify";

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

  // const validateForm = () => {
  //   let valid = true;
  //   const newErrors = {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //   };

  //   console.log("🔍 Checking password match:", formData.password, formData.confirmPassword);

  //   // First name validation
  //   if (!formData.firstName.trim()) {
  //     newErrors.firstName = "First name is required";
  //     valid = false;
  //   }

  //   // Last name validation
  //   if (!formData.lastName.trim()) {
  //     newErrors.lastName = "Last name is required";
  //     valid = false;
  //   }

  //   // Email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!formData.email.trim()) {
  //     newErrors.email = "Email is required";
  //     valid = false;
  //   } else if (!emailRegex.test(formData.email)) {
  //     newErrors.email = "Please enter a valid email";
  //     valid = false;
  //   }

  //   // Password validation
  //   if (!formData.password) {
  //     newErrors.password = "Password is required";
  //     valid = false;
  //   } else if (formData.password.length < 8) {
  //     newErrors.password = "Password must be at least 8 characters";
  //     valid = false;
  //   }

  //   console.log(formData.password !== formData.confirmPassword);

  //   // Confirm password validation
  //   if (!formData.confirmPassword.trim()) {
  //     newErrors.confirmPassword = "Please confirm your password";
  //     valid = false;
  //   } else if (formData.confirmPassword.length < 8) {
  //     newErrors.confirmPassword = "Confirm password must be at least 8 characters";
  //     valid = false;
  //   } else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
  //     newErrors.confirmPassword = "Passwords do not match";
  //     valid = false;
  //   } else {
  //     newErrors.confirmPassword = "";
  //   }

  //   setErrors(newErrors);
  //   return valid;
  // };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Helper function for common checks
    const validateField = (fieldName, value, minLength = 1) => {
      if (!value.trim()) {
        newErrors[fieldName] = `${fieldName.replace(/([A-Z])/g, " $1").trim()} is required`;
        return false;
      }
      if (value.trim().length < minLength) {
        newErrors[fieldName] = `${fieldName
          .replace(/([A-Z])/g, " $1")
          .trim()} must be at least ${minLength} characters`;
        return false;
      }
      return true;
    };

    // First name validation
    isValid = validateField("firstName", formData.firstName) && isValid;

    // Last name validation
    isValid = validateField("lastName", formData.lastName) && isValid;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => {
      const updatedForm = {...prev, [name]: value};
      console.log("🚀 ~ Updated formData:", updatedForm); // ✅ Giá trị mới được in ra đúng
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      const userData = {
        username: formData.firstName + formData.lastName, // Gộp làm username
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: "user",
      };

      try {
        const response = await axios.post("http://localhost:3001/register", userData);

        console.log("🚀 ~ handleSubmit ~ response.status:", response.status);
        if (response.status === 201) {
          setIsSuccess(true);
          notify.success("Đăng ký tài khoản thành công");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          setErrors({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorData = error.response.data.errors || {};

          // Cập nhật lỗi riêng biệt cho từng trường
          setErrors({
            ...errors,
            firstName: errorData.username || "",
            email: errorData.email || "",
          });
        } else {
          console.error("Lỗi server:", error.response?.data?.message || "Lỗi không xác định");
        }
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
              <div className={cx("successIcon")}>{<FontAwesomeIcon icon={faCheck} />}</div>
              <h2>Registration Successful!</h2>
              <p>Your account has been created successfully.</p>
              <button className={cx("resetButton")} onClick={() => setIsSuccess(false)}>
                <span>
                  SIGN IN <FontAwesomeIcon icon={faChevronRight} />
                </span>
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
                  <span className={cx(errors.firstName ? "errorMessage" : "NoerrorMessage")}>{errors.firstName}</span>
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
                  <span className={cx(errors.lastName ? "errorMessage" : "NoerrorMessage")}>{errors.lastName}</span>
                </div>
              </div>

              <div className={cx("formGroup")}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  className={cx(errors.email ? "error" : "")}
                />
                <span className={cx(errors.email ? "errorMessage" : "NoerrorMessage")}>{errors.email}</span>
              </div>

              <div className={cx("formGroup")}>
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  className={cx(errors.password ? "error" : "")}
                />
                <button type="button" className={cx("showPassword")} onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
                <span className={cx(errors.password ? "errorMessage" : "NoerrorMessage")}>{errors.password}</span>
              </div>

              <div className={cx("formGroup")}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cx(errors.confirmPassword ? "error" : "")}
                />
                <button type="button" className={cx("showConfirmPassword")} onClick={toggleConfirmPasswordVisibility}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
                <span className={cx(errors.confirmPassword ? "errorMessage" : "NoerrorMessage")}>
                  {errors.confirmPassword}
                </span>
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
