import React, {useEffect} from "react";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";
import images from "~/assets/images";
import axios from "axios";

const cx = classNames.bind(styles);
const Home = () => {
  const getData = () => {
    axios
      .get("http://localhost:3001/data_sensor")
      .then((response) => {
        console.log(response.data.data);
      })
      .then((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={cx("container")}>
      <nav className={cx("navbar")}>
        <ul className={cx("navLinks")}>
          <div className={cx("logo")}>
            <img className={cx("logo")} src={images.logo} alt="" />
          </div>
          <li>
            <a href="#about" className={cx("link")}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" className={cx("link")}>
              Contact
            </a>
          </li>
          <li>
            <a href="#used" className={cx("link")}>
              Used
            </a>
          </li>
          <li>
            <a href="/node-1" className={cx("link")}>
              Node 1
            </a>
          </li>
          <li>
            <a href="/node-2" className={cx("link")}>
              Node 2
            </a>
          </li>
          <li>
            <a href="/node-control" className={cx("link")}>
              Node control
            </a>
          </li>
        </ul>
        <div className={cx("authButtons")}>
          <button className={cx("btn", "signin")}>Sign In</button>
          <button className={cx("btn", "signout")}>Sign Out</button>
        </div>
      </nav>

      <main className={cx("main")}>
        <section id="about" className={cx("aboutSection")}>
          <h1>Máy Sấy Phun Công Nghiệp</h1>
          <p>
            Máy sấy phun là thiết bị quan trọng trong công nghiệp thực phẩm, hóa chất, và dược phẩm, giúp chuyển đổi
            chất lỏng thành bột khô một cách nhanh chóng và hiệu quả.
          </p>
        </section>

        <div className={cx("contents")}>
          <img src={images.img1} alt="Máy sấy phun thực tế" className={cx("image")} />
          <img src={images.img2} alt="Sơ đồ cấu tạo máy sấy phun" className={cx("image")} />
        </div>

        <section id="used" className={cx("components")}>
          <h2>Các thành phần chính của máy sấy phun</h2>
          <ul>
            <li>Bộ trao đổi nhiệt (Heat exchanger)</li>
            <li>Quạt hút khí nóng (Hot air exhaust blower)</li>
            <li>Bộ phun (Spraying unit)</li>
            <li>Bơm áp lực (Pressure pump)</li>
            <li>Đồng hồ áp suất (Pressure gauge)</li>
            <li>Bộ phân phối nhiệt (Heat distributor)</li>
            <li>Buồng sấy (Drying tower)</li>
            <li>Cửa vệ sinh (Door for cleaning)</li>
            <li>Cyclone tách bụi (Cyclone for separating dust)</li>
            <li>Quạt lưu thông (Circulation fan)</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className={cx("footer")}>
        <p>&copy; Nguyễn Hữu Việt Anh</p>
      </footer>
    </div>
  );
};

export default Home;
