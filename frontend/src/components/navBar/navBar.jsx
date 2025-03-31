import React, {useState} from "react";
import {useAuth} from "~/context/AuthContext";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import images from "~/assets/images";
import {Link, useNavigate} from "react-router-dom";

const cx = classNames.bind(styles);

const Navbar = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
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
              <a className={cx("nav-link")} href="/node-control">
                Node control
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/error-page">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {user ? (
          <div className={cx("user-menu")}>
            <div className={cx("user_image")}>
              <img src={images.user} alt="user_image" />
            </div>
            <span>
              Account
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
                <Link className={cx("submenu-link")} to="/account-detail">
                  Account information
                </Link>
              </div>
              <div className={cx("submenu-item")}>
                <Link className={cx("submenu-link")} to="/change-infomation">
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
              <Link to="/signup">
                <button className={cx("sign_in")}>Sign up</button>
              </Link>
            </div>
            <div className={cx("sign-in")}>
              <Link to="/signin">
                <button className={cx("sign_in")}>Sign in</button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
