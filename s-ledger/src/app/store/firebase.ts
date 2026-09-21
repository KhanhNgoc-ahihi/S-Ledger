import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Cấu hình Firebase (Sử dụng project demo/mặc định hoặc cấu hình của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForS-LedgerMVP12345",
  authDomain: "s-ledger-mvp.firebaseapp.com",
  projectId: "s-ledger-mvp",
  storageBucket: "s-ledger-mvp.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

// Khởi tạo Firebase tránh bị lỗi gọi trùng lặp
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);