import {useEffect, useRef, useState} from "react";
import {ChevronDown, Plus, X, Upload, Trash2, Star, BookOpen, UserPlus} from "lucide-react";
import classNames from "classnames/bind";
import styles from "./AccountDetail.module.scss";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout ";
import {useAuth} from "~/context/AuthContext";
import images from "~/assets/images";
import axios from "axios";
import notify from "~/utils/toastify";
import moment from "moment";

const cx = classNames.bind(styles);

const AccountDetails = () => {
  const {user, updatedUser} = useAuth();
  console.log("🚀 ~ AccountDetails ~ user:", user);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(""); // Lưu ảnh đã chọn
  const fileInputRef = useRef(null); // Tạo ref cho input file
  console.log("🚀 ~ AccountDetails ~ address:", address);

  const handleUpload = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời
      setImage(imageUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setImage(null);
  };

  const handleSaveChanges = async () => {
    try {
      const formattedBirthday = moment(birthday, "DD/MM/YYYY").format("YYYY-MM-DD");

      const updatedUser = {
        id: user.id, // ID người dùng cần cập nhật
        username: name,
        language,
        birthday: formattedBirthday,
        phonenumber: phoneNumber,
        country,
        address,
        message,
        profileimage: image, // Lưu URL ảnh
      };

      const response = await axios.put("http://localhost:3001/update-user", updatedUser);
      if (response.status === 200) {
        const updatedUser = response.data.updatedUser;
        updatedUser(updatedUser); // Cập nhật thông tin user trong Context
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ Cập nhật localStorage
        notify.success("Cập nhật thông tin thành công!");
      } else {
        notify.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      notify.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    setName(user.username ?? "");
    setLanguage(user.language ?? "Vietnamese");
    setBirthday(user.birthday ?? "");
    setPhoneNumber(user.phonenumber || "");
    setCountry(user.country ?? "");
    setAddress(user.address ?? "");
    setMessage(user.message ?? "");
    setImage(user.profileImage ?? images.user);
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
              {image ? (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "inline-block",
                    border: "2px solid #ddd",
                  }}
                >
                  <img src={image} alt="Uploaded" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "inline-block",
                    border: "2px solid #ddd",
                  }}
                >
                  <img src={images.user} alt="Uploaded" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
              )}
              <div className={cx("profile-actions")}>
                <button className={cx("upload-btn")} onClick={handleButtonClick}>
                  <Upload size={16} className={cx("icon")} />
                  Upload
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  style={{display: "none"}}
                />
                <button className={cx("remove-btn")} onClick={handleRemove}>
                  <Trash2 size={16} className={cx("icon")} />
                  Remove
                </button>
              </div>
            </div>

            <div className={cx("form-section")}>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cx("form-input")}
                  />
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
                      <option value="Vietnamese">English</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                    <ChevronDown size={16} className={cx("select-icon")} />
                  </div>
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
                        placeholder="MM/DD/YYYY"
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
                      value={address ?? user.address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={cx("form-select")}
                    />
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
                <button className={cx("cancel-btn")}>Cancel</button>
                <button className={cx("delete-btn")}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AccountDetails;
