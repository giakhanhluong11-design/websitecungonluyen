# Hướng dẫn cấu hình Firebase Firestore Rules

Chào bạn, lỗi `FirebaseError: Missing or insufficient permissions` mà bạn gặp phải trên giao diện hiển thị bảng điều khiển Console là do **Cơ sở dữ liệu Firestore (Firebase)** của dự án đang bị khóa quyền truy cập (thường là do quy tắc mặc định hoặc test mode đã hết hạn) vào các collection như `users` và `connect_posts`.

Vì chúng ta đang thêm tính năng cho phép đọc hồ sơ người dùng khác (để theo dõi/chặn) và lưu/đọc bài viết kết nối (`connect_posts`), bạn cần cập nhật Security Rules của Firestore trên Firebase Console.

### Cách khắc phục:
1. Truy cập vào trang quản trị [Firebase Console](https://console.firebase.google.com/).
2. Chọn dự án của bạn (ví dụ: `nckh9a3`).
3. Ở menu bên trái, chọn **Firestore Database** (hoặc Build > Firestore Database).
4. Chuyển sang tab **Rules** (Quy tắc).
5. Copy đoạn mã dưới đây và dán thay thế toàn bộ nội dung trong đó:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. Cho phép đọc/ghi đối với các bài viết kết nối
    match /connect_posts/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // 2. Cho phép đọc/ghi đối với các bài viết cộng đồng chung
    match /community_posts/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // 3. Cho phép đọc thông tin profile và cập nhật (Followers/Following)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      // Khóa sub-collection bảo mật (tiến độ học tập)
      match /practiceAttempts/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /examAttempts/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /minigameResults/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    match /mental_health_logs/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**(Lưu ý: Nếu bạn đang sử dụng tài khoản Admin cục bộ `tester@gmail.com` thì tính năng Firebase sẽ bị `request.auth == null` từ chối, do tài khoản test này không phải đăng nhập thực. Bạn vui lòng sử dụng tài khoản đăng nhập Firebase thật để test nhé, hoặc sửa `if request.auth != null;` thành `if true;` cho mục đích tạm thời trong lúc test).**

6. Bấm nút **Publish (Xuất bản)** để lưu quy tắc.
7. Tải lại trang web (F5) và các tính năng Cộng đồng sẽ hoạt động bình thường!
