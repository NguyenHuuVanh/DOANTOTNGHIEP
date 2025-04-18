import React, {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from "./About.module.scss";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import images from "~/assets/images";
import Loader from "../Loading/Loading";

const cx = classNames.bind(styles);

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  const teamMembers = [
    {
      name: "Nguyễn Hữu Việt Anh",
      role: "Sorfware design",
      avatar: `${images.img40}`,
    },
    {
      name: "Kim Văn Hoà",
      role: "Hardware design",
      avatar: `${images.img41}`,
    },
    {
      name: "Đỗ Minh Hiệp",
      role: "Hardware design",
      avatar: `${images.img38}`,
    },
    {
      name: "Trần Thị Hường",
      role: "Lecturer instruct",
      avatar: `${images.img39}`,
    },
  ];

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = teamMembers.map((member) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = member.avatar;
          img.onload = resolve;
          img.onerror = resolve; // Resolve ngay cả khi có lỗi để không bị treo
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={cx("loadingContainer")}>
          <Loader />
        </div>
      ) : (
        <DefaultLayout>
          <section className={cx("team-page")}>
            <div className={cx("team-header")}>
              <h1>Below is a list of members who built and developed this project</h1>
              <p className={cx("philosophy")}>
                The project is a combination of hardware and software that hopes to bring a completely new solution in
                IOT.
              </p>
            </div>

            <div className={cx("team-members")}>
              {teamMembers.map((member, index) => (
                <React.Fragment key={member.name}>
                  <TeamMember name={member.name} role={member.role} bio={member.bio} avatar={member.avatar} />
                </React.Fragment>
              ))}
            </div>
          </section>
        </DefaultLayout>
      )}
    </>
  );
};

const TeamMember = ({name, role, bio, avatar}) => (
  <article className={cx("team-member")}>
    <div className={cx("member-avatar")}>
      <img src={avatar} alt="" />
    </div>
    <div className={cx("member-content")}>
      <h2 className={cx("member-name")}>{name}</h2>
      <p className={cx("member-role")}>{role}</p>
      <p className={cx("member-bio")}>{bio}</p>
    </div>
  </article>
);

export default About;
