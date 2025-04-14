import React from "react";
import classNames from "classnames/bind";
import styles from "./Contact.module.scss";
import {FaFacebook, FaTwitter, FaLinkedin, FaPhone} from "react-icons/fa";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import images from "~/assets/images";

const cx = classNames.bind(styles);

const ContactUs = () => {
  const teamMembers = [
    {
      name: "Đỗ Minh Hiệp",
      position: "dominhhiep@gmail.com",
      phone: "+84 123 456 789",
      avatar: `${images.img38}`,
      social: {
        facebook: "https://www.facebook.com/profile.php?id=100082765705243",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      name: "Trần Thị Thu Hường",
      position: "ttthuong.kdt@uneti.edu.vn",
      phone: "0983966694",
      avatar: `${images.img39}`,
      social: {
        facebook: "ttthuong.kdt@uneti.edu.vn",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      name: "Nguyễn Hữu Việt Anh",
      position: "vietbui673@gmail.com",
      phone: "0339656147",
      avatar: `${images.img40}`,
      social: {
        facebook: "https://www.facebook.com/vietbui673/",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      name: "Kim Văn Hoà",
      position: "hoankim602@gmail.com",
      phone: "0898725352",
      avatar: `${images.img41}`,
      social: {
        facebook: "https://www.facebook.com/profile.php?id=100046945931888",
        instagram: "#",
        linkedin: "#",
      },
    },
  ];

  return (
    <DefaultLayout>
      <div className={cx("contact-container")}>
        <div className={cx("contact-header")}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you!</p>
        </div>

        <div className={cx("contact-content")}>
          <div className={cx("contact-form")}>
            <form className={cx("contact-form")}>
              <div className={cx("name-fields")}>
                <div className={cx("form-group")}>
                  <label>First Name</label>
                  <input type="text" required />
                </div>
                <div className={cx("form-group")}>
                  <label>Last Name</label>
                  <input type="text" required />
                </div>
              </div>
              <div className={cx("form-group")}>
                <label>Email</label>
                <input type="email" required />
              </div>
              <div className={cx("form-group")}>
                <label>Message</label>
                <textarea rows="5" required></textarea>
              </div>
              <button type="submit" className={cx("send-button")}>
                Send Message
              </button>
            </form>
          </div>
          <div className={cx("contact-image")}>
            <div className={cx("image")}>
              <img src={images.img47} alt="Contact illustration" />
            </div>
          </div>
        </div>
        <div className={cx("contact-members")}>
          <div className={cx("right-section")}>
            <h2>Our Team</h2>
            <div className={cx("team-grid")}>
              {teamMembers.map((member, index) => (
                <div key={index} className={cx("team-card")}>
                  <img src={member.avatar} alt={member.name} className={cx("member-avatar")} />
                  <h3>{member.name}</h3>
                  <p className={cx("position")}>{member.position}</p>
                  <div className={cx("contact-info")}>
                    <FaPhone className={cx("icon")} />
                    <span>{member.phone}</span>
                  </div>
                  <div className={cx("social-links")}>
                    <a target="blank" href={member.social.facebook}>
                      <FaFacebook className={cx("social-icon")} />
                    </a>
                    <a target="blank" href={member.social.twitter}>
                      <FaTwitter className={cx("social-icon")} />
                    </a>
                    <a target="blank" href={member.social.linkedin}>
                      <FaLinkedin className={cx("social-icon")} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactUs;
