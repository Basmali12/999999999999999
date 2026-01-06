// config.js
// === إعدادات المتجر (قم بتعديل البيانات هنا لكل زبون) ===

window.MY_STORE_CONFIG = {
    // 1. ضع كود فيربايس هنا (نسخ ولصق من موقع فيربايس)
    firebase: {
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwzzJqPNa08mPBZNMuvExxCJzkToV65rE",
  authDomain: "project-4623091190980149681.firebaseapp.com",
  databaseURL: "https://project-4623091190980149681-default-rtdb.firebaseio.com",
  projectId: "project-4623091190980149681",
  storageBucket: "project-4623091190980149681.firebasestorage.app",
  messagingSenderId: "252053182084",
  appId: "1:252053182084:web:b35a5e3c7d6777e79a94d1",
  measurementId: "G-H7JJBWJGQR"
};
    },

    // 2. ضع إعدادات الصور (Cloudinary) هنا
    cloudinary: {
        cloudName: "",  // اسم الكلاود
        uploadPreset: "" // اسم البريسيت (تأكد من إنشائه في حساب الزبون)
    },

    // 3. رمز دخول الأدمن
    security: {
        adminCode: "10001"
    }
};
