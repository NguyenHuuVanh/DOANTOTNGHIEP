import React, {useEffect, useState} from "react";
import {useAuth} from "~/context/AuthContext";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import images from "~/assets/images";
import {Link, useNavigate} from "react-router-dom";
import notify from "~/utils/toastify";
import Loader from "../Loading/Loading";

const cx = classNames.bind(styles);

const Navbar = () => {
  const {user, logout} = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Thêm state loading
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Bắt đầu hiển thị loading
      await logout(); // Đảm bảo hàm logout trả về Promise
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      notify.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false); // Tắt loading dù thành công hay thất bại
    }
  };

  // Hàm xử lý khi nhấp vào "Node Control"
  const handleNodeControlClick = () => {
    if (user) {
      // Nếu đã đăng nhập, điều hướng đến trang Node Control
      navigate("/node-control");
    } else {
      // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      navigate("/signin");
      notify.warning("You must log in or register an account!");
    }
  };

  return (
    <div className={cx("container")}>
      <header className={cx("header")}>
        <div className={cx("logo")}>
          <li className={cx("nav-item")}>
            <a className={cx("nav-link")} href="/">
              <img src={images.logo} alt="Logo" />
            </a>
          </li>
        </div>

        <nav className={cx("navbar")}>
          <ul className={cx("navbar-nav")}>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/">
                Home
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/about">
                About
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/node-1">
                Node data
                <svg viewBox="0 0 360 360" xmlSpace="preserve">
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="XMLID_225_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    ></path>
                  </g>
                </svg>
              </a>
              <div className={cx("submenu")}>
                <div className={cx("submenu-item")}>
                  <a href="node-1" className={cx("submenu-link")}>
                    Node 1
                  </a>
                </div>
                <div className={cx("submenu-item")}>
                  <a href="node-2" className={cx("submenu-link")}>
                    Node 2
                  </a>
                </div>
              </div>
            </li>
            <li className={cx("nav-item")}>
              <button className={cx("nav-link")} onClick={handleNodeControlClick}>
                Node control
              </button>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/contact">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {user ? (
          <div className={cx("user-menu")}>
            <span>
              Hi, {user ? user.username : "Hi there!"}
              <svg viewBox="0 0 360 360" xmlSpace="preserve">
                <g id="SVGRepo_iconCarrier">
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  ></path>
                </g>
              </svg>
              {user.name}
            </span>
            <div className={cx("submenu")}>
              <div className={cx("submenu-item")}>
                <Link className={cx("submenu-link")} to="/change-infomation">
                  My account
                </Link>
              </div>
              <div className={cx("submenu-item")}>
                <Link className={cx("submenu-link")} to="/account-detail">
                  Change information
                </Link>
              </div>

              <div className={cx("submenu-item")}>
                <Link className={cx("submenu-link")} to="/change-password">
                  Change password
                </Link>
              </div>
              <div className={cx("submenu-item")}>
                <button className={cx("submenu-link", "logout")} onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={cx("regestration")}>
            <div className={cx("sign-in")}>
              <a href="/signup">
                <button className={cx("sign_in")}>Sign up</button>
              </a>
            </div>
            <div className={cx("sign-in")}>
              <a href="/signin">
                <button className={cx("sign_in")}>Sign in</button>
              </a>
            </div>
          </div>
        )}
      </header>
      {isLoggingOut && <Loader />}
    </div>
  );
};

export default Navbar;
