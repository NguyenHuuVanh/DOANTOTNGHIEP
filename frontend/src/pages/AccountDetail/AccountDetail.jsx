import {useEffect, useRef, useState} from "react";
import {ChevronDown} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./AccountDetail.module.scss";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import {useAuth} from "~/context/AuthContext";
import axios from "~/utils/axiosConfig";
import notify from "~/utils/toastify";
import moment from "moment";
import {Navigate} from "react-router-dom";
import ConfirmModal from "~/components/ConfirmModal/ConfirmModal";

const cx = classNames.bind(styles);

const AccountDetails = () => {
  const {user, logout, updateUser} = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveChanges = async () => {
    try {
      const formattedBirthday = moment(birthday, "DD/MM/YYYY").format("YYYY-MM-DD");

      const updatedUser = {
        id: user.id,
        firstname: firstName,
        lastname: lastName,
        username: fullName,
        language,
        birthday: formattedBirthday,
        phonenumber: phoneNumber,
        country,
        address,
        message,
      };

      const response = await axios.put("/update-user", updatedUser);
      if (response.status === 200) {
        const updatedUser = response.data.updatedUser;
        updateUser(updatedUser); // Cập nhật thông tin user trong Context
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Cập nhật localStorage
        notify.success("Cập nhật thông tin thành công!");
      } else {
        notify.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      notify.error(errorMessage); // Hiển thị message từ backend
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`/delete-user/${user.id}`);
      if (response.status === 200) {
        notify.success("Account deleted successfully!");
        logout();
        Navigate("/signin");
      } else {
        notify.error("Unable to delete account. Please try again.");
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleClearData = () => {
    setFirstName("");
    setLastName("");
    setFullName("");
    setLanguage("");
    setBirthday("");
    setPhoneNumber("");
    setCountry("");
    setAddress("");
    setMessage("");
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setFullName(user.username || "");
      setLanguage(user.language || "Vietnamese");
      const parsedBirthday = moment(user.birthday, ["YYYY-MM-DD", "DD/MM/YYYY"], true);
      setBirthday(parsedBirthday.isValid() ? parsedBirthday.format("MM/DD/YYYY") : "");
      setPhoneNumber(user.phonenumber?.toString() || "");
      setCountry(user.country || "");
      setAddress(user.address || "");
      setMessage(user.message || "");
    }
  }, [user]);

  return (
    <DefaultLayout>
      <div className={cx("account-page")}>
        <div className={cx("account-container")}>
          <div className={cx("account-header")}>
            <h1 className={cx("account-title")}>Account Details</h1>
          </div>

          <div className={cx("account-content")}>
            <div className={cx("profile-section")}>
              <div className={cx("profile-actions")}>
                <h2 className={cx("profile-title")}>{`Welcome Back, ${user.username}`}</h2>
              </div>
            </div>

            <div className={cx("form-section")}>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label htmlFor="name">Firstname</label>
                  <input
                    type="text"
                    id="name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={cx("form-input")}
                  />
                </div>
                <div className={cx("form-group")}>
                  <label htmlFor="name">Lastname</label>
                  <input
                    type="text"
                    id="name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={cx("form-input")}
                  />
                </div>
              </div>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label htmlFor="name">Fullname</label>
                  <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={cx("form-input")}
                  />
                </div>
              </div>

              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label htmlFor="dateFormat">Birth day</label>
                  <div className={cx("select-wrapper")}>
                    <div className={cx("date-input-container")}>
                      <input
                        type="text"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        placeholder="mm/dd/yyyy"
                        maxLength="10"
                        className={cx("date-input")}
                      />
                    </div>
                  </div>
                </div>
                <div className={cx("form-group")}>
                  <label htmlFor="timeFormat">Phone number</label>
                  <div className={cx("select-wrapper")}>
                    <input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={cx("form-select")}
                    />
                  </div>
                </div>
                <div className={cx("form-group")}>
                  <label htmlFor="country">Country</label>
                  <div className={cx("select-wrapper")}>
                    <input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={cx("form-select")}
                    />
                  </div>
                </div>
              </div>

              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label htmlFor="timeZone">Address:</label>
                  <div className={cx("select-wrapper")}>
                    <input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={cx("form-select")}
                    />
                  </div>
                </div>
                <div className={cx("form-group")}>
                  <label htmlFor="language">Language</label>
                  <div className={cx("select-wrapper")}>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={cx("form-select")}
                    >
                      <option value="Vietnamese">Vietnamese</option>
                      <option value="English">English</option>
                    </select>
                    <ChevronDown size={16} className={cx("select-icon")} />
                  </div>
                </div>
              </div>

              <div className={cx("form-row")}>
                <div className={cx("form-group", "full-width")}>
                  <label htmlFor="welcomeMessage">Welcome Message</label>
                  <textarea
                    id="welcomeMessage"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={cx("form-textarea")}
                    rows={3}
                  />
                </div>
              </div>

              <div className={cx("form-actions")}>
                <button onClick={handleSaveChanges} className={cx("save-btn")}>
                  Save Change
                </button>
                <button className={cx("cancel-btn")} onClick={handleClearData}>
                  Cancel
                </button>
                <button className={cx("delete-btn")} onClick={() => setIsModalOpen(true)}>
                  Delete Account
                </button>
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

export default AccountDetails;
