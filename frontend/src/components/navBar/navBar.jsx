import React, {useEffect, useState} from "react";
import {useAuth} from "~/context/AuthContext";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import images from "~/assets/images";
import {Link, useNavigate} from "react-router-dom";
import notify from "~/utils/toastify";
import Loader from "../Loading/Loading";
import {FiMenu} from "react-icons/fi";
import {IoClose} from "react-icons/io5";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import {FaDatabase, FaHome, FaInfoCircle, FaPhone} from "react-icons/fa";
import {MdGroups2, MdLogout} from "react-icons/md";
import {RiLockPasswordFill, RiRemoteControlFill} from "react-icons/ri";
import {FaCircleUser} from "react-icons/fa6";

const cx = classNames.bind(styles);

const Navbar = () => {
  const {user, logout} = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Close dropdown when menu is toggled
    setDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(`.${styles.navbar}`) && !event.target.closest(`.${styles.menuToggle}`)) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, styles.navbar, styles.menuToggle]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      notify.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNodeControlClick = () => {
    if (user) {
      navigate("/node-control");
    } else {
      navigate("/signin");
      notify.warning("You must log in or register an account!");
    }
    setMenuOpen(false);
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

        <button className={cx("menuToggle")} onClick={toggleMenu} aria-label="Toggle navigation">
          {menuOpen ? <IoClose className={cx("menuIcon")} /> : <FiMenu className={cx("menuIcon")} />}
        </button>

        <nav className={cx("navbar", {"navbar-active": menuOpen})}>
          <ul className={cx("navbar-nav")}>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/" onClick={() => setMenuOpen(false)}>
                {menuOpen ? <FaHome /> : ""} Home
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/about" onClick={() => setMenuOpen(false)}>
                {menuOpen ? <MdGroups2 /> : ""}About
              </a>
            </li>
            <li className={cx("nav-item", "dropdown", {"dropdown-active": dropdownOpen})}>
              <a className={cx("nav-link")} href="#" onClick={toggleDropdown}>
                {menuOpen ? <FaDatabase /> : ""} Node data
                {dropdownOpen ? (
                  <FiChevronUp className={cx("dropdown-icon")} />
                ) : (
                  <FiChevronDown className={cx("dropdown-icon")} />
                )}
              </a>
              <div className={cx("submenu", {"submenu-active": dropdownOpen})}>
                <div className={cx("submenu-item")}>
                  <a
                    href="node-1"
                    className={cx("submenu-link")}
                    onClick={() => {
                      setMenuOpen(false);
                      setDropdownOpen(false);
                    }}
                  >
                    Node 1
                  </a>
                </div>
                <div className={cx("submenu-item")}>
                  <a
                    href="node-2"
                    className={cx("submenu-link")}
                    onClick={() => {
                      setMenuOpen(false);
                      setDropdownOpen(false);
                    }}
                  >
                    Node 2
                  </a>
                </div>
              </div>
            </li>
            <li className={cx("nav-item")}>
              <button
                className={cx("nav-link")}
                onClick={() => {
                  handleNodeControlClick();
                  setMenuOpen(false);
                }}
              >
                {menuOpen ? <RiRemoteControlFill /> : ""}Node control
              </button>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="/contact" onClick={() => setMenuOpen(false)}>
                {menuOpen ? <FaPhone /> : ""}Contact Us
              </a>
            </li>
          </ul>

          {/* Mobile view authentication buttons */}
          <div className={cx("mobile-auth")}>
            {user ? (
              <div className={cx("mobile-user-menu")}>
                <div className={cx("user-info")}>
                  <span>Hi, {user.username}</span>
                </div>
                <div className={cx("mobile-submenu")}>
                  <div className={cx("submenu-item")}>
                    <Link className={cx("submenu-link")} to="/change-infomation" onClick={() => setMenuOpen(false)}>
                      {menuOpen ? <FaCircleUser /> : ""} My account
                    </Link>
                  </div>
                  <div className={cx("submenu-item")}>
                    <Link className={cx("submenu-link")} to="/account-detail" onClick={() => setMenuOpen(false)}>
                      {menuOpen ? <FaInfoCircle /> : ""} Change information
                    </Link>
                  </div>
                  <div className={cx("submenu-item")}>
                    <Link className={cx("submenu-link")} to="/change-password" onClick={() => setMenuOpen(false)}>
                      {menuOpen ? <RiLockPasswordFill /> : ""} Change password
                    </Link>
                  </div>
                  <div className={cx("submenu-item")}>
                    <button
                      className={cx("submenu-link", "logout")}
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      {menuOpen ? <MdLogout /> : ""} Log out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cx("mobile-regestration")}>
                <div className={cx("sign-in")}>
                  <a href="/signup" onClick={() => setMenuOpen(false)}>
                    <button className={cx("sign_in")}>Sign up</button>
                  </a>
                </div>
                <div className={cx("sign-in")}>
                  <a href="/signin" onClick={() => setMenuOpen(false)}>
                    <button className={cx("sign_in")}>Sign in</button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop view authentication */}
        <div className={cx("desktop-auth")}>
          {user ? (
            <div className={cx("user-menu")}>
              <span>
                Hi, {user.username}
                <svg viewBox="0 0 360 360" xmlSpace="preserve">
                  <g id="SVGRepo_iconCarrier">
                    <path
                      id="XMLID_225_"
                      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                    ></path>
                  </g>
                </svg>
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
        </div>
      </header>
      {isLoggingOut && <Loader />}
    </div>
  );
};

export default Navbar;
