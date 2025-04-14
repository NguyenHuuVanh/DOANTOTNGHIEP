import {Pencil} from "lucide-react";
import styles from "./ChangeInfomation.module.scss";
import classNames from "classnames/bind";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import {useNavigate} from "react-router-dom";
import {useAuth} from "~/context/AuthContext";
import axios from "~/utils/axiosConfig";
import images from "~/assets/images";
import notify from "~/utils/toastify";
import {useState} from "react";
import ConfirmModal from "~/components/ConfirmModal/ConfirmModal";

const cx = classNames.bind(styles);

const ChangeInfomation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {user, logout} = useAuth();

  const handleEdit = () => {
    navigate("/account-detail");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`/delete-user/${user.id}`);
      if (response.status === 200) {
        notify.success("Account deleted successfully!");
        logout();
        navigate("/signin");
      } else {
        notify.error("Unable to delete account. Please try again.");
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
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
                <div className={cx("sidebar-item")} onClick={handleChangePassword}>
                  Security
                </div>
                <div className={cx("sidebar-item")}>Data Export</div>
                <div className={cx("sidebar-item", "delete")} onClick={() => setIsModalOpen(true)}>
                  Delete Account
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className={cx("main-content")}>
              <div className={cx("profile-section")}>
                <h2 className={cx("section-title")}>My Profile</h2>

                <div className={cx("profile-header")}>
                  <div className={cx("profile-info")}>
                    <div className={cx("profile-details")}>
                      <h3 className={cx("profile-name")}>{user?.username ?? ""}</h3>
                      <p className={cx("profile-location")}>{user?.country ?? ""}</p>
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
                    <p className={cx("info-value")}>{user?.firstname ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Last Name</p>
                    <p className={cx("info-value")}>{user?.lastname ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Email address</p>
                    <p className={cx("info-value")}>{user?.email ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Language</p>
                    <p className={cx("info-value")}>{user?.language ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Phone</p>
                    <p className={cx("info-value")}>{user?.phonenumber ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Birthday</p>
                    <p className={cx("info-value")}>{user?.birthday ?? ""}</p>
                  </div>
                  <div className={cx("info-item", "full-width")}>
                    <p className={cx("info-label")}>Bio</p>
                    <p className={cx("info-value")}>{user?.message ?? ""}</p>
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
                    <p className={cx("info-value")}>{user?.country ?? ""}</p>
                  </div>
                  <div className={cx("info-item")}>
                    <p className={cx("info-label")}>Address</p>
                    <p className={cx("info-value")}>{user?.address ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Confirm account deletion"
        message="We’re sorry to see you go. Once your account is deleted, all of your content will be permanently gone, including your profile, stories, publications, notes, and responses. If you’re not sure about that, we suggest you deactivate!"
      />
    </DefaultLayout>
  );
};

export default ChangeInfomation;
