# LUẬT PHÁT TRIỂN HỆ THỐNG (BẮT BUỘC)

1. TẤT CẢ NÚT LỆNH PHẢI CÓ CHỨC NĂNG THỰC TẾ:
- Không tạo nút trang trí, nút giả, nút bấm không phản hồi.
- Mọi nút bấm đều phải có hành động cụ thể (mở modal, điều hướng, lưu trữ, submit, filter,...).

2. KHÔNG TỰ TẠO DỮ LIỆU ẢO (NO MOCK/FAKE USER DATA):
- Mọi số liệu hiển thị (điểm số, tiến độ, thời gian, hoạt động gần đây, biểu đồ học tập) đều phải trích xuất từ dữ liệu người dùng thật (`progress`, `userStorage`, kết quả bài thi thực tế).
- Khi người dùng chưa có dữ liệu, hiển thị giao diện trạng thái trống (Empty State) trung thực kèm nút dẫn tới làm bài tập/ôn luyện để tạo dữ liệu thật. Tuyệt đối không sinh dữ liệu giả định.
