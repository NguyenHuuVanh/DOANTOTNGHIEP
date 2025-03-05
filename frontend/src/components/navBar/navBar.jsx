import React from "react";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import images from "~/assets/images";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
const Navbar = () => {
  return (
    <div className={cx("container")}>
      <header className={cx("header")}>
        <div className={cx("logo")}>
          <li className={cx("nav-item")}>
            <a className={cx("nav-link")} href="/">
              <img src={images.logo} alt="" />
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
              <a className={cx("nav-link")} href="#">
                About
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="node-1">
                Node data
                {/* <FontAwesomeIcon classNames={cx("caretDown")} icon={faCaretDown} />
                <FontAwesomeIcon classNames={cx("caretUp")} icon={faCaretUp} /> */}
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
              <a className={cx("nav-link")} href="node-control">
                Node control
              </a>
            </li>
            <li className={cx("nav-item")}>
              <a className={cx("nav-link")} href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
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
      </header>
    </div>
  );
};

export default Navbar;
