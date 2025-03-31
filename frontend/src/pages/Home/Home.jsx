import React, {useEffect} from "react";
import classNames from "classnames/bind";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "./Home.module.scss";
import images from "~/assets/images";
import axios from "axios";
import {fetchNodeData} from "~/apis/nodeData";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import FeatureCard from "~/components/FeatureCard/FeatureCard";
import TestimonialCard from "~/components/TestimonialCard/TestimonialCard";
import StatCard from "~/components/TestimonialCard copy/StatCard";
import {useNavigate} from "react-router-dom";

const cx = classNames.bind(styles);
const Home = () => {
  const navigate = useNavigate();

  const getData = () => {
    axios
      .get("http://localhost:3001/node_data")
      .then((response) => {
        console.log(response.data.data);
      })
      .then((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // fetchNodeData();
    // getData();
  }, []);
  return (
    <div className={cx("container")}>
      <DefaultLayout>
        <section className={cx("main")}>
          <div className={cx("industry-solutions")}>
            <div className={cx("content")}>
              <h1>Biến Đổi Ngành Công Nghiệp Với Giải Pháp IoT</h1>
              <p>
                Internet of Things (IoT) đang cách mạng hóa cách các ngành công nghiệp hoạt động bằng cách kết nối liền
                mạch các thiết bị, cảm biến và hệ thống. Công nghệ này giúp doanh nghiệp đưa ra các quyết định dựa trên
                dữ liệu, tối ưu hóa hiệu suất và mang lại giá trị vượt trội cho khách hàng.
              </p>
              <button className={cx("learn-more")}>Learn More →</button>
            </div>
            <div className={cx("image-container")}>
              <img src={images.img23} alt="Charts and Analytics" />
            </div>
          </div>
        </section>

        <section className={cx("features")}>
          <h2>Tính Năng Chính</h2>
          <div className={cx("feature-list")}>
            <FeatureCard title="Giám sát từ xa" description="Theo dõi dữ liệu cảm biến mọi lúc mọi nơi." />
            <FeatureCard title="Phân tích dữ liệu" description="Xử lý & hiển thị báo cáo theo thời gian thực." />
            <FeatureCard title="Tự động hóa" description="Cải thiện hiệu suất vận hành & tiết kiệm chi phí." />
          </div>
        </section>

        <section className={cx("image-section")}>
          <h2>Hình Ảnh Minh Họa</h2>
          <div className={cx("carousel-container")}>
            <Splide
              options={{
                perPage: 3, // Hiển thị 3 ảnh trên 1 slide
                perMove: 1, // Di chuyển từng ảnh mỗi lần
                gap: "2rem", // Khoảng cách giữa các ảnh
                pagination: false, // Ẩn dấu chấm trang
                padding: "2rem",
                arrows: true, // Hiển thị nút điều hướng
                breakpoints: {
                  1024: {perPage: 2}, // Khi màn hình nhỏ hơn 1024px, hiển thị 2 ảnh
                  768: {perPage: 1}, // Khi màn hình nhỏ hơn 768px, hiển thị 1 ảnh
                },
              }}
              aria-label="My Favorite Images"
            >
              {Object.values(images).map((image, index) => {
                return (
                  <SplideSlide key={index}>
                    <img src={image} alt={image.alt} className="image" />
                  </SplideSlide>
                );
              })}
            </Splide>
          </div>
        </section>

        <section className={cx("cta")}>
          <h2>Bắt Đầu Ngay Hôm Nay</h2>
          <p>Hãy trải nghiệm giải pháp IoT để nâng cao hiệu quả sản xuất và tối ưu hóa quy trình làm việc.</p>
          <div className={cx("cta-btn")}>
            <button onClick={() => navigate("/signin")} className={cx("btn")}>
              Đăng Ký Dùng Thử →
            </button>
          </div>
        </section>
      </DefaultLayout>
    </div>
  );
};

export default Home;
