import React from "react";
import classNames from "classnames/bind";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import styles from "./Footer.module.scss";

import {faFacebook, faInstagram, faThreads} from "@fortawesome/free-brands-svg-icons";
import {Col, Container, Row} from "react-bootstrap";

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx("footer")}>
      <div className={cx("footer-content")}>
        <Container className={cx("footer-container")}>
          <Row className={cx("footer-section")}>
            <Col xs={6} sm={6} lg={3}>
              <div className={cx("footer-section")}>
                <h4 className={cx("section-title")}>INFO</h4>
                <ul className={cx("section-list")}>
                  <li>Formats</li>
                  <li>Compression</li>
                  <li>Pricing</li>
                  <li>FAQ</li>
                  <li>Status</li>
                </ul>
              </div>
            </Col>

            <Col xs={6} sm={6} lg={3}>
              <div className={cx("footer-section")}>
                <h4 className={cx("section-title")}>RESOURCES</h4>
                <ul className={cx("section-list")}>
                  <li>Developer API</li>
                  <li>Tools</li>
                  <li>Blog</li>
                </ul>
              </div>
            </Col>

            <Col xs={6} sm={6} lg={3}>
              <div className={cx("footer-section")}>
                <h4 className={cx("section-title")}>COMPANY</h4>
                <ul className={cx("section-list")}>
                  <li>About Us</li>
                  <li>Sustainability</li>
                  <li>Terms of Service</li>
                  <li>Privacy</li>
                </ul>
              </div>
            </Col>

            <Col xs={6} sm={6} lg={3}>
              <div className={cx("newsletter-section")}>
                <h4 className={cx("section-title")}>Subscribe to our email newsletter</h4>
                <div className={cx("newsletter-form")}>
                  <input type="email" placeholder="Your email" />
                  <button className={cx("subscribe-btn")}>SUBSCRIBE</button>
                </div>
                <div className={cx("follow-us")}>
                  <span>Follow us:</span>
                  <div className={cx("social-icons")}>
                    <FontAwesomeIcon icon={faFacebook} />
                    <FontAwesomeIcon icon={faInstagram} />
                    <FontAwesomeIcon icon={faThreads} />
                    {/* <FontAwesomeIcon icon={["fa-brands", "fa-threads"]} /> */}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
