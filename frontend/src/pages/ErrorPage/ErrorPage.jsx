import classNames from "classnames/bind";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./ErrorPage.module.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";

const cx = classNames.bind(styles);

const ErrorPage = () => {
  return (
    <section className={cx("page_404")}>
      <div className={cx("container")}>
        <div className={cx("row")}>
          <div className={cx("col-sm-12")}>
            <div className={cx("col-sm-12", "col-sm-offset-1", "text-center")}>
              <div className={cx("four_zero_four_bg")}>
                <h1 className={cx("text-center")}>404</h1>
              </div>

              <div className={cx("contant_box_404")}>
                <h3 className={cx("h2")}>Look like you're lost</h3>

                <p>the page you are looking for not avaible!</p>

                <a href="/" className={cx("link_404")}>
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
