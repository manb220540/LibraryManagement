# Library Management Frontend

[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Đây là phần giao diện người dùng (frontend) của hệ thống quản lý mượn sách, được xây dựng với Vue.js. Frontend này cung cấp trải nghiệm tương tác trực quan cho cả độc giả và nhân viên, cho phép họ truy cập và quản lý các chức năng của hệ thống thông qua các API do backend cung cấp.

## 1. Giới thiệu

Library Management Frontend là giao diện chính mà người dùng tương tác với hệ thống quản lý mượn sách. Được xây dựng dựa trên Vue.js, nó mang lại một ứng dụng đơn trang (SPA) mượt mà, nhanh chóng và phản hồi, đảm bảo trải nghiệm tốt trên mọi thiết bị.

**Các công nghệ chính được sử dụng:**

* **Vue.js:** Framework JavaScript lũy tiến, dùng để xây dựng toàn bộ giao diện người dùng tương tác.
* **Vue Router:** Thư viện định tuyến chính thức cho Vue.js, quản lý các tuyến đường và điều hướng trong ứng dụng SPA.
* **Vuex:** Thư viện quản lý trạng thái tập trung cho ứng dụng Vue.js, giúp quản lý dữ liệu hiệu quả trên toàn bộ ứng dụng.
* **Axios:** Client HTTP dựa trên Promise, dùng để gửi các yêu cầu API đến backend.
* **Bootstrap:** Framework CSS phổ biến, giúp thiết kế giao diện đáp ứng (responsive design) và đảm bảo tính thẩm mỹ, nhất quán.
* **Font Awesome:** Thư viện biểu tượng vector phổ biến, tích hợp để hiển thị các icon trên giao diện.
* **Chart.js & Vue-Chartjs:** Thư viện JavaScript để vẽ biểu đồ và component Vue bọc Chart.js, có thể dùng cho các biểu đồ thống kê trong phần quản lý của nhân viên.
* **Socket.IO Client:** Thư viện client của Socket.IO, cho phép giao tiếp thời gian thực với backend (có thể dùng cho thông báo hoặc các cập nhật tức thì).
* **Vite:** Công cụ xây dựng thế hệ mới, nhanh chóng cho dự án frontend, cung cấp trải nghiệm phát triển tuyệt vời.
* **Vite Plugin Vue Devtools:** Plugin Vite để tích hợp công cụ phát triển Vue Devtools, hỗ trợ gỡ lỗi và kiểm tra ứng dụng Vue.

## 2. Yêu cầu hệ thống

Trước khi khởi tạo và chạy dự án, hãy đảm bảo bạn đã cài đặt các công cụ sau:

* **Node.js** (Phiên bản khuyến nghị: LTS - 18.x trở lên)
* **npm** hoặc **Yarn** (Thường đi kèm với Node.js)

## 3. Khởi tạo dự án

Thực hiện các bước sau để thiết lập dự án frontend:

1.  **Clone repository:**
    ```bash
    git clone <URL_TO_YOUR_REPOSITORY>
    cd frontend
    ```
    *(Thay `<URL_TO_YOUR_REPOSITORY>` bằng URL repository của bạn)*

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    # hoặc nếu bạn sử dụng yarn:
    # yarn install
    ```
    Lệnh này sẽ cài đặt tất cả các thư viện được liệt kê trong `dependencies` và `devDependencies` của file `package.json`.

3.  **Cấu hình kết nối Backend:**
    Bạn có thể cần cấu hình URL của API backend trong dự án frontend (ví dụ: trong một file `.env` hoặc file cấu hình JavaScript). Đảm bảo frontend biết cách kết nối tới server backend của bạn (ví dụ: `http://localhost:3000`).

    *Ví dụ cho file `.env` (tùy thuộc cách bạn cấu hình trong dự án Vue/Vite):*
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```
    *(Thay đổi cổng nếu backend của bạn chạy ở cổng khác.)*

## 4. Chạy dự án

Dự án frontend có thể được chạy ở các chế độ sau:

1.  **Chạy ở chế độ phát triển (Development Mode):**
    Sử dụng Vite để khởi động server phát triển cục bộ, với tính năng hot-reloading giúp tự động cập nhật trình duyệt khi có thay đổi trong mã nguồn.
    ```bash
    npm run dev
    # hoặc
    # yarn dev
    ```
    Ứng dụng sẽ khởi động và thường có thể truy cập tại `http://localhost:5173` (hoặc một cổng khác tùy theo cấu hình của Vite).

2.  **Xây dựng dự án cho môi trường sản phẩm (Build for Production):**
    Tạo ra các tệp tĩnh tối ưu hóa (HTML, CSS, JavaScript) sẵn sàng để triển khai lên server hosting.
    ```bash
    npm run build
    # hoặc
    # yarn build
    ```
    Các tệp đã xây dựng sẽ nằm trong thư mục `dist/`.

3.  **Xem trước bản dựng sản phẩm (Preview Production Build):**
    Chạy một server cục bộ nhỏ để xem trước bản dựng đã tối ưu hóa.
    ```bash
    npm run preview
    # hoặc
    # yarn preview
    ```
    Điều này giúp kiểm tra xem ứng dụng hoạt động như thế nào sau khi được tối ưu hóa cho môi trường sản phẩm.

Sau khi khởi chạy ở chế độ phát triển, bạn có thể truy cập ứng dụng frontend qua trình duyệt web của mình. Hãy đảm bảo rằng backend của bạn cũng đang chạy để frontend có thể gửi và nhận dữ liệu.
