import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import styles from "./Home.module.scss";
import images from "~/assets/images";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import FeatureCard from "~/components/FeatureCard/FeatureCard";
import {useNavigate} from "react-router-dom";
import {BsArrowUpRight} from "react-icons/bs";
import Loader from "~/components/Loading/Loading";

const cx = classNames.bind(styles);
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = Object.values(images).map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  return (
    <div className={cx("container")}>
      {isLoading ? (
        <div className={cx("loadingContainer")}>
          <Loader />
        </div>
      ) : (
        <DefaultLayout>
          <section className={cx("main")}>
            <div className={cx("industry-solutions")}>
              <div className={cx("content")}>
                <h1>Transforming Industries With IoT Solutions</h1>
                <p>
                  The Internet of Things (IoT) is revolutionizing the way industries operate by seamlessly connecting
                  devices, sensors, and systems. This technology helps businesses make data-driven decisions, optimize
                  performance, and deliver superior value to customers.
                </p>
                <button className={cx("styled-button")}>
                  Learn more
                  <div className={cx("inner-button")}>
                    <svg
                      id="Arrow"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      height="30px"
                      width="30px"
                      className={cx("icon")}
                    >
                      <defs>
                        <linearGradient y2="100%" x2="100%" y1="0%" x1="0%" id="iconGradient">
                          <stop style={{stopColor: "#FFFFFF", stopOpacity: "1", offset: "0%"}}></stop>
                          <stop style={{stopColor: "#FFFFFF", stopOpacity: "1", offset: "100%"}}></stop>
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#iconGradient)"
                        d="M4 15a1 1 0 0 0 1 1h19.586l-4.292 4.292a1 1 0 0 0 1.414 1.414l6-6a.99.99 0 0 0 .292-.702V15c0-.13-.026-.26-.078-.382a.99.99 0 0 0-.216-.324l-6-6a1 1 0 0 0-1.414 1.414L24.586 14H5a1 1 0 0 0-1 1z"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div className={cx("image-container")}>
                <img src={images.img46} alt="Charts and Analytics" />
              </div>
            </div>
          </section>

          <section className={cx("features")}>
            <div className={cx("container")}>
              <h2>Main Features</h2>
              <div className={cx("feature-list")}>
                <FeatureCard
                  title="Remote monitoring"
                  description="Monitor sensor data anytime, anywhere"
                  img={images.img42}
                />
                <FeatureCard
                  title="Remote control"
                  description="Process & display reports in real time"
                  img={images.img43}
                />
                <FeatureCard
                  title="Data statistics"
                  description="Improve operational efficiency & save costs"
                  img={images.img44}
                />
              </div>
            </div>
          </section>

          <section className={cx("image-section")}>
            <div className={cx("container")}>
              <h2>Illustration Image</h2>
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
            </div>
          </section>

          <section className={cx("cta")}>
            <div className={cx("container")}>
              <div className={cx("content")}>
                <p>TRY IT NOW</p>
                <h2>Get Started Today</h2>
                <p>Experience IoT solutions to improve production efficiency and optimize workflows.</p>
              </div>
              <div className={cx("cta-btn")}>
                <button className={cx("primary-button")} type="button">
                  <a href="/signin">Got Started Now</a>
                </button>
                <button className={cx("secondary-button")} type="button">
                  Learn More <BsArrowUpRight />
                </button>
              </div>
            </div>
          </section>
        </DefaultLayout>
      )}
    </div>
  );
};

export default Home;
