import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames/bind";
import styles from "./main.module.scss";
import Buttons from "../../components/Buttons/Buttons";
import axios from "~/utils/axiosConfig";
import images from "~/assets/images";
import DeviceStatistics from "~/components/DeviceStatistics/deviceStatistics";
import notify from "~/utils/toastify";

const cx = classNames.bind(styles);

const NodeControl = () => {
  const [data, setData] = useState(null);
  const [activeButtons, setActiveButtons] = useState({});
  const [relays, setRelays] = useState([]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isCheked, setIsChecked] = useState(false);
  const autoIntervalRef = useRef(null);
  const currentRelayIndex = useRef(0);

  const toggleRelay = async (id) => {
    try {
      // Tìm relay hiện tại trong danh sách relays
      const currentRelay = relays.find((relay) => relay.id === id);
      const currentStatus = currentRelay.status;
      const newStatus = currentStatus === "ON" ? "OFF" : "ON";

      // cập nhật trạng thái relay qua api
      const response = await axios.put(`/node_control/${id}`, {
        // status: "OFF", // Luôn gửi trạng thái OFF khi toggle
        status: newStatus, // Cập nhật trạng thái mới
      });
      setRelays((prev) => prev.map((relay) => (relay.id === id ? {...relay, status: response.data.status} : relay)));
      await axios.post("/node_actions", {
        device_id: id,
        command: newStatus,
        status: "completed", // Có thể thay bằng "pending" nếu cần xử lý thêm
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật relay:", error);
    }
  };

  const startAutoMode = () => {
    notify.success("Start Auto Mode");
    if (!isAutoRunning) {
      // Đảm bảo tất cả relay đã tắt trước khi chạy auto
      relays.forEach(async (relay) => {
        if (relay.status === "ON") {
          await toggleRelay(relay.id);
        }
      });

      setIsAutoRunning(true);
      currentRelayIndex.current = 0;
      autoIntervalRef.current = setInterval(async () => {
        if (currentRelayIndex.current < relays.length) {
          const relay = relays[currentRelayIndex.current];
          if (relay.status === "OFF") {
            await toggleRelay(relay.id);
          }
          currentRelayIndex.current++;
        }
      }, 2000); // 2 giây
    }
  };

  // Hàm dừng chế độ "Stop Auto"
  const stopAutoMode = () => {
    notify.error("Stop Auto Mode");
    clearInterval(autoIntervalRef.current);
    autoIntervalRef.current = null;
    setIsAutoRunning(false);
    currentRelayIndex.current = 0;

    // Tắt tất cả relay
    relays.forEach(async (relay) => {
      if (relay.status === "ON") {
        await toggleRelay(relay.id);
      }
    });
  };

  // Hàm xử lý khi toggle switch
  const handleAutoToggle = () => {
    if (isAutoRunning) {
      stopAutoMode();
    } else {
      startAutoMode();
    }
  };

  // Lấy dữ liệu relay từ server
  // Trong component NodeControl
  useEffect(() => {
    const fetchRelays = async () => {
      try {
        const response = await axios.get("/node_control");

        // Reset tất cả relay về trạng thái OFF khi load trang
        await Promise.all(
          response.data.data.map(async (relay) => {
            if (relay.status === "ON") {
              await axios.put(`/node_control/${relay.id}`, {status: "OFF"});
            }
          })
        );

        // Fetch lại dữ liệu sau khi reset
        const updatedResponse = await axios.get("/node_control");
        setRelays(updatedResponse.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách relay:", error);
      }
    };

    fetchRelays();

    // Cleanup khi component unmount
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
      // Tắt tất cả relay khi rời trang
      relays.forEach(async (relay) => {
        if (relay.status === "ON") {
          await axios.put(`/node_control/${relay.id}`, {status: "OFF"});
        }
      });
    };
  }, []);

  return (
    <div className={cx("container", "poppins-regular")}>
      <header className={cx("header")}>
        <a className={cx("logo")} href="/">
          <img src={images.logo} alt="" />
        </a>
        <h1 className={cx("title")}>SPRAY DRYER CONTROL SYSTEM</h1>
      </header>
      <main className={cx("main")}>
        <div className={cx("buttons")}>
          <h2 className={cx("title")}>Operating parameters</h2>
          <div className={cx("btn")}>
            <div className={cx("controls_header")}>
              <div className={cx("btn-switch")}>
                <label for="filter" className={cx("switch")} aria-label="Toggle Filter">
                  <input type="checkbox" id="filter" checked={isAutoRunning} onChange={handleAutoToggle} />
                  <span>Stop Auto</span>
                  <span>Run Auto</span>
                </label>
              </div>
            </div>
            <div className={cx("controler")}>
              {relays ? (
                relays.map((relay) => (
                  <Buttons
                    key={relay.id}
                    data={data}
                    relay={relay}
                    value={relay.name}
                    toggleRelay={() => toggleRelay(relay.id)}
                    disabled={isAutoRunning && !activeButtons[3]}
                  />
                ))
              ) : (
                <p>Đang tải dữ liệu...</p>
              )}
            </div>
          </div>
        </div>
        <div className={cx("content")}>
          <DeviceStatistics />
        </div>
      </main>
    </div>
  );
};

export default NodeControl;
