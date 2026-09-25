# QUY TẮC BẮT BUỘC KHI PHÁT TRIỂN DỰ ÁN (LUẬT HỆ THỐNG)

> **CẢNH BÁO QUAN TRỌNG:** Đây là **LUẬT TUYỆT ĐỐI** và phải tuân thủ cho tất cả các lần lập trình, cập nhật hoặc sửa đổi dự án này.

---

### 1. NÚT LỆNH PHẢI CÓ CHỨC NĂNG THỰC TẾ
- **Tất cả các nút lệnh (button, interactive icon, action link)** trên toàn bộ website đều phải có vai trò, hành vi và chức năng rõ ràng.
- **TUYỆT ĐỐI KHÔNG** tạo các nút lệnh chỉ để trang trí, nút rỗng (`onClick={() => {}}`), nút không gán sự kiện hành động, hoặc giao diện "bấm vào không có tác dụng gì".
- Mọi nút bấm nếu kích hoạt phải: chuyển trang/tab, mở modal, kích hoạt bộ lọc, làm bài thi, lưu dữ liệu, điều hướng hoặc tương tác có phản hồi rõ ràng với người dùng.

---

### 2. DỮ LIỆU PHẢI LÀ DỮ LIỆU THẬT CỦA NGƯỜI DÙNG - KHÔNG DỮ LIỆU ẢO
- **TUYỆT ĐỐI KHÔNG** tự tạo (hardcode, mock, random, bịa đặt) dữ liệu hoạt động ảo, điểm số ảo, tiến độ học ảo, thành tích ảo hoặc biểu đồ giả lập.
- **Tất cả số liệu, tiến trình, lịch sử, hoạt động gần đây, điểm số, chuỗi ngày học** hiển thị trên giao diện phải lấy từ dữ liệu thật của người dùng (`progress`, `userStorage`, `allScores`, dữ liệu bài làm thực tế).
- **Trường hợp người dùng mới hoặc chưa có dữ liệu:**
  - Hiển thị **Trạng thái trống (Empty state)** trung thực và tinh tế (ví dụ: *"Bạn chưa làm bài luyện tập nào"*, *"Chưa có dữ liệu học tập tuần này"*).
  - Đi kèm nút kêu gọi hành động (Call To Action - CTA) dẫn người dùng đến làm bài/ôn tập để sinh ra dữ liệu thật.
  - Tuyệt đối không tự điền điểm số giả hoặc hoạt động giả để "cho đẹp giao diện".
