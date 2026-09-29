/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  // Thêm các VITE_ env vars khác ở đây nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
