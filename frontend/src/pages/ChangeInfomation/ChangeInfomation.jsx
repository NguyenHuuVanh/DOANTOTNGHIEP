import {Pencil} from "lucide-react";
import styles from "./ChangeInfomation.module.scss";
import classNames from "classnames/bind";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import {useNavigate} from "react-router-dom";
import {useAuth} from "~/context/AuthContext";

const cx = classNames.bind(styles);

const ChangeInfomation = () => {
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  console.log("🚀 ~ ChangeInfomation ~ user:", user);
  const handleEdit = () => {
    navigate("/account-detail");
  };
  return (
    <DefaultLayout>
      <div className={cx("account-settings-container")}>
        <div className={cx("account-settings-wrapper")}>
          <h1 className={cx("account-settings-title")}>Account Settings</h1>

          <div className={cx("account-settings-content")}>
            {/* Sidebar */}
            <div className={cx("sidebar")}>
              <nav className={cx("sidebar-nav")}>
                <div className={cx("sidebar-item", "active")}>My Profile</div>
                <div className={cx("sidebar-item")}>Security</div>
                <div className={cx("sidebar-item")}>Teams</div>
                <div className={cx("sidebar-item")}>Team Member</div>
                <div className={cx("sidebar-item")}>Notifications</div>
                <div className={cx("sidebar-item")}>Billing</div>
                <div className={cx("sidebar-item")}>Data Export</div>
                <div className={cx("sidebar-item", "delete")}>Delete Account</div>
              </nav>
            </div>

            {/* Main Content */}
            <div className={cx("main-content")}>
              <div className={cx("profile-section")}>
                <h2 className={cx("section-title")}>My Profile</h2>

                <div className={cx("profile-header")}>
                  <div className={cx("profile-info")}>
                    <div className={cx("profile-avatar")}>
                      {/* <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Profile picture"
                      width={64}
                      height={64}
                      className={cx("avatar-image")}
                    /> */}
                    </div>
                    <div className={cx("profile-details")}>
                      <h3 className={cx("profile-name")}>{user.username}</h3>
                      <p className={cx("profile-location")}>{user.country}</p>
                    </div>
                  </div>
                  <button className={cx("edit-button")} onClick={handleEdit}>
                    <span>Edit</span>
                    <Pencil size={16} />
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className={cx("info-section")}>
                <div className={cx("section-header")}>
                  <h3 className={cx("section-title")}>Personal Information</h3>
                  <button className={cx("edit-button")} onClick={handleEdit}>
                    <span>Edit</span>
                    <Pencil size={16} />
                  </button>
                </div>

                <div className={cx("info-grid")}>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>First Name</p>
                    <p className={cx("info-value")}>{user.username}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Last Name</p>
                    <p className={cx("info-value")}>{user.username}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Email address</p>
                    <p className={cx("info-value")}>{user.email}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Phone</p>
                    <p className={cx("info-value")}>{user.phonenumber}</p>
                  </div>
                  <div className={cx("info-item", "full-width")}>
                    <p className={cx("info-label")}>Bio</p>
                    <p className={cx("info-value")}>{user.message}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className={cx("info-section")}>
                <div className={cx("section-header")}>
                  <h3 className={cx("section-title")}>Address</h3>
                  <button className={cx("edit-button")}>
                    <span>Edit</span>
                    <Pencil size={16} />
                  </button>
                </div>

                <div className={cx("info-grid")}>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Country</p>
                    <p className={cx("info-value")}>{user.country}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>City</p>
                    <p className={cx("info-value")}>{user.address}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Postal Code</p>
                    <p className={cx("info-value")}>ERT 2354</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>TAX ID</p>
                    <p className={cx("info-value")}>AS45645756</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChangeInfomation;
