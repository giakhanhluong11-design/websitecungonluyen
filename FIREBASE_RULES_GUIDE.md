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

    // 4. Tài liệu đề thi: ai cũng xem được, chỉ admin tạo/xoá,
    //    người dùng đăng nhập chỉ được tăng lượt tải (downloadsCount)
    match /exam_documents/{docId} {
      allow read: if true;
      allow create, delete: if request.auth != null
        && request.auth.token.email in ['tester@gmail.com'];
      allow update: if request.auth != null
        && (request.auth.token.email in ['tester@gmail.com']
            || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['downloadsCount']));
    }
  }
}
```

**(Lưu ý: Tài khoản Admin `tester@gmail.com` hiện đã đăng nhập bằng Firebase Auth thật — lần đăng nhập đầu tiên sẽ tự tạo tài khoản trên Firebase. Cần bật Email/Password trong Authentication > Sign-in method.)** để lưu quy tắc.
7. Tải lại trang web (F5) và các tính năng Cộng đồng sẽ hoạt động bình thường!

---

# Cấu hình Firebase Storage Rules (Upload tài liệu đề thi)

Lỗi `storage/unauthorized` (403) khi admin upload file là do Storage Rules chưa cho phép ghi.

1. Firebase Console > **Storage** > tab **Rules**.
2. Dán toàn bộ nội dung file [`storage.rules`](./storage.rules) vào và bấm **Publish**.
3. Trên website: **Đăng xuất** rồi **đăng nhập lại** `tester@gmail.com` để có phiên Firebase thật, sau đó thử upload lại.
