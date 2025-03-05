# Đồ Án Tốt Nghiệp: Hệ Thống IoT Đo Nhiệt Độ Trong Buồng Sấy Công Nghiệp

## Giới thiệu
Hệ thống IoT đo nhiệt độ trong buồng sấy công nghiệp được thiết kế để giám sát và ghi nhận nhiệt độ trong thời gian thực. Hệ thống này sử dụng các cảm biến IoT để thu thập dữ liệu, xử lý và hiển thị trên giao diện người dùng trực tuyến. Đây là một giải pháp giúp nâng cao hiệu quả quản lý và đảm bảo chất lượng sản phẩm trong quá trình sấy công nghiệp.

---

## Cấu trúc dự án
Dự án bao gồm hai phần chính:

### 1. **Backend**
Thư mục `backend` chứa mã nguồn xử lý logic và giao tiếp với cơ sở dữ liệu:
- **Ngôn ngữ:** Node.js
- **Framework:** Express.js
- **Chức năng chính:**
  - Thu thập dữ liệu từ các cảm biến qua giao thức MQTT.
  - Lưu trữ dữ liệu vào cơ sở dữ liệu.
  - Cung cấp API để giao tiếp với frontend.

### 2. **Frontend**
Thư mục `frontend` chứa mã nguồn giao diện người dùng:
- **Ngôn ngữ:** JavaScript
- **Framework:** React.js
- **Chức năng chính:**
  - Hiển thị nhiệt độ theo thời gian thực.
  - Vẽ biểu đồ thống kê nhiệt độ.
  - Quản lý các thông số cấu hình.

---

## Mô tả hệ thống

### **1. Cảm biến và thiết bị**
- Sử dụng cảm biến nhiệt độ (ví dụ: DHT22, DS18B20) để đo nhiệt độ môi trường trong buồng sấy.
- Dữ liệu cảm biến được gửi tới hệ thống qua giao thức MQTT.

### **2. Xử lý Backend**
- Backend nhận dữ liệu từ cảm biến và lưu vào cơ sở dữ liệu (MySQL).
- Cung cấp API RESTful để frontend lấy dữ liệu hiển thị.

### **3. Hiển thị Frontend**
- Giao diện người dùng trực quan với các thành phần:
  - Dashboard hiển thị nhiệt độ hiện tại.
  - Biểu đồ lịch sử nhiệt độ.
  - Cấu hình cảnh báo nhiệt độ bất thường.

---

## Hướng dẫn cài đặt

### **1. Cài đặt Backend**
1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các gói cần thiết:
   ```bash
   npm install
   ```
3. Cấu hình tệp `.env` với thông tin cơ sở dữ liệu và MQTT.
4. Khởi chạy server:
   ```bash
   npm start
   ```

### **2. Cài đặt Frontend**
1. Di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói cần thiết:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm start
   ```
4. Mở trình duyệt và truy cập: `https://iotdevicemanager.id.vn/`

---

## Tính năng chính
- Giám sát nhiệt độ theo thời gian thực.
- Hiển thị dữ liệu nhiệt độ bằng biểu đồ trực quan.
- Cảnh báo khi nhiệt độ vượt ngưỡng an toàn.
- Hỗ trợ cấu hình linh hoạt cho từng buồng sấy.

---

## Thành viên thực hiện
- **Nguyễn Hữu Vanh**  
  _Email:_ nguyenvanh@example.com

---

## Công cụ và công nghệ sử dụng
- **Ngôn ngữ lập trình:** Node.js, JavaScript.
- **Framework:** Express.js, React.js.
- **Giao thức truyền dữ liệu:** MQTT, RESTful API.
- **Cơ sở dữ liệu:** MySQL.

---

## Liên hệ
Mọi ý kiến đóng góp hoặc thắc mắc vui lòng liên hệ qua email: vietbui673@gmial.com
